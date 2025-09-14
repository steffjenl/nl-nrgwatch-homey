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
  }

  async get(resource, params = {}) {
    return new Promise((resolve, reject) => {
      let authHeader = '';
      if (this._isAuthenticated) {
        authHeader = 'Basic ' + Buffer.from(`${this._userName}:${this._passWord}`)
          .toString('base64');
      }
      const options = {
        method: 'GET',
        hostname: this._serverHost,
        port: this._serverPort,
        path: `/${resource}${this.toQueryString(params)}`,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Accept: '*/*',
          authHeader
        }
      };

      const req = http.request(options, res => {
        const data = [];

        res.on('data', chunk => data.push(chunk));
        res.on('end', () => {
          if (res.statusCode === 401) {
            return reject(new Error(`Homey user has no permission to perform this action. Please check the user's role.`));
          }

          if (res.statusCode === 403) {
            return reject(new Error(`Homey user has no permission to perform this action. Please check the user's role.`));
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

  async testConnection(ipAddress, userName = null, passWord = null) {
    return new Promise((resolve, reject) => {
      let authHeader = '';
      if (userName) {
        authHeader = 'Basic ' + Buffer.from(`${userName}:${passWord}`)
          .toString('base64');
      }
      const options = {
        method: 'GET',
        hostname: ipAddress,
        port: 80,
        path: `/api.html?get=ithostatus`,
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
}

module.exports = WebClient;
