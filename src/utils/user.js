import axios from './axios';

export default {
  async me() {
    const result = await axios.get('users/me');
    return result;
  },

  async logout() {
    const result = await axios.delete('sessions/current')
      .then((response) => {
        window.LOG(response);
        window.removeToken();
      });
    return result;
  },

  async play() {
    const result = await axios.post('play/token');
    return result;
  },
};
