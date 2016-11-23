/*
 * File: SquareRenderable.js
 *  
 * gtes the geometries from the square buffer
 */
/*jslint node: true, vars: true */
/*global gEngine, Renderable */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SquareRenderable(shader) {
    Renderable.call(this, shader);

    this.mGLBuffer = gEngine.VertexBuffer.getSquareVertexRef();
    this.mBufferSize = gEngine.VertexBuffer.getSquareVertexSize();
    this.mGLDrawType = gEngine.Core.getGL().TRIANGLE_STRIP;
}
gEngine.Core.inheritPrototype(SquareRenderable, Renderable);