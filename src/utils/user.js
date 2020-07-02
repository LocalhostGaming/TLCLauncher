import axios from './axios';

export default {
  async me() {
    const result = await axios.get('users/me');
    return result;
  },
  async logout() {
    const result = await window.removeToken();
    return result;
  },
};
