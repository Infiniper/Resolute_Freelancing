import { motion } from 'framer-motion'

// Consistent page intro: eyebrow + the page's single <h1> + lead paragraph,
// with a staggered reveal.
export default function PageHeader({ eyebrow, title, lead }) {
  return (
    <header className="page-header">
      <motion.p
        className="eyebrow"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.05 }}
      >
        {eyebrow}
      </motion.p>
      <motion.h1
        className="display-lg"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
      >
        {title}
      </motion.h1>
      {lead && (
        <motion.p
          className="lead"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {lead}
        </motion.p>
      )}
    </header>
  )
}
