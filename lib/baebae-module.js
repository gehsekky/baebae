/**
 * Virtual class template for use in child modules
 * @module BaeBaeModule
 */
'use strict'

/**
 * This class serves as a virtual template for other BaeBae modules
 * to inherit from.
 */
class BaeBaeModule {
  /**
   * Sets up the user function collections. If overridden,
   * ensure that these collections are still initialized here
   * or loading modules will probably throw an error.
   * @constructor
   */
  constructor() {
    this.commands = {}
    this.listeners = {}
  }

  /**
   * Virtual init function. Each module should override
   * this method in their class definition (subclassing off of
   * BaeBaeModule). In it, the user collections should be 
   * populated (commands, listeners) and/or any additional logic
   * for the module to be initialzed.
   * @param {BaeBae} bot - A reference to the BaeBae instance
   */
  init(bot) {

  }
}

module.exports = BaeBaeModule
