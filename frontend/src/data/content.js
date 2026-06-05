// ─────────────────────────────────────────────────────────────────────────
// Single source of truth for site copy. Anything the team must supply later
// is marked with a `TODO:` comment.
// ─────────────────────────────────────────────────────────────────────────

export const SERVICES = [
  {
    title: 'Web Development',
    tag: 'High local demand',
    examples: ['Portfolio sites', 'Business sites', 'React apps', 'E-commerce'],
  },
  {
    title: 'Design & Creatives',
    tag: 'Quick turnaround',
    examples: ['Logos', 'Banners', 'Wedding invitations', 'UI/UX mockups'],
  },
  {
    title: 'Coaching & Tutoring',
    tag: 'Zero setup',
    examples: ['DSA', 'Web dev', 'ML', 'Resume help'],
  },
  {
    title: 'Backend & DevOps',
    tag: 'Full-stack support',
    examples: ['REST APIs', 'PostgreSQL', 'Docker', 'Render / Supabase'],
  },
  {
    title: 'AI & Machine Learning',
    tag: 'Our biggest edge',
    examples: ['NLP', 'Text classification', 'Chatbots', 'Fine-tuning', 'Deployment'],
  },
  {
    title: 'Data & Analytics',
    tag: 'Data work',
    examples: ['Web scraping', 'EDA', 'Dashboards', 'Kaggle'],
  },
]

export const PROJECTS = [
  {
    title: 'VINDICATE',
    outcome:
      'Explainable-RL framework generating validity-insured counterfactual explanations (MiniGrid, NSGA-II). 80% efficacy / 92% plausibility.',
    note: 'Research, under review',
    stack: ['Python', 'Gymnasium', 'Stable-Baselines3'],
    image: null, // TODO: add project image to /public and reference here
    live: null,  // TODO: live/demo URL
    repo: null,  // TODO: repository URL
  },
  {
    title: 'Amazon Product Pricing',
    outcome:
      'Multimodal price prediction over 75k products (S-BERT + CLIP + LightGBM, 5-fold CV, 50.85% SMAPE).',
    note: 'AIR 1122 · Amazon ML Challenge 2025',
    stack: ['Python', 'LightGBM', 'CLIP'],
    image: null, // TODO
    live: null,  // TODO
    repo: null,  // TODO
  },
  {
    title: 'Multilingual Hate-Speech Detection',
    outcome:
      'Fine-tuned MuRIL for Hindi/English/Hinglish; Gradio app on Hugging Face Spaces (text, URLs, docs). 80% acc / 0.76 macro-F1.',
    note: 'Samsung Innovation Campus',
    stack: ['MuRIL', 'NLP', 'Gradio'],
    image: null, // TODO
    live: null,  // TODO: Hugging Face Space URL
    repo: null,  // TODO
  },
  {
    title: 'Sanshi',
    outcome:
      'Multi-brand e-commerce platform; search / filter / pagination, email notifications, deployed on Render + Supabase.',
    note: 'Full-stack product',
    stack: ['React', 'Node', 'Express', 'PostgreSQL'],
    image: null, // TODO
    live: null,  // TODO
    repo: null,  // TODO
  },
  {
    title: 'QuattroRealm',
    outcome: '2D strategy game built from scratch with OOP and a custom game loop.',
    note: 'Game dev',
    stack: ['C++', 'SFML'],
    image: null, // TODO
    live: null,  // TODO
    repo: null,  // TODO
  },
  // TODO: add 1–2 web-design client samples below as they're ready.
  {
    title: 'Client Web Design — Coming Soon',
    outcome: 'A web-design client sample slot. Swap in a real project once delivered.',
    note: 'Placeholder',
    stack: ['React', 'Design'],
    image: null,
    live: null,
    repo: null,
    placeholder: true,
  },
  {
    title: 'Client Web Design — Coming Soon',
    outcome: 'A second web-design client sample slot.',
    note: 'Placeholder',
    stack: ['React', 'Design'],
    image: null,
    live: null,
    repo: null,
    placeholder: true,
  },
]

// Pricing — `local` is ₹, `intl` is $. `null` = not offered in that market.
export const PRICING = [
  { service: 'Static landing page', local: '3,000–6,000', intl: '40–75' },
  { service: 'Portfolio site (React)', local: '7,000–10,000', intl: '80–130' },
  { service: 'Business site (React + backend)', local: '15,000–25,000', intl: '200–350' },
  { service: 'E-commerce store', local: '30,000–55,000', intl: '400–700' },
  { service: 'Simple ML model', local: '5,000–15,000', intl: '80–200' },
  { service: 'NLP / text classifier', local: '10,000–25,000', intl: '150–350' },
  { service: 'Fine-tuning a transformer', local: '25,000–60,000', intl: '350–700' },
  { service: 'Logo design', local: '500–1,500', intl: '10–25' },
  { service: 'Wedding invite (animated)', local: '1,000–2,500', intl: null },
  { service: 'DSA / ML coaching', local: '300–800 / hr', intl: null },
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
    role: 'Developer',
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
  'Samsung AI',
  'Amazon ML Challenge · AIR 1122',
  'VINDICATE Research',
  '240+ DSA',
  'Hackathon Winners',
]

export const CONTACT = {
  email: 'vishwajeetsingh1567@gmail.com',
  // TODO: replace with real profile URLs
  linkedin: null, // e.g. 'https://www.linkedin.com/in/...'
  github: null,   // e.g. 'https://github.com/...'
  leetcode: null, // e.g. 'https://leetcode.com/...'
}

// EmailJS — see Contact page. Fill these in to enable real delivery.
// TODO: create a free account at https://www.emailjs.com and paste the IDs.
export const EMAILJS = {
  serviceId: 'TODO_SERVICE_ID',
  templateId: 'TODO_TEMPLATE_ID',
  publicKey: 'TODO_PUBLIC_KEY',
}
