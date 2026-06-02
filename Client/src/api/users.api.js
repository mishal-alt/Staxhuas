import api from './axios';

export const getFacilitators = async () => {
  return await api.get('/users?role=facilitator');
};

export const getInterviewers = async () => {
  return await api.get('/users?role=interviewer');
};

export const getUserById = async (id) => {
  return await api.get(`/users/${id}`);
};

export const updateUser = async (id, data) => {
  return await api.patch(`/users/${id}`, data);
};

export const deleteUser = async (id) => {
  return await api.delete(`/users/${id}`);
};

export const updateMe = async (data) => {
  return await api.patch('/users/me', data);
};

export const uploadProfilePic = async (formData) => {
  return await api.post('/users/me/profile-pic', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const uploadFile = async (formData) => {
  return await api.post('/users/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// ── Student Documents API ──

/** Fetch all uploaded documents (resume + documents) for the current student */
export const getMyDocuments = async () => {
  return await api.get('/users/me/documents');
};

/**
 * Upload a resume or document to Cloudinary via the backend
 * @param {File} file - The file to upload
 * @param {'resume'|'document'} docType - Type of document
 * @param {string} fileName - Display name for the file
 * @param {function} onProgress - Optional upload progress callback (0-100)
 */
export const uploadStudentDocument = async (file, docType, fileName, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('docType', docType);
  formData.append('fileName', fileName || file.name);

  return await api.post('/users/me/documents', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const pct = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(pct);
      }
    },
  });
};

/** Delete a document by its MongoDB _id */
export const deleteMyDocument = async (docId) => {
  return await api.delete(`/users/me/documents/${docId}`);
};

/** Sync student's GitHub and LeetCode statistics */
export const syncSocialStats = async (userId) => {
  return await api.post(`/users/${userId}/sync-stats`);
};
