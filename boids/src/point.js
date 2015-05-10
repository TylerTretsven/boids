'use strict';

var _ = require('underscore');

/**
 * Point class
 */
var Point = function(x, y) {

  this.x = x || 0;
  this.y = y || 0;


  /**
  * Adds one or many vectors to a point
  * */
  this.add = function() {

    // Initialize a point at (0, 0)
    var sum = {x:0, y: 0};

    // For Each point, increment sum.x and sum.y
    _.each(arguments, function(p) {
      sum.x += p.x;
      sum.y += p.y;
    });

    // Add the sum to the point
    this.x += sum.x;
    this.y += sum.y;

    // Return this for chaining
    return this;
  };


  /**
  * Subtracts one or many vectors from a point
  */
  this.subtract = function() {

    // Initialize a new Point at (0, 0)
    var diff = {x:0, y: 0};

    // Sum up all of the vectors
    _.each(arguments, function(p) {
      diff.x += p.x;
      diff.y += p.y;
    });

    // Return the Subtract that sum from the point
    this.x -= sum.x;
    this.y -= sum.y;

    // Return this for chaining
    return this;
  };


  /**
  * Multiplies the point by another point's coordinates
  */
  this.multiply = function(otherPoint) {

    // Multiply each coordinate by the other point's coordinate
    this.x *= otherPoint.x;
    this.y *= otherPoint.y;

    // Return this for chaining
    return this;
  };


  /**
  * Multiplies the point's coordinates by a scalar variable
  */
  this.multiplyBy = function(scalar) {

    // Multiply each coordinate by the scalar
    this.x *= scalar;
    this.y *= scalar;

    // Return this for chaining
    return this;
  };


  /**
  * Divides the point's coordinates by another point's coordinates
  */
  this.divide = function(otherPoint) {
    // TODO: Make sure that neither of the divisors are 0

    // Divide each coordinate by the other point's coordinate
    this.x /= otherPoint.x;
    this.y /= otherPoint.y;

    // Return this for chaining
    return this;
  };


  /**
  * Divides the point's coordinates by a scalar variable
  */
  this.divideBy = function(scalar) {

    if (scalar != 0) {

      // Divide each coordinate by the scalar
      this.x /= scalar;
      this.y /= scalar;
    } else {
      // TODO: Come up with a condition if the scalar is 0
    }

    // Return this for chaining
    return this;
  };


  /**
  * Multiplies the point by another point's coordinates
  */
  this.multiply = function(otherPoint) {

    // Multiply each coordinate by the other point's coordinate
    this.x *= otherPoint.x;
    this.y *= otherPoint.y;

    // Return this for chaining
    return this;
  };


  /**
  * Multiplies the point's coordinates by a scalar variable
  */
  this.multiplyBy = function(scalar) {

    // Multiply each coordinate by the scalar
    this.x *= scalar;
    this.y *= scalar;

    // Return this for chaining
    return this;
  };
};

module.exports = Point;