/* File: SceneNode.js 
 *
 * Support for grouping of Renderables with custom pivot ability
 */

/*jslint node: true, vars: true */
/*global PivotedTransform, SquareRenderable  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function DirectManipulation(shader, drawPivot) {
    this.mElements = [];
    this.mXform = new PivotedTransform();
    this.mRodLength = 0.5;
    
    this.mSceneNode = null;

    // this is for debugging only: for drawing the pivot position
    this.mPivotPos = null;
    if ((drawPivot !== undefined) && (drawPivot === true)) {
        this.mPivotPos = new SquareRenderable(shader);
        this.mPivotPos.setColor([252/255, 2/255, 206/255, 1]); // default color
        var xf = this.mPivotPos.getXform();
        xf.setSize(0.15, 0.15); // always this size
    }
    
    this.mRR = new SquareRenderable(shader);
    this.mRR.setColor([0, 0, 0, 1]);
    var xfRR = this.mRR.getXform();
    xfRR.setSize(0.05, this.mRodLength);
    xfRR.setPosition(0, this.mRodLength/2);
    this.mElements.push(this.mRR);
    
    this.mRotationPoint = new SquareRenderable(shader);
    this.mRotationPoint.setColor([2/255, 202/255, 252/255, 1]);
    var xfRotationPoint = this.mRotationPoint.getXform();
    xfRotationPoint.setSize(0.15, 0.15);
    xfRotationPoint.setPosition(0, this.mRodLength);
    this.mElements.push(this.mRotationPoint);
    
    this.mSR = new SquareRenderable(shader);
    this.mSR.setColor([0, 0, 0, 1]);
    var xfSR = this.mSR.getXform();
    xfSR.setSize(this.mRodLength, 0.05);
    xfSR.setPosition(this.mRodLength/2, 0);
    this.mElements.push(this.mSR);
    
    this.mScalePoint = new SquareRenderable(shader);
    this.mScalePoint.setColor([7/255, 239/255, 34/255, 1]);
    var xfScalePoint = this.mScalePoint.getXform();
    xfScalePoint.setSize(0.15, 0.15);
    xfScalePoint.setPosition(this.mRodLength, 0);
    this.mElements.push(this.mScalePoint);
}

DirectManipulation.prototype.getRodLength = function () {
    return this.mRodLength;
};

DirectManipulation.prototype.getRotationPoint = function () {
    return this.mRotationPoint;
};

DirectManipulation.prototype.getScalePoint = function () {
    return this.mScalePoint;
};

DirectManipulation.prototype.setSceneNode = function (obj) {
    this.mSceneNode = obj;
};

DirectManipulation.prototype.removeSceneNode = function () {
    this.mSceneNode = null;
};

DirectManipulation.prototype.getSceneNode = function () {
    return this.mSceneNode;
};

DirectManipulation.prototype.getXform = function () { return this.mXform; };

DirectManipulation.prototype.size = function () { return this.mElements.length; };

DirectManipulation.prototype.getRenderableAt = function (index) {
    return this.mElements[index];
};

DirectManipulation.prototype.addToSet = function (obj) {
    this.mElements.push(obj);
};

DirectManipulation.prototype.removeFromSet = function (obj) {
    var index = this.mElements.indexOf(obj);
    if (index > -1)
        this.mElements.splice(index, 1);
};

DirectManipulation.prototype.moveToLast = function (obj) {
    this.removeFromElements(obj);
    this.addToSet(obj);
};

DirectManipulation.prototype.draw = function (aCamera) {
    var i;
    var xfMat = this.mXform.getXform(); // gets the xform matrix
    for (i = 0; i < this.mElements.length; i++) {
        this.mElements[i].draw(aCamera, xfMat); // pass to each renderable
    }
    
    // for debugging, let's draw the pivot position
    if (this.mPivotPos !== null) {
        var pxf = this.getXform();
        var t = pxf.getPosition();
        var p = pxf.getPivot();
        var xf = this.mPivotPos.getXform();
        xf.setPosition(p[0] + t[0], p[1] + t[1]);
        this.mPivotPos.draw(aCamera);
    }
};

DirectManipulation.prototype.mayHaveCollided = function(wcPos) { // other is anotehr Renderable
    var myXf = this.mPivotPos.getXform();
//    var urXf = other.getXform();

    var dx = myXf.getXPos() - wcPos[0];
    var dy = myXf.getYPos() - wcPos[1];
    
//    console.log("pivot x: " + myXf.getXPos());
//    console.log("pivot y: " + myXf.getYPos());
//    console.log("mouse x: " + wcPos[0]);
//    console.log("mouse y: " + wcPos[1]);
    
    
    var distBetweenCenter = dx*dx + dy*dy;
    
//    console.log("distance: " + distBetweenCenter);

    return distBetweenCenter <= 2;
};