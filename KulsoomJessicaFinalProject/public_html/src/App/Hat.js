/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Hat(shader) {
    SceneNode.call(this, shader, "Hat", false);   // calling super class constructor
    
    var obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(2, .5);
    
    obj = new SquareRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(1.2, 1.2);
    xf.setPosition(0, .5);
}

gEngine.Core.inheritPrototype(Hat, SceneNode);

Hat.prototype.parentXform = function () {
    return this.getXform();
};


