$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$htmlPath = Join-Path $root 'index.html'
$cssPath = Join-Path $root 'styles.css'
$scriptPath = Join-Path $root 'script.js'

foreach ($path in @($htmlPath, $cssPath, $scriptPath)) {
  if (-not (Test-Path $path)) { throw "Missing required site file: $path" }
}

$html = Get-Content -Raw $htmlPath
$css = Get-Content -Raw $cssPath
$script = Get-Content -Raw $scriptPath

foreach ($marker in @('<header', '<main', 'id="work"', 'id="approach"', 'id="team"', 'id="contact"', '<canvas')) {
  if ($html -notmatch [regex]::Escape($marker)) { throw "HTML is missing $marker" }
}

foreach ($marker in @('--color-void: #000000', '--color-electric-iris: #8052ff', 'font-weight: 200', 'prefers-reduced-motion')) {
  if ($css -notmatch [regex]::Escape($marker)) { throw "CSS is missing $marker" }
}

foreach ($marker in @('requestAnimationFrame', 'IntersectionObserver', 'aria-expanded')) {
  if ($script -notmatch [regex]::Escape($marker)) { throw "JavaScript is missing $marker" }
}

foreach ($marker in @("getContext('webgl'", 'const PARTICLE_COUNT = 12000', 'createSphereShape', 'createRibbonShape', 'uScroll', 'gl.POINTS')) {
  if ($script -notmatch [regex]::Escape($marker)) { throw "Particle engine is missing $marker" }
}

if ($script -notmatch [regex]::Escape('Math.min(window.devicePixelRatio || 1, 1)')) { throw 'WebGL buffer must be capped at 1x pixel density' }

if ($css -notmatch [regex]::Escape('position: fixed')) { throw 'Canvas stage must be fixed to the viewport' }

foreach ($marker in @('.copy-shield', 'text-shadow:', 'uExclusion0', 'updateExclusionZones')) {
  if (($css + $script) -notmatch [regex]::Escape($marker)) { throw "Readability system is missing $marker" }
}

foreach ($marker in @('correctAspect', 'correctAspect(aSphere, 0.68)', 'correctAspect(aSignal, 0.38)', 'correctAspect(aVortex, 0.42)')) {
  if ($script -notmatch [regex]::Escape($marker)) { throw "Aspect-ratio correction is missing $marker" }
}

if ($script -notmatch [regex]::Escape('mix(0.25, 1.0, readability)')) { throw 'Particles must retain 25% opacity in text exclusion zones' }

foreach ($marker in @('approach-particle-sphere', 'APPROACH_PARTICLE_COUNT = 3600', 'createApproachParticleSphere', 'approachPointer')) {
  if (($html + $script) -notmatch [regex]::Escape($marker)) { throw "Approach particle sphere is missing $marker" }
}

Write-Output 'Landing structure test passed.'
