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
  const filePath = path.join(tempPath, 'token.txt')

  const promise = new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(filePath, token, 'utf-8');
      resolve('Successfully saved Token');
    } catch (e) {
      reject(e);
    }
  })

  return promise;
}

window.getToken = () => {
  const tempPath = remote.app.getPath("temp");
  const filePath = path.join(tempPath, 'token.txt')

  const promise = new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      try {
        const token = fs.readFileSync(filePath, 'utf-8');
        resolve(token);
      } catch (e) {
        reject(e);
      }
    }
  })

  return promise;
}

window.removeToken = () => {
  const tempPath = remote.app.getPath("temp");
  const filePath = path.join(tempPath, 'token.txt')

  const promise = new Promise((resolve, reject) => {
    try {
      fs.unlinkSync(filePath, 'utf-8');
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

