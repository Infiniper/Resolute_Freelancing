import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import Reveal from '../components/Reveal'
import CtaBand from '../components/CtaBand'
import { PRICING, ADD_ONS } from '../data/content'

// Preserve declaration order while grouping rows by `category`.
function groupByCategory(rows) {
  const groups = []
  const index = new Map()
  for (const row of rows) {
    const key = row.category || 'Other'
    if (!index.has(key)) {
      index.set(key, groups.length)
      groups.push({ category: key, rows: [] })
    }
    groups[index.get(key)].rows.push(row)
  }
  return groups
}

export default function Pricing() {
  const [market, setMarket] = useState('local') // 'local' (₹) | 'intl' ($)
  const symbol = market === 'local' ? '₹' : '$'
  const groups = groupByCategory(PRICING)

  return (
    <>
      <Seo
        title="Pricing"
        description="Transparent starting ranges for local (₹) and international ($) clients across web, ML and design."
      />
      <div className="page">
        <PageHeader
          eyebrow="Built for you"
          title="Pricing"
          lead="Premium builds. Pick your market and find the fit for your scope."
        />

        <p className="pricing-perk">
          Every Website / App project includes <strong> &nbsp; 6 months of free maintenance + free logo + free banner / poster.</strong>
        </p>

        <div className="pricing-toggle" role="group" aria-label="Choose pricing market">
          <button
            type="button"
            className={market === 'local' ? 'is-active' : ''}
            aria-pressed={market === 'local'}
            onClick={() => setMarket('local')}
          >
            ₹ India
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
            {groups.map((group) => (
              <li key={group.category} className="pricing-group">
                <h3 className="pricing-cat">{group.category}</h3>
                <ul className="pricing-cat-rows">
                  {group.rows.map((row) => {
                    const value = market === 'local' ? row.local : row.intl
                    return (
                      <li
                        key={row.service}
                        className={`pricing-row${row.popular ? ' is-popular' : ''}`}
                      >
                        <span className="pricing-service">
                          {row.service}
                          {row.popular && <span className="pricing-popular">Most picked</span>}
                        </span>
                        <AnimatePresence mode="wait" initial={false}>
                          <motion.span
                            key={market}
                            className={`pricing-value${value ? '' : ' is-na'}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            transition={{ duration: 0.22 }}
                          >
                            {value ? `${symbol}${value}` : 'India only'}
                          </motion.span>
                        </AnimatePresence>
                      </li>
                    )
                  })}
                </ul>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="glass-card pricing-table pricing-addons" from="right">
          <h3 className="pricing-cat pricing-addons-head">
            Add-ons or Integrations<span>À la carte — stack on top of any package</span>
          </h3>
          <ul className="pricing-cat-rows">
            {ADD_ONS.map((row) => {
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
                      {value ? `${symbol}${value}` : 'India only'}
                    </motion.span>
                  </AnimatePresence>
                </li>
              )
            })}
          </ul>
        </Reveal>

        <p className="pricing-note">
          Final quotes depend on scope, timeline and revisions — every build is custom-quoted.
        </p>

        <Reveal className="pricing-promise" from="left">
          <p>
            Every project is scoped to you, <strong>available at flexible prices</strong>, with honest timelines and clear communication from day one. (T & C Apply)
          </p>
        </Reveal>
      </div>

      <CtaBand
        eyebrow="Want an exact number?"
        title="Tell us the scope, get a quote."
        primary={{ to: '/contact', label: 'Get a quote' }}
      />
    </>
  )
}
