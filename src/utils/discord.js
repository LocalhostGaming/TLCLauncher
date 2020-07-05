import axios from './axios';

export default {

  async me() {
    const data = await axios.get('profile/integrations/discord');
    return data;
  },

  async requestAuthorization() {
    const result = await axios.get('profile/integrations/discord/authorization-url?intent=launcher');
    return result;
  },

  async createAuthorization(data) {
    const result = await axios.post('profile/integrations/discord', data);
    return result;
  },

  success() {
    const event = new Event('discord');
    window.dispatchEvent(event);
  },

};
