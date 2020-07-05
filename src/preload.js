/* eslint-disable*/
const { remote } = require('electron');
const fs = require('fs');
const path = require('path');

import discord from '@/utils/discord';

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
    userToken: token
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

window.openExternalBrowser = (url) => {
  remote.shell.openExternal(url)
}

// -- EVENTS
remote.app.on('second-instance', (event, CommandLine, workingDirectory) => {
  const commandLine = CommandLine;

  currWindow.focus()

  const url = commandLine.filter((value) => {
    const arr = value.split(':');
    if (arr[0] === 'lostlauncher') {
      return value;
    }
  })

  if (url.length != 0) {
    const params = getParams(url[0])
    discord.createAuthorization(params)
      .then(() => {
        discord.success()
      })
      .catch((error) => {
        window.ERROR(error)
      })
  }
})

const getParams = (url) => {
	let params = {};
	let parser = document.createElement('a');
	parser.href = url;
	let query = parser.search.substring(1);
	let vars = query.split('&');
	for (let i = 0; i < vars.length; i++) {
		let pair = vars[i].split('=');
		params[pair[0]] = decodeURIComponent(pair[1]);
	}
	return params;
};
