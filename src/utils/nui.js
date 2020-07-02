export default {
  async send(event, data = {}) {
    // Change the <resource-name> to your resource name
    const res = await fetch(`http://<resource-name>/${event}`, {
      method: 'post',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    });

    return res;
  },
};
