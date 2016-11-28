/* File: Manipulator_Mode.js 
 *
 * Support for drawing of a square
 */

/*jslint node: true, vars: true */
/*global DirectManipulation */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

DirectManipulation.prototype.withinBounds = function (r, xPos, yPos) {
    return ((xPos > (r[0] - this.mTol)) &&
            (xPos < (r[0] + this.mTol)) &&
            (yPos > (r[1] - this.mTol)) &&
            (yPos < (r[1] + this.mTol)) );
};

DirectManipulation.prototype.objToWC = function (objP) {
    var wcPos = [0, 0];
    var m = this.mSceneNode.getXform().getXform();
    mat4.multiply(m, this.mObjToWCMatrix, m);
    vec2.transformMat4(wcPos, objP, m);
    return wcPos;
};

DirectManipulation.prototype.triggerManipulatorMode = function(wcX, wcY) {
    if (!this.isActivated())
        return;
    
    this.mTriggerMode =  this.kTriggerMode.eTriggerModeMove;
    var r, tObj, p = [0, 0];
    var t = this.getXform().getPosition();
    var found = false;
    while ( (!found) && (this.mTriggerMode<this.kTriggerMode.eTriggerModeNone)) {
        tObj = this.mTrigger[this.mTriggerMode];
        p[0] = tObj.mTriggerPos[0] + t[0];
        p[1] = tObj.mTriggerPos[1] + t[1];
        r = this.objToWC(p);
        found = this.withinBounds(r, wcX, wcY);
        if (found) {
          tObj.mTriggerControl.setColor(this.mTriggeredColor);
          console.log("called first");
          this.mStartPosX = wcX;
          this.mStartPosY = wcY;
        } else
            this.mTriggerMode++;
    }
    return found;
};

DirectManipulation.prototype.manipulate = function(wcX, wcY) {
    if (this.mTriggerMode === this.kTriggerMode.eTriggerModeNone)
        return;
    
    console.log("called second?");
    var dx = wcX - this.mStartPosX;
    var dy = wcY - this.mStartPosY;
    this.mStartPosX = wcX;
    this.mStartPosY = wcY;
    var xf = this.mSceneNode.getXform();
    
    switch (this.mTriggerMode) {
        case this.kTriggerMode.eTriggerModeMove:
            xf.incXPosBy(dx);
            xf.incYPosBy(dy);
            break;
        case this.kTriggerMode.eTriggerModeScale:
            xf.incWidthBy(dx);
            xf.incHeightBy(dy);
            break;
        case this.kTriggerMode.eTriggerModeRotate:
            var n = vec2.fromValues(0, 1);
            var mouseVec = vec2.fromValues(wcX, wcY);
            var manipVec = vec2.fromValues(xf.getXPos(), xf.getYPos());

            vec2.subtract(mouseVec, mouseVec, manipVec);

            vec2.normalize(mouseVec, mouseVec);

            var dotProd = vec2.dot(n, mouseVec);

            var theta = Math.acos(dotProd);

            var result = vec3.fromValues(0, 0, 0);
            result = vec2.cross(result, n, mouseVec);

            if(result[2] < 0){
                xf.setRotationInRad(theta * -1);
            }
            else{
                xf.setRotationInRad(theta);

            }
//            var d = 5* Math.sqrt(dx*dx + dy*dy);
//            if (dx > 0)
//                d = -d;
//            xf.incRotationByDegree(d);
            break;
    }
};

DirectManipulation.prototype.resetTrigger = function() {
    var tObj;
    for (var i = 0; i<this.kTriggerMode.eTriggerModeNone; i++) {
        tObj = this.mTrigger[i];
        tObj.mTriggerControl.setColor(tObj.mTriggerColor);
    }
    this.mTriggerMode = this.kTriggerMode.eTriggerModeNone;
};

DirectManipulation.prototype.isInManipulationMode = function() {
    return (this.mTriggerMode !== this.kTriggerMode.eTriggerModeNone);
};