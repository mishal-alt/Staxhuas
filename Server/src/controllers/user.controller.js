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

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (email !== undefined) updateData.email = email;
  if (phone !== undefined) updateData.phone = phone;
  if (location !== undefined) updateData.location = location;
  if (headline !== undefined) updateData.headline = headline;
  if (socialLinks !== undefined) updateData.socialLinks = socialLinks;

  let user = await User.findById(req.user.id);
  if (!user) return apiResponse(res, 404, 'User not found');

  // Apply updates
  Object.assign(user, updateData);

  // If socialLinks are changing, run sync synchronously
  if (socialLinks) {
    await performSync(user);
  }

  await user.save();

  const responseUser = await User.findById(user._id).select('-password');
  return apiResponse(res, 200, 'Profile updated successfully', responseUser);
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

const extractUsername = (val) => {
  if (!val) return '';
  let clean = val.trim().replace(/\/+$/, '');
  if (clean.includes('/')) {
    const parts = clean.split('/');
    return parts[parts.length - 1] || '';
  }
  return clean;
};

// ── Helper to sync social statistics from GitHub & LeetCode APIs ──
export const performSync = async (user) => {
  const githubUsername = extractUsername(user.socialLinks?.github);
  const leetcodeUsername = extractUsername(user.socialLinks?.leetcode);
  const linkedinUsername = extractUsername(user.socialLinks?.linkedin);

  // Write back sanitized clean usernames to document
  if (user.socialLinks) {
    if (user.socialLinks.github) user.socialLinks.github = githubUsername;
    if (user.socialLinks.leetcode) user.socialLinks.leetcode = leetcodeUsername;
    if (user.socialLinks.linkedin) user.socialLinks.linkedin = linkedinUsername;
  }

  let githubUpdated = false;
  let leetcodeUpdated = false;

  // 1. Fetch GitHub contributions if username is set
  if (githubUsername) {
    try {
      const response = await fetch(`https://github-contributions-api.jogruber.de/v4/${githubUsername}`);
      if (response.ok) {
        const data = await response.json();
        user.githubStats = {
          totalContributions: Object.values(data.total || {}).reduce((a, b) => a + b, 0),
          contributions: (data.contributions || []).map(c => ({
            date: c.date,
            count: c.count,
            level: c.level
          })),
          lastSynced: new Date()
        };
        githubUpdated = true;
      } else {
        console.warn(`GitHub API returned status ${response.status} for user ${githubUsername}`);
      }
    } catch (err) {
      console.error('Error in performSync GitHub:', err.message);
    }
  }

  // 2. Fetch LeetCode stats if username is set
  if (leetcodeUsername) {
    try {
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `;
      const response = await fetch('https://leetcode.com/graphql/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
        body: JSON.stringify({ query, variables: { username: leetcodeUsername } })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.data?.matchedUser) {
          const stats = result.data.matchedUser.submitStatsGlobal.acSubmissionNum;
          user.leetcodeStats = {
            solved: stats.find(s => s.difficulty === 'All')?.count || 0,
            easy: stats.find(s => s.difficulty === 'Easy')?.count || 0,
            medium: stats.find(s => s.difficulty === 'Medium')?.count || 0,
            hard: stats.find(s => s.difficulty === 'Hard')?.count || 0,
            lastSynced: new Date()
          };
          leetcodeUpdated = true;
        } else if (result.errors) {
          console.warn(`LeetCode GraphQL errors for user ${leetcodeUsername}:`, JSON.stringify(result.errors));
        }
      } else {
        console.warn(`LeetCode GraphQL returned status ${response.status} for user ${leetcodeUsername}`);
      }
    } catch (err) {
      console.error('Error in performSync LeetCode:', err.message);
    }
  }

  return githubUpdated || leetcodeUpdated;
};

// ── Sync statistics endpoint handler ──
export const syncSocialStats = asyncHandler(async (req, res) => {
  const userId = req.params.id === 'me' ? req.user.id : req.params.id;
  const user = await User.findById(userId);
  if (!user) return apiResponse(res, 404, 'User not found');

  await performSync(user);
  await user.save();

  const responseUser = await User.findById(user._id).select('-password');
  return apiResponse(res, 200, 'Social stats synced successfully', responseUser);
});

