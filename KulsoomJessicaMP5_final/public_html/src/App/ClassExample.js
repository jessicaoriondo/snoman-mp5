/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ClassExample() {
    this.vmShouldDrawControl = false;
    
    this.vmShouldDrawDirectManipulator = false;
    
    this.mDMMode = false;
    

    this.mConstColorShader = new SimpleShader(
        "src/GLSLShaders/SimpleVS.glsl",      // Path to the VertexShader 
        "src/GLSLShaders/SimpleFS.glsl");    // Path to the simple FragmentShader
    
    //snowman body
    this.mHeadSq = new SquareRenderable(this.mConstColorShader);
    this.mHeadSq.setColor([0.2, 1.0, 0.2, 1]);
    this.mHeadSq.getXform().setSize(0.25, 0.25);
    
    //left arm
    this.mBlueSq = new SquareRenderable(this.mConstColorShader);
    this.mBlueSq.setColor([0.5, 0.5, 1.0, 1]);
    this.mBlueSq.getXform().setSize(0.25, 0.25);
    
    //upper left arm
    this.mRedSq =  new SquareRenderable(this.mConstColorShader);
    this.mRedSq.setColor([1.0, 0.5, 0.5, 1]);
    this.mRedSq.getXform().setSize(0.25, 0.25);
    
    //right arm
    this.mYellowSq =  new SquareRenderable(this.mConstColorShader);
    this.mYellowSq.setColor([249/255, 216/255, 2/255, 1]);
    this.mYellowSq.getXform().setSize(0.25, 0.25);
    
    //right upper arm
    this.mPurpleSq =  new SquareRenderable(this.mConstColorShader);
    this.mPurpleSq.setColor([146/255, 2/255, 249/255, 1]);
    this.mPurpleSq.getXform().setSize(0.25, 0.25);
    
    //mouse
    this.mXfSq =  new SquareRenderable(this.mConstColorShader);
    this.mXfSq.setColor([0.4, 0, 0.4, 1]);
    this.mXfSq.getXform().setSize(0.2, 0.2);

    this.mParent = new SnowmanBody(this.mConstColorShader);
    this.mLeftChild = new ArmSegment(this.mConstColorShader, "LeftGen 1",
                            -2, 0);
    this.mParent.addAsChild(this.mLeftChild);
    this.mTopChild = new ArmSegment(this.mConstColorShader, "LeftGen 2",
                            -2, 2);
    this.mLeftChild.addAsChild(this.mTopChild);
    //this.mTopChild.getXform().setPosition(0, 0);

    this.mRightChild = new ArmSegment(this.mConstColorShader, "RightGen 1",
                            2, 0);
    this.mParent.addAsChild(this.mRightChild);  // <-- WHAT ARE WE DOING?!!
    
    this.mTopRChild = new ArmSegment(this.mConstColorShader, "RightGen 2",
                            2, 2);
    this.mRightChild.addAsChild(this.mTopRChild);
    
    this.mDirectManipulator = new DirectManipulation(this.mConstColorShader, true);
    var xfDM = this.mDirectManipulator.getXform();
    xfDM.setPosition(0, 5);
    
    this.mOldSizeOfDirectManipulatorForScale = xfDM.getSize();
    this.mOldRotationInRad = xfDM.getRotationInRad();
    this.mOldPosition = xfDM.getPosition();
}

ClassExample.prototype.scaleSceneNode = function (newX, newY) {
    //console.log("DM SceneNode: " + this.mDirectManipulator.getSceneNode());
    if(this.mDirectManipulator.getSceneNode() !== null){
        var oldSize = this.mOldSizeOfDirectManipulatorForScale;
        
        var dx = newX - this.mDirectManipulator.getXform().getXPos();
        var dy = newY - this.mDirectManipulator.getXform().getYPos();
        this.mDirectManipulator.getSceneNode().getXform().setSize(oldSize[0] + dx, oldSize[1] + dy);
    }

};

ClassExample.prototype.rotateSceneNode = function (newX, newY) {
    if(this.mDirectManipulator.getSceneNode() !== null){

        var n = vec2.fromValues(0, 1);
        var mouseVec = vec2.fromValues(newX, newY);
        var manipVec = vec2.fromValues(this.mDirectManipulator.getXform().getXPos(), this.mDirectManipulator.getXform().getYPos());
        
        vec2.subtract(mouseVec, mouseVec, manipVec);

        vec2.normalize(mouseVec, mouseVec);

        var dotProd = vec2.dot(n, mouseVec);
        
        var theta = Math.acos(dotProd);
        
        var result = vec3.fromValues(0, 0, 0);
        result = vec2.cross(result, n, mouseVec);
  
        if(result[2] < 0){
            this.mDirectManipulator.getSceneNode().getXform().setRotationInRad(theta * -1);
        }
        else{
            this.mDirectManipulator.getSceneNode().getXform().setRotationInRad(theta);
            
        }  
    }
};

ClassExample.prototype.translateSceneNode = function (newX, newY) {
    //console.log("DM SceneNode: " + this.mDirectManipulator.getSceneNode());
    if(this.mDirectManipulator.getSceneNode() !== null){
        var translationX = 0.0;
        var translationY = 0.0;
        
        var parentSize = this.mParent.getXform().getSize();
        var mManipulatorName = this.mDirectManipulator.getSceneNode().mName;
        var mManipulatorPosition = this.mDirectManipulator.getXform().getPosition();
        
        //get difference (how much manipulator moved)
        translationX = mManipulatorPosition[0] - newX;
        translationY = mManipulatorPosition[1] - newY;
        
        //set new position of manipulator
        this.mDirectManipulator.getXform().setPosition(newX,newY);
        
        //get the actual positions of the scene node selected
        translationX = this.mDirectManipulator.getSceneNode().getXform().getXPos() - translationX;
        translationY = this.mDirectManipulator.getSceneNode().getXform().getYPos() - translationY;
        
        
        if(mManipulatorName === "Root"){
            this.mDirectManipulator.getSceneNode().getXform().setPosition(newX, newY);
        }
        else if(mManipulatorName.indexOf("1") !== -1)
        {
                    
            this.mDirectManipulator.getSceneNode().getXform().setPosition(translationX/parentSize[0], translationY/parentSize[1]);
            
        }
        else
        {
            var childScale = 0.0;
            if(this.mDirectManipulator.getSceneNode().mName === "LeftGen 2"){
                console.log("moving left");
                childScale = this.mLeftChild.getXform().getSize();
            }
            else
            {
                childScale = this.mRightChild.getXform().getSize();
            }
            
            var scaleRespectToChildX = translationX/childScale[0];
            var scaleRespectToChildY = translationY/childScale[1];
            this.mDirectManipulator.getSceneNode().getXform().setPosition(scaleRespectToChildX/parentSize[0],scaleRespectToChildY/parentSize[1]);
            //this.mDirectManipulator.getXform().setPosition(scaleRespectToChildX/parentSize[0],scaleRespectToChildY/parentSize[1]);
        }
            
    }
};

ClassExample.prototype.translateSceneNode2 = function (newX, newY) {
    //console.log("DM SceneNode: " + this.mDirectManipulator.getSceneNode());
    if(this.mDirectManipulator.getSceneNode() !== null){
        var translationX = 0.0;
        var translationY = 0.0;
        
        var parentSize = this.mParent.getXform().getSize();
        
        var mManipulatorName = this.mDirectManipulator.getSceneNode().mName;
        var mManipulatorPosition = this.mDirectManipulator.getXform().getPosition();
        
        //get difference (how much manipulator moved)
        translationX = mManipulatorPosition[0] - newX;
        translationY = mManipulatorPosition[1] - newY;
        
        //set new position of manipulator
        this.mDirectManipulator.getXform().setPosition(newX,newY);
        
        //get the actual positions of the scene node selected
        translationX = this.mDirectManipulator.getSceneNode().getXform().getXPos() - translationX;
        translationY = this.mDirectManipulator.getSceneNode().getXform().getYPos() - translationY;
        
        
        if(mManipulatorName === "Root"){
            this.mDirectManipulator.getSceneNode().getXform().setPosition(newX, newY);
        }
        else if(mManipulatorName.indexOf("1") !== -1)
        {
            if(parentSize[0] === 1 && parentSize[1] === 1){
                this.mDirectManipulator.getSceneNode().getXform().setPosition(translationX/parentSize[0], translationY/parentSize[1]);
            }
            else{
                if(mManipulatorName.indexOf("Right") !== -1){   
                    this.mDirectManipulator.getSceneNode().getXform().setPosition((newX - 2)/parentSize[0], newY/parentSize[1]);
                   
                }
                else{
                    this.mDirectManipulator.getSceneNode().getXform().setPosition((newX + 2)/parentSize[0], newY/parentSize[1]);
                }
                
            }
        }
        else
        {
            var childScale = 0.0;
            var scaleRespectToChildX = 0.0;
            var scaleRespectToChildY = 0.0;
            if(this.mDirectManipulator.getSceneNode().mName === "LeftGen 2"){
                
                console.log("moving left");
                childScale = this.mLeftChild.getXform().getSize();
                scaleRespectToChildX = (newX + 2)/childScale[0];
                scaleRespectToChildY = (newY - 2)/childScale[1];
            }
            else
            {
                childScale = this.mRightChild.getXform().getSize();
                scaleRespectToChildX = (newX - 2)/childScale[0];
                scaleRespectToChildY = (newY - 2)/childScale[1];
            }
            
            
            if(parentSize[0] === 1 && parentSize[1] === 1 && childScale[0] === 1
                    && childScale[1] === 1){
                scaleRespectToChildX = translationX/childScale[0];
                scaleRespectToChildY = translationY/childScale[1];
                this.mDirectManipulator.getSceneNode().getXform().setPosition(scaleRespectToChildX/parentSize[0],scaleRespectToChildY/parentSize[1]);
            }
            else{

                this.mDirectManipulator.getSceneNode().getXform().setPosition(scaleRespectToChildX/parentSize[0], scaleRespectToChildY/parentSize[1]);
            }
        }
            
    }
};

ClassExample.prototype.draw = function (camera) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();

    this.mParent.draw(camera);
    if (this.vmShouldDrawControl) {
        this.mHeadSq.draw(camera);
        this.mBlueSq.draw(camera);
        this.mRedSq.draw(camera);
        this.mYellowSq.draw(camera);
        this.mPurpleSq.draw(camera);
        this.mXfSq.draw(camera);
    }
    
    if(this.vmShouldDrawDirectManipulator){
        this.mDirectManipulator.draw(camera);
    }
};

ClassExample.prototype.moveDirectManipulator = function (wcPos) {
    var xfDM = this.mDirectManipulator.getXform();
    xfDM.setPosition(wcPos[0], wcPos[1]);
};

ClassExample.prototype.leftChildXform = function () {
    return this.mLeftChild.getXform();
};

ClassExample.prototype.rightChildXform = function () {
    return this.mRightChild.getXform();
};


ClassExample.prototype.topChildXform = function () {
    return this.mTopChild.getXform();
};


ClassExample.prototype.parentXform = function () {
    return this.mParent.getXform();
};

ClassExample.prototype.directManipulatorXform = function () {
    return this.mDirectManipulator.getXform();
};

// *** GLOBAL funciton for bound checking ...

var kBoundTol = 0.2;
// check if (wcx, wcy) is close enough to (px, py) by kBountTol
var withInBound = function (p, wc) {
    return ( ((p[0] - kBoundTol) < wc[0]) && (wc[0] < (p[0] + kBoundTol)) &&
             ((p[1] - kBoundTol) < wc[1]) && (wc[1] < (p[1] + kBoundTol)) );
};