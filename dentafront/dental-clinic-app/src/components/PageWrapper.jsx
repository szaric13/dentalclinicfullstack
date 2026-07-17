import { motion } from "framer-motion"
import { Helmet } from "react-helmet-async"
import { CLINIC } from "../lib/data"

export default function PageWrapper({ children, title, description, className = "" }) {
  return (
      <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={className}
      >
        <Helmet>
          <title>{title ? `${title} | ${CLINIC.name}` : `${CLINIC.name} — ${CLINIC.tagline}`}</title>
          {description && <meta name="description" content={description} />}
        </Helmet>
        {children}
      </motion.div>
  )
}