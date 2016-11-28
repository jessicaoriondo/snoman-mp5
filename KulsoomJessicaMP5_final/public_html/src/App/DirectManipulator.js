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
    
    this.mSceneNode = null;
    this.mObjToWCMatrix = null;
    
    this.mTriggeredColor = [1, 1, 1, 1];
    
    this.mStratPosX = 0;
    this.mStartPosY = 0;
    
    this.kWidth = 0.05;
    this.mTol = 0.15;
    this.kKnobSize = 0.25;
    this.kKnobLength = 1;
    
    this.kTriggerMode = {
        eTriggerModeMove: 0,
        eTriggerModeScale: 1,
        eTriggerModeRotate: 2,
        eTriggerModeNone: 3
    };
    
    this.mTrigger = [
        {   // 0 is move, center
            mTriggerControl: this.mPivotPos,
            mTriggerColor: [1, 0.6, 0.6, 1],
            mTriggerPos: [0, 0]
        },
        {   // 1 is scale, horizontal
            mTriggerControl: null,
            mTriggerColor: [1, 0.8, 0.4, 1],
            mTriggerPos: [this.kKnobLength, 0]
        },
        {   // 2 is rotate
            mTriggerControl: null,
            mTriggerColor: [1, 0, 1, 1],
            mTriggerPos: [0, this.kKnobLength]
        }   
    ];
    
    this.mTriggerMode = this.kTriggerMode.eTriggerModeNone;

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
    xfRR.setSize(0.05, 1);
    xfRR.setPosition(0, 0.5);
    this.mElements.push(this.mRR);
    
    this.mRotationPoint = new SquareRenderable(shader);
    this.mRotationPoint.setColor([2/255, 202/255, 252/255, 1]);
    var xfRotationPoint = this.mRotationPoint.getXform();
    xfRotationPoint.setSize(0.15, 0.15);
    xfRotationPoint.setPosition(0, 1);
    this.mElements.push(this.mRotationPoint);
    
    this.mSR = new SquareRenderable(shader);
    this.mSR.setColor([0, 0, 0, 1]);
    var xfSR = this.mSR.getXform();
    xfSR.setSize(1, 0.05);
    xfSR.setPosition(0.5, 0);
    this.mElements.push(this.mSR);
    
    this.mScalePoint = new SquareRenderable(shader);
    this.mScalePoint.setColor([7/255, 239/255, 34/255, 1]);
    var xfScalePoint = this.mScalePoint.getXform();
    xfScalePoint.setSize(0.15, 0.15);
    xfScalePoint.setPosition(1, 0);
    this.mElements.push(this.mScalePoint);
}

DirectManipulation.prototype.isActivated = function () { return this.mObjToWCMatrix !== null; };

DirectManipulation.prototype.setXformMatrix = function (m, sn) {
    if (this.mSceneNode !== null) {
        this.mSceneNode = null;
    }
    this.mObjToWCMatrix = m;
    this.mSceneNode = sn;
//    if (this.mSceneNode !== null)
//        this.mSceneNode.setManipulator(this);
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
