/* eslint-disable*/
const { remote } = require('electron');
const fs = require('fs');
const path = require('path');

const currWindow = remote.BrowserWindow.getFocusedWindow();

window.closeCurrentWindow = () => {
  currWindow.destroy();
}

window.minimizeCurrentWindow = () => {
  currWindow.minimize();
}

window.minimizeToTrayCurrentWindow = () => {
  currWindow.hide();
}

window.setToken = (token) => {
  const tempPath = remote.app.getPath("temp");
  const filePath = path.join(tempPath, 'tlc.json')

  const data = {
    userToken: token,
    serverSession: null
  }

  const promise = new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
      resolve('Successfully saved Token');
    } catch (e) {
      reject(e);
    }
  })

  return promise;
}

window.getToken = () => {
  const tempPath = remote.app.getPath("temp");
  const filePath = path.join(tempPath, 'tlc.json')

  const promise = new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      try {
        const json = fs.readFileSync(filePath, 'utf-8');
        const data = JSON.parse(json);
        console.log(data);
        resolve(data.userToken);
      } catch (e) {
        reject(e);
      }
    }
  })

  return promise;
}

window.removeToken = () => {
  const tempPath = remote.app.getPath("temp");
  const filePath = path.join(tempPath, 'tlc.json')

  const data = {
    userToken: null,
    serverSession: null
  }

  const promise = new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(filePath, JSON.stringify(data), 'utf-8');
      resolve('Successfully removed Token');
    } catch(e) {
      console.error(e);
      reject(e);
    }
  })

  return promise;
}

window.ERROR = (error) => {
  console.error(error);
}
window.LOG = (log) => {
  console.log(log);
}

