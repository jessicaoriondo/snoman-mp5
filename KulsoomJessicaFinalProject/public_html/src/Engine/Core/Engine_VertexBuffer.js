/*
 * File: EngineCore_VertexBuffer.js
 *  
 * defines the object that supports the loading and using of the buffer that 
 * contains vertex positions of a square onto the gGL context
 * 
 * Notice, this is a singleton object.
 */

/*jslint node: true, vars: true */
/*global gEngine: false, Float32Array: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

var gEngine = gEngine || { };

// The VertexBuffer object
gEngine.VertexBuffer = (function () {
    // reference to the vertex positions for the square in the gl context
    var mSquareVertexBuffer = null;
    var mCircleVertexBuffer = null;
    var mTriangleVertexBuffer = null;
    var mHexagonVertexBuffer = null;
    
    var verticecOfTriangle = [
        0.5, 0.5, 0.0,
        -1, 0, 0.0,
        0.5, -0.5, 0.0
    ];

    // First: define the vertices for a square
    var verticesOfSquare = [
        0.5, 0.5, 0.0,
        -0.5, 0.5, 0.0,
        0.5, -0.5, 0.0,
        -0.5, -0.5, 0.0
    ];
    
    var kCircleVertices = 50;
    var computeCircleVertices = function (v) {
        var theta = 2 * Math.PI / kCircleVertices;
        var i, x, y, offset = 3;
        v[0] = 0; v[1] = 0; v[2] = 0;
        for (i = 0; i < kCircleVertices; i++) {
            x = Math.cos(i * theta);
            y = Math.sin(i * theta);
            v[offset] = x; offset++;
            v[offset] = y; offset++;
            v[offset] = 0; offset++;
        }
        v[offset] = Math.cos(0); offset++;
        v[offset] = Math.sin(0); offset++;
        v[offset] = 0.0;
    };
    
    var kHexagonVertices = 6;
    var computeHexagonVertices = function (v) {
        var theta = 2 * Math.PI / kHexagonVertices;
        var i, x, y, offset = 3;
        v[0] = 0; v[1] = 0; v[2] = 0;
        for (i = 0; i < kHexagonVertices; i++) {
            x = Math.cos(i * theta);
            y = Math.sin(i * theta);
            v[offset] = x; offset++;
            v[offset] = y; offset++;
            v[offset] = 0; offset++;
        }
        v[offset] = Math.cos(0); offset++;
        v[offset] = Math.sin(0); offset++;
        v[offset] = 0.0;
    };
    
    var initialize = function () {
        var gl = gEngine.Core.getGL();

        // Step A: Create a buffer on the gGL context for our vertex positions
        mSquareVertexBuffer = gl.createBuffer();

        // Step B: Activate vertexBuffer
        gl.bindBuffer(gl.ARRAY_BUFFER, mSquareVertexBuffer);

        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticesOfSquare), gl.STATIC_DRAW);
        
        // now do circle
        var v = [];
        computeCircleVertices(v);
        mCircleVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mCircleVertexBuffer);
        // Step C: Loads verticesOfSquare into the vertexBuffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(v), gl.STATIC_DRAW);
        
        //triangle
        mTriangleVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mTriangleVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verticecOfTriangle), gl.STATIC_DRAW);
        
        //hexagon
        var vHex = [];
        computeHexagonVertices(vHex);
        mHexagonVertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, mHexagonVertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vHex), gl.STATIC_DRAW);
    };

    var getGLVertexRef = function () { return mSquareVertexBuffer; };
    var getSquareVertexRef = function () { return mSquareVertexBuffer; };
    var getSquareVertexSize = function () { return 4; };
    
    var getCircleVertexRef = function () { return mCircleVertexBuffer; };
    var getCircleVertexSize = function() { return kCircleVertices + 2; };
    
    var getTriangleVertexRef = function() {return mTriangleVertexBuffer; };
    var getTriangleVertexSize = function() {return 3; };
    
    var getHexagonVertexRef = function() {return mHexagonVertexBuffer; };
    var getHexagonVertexSize = function() {return kHexagonVertices + 2; };
    
    var mPublic = {
        initialize: initialize,
        getSquareVertexRef: getSquareVertexRef,
        getSquareVertexSize: getSquareVertexSize,
        getCircleVertexRef: getCircleVertexRef,
        getCircleVertexSize: getCircleVertexSize,
        getTriangleVertexRef: getTriangleVertexRef,
        getTriangleVertexSize: getTriangleVertexSize,
        getHexagonVertexRef: getHexagonVertexRef,
        getHexagonVertexSize: getHexagonVertexSize
    };

    return mPublic;
}());