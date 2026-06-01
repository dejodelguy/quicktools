import { useState, useMemo } from 'react'
import { Timer, Copy, Check } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function CronBuilder() {
  const [minute, setMinute] = useState('*')
  const [hour, setHour] = useState('*')
  const [dayOfMonth, setDayOfMonth] = useState('*')
  const [month, setMonth] = useState('*')
  const [dayOfWeek, setDayOfWeek] = useState('*')
  const [copied, setCopied] = useState(false)

  const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`

  const description = useMemo(() => {
    try {
      const parts: string[] = []
      if (minute !== '*') parts.push(`at minute ${minute}`)
      if (hour !== '*') parts.push(`at hour ${hour}`)
      if (dayOfMonth !== '*') parts.push(`on day ${dayOfMonth} of the month`)
      if (month !== '*') parts.push(`in month ${month}`)
      if (dayOfWeek !== '*') parts.push(`on ${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][parseInt(dayOfWeek)] || dayOfWeek}`)
      return parts.length ? 'Runs ' + parts.join(', ') : 'Runs every minute'
    } catch { return 'Invalid expression' }
  }, [minute, hour, dayOfMonth, month, dayOfWeek])

  const presets = [
    { label: 'Every minute', val: '* * * * *' },
    { label: 'Every hour', val: '0 * * * *' },
    { label: 'Every day at midnight', val: '0 0 * * *' },
    { label: 'Every Monday at 9am', val: '0 9 * * 1' },
    { label: 'Every 1st of month', val: '0 0 1 * *' },
    { label: 'Every 5 min', val: '*/5 * * * *' },
    { label: 'Weekdays at 9am', val: '0 9 * * 1-5' },
  ]

  const setPreset = (val: string) => {
    const [m, h, d, mo, w] = val.split(' ')
    setMinute(m); setHour(h); setDayOfMonth(d); setMonth(mo); setDayOfWeek(w)
  }

  const copy = () => { navigator.clipboard.writeText(expression); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <>
      <SEOHead title="Cron Expression Builder - Generate Cron Schedules" description="Build and understand cron expressions visually. Common presets included. Free online cron builder." path="/cron-builder" keywords="cron builder, cron expression, cron generator, cron schedule, cron syntax" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Timer className="w-7 h-7 text-slate-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Cron Expression Builder</h1>
          <p className="text-gray-600">Build cron expressions visually with presets.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="grid grid-cols-5 gap-2 mb-4">
            {[
              { label: 'Minute', val: minute, set: setMinute, hint: '0-59' },
              { label: 'Hour', val: hour, set: setHour, hint: '0-23' },
              { label: 'Day', val: dayOfMonth, set: setDayOfMonth, hint: '1-31' },
              { label: 'Month', val: month, set: setMonth, hint: '1-12' },
              { label: 'Weekday', val: dayOfWeek, set: setDayOfWeek, hint: '0-6' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium text-gray-500 block mb-1">{f.label}</label>
                <input type="text" value={f.val} onChange={e => f.set(e.target.value)} className="w-full p-2 border border-gray-300 rounded-lg font-mono text-center text-sm" />
                <div className="text-xs text-gray-400 text-center mt-0.5">{f.hint}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {presets.map(p => (
              <button key={p.label} onClick={() => setPreset(p.val)} className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors">{p.label}</button>
            ))}
          </div>
          <div className="p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-lg font-bold text-gray-800">{expression}</span>
              <button onClick={copy} className="flex items-center gap-1.5 text-sm text-slate-600">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}{copied ? 'Copied!' : 'Copy'}</button>
            </div>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      </div>
    </>
  )
}