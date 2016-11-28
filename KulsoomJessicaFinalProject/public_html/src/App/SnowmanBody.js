/*
 * File: SnowmanBody.js 
  */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment, Manipulator */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SnowmanBody(shader) {
    SceneNode.call(this, shader, "Base", true);

    // shapes in the base
    //bottom
    var obj = new CircleRenderable(shader);  
    this.addToSet(obj);
    obj.setColor([1.0, 1.0, 1.0, 1]);
    var xf = obj.getXform();
    xf.setSize(1.4, 1.4);
    
    //middle
    obj = new CircleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([1.0, 1.0, 1.0, 1]);
    var xf = obj.getXform();
    xf.setSize(1.3, 1.3);
    xf.setPosition(0,1.9);
    
    //top
    obj = new CircleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([1.0, 1.0, 1.0, 1]);
    var xf = obj.getXform();
    xf.setSize(1.2, 1.2);
    xf.setPosition(0,3.7);
}
gEngine.Core.inheritPrototype(SnowmanBody, SceneNode);

SnowmanBody.prototype.getChildXformAt = function (index) {
    return this.mChildren[index].getXform();
};

SnowmanBody.prototype.getChildAt = function (index) {
    return this.mChildren[index];
};

SnowmanBody.prototype.parentXform = function () {
    return this.getXform();
};
