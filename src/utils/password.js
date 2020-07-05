import axios from './axios';

export default {

  async request(data) {
    const result = await axios.post('users/password-resets', data);
    return result;
  },

  async code(data) {
    const result = await axios.post('users/password-resets/code', data);
    return result;
  },

  async reset(data) {
    const result = await axios.patch('users/password', data);
    return result;
  },

};
