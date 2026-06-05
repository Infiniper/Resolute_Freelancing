// Each route is a vantage point inside one continuous 3D space. Navigating
// between routes flies the camera from one waypoint to the next (see
// CameraRig), so the site reads as a single flight through space rather than
// a set of page reloads.
//
// `pos`  — where the camera sits.
// `look` — the point it aims at; each route's focal 3D content is anchored
//          here (SceneManager places the scene group at this point).
//
// Waypoints stay within ~25 units of the origin so the camera never leaves
// the surrounding star field. Home is special: its `look` is the origin and
// the scroll-driven storm choreography takes over the camera once we arrive.
export const WAYPOINTS = {
  '/':         { pos: [0, 0.6, 14],    look: [0, 0, 0] },
  '/services': { pos: [-17, 3, 12],    look: [-21, 1.5, -1] },
  '/work':     { pos: [18, -3, 13.5],  look: [22, -5, -1] },
  '/pricing':  { pos: [0, 15, 15],     look: [0, 17.5, -1] },
  '/about':    { pos: [-15, -11, 13],  look: [-19, -13, -1] },
  '/contact':  { pos: [15, 11, 13],    look: [19, 13, -1] },
}

export const ROUTES = ['/', '/services', '/work', '/pricing', '/about', '/contact']

export const fallbackWaypoint = WAYPOINTS['/']
