import axios from './axios';

export default {

  async get() {
    const result = await axios.get('blogs');
    return result;
  },
};
