/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Mouth(shader) {
    SceneNode.call(this, shader, "Mouth", false);   // calling super class constructor
    
    this.mPivotPos = new SquareRenderable(shader);
    this.addToSet(this.mPivotPos);
    this.mPivotPos.setColor([1, 0, 0, 1]); // default color
    var xf = this.mPivotPos.getXform();
    xf.setSize(0.2, 0.2); // always this size
    xf.setPosition(0, 0);
    
    var obj = new CircleRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(.1, .1);
    xf.setPosition(-0.4, .15);
    
    obj = new CircleRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(.1, .1);
    xf.setPosition(-0.25, -.05);
    
    obj = new CircleRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(.1, .1);
    xf.setPosition(0, -0.1);
    
    obj = new CircleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(0.1, 0.1);
    xf.setPosition(0.25, -.05);

    obj = new CircleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(0.1, 0.1);
    xf.setPosition(0.4, 0.15);
}

gEngine.Core.inheritPrototype(Mouth, SceneNode);

Mouth.prototype.parentXform = function () {
    return this.getXform();
};

Mouth.prototype.getPivot = function () {
    return this.mPivotPos;
};

Mouth.prototype.drawPivot = function (aCamera, parentMat) {
//    var pxf = this.getXform();
//    var t = pxf.getPosition();
//    var p = pxf.getPivot();
//    var xf = this.mPivotPos.getXform();
//    xf.setPosition(p[0] + t[0], p[1] + t[1]);
    this.mPivotPos.draw(aCamera, parentMat);
};

