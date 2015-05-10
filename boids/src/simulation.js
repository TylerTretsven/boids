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
  var ctx = cvs.getContext('2d');

  // Configuration elements
  var config = {

    // Canvas size
    height: cvs.height,
    width: cvs.width,

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

  var
    boids = new Boids(config),
    running = true,
    iterations = 0;

  /**
   * Draws the next frame of the simulation
   * */
  function draw(list) {

    // Hackey way to clear the canvas
    ctx.clearRect(0, 0, config.width, config.height);

    // makes boids dark grey
    ctx.fillStyle = 'black';

    // For each boid, draw a square in its location
    _.each(list, function(b) {

      ctx.fillRect(b.location.x, b.location.y, 3, 3);
    });
  }


  /**
   * Starts the simulation
   * */
  this.start = function() {
    console.log('started');

    while(running) {
      ++iterations;
      if (iterations % 5 === 0) {

        // Every 5th iteration, return the boid list and draw its contents
       draw( boids.returnNext() );

      } else {

        // Otherwise, just advance the simulation
        boids.next();
      }

      // stops after 100 iterations, for testing
      if (iterations === 100) {
        running = false;
      }
    }
  };

  /**
   * FUTURE: Stops the simulation
   * */
  //this.stop = function() {
  //  console.log('stopped');
  //  return this;
  //};

  /**
   * FUTURE: Initializes and starts a new simulation
   * */
  //this.reset = function() {
  //
  //  this.stop();
  //  var boids = new Boids(config);
  //  this.start();
  //
  //  console.log('reset');
  //  return this;
  //};

  this.viewConfig = function() {
    console.log( JSON.stringify(config) );
  };

  // Returns the Simulation object for chaining
  return this;
};


/**
 * Demo using a 600 x 600 canvas
 * */


var options = {

};

// Initialize and start a new simulation
var sim = new Simulation('canvas', options).start();