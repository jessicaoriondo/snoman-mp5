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

function HexagonRenderable(shader) {
    Renderable.call(this, shader);

    this.mGLBuffer = gEngine.VertexBuffer.getHexagonVertexRef();
    this.mBufferSize = gEngine.VertexBuffer.getHexagonVertexSize();
    this.mGLDrawType = gEngine.Core.getGL().TRIANGLE_FAN;
}
gEngine.Core.inheritPrototype(HexagonRenderable, Renderable);