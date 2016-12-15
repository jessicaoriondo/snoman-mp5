/* 
 * File: MainController.js
 * Container controller for the entire world
 */

/*jslint node: true, vars: true, bitwise: true */
/*global angular, document, ClassExample, Camera, CanvasMouseSupport */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";

// Creates the "backend" logical support for appMyExample
var myModule = angular.module("appMyExample", ["CSS450Timer", "CSS450Slider", "CSS450Xform"]);

// registers the constructor for the controller
// NOTE: the constructor is only called _AFTER_ the </body> tag is encountered
//       this code does NOT run until the end of loading the HTML page
myModule.controller("MainCtrl", function ($scope) {
    // Initialize the graphics system
    gEngine.Core.initializeWebGL('GLCanvas');
    $scope.mCanvasMouse = new CanvasMouseSupport('GLCanvas');
    $scope.mMode = "Build Mode";
    $scope.activateBuildMode = true;
    $scope.isDeleteModeActivated = false;
    $scope.colorHex = "no color chosen";
    $scope.hideButtons = false;
    $scope.gameStarted = false;
    // Radio button selection support
    $scope.eSelection = [
        {label: "Parent"},
        {label: "LeftChild"},
        {label: "TopChild"},
        {label: "RightChild"}
    ];
    
    $scope.builderGameButton = "Play Game";
    $scope.deleteButtonLabel = "Delete";
    $scope.gameResult = "";
    $scope.gameTime = "";
    
    $scope.mWhichCamera = "Large";

       // this is the model
    $scope.mMyWorld = new ClassExample();
    $scope.mSelectedXform = $scope.mMyWorld.parentXform();
    $scope.mSelectedEcho = $scope.eSelection[0].label;
    
    $scope.mMouseOver = "Nothing";
    $scope.mLastWCPosX = 0;
    $scope.mLastWCPosY = 0;

    $scope.mView = new Camera(
                [-15, 10],         // wc Center
                50,                // wc Wdith
                [0, 0, 1200, 600]);  // viewport: left, bottom, width, height
    //$scope.mView.setBackgroundColor([0.9, 0.7, 0.7, 0.1]);
                
    $scope.mBuildView = new Camera(
                [0, 2],// wc Center
                10, // wc width
                [0, 0, 600, 600]);  // viewport: left, bottom, width, height
                
    $scope.mBuildView.setBackgroundColor([126.0/255, 194.0/255, 241.0/255, .5]);
    
    $scope.mBuildView.setViewport([0, 0, 600, 600]);
     
    
    //http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    var convertHexToRGB = function(hex){
        var r, g, b;
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        r = parseInt(result[1], 16);
        g = parseInt(result[2], 16);
        b = parseInt(result[3], 16);
        
        return [r/255, g/255, b/255, 1];
    };
   
    //binded to color picker with ng-change
    //it will change color of the most recent shape
    $scope.changeColor = function(){
        
        if($scope.mMyWorld.vmShouldDrawDirectManipulator){
            console.log("here");
            $scope.mMyWorld.mColorChange = convertHexToRGB($scope.colorHex);
        }
    };
    
    $scope.computeWCPos = function (event) {
        var wcPos = [0, 0];
        $scope.mClientX = event.clientX;
        $scope.mClientY = event.clientY;
        
        $scope.mCanvasX = $scope.mCanvasMouse.getPixelXPos(event);
        $scope.mCanvasY = $scope.mCanvasMouse.getPixelYPos(event);
        var useCam = $scope.mView; // assume using this camera
        $scope.mWhichCamera = "Large";
        if ($scope.mBuildView.isMouseInViewport($scope.mCanvasX, $scope.mCanvasY)) {
            useCam = $scope.mBuildView;
            $scope.mWhichCamera = "Small";
        }
        
        // these are "private functions" on the camera, 
        // for the purpose of clear illustration, we will call them
        $scope.mViewportX = useCam._viewportX($scope.mCanvasX);
        $scope.mViewportY = useCam._viewportY($scope.mCanvasY);
        
        wcPos[0] = useCam.mouseWCX($scope.mCanvasX);
        wcPos[1] = useCam.mouseWCY($scope.mCanvasY);
        $scope.mCameraX = wcPos[0];
        $scope.mCameraY = wcPos[1];
       
        return wcPos;
    };
    
    $scope.toggleBuildMode = function(){
        if($scope.activateBuildMode){
            $scope.activateBuildMode = false;
            $scope.mMyWorld.mIsDeleteMode = false;
            $scope.mMode = "Game Mode";
            $scope.mMyWorld.destroyIcicles();
            $scope.hideButtons = true;
            $scope.startTime = Date.now();
            $scope.mMyWorld.vmShouldDrawControl = false;
            $scope.mMyWorld.vmShouldDrawDirectManipulator = false;
            $scope.builderGameButton = "Customize";
        }
        else{
            $scope.mMyWorld.mIsDeleteMode = false;
            $scope.activateBuildMode = true;
            $scope.mMode = "Build Mode";
            $scope.mMyWorld.mParent.getXform().setPosition(0,0);
            $scope.hideButtons = false;
            $scope.gameStarted = false;
            $scope.builderGameButton = "Play Game";
        }
    };
    
    $scope.activateDeleteMode = function(){
        if($scope.isDeleteModeActivated){
            $scope.isDeleteModeActivated = false;
            $scope.mMyWorld.mIsDeleteMode = false;
            $scope.mMode = "Build Mode";
            $scope.deleteButtonLabel = "Delete";
        }
        else{
            $scope.isDeleteModeActivated = true;
            $scope.mMyWorld.mIsDeleteMode = true;
            $scope.mMode = "Delete Mode";
            $scope.deleteButtonLabel = "Build";
        }
    };
    
    $scope.userDeleteShape = function(event){
        
        var wcPos = $scope.computeWCPos(event);
        if($scope.mMode === "Delete Mode"){
            console.log("Trying to delete...");
            $scope.mMyWorld.detectMouseOverToDelete(wcPos[0], wcPos[1], event.which === 1);
        }
    };

    $scope.mainTimerHandler = function () {
        
        // Step E: Clear the canvas
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);        // Clear the canvas
        //
        // $scope.mMyWorld.update();
        $scope.mMyWorld.draw($scope.mView);
        if($scope.activateBuildMode){
            $scope.mMyWorld.draw($scope.mBuildView);
        }
        
        $scope.mMyWorld.changeColor();
        
        if($scope.mMode === "Game Mode" && $scope.gameStarted)
        {
            $scope.mMyWorld.drawIcicles($scope.mView);
            var collided = $scope.mMyWorld.checkCollision(-2.5);
            
            if(collided)
            {
                modal.style.display = "block";
                $scope.gameResult = "You got hit by an icicle!";
                $scope.gameTime = ":P\n\You survived for:\n\n" + 
                        ($scope.elapsedTime / 1000).toFixed(3) + "s";
                $scope.mMyWorld.destroyIcicles();
                $scope.gameStarted = false;
                $scope.startTime = Date.now();
            }
            else{
            
                $scope.mMyWorld.dropIcicle();
            }
            
            
        }
    };
    
    //*******************ADDING ICICLE TIME HANDLER********************
    $scope.icicleTimerHandler = function()
    {
        if($scope.gameStarted)
        {
            $scope.addIcicle();  
            $scope.addIcicle();
            $scope.addIcicle();
            
        }
    };
    
    $scope.icicleTimerHandler2 = function()
    {
        if($scope.gameStarted)
        {
            $scope.addIcicle();       
        }
    };
    
    $scope.startTime = Date.now();

    $scope.interval = setInterval(function() {
        $scope.elapsedTime = Date.now() - $scope.startTime;
        if($scope.gameStarted){
            document.getElementById("timer").innerHTML = ($scope.elapsedTime / 1000).toFixed(3);
        }
        else
        {
            document.getElementById("timer").innerHTML = 0.0;
        }
    }, 100);
    //**************************************************************************
    

    $scope.serviceMove = function (event) {

        var wcPos = $scope.computeWCPos(event);
        $scope.mMouseOver = $scope.mMyWorld.detectMouseOver(wcPos[0], wcPos[1], (event.which===1));
    };
    
    $scope.serviceKeyPress = function(event) {
        if($scope.mMode ==="Game Mode" && !$scope.gameStarted)
        {
            if(event.keyCode === 32)
            {
                $scope.gameStarted = true;
                $scope.startTime = Date.now();
            }
        }
        
        if($scope.mMode === "Game Mode" && $scope.gameStarted)
        {
            var parentPos = $scope.mMyWorld.parentXform().getPosition();
            //var parentXpos = $scope.mView.mouseWCX(parentPos[0]);
            //var parentYpos = $scope.mView.mouseWCX(parentPos[1]);
            var leftBound = $scope.mView.mouseWCX(0);
            var rightBound = $scope.mView.mouseWCX(1200);
            
            //alert(parentPos[0] + " "+ leftBound + " "+ rightBound);
            if(parentPos[0] < rightBound && parentPos[0] > leftBound)
            {
                switch(event.keyCode){
                case 39: //right arrow key
                    if(parentPos[0]+2 < rightBound){
                        $scope.mMyWorld.parentXform().incXPosBy(0.5);
                    }
                    break;
                case 37: //left arrow key
                    if(parentPos[0]-2 > leftBound)
                    {
                        $scope.mMyWorld.parentXform().incXPosBy(-0.5);
                    }
                    break;

                }
                
                var collided = $scope.mMyWorld.checkCollision(-2.5);
            
            
                if(collided)
                {
                    

                    
                    
                    $scope.gameStarted = false;

                    modal.style.display = "block";
                    $scope.gameResult = "You got hit by an icicle!";
                    $scope.gameTime = ":P\n\You survived for:\n\n" + 
                            ($scope.elapsedTime / 1000).toFixed(3) + "s";

                    $scope.mMyWorld.destroyIcicles();
                }
                
            }
        }
    };
    
    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    };

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };

    
    $scope.isMouseOnScaleKnob = false;
    $scope.isMouseOnRotationKnob = false;
    $scope.isMouseOnTranslationKnob = false;
    
    $scope.LBDOnKnobPos = function(event){
        var scaleKnobIndex = $scope.mMouseOver.indexOf("DM Scale Knob");
        var rotationKnobIndex = $scope.mMouseOver.indexOf("DM Rotation Knob");
        var translationKnobIndex = $scope.mMouseOver.indexOf("Nothing");
        console.log("rotation String" + rotationKnobIndex);
        
        if(scaleKnobIndex !== -1 && $scope.mMode !== "Delete Mode"){            
            $scope.isMouseOnScaleKnob = true;
            $scope.isMouseOnRotationKnob = false;
            $scope.isMouseOnTranslationKnob = false;
        }
        else if(rotationKnobIndex !== -1 && $scope.mMode !== "Delete Mode"){
            console.log("rotation time!");
            $scope.isMouseOnScaleKnob = false;
            $scope.isMouseOnTranslationKnob = false;
            $scope.isMouseOnRotationKnob = true;
        }
        else if(translationKnobIndex === -1 && $scope.mMode !== "Delete Mode"){
            if(!$scope.isMouseOnTranslationKnob){
                console.log("translating");
                $scope.isMouseOnScaleKnob = false;
                $scope.isMouseOnTranslationKnob = true;
                $scope.isMouseOnRotationKnob = false;
            }
        }
        else{
            $scope.isMouseOnScaleKnob = false;
            $scope.isMouseOnRotationKnob = false;
            $scope.isMouseOnTranslationKnob = false;
            $scope.mMyWorld.vmShouldDrawDirectManipulator = false;
//            $scope.mMyWorld.mFirstLBMClickPos = null;
        }
    };
    
    $scope.dragKnobPos = function(event){
        if($scope.mMode === "Build Mode"){
            var wcPos = $scope.computeWCPos(event);

            if($scope.isMouseOnScaleKnob && event.which === 1){
                $scope.mMyWorld.scaleSceneNode(wcPos[0], wcPos[1]);
            }
            else if($scope.isMouseOnRotationKnob && event.which === 1){
                $scope.mMyWorld.rotateSceneNode(wcPos[0], wcPos[1]);
            }
            else if($scope.isMouseOnTranslationKnob && event.which === 1){
                
                var center = $scope.mBuildView.getWCCenter();
                var width = $scope.mBuildView.getWCWidth();
                width = width / 2;
                
                var height = $scope.mBuildView.getWCHeight();
                height = height / 2;
                
                if($scope.mMyWorld.inBoundsDuringBuildMode(wcPos[0], wcPos[1], 
                center[0] - width, center[0] + width, center[1] + height, center[1] - height)){
                    $scope.mMyWorld.translateSceneNode3(wcPos[0], wcPos[1]);
                }
            }
        }
    };
    
    $scope.addItem = function(SceneName)
    {
        
        switch(SceneName)
        {
            case "hat":
                 console.log("Item added " + SceneName);
                 $scope.mMyWorld.addHat();
                
                break;
            case "mouth":
                 console.log("Item added " + SceneName);
                 $scope.mMyWorld.addMouth();
                break;
                
            case "eyes":
                $scope.mMyWorld.addEyes();
                break;
                
            case "nose":
                $scope.mMyWorld.addNose();
                break;
                
            case "eyebrows":
                $scope.mMyWorld.addEyebrows();
                break;
            
            case "button":
                $scope.mMyWorld.addButtons();
                break;
            
            case "arms":
                $scope.mMyWorld.addArms();
                break;
            
            case "circle":
                $scope.mMyWorld.addCircle();
                break;
            
            case "square":
                $scope.mMyWorld.addSquare();
                break;
                
            case "triangle":
            $scope.mMyWorld.addTriangle();
            break;
            
            case "hexagon":
                $scope.mMyWorld.addHexagon();
                break;
        }
    };
    
    //handle icicles
    
    $scope.getRandomNum = function(min, max)
    {
        return Math.random() * (max - min + 1) + min;
    };
    
    $scope.addIcicle = function()
    {
        var leftBound = $scope.mView.mouseWCX(0);
        var rightBound = $scope.mView.mouseWCX(1200);
        var xpos = $scope.getRandomNum(leftBound-1, rightBound-1);
        $scope.mMyWorld.addIcicle(xpos);
    };
});