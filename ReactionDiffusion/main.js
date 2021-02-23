const glslify = require('glslify')
let UfeedRate, UkillRate, UdA, UdB, Udiffusion, Uchange, Udchange

window.onload = function() { 
  const PARAMS = {
  feedRate: 0.0457,
  killRate: 0.0635,
  dA: 1.0,
  dB: 0.5,
  ReactionRate: 12,
  change: false,
  dchange: false,
};

const pane = new Tweakpane();
pane.addInput(PARAMS, 'feedRate', {
  min: 0,
  max: 0.1,
});
pane.addInput(PARAMS, 'killRate', {
  min: 0,
  max: 0.1,
});
pane.addInput(PARAMS, 'dA', {
  min: 0,
  max: 1,
});
pane.addInput(PARAMS, 'dB', {
  min: 0,
  max: 1,
});
pane.addInput(PARAMS, 'ReactionRate', {
  min: 1,
  max: 20,
});
pane.addInput(PARAMS, 'change');
pane.addInput(PARAMS, 'dchange');
const btn = pane.addButton({
  title: 'Reset',
});
btn.on('click', () => {
  PARAMS.feedRate=0.0457,
  PARAMS.killRate=0.0635,
  PARAMS.dA=1.0,
  PARAMS.dB=0.5,
  reset()
});
const btn2 = pane.addButton({
  title: 'Mitosis',
});
btn2.on('click', () => {
  PARAMS.feedRate=0.0367,
  PARAMS.killRate=0.0649,
  PARAMS.dA=1.0,
  PARAMS.dB=0.5,
  reset()
});




    let canvas = document.querySelector( 'canvas' ) 

    let size = window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight ;
  canvas.width = size
  canvas.height = size
//    canvas.width = window.innerWidth
//    canvas.height = window.innerHeight 
    let gl = canvas.getContext( 'webgl' ) 
    let stateSize = Math.pow( 2, Math.floor(Math.log(canvas.width)/Math.log(2)) )

    let verts = [ 
      1, 1, 
      -1, 1, 
      -1,-1, 
      1, 1, 
      -1, -1, 
      1, -1, 
    ]

    let vertBuffer = gl.createBuffer() 
    gl.bindBuffer( gl.ARRAY_BUFFER, vertBuffer ) 
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW ) 
    gl.vertexAttribPointer( 0, 2, gl.FLOAT, false, 0, 0 ) 
    gl.enableVertexAttribArray( 0 )

    let shaderScript = document.getElementById( 'vshader' )
    let shaderSource = glslify.file( './vert.glsl' )  
    const vertexShader = gl.createShader( gl.VERTEX_SHADER ) 
    gl.shaderSource( vertexShader, shaderSource ) 
    gl.compileShader( vertexShader )
    console.log( gl.getShaderInfoLog( vertexShader ) ) // create fragment shader to run our simulation
    
    shaderScript = document.getElementById( 'fshader_render' ) 
    shaderSource = glslify.file( './fshader_render.glsl' ) 
    const fragmentShaderRender = gl.createShader( gl.FRAGMENT_SHADER ) 
    gl.shaderSource( fragmentShaderRender, shaderSource ) 
    gl.compileShader( fragmentShaderRender ) 
    console.log( gl.getShaderInfoLog( fragmentShaderRender ) ) // create shader program const
      
    programRender = gl.createProgram() 
    gl.attachShader( programRender, vertexShader ) 
    gl.attachShader( programRender, fragmentShaderRender )
    gl.linkProgram( programRender )
    gl.useProgram( programRender )
    
    UfeedRate = gl.getUniformLocation( programRender, 'f' ) 
	  UkillRate = gl.getUniformLocation( programRender, 'k' ) 
    UdA = gl.getUniformLocation( programRender, 'dA' ) 
	  UdB = gl.getUniformLocation( programRender, 'dB' ) 
    Uchange = gl.getUniformLocation( programRender, 'change' ) 
    Udchange = gl.getUniformLocation( programRender, 'dchange' ) 
    // create pointer to vertex array and uniform sharing simulation size 
    const position = gl.getAttribLocation( programRender, 'a_position' )
    gl.enableVertexAttribArray( position ) 
    gl.vertexAttribPointer( position, 2, gl.FLOAT, false, 0,0 ) 
    let scale = gl.getUniformLocation( programRender, 'scale' ) 
    gl.uniform2f( scale, stateSize, stateSize )
      
    // create shader program to draw our simulation to the screen 
    shaderScript = document.getElementById( 'fshader_draw' ) 
    shaderSource = glslify.file( './fshader_draw.glsl' ) 
    fragmentShaderDraw = gl.createShader( gl.FRAGMENT_SHADER ) 
    gl.shaderSource( fragmentShaderDraw, shaderSource )
    gl.compileShader( fragmentShaderDraw ) 
    console.log( gl.getShaderInfoLog( fragmentShaderDraw ) ) 
      
    // create shader program
    programDraw = gl.createProgram() 
    gl.attachShader( programDraw, vertexShader ) 
    gl.attachShader( programDraw, fragmentShaderDraw ) 
    gl.linkProgram( programDraw )
    gl.useProgram( programDraw )

    scale = gl.getUniformLocation( programDraw, 'scale' ) 
    gl.uniform2f( scale, canvas.width,canvas.height ) 
    const position2 = gl.getAttribLocation( programDraw, 'a_position' ) 
    gl.enableVertexAttribArray( position2 )
    gl.vertexAttribPointer( position2, 2, gl.FLOAT, false, 0,0 )

    // enable floating point textures in the browser
    gl.getExtension('OES_texture_float'); 
    
    let texFront = gl.createTexture() 
    gl.bindTexture( gl.TEXTURE_2D, texFront ) 
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT ) 
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT ) 
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST )
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST ) 
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, stateSize, stateSize, 0, gl.RGBA, gl.FLOAT, null ) 
    
    let texBack = gl.createTexture() 
    gl.bindTexture( gl.TEXTURE_2D, texBack ) 
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT ) 
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT ) 
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST ) 
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST ) 
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, stateSize, stateSize, 0, gl.RGBA, gl.FLOAT, null )

    const pixelSize = 4 
    const feedSize = 48
    const initState = new Float32Array( stateSize * stateSize * pixelSize ) 
    const reset = function() { 
      for( let i = 0; i < stateSize; i++ ) { 
          for( let j = 0; j < stateSize * pixelSize; j+= pixelSize ) { 
          // this will be our 'a' value in the simulation 
          initState[ i * stateSize * pixelSize + j ] = 1 
          // selectively add 'b' value to middle of screen 
          if( i > stateSize / 2 - stateSize / feedSize  && i < stateSize / 2 + stateSize / feedSize ) { 
            const xmin = j > (stateSize*pixelSize) / 2 - stateSize / feedSize
            const xmax = j < (stateSize*pixelSize) / 2 + (stateSize*pixelSize) / feedSize 
            if( xmin && xmax ) { 
              initState[ i * stateSize * pixelSize + j + 1 ] = 1 
            } 
          } 
        } 
      } 
      
      gl.texSubImage2D( 
        gl.TEXTURE_2D, 0, 0, 0, stateSize, stateSize, gl.RGBA, gl.FLOAT, initState, 0 
      ) 
    }
    
    reset()

    const fb = gl.createFramebuffer() 
    const fb2 = gl.createFramebuffer() 
  
    const pingpong = function() {
      gl.bindFramebuffer( gl.FRAMEBUFFER, fb ) 
      // use the framebuffer to write to our texFront texture
      gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texFront, 0 ) 
      // set viewport to be the size of our state (reaction diffusion simulation) 
      // here, this represents the size that will be drawn onto our texture 
      gl.viewport(0, 0, stateSize, stateSize ) 
      // in our shaders, read from texBack, which is where we poked to 
      gl.bindTexture( gl.TEXTURE_2D, texBack ) // run shader 
      gl.drawArrays( gl.TRIANGLES, 0, 6 ) 
    
      gl.bindFramebuffer( gl.FRAMEBUFFER, fb2 )
      gl.framebufferTexture2D( gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texBack, 0 ) 
      // set our viewport to be the size of our canvas 
      // so that it will fill it entirely 
      gl.viewport(0, 0, canvas.width, canvas.height )
      // select the texture we would like to draw the the screen. 
      // note that webgl does not allow you to write to / read from the 
      // same texture in a single render pass. Because of the swap, we're 
      // displaying the state of our simulation ****before**** this render pass (frame) 
      gl.bindTexture( gl.TEXTURE_2D, texFront ) 
      // put simulation on screen 
      gl.drawArrays( gl.TRIANGLES, 0, 6 ) 
    }

    const draw = function() { 
      gl.useProgram( programRender ) 
	    gl.uniform1f( UfeedRate, PARAMS.feedRate )    
	    gl.uniform1f( UkillRate, PARAMS.killRate ) 
      gl.uniform1f( UdA, PARAMS.dA )  
      gl.uniform1f( UdB, PARAMS.dB ) 
      gl.uniform1f( Uchange, PARAMS.change ) 
      gl.uniform1f( Udchange, PARAMS.dchange ) 

      for( let i = 0; i < PARAMS.ReactionRate; i++ ) pingpong()
 
      // use the default framebuffer object by passing null 
      gl.bindFramebuffer( gl.FRAMEBUFFER, null ) 
    
      // set our viewport to be the size of our canvas 
      // so that it will fill it entirely 
      gl.viewport(0, 0, canvas.width, canvas.height )
      // select the texture we would like to draw the the screen. 
      gl.bindTexture( gl.TEXTURE_2D, texBack ) 
      // use our drawing (copy) shader 
      gl.useProgram( programDraw ) 
      // put simulation on screen
      gl.drawArrays( gl.TRIANGLES, 0, 6 ) 
        
      window.requestAnimationFrame( draw ) 
    }
     
    draw()
}