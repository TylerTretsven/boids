/**
 * Boids Algorithm
 * ===============
 *
 * Simulation of the Boids algorithm.  The simulation only has one public
 * method: Boids.next.  Boids.next returns the boid locations for the next
 * frame of the simulation.
 */

'use strict';

var Victor = require('victor');
var _ = require('underscore');

/**
 * Boid Class
 * */
var Boid = function(position, velocity) {
  this.location = position || new Victor();
  this.velocity = velocity || new Victor();
};

/**
 * BoidsSim Simulation class
 */
var Boids = function(config) {

  // Creates the array of boids for the simulation
  var boids = createBoids();

  // Store for more efficient distance comparisons
  var squaredSafeDistance = Math.pow(config.safeDistance, 2);
  var squaredNeighborRadius = Math.pow(config.neighborRadius, 2);


  /**
   * Moves all of the boids and returns the boid list
   * */
  function next() {

    // Stores each boid's movement vector for the next frame
    // initializes each as a new vector at (0, 0)
    var movements = new Array(boids.length);
    for (var m=0; m<movements.length; m++) { movements[m] = new Victor(); }

    // Stores an array of indices of the boid's neighbors within a given radius
    var neighbors = new Array(boids.length);
    for (var n=0; n<boids.length; n++) { neighbors[n] = []; }

    // Find each boids neighbors
    for (var i=0; i<boids.length; i++) {
      for (var j=1; j<boids.length; j++) {
        if (boids[i].location.distanceSq(boids[j].location) <= squaredNeighborRadius) {
          neighbors[i].push(j);
          neighbors[j].push(i);
        }
      }
    }

    // Loops through the boid indices
    for (i=0; i<boids.length; i++) {

      /**
       * Cohesion
       */
      movements[i].add(cohesion(boids[i], neighbors[i]));

      /**
       * Alignment
       */
      movements[i].add(alignment(boids[i], neighbors[i]));


      /**
       * Separation
       *
       * Each boid calculates its distance to each other boid after it.
       * If the distance is less than the safe distance, it applies the doubling
       * rule to both itself and the other boids movement vector.
       */

      // TODO: Only loop through neighbors
      // j will be the index of each boid in boids following i.  Allows it to only check
      // paired distances once
      for (j = i + 1; j < boids.length; j++) {

        // Finds whether the distance between two boids is less than or equal to
        // the safe distance, (squared distances for efficiency)
        if (boids[i].location.distanceSq(boids[j].location) <= squaredSafeDistance) {

          // If so, it finds the distances between them (from the perspective of boid i)
          var dx = boids[j].location.x - boids[i].location.x;
          var dy = boids[j].location.y - boids[i].location.y;

          // Creates difference vector from boid i to boid j, multiplied by a scalar that controls the repulsion factor
          var difference = new Victor(dx * config.safeDistanceRepel, dy * config.safeDistanceRepel);

          // Moves boid i away from boid j, and vice versa
          movements[i].subtract(difference);
          movements[j].add(difference);
        }
      }
    }

    /**
     * Moves each boid to its next location
     */
    for (i=0; i<boids.length; i++) {

      // Updates the boid's velocity
      boids[i].velocity.add(movements[i]);

      // Limit Velocity
      if (boids[i].velocity.magnitude() >= config.maxVelocity) {
        boids[i].velocity = limit(boids[i].velocity, config.maxVelocity);
      }

      // Updates the boid's location
      boids[i].location.add(boids[i].velocity);

      // Wrap borders
      if (boids[i].location.x < 0) {
        boids[i].location.x += config.width;
      }
      if (boids[i].location.y < 0) {
        boids[i].location.y += config.height;
      }
      if (boids[i].location.x > config.width) {
        boids[i].location.x -= config.width;
      }
      if (boids[i].location.y > config.height) {
        boids[i].location.y -= config.height;
      }
    }

    return boids;
  }

  /**
   * Cohesion Rule: Boids tend to move towards the center of mass of neighboring boids
   * */
  function cohesion(boid, neighbors) {

    var total = new Victor();

    if (neighbors.length > 0) {

      // If there are neighbors, go through each one and sum their locations
      for (var i=0; i < neighbors.length; i++) {
        total.add(boids[ neighbors[i] ].location);
      }

      // Divide by the number of neighbors to find their average location
      total.x /= neighbors.length;
      total.y /= neighbors.length;

      // Find the distance between that point and the boid
      var dx = total.x - boid.location.x;
      var dy = total.y - boid.location.y;

      return new Victor(dx * config.percentToCenter, dy * config.percentToCenter);
    } else {

      // If there are no neighbors, return the 'total' victor unchanged from (0, 0).
      return total;
    }
  }


  /**
   * Rule: Boids attempt to match the velocity of the other boids
   * */
  function alignment(boid, neighbors) {
    var total = new Victor();

    if (neighbors.length > 0) {

      // If there are neighbors, go through each one and sum their locations
      for (var i=0; i < neighbors.length; i++) {
        total.add(boids[ neighbors[i] ].velocity);
      }

      return new Victor(total.x * config.velocityAdded, total.y * config.velocityAdded);
    } else {

      // If there are no neighbors, return the 'total' victor unchanged from (0, 0).
      return total;
    }
  }


  /**
   * Creates an array of boids at random locations on the canvas
   * */
  function createBoids() {

    // Array of new random boids
    var newBoidList = [];

    for (var i=0; i<config.boidCount; i++) {

      // Location: Generate random x and y coordinates
      var lx = Math.random() * config.width;
      var ly = Math.random() * config.height;
      var location = new Victor(lx, ly); // Random Victor

      // Velocity: Generate random velocities within maxSpeed
      var vx = Math.random() * config.maxVelocity;
      var vy = Math.random() * config.maxVelocity;
      if (Math.random() >= 0.5) { vx *= -1; }
      if (Math.random() >= 0.5) { vy *= -1; }

      var velocity = new Victor(vx, vy); // Random Victor

      newBoidList[i] = new Boid(location, velocity);
    }

    return newBoidList;
  }

  /**
   * Reduce a vector down to a certain magnitude while maintaining its slope
   */
  function limit(vector, lim) {
    var reductionCoeff = lim / vector.magnitude();
    return new Victor( vector.x * reductionCoeff, vector.y * reductionCoeff );
  }

  return {
    /**
     * Public API
     */
    // Moves all the boids to the next location returns the boid array
    next: next
  }
};

module.exports = Boids;
