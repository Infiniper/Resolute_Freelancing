// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for site copy. Anything the team must supply later
// is marked with a `TODO:` comment.
// ─────────────────────────────────────────────────────────────────────────

// Per service: `blurb` is a client-facing one-liner; `img` is the card photo
// (1:1 source in /public/services_images, object-cover cropped on the card);
// `art` is the inline SVG illustration shown as the fallback if the photo fails.
export const SERVICES = [
  {
    title: 'Website Development',
    tag: 'Our Craft',
    blurb: 'Conversion-driven sites and web apps that turn visitors into paying customers.',
    art: 'web',
    img: '/services_images/web_dev.png',
    examples: ['Business Sites', 'Portfolio Sites', 'React Apps', 'E-commerce'],
  },
  {
    title: 'Design & Creatives',
    tag: 'Brand & Visuals',
    blurb: 'Standout brand visuals that make people stop, look, and remember you.',
    art: 'design',
    img: '/services_images/design_creative.png',
    examples: ['Logos', 'Banners', 'Ads', 'Posters', 'Wedding Invitations', 'UI/UX Mockups'],
  },
  {
    title: 'Backend & DevOps',
    tag: 'Ships & Scales',
    blurb: 'Rock-solid APIs and infrastructure that scale cleanly under real-world traffic.',
    art: 'backend',
    img: '/services_images/DevOps.png',
    examples: ['APIs', 'PostgreSQL', 'Docker', 'Cloud Deployment', 'CI/CD', 'Monitoring'],
  },
  {
    title: 'AI & Machine Learning',
    tag: 'Smart Systems',
    blurb: 'Production-grade AI — chatbots and models that ship real results.',
    art: 'ai',
    img: '/services_images/AI.png',
    examples: ['Chatbots', 'Models', 'Deployment'],
  },
  {
    title: 'Data & Analytics',
    tag: 'Decisions from Data',
    blurb: 'Turn messy data into clear dashboards and insights that drive better decisions.',
    art: 'data',
    img: '/services_images/decode.png',
    examples: ['Web scraping', 'EDA', 'Dashboards', 'Data visualization'],
  },
  {
    title: 'Coaching & Tutoring',
    tag: 'Grow',
    blurb: 'DSA, Web, AI, and other Computer Science Courses.',
    art: 'coach',
    img: '/services_images/coaching.png',
    examples: ['DSA', 'Web Development', 'AI', 'Computer Science'],
  }
]

// Per project: `image` is the poster, `preview` an optional short muted clip
// shown on hover (desktop) / in-view (mobile). Drop the files in /public/work/
// (e.g. image: '/work/vindicate.jpg', preview: '/work/vindicate.mp4').
export const PROJECTS = [
  {
    title: 'Yahora',
    outcome:
      'A campus marketplace web app for students to list, discover and pass on second-hand goods — "keep the story going" — with a clean, fully responsive React interface.',
    note: 'Startup · Marketplace',
    stack: ['React', 'Vite', 'React Router'],
    image: '/work/yahora.png',
    preview: '/work/yahora.mov',
    live: 'https://yahora.netlify.app/',
    repo: 'https://github.com/Infiniper/Yahora',
  },
  {
    title: 'Pankaj Traders',
    outcome:
      'A fast, frontend-only React storefront for a building-materials & construction business — a multi-category product catalog, an image gallery, and a WhatsApp-based enquiry flow.',
    note: 'Client project',
    stack: ['React', 'Vite', 'React Router', 'CSS Modules'],
    image: '/work/pankaj-traders.png',
    preview: '/work/pankaj-traders.mov',
    live: 'https://pankajtraders.netlify.app/',
    repo: 'https://github.com/Neeraj-tech360/pankaj-traders',
  },
  {
    title: 'Sanshi E-Com',
    outcome:
      'A full-stack e-commerce platform for fashion & accessories — a responsive React storefront with dynamic catalogs and category browsing, backed by an Express API and Supabase.',
    note: 'Full-stack product',
    stack: ['React', 'Node', 'Express', 'PostgreSQL', 'Supabase'],
    image: '/work/sanshi-ecom.png',
    preview: '/work/sanshi-ecom.mov',
    live: 'https://sanshiecom.netlify.app/',
    repo: 'https://github.com/Infiniper/sanshi-ecom',
  },
  {
    title: 'Sanshi H2O',
    outcome:
      'A full-stack store with an integrated admin dashboard for managing products and categories — a React storefront, an Express + EJS admin panel, and Supabase.',
    note: 'Full-stack product',
    stack: ['React', 'Node', 'Express', 'PostgreSQL', 'Supabase'],
    image: '/work/sanshi-h2o.png',
    preview: '/work/sanshi-h2o.mov',
    live: 'https://sanshih2o.netlify.app/',
    repo: 'https://github.com/Infiniper/sanshi-h2o',
  },
  {
    title: 'NGCN',
    outcome:
      'A research-hub website for a next-gen computing & networking group — a publications catalog, team profiles, a markdown blog and a gallery, on a React 19 + Tailwind frontend with an Express API.',
    note: 'Research hub',
    stack: ['React', 'Tailwind CSS', 'Node', 'Express', 'Supabase'],
    image: '/work/ngcn.png',
    preview: '/work/ngcn.mov',
    live: 'https://ngcn.netlify.app/',
    repo: 'https://github.com/Infiniper/NGCN',
  },
  {
    title: 'QuattroRealm',
    outcome: '2D strategy game built from scratch with OOP and a custom game loop.',
    note: 'Game dev',
    stack: ['C++', 'SFML'],
    image: '/work/quattrorealm.png',
    preview: '/work/quattrorealm.mov',
    live: 'https://youtu.be/1s_1gz1ykmo?si=Eu1C2tSVd_v9WT00',
    repo: 'https://github.com/Infiniper/QuattroRealm',
  },
  {
    title: 'Multilingual Hate-Speech Detection',
    outcome:
      'Fine-tuned MuRIL for Hindi/English/Hinglish; Gradio app on Hugging Face Spaces. 80% acc / 0.76 macro-F1.',
    note: 'Samsung Innovation Campus',
    stack: ['MuRIL', 'NLP', 'Hugging Face', 'Gradio', 'Python'],
    image: '/work/hate-speech.png',
    preview: '/work/hate-speech.mov',
    live: 'https://huggingface.co/spaces/infiniper/Multilingual-Hate-Speech-Detector',
    repo: 'https://github.com/Infiniper/MuRIL-Hate-Text-Detector',
  },
]

// Pricing — `local` is ₹ (INR), `intl` is $ (USD). `null` = not offered in that
// market. `category` groups rows under subheaders; `popular` highlights an
// anchor tier per category. 
export const PRICING = [
  // ── Websites ──────────────────────────────────────────────
  { category: 'Websites', service: 'Static Landing Page',             local: '2,500–5,000',   intl: '35–65' },
  { category: 'Websites', service: 'Multi-Page Static Business Site',                   local: '7,000–15,000',  intl: '90–160', popular: true },
  { category: 'Websites', service: 'Business Dynamic Site (with Backend)',    local: '15,000–50,000', intl: '200–750' },
  { category: 'Websites', service: 'E-commerce / Site with CMS / Admin Panel',              local: '20,000–40,000', intl: '300–540' },
  { category: 'Websites', service: 'Cinematic 3D / Interactive Site',          local: '15,000–60,000', intl: '350–800' },

  // ── Mobile Apps (Android/iOS) ─────────────────────────────────────
  { category: 'Mobile Apps (Android/iOS)', service: 'Mobile App (React Native)',            local: '20,000–1,20,000', intl: '300–1,600' },

  // ── Design & Creatives ────────────────────────────────────────────────
  { category: 'Design & Creatives', service: 'Logo — Single Concept (3 Versions)',                     local: '500–1,000',   intl: '10–20' },
  { category: 'Design & Creatives', service: 'Logo — Multiple Concepts / Versions + Files',          local: '1,000–3,500', intl: '25–50' },
  { category: 'Design & Creatives', service: 'Logo + Brand Kit (Colours, Fonts, Assets)', local: '1,500–8,000', intl: '50–110' },
  { category: 'Design & Creatives', service: 'Social Media Posters / Banners — each',         local: '150–500',     intl: '5–12' },
  { category: 'Design & Creatives', service: 'Invitation (Image / Animated Video)',                 local: '1,000–2,500', intl: null },
  { category: 'Design & Creatives', service: 'Poster / Flyer (print-ready)',              local: '600–1,500',   intl: '10–25' },
  { category: 'Design & Creatives', service: 'Social Media Kit — (8-10 Graphics)',          local: '2,000–5,000', intl: '30–70' },

  // ── AI / ML & Coaching ────────────────────────────────────
  { category: 'Others', service: 'AI / ML Project',               local: '5,000–60,000',  intl: '80–700' },
  { category: 'Others', service: 'DSA / AI / Web Development',  local: '400–800 /hour',       intl: null },
  { category: 'Others', service: 'Classes 5 - 10',  local: '250–700 /hour',       intl: null },
]

// À la carte — stacked on top of any package.
export const ADD_ONS = [
  { service: 'Extra Pages',                          local: '300–2,000',    intl: '12–28' },
  { service: 'Custom Animations / Scroll Effects',  local: '500–6,000',  intl: '30–85' },
  { service: 'SEO Setup (meta, sitemap, speed)',    local: '1,000–5,000',  intl: '30–70' },
  { service: 'Domain + Hosting Setup & Deploy',     local: '500–1,500',    intl: '8–20' },
  { service: 'Contact Form / WhatsApp Integration', local: '100–1,500',    intl: '8–20' },
  { service: 'CMS / Admin Panel',                   local: '5,000–15,000', intl: '70–200' },
  { service: 'Content / Copywriting — per page',    local: '500–1,500',    intl: '8–20' },
  { service: 'Maintenance & Support',     local: '100–3,000 /month',  intl: '15–40 /month' },
]

export const TEAM = [
  {
    name: 'Vishwajeet',
    role: 'Primary Developer — AI/ML + Full-Stack',
    blurb:
      'Leads builds end to end: research-grade ML, fine-tuning and deployment through to production React/Node apps.',
  },
  {
    name: 'Neeraj',
    role: 'Primary Developer — AI/ML + Full-Stack',
    blurb: 'Full-stack and design support across the studio’s projects.',
  },
]

export const CREDENTIALS = [
  'Samsung Innovation Campus',
  'Amazon ML Challenge — AIR 1122',
  'NPTEL — IIT Madras / IIT Roorkee',
  'Hackathon Winners',
  '240+ LeetCode',
]

export const TRUST_STRIP = [
  'Design & Creatives', 'Web Development', 'App Development', 'AI/ML', 'Tutoring'
]

export const CONTACT = {
  email: 'perffinity360@gmail.com',
  linkedin: 'https://www.linkedin.com/in/vishwajeet1567',
  github: 'https://github.com/infiniper/',
  leetcode: 'https://leetcode.com/u/infiniper/',
  // Phone / WhatsApp — both reachable. `label` is for display, `tel` keeps the
  // +country format for tel: links, `wa` is digits-only for wa.me click-to-chat.
  // The first entry is the team number the contact-form WhatsApp button uses.
  phones: [
    { label: '+91 91404 00064', tel: '+919140400064', wa: '919140400064' },
    { label: '+91 63864 44659', tel: '+916386444659', wa: '916386444659' },
  ],
}

// EmailJS — see Contact page. Fill these in to enable real delivery.
// NOTE: add a `{{phone}}` field to the EmailJS template so the optional
// Phone / WhatsApp number from the form comes through.
export const EMAILJS = {
  serviceId: 'service_ibmilrn',    // Email Services page
  templateId: 'template_4olzfcs',  // Email Templates page
  publicKey: '37YpPIds6PlWsb9ia',  // Account → API Keys
}
