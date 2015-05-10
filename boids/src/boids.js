'use strict';

var Point = require('./point').Point;     // Uninvoked Class
var Vector = require('./point').Vector; // Invoked Library
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

  // Public API
  this.next = next;
  this.returnNext = returnNext;

  // Array of boids in the simulation
  var boidList = createBoids();

  // In each iteration, a copy is made of boid list for use in comparison
  // All changes in each cycle are made directly to boidList.
  var boidListClone;


  /**
   * Moves all of the boids
   * */
  function next() {
    // Create a shallow clone to reference for the next move
    // All boid changes are made to boid list so that it does not break the object references
    boidListClone = _.clone(boidList);

    // Move each boid
    _.each(boidList, move);
  }


  /**
   * Moves all of the boids and returns boidList with the new locations
   * */
  function returnNext() {
    next();
    return boidList;
  }


  /**
   * Moves a boid to its next location
   * */
  function move(b, i) {

    // Finds the movement vectors.
    // 'i' is the current boid's index.
    var center = centerOfMass(i);
    var safe = safeDistance(i);
    var vel = matchVelocity(i);

    // Updates the boid's velocity
    b.velocity = Vector.add(b.velocity, center, safe, vel);

    // Updates the boid's location
    b.location = Vector.add(b.location, b.velocity);
  }

  /**
   * Rule: Boids tend to move towards the center of mass of the other boids
   * */
  function centerOfMass(boid) {

    return new Point();
  }


  /**
   * Rule: Boids attempt to keep a safe distance from obstacles and other boids
   */
  function safeDistance(boid) {

    return new Point();
  }


  /**
   * Rule: Boids attempt to match the velocity of the other boids
   * */
  function matchVelocity(boid) {

    return new Point();
  }


  /**
   * Creates an array of boids at random locations on the canvas
   * */
  function createBoids() {

    // Array of new random boids
    var newBoidList = [];

    _.each( _.range(config.boidCount), function(val, i) {

      // Generate random x and y coordinates
      var x = Math.random() * config.width;
      var y = Math.random() * config.height;

      var p = new Point(x, y);

      newBoidList[i] = new Boid(p);
    });

    return newBoidList;
  }

};

module.exports = Boids;