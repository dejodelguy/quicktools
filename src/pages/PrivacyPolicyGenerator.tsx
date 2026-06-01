import { useState } from 'react'
import { FileText, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function PrivacyPolicyGenerator() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [collects, setCollects] = useState({ personal: true, cookies: true, analytics: true, email: false })
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)

  const generate = () => {
    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const lines: string[] = [
      'PRIVACY POLICY',
      '',
      'Last updated: ' + date,
      '',
      (name || '[Company Name]') + ' ("we," "our," or "us") operates ' + (url || '[website URL]') + ' (the "Service"). This page informs you of our policies regarding the collection, use, and disclosure of personal information when you use our Service.',
      '',
      'INFORMATION WE COLLECT',
    ]
    if (collects.personal) lines.push('- Personal identification information (name, email address, phone number)')
    if (collects.cookies) lines.push('- Cookies and usage data')
    if (collects.analytics) lines.push('- Analytics data (pages visited, time spent, browser type)')
    if (collects.email) lines.push('- Email communications and preferences')
    lines.push('')
    lines.push('USE OF INFORMATION')
    lines.push('We use the collected information to:')
    lines.push('- Provide and maintain our Service')
    lines.push('- Notify you about changes to our Service')
    lines.push('- Provide customer support')
    lines.push('- Gather analysis to improve our Service')
    lines.push('- Monitor usage of our Service')
    lines.push('- Detect and address technical issues')
    lines.push('')
    lines.push('DATA SECURITY')
    lines.push('The security of your data is important to us. We strive to use commercially acceptable means of protecting your personal information, but no method of transmission over the Internet is 100% secure.')
    lines.push('')
    lines.push('THIRD-PARTY SERVICES')
    lines.push('We may employ third-party companies and individuals to facilitate our Service, provide Service on our behalf, or perform Service-related activities. These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.')
    lines.push('')
    lines.push('YOUR RIGHTS')
    lines.push('You have the right to:')
    lines.push('- Access your personal data')
    lines.push('- Correct inaccurate data')
    lines.push('- Request deletion of your data')
    lines.push('- Object to processing of your data')
    lines.push('- Data portability')
    lines.push('')
    lines.push('CHANGES TO THIS POLICY')
    lines.push('We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.')
    lines.push('')
    lines.push('CONTACT US')
    lines.push('If you have any questions about this Privacy Policy, please contact us at ' + (email || '[email]') + '.')
    setOutput(lines.join('\n'))
  }

  const copy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <>
      <SEOHead title="Privacy Policy Generator - Create a Privacy Policy Free" description="Generate a privacy policy for your website or app. Customize for your business. Free privacy policy generator." path="/privacy-policy-generator" keywords="privacy policy generator, privacy policy template, create privacy policy, free privacy policy, gdpr policy generator" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4"><FileText className="w-7 h-7 text-slate-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy Generator</h1>
          <p className="text-gray-600">Generate a privacy policy for your website or app.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Company / Website Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="My Company" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Website URL</label>
              <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="https://example.com" />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-1">Contact Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2.5 border border-gray-300 rounded-lg" placeholder="privacy@example.com" />
          </div>
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 block mb-2">Data You Collect</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries({ personal: 'Personal Info', cookies: 'Cookies', analytics: 'Analytics', email: 'Email Marketing' }).map(([key, label]) => (
                <label key={key} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer">
                  <input type="checkbox" checked={collects[key as keyof typeof collects]} onChange={e => setCollects({ ...collects, [key]: e.target.checked })} className="rounded" />
                  <span className="text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
          <button onClick={generate} className="w-full bg-slate-600 text-white py-2.5 rounded-lg font-medium hover:bg-slate-700 transition-colors mb-4">Generate Privacy Policy</button>
          {output && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Your Privacy Policy</span>
                <button onClick={copy} className="flex items-center gap-1.5 text-sm text-slate-600">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
              </div>
              <pre className="p-4 bg-gray-50 rounded-lg text-sm whitespace-pre-wrap max-h-80 overflow-auto">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
