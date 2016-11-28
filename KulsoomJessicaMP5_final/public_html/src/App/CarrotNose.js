/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function CarrotNose(shader) {
    SceneNode.call(this, shader, name, true);   // calling super class constructor

}

gEngine.Core.inheritPrototype(CarrotNose, SceneNode);

CarrotNose.prototype.getCenterPosition = function () {
    return this.getRenderableAt(4).getXform().getPosition();
};


CarrotNose.prototype.selected = function(wcPos, parentMat, manipulator) {
    var myMat = this.getXform().getXform();
    var m = mat4.create();
    mat4.multiply(m, parentMat, myMat);
    var ptWC = [];
    vec2.transformMat4(ptWC, this.getCenterPosition(), m);
    var selected = withInBound(ptWC, wcPos);
    if (selected) {
        manipulator.setXformMatrix(parentMat, this);
    }
    return selected;
};


