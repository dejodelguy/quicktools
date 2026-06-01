import {
  FileText, Braces, Type, Palette, Binary, QrCode,
  Calculator, Shield, GitCompare, FileCode, Zap,
  Image, Scaling, Crop, RefreshCw, FileImage, FilePlus, Pipette,
  AlignLeft, CaseSensitive, Hash, Fingerprint, Regex, Link, Clock,
  Ruler, Landmark, Heart, CalendarDays, Receipt, DollarSign,
  Code, Paintbrush, Key, Smile, ShieldCheck, Eraser, Volume2,
  FileJson, Timer, Scaling as ScalingIcon
} from 'lucide-react'
import ToolCard from '../components/ToolCard'
import SEOHead from '../components/SEOHead'

const tools = [
  // IMAGE TOOLS
  { title: 'Image Compressor', description: 'Compress PNG, JPG, WebP without losing quality.', path: '/image-compressor', icon: Image, featured: true },
  { title: 'Image Resizer', description: 'Resize images to exact dimensions. Maintains aspect ratio.', path: '/image-resizer', icon: Scaling, featured: true },
  { title: 'Image Cropper', description: 'Crop images to your desired area with drag handles.', path: '/image-cropper', icon: Crop },
  { title: 'Image Converter', description: 'Convert between PNG, JPG, and WebP formats.', path: '/image-converter', icon: RefreshCw },
  { title: 'Background Remover', description: 'Remove solid-color backgrounds. Download as PNG.', path: '/background-remover', icon: Eraser, featured: true },
  { title: 'Image Color Picker', description: 'Pick colors from any image pixel.', path: '/image-color-picker', icon: Pipette },
  { title: 'Meme Generator', description: 'Create custom memes with your own images.', path: '/meme-generator', icon: Smile },

  // PDF TOOLS
  { title: 'Image to PDF', description: 'Convert images to PDF documents.', path: '/image-to-pdf', icon: FileImage, featured: true },
  { title: 'PDF Merger', description: 'Combine multiple PDF files into one.', path: '/pdf-merger', icon: FilePlus, featured: true },

  // TEXT TOOLS
  { title: 'Lorem Ipsum Generator', description: 'Generate placeholder text for designs.', path: '/lorem-ipsum-generator', icon: AlignLeft },
  { title: 'Case Converter', description: 'Convert text to any case format.', path: '/case-converter', icon: CaseSensitive },
  { title: 'Text to Speech', description: 'Convert text to speech audio.', path: '/text-to-speech', icon: Volume2 },
  { title: 'Word Counter', description: 'Count words, characters, sentences, paragraphs.', path: '/word-counter', icon: Type, featured: true },
  { title: 'Text Diff', description: 'Compare two texts side by side.', path: '/text-diff', icon: GitCompare },
  { title: 'Markdown Preview', description: 'Write and preview Markdown in real time.', path: '/markdown-preview', icon: FileCode },

  // DEVELOPER TOOLS
  { title: 'JSON Formatter', description: 'Format, validate, and minify JSON data.', path: '/json-formatter', icon: Braces, featured: true },
  { title: 'Hash Generator', description: 'Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes.', path: '/hash-generator', icon: Hash },
  { title: 'UUID Generator', description: 'Generate unique identifiers. Bulk up to 100.', path: '/uuid-generator', icon: Fingerprint },
  { title: 'Regex Tester', description: 'Test and debug regular expressions.', path: '/regex-tester', icon: Regex },
  { title: 'URL Encoder', description: 'Encode or decode URLs and URI components.', path: '/url-encoder', icon: Link },
  { title: 'Timestamp Converter', description: 'Convert Unix timestamps to readable dates.', path: '/timestamp-converter', icon: Clock },
  { title: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens.', path: '/jwt-decoder', icon: Key },
  { title: 'Cron Builder', description: 'Build cron expressions visually.', path: '/cron-builder', icon: Timer },
  { title: 'HTML Minifier', description: 'Minify or beautify HTML code.', path: '/html-minifier', icon: Code },
  { title: 'CSS Minifier', description: 'Minify or beautify CSS stylesheets.', path: '/css-minifier', icon: Paintbrush },
  { title: 'JSON to CSV', description: 'Convert JSON arrays to CSV format.', path: '/json-to-csv', icon: FileJson },
  { title: 'Password Strength', description: 'Test how secure your password is.', path: '/password-strength', icon: ShieldCheck },

  // CONVERTERS
  { title: 'Color Converter', description: 'Convert between HEX, RGB, HSL formats.', path: '/color-converter', icon: Palette },
  { title: 'Base64 Tool', description: 'Encode and decode Base64 strings.', path: '/base64-tool', icon: Binary },
  { title: 'Unit Converter', description: 'Convert length, weight, volume, speed, temperature.', path: '/unit-converter', icon: Ruler },
  { title: 'Currency Converter', description: 'Convert between 35+ world currencies.', path: '/currency-converter', icon: DollarSign },
  { title: 'Number Base Converter', description: 'Convert between binary, octal, decimal, hex.', path: '/base-converter', icon: Binary },
  { title: 'Percentage Calculator', description: 'Calculate percentages and ratios.', path: '/percentage-calculator', icon: Calculator },

  // CALCULATORS
  { title: 'Loan Calculator', description: 'Calculate monthly payments and total interest.', path: '/loan-calculator', icon: Landmark },
  { title: 'BMI Calculator', description: 'Calculate Body Mass Index.', path: '/bmi-calculator', icon: Heart },
  { title: 'Age Calculator', description: 'Calculate exact age from date of birth.', path: '/age-calculator', icon: CalendarDays },
  { title: 'Tip Calculator', description: 'Calculate tips and split bills.', path: '/tip-calculator', icon: Receipt },

  // OTHER
  { title: 'Invoice Generator', description: 'Create professional invoices as PDF.', path: '/invoice-generator', icon: FileText, featured: true },
  { title: 'Password Generator', description: 'Generate strong, secure passwords.', path: '/password-generator', icon: Shield, featured: true },
  { title: 'QR Code Generator', description: 'Create QR codes for URLs and text.', path: '/qr-code-generator', icon: QrCode },
  { title: 'Privacy Policy Generator', description: 'Generate privacy policies for your site.', path: '/privacy-policy-generator', icon: FileText },
  { title: 'Screen Ruler', description: 'Measure pixels, cm, and inches on screen.', path: '/screen-ruler', icon: ScalingIcon },
]

const categories = [
  { name: 'Image Tools', description: 'Compress, resize, crop, and convert images', filter: (t: typeof tools[0]) => ['/image-compressor','/image-resizer','/image-cropper','/image-converter','/background-remover','/image-color-picker','/meme-generator'].includes(t.path) },
  { name: 'PDF Tools', description: 'Convert and merge PDF documents', filter: (t: typeof tools[0]) => ['/image-to-pdf','/pdf-merger'].includes(t.path) },
  { name: 'Text Tools', description: 'Write, convert, and analyze text', filter: (t: typeof tools[0]) => ['/lorem-ipsum-generator','/case-converter','/text-to-speech','/word-counter','/text-diff','/markdown-preview'].includes(t.path) },
  { name: 'Developer Tools', description: 'JSON, hashing, regex, encoding, and more', filter: (t: typeof tools[0]) => ['/json-formatter','/hash-generator','/uuid-generator','/regex-tester','/url-encoder','/timestamp-converter','/jwt-decoder','/cron-builder','/html-minifier','/css-minifier','/json-to-csv','/password-strength'].includes(t.path) },
  { name: 'Converters', description: 'Units, currencies, colors, and number bases', filter: (t: typeof tools[0]) => ['/color-converter','/base64-tool','/unit-converter','/currency-converter','/base-converter','/percentage-calculator'].includes(t.path) },
  { name: 'Calculators', description: 'Finance, health, and everyday math', filter: (t: typeof tools[0]) => ['/loan-calculator','/bmi-calculator','/age-calculator','/tip-calculator'].includes(t.path) },
  { name: 'Generators', description: 'Invoices, passwords, QR codes, and policies', filter: (t: typeof tools[0]) => ['/invoice-generator','/password-generator','/qr-code-generator','/privacy-policy-generator','/screen-ruler'].includes(t.path) },
]

export default function Home() {
  const featuredTools = [
    { icon: Image, label: 'Image' },
    { icon: FileImage, label: 'PDF' },
    { icon: Braces, label: 'JSON' },
    { icon: Shield, label: 'Security' },
    { icon: DollarSign, label: 'Finance' },
    { icon: Hash, label: 'Dev' },
  ]

  return (
    <>
      <SEOHead
        title="Free Online Tools for Productivity"
        description="40+ free online tools. Image compressor, PDF merger, JSON formatter, unit converter, password generator, and more. No signup required."
        keywords="free online tools, image compressor, pdf merger, json formatter, unit converter, password generator, online tools, productivity tools, developer tools"
      />

      {/* Hero - asymmetric layout */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Zap size={14} />
            {tools.length} free tools
          </div>
          <h1>Every tool you need, one tab away</h1>
          <p className="hero-subtitle">
            Image compressors, PDF tools, converters, calculators, developer utilities. Free, fast, no signup.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">{tools.length}+</span>
              <span className="hero-stat-label">Tools</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">7</span>
              <span className="hero-stat-label">Categories</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-value">$0</span>
              <span className="hero-stat-label">Forever</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          {featuredTools.map(({ icon: Icon, label }) => (
            <div key={label} className="hero-visual-card">
              <Icon size={22} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Category sections */}
      {categories.map((cat) => {
        const catTools = tools.filter(cat.filter)
        return (
          <section key={cat.name} className="section">
            <div className="section-header">
              <h2>{cat.name}</h2>
              <p>{cat.description}</p>
            </div>
            <div className="tool-grid">
              {catTools.map((tool) => (
                <ToolCard key={tool.path} {...tool} />
              ))}
            </div>
          </section>
        )
      })}
    </>
  )
}
