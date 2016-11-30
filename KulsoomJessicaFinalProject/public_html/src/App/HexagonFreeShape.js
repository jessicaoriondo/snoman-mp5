/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function HexagonFreeShape(shader) {
    SceneNode.call(this, shader, "Hexagon", false);   // calling super class constructor
    
    this.mPivotPos = new SquareRenderable(shader);
    this.addToSet(this.mPivotPos);
    this.mPivotPos.setColor([1, 0, 0, 1]); // default color
    var xf = this.mPivotPos.getXform();
    xf.setSize(0.2, 0.2); // always this size
    xf.setPosition(0, 0);
    
    var obj = new HexagonRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(.5, .5);
}

gEngine.Core.inheritPrototype(HexagonFreeShape, SceneNode);

HexagonFreeShape.prototype.parentXform = function () {
    return this.getXform();
};

HexagonFreeShape.prototype.getPivot = function () {
    return this.mPivotPos;
};

HexagonFreeShape.prototype.drawPivot = function (aCamera, parentMat) {

    this.mPivotPos.draw(aCamera, parentMat);
};


