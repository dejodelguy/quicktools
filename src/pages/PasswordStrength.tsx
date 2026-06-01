import { useState } from 'react'
import { ShieldCheck, Eye, EyeOff } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function PasswordStrength() {
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  const analyze = (pw: string) => {
    let score = 0
    const checks = [
      { label: 'At least 8 characters', pass: pw.length >= 8 },
      { label: 'At least 12 characters', pass: pw.length >= 12 },
      { label: 'Contains uppercase', pass: /[A-Z]/.test(pw) },
      { label: 'Contains lowercase', pass: /[a-z]/.test(pw) },
      { label: 'Contains numbers', pass: /\d/.test(pw) },
      { label: 'Contains symbols', pass: /[^A-Za-z0-9]/.test(pw) },
      { label: 'No common patterns', pass: !/(123|abc|qwerty|password|admin)/i.test(pw) },
      { label: 'No repeated characters', pass: !/(.)\1{2,}/.test(pw) },
    ]
    score = checks.filter(c => c.pass).length
    const crackTime = pw.length === 0 ? '' : estimateCrackTime(pw)
    return { score, checks, crackTime }
  }

  const { score, checks, crackTime } = analyze(password)
  const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong', 'Excellent', 'Excellent']
  const colors = ['bg-red-500', 'bg-red-400', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-green-500', 'bg-green-600', 'bg-emerald-600']

  return (
    <>
      <SEOHead title="Password Strength Checker - Test Your Password Security" description="Check how strong your password is. Get instant feedback on password security and estimated crack time." path="/password-strength" keywords="password strength, password checker, password security, how strong is my password, password tester" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4"><ShieldCheck className="w-7 h-7 text-emerald-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Password Strength Checker</h1>
          <p className="text-gray-600">Test how secure your password is.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="relative mb-4">
            <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 pr-12 border border-gray-300 rounded-lg text-lg" placeholder="Enter a password to check..." />
            <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
          </div>
          {password && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${colors[score]}`} style={{ width: `${(score / 8) * 100}%` }} />
                </div>
                <span className="text-sm font-bold" style={{ color: score <= 2 ? '#ef4444' : score <= 4 ? '#eab308' : '#22c55e' }}>{levels[score]}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {checks.map((c, i) => (
                  <div key={i} className={`flex items-center gap-2 text-sm p-2 rounded-lg ${c.pass ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    <span>{c.pass ? '✓' : '✗'}</span> {c.label}
                  </div>
                ))}
              </div>
              {crackTime && (
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <div className="text-sm text-gray-500">Estimated crack time</div>
                  <div className="text-xl font-bold text-gray-800">{crackTime}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function estimateCrackTime(pw: string): string {
  let charset = 0
  if (/[a-z]/.test(pw)) charset += 26
  if (/[A-Z]/.test(pw)) charset += 26
  if (/\d/.test(pw)) charset += 10
  if (/[^A-Za-z0-9]/.test(pw)) charset += 33
  const combinations = Math.pow(charset, pw.length)
  const seconds = combinations / 1e10
  if (seconds < 1) return 'Instantly'
  if (seconds < 60) return Math.round(seconds) + ' seconds'
  if (seconds < 3600) return Math.round(seconds / 60) + ' minutes'
  if (seconds < 86400) return Math.round(seconds / 3600) + ' hours'
  if (seconds < 31536000) return Math.round(seconds / 86400) + ' days'
  if (seconds < 31536000 * 1000) return Math.round(seconds / 31536000) + ' years'
  return 'Centuries+'
}