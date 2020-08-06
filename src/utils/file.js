import fs from 'fs';

export default {
  async write(filename, payload) {
    try {
      await fs.writeFileSync(filename, JSON.stringify(payload), 'utf-8');
      return true;
    } catch (error) {
      throw new Error(error);
    }
  },

  async read(filename) {
    try {
      if (await !fs.existsSync(filename)) {
        throw new Error(`${filename} doesn't exists`);
      }

      const json = await fs.readFileSync(filename);
      const data = JSON.parse(json);

      return data;
    } catch (error) {
      throw new Error(error);
    }
  },

  async remove(filename) {
    if (await !fs.existsSync(filename)) {
      throw new Error(`${filename} doesn't exists`);
    }

    try {
      await fs.unlinkSync(filename);
      return true;
    } catch (error) {
      throw new Error(error);
    }
  },
};
