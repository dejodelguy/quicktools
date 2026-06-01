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
  // ORIGINAL 10
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

  // IMAGE TOOLS (high traffic)
  { title: 'Image Compressor', description: 'Compress PNG, JPG, WebP images without losing quality. Reduce file size instantly.', path: '/image-compressor', icon: Image, featured: true },
  { title: 'Image Resizer', description: 'Resize images to exact dimensions. Maintains aspect ratio. Download as PNG.', path: '/image-resizer', icon: Scaling, featured: true },
  { title: 'Image Cropper', description: 'Crop images to your desired area. Drag handles to adjust the selection.', path: '/image-cropper', icon: Crop },
  { title: 'Image Converter', description: 'Convert images between PNG, JPG, and WebP formats instantly.', path: '/image-converter', icon: RefreshCw },
  { title: 'Background Remover', description: 'Remove solid-color backgrounds from images. Download as transparent PNG.', path: '/background-remover', icon: Eraser, featured: true },
  { title: 'Image Color Picker', description: 'Pick colors from any image. Click on pixels to get hex and RGB values.', path: '/image-color-picker', icon: Pipette },
  { title: 'Meme Generator', description: 'Create custom memes with your own images. Add top and bottom text.', path: '/meme-generator', icon: Smile },

  // PDF TOOLS (massive traffic)
  { title: 'Image to PDF', description: 'Convert images to PDF. Combine multiple photos into one document.', path: '/image-to-pdf', icon: FileImage, featured: true },
  { title: 'PDF Merger', description: 'Combine multiple PDF files into one. Reorder pages before merging.', path: '/pdf-merger', icon: FilePlus, featured: true },

  // TEXT TOOLS
  { title: 'Lorem Ipsum Generator', description: 'Generate placeholder text for designs. Choose paragraphs, sentences, or words.', path: '/lorem-ipsum-generator', icon: AlignLeft },
  { title: 'Case Converter', description: 'Convert text to uppercase, lowercase, title case, camelCase, snake_case and more.', path: '/case-converter', icon: CaseSensitive },
  { title: 'Text to Speech', description: 'Convert any text to speech. Multiple voices, adjustable speed and pitch.', path: '/text-to-speech', icon: Volume2 },

  // DEVELOPER TOOLS
  { title: 'Hash Generator', description: 'Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes for any text.', path: '/hash-generator', icon: Hash },
  { title: 'UUID Generator', description: 'Generate unique identifiers (UUID v4). Bulk generate up to 100 at once.', path: '/uuid-generator', icon: Fingerprint },
  { title: 'Regex Tester', description: 'Test and debug regular expressions with real-time matching and highlights.', path: '/regex-tester', icon: Regex },
  { title: 'URL Encoder', description: 'Encode or decode URLs and URI components. Supports percent encoding.', path: '/url-encoder', icon: Link },
  { title: 'Timestamp Converter', description: 'Convert between Unix timestamps and human-readable dates. Live clock.', path: '/timestamp-converter', icon: Clock },
  { title: 'JWT Decoder', description: 'Decode and inspect JSON Web Tokens. View header, payload, and expiry.', path: '/jwt-decoder', icon: Key },
  { title: 'Cron Builder', description: 'Build cron expressions visually with presets. Understand any schedule.', path: '/cron-builder', icon: Timer },
  { title: 'HTML Minifier', description: 'Minify or beautify HTML code. Reduce file size or format for readability.', path: '/html-minifier', icon: Code },
  { title: 'CSS Minifier', description: 'Minify or beautify CSS stylesheets. Reduce file size instantly.', path: '/css-minifier', icon: Paintbrush },
  { title: 'JSON to CSV', description: 'Convert JSON arrays to CSV format. Handles nested objects automatically.', path: '/json-to-csv', icon: FileJson },
  { title: 'Password Strength', description: 'Test how secure your password is. See crack time estimate and tips.', path: '/password-strength', icon: ShieldCheck },

  // CONVERTERS
  { title: 'Unit Converter', description: 'Convert between length, weight, volume, area, speed, and temperature.', path: '/unit-converter', icon: Ruler },
  { title: 'Currency Converter', description: 'Convert between 35+ world currencies. Includes African currencies.', path: '/currency-converter', icon: DollarSign },
  { title: 'Number Base Converter', description: 'Convert numbers between binary, octal, decimal, and hexadecimal.', path: '/base-converter', icon: Binary },

  // CALCULATORS
  { title: 'Loan Calculator', description: 'Calculate monthly payments, total interest, and total cost of any loan.', path: '/loan-calculator', icon: Landmark },
  { title: 'BMI Calculator', description: 'Calculate your Body Mass Index. Supports metric and imperial units.', path: '/bmi-calculator', icon: Heart },
  { title: 'Age Calculator', description: 'Calculate your exact age in years, months, days from date of birth.', path: '/age-calculator', icon: CalendarDays },
  { title: 'Tip Calculator', description: 'Calculate tips and split bills between any number of people.', path: '/tip-calculator', icon: Receipt },

  // OTHER
  { title: 'Privacy Policy Generator', description: 'Generate a privacy policy for your website. Customize for your business.', path: '/privacy-policy-generator', icon: FileText },
  { title: 'Screen Ruler', description: 'Measure pixels, centimeters, and inches on your screen.', path: '/screen-ruler', icon: ScalingIcon },
]

export default function Home() {
  return (
    <>
      <SEOHead
        title="Free Online Tools for Productivity"
        description="40+ free online tools. Image compressor, PDF merger, JSON formatter, unit converter, password generator, and more. No signup required."
        keywords="free online tools, image compressor, pdf merger, json formatter, unit converter, password generator, online tools, productivity tools, developer tools"
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">40+ Free Tools</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Every Tool You Need,<br />
              <span className="text-blue-200">All in One Place</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Image compressors, PDF tools, converters, calculators, developer utilities, and more.
              Free, fast, and no signup required.
            </p>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">All Tools</h2>
          <p className="text-gray-600">{tools.length} free tools ready to use</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.path} {...tool} />
          ))}
        </div>
      </section>
    </>
  )
}
