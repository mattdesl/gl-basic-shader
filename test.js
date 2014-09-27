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

    var obj =  { 
      vertex: 'attribute vec4 position;\nattribute vec3 normal;\nattribute vec2 texcoord0;\nattribute vec2 texcoord1;\nuniform mat4 projection;\nuniform mat4 view;\nuniform mat4 model;\nvarying vec2 v_tex0;\nvarying vec2 v_tex1;\nvoid main() {\n   gl_Position = projection * view * model * position;\n   v_tex0 = texcoord0;\n   v_tex1 = texcoord1;\n   gl_PointSize = 1.0;\n}\n',
      fragment: '#ifdef GL_ES\nprecision mediump float;\n#endif\nvarying vec2 v_tex0;\nuniform sampler2D texture0;\nvarying vec2 v_tex1;\nuniform sampler2D texture1;\nuniform vec4 tint;\nvoid main() {\n   gl_FragColor =  texture2D(texture0,  v_tex0) * texture2D(texture1,  v_tex1) * tint;\n}',
      uniforms: 
       [ { type: 'mat4', name: 'projection' },
         { type: 'mat4', name: 'view' },
         { type: 'mat4', name: 'model' },
         { type: 'vec4', name: 'tint' },
         { type: 'sampler2D', name: 'texture0' },
         { type: 'sampler2D', name: 'texture1' } ],
      attributes: 
       [ { type: 'vec4', name: 'position', location: 0 },
         { type: 'vec3', name: 'normal', location: 1 },
         { type: 'vec2', name: 'texcoord0', location: 3 },
         { type: 'vec2', name: 'texcoord1', location: 4 } ] 
     }

    var r = generate({
        normal: true,
        texcoord: 2
    })

    t.deepEqual(r, obj)
    t.end()
})