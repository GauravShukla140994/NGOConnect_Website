import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

/* ------------------------------------------------------------------ */
/*  CosmicScene                                                        */
/*  One continuous WebGL story:                                        */
/*  darkness → stars → one glowing particle → ripples → network →      */
/*  particles converge into Earth → living globe with arcs             */
/* ------------------------------------------------------------------ */

const EARTH_RADIUS = 1.7
const PARTICLE_COUNT = 2200

const CITIES = [
  [28.6, 77.2], [19.1, 72.9], [12.97, 77.59], [-23.5, -46.6], [40.7, -74.0],
  [51.5, -0.12], [35.7, 139.7], [-33.9, 151.2], [-1.29, 36.8], [30.0, 31.2],
  [55.75, 37.6], [48.85, 2.35], [52.5, 13.4], [1.35, 103.8], [37.57, 126.98],
  [-34.6, -58.4], [43.65, -79.38], [25.2, 55.27], [14.6, 120.98], [6.52, 3.37],
]

function latLngToVec3(lat, lng, r) {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  )
}

function makeGlowTexture(inner = 'rgba(147,197,253,1)', outer = 'rgba(37,99,235,0)') {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, inner)
  g.addColorStop(1, outer)
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new THREE.CanvasTexture(c)
}

function fibonacciSphere(n, r) {
  const pts = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2
    const rad = Math.sqrt(1 - y * y)
    const theta = golden * i
    pts.push(new THREE.Vector3(Math.cos(theta) * rad * r, y * r, Math.sin(theta) * rad * r))
  }
  return pts
}

const CosmicScene = forwardRef(function CosmicScene({ onPhase, onIntroComplete }, ref) {
  const mountRef = useRef(null)
  const skipRef = useRef(() => {})

  useImperativeHandle(ref, () => ({ skip: () => skipRef.current() }))

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    /* ---------- renderer / scene / camera ---------- */
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100)
    camera.position.set(0, 0, 3.0)

    /* widen the field of view on portrait screens so the Earth
       is never clipped at the sides on mobile */
    function applyAspect() {
      const aspect = innerWidth / innerHeight
      camera.aspect = aspect
      camera.fov = aspect < 1 ? Math.min(68, 50 / Math.sqrt(aspect)) : 50
      camera.updateProjectionMatrix()
    }
    applyAspect()

    const dpr = Math.min(devicePixelRatio, 1.75)
    const renderer = new THREE.WebGLRenderer({
      antialias: dpr < 1.5,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(dpr)
    renderer.setSize(innerWidth, innerHeight)
    mount.appendChild(renderer.domElement)

    const glowTex = makeGlowTexture()

    /* ---------- stars ---------- */
    const starGeo = new THREE.BufferGeometry()
    const starPos = new Float32Array(900 * 3)
    for (let i = 0; i < 900; i++) {
      const v = new THREE.Vector3().randomDirection().multiplyScalar(18 + Math.random() * 22)
      starPos.set([v.x, v.y, v.z], i * 3)
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
    const starMat = new THREE.PointsMaterial({
      size: 0.05, map: glowTex, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending, color: 0xbfdbfe,
    })
    const stars = new THREE.Points(starGeo, starMat)
    scene.add(stars)

    /* ---------- the one glowing particle ---------- */
    const hero = new THREE.Sprite(new THREE.SpriteMaterial({
      map: glowTex, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false, color: 0x93c5fd,
    }))
    hero.scale.setScalar(0.001)
    scene.add(hero)

    /* ---------- trail ---------- */
    const TRAIL = 70
    const trailGeo = new THREE.BufferGeometry()
    trailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TRAIL * 3), 3))
    const trailMat = new THREE.PointsMaterial({
      size: 0.07, map: glowTex, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending, color: 0x60a5fa,
      sizeAttenuation: true,
    })
    const trail = new THREE.Points(trailGeo, trailMat)
    scene.add(trail)
    const trailPts = []

    /* ---------- ripples ---------- */
    const ripples = []
    function spawnRipple(pos) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.96, 1, 64),
        new THREE.MeshBasicMaterial({
          color: 0x60a5fa, transparent: true, opacity: 0.7,
          side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false,
        })
      )
      ring.position.copy(pos)
      ring.scale.setScalar(0.02)
      scene.add(ring)
      ripples.push(ring)
    }

    /* ---------- network particles (become Earth) ---------- */
    const spherePts = fibonacciSphere(PARTICLE_COUNT, EARTH_RADIUS + 0.01)
    const scatterPts = spherePts.map(() =>
      new THREE.Vector3((Math.random() - 0.5) * 7, (Math.random() - 0.5) * 4.5, (Math.random() - 0.5) * 3)
    )
    const netGeo = new THREE.BufferGeometry()
    netGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(PARTICLE_COUNT * 3), 3))
    const netMat = new THREE.PointsMaterial({
      size: 0.035, map: glowTex, transparent: true, opacity: 0,
      depthWrite: false, blending: THREE.AdditiveBlending, color: 0x7dd3fc,
    })

    const earthGroup = new THREE.Group()
    scene.add(earthGroup)
    const net = new THREE.Points(netGeo, netMat)
    earthGroup.add(net)

    /* ---------- connection lines ---------- */
    const LINK_COUNT = 260
    const links = []
    for (let i = 0; i < LINK_COUNT; i++) {
      const a = Math.floor(Math.random() * PARTICLE_COUNT)
      let b = Math.floor(Math.random() * PARTICLE_COUNT)
      if (spherePts[a].distanceTo(spherePts[b]) > 1.2) { i--; continue }
      links.push([a, b])
    }
    const linkGeo = new THREE.BufferGeometry()
    linkGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(links.length * 6), 3))
    const linkMat = new THREE.LineBasicMaterial({
      color: 0x3b82f6, transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    })
    earthGroup.add(new THREE.LineSegments(linkGeo, linkMat))

    /* ---------- earth core + atmosphere ---------- */
    const earthMat = new THREE.MeshStandardMaterial({
      color: 0x0d1f3d, roughness: 0.85, metalness: 0.1,
      emissive: 0x0a1730, transparent: true, opacity: 0,
    })
    const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS, 64, 64), earthMat)
    earthGroup.add(earthMesh)

    new THREE.TextureLoader().load(
      'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg',
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        earthMat.map = tex
        earthMat.color = new THREE.Color(0xdde6f5)
        earthMat.emissive = new THREE.Color(0x1b2c4f)
        earthMat.emissiveMap = tex
        earthMat.emissiveIntensity = 0.55
        earthMat.needsUpdate = true
      },
      undefined,
      () => {} /* offline fallback: dark stylized sphere */
    )

    const atmoMat = new THREE.ShaderMaterial({
      transparent: true, blending: THREE.AdditiveBlending, side: THREE.BackSide, depthWrite: false,
      uniforms: { uOpacity: { value: 0 } },
      vertexShader: `
        varying float vI;
        void main() {
          vec3 n = normalize(normalMatrix * normal);
          vec3 v = normalize((modelViewMatrix * vec4(position,1.0)).xyz);
          vI = pow(0.62 - dot(n, -v), 4.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }`,
      fragmentShader: `
        varying float vI;
        uniform float uOpacity;
        void main() { gl_FragColor = vec4(0.35, 0.6, 1.0, 1.0) * vI * uOpacity * 0.7; }`,
    })
    earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS * 1.13, 64, 64), atmoMat))

    /* ---------- arcs + city markers ---------- */
    const arcGroup = new THREE.Group()
    earthGroup.add(arcGroup)
    const arcMats = []
    const pulses = []           // signals travelling city → city
    const pulseState = { o: 0 } // global pulse visibility (revealed with the arcs)
    const citySprites = []
    const ARC_COLORS = [0x22c55e, 0xf97316, 0x60a5fa, 0x7c3aed]
    for (let i = 0; i < 16; i++) {
      const a = CITIES[Math.floor(Math.random() * CITIES.length)]
      let b = CITIES[Math.floor(Math.random() * CITIES.length)]
      if (a === b) { i--; continue }
      const va = latLngToVec3(a[0], a[1], EARTH_RADIUS + 0.01)
      const vb = latLngToVec3(b[0], b[1], EARTH_RADIUS + 0.01)
      const mid = va.clone().add(vb).multiplyScalar(0.5).normalize()
        .multiplyScalar(EARTH_RADIUS + va.distanceTo(vb) * 0.45)
      const curve = new THREE.QuadraticBezierCurve3(va, mid, vb)
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48))
      const mat = new THREE.LineDashedMaterial({
        color: ARC_COLORS[i % ARC_COLORS.length], transparent: true, opacity: 0,
        dashSize: 0.35, gapSize: 1.2, blending: THREE.AdditiveBlending, depthWrite: false,
      })
      const line = new THREE.Line(geo, mat)
      line.computeLineDistances()
      arcGroup.add(line)
      arcMats.push(mat)

      /* a glowing signal rides this arc, over and over */
      const pulse = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, transparent: true, opacity: 0, depthWrite: false,
        blending: THREE.AdditiveBlending, color: ARC_COLORS[i % ARC_COLORS.length],
      }))
      pulse.scale.setScalar(0.075)
      arcGroup.add(pulse)
      pulses.push({ sprite: pulse, curve, speed: 0.1 + Math.random() * 0.14, offset: Math.random() })
    }
    CITIES.forEach(([lat, lng], i) => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({
        map: glowTex, transparent: true, opacity: 0, depthWrite: false,
        blending: THREE.AdditiveBlending,
        color: ARC_COLORS[i % ARC_COLORS.length],
      }))
      s.position.copy(latLngToVec3(lat, lng, EARTH_RADIUS + 0.02))
      s.scale.setScalar(0.09)
      arcGroup.add(s)
      arcMats.push(s.material)
      citySprites.push(s)
    })

    /* ---------- lights ---------- */
    scene.add(new THREE.AmbientLight(0x334466, 1.2))
    const key = new THREE.DirectionalLight(0x93c5fd, 2.2)
    key.position.set(-4, 2, 4)
    scene.add(key)

    /* ---------- animation state ---------- */
    const state = {
      formation: 0,      // 0 scattered → 1 sphere
      netVisible: 0,
      heroPath: 0,       // hero particle journey progress
      rippleTimer: 0,
      done: false,
    }
    earthGroup.rotation.y = 0.8
    earthGroup.visible = true

    const heroCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.7, 0.35, 0.2),
      new THREE.Vector3(-0.4, 0.7, -0.2),
      new THREE.Vector3(-0.9, -0.3, 0.3),
      new THREE.Vector3(0.5, -0.55, 0),
      new THREE.Vector3(0, 0, 0.4),
    ])

    /* ---------- master timeline ---------- */
    const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const tl = gsap.timeline({
      onComplete: () => {
        state.done = true
        onIntroComplete?.()
      },
    })

    tl.call(() => onPhase?.('begin'))
      // stars breathe in
      .to(starMat, { opacity: 0.9, duration: 2.2, ease: 'power2.out' })
      // the one particle awakens
      .to(hero.material, { opacity: 1, duration: 1.2, ease: 'power2.out' }, '-=1.4')
      .to(hero.scale, { x: 0.28, y: 0.28, z: 0.28, duration: 1.4, ease: 'elastic.out(1,0.6)' }, '<')
      .call(() => onPhase?.('line1'))
      .to({}, { duration: 2.2 }) // hold on the sentence
      // the journey — ripples give birth to a network
      .call(() => onPhase?.('journey'))
      .to(trailMat, { opacity: 0.8, duration: 0.6 }, '<')
      .to(state, { heroPath: 1, duration: 4.2, ease: 'power1.inOut' }, '<')
      .to(netMat, { opacity: 0.9, duration: 2.5, ease: 'power1.in' }, '<+=1.2')
      .to(linkMat, { opacity: 0.35, duration: 2.0 }, '<+=0.8')
      // convergence — the world takes shape
      .call(() => onPhase?.('forming'))
      .to(hero.material, { opacity: 0, duration: 0.8 }, '<')
      .to(trailMat, { opacity: 0, duration: 0.8 }, '<')
      .to(state, { formation: 1, duration: 3.4, ease: 'power3.inOut' }, '<')
      .to(camera.position, { z: 6.2, y: 0.15, duration: 3.4, ease: 'power2.inOut' }, '<')
      /* the world settles just below center — fully visible, words own the top */
      .to(earthGroup.position, { y: -0.6, duration: 3.0, ease: 'power2.inOut' }, '<+=0.8')
      .to(earthMat, { opacity: 1, duration: 2.2, ease: 'power2.in' }, '<')
      .to(atmoMat.uniforms.uOpacity, { value: 1, duration: 2.0 }, '<+=0.4')
      .to(earthGroup.rotation, { y: '+=1.4', duration: 3.4, ease: 'power2.inOut' }, '<-=1.4')
      // the world comes alive
      .add(() => {
        arcMats.forEach((m, i) =>
          gsap.to(m, { opacity: m.isSpriteMaterial ? 0.9 : 0.55, duration: 1.2, delay: i * 0.05 })
        )
        gsap.to(pulseState, { o: 1, duration: 1.6, delay: 0.9 })
      })
      .to(netMat, { opacity: 0.5, duration: 1.5 }, '<')
      .to(linkMat, { opacity: 0.12, duration: 1.5 }, '<')
      .call(() => onPhase?.('done'))

    const skipToEnd = () => {
      if (!state.done) tl.progress(1)
    }
    skipRef.current = skipToEnd
    if (prefersReduced) skipToEnd()

    /* ---------- render loop ---------- */
    /* mouse parallax — the world leans toward the cursor */
    const par = { x: 0, y: 0, tx: 0, ty: 0 }
    const onPointer = (e) => {
      par.tx = (e.clientX / innerWidth - 0.5) * 2
      par.ty = (e.clientY / innerHeight - 0.5) * 2
    }
    addEventListener('pointermove', onPointer, { passive: true })

    const clock = new THREE.Clock()
    const tmp = new THREE.Vector3()
    let raf
    let staticApplied = false

    function tick() {
      raf = requestAnimationFrame(tick)

      /* deep sleep: once the story scrolls past the globe, stop all GPU work */
      if (state.done && window.scrollY > innerHeight * 1.6) {
        if (mount.style.visibility !== 'hidden') mount.style.visibility = 'hidden'
        clock.getDelta() // keep the clock drained so wake-up has no time jump
        return
      }
      if (mount.style.visibility === 'hidden') mount.style.visibility = ''

      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime

      // hero particle path + ripples
      if (state.heroPath > 0 && state.heroPath < 1) {
        heroCurve.getPoint(state.heroPath, tmp)
        hero.position.copy(tmp)
        trailPts.push(tmp.clone())
        if (trailPts.length > TRAIL) trailPts.shift()
        const arr = trailGeo.attributes.position.array
        for (let i = 0; i < TRAIL; i++) {
          const p = trailPts[Math.min(i, trailPts.length - 1)] || tmp
          arr[i * 3] = p.x; arr[i * 3 + 1] = p.y; arr[i * 3 + 2] = p.z
        }
        trailGeo.attributes.position.needsUpdate = true

        state.rippleTimer += dt
        if (state.rippleTimer > 0.55) {
          state.rippleTimer = 0
          spawnRipple(tmp)
        }
      }

      // ripples expand and fade
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i]
        r.scale.multiplyScalar(1 + dt * 2.4)
        r.material.opacity -= dt * 0.55
        r.lookAt(camera.position)
        if (r.material.opacity <= 0) {
          scene.remove(r)
          r.geometry.dispose(); r.material.dispose()
          ripples.splice(i, 1)
        }
      }

      // particles: scattered → sphere (skip entirely once formation is frozen)
      const f = state.formation
      if (!staticApplied) {
        const posArr = netGeo.attributes.position.array
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const s = scatterPts[i], e = spherePts[i]
          const wobble = (1 - f) * Math.sin(t * 1.5 + i) * 0.04
          posArr[i * 3] = s.x + (e.x - s.x) * f + wobble
          posArr[i * 3 + 1] = s.y + (e.y - s.y) * f + wobble
          posArr[i * 3 + 2] = s.z + (e.z - s.z) * f
        }
        netGeo.attributes.position.needsUpdate = true

        // links follow the same interpolation
        const lArr = linkGeo.attributes.position.array
        links.forEach(([a, b], i) => {
          const sa = scatterPts[a], ea = spherePts[a]
          const sb = scatterPts[b], eb = spherePts[b]
          lArr[i * 6] = sa.x + (ea.x - sa.x) * f
          lArr[i * 6 + 1] = sa.y + (ea.y - sa.y) * f
          lArr[i * 6 + 2] = sa.z + (ea.z - sa.z) * f
          lArr[i * 6 + 3] = sb.x + (eb.x - sb.x) * f
          lArr[i * 6 + 4] = sb.y + (eb.y - sb.y) * f
          lArr[i * 6 + 5] = sb.z + (eb.z - sb.z) * f
        })
        linkGeo.attributes.position.needsUpdate = true

        if (f >= 1) staticApplied = true // buffers final — never touch them again
      }

      // living Earth
      if (state.done) earthGroup.rotation.y += dt * 0.055
      arcMats.forEach((m) => {
        if (m.isLineDashedMaterial) m.dashOffset = (m.dashOffset ?? 0) - dt * 0.5
      })

      /* living network: signals travel between cities, markers breathe */
      if (pulseState.o > 0) {
        pulses.forEach((p) => {
          const tt = (t * p.speed + p.offset) % 1
          p.curve.getPoint(tt, tmp)
          p.sprite.position.copy(tmp)
          /* bright mid-flight, fading at both cities */
          p.sprite.material.opacity = pulseState.o * Math.sin(Math.PI * tt) * 0.95
        })
        citySprites.forEach((s, i) => {
          s.scale.setScalar(0.09 + Math.sin(t * 2.2 + i * 1.7) * 0.028)
        })
      }
      stars.rotation.y += dt * 0.004

      /* apply parallax: camera drifts on x, earth + stars tilt on y.
         (y/z stay untouched — they belong to the intro timeline) */
      par.x += (par.tx - par.x) * 0.04
      par.y += (par.ty - par.y) * 0.04
      camera.position.x = par.x * 0.35
      camera.lookAt(0, 0, 0)
      earthGroup.rotation.x = par.y * 0.07
      stars.rotation.x = par.y * 0.025

      renderer.render(scene, camera)
    }
    tick()

    /* ---------- resize ---------- */
    function onResize() {
      applyAspect()
      renderer.setSize(innerWidth, innerHeight)
    }
    addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', onResize)
      removeEventListener('pointermove', onPointer)
      tl.kill()
      renderer.dispose()
      scene.traverse((o) => {
        o.geometry?.dispose?.()
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose())
      })
      mount.removeChild(renderer.domElement)
    }
  }, [onPhase, onIntroComplete])

  return (
    <div
      ref={mountRef}
      id="cosmic-canvas"
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
    />
  )
})

export default CosmicScene
