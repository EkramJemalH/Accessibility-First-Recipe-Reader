import '@testing-library/jest-dom'

// Mock window.speechSynthesis for tests since the Web Speech API is not available in jsdom
const mockSpeechSynthesis = {
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
  getVoices: jest.fn(() => []),
  pending: false,
  speaking: false,
  paused: false,
  onvoiceschanged: null,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
}

Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: mockSpeechSynthesis,
})

// Mock SpeechSynthesisUtterance
class MockSpeechSynthesisUtterance {
  text: string
  lang: string = ''
  pitch: number = 1
  rate: number = 1
  volume: number = 1
  voice: SpeechSynthesisVoice | null = null
  onstart: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
  onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
  onerror: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => void) | null = null
  onpause: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
  onresume: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
  onboundary: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
  onmark: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => void) | null = null
  addEventListener: jest.Mock = jest.fn()
  removeEventListener: jest.Mock = jest.fn()
  dispatchEvent: jest.Mock = jest.fn()

  constructor(text: string) {
    this.text = text
  }
}

Object.defineProperty(window, 'SpeechSynthesisUtterance', {
  writable: true,
  value: MockSpeechSynthesisUtterance,
})
