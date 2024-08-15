import { apiClient } from "./apiClient";

export const apiUsers = {
  register: async (userData) => {
    try {
      const response = await apiClient.post(
        "v01/member/api/auth/register",
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export const getUserById = {
  userById: async (idUser) => {
    try {
      const response = await apiClient.get(
        `/v01/member/api/auth/user/${idUser}`
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export const verifikasiUsers = {
  verifikasiPin: async ({ memberUserId, pinVerifikasi }) => {
    try {
      const response = await apiClient.post(`/v01/member/api/auth/verifikasi`, {
        MemberUserId: memberUserId,
        Pin: pinVerifikasi,
      });
      return response.data;
    } catch (error) {
      console.error("API error:", error.response ? error.response.data : error);
      throw error.response ? error.response.data : error;
    }
  },
};

export const loginUsers = {
  login: async (userData) => {
    try {
      const response = await apiClient.post(
        "/v01/member/api/auth/login",
        userData
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export const logoutUsers = {
  logout: async () => {
    try {
      const response = await apiClient.post("/v01/member/api/auth/logout");
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

// History
export const historyMembers = {
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
};

// get All UsersMember
export const getAllMembers = {
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
};
