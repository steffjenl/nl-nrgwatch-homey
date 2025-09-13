const BaseClient = require('./base-class');
const WebClient = require('./web-client');
const NRGWatchWebSocket = require('./web-socket');

class NRGWatchApi extends BaseClient {
  constructor(...props) {
    super(...props);
    this.webclient = new WebClient();
    this.websocket = new NRGWatchWebSocket();
  }

  setSettings(host, username, password, isAuthenticated, enableVirtualRemote) {
    this.webclient._serverHost = host;
    this.webclient._userName = username;
    this.webclient._passWord = password;
    this.webclient._isAuthenticated = isAuthenticated;
    this.webclient._enableVirtualRemote = enableVirtualRemote;
  }

  setHomeyObject(homey) {
    this.homey = homey;
    this.webclient.setHomeyObject(homey);
    this.websocket.setHomeyObject(homey);
  }

  async getStatus() {
    return new Promise((resolve, reject) => {
      this.webclient.get('api.html', { 'get': 'ithostatus' })
        .then(response => {
          let result = JSON.parse(response);

          if (result) {
            return resolve(result);
          } else {
            return reject(new Error('Error obtaining ithostatus.'));
          }
        })
        .catch(error => reject(error));
    });
  }

  async setFanMode(mode) {
    return new Promise((resolve, reject) => {
      let command = {
        command: mode
      };
      if (this.webclient._enableVirtualRemote === true) {
        command = {
          vremotecmd: mode
        };
      }
      this.homey.log(`Setting fan mode to ${JSON.stringify(command)}`);
      this.webclient.get('api.html', command)
        .then(response => {
            if (response === 'OK') {
              return resolve(true);
            }
            return reject(new Error('Error setting fan mode.'));
          }
        )
        .catch(error => reject(error));
    });
  }

    async setFanSpeed(speed) {
      return new Promise((resolve, reject) => {
        let command = {
          speed: speed
        }
        if (this.webclient._enableVirtualRemote === true) {
          command = {
            speed: speed
          }
        }
        this.homey.log(`Setting fan speed to ${JSON.stringify(command)}`);
        this.webclient.get('api.html', command)
          .then(response => {
            if (response === 'OK') {
              return resolve(true);
            }
            return reject(new Error('Error setting fan speed.'));
          })
          .catch(error => reject(error));
      });
    }
}

module.exports = NRGWatchApi;
