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
    
    // now create the children shapes
    var obj = new SquareRenderable(shader);  // base
    this.addToSet(obj);
    obj.setColor([0.98, 0.98, 0.98, 1]);
    xf = obj.getXform();
    xf.setSize(0.3, 2);
    xf.setPosition(xPivot, 1 + yPivot);
 
    obj = new SquareRenderable(shader);  // The red top
    this.addToSet(obj);
    obj.setColor([1, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.3, 0.2); 
    xf.setPosition(xPivot, 1.75 + yPivot);
    
    obj = new SquareRenderable(shader);  // The red middle
    this.addToSet(obj);
    obj.setColor([1, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.3, 0.2); 
    xf.setPosition(xPivot, yPivot + 1.1);
    
    obj = new SquareRenderable(shader); // red bottom
    this.addToSet(obj);
    obj.setColor([1, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.3, 0.2); // so that we can see the connecting point
    xf.setPosition(xPivot, yPivot+0.4);
    
    obj = new CircleRenderable(shader); // red bottom
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    xf = obj.getXform();
    xf.setSize(0.2, 0.2); // so that we can see the connecting point
    xf.setPosition(xPivot, yPivot);
    
    this.mPulseRate = 0.005;
    this.mRotateRate = -2;
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