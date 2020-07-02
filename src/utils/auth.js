import axios from './axios';

export default {
  async login(data) {
    const result = await axios.post('sessions', data);

    const userToken = result.data.token;
    window.setToken(userToken);

    return result;
  },

  async testRegister(username, email, password) {
    const data = {
      username,
      email,
      password,
    };

    const result = await axios.post('users', data);
    window.LOG(result);
  },

  async testCitizen(firstName, lastName) {
    const data = {
      citizen: {
        firstName,
        lastName,
        dob: '1990/05/05',
        height: 160,
        gender: 'Male',
      },
    };

    const result = await axios.patch('users/me', data);
    window.LOG(result);
  },
};
