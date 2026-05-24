import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
)

const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
)

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

const TOAST_STYLES = {
  success: {
    bg: 'bg-green-light',
    border: 'border-green/20',
    text: 'text-green',
    Icon: CheckIcon,
  },
  info: {
    bg: 'bg-blue-light',
    border: 'border-blue/20',
    text: 'text-blue',
    Icon: InfoIcon,
  },
  error: {
    bg: 'bg-red-light',
    border: 'border-red/20',
    text: 'text-red',
    Icon: ErrorIcon,
  },
}

export default function Toast({ message, type = 'info', duration = 3000, onClose }) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const style = TOAST_STYLES[type] || TOAST_STYLES.info
  const Icon = style.Icon

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] max-w-md w-full mx-4
                    ${style.bg} ${style.border} border rounded-xl p-4
                    shadow-lg flex items-center gap-3`}
      >
        <div className={`${style.text} shrink-0`}>
          <Icon />
        </div>
        <p className={`${style.text} text-sm font-medium flex-1`}>{message}</p>
        <button
          onClick={onClose}
          className={`${style.text} hover:opacity-70 transition-opacity shrink-0`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </motion.div>
    </AnimatePresence>
  )
}
