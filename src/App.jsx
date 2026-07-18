import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import CosmicScene from './components/CosmicScene.jsx'
import CursorGlow from './components/CursorGlow.jsx'
import IntroOverlay from './components/IntroOverlay.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Problem from './components/Problem.jsx'
import AppReveal from './components/AppReveal.jsx'
import Purpose from './components/Purpose.jsx'
import Causes from './components/Causes.jsx'
import GlobeExplore from './components/GlobeExplore.jsx'
import Stories from './components/Stories.jsx'
import Organizations from './components/Organizations.jsx'
import Download from './components/Download.jsx'
import FinalRipple from './components/FinalRipple.jsx'
import Footer from './components/Footer.jsx'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [phase, setPhase] = useState('begin')
  const [introDone, setIntroDone] = useState(false)
  const sceneRef = useRef(null)

  const onPhase = useCallback((p) => setPhase(p), [])
  const onIntroComplete = useCallback(() => setIntroDone(true), [])

  /* lock scroll during the opening experience */
  useEffect(() => {
    document.body.style.overflow = introDone ? '' : 'hidden'
    window.scrollTo(0, 0)
  }, [introDone])

  /* smooth scroll + canvas fade once the story begins */
  useEffect(() => {
    if (!introDone) return

    const lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1.05 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    /* the globe slowly fades as the problem statement arrives */
    const fade = gsap.to('#cosmic-canvas', {
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: '#problem',
        start: 'top 90%',
        end: 'top 15%',
        scrub: true,
      },
    })

    return () => {
      fade.scrollTrigger?.kill()
      fade.kill()
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [introDone])

  return (
    <div className="grain relative">
      <CursorGlow />
      <CosmicScene ref={sceneRef} onPhase={onPhase} onIntroComplete={onIntroComplete} />

      {!introDone && (
        <>
          <IntroOverlay phase={phase} />
          <button
            onClick={() => sceneRef.current?.skip()}
            className="fixed bottom-8 right-8 z-50 rounded-full border border-white/15 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.2em] text-white/50 backdrop-blur-md transition hover:text-white"
          >
            Skip intro
          </button>
        </>
      )}

      <Navbar visible={introDone} />

      <main className="relative z-10">
        <Hero visible={introDone} />
        <Problem />
        <AppReveal />
        <Purpose />
        <Causes />
        <GlobeExplore />
        <Stories />
        <Organizations />
        <Download />
        <FinalRipple />
        <Footer />
      </main>
    </div>
  )
}
