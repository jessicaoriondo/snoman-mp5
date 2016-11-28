/*
 * File: 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Bound(xform) {
    var p = xform.getPosition();
    var hw = 0.5 * xform.getWidth();
    var hh = 0.5 * xform.getHeight();
    this.mMin = [p[0] - hw, p[1] - hh];
    this.mMax = [p[0] + hw, p[1] + hh];
}

Bound.prototype.mergeWithBound = function (b) {
    this.mMin[0] = Math.min(this.mMin[0], b.mMin[0]);
    this.mMin[1] = Math.min(this.mMin[1], b.mMin[1]);
    this.mMax[0] = Math.max(this.mMax[0], b.mMax[0]);
    this.mMax[1] = Math.max(this.mMax[1], b.mMax[1]);
};

Bound.prototype.setXform = function (xform) {
    var w = this.mMax[0] - this.mMin[0];
    var h = this.mMax[1] - this.mMin[1];
    xform.setPosition(this.mMin[0] + 0.5 * w, this.mMin[1] + 0.5 * h);
    // xform.setSize(w, h);
};