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
    
    // Radio button selection support
    $scope.eSelection = [
        {label: "Parent"},
        {label: "LeftChild"},
        {label: "TopChild"},
        {label: "RightChild"}
    ];

       // this is the model
    $scope.mMyWorld = new ClassExample();
    $scope.mSelectedXform = $scope.mMyWorld.parentXform();
    $scope.mSelectedEcho = $scope.eSelection[0].label;
    
    $scope.mMouseOver = "Nothing";
    $scope.mLastWCPosX = 0;
    $scope.mLastWCPosY = 0;

    $scope.mView = new Camera(
                [0, 3],         // wc Center
                15,                // wc Wdith
                [0, 0, 800, 600]);  // viewport: left, bottom, width, height

    $scope.mainTimerHandler = function () {
        // 1. update the world
        $scope.mMyWorld.update();
        
        // Step E: Clear the canvas
        gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1]);        // Clear the canvas
        //
        // $scope.mMyWorld.update();
        $scope.mMyWorld.draw($scope.mView);
    };

    $scope.serviceSelection = function () {
        switch ($scope.mSelectedEcho) {
        case $scope.eSelection[0].label:
            $scope.mSelectedXform = $scope.mMyWorld.parentXform();
            break;
        case $scope.eSelection[1].label:
            $scope.mSelectedXform = $scope.mMyWorld.leftChildXform();
            break;
        case $scope.eSelection[2].label:
            $scope.mSelectedXform = $scope.mMyWorld.topChildXform();
            break;
        case $scope.eSelection[3].label:
            $scope.mSelectedXform = $scope.mMyWorld.rightChildXform();
            break;
        }
    };

    $scope.serviceMove = function (event) {
        var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
        var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
        $scope.mLastWCPosX = this.mView.mouseWCX(canvasX);
        $scope.mLastWCPosY = this.mView.mouseWCY(canvasY);
        $scope.mMouseOver = $scope.mMyWorld.detectMouseOver($scope.mLastWCPosX, $scope.mLastWCPosY, (event.which===1));
    };
    
    $scope.isMouseOnScaleKnob = false;
    $scope.isMouseOnRotationKnob = false;
    $scope.isMouseOnTranslationKnob = false;
    
    $scope.LBDOnKnobPos = function(event){
        var scaleKnobIndex = $scope.mMouseOver.indexOf("DM Scale Knob");
        var rotationKnobIndex = $scope.mMouseOver.indexOf("DM Rotation Knob");
        var translationKnobIndex = $scope.mMouseOver.indexOf("Nothing");
        console.log("rotation String" + rotationKnobIndex);
        
        if(scaleKnobIndex !== -1){            
            $scope.isMouseOnScaleKnob = true;
            $scope.isMouseOnRotationKnob = false;
            $scope.isMouseOnTranslationKnob = false;
        }
        else if(rotationKnobIndex !== -1){
            console.log("rotation time!");
            $scope.isMouseOnScaleKnob = false;
            $scope.isMouseOnTranslationKnob = false;
            $scope.isMouseOnRotationKnob = true;
        }
        else if(translationKnobIndex === -1){
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
        //console.log("is mouse on scale knob: " + $scope.isMouseOnScaleKnob);
        var canvasX = $scope.mCanvasMouse.getPixelXPos(event);
        var canvasY = $scope.mCanvasMouse.getPixelYPos(event);
        $scope.mLastWCPosX = this.mView.mouseWCX(canvasX);
        $scope.mLastWCPosY = this.mView.mouseWCY(canvasY);
            
        if($scope.isMouseOnScaleKnob && event.which === 1){
            $scope.mMyWorld.scaleSceneNode($scope.mLastWCPosX, $scope.mLastWCPosY);
        }
        else if($scope.isMouseOnRotationKnob && event.which === 1){
            $scope.mMyWorld.rotateSceneNode($scope.mLastWCPosX, $scope.mLastWCPosY);
        }
        else if($scope.isMouseOnTranslationKnob && event.which === 1){
            $scope.mMyWorld.translateSceneNode($scope.mLastWCPosX, $scope.mLastWCPosY);
        }
    };
});