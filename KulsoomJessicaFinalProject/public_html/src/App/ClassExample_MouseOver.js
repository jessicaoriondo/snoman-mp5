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
//    var parentPos = parentXf.getPosition();
//    this.mHeadSq.getXform().setPosition(parentPos[0], parentPos[1]);
//    if (this.withInBound(parentPos, wcPos)) {
//        overObj = "Parent Body";
//        if (didLeftClick){
//            this.vmShouldDrawDirectManipulator = true;
//            this.moveDirectManipulator(parentPos);
//            
//            if(this.mDirectManipulator.getSceneNode() !== null &&
//                        this.mDirectManipulator.getSceneNode() !== this.mParent){
//                    this.mDirectManipulator.removeSceneNode();
//                }
//            this.mDirectManipulator.setSceneNode(this.mParent);
//        }
//    }
    
    for(var i = 0; i < this.mParent.childrenSize(); i++){
        var m = mat4.create();
        var child = this.mParent.getChildAt(i).getXform().getXform();
        mat4.multiply(m, parentMat, child);
        
        var pivotPos = this.mParent.getChildAt(i).getRenderableAt(0).getXform().getPosition();
        var pivotPosWC = vec2.fromValues(0, 0);
        vec2.transformMat4(pivotPosWC, pivotPos, m);
        if (this.withInBound(pivotPosWC, wcPos)) {
            overObj = "child";
            if (didLeftClick){
                this.vmShouldDrawDirectManipulator = true;
                this.moveDirectManipulator(pivotPosWC);
                
                if(this.mDirectManipulator.getSceneNode() !== null &&
                        this.mDirectManipulator.getSceneNode() !== this.mParent.getChildAt(i)){
                    this.mDirectManipulator.removeSceneNode();
                }
                this.mDirectManipulator.setSceneNode(this.mParent.getChildAt(i));
            }
        }
        
        if(this.mParent.getChildAt(i).childrenSize() > 0){
            for(var j = 0; j < this.mParent.getChildAt(i).childrenSize(); j++){
                m = mat4.create();
                var grandChild = this.mParent.getChildAt(i).getChildAt(j).getXform().getXform();
                mat4.multiply(m, child, grandChild); // top first, then, left
                mat4.multiply(m, parentMat, m);  // parent is last
                
                pivotPos = this.mParent.getChildAt(i).getChildAt(j).getRenderableAt(0).getXform().getPosition();
                pivotPosWC = vec2.fromValues(0, 0);
                
                vec2.transformMat4(pivotPosWC, pivotPos, m);
                if (this.withInBound(pivotPosWC, wcPos)) {
                    overObj = "grand child";
                    if (didLeftClick){
                        this.vmShouldDrawDirectManipulator = true;
                        this.moveDirectManipulator(pivotPosWC);

                        if(this.mDirectManipulator.getSceneNode() !== null &&
                                this.mDirectManipulator.getSceneNode() !== this.mParent.getChildAt(i).getChildAt(j)){
                            this.mDirectManipulator.removeSceneNode();
                        }
                        this.mDirectManipulator.setSceneNode(this.mParent.getChildAt(i).getChildAt(j));
                    }
                }
            }
        }
    }
    
        
    //direct manipulator rotation knob
    var dmPos = this.mDirectManipulator.getXform().getPosition();
    if(this.withInBound([dmPos[0], dmPos[1] + this.mDirectManipulator.getRodLength()], wcPos)){
        overObj = "DM Rotation Knob";
    }
    else if(this.withInBound([dmPos[0] + this.mDirectManipulator.getRodLength(), dmPos[1]], wcPos)){
        overObj = "DM Scale Knob";
    }   

    return posEcho + overObj;
};

ClassExample.prototype.detectMouseOverToDelete = function (wcX, wcY, didLeftClick) {
    var posEcho = wcX.toFixed(2).toString() + " " + wcY.toFixed(2).toString() + " :";
    var overObj = "Nothing";
    
    this.mXfSq.getXform().setPosition(wcX, wcY);
    
    var wcPos = [wcX, wcY];
    // 1. We will detect the based rotating head
    var parentXf = this.mParent.getXform();
    var parentMat = parentXf.getXform();
    
    for(var i = 0; i < this.mParent.childrenSize(); i++){
        var m = mat4.create();
        var child = this.mParent.getChildAt(i).getXform().getXform();
        mat4.multiply(m, parentMat, child);
        
        var pivotPos = this.mParent.getChildAt(i).getRenderableAt(0).getXform().getPosition();
        var pivotPosWC = vec2.fromValues(0, 0);
        vec2.transformMat4(pivotPosWC, pivotPos, m);
        if (this.withInBound(pivotPosWC, wcPos)) {
            overObj = "child";
            if (didLeftClick){
                if(this.mParent.getChildAt(i).childrenSize() > 0){
                    for(var j = 0; j < this.mParent.getChildAt(i).childrenSize(); j++){
                        this.mParent.getChildAt(i).getChildren().splice(j, 1);
                    }
                }
                this.mParent.getChildren().splice(i, 1);
            }
        }
        
        if(this.mParent.getChildAt(i)){
            if(this.mParent.getChildAt(i).childrenSize() > 0){
                for(var j = 0; j < this.mParent.getChildAt(i).childrenSize(); j++){
                    m = mat4.create();
                    var grandChild = this.mParent.getChildAt(i).getChildAt(j).getXform().getXform();
                    mat4.multiply(m, child, grandChild); // top first, then, left
                    mat4.multiply(m, parentMat, m);  // parent is last

                    pivotPos = this.mParent.getChildAt(i).getChildAt(j).getRenderableAt(0).getXform().getPosition();
                    pivotPosWC = vec2.fromValues(0, 0);

                    vec2.transformMat4(pivotPosWC, pivotPos, m);
                    if (this.withInBound(pivotPosWC, wcPos)) {
                        overObj = "grand child";
                        if (didLeftClick){
                            this.mParent.getChildAt(i).getChildren().splice(j, 1);
                        }
                    }
                }
            }
        }
    }  

    return posEcho + overObj;
};