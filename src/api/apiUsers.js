import { apiClient } from './apiClient';

export const apiUsers = {
  register: async (userData) => {
    try {
      const response = await apiClient.post(
        'v01/member/api/auth/register',
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getData: async (page, limit) => {
    try {
      const response = await apiClient.get(`/v01/member/api/auth/user`, {
        params: {
          page,
          limit,
        },
      });

      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  userById: async () => {
    try {
      const response = await apiClient.get(`/v01/member/api/auth/user/byId`);
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },

  verifikasiPin: async ({ memberUserId, pinVerifikasi }) => {
    try {
      const response = await apiClient.post(`/v01/member/api/auth/verifikasi`, {
        MemberUserId: memberUserId,
        Pin: pinVerifikasi,
      });
      return response.data;
    } catch (error) {
      console.error('API error:', error.response ? error.response.data : error);
      throw error.response ? error.response.data : error;
    }
  },

  login: async (userData) => {
    try {
      const response = await apiClient.post(
        '/v01/member/api/auth/login',
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  logout: async () => {
    try {
      const response = await apiClient.get('/v01/member/api/auth/logout');
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getHistory: async (idUsers, page, limit) => {
    try {
      const response = await apiClient.get(
        `/v01/member/api/memberHistory/users`,
        {
          params: { userId: idUsers, page, limit },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getRole: async () => {
    try {
      const response = await apiClient.get(`/v01/member/api/auth/role`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getRoleById: async () => {
    try {
      const response = await apiClient.get(
        `/v01/member/api/auth/rolesDetail/byId`
      );
      console.log(response.data);
      return response.data.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  verifyToken: async () => {
    try {
      const response = await apiClient.get('/v01/member/api/auth/protected');
      return response.data;
    } catch (error) {
      return error.response.data;
    }
  },
};
