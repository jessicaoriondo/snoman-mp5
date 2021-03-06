/* File: SceneNode.js 
 *
 * Support for grouping of Renderables with custom pivot ability
 */

/*jslint node: true, vars: true */
/*global PivotedTransform, SquareRenderable  */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!


function SceneNode(shader, name, drawPivot) {
    this.mName = name;
    this.mSet = [];
    this.mChildren = [];
    this.mXform = new PivotedTransform();
//    this.mtoggleDrawPivot = true;

//    this.mPivotPos = new SquareRenderable(shader);
//    this.mPivotPos.setColor([1, 0, 0, 1]); // default color
//    var xf = this.mPivotPos.getXform();
//    xf.setSize(0.2, 0.2); // always this size

}

//SceneNode.prototype.toggleDrawPivot = function () { 
//    if(this.mtoggleDrawPivot){
//        this.mtoggleDrawPivot = false;
//    }
//    else{
//        this.mtoggleDrawPivot = true;
//    }
//};

SceneNode.prototype.setName = function (n) { this.mName = n; };
SceneNode.prototype.getName = function () { return this.mName; };

SceneNode.prototype.getXform = function () { return this.mXform; };

SceneNode.prototype.size = function () { return this.mSet.length; };

SceneNode.prototype.childrenSize = function () { return this.mChildren.length; };

//SceneNode.prototype.getPivot = function () {
//    return this.mPivotPos;
//};

SceneNode.prototype.getRenderableAt = function (index) {
    return this.mSet[index];
};

SceneNode.prototype.getRenderables = function()
{
    return this.mSet;
};

SceneNode.prototype.addToSet = function (obj) {
    this.mSet.push(obj);
};
SceneNode.prototype.removeFromSet = function (obj) {
    var index = this.mSet.indexOf(obj);
    if (index > -1)
        this.mSet.splice(index, 1);
};
SceneNode.prototype.moveToLast = function (obj) {
    this.removeFromSet(obj);
    this.addToSet(obj);
};

// support children opeations
SceneNode.prototype.addAsChild = function (node) {
    this.mChildren.push(node);
};
SceneNode.prototype.removeChild= function (node) {
    var index = this.mChildren.indexOf(node);
    if (index > -1)
        this.mChildren.splice(index, 1);
};
SceneNode.prototype.getChildAt = function (index) {
    return this.mChildren[index];
};
SceneNode.prototype.getChildren = function () {
    return this.mChildren;
};

SceneNode.prototype.draw = function (aCamera, parentMat) {
    var i;
    var xfMat = this.mXform.getXform();
    if (parentMat !== undefined)
        mat4.multiply(xfMat, parentMat, xfMat);
    
    // Draw our own!
    for (i = 1; i < this.mSet.length; i++) {
        this.mSet[i].draw(aCamera, xfMat); // pass to each renderable
    }
    
    // now draw the children
    for (i = 0; i < this.mChildren.length; i++) {
        this.mChildren[i].draw(aCamera, xfMat); // pass to each renderable
    }
    
    // for debugging, let's draw the pivot position
//    if (this.mtoggleDrawPivot) {
//        var pxf = this.getXform();
//        var t = pxf.getPosition();
//        var p = pxf.getPivot();
//        var xf = this.mPivotPos.getXform();
//        xf.setPosition(p[0] + t[0], p[1] + t[1]);
//        this.mPivotPos.draw(aCamera, parentMat);
//    }
};

//SceneNode.prototype.drawPivot = function (aCamera, parentMat) {
//    var pxf = this.getXform();
//    var t = pxf.getPosition();
//    var p = pxf.getPivot();
//    var xf = this.mPivotPos.getXform();
//    xf.setPosition(p[0] + t[0], p[1] + t[1]);
//    this.mPivotPos.draw(aCamera, parentMat);
//};

SceneNode.prototype.setColor = function (color) {
    for(var i = 1; i < this.mSet.length; i++){
        this.mSet[i].setColor(color);
    }
};