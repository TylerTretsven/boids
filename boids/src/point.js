'use strict';

var _ = require('underscore');

/**
 * Point class
 */
var Point = function(x, y) {

  this.x = x || 0;
  this.y = y || 0;

};


/**
 * Utility Library for vector geometry
 */
var Vector = function() {

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

    // Return the sum
    return sum;
  };


  /**
  * Subtracts one or many vectors from a point
  */
  this.subtract = function(point) {

    // Store an initial point, or initialize a new Point at (0, 0)
    if (!point) point = new Point();

    // Sum up all of the vectors following the initial point
    _.each(arguments, function(p, i) {
      if (i > 0){
        point.x += p.x;
        point.y += p.y;
      }
    });

    return point;
  };


  /**
  * Multiplies the point by another point's coordinates
  */
  this.multiply = function(p1, p2) {

    // Multiply each coordinate by the other point's coordinate
    p1.x *= p2.x;
    p1.y *= p2.y;

    return p1;
  };


  /**
  * Multiplies the point's coordinates by a scalar variable
  */
  this.multiplyBy = function(point, scalar) {

    // Multiply each coordinate by the scalar
    point.x *= scalar;
    point.y *= scalar;

    return point;
  };


  /**
  * Divides the point's coordinates by another point's coordinates
  */
  this.divide = function(p1, p2) {
    // TODO: Make sure that neither of the divisors are 0

    // Divide each coordinate by the other point's coordinate
    p1.x /= p2.x;
    p1.y /= p2.y;

    return p1;
  };


  /**
  * Divides the point's coordinates by a scalar variable
  */
  this.divideBy = function(point, scalar) {

    if (scalar != 0) {

      // Divide each coordinate by the scalar
      point.x /= scalar;
      point.y /= scalar;
    } else {
      // TODO: Come up with a condition if the scalar is 0
      return 0;
    }

    return point;
  };


  /**
  * Multiplies the point by another point's coordinates
  */
  this.multiply = function(p1, p2) {

    // Multiply each coordinate by the other point's coordinate
    p1.x *= p2.x;
    p1.y *= p2.y;

    return p1;
  };


  /**
  * Multiplies the point's coordinates by a scalar variable
  */
  this.multiplyBy = function(point, scalar) {

    // Multiply each coordinate by the scalar
    point.x *= scalar;
    point.y *= scalar;

    return point;
  };


  /**
   * Returns the Euclidean distance
   */
  this.distance = function(p1, p2) {
    return Math.sqrt( Math.pow(p1.x - p1.x, 2) +
                      Math.pow(p2.y - p2.y, 2) );
  }

};


exports.Point = Point;
exports.Vector = Vector;