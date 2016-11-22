/*
 * File: 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global ClassExample, matrix  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var kBoundTol = 0.2;
// check if (wcx, wcy) is close enough to (px, py) by kBountTol
ClassExample.prototype.withInBound = function (p, wc) {
    return ( ((p[0] - kBoundTol) < wc[0]) && (wc[0] < (p[0] + kBoundTol)) &&
             ((p[1] - kBoundTol) < wc[1]) && (wc[1] < (p[1] + kBoundTol)) );
};

// define a hit as a WC pos within 0.2 from the center position
ClassExample.prototype.detectMouseOver = function (wcX, wcY, didLeftClick) {
    var posEcho = wcX.toFixed(2).toString() + " " + wcY.toFixed(2).toString() + " :";
    var overObj = "Nothing";
    
    this.mXfSq.getXform().setPosition(wcX, wcY);
    
    var wcPos = [wcX, wcY];
    // 1. We will detect the based rotating head
    var parentXf = this.mParent.getXform();
    var parentMat = parentXf.getXform();
    var parentPos = parentXf.getPosition();
    this.mHeadSq.getXform().setPosition(parentPos[0], parentPos[1]);
    if (this.withInBound(parentPos, wcPos)) {
        overObj = "Parent Body";
        if (didLeftClick){
            this.vmShouldDrawDirectManipulator = true;
            this.moveDirectManipulator(parentPos);
            
//            if(this.mDirectManipulator.getSceneNode() !== null){
//                this.mDirectManipulator.removeSceneNode();
//            }
            this.mDirectManipulator.setSceneNode(this.mParent);
        }
    }

    // 2. Left, lower arm, pulsing blue rectangle
        var m = mat4.create();
        var leftArmMat = this.mLeftChild.getXform().getXform(); // a matrix
        mat4.multiply(m, parentMat, leftArmMat);

        var pulsingBluePos = this.mLeftChild.getRenderableAt(4).getXform().getPosition();
        var bluePosWC = vec2.fromValues(0, 0);

        vec2.transformMat4(bluePosWC, pulsingBluePos, m);
        this.mBlueSq.getXform().setPosition(bluePosWC[0], bluePosWC[1])
        if (this.withInBound(bluePosWC, wcPos)) {
            overObj = "Lower Arm:";
            if (didLeftClick){
                this.vmShouldDrawDirectManipulator = true;
                this.moveDirectManipulator(bluePosWC);
            }
        }
    
    // 3. Left, upper arm (tip) the rotating red square
        m = mat4.create();  // <-- reuse the matrix
        var topArmMat = this.mTopChild.getXform().getXform();
        mat4.multiply(m, leftArmMat, topArmMat); // top first, then, left
        mat4.multiply(m, parentMat, m);  // parent is last
        
        var rotateRedPos = this.mTopChild.getRenderableAt(4).getXform().getPosition();
        var redPosWC = vec2.fromValues(0, 0);
        
        vec2.transformMat4(redPosWC, rotateRedPos, m);
        this.mRedSq.getXform().setPosition(redPosWC[0], redPosWC[1]);
        if (this.withInBound(redPosWC, wcPos)) {
            overObj = "Upper Left Arm:";
            if (didLeftClick){
                this.vmShouldDrawDirectManipulator = true;
                this.moveDirectManipulator(redPosWC);
            }
        }
        
        //right arm
        m = mat4.create();
        var rightArmMat = this.mRightChild.getXform().getXform();
        mat4.multiply(m, parentMat, rightArmMat);
        
        var yellowPos = this.mRightChild.getRenderableAt(4).getXform().getPosition();
        var yellowPosWC = vec2.fromValues(0, 0);
        
        vec2.transformMat4(yellowPosWC, yellowPos, m);
        this.mYellowSq.getXform().setPosition(yellowPosWC[0], yellowPosWC[1]);
        if(this.withInBound(yellowPosWC, wcPos)){
            overObj = "Right Arm";
            if (didLeftClick){
                this.vmShouldDrawDirectManipulator = true;
                this.moveDirectManipulator(yellowPosWC);
                
                if(this.mDirectManipulator.getSceneNode() !== null &&
                        this.mDirectManipulator.getSceneNode() !== this.mRightChild){
                    this.mDirectManipulator.removeSceneNode();
                }
                this.mDirectManipulator.setSceneNode(this.mRightChild);
                //this.mDirectManipulator.getSceneNode().getXform().setXPos(1);
//                console.log("upper right arm pos: " + this.mRightChild.getXform().getPosition());
//                console.log("sceneN Pos of DM: " + this.mDirectManipulator.getSceneNode().getXform().getPosition());
            }
        }
        
        //upper right arm
        m = mat4.create();
        var rightUpperArmMat = this.mTopRChild.getXform().getXform();
        mat4.multiply(m, rightArmMat, rightUpperArmMat);
        mat4.multiply(m, parentMat, m);
        
        var purplePos = this.mTopRChild.getRenderableAt(4).getXform().getPosition();
        var purplePosWC = vec2.fromValues(0, 0);
        
        vec2.transformMat4(purplePosWC, purplePos, m);
        this.mPurpleSq.getXform().setPosition(purplePosWC[0], purplePosWC[1]);
        if(this.withInBound(purplePosWC, wcPos)){
            overObj = "Upper Right Arm";
            if (didLeftClick){
                this.vmShouldDrawDirectManipulator = true;
                this.moveDirectManipulator(purplePosWC);
                
                if(this.mDirectManipulator.getSceneNode() !== null &&
                        this.mDirectManipulator.getSceneNode() !== this.mTopRChild){
                    this.mDirectManipulator.removeSceneNode();
                }
                this.mDirectManipulator.setSceneNode(this.mTopRChild);
                
//                console.log("upper right arm pos: " + this.mTopRChild.getXform().getPosition());
//                console.log("sceneN Pos of DM: " + this.mDirectManipulator.getSceneNode().getXform().getPosition());
            }
        }
        
        //direct manipulator rotation knob
        var dmPos = this.mDirectManipulator.getXform().getPosition();
        if(this.withInBound([dmPos[0], dmPos[1] + 1], wcPos)){
            overObj = "DM Rotation Knob";
        }
        else if(this.withInBound([dmPos[0] + 1, dmPos[1]], wcPos)){
            overObj = "DM Scale Knob";
        }
        //console.log("DM pos: " + this.mDirectManipulator.getXform().getPosition());
        
    

    return posEcho + overObj;
};