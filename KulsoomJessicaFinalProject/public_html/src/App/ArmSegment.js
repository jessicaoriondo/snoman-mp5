/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ArmSegment(shader, name, xPivot, yPivot) {
    SceneNode.call(this, shader, name, true);   // calling super class constructor

    var xf = this.getXform();
    xf.setPivot(xPivot, yPivot);
    
    this.mPivotPos = new SquareRenderable(shader);
    this.addToSet(this.mPivotPos);
    this.mPivotPos.setColor([1, 0, 0, 1]); // default color
    xf = this.mPivotPos.getXform();
    xf.setSize(0.2, 0.2); // always this size
    xf.setPosition(xPivot, yPivot);
    
    // now create the children shapes
    var obj = new SquareRenderable(shader);  // base
    this.addToSet(obj);
    obj.setColor([0.98, 0.98, 0.98, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 1.5);
    xf.setPosition(xPivot, .65 + yPivot);
 
    obj = new SquareRenderable(shader);  // The red top
    this.addToSet(obj);
    obj.setColor([1, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 0.1); 
    xf.setPosition(xPivot, 1.05 + yPivot);
    
    obj = new SquareRenderable(shader);  // The red middle
    this.addToSet(obj);
    obj.setColor([1, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 0.1); 
    xf.setPosition(xPivot, yPivot + .65);
    
    obj = new SquareRenderable(shader); // red bottom
    this.addToSet(obj);
    obj.setColor([1, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 0.1); // so that we can see the connecting point
    xf.setPosition(xPivot, yPivot+0.30);
    
    obj = new CircleRenderable(shader); // red bottom
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.15, 0.15); // so that we can see the connecting point
    xf.setPosition(xPivot, yPivot);
}
gEngine.Core.inheritPrototype(ArmSegment, SceneNode);

ArmSegment.prototype.update = function () {
    // index-1 is the red-top
    var xf = this.getRenderableAt(1).getXform();
    xf.incRotationByDegree(this.mRotateRate);
    
    // index-4 is the blue circle
    xf = this.getRenderableAt(4).getXform();
    xf.incSizeBy(this.mPulseRate);
    if (xf.getWidth() > 0.7 || xf.getWidth() < 0.4)
        this.mPulseRate = -this.mPulseRate;
};

ArmSegment.prototype.getPivot = function () {
    return this.mPivotPos;
};

ArmSegment.prototype.drawPivot = function (aCamera, parentMat) {
    this.mPivotPos.draw(aCamera, parentMat);
};

ArmSegment.prototype.setColor = function (color) {

    this.mSet[1].setColor(color);
};