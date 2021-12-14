attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;
attribute vec3 random;
attribute vec3 offsetPos;

uniform mat4 modelMatrix;
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float uTime;
uniform float uSpeed;
uniform float uFieldSize;
uniform float uRotateY;
uniform float uScale;
uniform float uFreq;
uniform float uAmp;
uniform float uSpring;

varying vec2 vUv;
varying vec3 vRandom;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

#define TAU 6.28318530718

mat4 rotateX( in float angle ) {
  float s = sin(angle);
  float c = cos(angle);
  return mat4(
    1, 0,  0, 0,
    0, c, -s, 0,
    0, s,  c, 0,
    0, 0,  0, 1
  );
}
mat4 rotateY( in float angle ) {
  float s = sin(angle);
  float c = cos(angle);
  return mat4(
     c, 0, s, 0,
     0, 1, 0, 0,
    -s, 0, c, 0,
     0, 0, 0, 1
  );
}
mat4 rotateZ( in float angle ) {
  float s = sin(angle);
  float c = cos(angle);
  return mat4(
    c,-s, 0, 0,
    s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
  );
}
mat4 scaleMat(float s) {
  return mat4(
    s, 0, 0, 0,
    0, s, 0, 0,
    0, 0, s, 0,
    0, 0, 0, 1
  );
}
mat4 tranMat(vec3 p) {
  return mat4(
      1,   0,   0, 0,
      0,   1,   0, 0,
      0,   0,   1, 0,
    p.x, p.y, p.z, 1
  );
}

float remap(float In, vec2 InMinMax, vec2 OutMinMax) {
  return OutMinMax.x + (In - InMinMax.x) * (OutMinMax.y - OutMinMax.x) / (InMinMax.y - InMinMax.x);
}

void main(void) {
  vUv = uv;
  vRandom = random;
  vNormal = normalize(normalMatrix * normal);

  // wind
  float offsetX = -offsetPos.x + uTime*uSpeed;
  float dist = offsetX/(uFieldSize*2.0);
  // -- wave
  float wave = sin(dist*TAU*uFreq);
  wave = remap(wave,vec2(-1.0,1.0), vec2(0.0,1.0));
  wave *= uAmp;
  // -- with spring force
  float wind = wave + uSpring;

  // scale
  float scale = random.z * uScale;

  // rotate
  float rotY = TAU * random.y * uRotateY * scale;
  float rotZ = wind;
  // float rotX = random.x * wind * scale * 0.01;
  float rotX = 0.0;

  // mat
  mat4 rMaty = rotateY(rotY);
  mat4 rMatz = rotateZ(rotZ);
  mat4 rMatx = rotateX(rotX);
  mat4 sMat = scaleMat(scale);
  mat4 tMat = tranMat(offsetPos);
  mat4 mdlMatrix = tMat * sMat * rMatx * rMatz * rMaty;

  vec4 worldPosition = modelMatrix * mdlMatrix * vec4( position, 1.0);
  vWorldPosition = worldPosition.xyz;
  vec4 mvPosition = viewMatrix * worldPosition;
  gl_Position = projectionMatrix * mvPosition;

  vViewPosition = - mvPosition.xyz;
}