import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import * as THREE from 'three'

/* ============================================================
   One world. Spin it. — gridded globe where cells are screens
   showing region-matched cause photos, popping like live uploads.
   (Photo pools are placeholders — later fed by the NGO Connect
   live-feed API, slotted by geo-location.)
   ============================================================ */

const R = 2
const LNG_BANDS = 18
const LAT_BANDS = 12
const TARGET_VISIBLE = 34
const LIFETIME = [5, 9]
const AXIAL_TILT = 11.75
const SPIN_SPEED = 0.0022

const U = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=80`

const REGIONS = {
  asia: {
    cities: ['Delhi', 'Mumbai', 'Kathmandu', 'Manila', 'Jakarta', 'Dhaka'],
    photos: [
      [U('1497486751825-1233686d5d80'), 'Education drive'],
      [U('1526976668912-1a811878dd37'), 'School reopened'],
      [U('1594708767771-a7502209ff51'), 'Community support'],
      [U('1509062522246-3755977927d7'), 'Classroom program'],
      [U('1427504494785-3a9ca7044f45'), 'Back to school'],
      [U('1524178232363-1fb2b075b655'), 'Adult literacy'],
    ],
  },
  africa: {
    cities: ['Nairobi', 'Lagos', 'Kampala', 'Accra', 'Addis Ababa'],
    photos: [
      [U('1517486808906-6ca8b3f04846'), 'Tree plantation'],
      [U('1469571486292-0ba58a3f068b'), 'Clean water project'],
      [U('1547471080-7cc2caa01a7e'), 'Child welfare'],
      [U('1441974231531-c6227db76b6e'), 'Forest restoration'],
      [U('1500382017468-9049fed747ef'), 'Farm training'],
      [U('1584744982491-665216d95f8b'), 'Health outreach'],
    ],
  },
  europe: {
    cities: ['Berlin', 'Lisbon', 'Warsaw', 'London', 'Madrid'],
    photos: [
      [U('1593113630400-ea4288922497'), 'Food volunteers'],
      [U('1532629345422-7515f3d16bb6'), 'Community circle'],
      [U('1559027615-cd4628902d4a'), 'Volunteer meetup'],
      [U('1521737604893-d14cc237f11d'), 'NGO hackathon'],
      [U('1531482615713-2afd69097998'), 'Skills workshop'],
      [U('1504595403659-9088ce801e29'), 'Elder care'],
    ],
  },
  namerica: {
    cities: ['New York', 'Toronto', 'Mexico City', 'Chicago'],
    photos: [
      [U('1544027993-37dbfe43562a'), 'Street outreach'],
      [U('1593113598332-cd288d649433'), 'Food distribution'],
      [U('1488521787991-ed7bbaae773c'), 'Relief effort'],
      [U('1517245386807-bb43f82c33c4'), 'Fundraiser meet'],
      [U('1522202176988-66273c2fd55f'), 'Youth mentoring'],
      [U('1538108149393-fbbd81895907'), 'Hospital support'],
    ],
  },
  samerica: {
    cities: ['São Paulo', 'Lima', 'Bogotá', 'Buenos Aires'],
    photos: [
      [U('1509099836639-18ba1795216d'), 'Beach cleanup'],
      [U('1465146344425-f00d5f5c8f07'), 'Garden project'],
      [U('1466692476868-aef1dfb1e735'), 'Community garden'],
      [U('1450778869180-41d0601e046e'), 'Animal therapy'],
      [U('1523240795612-9a054b0db644'), 'Student volunteers'],
      [U('1506905925346-21bda4d32df4'), 'Trail restoration'],
    ],
  },
  oceania: {
    cities: ['Sydney', 'Auckland', 'Suva', 'Melbourne'],
    photos: [
      [U('1548199973-03cce0bbc87b'), 'Animal rescue'],
      [U('1444212477490-ca407925329e'), 'Shelter adoption'],
      [U('1470071459604-3b5ec3a7fe05'), 'Coast care'],
      [U('1542601906990-b4d3fb778b09'), 'Climate walk'],
      [U('1573497019940-1c28c88b4f3e'), 'Charity gala'],
      [U('1584515933487-779824d29309'), 'Health van'],
    ],
  },
}

function regionFor(latB, lngB) {
  const latC = 90 - ((latB + 0.5) / LAT_BANDS) * 180
  const lngC = ((lngB + 0.5) / LNG_BANDS) * 360 - 180
  if (lngC < -30) return latC > 12 ? 'namerica' : 'samerica'
  if (lngC < 60) return latC > 36 ? 'europe' : 'africa'
  return latC < -8 ? 'oceania' : 'asia'
}

function drawTile(ctx, img, city) {
  /* full-HD tile: 512×384 canvas, sharp captions */
  const W = 512, H = 384
  ctx.clearRect(0, 0, W, H)
  const s = Math.max(W / img.width, H / img.height)
  const w = img.width * s, h = img.height * s
  ctx.drawImage(img, (W - w) / 2, (H - h) / 2, w, h)
  const g = ctx.createLinearGradient(0, H - 108, 0, H)
  g.addColorStop(0, 'rgba(7,13,26,0)')
  g.addColorStop(1, 'rgba(7,13,26,0.95)')
  ctx.fillStyle = g
  ctx.fillRect(0, H - 108, W, 108)
  ctx.fillStyle = '#4ade80'
  ctx.beginPath()
  ctx.arc(32, H - 36, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,0.95)'
  ctx.font = 'bold 30px system-ui'
  ctx.textAlign = 'left'
  ctx.fillText('📍 ' + city, 56, H - 26)
  ctx.fillStyle = 'rgba(255,255,255,0.55)'
  ctx.font = '22px system-ui'
  ctx.textAlign = 'right'
  ctx.fillText('just now', W - 20, H - 26)
}

/* ---------------- animated counter ---------------- */
function Counter({ value, suffix, label }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-20%' })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const dur = 2000
    let raf
    const step = (t) => {
      const p = Math.min(1, (t - start) / dur)
      setN(Math.floor(value * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, value])

  return (
    <div ref={ref} className="text-center">
      <p className="font-display text-2xl font-bold text-gradient-blue md:text-4xl">
        {n.toLocaleString()}{suffix}
      </p>
      <p className="mt-1.5 text-[10px] uppercase tracking-[0.25em] text-white/40 md:text-xs">{label}</p>
    </div>
  )
}

/* ---------------- the photo-wall globe ---------------- */
export default function GlobeExplore() {
  const mountRef = useRef(null)
  const tipRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    const tipEl = tipRef.current
    if (!mount) return

    const W = () => mount.clientWidth
    const H = () => mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 50)

    /* pull the camera as close as the container allows: the globe fills
       the canvas height, and on narrow screens backs off just enough
       that the sphere is never clipped at the sides */
    const fitCamera = () => {
      const aspect = W() / H()
      camera.aspect = aspect
      const halfTan = Math.tan((45 * Math.PI) / 360)
      const zForHeight = 2.32 / halfTan
      const zForWidth = 2.32 / (halfTan * aspect)
      camera.position.z = Math.max(zForHeight, zForWidth)
      camera.updateProjectionMatrix()
    }
    fitCamera()

    const dpr = Math.min(devicePixelRatio, 1.75)
    const renderer = new THREE.WebGLRenderer({
      antialias: dpr < 1.5,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(dpr)
    renderer.setSize(W(), H())
    renderer.domElement.style.display = 'block'
    renderer.domElement.style.maxWidth = '100%'
    mount.appendChild(renderer.domElement)

    const tiltGroup = new THREE.Group()
    tiltGroup.rotation.z = -AXIAL_TILT * Math.PI / 180
    scene.add(tiltGroup)
    const globe = new THREE.Group()
    tiltGroup.add(globe)

    /* inner sphere */
    globe.add(new THREE.Mesh(
      new THREE.SphereGeometry(R * 0.985, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x0a1226, transparent: true, opacity: 0.92 })
    ))

    /* grid */
    const gridMat = new THREE.LineBasicMaterial({ color: 0x2f6fe0, transparent: true, opacity: 0.55 })
    const circlePoints = (r, segments, fn) => {
      const pts = []
      for (let i = 0; i <= segments; i++) pts.push(fn((i / segments) * Math.PI * 2, r))
      return pts
    }
    for (let i = 1; i < LAT_BANDS; i++) {
      const lat = -90 + (180 / LAT_BANDS) * i
      const phi = (90 - lat) * Math.PI / 180
      const y = R * Math.cos(phi), rr = R * Math.sin(phi)
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(
        circlePoints(rr, 96, (a, r) => new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r))), gridMat))
    }
    for (let i = 0; i < LNG_BANDS; i++) {
      const lng = (360 / LNG_BANDS) * i * Math.PI / 180
      const pts = []
      for (let j = 0; j <= 96; j++) {
        const phi = (j / 96) * Math.PI
        pts.push(new THREE.Vector3(
          R * Math.sin(phi) * Math.cos(lng), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(lng)))
      }
      globe.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), gridMat))
    }

    /* surface dots */
    {
      const N = 900, pos = new Float32Array(N * 3), golden = Math.PI * (3 - Math.sqrt(5))
      for (let i = 0; i < N; i++) {
        const y = 1 - (i / (N - 1)) * 2, rad = Math.sqrt(1 - y * y), th = golden * i
        pos.set([Math.cos(th) * rad * R, y * R, Math.sin(th) * rad * R], i * 3)
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      globe.add(new THREE.Points(g, new THREE.PointsMaterial({
        color: 0x89b4ff, size: 0.018, transparent: true, opacity: 0.5, depthWrite: false })))
    }

    /* photo pools (LRU, no simultaneous duplicates) */
    const pools = {}
    Object.entries(REGIONS).forEach(([region, cfg]) => {
      pools[region] = cfg.photos.map(([url, cause]) => {
        const entry = { img: new Image(), cause, loaded: false, inUse: false, lastUsed: 0 }
        entry.img.crossOrigin = 'anonymous'
        entry.img.onload = () => (entry.loaded = true)
        entry.img.src = url
        return entry
      })
    })

    /* cells */
    const latPlayable = [2, 3, 4, 5, 6, 7, 8, 9]
    const cells = []
    latPlayable.forEach((latB) => {
      for (let lngB = 0; lngB < LNG_BANDS; lngB++) {
        const phiStart = (lngB / LNG_BANDS) * Math.PI * 2
        const phiLen = (Math.PI * 2) / LNG_BANDS
        const thetaStart = (latB / LAT_BANDS) * Math.PI
        const thetaLen = Math.PI / LAT_BANDS
        const inset = 0.015
        const geo = new THREE.SphereGeometry(
          R * 1.002, 10, 10,
          phiStart + phiLen * inset, phiLen * (1 - inset * 2),
          thetaStart + thetaLen * inset, thetaLen * (1 - inset * 2)
        )
        const canvas = document.createElement('canvas')
        canvas.width = 512
        canvas.height = 384
        const texture = new THREE.CanvasTexture(canvas)
        /* correct color space = true brightness; anisotropy = sharp at angles */
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy()
        const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity: 0 })
        const mesh = new THREE.Mesh(geo, mat)
        mesh.visible = false
        globe.add(mesh)
        cells.push({
          mesh, mat, texture, ctx: canvas.getContext('2d'),
          region: regionFor(latB, lngB),
          state: 'empty', life: 0, maxLife: 0,
          entry: null, city: '', hover: false,
        })
      }
    })

    function spawnPhoto() {
      const empty = cells.filter((c) => c.state === 'empty')
      if (!empty.length) return
      const cell = empty[(Math.random() * empty.length) | 0]
      const avail = pools[cell.region].filter((p) => p.loaded && !p.inUse)
      if (!avail.length) return
      avail.sort((a, b) => a.lastUsed - b.lastUsed)
      const entry = avail[0]
      entry.inUse = true
      entry.lastUsed = performance.now()
      const cities = REGIONS[cell.region].cities
      cell.city = cities[(Math.random() * cities.length) | 0]
      cell.entry = entry
      drawTile(cell.ctx, entry.img, cell.city)
      cell.texture.needsUpdate = true
      cell.state = 'in'
      cell.life = 0
      cell.maxLife = LIFETIME[0] + Math.random() * (LIFETIME[1] - LIFETIME[0])
      cell.mesh.visible = true
      cell.mat.opacity = 0
    }

    const spawner = setInterval(() => {
      if (!onScreen) return
      const visible = cells.filter((c) => c.state !== 'empty').length
      const deficit = TARGET_VISIBLE - visible
      for (let i = 0; i < Math.min(3, deficit); i++) spawnPhoto()
    }, 220)

    /* interaction */
    const ray = new THREE.Raycaster()
    const pointer = new THREE.Vector2(-2, -2)
    let hovered = null
    let mouseX = 0, mouseY = 0
    let dragging = false, moved = 0, px = 0, py = 0

    const down = (e) => { dragging = true; moved = 0; px = e.clientX; py = e.clientY }
    const up = () => { dragging = false }
    const move = (e) => {
      const rect = mount.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
      pointer.x = (mouseX / rect.width) * 2 - 1
      pointer.y = -(mouseY / rect.height) * 2 + 1
      if (dragging) {
        moved += Math.abs(e.clientX - px) + Math.abs(e.clientY - py)
        globe.rotation.y += (e.clientX - px) * 0.005
        globe.rotation.x = Math.max(-0.6, Math.min(0.6, globe.rotation.x + (e.clientY - py) * 0.003))
        px = e.clientX
        py = e.clientY
      }
    }
    const click = (e) => {
      if (moved > 6 || !hovered) return
      for (let i = 0; i < 3; i++) {
        const h = document.createElement('div')
        h.className = 'globe-heart'
        h.textContent = ['❤️', '💚', '💙'][i % 3]
        h.style.left = e.clientX + (Math.random() * 30 - 15) + 'px'
        h.style.top = e.clientY + (Math.random() * 10 - 5) + 'px'
        h.style.animationDelay = i * 0.12 + 's'
        document.body.appendChild(h)
        setTimeout(() => h.remove(), 1400)
      }
    }
    mount.addEventListener('pointerdown', down)
    addEventListener('pointerup', up)
    mount.addEventListener('pointermove', move)
    mount.addEventListener('click', click)

    /* render only while on screen */
    let onScreen = false
    const io = new IntersectionObserver(([e]) => { onScreen = e.isIntersecting }, { rootMargin: '120px' })
    io.observe(mount)

    const clock = new THREE.Clock()
    let raf
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!onScreen) { clock.getDelta(); return }
      const dt = Math.min(clock.getDelta(), 0.05)
      const t = clock.elapsedTime

      if (!dragging) globe.rotation.y += hovered ? SPIN_SPEED * 0.15 : SPIN_SPEED

      cells.forEach((c, i) => {
        if (c.state === 'empty') return
        if (c.state === 'in') {
          c.mat.opacity += dt * 2.8
          if (c.mat.opacity >= 1) { c.mat.opacity = 1; c.state = 'alive' }
        } else if (c.state === 'alive') {
          if (!c.hover) c.life += dt
          c.mat.opacity = c.hover ? 1 : 0.97 + Math.sin(t * 1.6 + i) * 0.03
          if (c.life >= c.maxLife) c.state = 'out'
        } else if (c.state === 'out') {
          c.mat.opacity -= dt * 1.8
          if (c.mat.opacity <= 0) {
            c.mat.opacity = 0
            c.mesh.visible = false
            c.state = 'empty'
            c.hover = false
            if (c.entry) { c.entry.inUse = false; c.entry = null }
          }
        }
      })

      /* hover: spotlight + tooltip (imperative — no React churn) */
      ray.setFromCamera(pointer, camera)
      const visibleMeshes = cells.filter((c) => c.state === 'alive' || c.state === 'in').map((c) => c.mesh)
      const hits = ray.intersectObjects(visibleMeshes)
      const hitCell = hits.length ? cells.find((c) => c.mesh === hits[0].object) : null

      if (hitCell !== hovered) {
        if (hovered) hovered.hover = false
        hovered = hitCell
        if (hovered) {
          hovered.hover = true
          tipEl.firstChild.textContent = '📍 ' + hovered.city
          tipEl.lastChild.textContent = hovered.entry.cause + ' · just now'
          tipEl.style.display = 'block'
          mount.style.cursor = 'pointer'
        } else {
          tipEl.style.display = 'none'
          mount.style.cursor = 'grab'
        }
      }
      if (hovered) {
        tipEl.style.left = mouseX + 'px'
        tipEl.style.top = mouseY + 'px'
      }

      renderer.render(scene, camera)
    }
    tick()

    /* track the CONTAINER size, not the window — catches mobile layout
       shifts, font reflows and orientation changes the window event misses */
    const onResize = () => {
      fitCamera()
      renderer.setSize(W(), H())
    }
    const ro = new ResizeObserver(onResize)
    ro.observe(mount)
    addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      clearInterval(spawner)
      io.disconnect()
      ro.disconnect()
      removeEventListener('resize', onResize)
      removeEventListener('pointerup', up)
      mount.removeEventListener('pointerdown', down)
      mount.removeEventListener('pointermove', move)
      mount.removeEventListener('click', click)
      renderer.dispose()
      scene.traverse((o) => {
        o.geometry?.dispose?.()
        if (o.material) {
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          mats.forEach((m) => { m.map?.dispose?.(); m.dispose() })
        }
      })
      mount.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <section id="explore" className="relative py-16 lg:py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        {/* label stays centered at the top, as before */}
        <div className="mb-6 text-center lg:mb-8">
          <p className="section-label !mb-0">Global exploration</p>
        </div>

        {/* desktop: text left, big globe right · mobile: stacked */}
        <div className="grid items-center gap-8 lg:grid-cols-[5fr_7fr] lg:gap-12">
          <div className="text-center lg:text-left">
            <h2 className="font-display text-3xl font-bold leading-[1.08] tracking-tight md:text-5xl lg:text-6xl">
              <span className="sm:whitespace-nowrap">One world.</span>{' '}
              <span className="text-gradient-blue sm:whitespace-nowrap">Spin it.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/55 md:mt-5 md:text-base lg:mx-0">
              Real moments of impact, appearing live from every corner of the world.
              Drag to spin. Hover a photo. Click to send love.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[42vh] min-h-[300px] w-full touch-pan-y sm:h-[46vh] lg:h-[54vh]"
          >
            <div ref={mountRef} className="h-full w-full cursor-grab" />
            <div
              ref={tipRef}
              className="glass pointer-events-none absolute z-10 hidden -translate-x-1/2 -translate-y-[140%] rounded-2xl px-4 py-2.5 text-center"
              style={{ display: 'none' }}
            >
              <p className="text-sm font-bold">&nbsp;</p>
              <p className="text-xs text-emerald-300">&nbsp;</p>
            </div>
          </motion.div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6 md:mt-8 md:grid-cols-4">
          <Counter value={190} suffix="+" label="Countries" />
          <Counter value={62000} suffix="+" label="Organizations" />
          <Counter value={4200000} suffix="" label="Volunteers" />
          <Counter value={820} suffix="M+" label="Raised (USD)" />
        </div>
      </div>
    </section>
  )
}
