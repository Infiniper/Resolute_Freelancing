import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import { PRICING } from '../data/content'

export default function Pricing() {
  const [market, setMarket] = useState('local') // 'local' (₹) | 'intl' ($)
  const symbol = market === 'local' ? '₹' : '$'

  return (
    <>
      <Seo
        title="Pricing"
        description="Transparent starting ranges for local (₹) and international ($) clients across web, ML and design."
      />
      <div className="page">
        <PageHeader
          eyebrow="Starting ranges"
          title="Pricing"
          lead="Honest starting ranges. Switch the market to see what fits."
        />

        <div className="pricing-toggle" role="group" aria-label="Choose pricing market">
          <button
            type="button"
            className={market === 'local' ? 'is-active' : ''}
            aria-pressed={market === 'local'}
            onClick={() => setMarket('local')}
          >
            ₹ Local
          </button>
          <button
            type="button"
            className={market === 'intl' ? 'is-active' : ''}
            aria-pressed={market === 'intl'}
            onClick={() => setMarket('intl')}
          >
            $ International
          </button>
        </div>

        <Reveal className="glass-card pricing-table" from="left">
          <ul>
            {PRICING.map((row) => {
              const value = market === 'local' ? row.local : row.intl
              return (
                <li key={row.service} className="pricing-row">
                  <span className="pricing-service">{row.service}</span>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span
                      key={market}
                      className={`pricing-value${value ? '' : ' is-na'}`}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                    >
                      {value ? `${symbol}${value}` : 'Local only'}
                    </motion.span>
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </Reveal>

        <p className="pricing-note">
          These are starting ranges — final quotes depend on scope, timeline and complexity.
        </p>

        <Reveal className="page-cta">
          <p>Want an exact number?</p>
          <Link to="/contact" className="btn-primary">Get a quote</Link>
        </Reveal>
      </div>
    </>
  )
}
