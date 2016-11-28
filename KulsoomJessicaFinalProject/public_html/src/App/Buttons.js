/*
 * File: MyGame.js 
 * This is the logic of our game. For now, this is very simple.
 */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function Buttons(shader) {
    SceneNode.call(this, shader, "Buttons", false);   // calling super class constructor

    var obj = new CircleRenderable(shader);
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(.1, .1);
    
    obj = new CircleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(0.1, 0.1);
    xf.setPosition(0, 0.4);
    
    obj = new CircleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([0, 0, 0, 1]);
    var xf = obj.getXform();
    xf.setSize(0.1, 0.1);
    xf.setPosition(0, 0.8);
}

gEngine.Core.inheritPrototype(Buttons, SceneNode);

Buttons.prototype.parentXform = function () {
    return this.getXform();
};
