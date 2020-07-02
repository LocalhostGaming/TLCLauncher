/* eslint-disable*/
const { remote } = require('electron');
const fs = require('fs');
const path = require('path');

let currWindow = remote.BrowserWindow.getFocusedWindow();

window.closeCurrentWindow = function() {
  currWindow.destroy();
}

window.minimizeCurrentWindow = function() {
  currWindow.minimize();
}

window.minimizeToTrayCurrentWindow = function() {
  currWindow.hide();
}

window.saveToken = (filename, token) => {
  const tempPath = remote.app.getPath("temp");
  const filePath = path.join(tempPath, filename)

  const promise = new Promise((resolve, reject) => {
    try {
      fs.writeFileSync(filePath, token, 'utf-8');
      resolve(filePath);
    } catch(e) {
      console.error(e);
      reject(e);
    }
  })

  return promise;
}

window.readToken = (filename) => {
  const tempPath = remote.app.getPath("temp");
  const filePath = path.join(tempPath, filename)

  const promise = new Promise((resolve, reject) => {
    try {
      const token = fs.readFileSync(filePath, 'utf-8');
      resolve(token);
    } catch(e) {
      console.error(e);
      reject(e)
    }
  })

  return promise;
}

window.removeToken = (filename) => {
  const tempPath = remote.app.getPath("temp");
  const filePath = path.join(tempPath, filename)

  const promise = new Promise((resolve, reject) => {
    try {
      fs.unlinkSync(filePath, 'utf-8');
      resolve(filePath);
    } catch(e) {
      console.error(e);
      reject(e);
    }
  })

  return promise;
}

