import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Logo from './Logo'

type Props = { onAuth: (token: string) => void }

export default function AuthScreen({ onAuth }: Props) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const toggle = () => setMode(m => (m === 'login' ? 'signup' : 'login'))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup'
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    })
    if (!res.ok) { alert('Auth failed'); return }
    const data = await res.json()
    onAuth(data.token)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background blobs that morph when mode changes */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 -z-10"
        >
          <div className="absolute -top-32 -left-32 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-30"
               style={{ background: mode === 'login' ? 'radial-gradient(circle at 30% 30%, #22c55e, transparent 60%)' : 'radial-gradient(circle at 30% 30%, #60a5fa, transparent 60%)' }} />
          <div className="absolute -bottom-24 -right-24 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-30"
               style={{ background: mode === 'login' ? 'radial-gradient(circle at 70% 70%, #16a34a, transparent 60%)' : 'radial-gradient(circle at 70% 70%, #38bdf8, transparent 60%)' }} />
        </motion.div>
      </AnimatePresence>

      <div className="w-full max-w-md card p-8">
        <div className="flex items-center gap-3 mb-6">
          <Logo className="w-9 h-9 text-brand-500" />
          <div>
            <div className="text-lg font-semibold">LinePilot</div>
            <div className="subtitle">AI Voice Console</div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <div className="title">{mode === 'login' ? 'Welcome back' : 'Create your account'}</div>
          <button className="btn-ghost text-white/80" onClick={toggle}>
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </div>

        {/* Card that flips subtly between modes */}
        <motion.form
          onSubmit={submit}
          initial={{ rotateY: 10 }}
          animate={{ rotateY: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14 }}
          className="space-y-4"
        >
          {mode === 'signup' && (
            <div>
              <label className="subtitle">Name</label>
              <input required value={name} onChange={e => setName(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg glass outline-none" placeholder="Jane Doe" />
            </div>
          )}
          <div>
            <label className="subtitle">Email</label>
            <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg glass outline-none" placeholder="you@company.com" />
          </div>
          <div>
            <label className="subtitle">Password</label>
            <input required type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-1 px-3 py-2 rounded-lg glass outline-none" placeholder="••••••••" />
          </div>

          <button type="submit" className="btn-primary w-full">{mode === 'login' ? 'Log in' : 'Sign up'}</button>
        </motion.form>
      </div>
    </div>
  )
}
