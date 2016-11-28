/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function EyeBrows(shader) {
    SceneNode.call(this, shader, "Eye Brows", false);   // calling super class constructor

    var obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(.3, .1);
    xf.setPosition(0.3, 0);
    
    var obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(.3, .1);
    xf.setPosition(-0.3, 0);
}

gEngine.Core.inheritPrototype(EyeBrows, SceneNode);

EyeBrows.prototype.parentXform = function () {
    return this.getXform();
};


