(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-links');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  menuButton?.addEventListener('click', () => {
    const expanded = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!expanded));
    menu?.classList.toggle('is-open', !expanded);
  });
  menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    menu?.classList.remove('is-open');
  }));

  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.14 });
  document.querySelectorAll('.reveal').forEach((element) => reduceMotion ? element.classList.add('is-visible') : revealObserver.observe(element));

  const canvas = document.getElementById('signal-canvas');
  if (!canvas) return;
  const gl = canvas.getContext('webgl', { alpha: true, antialias: false, powerPreference: 'high-performance' });
  if (!gl) return;

  const PARTICLE_COUNT = 12000;
  const vertexShaderSource = `
    precision highp float;
    attribute vec3 aSphere;
    attribute vec3 aRibbon;
    attribute vec3 aSignal;
    attribute vec3 aVortex;
    attribute vec3 aColor;
    attribute float aSize;
    uniform float uTime;
    uniform float uScroll;
    uniform vec2 uMouse;
    uniform float uAspect;
    uniform vec4 uExclusion0;
    uniform vec4 uExclusion1;
    uniform vec4 uExclusion2;
    uniform vec4 uExclusion3;
    varying vec3 vColor;
    varying float vAlpha;

    float ease(float value) { return value * value * (3.0 - 2.0 * value); }

    vec3 correctAspect(vec3 point, float centerX) {
      point.x = centerX + (point.x - centerX) / max(uAspect, 0.01);
      return point;
    }

    float outsideExclusion(vec2 point, vec4 rect) {
      vec2 distanceToRect = max(rect.xy - point, point - rect.zw);
      float outside = max(distanceToRect.x, distanceToRect.y);
      return smoothstep(-0.035, 0.085, outside);
    }

    void main() {
      float stage = clamp(uScroll, 0.0, 2.999);
      float phase = ease(fract(stage));
      vec3 sphere = correctAspect(aSphere, 0.68);
      vec3 ribbon = correctAspect(aRibbon, 0.145);
      vec3 signal = correctAspect(aSignal, 0.38);
      vec3 vortex = correctAspect(aVortex, 0.42);
      vec3 position;
      if (stage < 1.0) position = mix(sphere, ribbon, phase);
      else if (stage < 2.0) position = mix(ribbon, signal, phase);
      else position = mix(signal, vortex, phase);

      float depth = position.z;
      position.x += sin(uTime * 0.31 + depth * 9.0 + position.y * 4.0) * 0.012;
      position.y += cos(uTime * 0.27 + depth * 7.0 + position.x * 3.0) * 0.010;
      position.xy += uMouse * (0.018 + depth * 0.025);

      gl_Position = vec4(position.xy, 0.0, 1.0);
      gl_PointSize = clamp(aSize * (1.08 + depth * 0.22), 1.8, 9.0);
      vColor = aColor;
      float readability = min(min(outsideExclusion(position.xy, uExclusion0), outsideExclusion(position.xy, uExclusion1)), min(outsideExclusion(position.xy, uExclusion2), outsideExclusion(position.xy, uExclusion3)));
      vAlpha = (0.38 + 0.45 * (depth * 0.5 + 0.5)) * mix(0.25, 1.0, readability);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    varying vec3 vColor;
    varying float vAlpha;
    void main() {
      vec2 uv = gl_PointCoord;
      float side = uv.y - 2.0 * abs(uv.x - 0.5);
      if (side < 0.0 || uv.y > 0.98) discard;
      float edge = min(side * 0.48, 1.0 - uv.y);
      float outline = 1.0 - smoothstep(0.035, 0.14, edge);
      if (outline < 0.08) discard;
      gl_FragColor = vec4(vColor, outline * vAlpha);
    }
  `;

  const compileShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
  };
  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl.VERTEX_SHADER, vertexShaderSource));
  gl.attachShader(program, compileShader(gl.FRAGMENT_SHADER, fragmentShaderSource));
  gl.linkProgram(program);
  gl.useProgram(program);

  let randomState = 948213;
  const random = () => {
    randomState = (randomState * 16807) % 2147483647;
    return (randomState - 1) / 2147483646;
  };
  const normalNoise = () => (random() + random() + random() + random() - 2) * 0.5;

  const createSphereShape = (count) => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const ambient = i % 11 === 0;
      const theta = random() * Math.PI * 2;
      const z = random() * 2 - 1;
      const ring = Math.sqrt(1 - z * z);
      const radius = 0.59 + normalNoise() * 0.055;
      data[i * 3] = ambient ? random() * 2.7 - 1.35 : 0.68 + Math.cos(theta) * ring * radius;
      data[i * 3 + 1] = ambient ? random() * 2.2 - 1.1 : Math.sin(theta) * ring * radius * 1.12;
      data[i * 3 + 2] = ambient ? random() * 0.4 - 0.8 : z;
    }
    return data;
  };

  const createRibbonShape = (count) => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const ambient = i % 13 === 0;
      const t = random();
      const band = normalNoise() * 0.16;
      const angle = t * Math.PI * 2.35;
      data[i * 3] = ambient ? random() * 2.7 - 1.35 : -1.18 + t * 2.65;
      data[i * 3 + 1] = ambient ? random() * 2.2 - 1.1 : Math.sin(angle) * 0.48 + band;
      data[i * 3 + 2] = ambient ? -0.75 : Math.cos(angle) * 0.78 + normalNoise() * 0.12;
    }
    return data;
  };

  const createSignalShape = (count) => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const ambient = i % 14 === 0;
      const t = random();
      const thickness = normalNoise() * 0.18;
      const curve = Math.sin(t * Math.PI * 2) * 0.48;
      data[i * 3] = ambient ? random() * 2.7 - 1.35 : 0.38 + curve + thickness;
      data[i * 3 + 1] = ambient ? random() * 2.2 - 1.1 : 1.05 - t * 2.1 + normalNoise() * 0.07;
      data[i * 3 + 2] = ambient ? -0.8 : Math.cos(t * Math.PI * 4) * 0.55 + normalNoise() * 0.18;
    }
    return data;
  };

  const createVortexShape = (count) => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const ambient = i % 12 === 0;
      const radius = Math.sqrt(random()) * 0.95;
      const angle = radius * 13 + random() * 1.3;
      data[i * 3] = ambient ? random() * 2.7 - 1.35 : 0.42 + Math.cos(angle) * radius;
      data[i * 3 + 1] = ambient ? random() * 2.2 - 1.1 : Math.sin(angle) * radius * 0.78;
      data[i * 3 + 2] = ambient ? -0.8 : 1 - radius * 1.7 + normalNoise() * 0.12;
    }
    return data;
  };

  const palette = [
    [0.502, 0.322, 1], [1, 0.722, 0.161], [0.082, 0.518, 0.431],
    [0.816, 0.361, 1], [0.224, 0.549, 1], [0.95, 0.88, 0.78]
  ];
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  const sizes = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const color = palette[Math.floor(random() * palette.length)];
    colors.set(color, i * 3);
    sizes[i] = i % 97 === 0 ? 8 : 2.2 + Math.pow(random(), 3) * 4.8;
  }

  const bindAttribute = (name, data, size) => {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const location = gl.getAttribLocation(program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, 0, 0);
  };
  bindAttribute('aSphere', createSphereShape(PARTICLE_COUNT), 3);
  bindAttribute('aRibbon', createRibbonShape(PARTICLE_COUNT), 3);
  bindAttribute('aSignal', createSignalShape(PARTICLE_COUNT), 3);
  bindAttribute('aVortex', createVortexShape(PARTICLE_COUNT), 3);
  bindAttribute('aColor', colors, 3);
  bindAttribute('aSize', sizes, 1);

  const uniforms = {
    time: gl.getUniformLocation(program, 'uTime'),
    scroll: gl.getUniformLocation(program, 'uScroll'),
    mouse: gl.getUniformLocation(program, 'uMouse'),
    aspect: gl.getUniformLocation(program, 'uAspect'),
    exclusions: [0, 1, 2, 3].map((index) => gl.getUniformLocation(program, `uExclusion${index}`))
  };
  let pointer = { x: 0, y: 0 };
  let pointerTarget = { x: 0, y: 0 };
  let scrollTarget = 0;
  let scrollCurrent = 0;
  let exclusionRects = Array.from({ length: 4 }, () => [2, 2, 2, 2]);

  const updateExclusionZones = () => {
    const padding = 22;
    const visibleZones = [...document.querySelectorAll('.copy-shield')]
      .map((element) => element.getBoundingClientRect())
      .filter((rect) => rect.bottom > 0 && rect.top < window.innerHeight)
      .slice(0, 4)
      .map((rect) => [
        ((rect.left - padding) / window.innerWidth) * 2 - 1,
        1 - ((rect.bottom + padding) / window.innerHeight) * 2,
        ((rect.right + padding) / window.innerWidth) * 2 - 1,
        1 - ((rect.top - padding) / window.innerHeight) * 2
      ]);
    exclusionRects = Array.from({ length: 4 }, (_, index) => visibleZones[index] || [2, 2, 2, 2]);
  };

  const resizeCanvas = () => {
    const ratio = Math.min(window.devicePixelRatio || 1, 1);
    canvas.width = Math.round(window.innerWidth * ratio);
    canvas.height = Math.round(window.innerHeight * ratio);
    gl.viewport(0, 0, canvas.width, canvas.height);
  };
  const updateScrollTarget = () => {
    const range = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    scrollTarget = (window.scrollY / range) * 3;
  };
  window.addEventListener('resize', resizeCanvas, { passive: true });
  window.addEventListener('resize', updateExclusionZones, { passive: true });
  window.addEventListener('scroll', () => { updateScrollTarget(); updateExclusionZones(); }, { passive: true });
  window.addEventListener('pointermove', (event) => {
    pointerTarget.x = (event.clientX / window.innerWidth - 0.5) * 2;
    pointerTarget.y = (0.5 - event.clientY / window.innerHeight) * 2;
  }, { passive: true });
  resizeCanvas();
  updateScrollTarget();
  updateExclusionZones();
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.clearColor(0, 0, 0, 0);

  const render = (time) => {
    pointer.x += (pointerTarget.x - pointer.x) * 0.035;
    pointer.y += (pointerTarget.y - pointer.y) * 0.035;
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.045;
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(uniforms.time, reduceMotion ? 0 : time * 0.001);
    gl.uniform1f(uniforms.scroll, scrollCurrent);
    gl.uniform2f(uniforms.mouse, pointer.x, pointer.y);
    gl.uniform1f(uniforms.aspect, window.innerWidth / window.innerHeight);
    uniforms.exclusions.forEach((location, index) => gl.uniform4fv(location, exclusionRects[index]));
    const drawCount = window.innerWidth < 760 ? 7200 : PARTICLE_COUNT;
    gl.drawArrays(gl.POINTS, 0, drawCount);
    if (!reduceMotion) requestAnimationFrame(render);
  };
  render(0);
})();

(() => {
  const sphereCanvas = document.getElementById('approach-particle-sphere');
  if (!sphereCanvas) return;
  const sphereContext = sphereCanvas.getContext('2d');
  const APPROACH_PARTICLE_COUNT = 3600;
  const reduceApproachMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const spherePalette = ['#8052ff', '#ffb829', '#15846e', '#d05cff', '#398cff', '#fff1d2'];
  const approachPointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let sphereParticles = [];
  let sphereSize = 0;
  let sphereVisible = true;

  const createApproachParticleSphere = (count) => {
    const particles = [];
    for (let index = 0; index < count; index += 1) {
      const theta = Math.random() * Math.PI * 2;
      const vertical = Math.acos(1 - 2 * Math.random());
      const radius = 0.73 + Math.random() * 0.25;
      particles.push({
        x: Math.sin(vertical) * Math.cos(theta) * radius,
        y: Math.cos(vertical) * radius,
        z: Math.sin(vertical) * Math.sin(theta) * radius,
        color: spherePalette[Math.floor(Math.random() * spherePalette.length)],
        size: index % 101 === 0 ? 4.9 : 0.75 + Math.random() * 2.2,
        phase: Math.random() * Math.PI * 2
      });
    }
    return particles;
  };

  const resizeApproachSphere = () => {
    const rect = sphereCanvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    sphereCanvas.width = Math.round(rect.width * ratio);
    sphereCanvas.height = Math.round(rect.height * ratio);
    sphereContext.setTransform(ratio, 0, 0, ratio, 0, 0);
    sphereSize = Math.min(rect.width, rect.height);
  };

  const trackApproachPointer = (clientX, clientY) => {
    const rect = sphereCanvas.getBoundingClientRect();
    approachPointer.targetX = ((clientX - rect.left) / rect.width - 0.5) * 2;
    approachPointer.targetY = ((clientY - rect.top) / rect.height - 0.5) * 2;
  };

  sphereCanvas.addEventListener('pointermove', (event) => trackApproachPointer(event.clientX, event.clientY));
  sphereCanvas.addEventListener('pointerleave', () => { approachPointer.targetX = 0; approachPointer.targetY = 0; });
  sphereCanvas.addEventListener('touchmove', (event) => {
    const touch = event.touches[0];
    if (touch) trackApproachPointer(touch.clientX, touch.clientY);
  }, { passive: true });
  window.addEventListener('resize', resizeApproachSphere, { passive: true });
  new IntersectionObserver(([entry]) => { sphereVisible = entry.isIntersecting; }, { threshold: 0.05 }).observe(sphereCanvas);

  sphereParticles = createApproachParticleSphere(APPROACH_PARTICLE_COUNT);
  resizeApproachSphere();

  const renderApproachSphere = (time) => {
    const width = sphereCanvas.clientWidth;
    const height = sphereCanvas.clientHeight;
    sphereContext.clearRect(0, 0, width, height);
    if (sphereVisible) {
      approachPointer.x += (approachPointer.targetX - approachPointer.x) * 0.045;
      approachPointer.y += (approachPointer.targetY - approachPointer.y) * 0.045;
      const rotationY = (reduceApproachMotion ? 0.18 : time * 0.00013) + approachPointer.x * 0.55;
      const rotationX = 0.19 + approachPointer.y * 0.38;
      const radius = sphereSize * 0.42;
      const centreX = width * 0.5;
      const centreY = height * 0.5;
      const depthSorted = sphereParticles.map((particle) => {
        const rotatedX = particle.x * Math.cos(rotationY) - particle.z * Math.sin(rotationY);
        const rotatedZ = particle.x * Math.sin(rotationY) + particle.z * Math.cos(rotationY);
        return {
          ...particle,
          x: rotatedX,
          y: particle.y * Math.cos(rotationX) - rotatedZ * Math.sin(rotationX),
          z: particle.y * Math.sin(rotationX) + rotatedZ * Math.cos(rotationX)
        };
      }).sort((first, second) => first.z - second.z);

      depthSorted.forEach((particle) => {
        const perspective = 0.58 + (particle.z + 1) * 0.27;
        const x = centreX + particle.x * radius * perspective;
        const y = centreY + particle.y * radius * perspective;
        const size = particle.size * (0.7 + perspective * 0.9);
        const opacity = 0.13 + (particle.z + 1) * 0.31;
        sphereContext.save();
        sphereContext.translate(x, y);
        sphereContext.rotate(particle.phase + rotationY * 0.8);
        sphereContext.strokeStyle = particle.color;
        sphereContext.globalAlpha = opacity;
        sphereContext.lineWidth = particle.size > 4 ? 1.1 : 0.65;
        sphereContext.beginPath();
        sphereContext.moveTo(0, -size);
        sphereContext.lineTo(size * 0.86, size * 0.68);
        sphereContext.lineTo(-size * 0.86, size * 0.68);
        sphereContext.closePath();
        sphereContext.stroke();
        sphereContext.restore();
      });
    }
    if (!reduceApproachMotion) requestAnimationFrame(renderApproachSphere);
  };
  renderApproachSphere(0);
})();
