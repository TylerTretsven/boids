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
var Simulation = function(options) {

  var config = {
    height: window.innerHeight,
    width: window.innerWidth,
    boidCount: 100,
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


};

var simulation = new Simulation();