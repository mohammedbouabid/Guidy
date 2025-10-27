// src/components/FadeInSection.jsx
import { motion } from "framer-motion"

const FadeInSection = ({ children, delay = 0 }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.section>
  )
}

export default FadeInSection
