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
var BoidsSimulation = function(canvasId, options) {

  // Store a reference to the canvas element
  var cvs = document.getElementById(canvasId);
  var ctx = cvs.getContext('2d');

  // Configuration elements
  var config = {

    // Canvas size
    height: cvs.height,
    width: cvs.width,

    // Number of BoidsSim
    boidCount: 500,

    // Simulation variables
    fps: 60,
    neighborRadius: 40,
    safeDistance: 15,
    safeDistanceRepel: 1,
    maxVelocity: 2,
    percentToCenter: 1/100,
    percentToGoal: 1/5,
    velocityAdded: 1/8
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

  ticker(window, config.fps).on('tick', function() {
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
    ctx.fillStyle = '#000000';

    // For each boid, draw a square in its location
    _.each(list, function(b) {
      ctx.fillRect(b.location.x, b.location.y, 3, 3);
    });
  }
};


/**
 * Demo
 * */

window.onload = function() {

  // Sets the canvas to be the full screen width
  var canvas = document.getElementById('canvas');
  var body = document.getElementsByTagName('body')[0];
  canvas.setAttribute('height', window.innerHeight - 5);
  canvas.setAttribute('width', window.innerWidth - 5);

  // Accepts options
  var options = {};

  // Initialize and start a new simulation
  BoidsSimulation('canvas', options);
};
