precision mediump float;

uniform vec3 cameraPosition;
uniform vec2 uFresnelStep;
uniform vec3 uFresnelColor;
uniform float uFresnelIntensity;
uniform float uColorFactor;
uniform sampler2D uAlbedoTex;
uniform sampler2D uAlphaTex;

varying vec2 vUv;
varying vec3 vRandom;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

float fresnel(vec3 N, vec3 V) {
  float f = max(dot(V, N), 0.0);
  float revF = 1.0-f;
  // return step(1.0-uFresnelStep.x, revF);
  return smoothstep(uFresnelStep.x, uFresnelStep.y, revF);
}

void main() {
  vec2 uv = vUv;
  vec4 color = texture2D(uAlbedoTex, uv);
  vec4 alpha = texture2D(uAlphaTex, uv);

  // fresnel
  // vec3 viewDir = normalize(vViewPosition);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 normal = normalize(vNormal);
  float fresnelVal = fresnel(normal, viewDir);
  vec3 fresnelColor = uFresnelColor*fresnelVal*uFresnelIntensity;
  // mono
  gl_FragColor = vec4(vec3(alpha.x+fresnelColor),alpha.x);
  // color
  gl_FragColor.rgb = mix(gl_FragColor.rgb, color.rgb, uColorFactor);
  if (alpha.x < 0.7) {
    discard;
  }
}