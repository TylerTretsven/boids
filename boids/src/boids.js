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

  // Resets the mouse location.  This is used as the goal.
  var mouseLocation = new Victor();
  window.onmousemove = function(e) {
    mouseLocation.x = e.x;
    mouseLocation.y = e.y;
  };


  /**
   * Moves all of the boids and returns the boid list
   * */
  function next() {

    // Stores each boid's movement vector for the next frame
    // initializes each as a new vector at (0, 0)
    var movements = new Array(boids.length);
    for (var m=0; m<movements.length; m++) { movements[m] = new Victor(); }

    // Find the average center of mass and velocity for all boids
    var totalAvgCenter = centerOfMass();
    var totalAvgVelocity = averageVelocity();

    // Loops through the boid indices
    for (var i=0; i<boids.length; i++) {

      /**
       * Center of Mass rule
       *
       * Subtracts the boid's location, divided by the total number of boids,
       * from the average center of mass
       */

      // Find the boid's contribution to the total average
      var weightedBoidLocation = {
        x: boids[i].location.x / boids.length,
        y: boids[i].location.x / boids.length
      };

      // Find the total center without the boid's location
      var adjustedAvgCenter = totalAvgCenter.clone().subtract(weightedBoidLocation);

      // Find the distances to the center
      var dx = adjustedAvgCenter.x - weightedBoidLocation.x;
      var dy = adjustedAvgCenter.y - weightedBoidLocation.y;

      // Add a certain percentage of that distance to the next movement
      var toCenter = new Victor(dx * config.percentToCenter, dy * config.percentToCenter);
      movements[i].add(toCenter);


      /**
       * Match Velocity rule
       *
       * Subtracts the boid's velocity, divided by the total number of boids,
       * from the average velocity
       */

      // Find the boid's contribution to the total average
      var weightedBoidVelocity = {
        x: boids[i].velocity.x / boids.length,
        y: boids[i].velocity.y / boids.length
      };

      // Find the average velocity without the boids contribution
      var adjustedAvgVelocity = totalAvgVelocity.clone().subtract(weightedBoidVelocity);

      // Find the 'distance' towards the average
      dx = adjustedAvgVelocity.x - weightedBoidVelocity.x;
      dy = adjustedAvgVelocity.y - weightedBoidVelocity.y;

      // Add a certain percentage of that distance towards the next movement
      var toAverageVelocity = new Victor(dx * config.velocityAdded, dy * config.velocityAdded);
      movements[i].add(toAverageVelocity);


      /**
       * Safe Distance rule
       *
       * Each boid calculates its distance to each other boid after it.
       * If the distance is less than the safe distance, it applies the doubling
       * rule to both itself and the other boids movement vector.
       */
      // j will be the index of each boid in boids following i.  Allows it to only check
      // paired distances once
      for (var j = i + 1; j < boids.length; j++) {

        // Finds whether the distance between two boids is less than or equal to
        // the safe distance, (squared distances for efficiency)
        if (boids[i].location.distanceSq(boids[j].location) <= squaredSafeDistance) {

          // If so, it finds the distances between them (from the perspective of boid i)
          dx = boids[j].location.x - boids[i].location.x;
          dy = boids[j].location.y - boids[i].location.y;

          // Creates difference vector from boid i to boid j, multiplied by a scalar that controls the repulsion factor
          var difference = new Victor(dx * config.safeDistanceRepel, dy * config.safeDistanceRepel);

          // Moves boid i away from boid j, and vice versa
          movements[i].subtract(difference);
          movements[j].add(difference);
        }
      }

      /**
       * Avoid borders
       */
      //if (boids[i].location.x <= config.borderBuffer) {
      //  movements[i].x += (boids[i].location.x);
      //}
      //if (boids[i].location.y <= config.borderBuffer) {
      //  movements[i].y += (boids[i].location.y);
      //}
      //if ((config.width - boids[i].location.x) <= config.borderBuffer) {
      //  movements[i].x -= (config.width - boids[i].location.x);
      //}
      //if ((config.height - boids[i].location.y) <= config.borderBuffer) {
      //  movements[i].y -= (config.height - boids[i].location.y);
      //}


      /**
       * Move towards the mouse
       */
      // Finds the distances to the mouse location
      dx = mouseLocation.x - boids[i].location.x;
      dy = mouseLocation.y - boids[i].location.y;

      // Adds a percentage of that distance to the next move
      var toMouse = new Victor(dx * config.percentToGoal, dy * config.percentToGoal);
      movements[i].add(toMouse);
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
    }

    return boids;
  }


  /**
   * Rule: Boids tend to move towards the center of mass of the other boids
   *
   * CenterOfMass finds the average center of mass of all boids.
   * */
  function centerOfMass() {

    var total = new Victor();

    _.each(boids, function(b) {
      total.add(b.location);
    });

    total.x /= boids.length;
    total.y /= boids.length;

    return total;
  }


  /**
   * Rule: Boids attempt to match the velocity of the other boids
   * */
  function averageVelocity() {
    var total = new Victor();

    _.each(boids, function (b) {
      total.add(b.velocity);
    });

    total.x /= boids.length;
    total.y /= boids.length;

    return total;
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


  /**
   * Testing suite -- called when on debug mode
   * */

  function test() {
    /**
     * Test the boid creation and rule methods
     */
  }

  return {
    /**
     * Public API
     */
    // Moves all the boids to the next location returns the boid array
    next: next
  }
}

module.exports = Boids;