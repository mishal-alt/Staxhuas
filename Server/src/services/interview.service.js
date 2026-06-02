import Interview from '../models/Interview.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import * as googleService from './google.service.js';

/**
 * Generates a real Google Meet link using the Google Calendar API.
 * Falls back to a mock link if Google is not connected or credentials fail.
 */
const generateMeetingLink = async (facilitatorId, interviewData) => {
  try {
    const student = await User.findById(interviewData.student);
    if (!student) throw new Error('Student not found');

    const meetLink = await googleService.createMeetLink(facilitatorId, {
      scheduledDate: interviewData.scheduledDate,
      scheduledTime: interviewData.scheduledTime,
      module: interviewData.module,
      studentName: student.name,
      studentEmail: student.email
    });

    return meetLink;
  } catch (error) {
    console.error('Google Meet Generation Error:', error.message);
    // Fallback to mock link if Google fails
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    const p1 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const p2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const p3 = Array.from({ length: 3 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `https://meet.google.com/${p1}-${p2}-${p3}`;
  }
};

/**
 * Create a new interview schedule.
 */
export const createInterview = async (interviewData) => {
  // Check for existing active interview for this module and student
  const existing = await Interview.findOne({
    student: interviewData.student,
    module: interviewData.module,
    status: { $in: ['scheduled', 'in_progress'] }
  });

  if (existing) {
    throw new Error('An active interview is already scheduled for this module.');
  }

  if (interviewData.generateMeetLink && interviewData.mode === 'online') {
    interviewData.meetingLink = await generateMeetingLink(interviewData.facilitator, interviewData);
  }

  const interview = new Interview(interviewData);
  return await interview.save();
};

/**
 * Get interviews based on filters (e.g., batchId, status).
 */
export const getInterviews = async (filters = {}) => {
  const query = {};

  if (filters.batch) query.batch = filters.batch;
  if (filters.student) query.student = filters.student;
  if (filters.interviewer) query.interviewer = filters.interviewer;
  if (filters.facilitator) query.facilitator = filters.facilitator;
  if (filters.status && filters.status !== 'All') query.status = filters.status;

  if (filters.search) {
    // We would need to join or lookup to search by student name.
    // For simplicity in the service if just returning basic docs, we can let controller or frontend handle deep search
    // Or we populate here. Let's populate.
  }

  return await Interview.find(query)
    .populate('student', 'name email avatar')
    .populate('interviewer', 'name email avatar')
    .populate('facilitator', 'name email')
    .populate('batch', 'name')
    .sort({ scheduledDate: 1, scheduledTime: 1 });
};

/**
 * Get a single interview by ID.
 */
export const getInterviewById = async (id) => {
  const interview = await Interview.findById(id)
    .populate('student', 'name email avatar')
    .populate('interviewer', 'name email avatar')
    .populate('facilitator', 'name email');

  if (!interview) throw new Error('Interview not found.');
  return interview;
};

/**
 * Update general interview details (schedule, interviewer assignment).
 */
export const updateInterview = async (id, updateData) => {
  const interview = await Interview.findById(id);
  if (!interview) throw new Error('Interview not found.');

  // Prevent changing score/status through basic update
  delete updateData.score;
  delete updateData.percentage;
  delete updateData.status;

  if (updateData.generateMeetLink && updateData.mode === 'online') {
    updateData.meetingLink = await generateMeetingLink(interview.facilitator, { ...interview.toObject(), ...updateData });
  }

  Object.assign(interview, updateData);
  return await interview.save();
};

/**
 * Record interview score and evaluation, automatically calculating percentage and status.
 */
export const recordScore = async (id, { reviewScore, taskScore, attendanceScore, disciplineScore, facilitatorEvaluation, interviewerFeedback, remarks, isPass, reInterviewAttempt, maxReInterviewLimit }) => {
  const interview = await Interview.findById(id);
  if (!interview) throw new Error('Interview not found.');

  // Allow editing even if already evaluated
  /*
  if (interview.status === 'completed' || interview.status === 'passed' || interview.status === 'failed') {
    throw new Error('Interview has already been evaluated.');
  }
  */

  const rScore = Number(reviewScore) || 0;
  const tScore = Number(taskScore) || 0;
  const aScore = Number(attendanceScore) || 0;
  const dScore = Number(disciplineScore) || 0;

  const totalScore = rScore + tScore + aScore + dScore;
  const actualMaxScore = 40;
  const percentage = (totalScore / actualMaxScore) * 100;

  interview.reviewScore = rScore;
  interview.taskScore = tScore;
  interview.attendanceScore = aScore;
  interview.disciplineScore = dScore;
  interview.score = totalScore;
  interview.maxScore = actualMaxScore;
  interview.percentage = percentage;
  if (facilitatorEvaluation !== undefined) interview.facilitatorEvaluation = facilitatorEvaluation;
  if (interviewerFeedback !== undefined) interview.interviewerFeedback = interviewerFeedback;
  if (remarks !== undefined) interview.remarks = remarks;
  interview.completedAt = new Date();

  if (reInterviewAttempt !== undefined) interview.reInterviewAttempt = Number(reInterviewAttempt);
  if (maxReInterviewLimit !== undefined) interview.maxReInterviewLimit = Number(maxReInterviewLimit);

  if (isPass) {
    interview.status = 'passed';
  } else {
    // Handle failure and re-interview limits
    if (interview.reInterviewAttempt < interview.maxReInterviewLimit) {
      interview.status = 're_interview_required';
    } else {
      interview.status = 'failed';
    }
  }

  return await interview.save();
};

/**
 * Create a re-interview for a failed/re-interview required student.
 */
export const createReInterview = async (previousInterviewId, newScheduleData) => {
  const prevInterview = await Interview.findById(previousInterviewId);
  if (!prevInterview) throw new Error('Previous interview not found.');

  if (prevInterview.status !== 're_interview_required' && prevInterview.status !== 'failed') {
    throw new Error('Only failed or re-interview required interviews can be re-scheduled.');
  }

  if (prevInterview.reInterviewAttempt >= prevInterview.maxReInterviewLimit) {
    throw new Error('Maximum re-interview attempts reached for this module.');
  }

  if (newScheduleData.generateMeetLink && newScheduleData.mode === 'online') {
    newScheduleData.meetingLink = await generateMeetingLink(newScheduleData.facilitator || prevInterview.facilitator, {
      student: prevInterview.student,
      module: prevInterview.module,
      scheduledDate: newScheduleData.scheduledDate,
      scheduledTime: newScheduleData.scheduledTime
    });
  }

  const newInterview = new Interview({
    student: prevInterview.student,
    batch: prevInterview.batch,
    course: prevInterview.course,
    module: prevInterview.module,
    facilitator: newScheduleData.facilitator || prevInterview.facilitator,
    interviewer: newScheduleData.interviewer,
    scheduledDate: newScheduleData.scheduledDate,
    scheduledTime: newScheduleData.scheduledTime,
    mode: newScheduleData.mode,
    meetingLink: newScheduleData.meetingLink,
    reInterviewAttempt: prevInterview.reInterviewAttempt + 1,
    maxReInterviewLimit: prevInterview.maxReInterviewLimit,
    createdBy: newScheduleData.createdBy
  });

  return await newInterview.save();
};

/**
 * Delete an interview.
 */
export const deleteInterview = async (id) => {
  const interview = await Interview.findByIdAndDelete(id);
  if (!interview) throw new Error('Interview not found.');
  return interview;
};

/**
 * Get interview statistics for a batch.
 */
export const getInterviewStats = async (batchId) => {
  const stats = await Interview.aggregate([
    { $match: { batch: new mongoose.Types.ObjectId(batchId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  const formattedStats = {
    scheduled: 0,
    in_progress: 0,
    completed: 0,
    passed: 0,
    failed: 0,
    re_interview_required: 0,
  };

  stats.forEach(stat => {
    formattedStats[stat._id] = stat.count;
  });

  return formattedStats;
};
