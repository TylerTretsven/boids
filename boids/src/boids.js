'use strict';

var Point = require('./point');
var _ = require('underscore');

/**
 * Boid Class
 * */
var Boid = function(position, velocity) {
  this.location = position || new Point();
  this.velocity = velocity || new Point();
};

/**
 * Boids class
 */
var Boids = function(config) {

  var boidList = createBoids();




  function createBoids() {

    // Array of new random boids
    var newBoidList = [];

    _.each( _.range(config.boidCount), function(val, i) {

      // Generate random x and y coordinates
      var x = Math.random() * 1000;
      var y = Math.random() * 1000;

      var p = new Point(x, y);

      newBoidList[i] = new Boid(p);
    });

    return newBoidList;
  }

};

module.exports = Boids;



