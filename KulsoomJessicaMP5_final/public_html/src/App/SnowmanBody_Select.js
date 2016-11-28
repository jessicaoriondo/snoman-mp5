/*
 * File: BodyWithArms_Select.js
 *    Supports selection of one of the body parts
 */
/*jslint node: true, vars: true */
/*global ClassExample, matrix, SnowmanBody  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

SnowmanBody.prototype.selectBase = function (wcPos, manipulator) {
    var baseXf = this.getXform();
    var baseMat = baseXf.getXform();
    var basePos = vec2.fromValues(0, 0);
    var basePosWC = [];
    vec2.transformMat4(basePosWC, basePos, baseMat);
    var selected = withInBound(basePosWC, wcPos);
    if (selected) {
        manipulator.setXformMatrix(mat4.create(), this);
    }
    return selected;
};

SnowmanBody.prototype.selectBodyPartAtIndex = function (index, wcPos, manipulator) {
    var baseMat = this.getXform().getXform();
    return this.mChildren[index].selected(wcPos, baseMat, manipulator);
};

