/*
 * File: SnowmanBody.js 
  */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment, Manipulator */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SnowmanBody(shader) {
    SceneNode.call(this, shader, "Root", true);
    
    this.mPivotPos = new SquareRenderable(shader);
    this.addToSet(this.mPivotPos);
    this.mPivotPos.setColor([1, 0, 0, 1]); // default color
    var xf = this.mPivotPos.getXform();
    xf.setSize(0.2, 0.2); // always this size
    xf.setPosition(1.4, 1.4);

    // shapes in the base
    //bottom
    var obj = new CircleRenderable(shader);  
    this.addToSet(obj);
    obj.setColor([1.0, 1.0, 1.0, 1]);
    xf = obj.getXform();
    xf.setSize(1.4, 1.4);
    
    //middle
    obj = new CircleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([1.0, 1.0, 1.0, 1]);
    var xf = obj.getXform();
    xf.setSize(1.3, 1.3);
    xf.setPosition(0,1.9);
    
    //top
    obj = new CircleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([1.0, 1.0, 1.0, 1]);
    var xf = obj.getXform();
    xf.setSize(1.2, 1.2);
    xf.setPosition(0,3.7);
}
gEngine.Core.inheritPrototype(SnowmanBody, SceneNode);

SnowmanBody.prototype.getChildXformAt = function (index) {
    return this.mChildren[index].getXform();
};

SnowmanBody.prototype.getChildAt = function (index) {
    return this.mChildren[index];
};

SnowmanBody.prototype.parentXform = function () {
    return this.getXform();
};

SnowmanBody.prototype.getPivot = function () {
    return this.mPivotPos;
};

SnowmanBody.prototype.drawPivot = function (aCamera, parentMat) {
//    var pxf = this.getXform();
//    var t = pxf.getPosition();
//    var p = pxf.getPivot();
//    var xf = this.mPivotPos.getXform();
////    xf.setPosition(p[0] + t[0], p[1] + t[1]);
    this.mPivotPos.draw(aCamera, parentMat);
};