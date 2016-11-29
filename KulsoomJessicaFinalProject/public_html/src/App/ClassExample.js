/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ClassExample() {
    this.armDistX = 0;
    this.armDistY = 1.2;
    
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
    
    //mouse
    this.mXfSq =  new SquareRenderable(this.mConstColorShader);
    this.mXfSq.setColor([0.4, 0, 0.4, 1]);
    this.mXfSq.getXform().setSize(0.2, 0.2);

    this.mParent = new SnowmanBody(this.mConstColorShader);
    
    this.mDirectManipulator = new DirectManipulation(this.mConstColorShader, true);
    var xfDM = this.mDirectManipulator.getXform();
    xfDM.setPosition(0, 5);
    
    this.mOldSizeOfDirectManipulatorForScale = xfDM.getSize();
    this.mOldRotationInRad = xfDM.getRotationInRad();
    this.mOldPosition = xfDM.getPosition();
}

ClassExample.prototype.createArmSegment = function(x,y)
{
    //child
    var childArm = new ArmSegment(this.mConstColorShader, "LeftGen 1",
                            x, y);
    this.mParent.addAsChild(childArm);
    
    //grandChild
    var grandChildArm = new ArmSegment(this.mConstColorShader, "LeftGen 2",
                            x, y + 1.2);
    childArm.addAsChild(grandChildArm);
};

ClassExample.prototype.addHat = function()
{
     var hat = new Hat(this.mConstColorShader);
     hat.getXform().setPosition(-5, 5);
     this.mParent.addAsChild(hat);
};

ClassExample.prototype.addMouth = function()
{
     var mouth = new Mouth(this.mConstColorShader);
     mouth.getXform().setPosition(-5, 5);
     this.mParent.addAsChild(mouth);
};

ClassExample.prototype.addEyes = function()
{
     var eyes = new Eyes(this.mConstColorShader);
     eyes.getXform().setPosition(-5, 5);
     this.mParent.addAsChild(eyes);
};

ClassExample.prototype.addNose = function()
{
     var nose = new CarrotNose(this.mConstColorShader);
     nose.getXform().setPosition(-5, 5);
     this.mParent.addAsChild(nose);
};

ClassExample.prototype.addButtons = function()
{
     var buttons = new Buttons(this.mConstColorShader);
     buttons.getXform().setPosition(-5, 5);
     this.mParent.addAsChild(buttons);
};

ClassExample.prototype.addArms = function()
{
    console.log("adding arms called");
     //var arms = new ArmSegment(this.mConstColorShader);
     this.createArmSegment(-5, 5);
     //this.mParent.addAsChild(arms);
};

ClassExample.prototype.addEyebrows = function()
{
     var eyebrows = new EyeBrows(this.mConstColorShader);
     eyebrows.getXform().setPosition(-5, 5);
     this.mParent.addAsChild(eyebrows);
};

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


ClassExample.prototype.translateSceneNode3 = function (newX, newY) {
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
        else{
            for(var i = 0; i < this.mParent.childrenSize(); i++){
                if(this.mDirectManipulator.getSceneNode() === this.mParent.getChildAt(i)){
                    if(parentSize[0] === 1 && parentSize[1] === 1){
                        this.mDirectManipulator.getSceneNode().getXform().setPosition(translationX/parentSize[0], translationY/parentSize[1]);
                    }
                    else{
                        if(mManipulatorName.indexOf("Right") !== -1){   
                            console.log("is this section called?");
                            this.mDirectManipulator.getSceneNode().getXform().setPosition((newX - 2)/parentSize[0], newY/parentSize[1]);
                        }
                        else{
                            this.mDirectManipulator.getSceneNode().getXform().setPosition((newX + 2)/parentSize[0], newY/parentSize[1]);
                        }

                    }
                }
                else if(this.mParent.getChildAt(i).childrenSize() > 0){
                    for(var j = 0; j < this.mParent.getChildAt(i).childrenSize(); j++){
                        if(this.mDirectManipulator.getSceneNode() === this.mParent.getChildAt(i).getChildAt(j)){
                            var childScale = 0.0;
                            var scaleRespectToChildX = 0.0;
                            var scaleRespectToChildY = 0.0;
                            if(this.mDirectManipulator.getSceneNode().mName === "LeftGen 2"){

                                console.log("moving left");
                                childScale = this.mParent.getChildAt(i).getXform().getSize();
                                scaleRespectToChildX = (newX + 2)/childScale[0];
                                scaleRespectToChildY = (newY - 2)/childScale[1];
                            }
                            else
                            {
                                childScale = this.mParent.getChildAt(i).getXform().getSize();
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
                }
            }
        }   
    }
};

ClassExample.prototype.draw = function (camera) {
    // Step F: Starts the drawing by activating the camera
    camera.setupViewProjection();
    

    this.mParent.draw(camera);
    //this.mParent.drawPivot(camera);
    var m = this.mParent.getXform().getXform();
    if(this.vmShouldDrawControl){
        for(var i = 0; i < this.mParent.childrenSize(); i++){
            var mChild = this.mParent.getChildAt(i).getXform().getXform();
            mat4.multiply(mChild, m, mChild);
            this.mParent.getChildAt(i).drawPivot(camera, mChild);
            //mChild = this.mParent.getChildAt(i).getXform().getXform();
            if(this.mParent.getChildAt(i).childrenSize() > 0){
                for(var j = 0; j < this.mParent.getChildAt(i).childrenSize(); j++){
                    var grandChild = this.mParent.getChildAt(i).getChildAt(j).getXform().getXform();
                    mat4.multiply(grandChild, mChild, grandChild);
                    this.mParent.getChildAt(i).getChildAt(j).drawPivot(camera, grandChild);
                }       
            }
        }
    }
    if (this.vmShouldDrawControl) {
        this.mHeadSq.draw(camera);
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