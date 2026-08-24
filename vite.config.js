import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const CONTENT_PATH = path.resolve('./src/data/content.json')
const ADMIN_PIN = process.env.ADMIN_PIN || "2027"

// In-memory store for active session tokens & login rate limiting
const activeTokens = new Set()
const failedAttempts = new Map() // ip -> { count, lockUntil }

function getClientIp(req) {
  return req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1'
}

// ── Admin API plugin ──────────────────────────────────────────
function contentApiPlugin() {
  return {
    name: 'genwebzy-content-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*')
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

        if (req.method === 'OPTIONS') {
          res.statusCode = 204
          return res.end()
        }

        const ip = getClientIp(req)

        // 1. PIN Login Endpoint (/api/login)
        if (req.url === '/api/login' && req.method === 'POST') {
          const attemptData = failedAttempts.get(ip) || { count: 0, lockUntil: 0 }
          if (Date.now() < attemptData.lockUntil) {
            const minutesLeft = Math.ceil((attemptData.lockUntil - Date.now()) / 60000)
            res.statusCode = 429
            res.setHeader('Content-Type', 'application/json')
            return res.end(JSON.stringify({ error: `Too many failed attempts. Locked for ${minutesLeft} minute(s).` }))
          }

          let body = ''
          req.on('data', chunk => { body += chunk.toString() })
          req.on('end', () => {
            try {
              const { pin } = JSON.parse(body)
              if (pin === ADMIN_PIN) {
                failedAttempts.delete(ip)
                const token = crypto.randomBytes(32).toString('hex')
                activeTokens.add(token)
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: true, token }))
              } else {
                attemptData.count += 1
                if (attemptData.count >= 5) {
                  attemptData.lockUntil = Date.now() + 15 * 60 * 1000
                  failedAttempts.set(ip, attemptData)
                  res.statusCode = 429
                  res.setHeader('Content-Type', 'application/json')
                  return res.end(JSON.stringify({ error: '5 failed attempts. Account locked for 15 minutes.' }))
                } else {
                  failedAttempts.set(ip, attemptData)
                  res.statusCode = 401
                  res.setHeader('Content-Type', 'application/json')
                  return res.end(JSON.stringify({ error: `Incorrect PIN. ${5 - attemptData.count} attempts remaining.` }))
                }
              }
            } catch (e) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid request' }))
            }
          })
          return
        }

        // 2. Token Verification Endpoint (/api/verify-token)
        if (req.url === '/api/verify-token' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk.toString() })
          req.on('end', () => {
            try {
              const { token } = JSON.parse(body)
              if (token && activeTokens.has(token)) {
                res.setHeader('Content-Type', 'application/json')
                return res.end(JSON.stringify({ valid: true }))
              }
              res.statusCode = 401
              res.setHeader('Content-Type', 'application/json')
              return res.end(JSON.stringify({ valid: false }))
            } catch (e) {
              res.statusCode = 400
              res.end(JSON.stringify({ valid: false }))
            }
          })
          return
        }

        // 3. Content API (/api/content)
        if (req.url === '/api/content') {
          if (req.method === 'GET') {
            try {
              const data = fs.readFileSync(CONTENT_PATH, 'utf-8')
              res.setHeader('Content-Type', 'application/json')
              res.end(data)
            } catch (e) {
              res.statusCode = 500
              res.end(JSON.stringify({ error: e.message }))
            }
            return
          }

          if (req.method === 'POST') {
            const authHeader = req.headers['authorization'] || ''
            const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader

            if (!token || !activeTokens.has(token)) {
              res.statusCode = 401
              res.setHeader('Content-Type', 'application/json')
              return res.end(JSON.stringify({ error: 'Unauthorized. Invalid or expired token.' }))
            }

            let body = ''
            req.on('data', chunk => { body += chunk.toString() })
            req.on('end', () => {
              try {
                const parsed = JSON.parse(body)
                const pretty = JSON.stringify(parsed, null, 2)
                fs.writeFileSync(CONTENT_PATH, pretty, 'utf-8')
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ ok: true }))
              } catch (e) {
                res.statusCode = 400
                res.end(JSON.stringify({ error: e.message }))
              }
            })
            return
          }

          res.statusCode = 405
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        next()
      })
    }
  }
}

export default defineConfig({
  plugins: [react(), contentApiPlugin()],
})
