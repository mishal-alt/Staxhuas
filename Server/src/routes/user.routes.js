import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import { ROLES } from '../utils/constants.js';
import { upload, uploadDocument } from '../middleware/upload.middleware.js';

const router = express.Router();

router.use(protect);

// ── Self (logged-in user) ──
router.get('/me', (req, res) => userController.getUserById({ params: { id: req.user.id } }, res));
router.patch('/me', userController.updateMe);
router.post('/me/profile-pic', upload.single('profilePic'), userController.uploadProfilePic);
router.post('/:id/sync-stats', userController.syncSocialStats);

// ── Student Documents (Resume & Documents) ──
router.get('/me/documents', userController.getMyDocuments);
router.post('/me/documents', uploadDocument.single('file'), userController.uploadStudentDocument);
router.delete('/me/documents/:docId', userController.deleteStudentDocument);

// Legacy upload endpoint
router.post('/upload', upload.single('profilePic'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: 'Please upload a file' });
  }
  return res.status(200).json({ 
    status: 'success', 
    message: 'File uploaded successfully', 
    data: { url: req.file.path } 
  });
});

// ── Admin / Facilitator management ──
router.get('/', restrictTo(ROLES.ADMIN, ROLES.FACILITATOR), userController.getUsersByRole);
router.get('/:id', restrictTo(ROLES.ADMIN, ROLES.FACILITATOR), userController.getUserById);
router.patch('/:id', restrictTo(ROLES.ADMIN, ROLES.FACILITATOR), userController.updateUser);
router.delete('/:id', restrictTo(ROLES.ADMIN), userController.deleteUser);

export default router;
