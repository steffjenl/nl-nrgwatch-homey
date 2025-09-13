'use strict';

const Homey = require('homey');

module.exports = class NRGWatch extends Homey.App {

  /**
   * onInit is called when the app is initialized.
   */
  async onInit() {
    this.log('NRGWatch has been initialized');
  }

};
