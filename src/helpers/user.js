import { axios } from '@/utils/';

export default {
  async checkSession() {
    try {
      const { data } = await axios.get('/users/me');
      return data;
    } catch (error) {
      return error;
    }
  },

  async checkDiscord() {
    try {
      const { data } = await axios.get('/profile/integrations/discord');
      return data;
    } catch (error) {
      return error;
    }
  },
};
