import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

const app = express()
app.use(morgan('dev'))
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 8080
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret'

// In-memory users for demo
const users = new Map() // email -> { email, name, passwordHash }
function hash(pw){ return 'hash:' + pw } // demo only! replace with bcrypt in prod

function signToken(email){
  return jwt.sign({ sub: email }, JWT_SECRET, { expiresIn: '7d' })
}

function auth(req,res,next){
  const auth = req.headers.authorization || ''
  const token = auth.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload.sub
    next()
  } catch(e){
    return res.status(401).json({ error: 'unauthorized' })
  }
}

app.post('/api/auth/signup', (req, res) => {
  const { email, password, name } = req.body || {}
  if(!email || !password) return res.status(400).json({ error: 'email and password required' })
  if(users.has(email)) return res.status(409).json({ error: 'user exists' })
  users.set(email, { email, name: name || 'User', passwordHash: hash(password) })
  return res.json({ token: signToken(email) })
})

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body || {}
  const u = users.get(email)
  if(!u || u.passwordHash !== hash(password)) return res.status(401).json({ error: 'invalid credentials' })
  return res.json({ token: signToken(email) })
})

app.get('/api/me', auth, (req, res) => {
  const u = users.get(req.user)
  res.json({ email: u.email, name: u.name })
})

app.get('/api/dashboard/summary', auth, (req, res) => {
  // mock data — wire to n8n/Twilio/Notion later
  res.json({
    callsToday: 12,
    transfers: 4,
    missed: 2,
    voicemail: 1,
    avgHandleTime: '03:42',
    uptime: '99.98%',
  })
})

app.listen(PORT, () => {
  console.log('LinePilot backend on :' + PORT)
})
