/*
 * File: SnowmanBody.js 
  */
/*jslint node: true, vars: true */
/*global gEngine, SimpleShader, SquareRenderable, SceneNode, ArmSegment, Manipulator */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function CarrotNose(shader) {
    SceneNode.call(this, shader, "Nose", false);

    // shapes in the base
    //bottom
    var obj = new TriangleRenderable(shader); 
    this.addToSet(obj);
    obj.setColor([252/255.0, 114/255.0, 2/255.0, 1]);
    var xf = obj.getXform();
    xf.setSize(.3, .3);
   
}
gEngine.Core.inheritPrototype(CarrotNose, SceneNode);

CarrotNose.prototype.parentXform = function () {
    return this.getXform();
};



