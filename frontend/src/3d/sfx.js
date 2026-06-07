// A tiny, subtle "crack" for shattering an asteroid — synthesised with WebAudio
// (no audio asset to ship). Created lazily *inside* the user gesture (a click or
// tap, which satisfies the autoplay policy), kept quiet, and fully guarded so it
// can never throw or block the interaction if WebAudio is unavailable.
let ctx

export function playCrack() {
  try {
    if (typeof window === 'undefined') return
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    ctx = ctx || new AC()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    const dur = 0.18

    // A short burst of decaying noise → the "crack".
    const buffer = ctx.createBuffer(1, Math.max(1, Math.floor(ctx.sampleRate * dur)), ctx.sampleRate)
    const data = buffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      const k = 1 - i / data.length
      data[i] = (Math.random() * 2 - 1) * k * k
    }
    const src = ctx.createBufferSource()
    src.buffer = buffer

    const filter = ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 550 + Math.random() * 500
    filter.Q.value = 0.7

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.06, now) // subtle
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur)

    src.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)
    src.start(now)
    src.stop(now + dur)
  } catch {
    /* sound is optional — never let it break the shatter */
  }
}
