#version 330 compatibility

in vec2 vST;

uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform sampler3D Noise3;
uniform float uNoiseFreq;
in vec3 vMCposition;
uniform float uNoiseAmp;
uniform float uAlpha;



const vec3 BgColor = vec3(1.,0.,0.);
const vec3 DotColor = vec3(1., 1., 0.);

in float vLightIntensity;

void
main() 
{
    vec4 nv  = texture( Noise3, uNoiseFreq*vMCposition );
    // give the noise a range of [-1.,+1.]:

    float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
    n = n - 2.;                             // -1. -> 1.
    n*= uNoiseAmp;
	float Ar = uAd/2.;
	float Br = uBd/2.;
	int numins = int( vST.s / uAd );
	int numint = int( vST.t / uBd );
	//vec4 Background = vec4( 1., 1., 1., 1.);
    float sc = float(numins) * uAd  +  Ar;
	float tc = float(numint) * uBd  +  Br;
    float ds = vST.s - sc;                   
    float dt = vST.t - tc;   
    float oldDist = sqrt( ds*ds + dt*dt );
    float newDist = oldDist + n;
    float scale = newDist / oldDist; 
    //scale ds then divide by Ar
	ds *= scale;
	ds /= Ar;
	//scale dt then divide by Br
	dt *= scale;
	dt /= Br;

	float d = ds*ds + dt*dt;
	float t = smoothstep( 1. - uTol, 1. + uTol, d );
    
	vec3 mixColor = mix(DotColor, BgColor, t);
	vec3 rgb = vLightIntensity * mixColor;
	gl_FragColor = vec4(rgb, 1.);
	
	
    if (d >= 1. && uAlpha<=1.) {
	if(uAlpha==0){
		discard;
	}
	else{
		gl_FragColor = vec4(rgb, 1.);
	}
    }
   


}