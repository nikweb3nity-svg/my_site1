import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const script = readFileSync(new URL('../script.js', import.meta.url), 'utf8');

assert.match(script, /uniform float uDesktopSphereShift;/);
assert.match(script, /uniform float uDesktopSphereTreatment;/);
assert.match(script, /uniform float uPixelRatio;/);
assert.match(script, /sphere\.x -= uDesktopSphereShift;/);
assert.match(script, /sphere\.y \*= mix\(1\.0, 1\.0 \/ 1\.12, uDesktopSphereTreatment\);/);
assert.match(script, /sphere\.xy = sphereCenter \+ \(sphere\.xy - sphereCenter\) \* mix\(1\.0, 1\.15, uDesktopSphereTreatment\);/);
assert.match(script, /desktopSphereShift: gl\.getUniformLocation\(program, 'uDesktopSphereShift'\)/);
assert.match(script, /desktopSphereTreatment: gl\.getUniformLocation\(program, 'uDesktopSphereTreatment'\)/);
assert.doesNotMatch(script, /sphereHover/);
assert.match(script, /uniform vec2 uPointer;/);
assert.match(script, /float pointerNearSphere = \(1\.0 - smoothstep\(0\.55, 0\.85, distance\(uPointer, sphereCenter\)\)\) \* uDesktopSphereTreatment;/);
assert.match(script, /float rotateY = uPointer\.x \* 0\.24 \* pointerNearSphere;/);
assert.match(script, /float rotateX = uPointer\.y \* 0\.18 \* pointerNearSphere;/);
assert.match(script, /pointer: gl\.getUniformLocation\(program, 'uPointer'\)/);
assert.match(script, /gl\.uniform2f\(uniforms\.pointer, pointer\.x, pointer\.y\);/);
assert.match(script, /const globeCenter = 0\.42;/);
assert.match(script, /const latitude = random\(\) \* 2 - 1;/);
assert.match(script, /const globeRadius = 0\.62 \+ normalNoise\(\) \* 0\.035;/);
assert.match(script, /float globeSpin = uTime \* \(0\.11 \+ 0\.05 \* clamp\(vortexSource\.z \+ 1\.0, 0\.0, 1\.0\)\);/);
assert.match(script, /gl_PointSize = clamp\(aSize \* \(1\.08 \+ depth \* 0\.22\), 1\.8, 9\.0\) \* uPixelRatio;/);
assert.match(script, /vAlpha = \(0\.38 \+ 0\.45 \* \(depth \* 0\.5 \+ 0\.5\)\) \* mix\(mix\(0\.38, 0\.25, uDesktopSphereTreatment\), 1\.0, readability\);/);
assert.doesNotMatch(script, /position\.xy \+= uMouse/);
assert.match(script, /window\.innerWidth > 760 \? 0\.4 : 0/);
assert.match(script, /window\.innerWidth > 760 \? 1 : 0/);
assert.match(script, /pixelRatio: gl\.getUniformLocation\(program, 'uPixelRatio'\)/);
assert.match(script, /gl\.uniform1f\(uniforms\.pixelRatio, renderPixelRatio\);/);
assert.match(script, /const desktopSphereAmbient = window\.innerWidth > 760;/);
assert.match(script, /const ambientRadius = ambient && desktopSphereAmbient \? 0\.74 \+ random\(\) \* 0\.9 : 0;/);
assert.match(script, /desktopSphereAmbient \? 0\.68 \+ Math\.cos\(theta\) \* ambientRadius : random\(\) \* 2\.7 - 1\.35/);
assert.match(script, /desktopSphereAmbient \? Math\.sin\(theta\) \* ambientRadius \* 1\.12 : random\(\) \* 2\.2 - 1\.1/);

console.log('Desktop particle-sphere offset test passed.');
