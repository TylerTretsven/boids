/**
 * Boids Simulation
 *
 * Author: Tyler Tretsven
 * */

'use strict';

var BoidsSim = require('./boids');
var ticker = require('ticker');
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

    // Number of BoidsSim
    boidCount: 100,

    // Simulation variables
    // TODO: Be more specific
    safeDistance: 50,
    safeDistanceRepel: 1,
    maxVelocity: 5,
    percentToCenter: 1/100,
    percentToGoal: 1/5,
    borderBuffer: 20,
    velocityAdded: 1/20
  };


  // Extends the config options
  _.each(options, function(val, key){
    if (config[key]) {
      config[key] = val;
    }
  });

  var Boids = new BoidsSim(config);

  /**
   * Runs the simulation
   */
  // Contains the array of boids to display on the next draw
  var boids = [];

  ticker(window, 45).on('tick', function() {
    boids = Boids.next();
  }).on('draw', function() {
    draw(boids);
  });

  /**
   * Draws the next frame of the simulation
   * */
  function draw(list) {

    // Clear the canvas
    ctx.clearRect(0, 0, config.width, config.height);

    // Makes the boids black
    ctx.fillStyle = 'black';

    // For each boid, draw a square in its location
    _.each(list, function(b) {
      ctx.fillRect(b.location.x, b.location.y, 3, 3);
    });
  }

};


/**
 * Demo
 * */

var options = {};

// Initialize and start a new simulation
var sim = new Simulation('canvas', options);