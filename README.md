[![browser support](https://ci.testling.com/mattdesl/gl-basic-shader.png)](https://ci.testling.com/mattdesl/gl-basic-shader)

# gl-basic-shader

[![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

Generates and compiles a basic shader with some common attributes and uniforms and a Model, View, Projection vertex transform. Also includes a [command-line interface](#cli)

```js
var createShader = require('gl-basic-shader')
var shader = createShader(gl, {
	texcoord: true,    //vertex texcoords
	normal: false,     //vertex normals
	color: true,       //vertex colors
	tint: [1, 0, 0, 1] //uniform color tint
})

//do some stuff with it
shader.bind()
shader.uniforms.texture0 = 0
shader.attribuets.texcoord0.pointer() 
shader.attributes.color.pointer()
```

The resulting shader will be compiled with the generated source:

```glsl
// vertex shader
attribute vec4 position;
attribute vec4 color;
attribute vec2 texcoord0;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
varying vec4 v_col;
varying vec2 v_tex0;
void main() {
   gl_Position = projection * view * model * position;
   v_col = color;
   v_tex0 = texcoord0;
   gl_PointSize = 1.0;
}

//fragment shader 
#ifdef GL_ES
precision mediump float;
#endif
varying vec4 v_col;
varying vec2 v_tex0;
uniform sampler2D texture0;
uniform vec4 tint;
void main() {
   gl_FragColor = v_col *  texture2D(texture0,  v_tex0) * tint;
}
```

## Usage

[![NPM](https://nodei.co/npm/gl-basic-shader.png)](https://nodei.co/npm/gl-basic-shader/)

### `shader = createShader(gl[, options])`

Creates a basic shader with the given options:

- `texcoord` whether to generate `texcoord0` attribute vec2 and `texture0` sampler2D. If this is a number, then N texcoords and samplers will be used: `texture0`, `texture1`, etc.
- `normal` wherther to generate a `normal` attribute vec3
- `color` whether to generate a `color` attribute vec4
- `tint` the default value bound to the `tint` uniform vec4, if not specified then white is used
- `pointSize` the `gl_PointSize` for the vertex shader, defualt 1.0

If the `texcoord`, `normal` or `color` options are false (or `texcoord` is 0) then that attribute will not be included in the shader.

The `projection`, `model`, and `view` matrices are set to an identity matrix initially. 

### `createShader.generate([options])`

This function is exposed to provide the generated shader source, useful for testing and other purposes where GL shader compilation may not be desirable. The options are the same as the constructor.

```js
var source = require('gl-basic-shader').generate(options)
console.log(source.vertex, source.fragment, source.attributes, source.uniforms)
```

## attributes

The attributes. Some may not be present if not specified at construction. They use a fixed location for easier VAO bindings.

- `vec4 position` (location=0)
- `vec3 normal` (location=1)
- `vec4 color` (location=2)
- `vec2 texcoord0`, `texcoord1`, etc.. (location=3..N)

## uniforms

The uniforms. 

- `mat4 model`
- `mat4 view`
- `mat4 projection`
- `vec4 tint`
- `sampler2D texture0`, `texture1`, etc

## cli

You can also use the command line tool to print a generic shader.

Examples:

```sh
# print the vertex and fragment shader with the given options
gl-basic-shader --color --normal --texcoord=2

# print a new vertex shader to a file
gl-basic-shader --vert > vert.glsl

# pretty-print the JSON with extracted uniform/attribute info
# could then be fed easily into gl-shader-core
gl-basic-shader -jpe > shader.json
```

Full options:

```
Generate a basic shader.
Usage: gl-basic-shader [opts]

Options:
  --help, -h      show help message                   
  --color, -c     insert color vertex attribute       
  --texcoord, -t  insert texcoord vertex attribute(s) 
  --normal, -n    insert normal vertex attribute      
  --json, -j      json output                         
  --pretty, -p    pretty print json                   
  --extract, -e   extract attribs/uniforms (json only)
  --frag, -f      only show fragment shader           
  --vert, -v      only show vertex shader  
```

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/gl-basic-shader/blob/master/LICENSE.md) for details.
