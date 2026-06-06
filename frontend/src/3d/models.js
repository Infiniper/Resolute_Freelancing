// Clean, hyphenated paths for the Poly Pizza models in /public/models. Three of
// the originals shipped with spaces / %-escapes in their names (fragile to load)
// and were renamed to these. Imported by the per-route scenes.
export const MODELS = {
  asteroid: '/models/Asteroid.glb',
  astronaut: '/models/Astronaut.glb',
  comet: '/models/Comet.glb',
  saucer: '/models/flying-saucer.glb',
  iss: '/models/iss.glb',
  planet: '/models/Planet.glb',
  satellite: '/models/Satellite.glb',
  spaceship: '/models/spaceship.glb',
}

// CC-BY attribution — Poly Pizza models require crediting their authors (see
// Footer). TODO(owner): fill in each `author` from the model's poly.pizza page.
export const MODEL_CREDITS = [
  { name: 'Asteroid', author: 'TODO' },
  { name: 'Astronaut', author: 'TODO' },
  { name: 'Comet', author: 'TODO' },
  { name: 'Flying saucer', author: 'TODO' },
  { name: 'International Space Station', author: 'TODO' },
  { name: 'Planet', author: 'TODO' },
  { name: 'Satellite', author: 'TODO' },
  { name: 'Spaceship', author: 'TODO' },
]
