import User from '../models/User.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { cloudinary } from '../middleware/upload.middleware.js';

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) return apiResponse(res, 404, 'User not found');
  return apiResponse(res, 200, 'User retrieved successfully', user);
});

export const getUsersByRole = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const filter = role ? { role } : {};
  const users = await User.find(filter).select('name email role');
  return apiResponse(res, 200, 'Users retrieved successfully', users);
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return apiResponse(res, 200, 'User updated successfully', user);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  return apiResponse(res, 200, 'User deleted successfully');
});

export const updateMe = asyncHandler(async (req, res) => {
  const { name, email, phone, location, headline, socialLinks } = req.body;

  const updateData = { name, email, phone, location, headline };
  if (socialLinks) updateData.socialLinks = socialLinks;

  const user = await User.findByIdAndUpdate(
    req.user.id,
    updateData,
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) return apiResponse(res, 404, 'User not found');
  return apiResponse(res, 200, 'Profile updated successfully', user);
});

export const uploadProfilePic = asyncHandler(async (req, res) => {
  if (!req.file) return apiResponse(res, 400, 'Please upload a file');

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profilePic: req.file.path },
    { new: true }
  ).select('-password');

  return apiResponse(res, 200, 'Profile picture uploaded successfully', user);
});

// ── Upload resume or document to Cloudinary, persist in User.documents ──
export const uploadStudentDocument = asyncHandler(async (req, res) => {
  if (!req.file) return apiResponse(res, 400, 'Please upload a file');

  const docType = req.body?.docType || 'document'; // 'resume' | 'document'
  const fileName = req.body?.fileName || req.file.originalname;

  const newDoc = {
    type: docType,
    name: fileName,
    url: req.file.path,
    publicId: req.file.filename,
    uploadedAt: new Date(),
  };

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $push: { documents: newDoc } },
    { new: true }
  ).select('documents');

  return apiResponse(res, 200, 'Document uploaded successfully', user.documents);
});

// ── Fetch all documents for the logged-in student ──
export const getMyDocuments = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('documents');
  if (!user) return apiResponse(res, 404, 'User not found');
  return apiResponse(res, 200, 'Documents retrieved successfully', user.documents || []);
});

// ── Delete a document by _id from User.documents + Cloudinary ──
export const deleteStudentDocument = asyncHandler(async (req, res) => {
  const { docId } = req.params;

  const user = await User.findById(req.user.id).select('documents');
  if (!user) return apiResponse(res, 404, 'User not found');

  const doc = user.documents.id(docId);
  if (!doc) return apiResponse(res, 404, 'Document not found');

  try {
    await cloudinary.uploader.destroy(doc.publicId, { resource_type: 'raw' });
  } catch (err) {
    console.warn('[Cloudinary] Failed to delete file from Cloudinary:', err.message);
  }

  await User.findByIdAndUpdate(req.user.id, { $pull: { documents: { _id: docId } } });
  return apiResponse(res, 200, 'Document deleted successfully');
});
