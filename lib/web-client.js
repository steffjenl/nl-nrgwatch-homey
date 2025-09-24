const BaseClient = require('./base-class');
const http = require('node:http');

class WebClient extends BaseClient {
  _isAuthenticated;
  _enableVirtualRemote;

  constructor(...props) {
    super(...props);

    this._serverHost = null;
    this._serverPort = 80;
    this._userName = null;
    this._passWord = null;
    this._isAuthenticated = false;
    this._enableVirtualRemote = false;
    this._virtualRemoteIndex = 0;
  }

  async get(resource, params = {}) {
    return new Promise((resolve, reject) => {
      this.homey?.log(`WebClient GET ${resource} with params: ${JSON.stringify(params)}`);
      let authHeaders = '';

      if (this._isAuthenticated) {
        params.username = this._userName;
        params.password = this._passWord;
        authHeaders = 'Basic ' + new Buffer.from(this._userName + ':' + this._passWord).toString('base64');
      }

      const options = {
        method: 'GET',
        hostname: this._serverHost,
        port: this._serverPort,
        path: `/${resource}${this.toQueryString(params)}`,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: '*/*',
          Authorization: authHeaders
        },
      };

      const req = http.request(options, res => {
        const data = [];

        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
          if (res.statusCode === 401 || res.statusCode === 403 || data.join('') === 'AUTHENTICATION FAILED') {
            return reject(new Error(`Authentication failed. Please check the username and password.`));
          }

          if (res.statusCode !== 200) {
            if (data) {
              if (this.isValidJsonString(data.join(''))) {
                const result = JSON.parse(data.join(''));
                if (result && result.status && result.status === 'error' && result.message) {
                  return reject(new Error(`Error: ${result.message})`));
                }

                if (result && result.status && result.status === 'fail' && result.data && result.data.failreason) {
                  return reject(new Error(`Error: ${result.data.failreason}`));
                }

                if (result && result.status && result.status === 'fail' && result.data && result.data.code && result.data.code === 401) {
                  return reject(new Error(`Authentication failed. Please check the username and password.`));
                }

                return reject(new Error(`Error: ${result.data.failreason})`));
              }
            }
            return reject(new Error(`Failed to GET url: ${options.path} (status code: ${res.statusCode}, response: ${data.join('')})`));
          }

          return resolve(data.join(''));
        });
      });

      req.on('error', error => reject(error));
      req.end();
    });
  }

  async testConnection(ipAddress, userName = null, passWord = null) {
    return new Promise((resolve, reject) => {
      let params = {
        get: 'ithostatus'
      };
      if (userName) {
        params.username = userName;
        params.password = passWord;
      }
      const options = {
        method: 'GET',
        hostname: ipAddress,
        port: 80,
        path: `/api.html${this.toQueryString(params)}`,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: '*/*',
        }
      };

      const req = http.request(options, res => {
        const data = [];

        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
          if (res.statusCode === 401) {
            return resolve(401);
          }

          if (res.statusCode === 403) {
            return resolve(403);
          }

          if (res.statusCode !== 200) {
            return reject(new Error(`Failed to GET url: ${options.path} (status code: ${res.statusCode}, response: ${data.join('')})`));
          }

          return resolve(data.join(''));
        });
      });

      req.on('error', error => reject(error));
      req.end();
    });
  }

  toQueryString(obj) {
    if (obj === null || typeof obj === 'undefined' || Object.keys(obj).length === 0) {
      return '';
    }
    return `?${Object.keys(obj)
      .map(k => `${k}=${encodeURIComponent(obj[k])}`)
      .join('&')}`;
  }

  isValidJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }
}

module.exports = WebClient;
