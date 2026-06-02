import * as interviewService from '../services/interview.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createInterview = asyncHandler(async (req, res) => {
  // Assuming req.user is set by auth middleware
  const interviewData = {
    ...req.body,
    createdBy: req.user._id,
    facilitator: req.user._id // Facilitator creating it
  };
  
  const interview = await interviewService.createInterview(interviewData);
  res.status(201).json({ success: true, data: interview });
});

export const getInterviews = asyncHandler(async (req, res) => {
  const filters = {
    batch: req.query.batch,
    student: req.query.student,
    status: req.query.status,
    search: req.query.search
  };

  // If user is an interviewer, restrict to their assigned interviews
  if (req.user.role === 'interviewer') {
    filters.interviewer = req.user._id;
  }

  const interviews = await interviewService.getInterviews(filters);
  res.status(200).json({ success: true, data: interviews });
});

export const getInterviewById = asyncHandler(async (req, res) => {
  const interview = await interviewService.getInterviewById(req.params.id);
  res.status(200).json({ success: true, data: interview });
});

export const updateInterview = asyncHandler(async (req, res) => {
  const interview = await interviewService.updateInterview(req.params.id, req.body);
  res.status(200).json({ success: true, data: interview });
});

export const recordScore = asyncHandler(async (req, res) => {
  if (req.user.role === 'interviewer') {
    const { interviewerFeedback } = req.body;
    // Find interview and update interviewer feedback
    const interview = await interviewService.getInterviewById(req.params.id);
    interview.interviewerFeedback = interviewerFeedback;
    interview.status = 'completed'; // match the database enum value 'completed'
    await interview.save();
    return res.status(200).json({ success: true, data: interview });
  }

  const { reviewScore, taskScore, attendanceScore, disciplineScore, facilitatorEvaluation, isPass, reInterviewAttempt, maxReInterviewLimit } = req.body;
  const interview = await interviewService.recordScore(req.params.id, {
    reviewScore, taskScore, attendanceScore, disciplineScore, facilitatorEvaluation, isPass, reInterviewAttempt, maxReInterviewLimit
  });
  res.status(200).json({ success: true, data: interview });
});

export const createReInterview = asyncHandler(async (req, res) => {
  const newScheduleData = {
    ...req.body,
    createdBy: req.user._id,
    facilitator: req.user._id
  };
  
  const interview = await interviewService.createReInterview(req.params.id, newScheduleData);
  res.status(201).json({ success: true, data: interview });
});

export const deleteInterview = asyncHandler(async (req, res) => {
  await interviewService.deleteInterview(req.params.id);
  res.status(200).json({ success: true, message: 'Interview deleted successfully.' });
});

export const getInterviewStats = asyncHandler(async (req, res) => {
  const stats = await interviewService.getInterviewStats(req.params.batchId);
  res.status(200).json({ success: true, data: stats });
});
