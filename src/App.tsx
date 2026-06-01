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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
