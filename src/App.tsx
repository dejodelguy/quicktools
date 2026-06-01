import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import InvoiceGenerator from './pages/InvoiceGenerator'
import JSONFormatter from './pages/JSONFormatter'
import WordCounter from './pages/WordCounter'
import ColorConverter from './pages/ColorConverter'
import Base64Tool from './pages/Base64Tool'
import QRCodeGenerator from './pages/QRCodeGenerator'
import PercentageCalculator from './pages/PercentageCalculator'
import PasswordGenerator from './pages/PasswordGenerator'
import TextDiff from './pages/TextDiff'
import MarkdownPreview from './pages/MarkdownPreview'
// Image Tools
import ImageCompressor from './pages/ImageCompressor'
import ImageResizer from './pages/ImageResizer'
import ImageCropper from './pages/ImageCropper'
import ImageConverter from './pages/ImageConverter'
import BackgroundRemover from './pages/BackgroundRemover'
import ImageColorPicker from './pages/ImageColorPicker'
import MemeGenerator from './pages/MemeGenerator'
// PDF Tools
import ImageToPdf from './pages/ImageToPdf'
import PdfMerger from './pages/PdfMerger'
// Text Tools
import LoremIpsumGenerator from './pages/LoremIpsumGenerator'
import CaseConverter from './pages/CaseConverter'
import TextToSpeech from './pages/TextToSpeech'
// Dev Tools
import HashGenerator from './pages/HashGenerator'
import UuidGenerator from './pages/UuidGenerator'
import RegexTester from './pages/RegexTester'
import UrlEncoder from './pages/UrlEncoder'
import TimestampConverter from './pages/TimestampConverter'
import JwtDecoder from './pages/JwtDecoder'
import CronBuilder from './pages/CronBuilder'
import HtmlMinifier from './pages/HtmlMinifier'
import CssMinifier from './pages/CssMinifier'
import JsonToCsv from './pages/JsonToCsv'
import PasswordStrength from './pages/PasswordStrength'
// Converters
import UnitConverter from './pages/UnitConverter'
import CurrencyConverter from './pages/CurrencyConverter'
import BaseConverter from './pages/BaseConverter'
// Calculators
import LoanCalculator from './pages/LoanCalculator'
import BmiCalculator from './pages/BmiCalculator'
import AgeCalculator from './pages/AgeCalculator'
import TipCalculator from './pages/TipCalculator'
// Other
import PrivacyPolicyGenerator from './pages/PrivacyPolicyGenerator'
import ScreenRuler from './pages/ScreenRuler'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          {/* Original 10 */}
          <Route path="/invoice-generator" element={<InvoiceGenerator />} />
          <Route path="/json-formatter" element={<JSONFormatter />} />
          <Route path="/word-counter" element={<WordCounter />} />
          <Route path="/color-converter" element={<ColorConverter />} />
          <Route path="/base64-tool" element={<Base64Tool />} />
          <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
          <Route path="/percentage-calculator" element={<PercentageCalculator />} />
          <Route path="/password-generator" element={<PasswordGenerator />} />
          <Route path="/text-diff" element={<TextDiff />} />
          <Route path="/markdown-preview" element={<MarkdownPreview />} />
          {/* Image Tools */}
          <Route path="/image-compressor" element={<ImageCompressor />} />
          <Route path="/image-resizer" element={<ImageResizer />} />
          <Route path="/image-cropper" element={<ImageCropper />} />
          <Route path="/image-converter" element={<ImageConverter />} />
          <Route path="/background-remover" element={<BackgroundRemover />} />
          <Route path="/image-color-picker" element={<ImageColorPicker />} />
          <Route path="/meme-generator" element={<MemeGenerator />} />
          {/* PDF Tools */}
          <Route path="/image-to-pdf" element={<ImageToPdf />} />
          <Route path="/pdf-merger" element={<PdfMerger />} />
          {/* Text Tools */}
          <Route path="/lorem-ipsum-generator" element={<LoremIpsumGenerator />} />
          <Route path="/case-converter" element={<CaseConverter />} />
          <Route path="/text-to-speech" element={<TextToSpeech />} />
          {/* Dev Tools */}
          <Route path="/hash-generator" element={<HashGenerator />} />
          <Route path="/uuid-generator" element={<UuidGenerator />} />
          <Route path="/regex-tester" element={<RegexTester />} />
          <Route path="/url-encoder" element={<UrlEncoder />} />
          <Route path="/timestamp-converter" element={<TimestampConverter />} />
          <Route path="/jwt-decoder" element={<JwtDecoder />} />
          <Route path="/cron-builder" element={<CronBuilder />} />
          <Route path="/html-minifier" element={<HtmlMinifier />} />
          <Route path="/css-minifier" element={<CssMinifier />} />
          <Route path="/json-to-csv" element={<JsonToCsv />} />
          <Route path="/password-strength" element={<PasswordStrength />} />
          {/* Converters */}
          <Route path="/unit-converter" element={<UnitConverter />} />
          <Route path="/currency-converter" element={<CurrencyConverter />} />
          <Route path="/base-converter" element={<BaseConverter />} />
          {/* Calculators */}
          <Route path="/loan-calculator" element={<LoanCalculator />} />
          <Route path="/bmi-calculator" element={<BmiCalculator />} />
          <Route path="/age-calculator" element={<AgeCalculator />} />
          <Route path="/tip-calculator" element={<TipCalculator />} />
          {/* Other */}
          <Route path="/privacy-policy-generator" element={<PrivacyPolicyGenerator />} />
          <Route path="/screen-ruler" element={<ScreenRuler />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
