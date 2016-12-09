/*
 * File: CircleRenderable.js
 *  
 * gets the geometries from the circle buffer
 */
/*jslint node: true, vars: true */
/*global gEngine, Renderable */
/* find out more about jslint: http://www.jslint.com/help.html */

// Constructor and object definition
"use strict";  // Operate in Strict mode such that variables must be declared before used!

function IcicleRenderable(shader) {
    Renderable.call(this, shader);

    this.mGLBuffer = gEngine.VertexBuffer.getIcicleVertexRef();
    this.mBufferSize = gEngine.VertexBuffer.getIcicleVertexSize();
    this.mGLDrawType = gEngine.Core.getGL().TRIANGLE_STRIP;
}
gEngine.Core.inheritPrototype(IcicleRenderable, Renderable);