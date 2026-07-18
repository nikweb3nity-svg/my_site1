$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$htmlPath = Join-Path $root 'index.html'
$cssPath = Join-Path $root 'styles.css'
$scriptPath = Join-Path $root 'script.js'

foreach ($path in @($htmlPath, $cssPath, $scriptPath)) {
  if (-not (Test-Path $path)) { throw "Missing required site file: $path" }
}

$html = Get-Content -Raw -Encoding UTF8 $htmlPath
$css = Get-Content -Raw -Encoding UTF8 $cssPath
$script = Get-Content -Raw -Encoding UTF8 $scriptPath

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

foreach ($marker in @(
  'let renderPixelRatio = 1',
  'const maxPixelRatio = window.innerWidth <= 760 ? 3 : 2',
  'Math.min(window.devicePixelRatio || 1, maxPixelRatio)',
  'const spherePixelRatioLimit = window.innerWidth <= 760 ? 3 : 2'
)) {
  if ($script -notmatch [regex]::Escape($marker)) { throw "HiDPI particle rendering is missing $marker" }
}

if ($css -notmatch [regex]::Escape('position: fixed')) { throw 'Canvas stage must be fixed to the viewport' }

foreach ($marker in @('.copy-shield', 'text-shadow:', 'uExclusion0', 'updateExclusionZones')) {
  if (($css + $script) -notmatch [regex]::Escape($marker)) { throw "Readability system is missing $marker" }
}

foreach ($marker in @('correctAspect', 'correctAspect(sphereSource, 0.68)', 'correctAspect(aSignal, 0.38)', 'correctAspect(vortexSource, 0.42)')) {
  if ($script -notmatch [regex]::Escape($marker)) { throw "Aspect-ratio correction is missing $marker" }
}

if ($script -notmatch [regex]::Escape('mix(mix(0.38, 0.25, uDesktopSphereTreatment), 1.0, readability)')) { throw 'Mobile particles must remain more visible inside text exclusion zones' }

foreach ($marker in @('approach-particle-sphere', 'APPROACH_PARTICLE_COUNT = 3600', 'createApproachParticleSphere', 'approachPointer')) {
  if (($html + $script) -notmatch [regex]::Escape($marker)) { throw "Approach particle sphere is missing $marker" }
}

if ([regex]::Matches($html, 'id="approach"').Count -ne 1) {
  throw 'Landing page must contain exactly one approach section'
}

$approachKicker = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('0JrQkNCaINCg0JDQkdCe0KLQkNCV0Jw='))
$approachTitle = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('0KHQvdCw0YfQsNC70LAg0L/QvtC90LjQvNCw0LXQvCDQt9Cw0LTQsNGH0YMuINCf0L7RgtC+0Lwg0L3QsNGF0L7QtNC40Lwg0YTQvtGA0LzRgy4='))
$approachDescription = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('0J/QvtCz0YDRg9C20LDQtdC80YHRjyDQsiDQv9GA0L7QtNGD0LrRgiwg0LDRg9C00LjRgtC+0YDQuNGOINC4INGG0LXQu9C4LiDQndCwINGN0YLQvtC5INC+0YHQvdC+0LLQtSDRgdC+0LfQtNCw0ZHQvCDQutC+0L3RhtC10L/RhtC40Y4sINC00LjQt9Cw0LnQvSDQuCDRgdGC0YDRg9C60YLRg9GA0YMg0YHQsNC50YLQsCDigJQg0LHQtdC3INGB0LvRg9GH0LDQudC90YvRhSDRgNC10YjQtdC90LjQuS4='))
$approachStepOne = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('0JjRgdGB0LvQtdC00YPQtdC8INC30LDQtNCw0YfRgw=='))
$approachStepTwo = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('0KTQvtGA0LzQuNGA0YPQtdC8INC60L7QvdGG0LXQv9GG0LjRjg=='))
$approachStepThree = [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String('0J/RgNC+0LXQutGC0LjRgNGD0LXQvCDQuCDQt9Cw0L/Rg9GB0LrQsNC10Lw='))

foreach ($marker in @(
  '<section class="approach container" id="approach"',
  '<div class="approach-copy copy-shield reveal">',
  "<p class=`"eyebrow approach-kicker`">$approachKicker</p>",
  $approachTitle,
  "<p class=`"approach-description`">$approachDescription</p>",
  '<ol class="approach-steps">',
  "<span class=`"approach-step-number`">01</span><span>$approachStepOne</span>",
  "<span class=`"approach-step-number`">02</span><span>$approachStepTwo</span>",
  "<span class=`"approach-step-number`">03</span><span>$approachStepThree</span>"
)) {
  if ($html -notmatch [regex]::Escape($marker)) { throw "Approach redesign is missing $marker" }
}

foreach ($marker in @(
  'min-height: 100svh',
  'grid-template-columns: minmax(0, .9fr) minmax(0, 1.08fr)',
  'font-size: clamp(64px, 5.4vw, 88px)',
  'grid-template-columns: 42px minmax(0, 1fr)',
  '.approach-copy > .approach-kicker',
  '.approach-copy > .approach-description',
  'margin-top: 28px',
  '.approach-copy.reveal.is-visible > *',
  '@media (max-width: 760px)'
)) {
  if ($css -notmatch [regex]::Escape($marker)) { throw "Approach CSS is missing $marker" }
}

Write-Output 'Landing structure test passed.'
