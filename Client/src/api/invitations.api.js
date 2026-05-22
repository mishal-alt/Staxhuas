import api from './axios';

export const inviteStudent = async (data) => {
  return await api.post('/invitations', data);
};

export const getInvitations = async (status = 'pending') => {
  return await api.get(`/invitations?status=${status}`);
};

export const revokeInvitation = async (id) => {
  return await api.post(`/invitations/${id}/revoke`);
};
