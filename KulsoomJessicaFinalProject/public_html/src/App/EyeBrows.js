/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function EyeBrows(shader) {
    SceneNode.call(this, shader, "Eye Brows", false);   // calling super class constructor
    
    this.mPivotPos = new SquareRenderable(shader);
    this.addToSet(this.mPivotPos);
    this.mPivotPos.setColor([1, 0, 0, 1]); // default color
    var xf = this.mPivotPos.getXform();
    xf.setSize(0.2, 0.2); // always this size
    xf.setPosition(0, 0);

    var obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(.3, .1);
    xf.setPosition(0.3, 0);
    
    var obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(.3, .1);
    xf.setPosition(-0.3, 0);
}

gEngine.Core.inheritPrototype(EyeBrows, SceneNode);

EyeBrows.prototype.parentXform = function () {
    return this.getXform();
};

EyeBrows.prototype.getPivot = function () {
    return this.mPivotPos;
};

EyeBrows.prototype.drawPivot = function (aCamera, parentMat) {
//    var pxf = this.getXform();
//    var t = pxf.getPosition();
//    var p = pxf.getPivot();
//    var xf = this.mPivotPos.getXform();
//    xf.setPosition(p[0] + t[0], p[1] + t[1]);
    this.mPivotPos.draw(aCamera, parentMat);
};


