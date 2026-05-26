import 'dotenv/config'
import Groq from 'groq-sdk'

console.log('Starting Groq test...')
console.log('Key:', process.env.GROQ_API_KEY ? process.env.GROQ_API_KEY.slice(0, 12) + '...' : 'NOT FOUND ✗')

if (!process.env.GROQ_API_KEY) {
  console.error('ERROR: GROQ_API_KEY is missing from .env')
  process.exit(1)
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

try {
  console.log('Calling Groq API...')
  const res = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [{ role: 'user', content: 'Say hello in one sentence.' }],
    max_tokens: 50
  })
  console.log('SUCCESS ✓')
  console.log('Response:', res.choices[0].message.content)
} catch (err) {
  console.error('FAILED ✗')
  console.error('Error:', err.message)
  console.error('Status:', err.status)
}