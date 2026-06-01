import {
  FileText, Braces, Type, Palette, Binary, QrCode,
  Calculator, Shield, GitCompare, FileCode, Zap, Lock, Smartphone
} from 'lucide-react'
import ToolCard from '../components/ToolCard'
import SEOHead from '../components/SEOHead'
import AdPlaceholder from '../components/AdPlaceholder'

const tools = [
  { title: 'Invoice Generator', description: 'Create professional invoices and download as PDF. Perfect for freelancers and small businesses.', path: '/invoice-generator', icon: FileText, featured: true },
  { title: 'JSON Formatter', description: 'Format, validate, and minify JSON data instantly. With syntax highlighting and tree view.', path: '/json-formatter', icon: Braces, featured: true },
  { title: 'Word Counter', description: 'Count words, characters, sentences, and paragraphs. Analyze reading time and keyword density.', path: '/word-counter', icon: Type, featured: true },
  { title: 'Password Generator', description: 'Generate strong, secure passwords with customizable length and character types.', path: '/password-generator', icon: Shield, featured: true },
  { title: 'QR Code Generator', description: 'Create QR codes for URLs, text, and more. Download as PNG with custom sizes.', path: '/qr-code-generator', icon: QrCode },
  { title: 'Color Converter', description: 'Convert colors between HEX, RGB, HSL formats. Generate complementary palettes.', path: '/color-converter', icon: Palette },
  { title: 'Base64 Tool', description: 'Encode and decode Base64 strings. Supports text and file conversion.', path: '/base64-tool', icon: Binary },
  { title: 'Percentage Calculator', description: 'Calculate percentages, percentage change, and ratios instantly.', path: '/percentage-calculator', icon: Calculator },
  { title: 'Text Diff', description: 'Compare two texts side by side and highlight the differences line by line.', path: '/text-diff', icon: GitCompare },
  { title: 'Markdown Preview', description: 'Write and preview Markdown in real time. Export formatted HTML.', path: '/markdown-preview', icon: FileCode },
]

export default function Home() {
  return (
    <>
      <SEOHead
        title="Free Online Tools for Productivity"
        description="Boost your productivity with free online tools. Invoice generator, JSON formatter, QR code generator, password generator, word counter, and more. No signup required."
        keywords="free online tools, invoice generator, json formatter, qr code generator, password generator, word counter, productivity tools"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
              Free Online Tools<br />That Just Work
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 leading-relaxed">
              Fast, simple, and free. No signup required. Boost your productivity with our collection of essential web tools.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#tools" className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Browse Tools
              </a>
              <a href="#features" className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors">
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      <AdPlaceholder size="leaderboard" />

      {/* Features */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Zap, title: 'Lightning Fast', desc: 'All tools run in your browser. No server delays, no loading spinners.' },
              { icon: Lock, title: 'Private & Secure', desc: 'Your data never leaves your browser. Nothing is sent to any server.' },
              { icon: Smartphone, title: 'Works Everywhere', desc: 'Responsive design that works on desktop, tablet, and mobile.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center p-6">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Tools</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to get work done faster. All tools are free, instant, and require no signup.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <ToolCard key={tool.path} {...tool} />
            ))}
          </div>
        </div>
      </section>

      <AdPlaceholder size="leaderboard" />

      {/* SEO Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Why QuickTools?</h2>
          <div className="prose prose-gray max-w-none space-y-4 text-gray-600">
            <p>QuickTools is a collection of free online tools designed to help you work faster and smarter. Whether you're a freelancer creating invoices, a developer formatting JSON, or a student counting words for an essay, we've got you covered.</p>
            <p>All tools run entirely in your browser — your data never touches our servers. This means your information stays private and the tools are blazing fast. No registration, no downloads, no limits.</p>
            <h3 className="text-xl font-semibold text-gray-900 mt-8">Built for Professionals</h3>
            <p>Every tool is designed with a clean, professional interface that works on any device. From the invoice generator used by thousands of freelancers to the JSON formatter trusted by developers worldwide, QuickTools delivers reliable results every time.</p>
            <h3 className="text-xl font-semibold text-gray-900 mt-8">100% Free Forever</h3>
            <p>We believe essential productivity tools should be accessible to everyone. That's why all our tools are completely free with no hidden limits. No premium tiers, no paywalls, no tricks.</p>
          </div>
        </div>
      </section>
    </>
  )
}