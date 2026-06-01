import { useState } from 'react'
import { FileText, Download, Plus, Trash2, Palette } from 'lucide-react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'
import AffiliateBanner from '../components/AffiliateBanner'

interface LineItem { description: string; quantity: number; rate: number }

const THEMES: Record<string, { primary: string; bg: string; text: string }> = {
  blue: { primary: '#2563eb', bg: '#eff6ff', text: '#1e40af' },
  green: { primary: '#16a34a', bg: '#f0fdf4', text: '#166534' },
  black: { primary: '#1f2937', bg: '#f9fafb', text: '#111827' },
  red: { primary: '#dc2626', bg: '#fef2f2', text: '#991b1b' },
}

export default function InvoiceGenerator() {
  const [theme, setTheme] = useState('blue')
  const [business, setBusiness] = useState({ name: '', address: '', email: '', phone: '' })
  const [client, setClient] = useState({ name: '', address: '', email: '' })
  const [invoiceNum, setInvoiceNum] = useState(`INV-${Date.now().toString().slice(-6)}`)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [dueDate, setDueDate] = useState('')
  const [items, setItems] = useState<LineItem[]>([{ description: '', quantity: 1, rate: 0 }])
  const [taxRate, setTaxRate] = useState(0)
  const [notes, setNotes] = useState('')
  const [generating, setGenerating] = useState(false)

  const t = THEMES[theme]
  const subtotal = items.reduce((sum, i) => sum + i.quantity * i.rate, 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax

  const updateItem = (idx: number, field: keyof LineItem, value: string | number) => {
    const next = [...items]
    ;(next[idx] as any)[field] = value
    setItems(next)
  }

  const addItem = () => setItems([...items, { description: '', quantity: 1, rate: 0 }])
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx))

  const downloadPDF = async () => {
    setGenerating(true)
    try {
      const el = document.getElementById('invoice-preview')
      if (!el) return
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const w = pdf.internal.pageSize.getWidth()
      const h = (canvas.height * w) / canvas.width
      pdf.addImage(imgData, 'PNG', 0, 0, w, h)
      pdf.save(`${invoiceNum}.pdf`)
    } finally {
      setGenerating(false)
    }
  }

  const fmt = (n: number) => n.toFixed(2)

  const input = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
  const label = "block text-xs font-medium text-gray-600 mb-1"

  return (
    <>
      <SEOHead title="Free Invoice Generator — Create & Download PDF Invoices" description="Create professional invoices for free. Download as PDF. Perfect for freelancers and small businesses. Multiple color themes." path="/invoice-generator" keywords="invoice generator, free invoice, pdf invoice, invoice maker, online invoice, freelancer invoice" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><FileText className="w-7 h-7 text-blue-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Invoice Generator</h1>
          <p className="text-gray-600">Create professional invoices and download as PDF</p>
        </div>

        <AdPlaceholder size="leaderboard" />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* FORM */}
          <div className="space-y-6">
            {/* Theme */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2"><Palette className="w-4 h-4" /> Theme</h2>
              <div className="flex gap-3">
                {Object.entries(THEMES).map(([name, colors]) => (
                  <button key={name} onClick={() => setTheme(name)} className={`w-10 h-10 rounded-lg border-2 transition-all ${theme === name ? 'border-blue-500 scale-110' : 'border-transparent'}`} style={{ backgroundColor: colors.primary }} />
                ))}
              </div>
            </div>

            {/* Invoice Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Invoice Details</h2>
              <div className="grid grid-cols-3 gap-3">
                <div><label className={label}>Invoice #</label><input className={input} value={invoiceNum} onChange={e => setInvoiceNum(e.target.value)} /></div>
                <div><label className={label}>Date</label><input type="date" className={input} value={date} onChange={e => setDate(e.target.value)} /></div>
                <div><label className={label}>Due Date</label><input type="date" className={input} value={dueDate} onChange={e => setDueDate(e.target.value)} /></div>
              </div>
            </div>

            {/* Business & Client */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Your Details</h2>
                <div className="space-y-3">
                  <div><label className={label}>Business Name</label><input className={input} value={business.name} onChange={e => setBusiness({ ...business, name: e.target.value })} placeholder="Acme Inc" /></div>
                  <div><label className={label}>Address</label><input className={input} value={business.address} onChange={e => setBusiness({ ...business, address: e.target.value })} placeholder="123 Main St" /></div>
                  <div><label className={label}>Email</label><input className={input} value={business.email} onChange={e => setBusiness({ ...business, email: e.target.value })} placeholder="you@acme.com" /></div>
                  <div><label className={label}>Phone</label><input className={input} value={business.phone} onChange={e => setBusiness({ ...business, phone: e.target.value })} placeholder="+1 555 000" /></div>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-3">Bill To</h2>
                <div className="space-y-3">
                  <div><label className={label}>Client Name</label><input className={input} value={client.name} onChange={e => setClient({ ...client, name: e.target.value })} placeholder="Client Corp" /></div>
                  <div><label className={label}>Address</label><input className={input} value={client.address} onChange={e => setClient({ ...client, address: e.target.value })} placeholder="456 Client Ave" /></div>
                  <div><label className={label}>Email</label><input className={input} value={client.email} onChange={e => setClient({ ...client, email: e.target.value })} placeholder="client@corp.com" /></div>
                </div>
              </div>
            </div>

            {/* Line Items */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-3">Line Items</h2>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-2 items-end">
                    <div className="col-span-5"><label className={label}>Description</label><input className={input} value={item.description} onChange={e => updateItem(idx, 'description', e.target.value)} placeholder="Service or product" /></div>
                    <div className="col-span-2"><label className={label}>Qty</label><input type="number" className={input} value={item.quantity} onChange={e => updateItem(idx, 'quantity', +e.target.value)} min={0} /></div>
                    <div className="col-span-3"><label className={label}>Rate ($)</label><input type="number" className={input} value={item.rate} onChange={e => updateItem(idx, 'rate', +e.target.value)} min={0} step={0.01} /></div>
                    <div className="col-span-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">${fmt(item.quantity * item.rate)}</span>
                      {items.length > 1 && <button onClick={() => removeItem(idx)} className="p-1 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={addItem} className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"><Plus className="w-4 h-4" /> Add Item</button>
            </div>

            {/* Tax & Notes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <label className={label}>Tax Rate (%)</label>
                <input type="number" className={input} value={taxRate} onChange={e => setTaxRate(+e.target.value)} min={0} max={100} />
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <label className={label}>Notes</label>
                <textarea className={`${input} resize-none h-16`} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Payment terms, thank you note..." />
              </div>
            </div>

            <button onClick={downloadPDF} disabled={generating} className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-60">
              <Download className="w-5 h-5" /> {generating ? 'Generating...' : 'Download PDF'}
            </button>
          </div>

          {/* PREVIEW */}
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-3">Preview</h2>
            <div id="invoice-preview" className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
              {/* Header */}
              <div className="p-8" style={{ backgroundColor: t.primary, color: 'white' }}>
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold">{business.name || 'Your Business'}</h1>
                    <p className="text-sm opacity-80 mt-1">{business.address}</p>
                    <p className="text-sm opacity-80">{business.email} {business.phone && `· ${business.phone}`}</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xl font-bold">INVOICE</h2>
                    <p className="text-sm opacity-80 mt-1">#{invoiceNum}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                {/* Bill To & Dates */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.primary }}>Bill To</p>
                    <p className="font-semibold text-gray-900">{client.name || 'Client Name'}</p>
                    <p className="text-sm text-gray-600">{client.address}</p>
                    <p className="text-sm text-gray-600">{client.email}</p>
                  </div>
                  <div className="text-right">
                    <div className="mb-2"><span className="text-xs text-gray-500">Date: </span><span className="text-sm font-medium">{date}</span></div>
                    {dueDate && <div><span className="text-xs text-gray-500">Due: </span><span className="text-sm font-medium">{dueDate}</span></div>}
                  </div>
                </div>

                {/* Table */}
                <table className="w-full mb-8">
                  <thead>
                    <tr style={{ backgroundColor: t.bg }}>
                      <th className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wider" style={{ color: t.text }}>Description</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider w-20" style={{ color: t.text }}>Qty</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider w-24" style={{ color: t.text }}>Rate</th>
                      <th className="text-right py-3 px-4 text-xs font-semibold uppercase tracking-wider w-24" style={{ color: t.text }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.filter(i => i.description).map((item, idx) => (
                      <tr key={idx} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900">{item.description}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 text-right">{item.quantity}</td>
                        <td className="py-3 px-4 text-sm text-gray-700 text-right">${fmt(item.rate)}</td>
                        <td className="py-3 px-4 text-sm font-medium text-gray-900 text-right">${fmt(item.quantity * item.rate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-64">
                    <div className="flex justify-between py-2 text-sm"><span className="text-gray-600">Subtotal</span><span className="font-medium">${fmt(subtotal)}</span></div>
                    {taxRate > 0 && <div className="flex justify-between py-2 text-sm border-t border-gray-100"><span className="text-gray-600">Tax ({taxRate}%)</span><span className="font-medium">${fmt(tax)}</span></div>}
                    <div className="flex justify-between py-3 border-t-2 mt-2" style={{ borderColor: t.primary }}>
                      <span className="font-bold text-lg" style={{ color: t.text }}>Total</span>
                      <span className="font-bold text-lg" style={{ color: t.primary }}>${fmt(total)}</span>
                    </div>
                  </div>
                </div>

                {notes && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: t.primary }}>Notes</p>
                    <p className="text-sm text-gray-600">{notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6">
              <AffiliateBanner affiliate="freshbooks" />
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <AffiliateBanner affiliate="quickbooks" />
          <AffiliateBanner affiliate="wave" />
        </div>
      </div>
    </>
  )
}
