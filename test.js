var generate = require('./').generate
var test = require('tape').test

var strip = /\s*/g

//this test seems fragile, to say the least

var expected0 = {
    fragment: "#ifdef GL_ES\
        precision mediump float;\
        #endif\
        varying vec4 v_col;\
        varying vec2 v_tex0;\
        uniform sampler2D texture0;\
        varying vec2 v_tex1;\
        uniform sampler2D texture1;\
        uniform vec4 tint;\
        void main() {\
           gl_FragColor = v_col *  texture2D(texture0,  v_tex0) * texture2D(texture1,  v_tex1) * tint;\
        }".replace(strip, ''),

    vertex: "attribute vec4 position;\
        attribute vec4 color;\
        attribute vec2 texcoord0;\
        attribute vec2 texcoord1;\
        uniform mat4 projection;\
        uniform mat4 view;\
        uniform mat4 model;\
        varying vec4 v_col;\
        varying vec2 v_tex0;\
        varying vec2 v_tex1;\
        void main() {\
           gl_Position = projection * view * model * position;\
           v_col = color;\
           v_tex0 = texcoord0;\
           v_tex1 = texcoord1;\
           gl_PointSize = 1.0;\
        }".replace(strip, '')
}

test('generates correct shader source', function(t) {
    var source = generate({
        normal: false,
        texcoord: 2,
        color: true
    })
    t.equal( source.vertex.replace(strip, ''), expected0.vertex, 'vertex matches' )
    t.equal( source.fragment.replace(strip, ''), expected0.fragment, 'fragment matches' )

    var source = generate({
        texcoord: true,
        color: true,
        normal: false
    })

    t.end()
})