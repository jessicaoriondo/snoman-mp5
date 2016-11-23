/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function ClassExample() {
    this.mSizeChange = 0.01;
    this.mChildShouldUpdate = false;
    this.mArmShouldRotate = false;
    this.mHeadShouldSpin = false;
    
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

    this.mParent = new SceneNode(this.mConstColorShader, "Root", true);
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
    
    this.mTopRChild = new ArmSegment(this.mConstColorShader, "LeftGen 2",
                            2, 2);
    this.mRightChild.addAsChild(this.mTopRChild);


    // shapes in the parent
    //bottom
    var obj = new CircleRenderable(this.mConstColorShader);  // the base
    this.mParent.addToSet(obj);
    obj.setColor([1.0, 1.0, 1.0, 1]);
    var xf = obj.getXform();
    xf.setSize(1.4, 1.4);
    
    //middle
    obj = new CircleRenderable(this.mConstColorShader);  // the base
    this.mParent.addToSet(obj);
    obj.setColor([1.0, 1.0, 1.0, 1]);
    var xf = obj.getXform();
    xf.setSize(1.3, 1.3);
    xf.setPosition(0,1.9);
    
    //top
    obj = new CircleRenderable(this.mConstColorShader);  // the base
    this.mParent.addToSet(obj);
    obj.setColor([1.0, 1.0, 1.0, 1]);
    var xf = obj.getXform();
    xf.setSize(1.2, 1.2);
    xf.setPosition(0,3.7);
    
//    
//    obj = new SquareRenderable(this.mConstColorShader); // The head
//    this.mParent.addToSet(obj);
//    obj.setColor([0.9, 0.8, 0.8, 1]);
//    xf = obj.getXform();
//    xf.setSize(1.3, 1.3);
    
    this.mDirectManipulator = new DirectManipulation(this.mConstColorShader, true);
    var xfDM = this.mDirectManipulator.getXform();
    xfDM.setPosition(0, 5);
    
    this.mFirstLBMClickPos = [0, 0];
    this.mDragLMBPos = [0, 0];
}

ClassExample.prototype.setFirstLBMClickPos = function (x, y) {
    
    console.log("x: " + x);
    console.log("y: " + y);
    this.mFirstLBMClickPos = [x, y];
    
    console.log("here: " + this.mFirstLBMClickPos);
};

ClassExample.prototype.getMouseDistanceForScale = function () {
    if(this.mFirstLBMClickPos !== null && this.mDragLMBPos !== null){

            //console.log(this.mFirstLBMClickPos);
//        var differenceX = this.mFirstLBMClickPos[0] - this.mDragLMBPos[0];
//        var differenceY = this.mFirstLBMClickPos[1] - this.mDragLMBPos[1];
//        return [differenceX, differenceY];
    }
};

ClassExample.prototype.scaleSceneNode = function () {
    if(this.mFirstLBMClickPos !== null && this.mDragLMBPos !== null){
        var addVal = ClassExample.prototype.getMouseDistanceForScale();
        
//        if(this.mDirectManipulator.getSceneNode() !== null){
//            console.log("WHY ISN'T IT WORKING");
//            
//            var oldWidth = this.mDirectManipulator.getSceneNode().getXform().getWidth();
//            this.mDirectManipulator.getSceneNode().getXform().setWidth(oldWidth + addVal[0]);
//            
//            var oldHeight = this.mDirectManipulator.getSceneNode().getXform().getHeight();
//            this.mDirectManipulator.getSceneNode().getXform().setHeight(oldHeight + addVal[1]);
//        }
    }
};

ClassExample.prototype.toggleHeadSpin = function () {
    this.mHeadShouldSpin = !this.mHeadShouldSpin; };

ClassExample.prototype.toggleChildUpdate = function () {
    this.mChildShouldUpdate = !this.mChildShouldUpdate; };

ClassExample.prototype.toggleArmRotate = function () {
    this.mArmShouldRotate = !this.mArmShouldRotate; };

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

ClassExample.prototype.update = function () {
    if (this.mChildShouldUpdate) {
        this.mLeftChild.update();
        this.mRightChild.update();
        this.mTopChild.update();
    }
    
    // 1. rotate the head (middle square on body)
    if (this.mHeadShouldSpin) {
        var xf = this.mParent.getRenderableAt(1).getXform(); // this is the middle square
        xf.incRotationByDegree(2);
        var d = xf.getRotationInDegree();
    }
    
    // 2. extend the lower-left hand
    if (this.mArmShouldRotate) {
        xf = this.leftChildXform();
        xf.incSizeBy(this.mSizeChange);
        if ((xf.getWidth() > 1.2) || (xf.getWidth() < 0.8))
            this.mSizeChange = -this.mSizeChange;
    
        // 3. slowly rotat the top arm
        xf = this.topChildXform();
        xf.incRotationByDegree(-1);
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