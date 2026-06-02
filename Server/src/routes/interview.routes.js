import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import * as interviewController from '../controllers/interview.controller.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(restrictTo('admin', 'facilitator'), interviewController.createInterview)
  .get(restrictTo('admin', 'facilitator', 'interviewer'), interviewController.getInterviews);

router.route('/stats/:batchId')
  .get(restrictTo('admin', 'facilitator'), interviewController.getInterviewStats);

router.route('/:id')
  .get(restrictTo('admin', 'facilitator', 'interviewer'), interviewController.getInterviewById)
  .patch(restrictTo('admin', 'facilitator'), interviewController.updateInterview)
  .delete(restrictTo('admin', 'facilitator'), interviewController.deleteInterview);

router.post('/:id/score', restrictTo('admin', 'facilitator', 'interviewer'), interviewController.recordScore);
router.post('/:id/re-interview', restrictTo('admin', 'facilitator'), interviewController.createReInterview);

export default router;

