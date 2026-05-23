import mongoose from 'mongoose';
import ScrumCall from '../models/ScrumCall.js';
import ScrumCallEntry from '../models/ScrumCallEntry.js';
import Batch from '../models/Batch.js';
import Attendance from '../models/Attendance.js';
import { ApiError } from '../utils/apiError.js';
import { ROLES, ATTENDANCE_STATUS } from '../utils/constants.js';
import { logAction } from './audit.service.js';

export const logScrumCall = async (facilitator, data) => {
  const { batch: batchId, date, agenda, status, startTime, entries } = data;

  const batch = await Batch.findById(batchId);
  if (!batch) throw new ApiError(404, 'Batch not found');

  if (facilitator.role === ROLES.FACILITATOR && batch.facilitator.toString() !== facilitator._id.toString()) {
    throw new ApiError(403, 'Not authorized to log scrum calls for this batch');
  }

  // Normalize date to start of day
  const scrumDate = new Date(date);
  scrumDate.setUTCHours(0, 0, 0, 0);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let scrumCall = await ScrumCall.findOne({ batch: batchId, date: scrumDate }).session(session);

    if (scrumCall) {
      // If it exists, update it
      scrumCall.agenda = agenda;
      scrumCall.status = status || 'Completed';
      scrumCall.startTime = startTime || scrumCall.startTime;
      scrumCall.conductedBy = facilitator._id;
      await scrumCall.save({ session });

      // Delete old entries for this scrum call
      await ScrumCallEntry.deleteMany({ scrumCall: scrumCall._id }).session(session);
    } else {
      // Create new one
      scrumCall = new ScrumCall({
        batch: batchId,
        date: scrumDate,
        agenda,
        status: status || 'Completed',
        startTime,
        conductedBy: facilitator._id,
      });
      await scrumCall.save({ session });
    }

    const entryDocs = entries.map((entry) => ({
      scrumCall: scrumCall._id,
      student: entry.student,
      isPresent: entry.isPresent,
      progressUpdate: entry.progressUpdate,
      blockers: entry.blockers,
      actionItems: entry.actionItems,
    }));

    await ScrumCallEntry.insertMany(entryDocs, { session });

    // Business Rule: Update attendance ONLY when completed
    if (status === 'Completed') {
      const attendanceOperations = [];

      // Find existing attendance records for these students on this day
      const studentIds = entries.map(e => e.student);
      const existingAttendance = await Attendance.find({
        student: { $in: studentIds },
        date: scrumDate
      }).session(session);

      const attendanceMap = {};
      existingAttendance.forEach(a => { attendanceMap[a.student.toString()] = a.status; });

      for (const entry of entries) {
        if (!entry.isPresent) {
          // Only mark absent if they are not already on an approved leave
          if (attendanceMap[entry.student.toString()] !== ATTENDANCE_STATUS.LEAVE) {
            attendanceOperations.push({
              updateOne: {
                filter: { student: entry.student, date: scrumDate },
                update: {
                  $set: {
                    student: entry.student,
                    batch: batchId,
                    date: scrumDate,
                    status: ATTENDANCE_STATUS.ABSENT,
                    markedBy: facilitator._id,
                  },
                },
                upsert: true,
              },
            });
          }
        } else {
          // If present, mark them present
          attendanceOperations.push({
            updateOne: {
              filter: { student: entry.student, date: scrumDate },
              update: {
                $set: {
                  student: entry.student,
                  batch: batchId,
                  date: scrumDate,
                  status: ATTENDANCE_STATUS.PRESENT,
                  markedBy: facilitator._id,
                },
              },
              upsert: true,
            },
          });
        }
      }

      if (attendanceOperations.length > 0) {
        await Attendance.bulkWrite(attendanceOperations, { session });
      }
    }

    await logAction(
      {
        action: 'SCRUM_CALL_LOGGED',
        performedBy: facilitator._id,
        entityType: 'ScrumCall',
        entityId: scrumCall._id,
        details: { batchId, date: scrumDate, agenda, status },
      },
      session
    );

    await session.commitTransaction();
    session.endSession();

    return scrumCall;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

export const getScrumCallsByBatch = async (user, batchId) => {
  const batch = await Batch.findById(batchId);
  if (!batch) throw new ApiError(404, 'Batch not found');

  if (user.role === ROLES.FACILITATOR && batch.facilitator.toString() !== user._id.toString()) {
    throw new ApiError(403, 'Not authorized to view scrum calls for this batch');
  }

  const scrums = await ScrumCall.find({ batch: batchId }).sort('-date');

  // We attach entries to each scrum
  const results = [];
  for (const scrum of scrums) {
    const entries = await ScrumCallEntry.find({ scrumCall: scrum._id }).populate('student', 'name email');
    results.push({ ...scrum.toObject(), entries });
  }

  return results;
};
