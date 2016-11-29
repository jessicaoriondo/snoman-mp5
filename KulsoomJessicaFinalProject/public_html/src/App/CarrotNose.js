/*
 * File: SnowmanBody.js 
  */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment, Manipulator */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function CarrotNose(shader) {
    SceneNode.call(this, shader, "Nose", false);
    
    this.mPivotPos = new SquareRenderable(shader);
    this.addToSet(this.mPivotPos);
    this.mPivotPos.setColor([1, 0, 0, 1]); // default color
    var xf = this.mPivotPos.getXform();
    xf.setSize(0.2, 0.2); // always this size
    xf.setPosition(0, 0);

    // shapes in the base
    //bottom
    var obj = new TriangleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([252/255.0, 114/255.0, 2/255.0, 1]);
    var xf = obj.getXform();
    xf.setSize(.3, .3);
}
gEngine.Core.inheritPrototype(CarrotNose, SceneNode);

CarrotNose.prototype.parentXform = function () {
    return this.getXform();
};

CarrotNose.prototype.getPivot = function () {
    return this.mPivotPos;
};

CarrotNose.prototype.drawPivot = function (aCamera, parentMat) {
//    var pxf = this.getXform();
//    var t = pxf.getPosition();
//    var p = pxf.getPivot();
//    var xf = this.mPivotPos.getXform();
//    xf.setPosition(p[0] + t[0], p[1] + t[1]);
    this.mPivotPos.draw(aCamera, parentMat);
};


