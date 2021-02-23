float snow(float x, float y, float radius, float feathering, vec2 pos2){
    vec2 pos=vec2(x, y)-uv();
    float r = length(pos)*2.0;
    float a = atan(pos.y,pos.x);
    float r2 = length(pos2)*2.;
    float a2 = atan(pos2.y, pos2.x);
    float f = smoothstep(-1.,2., cos(a*6.+PI-a2*2.))*radius+0.05;
    return float( 1.-smoothstep(f,f+feathering,r) );
}
/*
vec2 outMove(vec2 space, vec2 center, float amount){
    vec2
}*/

void main () {
    vec2 stN = uvN();
    vec2 st = uv();
    vec3 color = black;
    vec2 mouseP=mouse.xy/resolution.xy;
    mouseP=vec2(mouseP.x*2.-2., 1.0- mouseP.y);
    vec2 pos2= vec2(0.)-mouseP;

    vec2 n=vec2(0.);
    n.y=1.-2.*fract(time*.8);
    n.x=cos(n.y*PI+time*.8)*.5;
    vec3 snow1=snow(n.x,n.y,.15*bands.x, bands.x*.1, pos2)*teal;
    color=snow1;
  
  //stage 2
 /*
    color=black; 
    for (int i = 0; i < 80; i++) {
        vec2 m;
        m.x = 2.-rand(float(i)+time*.00001)*4.;
        m.y = 1.-fract(float(i)*PI+time*.1)*2.;
        
      // m=rotate(m,vec2(0.), time*0.2);
    
      //  m.x = fract(time*.2)*2.*cos(float(i))*rand(float(i)+time*.00001);
      //  m.y = fract(time*.2)*2.*sin(float(i))*rand(float(i)+time*.00001);
        
       color+=snow(m.x, m.y,.15*bands.x, bands.x*.1, pos2)*teal;
       color+=snow(m.x, m.y,.3*bands.y, bands.y*.3, pos2)*blue*bands.w*2.;
       
    }
    
	vec3 bb = texture2D(backbuffer,  stN).rgb;
	
 //   color = mix(color, bb, .85);
*/
    

/*
    float frequency = 1.5;
    float gain = 1.;
    float thickness = .1;
    st.x+=sin( st.y * frequency + time * 4.)*gain;
    vec3 color1 = vec3(abs( thickness *bands.x*8./ st.x ));

    color*=color1;
*/
	gl_FragColor = vec4(color  , 1.0);
}