/**
 * Boids Simulation
 *
 * Author: Tyler Tretsven
 * */

'use strict';

var Boids = require('./boids');
var _ = require('underscore');

/**
 * Simulation Class
 */
var Simulation = function(canvasId, options) {

  // Store a reference to the canvas element
  var cvs = document.getElementById(canvasId);
  var c = canvas.getContext('2d');

  // Configuration elements
  var config = {

    // Canvas size
    height: cvs.scrollHeight,
    width:  cvs.scrollWidth,

    // Number of Boids
    boidCount: 100,

    // Simulation variables
    // TODO: Be more specific
    safeDistance: 10,
    maxVelocity: 20,
    percentToCenter: 1/8.0,
    borderBuffer: 10,
    velocityAdded: 1/8.0
  };


  // Extends the config options
  _.each(options, function(val, key){
    if (config[key]) {
      config[key] = val;
    }
  });

  var boids = new Boids(config);



  /**
   * Draws the next frame of the simulation
   * */
  function draw() {
    var currentBoids = boids.advance();
  }


  /**
   * Starts the simulation
   * */
  this.start = function() {
    console.log('started');
    return this;
  };

  /**
   * Stops the simulation
   * */
  this.stop = function() {
    console.log('stopped');
    return this;
  };

  /**
   * Initializes and starts a new simulation
   * */
  this.reset = function() {

    this.stop();
    var boids = new Boids(config);
    this.start();

    console.log('reset');
    return this;
  };

  this.viewConfig = function() {
    console.log( JSON.stringify(config) );
  };

  // Returns the Simulation object for chaining
  return this;
};


/**
 * Demo using a 100% x 100% canvas
 * */

var c = document.getElementById('canvas');

var options = {

};

// Initialize and start a new simulation
var sim = new Simulation('canvas', options).start();