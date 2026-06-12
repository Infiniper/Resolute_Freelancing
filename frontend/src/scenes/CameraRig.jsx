import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { WAYPOINTS, fallbackWaypoint } from './waypoints'
import { signals } from './signals'
import { lerp, range, easeInOut, S_FLY_START, URPRISE_Y } from '../data/stormConfig'

// Reused scratch vectors — never allocate inside useFrame.
const _pos = new THREE.Vector3()
const _look = new THREE.Vector3()
const _toPos = new THREE.Vector3()
const _toLook = new THREE.Vector3()

// Resolve a route's camera destination into the out vectors.
function resolveTarget(route, outPos, outLook) {
  if (route === '/') {
    // Storm choreography: as the user scrolls, pan straight down from the
    // title to "surprise!", tracking the falling "s". Same math as the
    // original Director so the camera and the "s" stay locked together.
    // `heroScale` matches HomeScene's fit-to-viewport scaling of the wordmark.
    const p = signals.homeScroll
    const reveal = signals.homeReveal
    const sc = signals.heroScale
    const peak = range(p, 0.35, S_FLY_START)
    const fly = range(p, S_FLY_START, 1.0)
    const e = easeInOut(fly)
    const shake = peak * 0.22 * (1 - fly)
    const past = 1 - reveal   // 0 at rest → 1 once the payoff has fully revealed
    // Parallax: the camera both shifts and *turns* toward the cursor (the look
    // offset gives real rotational depth, not just a slide). Strongest at rest,
    // fades out as the storm peaks/the word dissolves (reveal → 0).
    const px = signals.pointerSmooth.x
    const py = signals.pointerSmooth.y
    outPos.set(
      (Math.random() - 0.5) * shake + px * 1.2 * reveal,
      lerp(0.6, URPRISE_Y * sc + 0.6, e) + (Math.random() - 0.5) * shake + py * 0.8 * reveal + past * 3,
      lerp(14, 8, past) // dolly forward into open space as the word dissolves
    )
    outLook.set(px * 0.5 * reveal, lerp(0, URPRISE_Y * sc, e) + py * 0.32 * reveal + past * 3, 0)
    return
  }
  const wp = WAYPOINTS[route] || fallbackWaypoint
  outPos.set(...wp.pos)
  outLook.set(...wp.look)
}

/**
 * Owns the camera. Holds each route's vantage point and GSAP-flies between
 * them on navigation; on Home it hands control to the scroll-driven storm.
 */
export default function CameraRig({ route }) {
  const { camera } = useThree()
  const navT = useRef({ t: 1 })          // 0→1 progress of the current fly
  const transitioning = useRef(false)
  const fromPos = useRef(new THREE.Vector3())
  const fromLook = useRef(new THREE.Vector3())
  const curLook = useRef(new THREE.Vector3(0, 0, 0))

  // Place the camera at the home vantage on first mount.
  useEffect(() => {
    resolveTarget('/', _toPos, _toLook)
    camera.position.copy(_toPos)
    curLook.current.copy(_toLook)
    camera.lookAt(_toLook)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // On route change: snapshot the current pose, then ease to the new vantage.
  useEffect(() => {
    fromPos.current.copy(camera.position)
    fromLook.current.copy(curLook.current)
    transitioning.current = true
    navT.current.t = 0
    const tween = gsap.to(navT.current, {
      t: 1,
      duration: 1.2,
      ease: 'power2.inOut',
      onComplete: () => { transitioning.current = false },
    })
    return () => tween.kill()
  }, [route, camera])

  useFrame(() => {
    // Smooth the raw pointer once, here (the single camera owner), so every
    // parallax term below stays jitter-free and comfortable.
    const sp = signals.pointerSmooth
    sp.x = lerp(sp.x, signals.pointer.x, 0.06)
    sp.y = lerp(sp.y, signals.pointer.y, 0.06)

    resolveTarget(route, _toPos, _toLook)

    if (transitioning.current) {
      const t = navT.current.t
      _pos.copy(fromPos.current).lerp(_toPos, t)
      _look.copy(fromLook.current).lerp(_toLook, t)
    } else {
      _pos.copy(_toPos)
      _look.copy(_toLook)
      // Idle parallax on the static (non-home) vantages — the camera slides
      // toward the cursor *and* turns to face it (the look offset adds real
      // depth, like peering around the scene). Smooth via the lerped pointer.
      if (route !== '/') {
        _pos.x += sp.x * 2.0
        _pos.y += sp.y * 1.4
        _look.x += sp.x * 0.7
        _look.y += sp.y * 0.45
      }
    }

    camera.position.copy(_pos)
    curLook.current.copy(_look)
    camera.lookAt(_look)
  })

  return null
}
