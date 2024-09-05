import { apiBackend } from './apiClient';

export const getTransaction = {
  getData: async (search, page, limit) => {
    try {
      const response = await apiBackend.get(`/v1/transaction/getTransactions`, {
        params: {
          search,
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getMetric: async () => {
    try {
      const response = await apiBackend.get(`/v1/transaction/metrics`);
      console.log('metris', response);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createData: async (formData) => {
    try {
      // Pastikan formData adalah instance dari FormData
      if (!(formData instanceof FormData)) {
        throw new Error('formData harus merupakan instance dari FormData');
      }

      const response = await apiBackend.post(
        '/v1/transaction/createTransactions',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', // Header ini dapat dihilangkan karena Axios menambahkannya otomatis
          },
        }
      );

      console.log(formData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error(error.message);
    }
  },

  getLocation: async (page, limit, search) => {
    try {
      const response = await apiBackend.get(
        '/v1/location/allcustomer-locations',
        {
          params: {
            page,
            limit,
            search,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  getById: async (idTransaction) => {
    try {
      const response = await apiBackend.get(
        `/v1/transaction/getTransactions/${idTransaction}`
      );
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  updateById: async (idTransaction, formData) => {
    try {
      const response = await apiBackend.put(
        `/v1/transaction/updateTransactions/${idTransaction}`,
        formData
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  getMutasi: async (search) => {
    try {
      const response = await apiBackend.get(`/v1/transaction/getDataMutation`, {
        params: {
          search,
        },
      });
      console.log(response);
      return response.data.data;
    } catch (error) {
      throw error.response.data;
    }
  },
  updatedPayment: async (idTransaction) => {
    try {
      const response = await apiBackend.put(
        `/v1/transaction/pay/${idTransaction}`
      );
      console.log(response);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  exportData: async (userName) => {
    try {
      const response = await apiBackend.get(
        '/v1/transaction/export-dump-data',
        {
          admin_user: userName,
        },
        {
          responseType: 'blob', // Menetapkan responseType ke 'blob'
        }
      );

      return response;
    } catch (error) {
      throw error.response.data;
    }
  },

  mutasiRekening: async (page, limit, search) => {
    try {
      const response = await apiBackend.get('/v1/transaction/getDataMutation', {
        params: {
          page,
          limit,
          search,
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  uploadFile: async (formData) => {
    try {
      const response = await apiBackend.post(
        '/v1/transaction/insertDataMutation',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response;
    } catch (error) {
      throw error.response.data;
    }
  },

  findTransactionData: async (email, nocard) => {
    try {
      const response = await apiBackend.post(
        '/v1/transaction/findTransactionData',
        {
          NoCardOrEmail: email || nocard,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching transaction data:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },

  sendMessage: async (id, userName) => {
    try {
      const response = await apiBackend.put(
        `/v1/transaction/updateStage/${id}`,
        {
          status: 'take',
          admin_user: userName,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching transaction data:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
  updateDone: async (id, userName) => {
    try {
      const response = await apiBackend.put(
        `/v1/transaction/updateStage/${id}`,
        {
          status: 'done',
          admin_user: userName,
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching transaction data:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
  getByStatus: async (status, search, page, limit) => {
    try {
      const response = await apiBackend.get(
        `/v1/transaction/transactionStatus`,
        {
          params: {
            status,
            search,
            page,
            limit,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        'Error fetching transaction data:',
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  },
};
