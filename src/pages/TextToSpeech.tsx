import { useState, useEffect } from 'react'
import { Volume2, Play, Square } from 'lucide-react'
import SEOHead from '../components/SEOHead'

export default function TextToSpeech() {
  const [text, setText] = useState('')
  const [speaking, setSpeaking] = useState(false)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [voiceIdx, setVoiceIdx] = useState(0)
  const [rate, setRate] = useState(1)
  const [pitch, setPitch] = useState(1)

  useEffect(() => {
    const loadVoices = () => setVoices(speechSynthesis.getVoices())
    loadVoices()
    speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const speak = () => {
    if (!text) return
    speechSynthesis.cancel()
    const utt = new SpeechSynthesisUtterance(text)
    if (voices[voiceIdx]) utt.voice = voices[voiceIdx]
    utt.rate = rate
    utt.pitch = pitch
    utt.onend = () => setSpeaking(false)
    utt.onerror = () => setSpeaking(false)
    speechSynthesis.speak(utt)
    setSpeaking(true)
  }

  const stop = () => { speechSynthesis.cancel(); setSpeaking(false) }

  return (
    <>
      <SEOHead title="Text to Speech - Convert Text to Audio Online" description="Convert any text to speech online. Choose from multiple voices, adjust speed and pitch. Free text to speech tool." path="/text-to-speech" keywords="text to speech, tts, text to audio, speech synthesis, voice generator, read text aloud" />
      <div className="tool-page">
        <div className="tool-page-header">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4"><Volume2 className="w-7 h-7 text-blue-600" /></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Text to Speech</h1>
          <p className="text-gray-600">Convert any text to natural-sounding speech.</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <textarea className="w-full h-40 p-4 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-blue-500 mb-4" placeholder="Enter text to convert to speech..." value={text} onChange={e => setText(e.target.value)} />
          {voices.length > 0 && (
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700 block mb-1">Voice</label>
              <select value={voiceIdx} onChange={e => setVoiceIdx(Number(e.target.value))} className="w-full p-2.5 border border-gray-300 rounded-lg text-sm">
                {voices.map((v, i) => <option key={i} value={i}>{v.name} ({v.lang})</option>)}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Speed: {rate}x</label>
              <input type="range" min="0.5" max="2" step="0.1" value={rate} onChange={e => setRate(Number(e.target.value))} className="w-full" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Pitch: {pitch}</label>
              <input type="range" min="0.5" max="2" step="0.1" value={pitch} onChange={e => setPitch(Number(e.target.value))} className="w-full" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={speak} disabled={!text || speaking} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors">
              <Play className="w-4 h-4" /> {speaking ? 'Speaking...' : 'Speak'}
            </button>
            {speaking && (
              <button onClick={stop} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
                <Square className="w-4 h-4" /> Stop
              </button>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-3">Uses your browser\'s built-in speech synthesis. Voice availability varies by browser and OS.</p>
        </div>
      </div>
    </>
  )
}