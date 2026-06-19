'use client'

import { useState } from 'react'
import { Send, Mic } from 'lucide-react'

interface Message {
  role: 'bot' | 'user'
  text: string
  time: string
}

const initialMessages: Message[] = [
  {
    role: 'bot',
    text: 'Bonjour Kouassi ! Comment puis-je vous aider aujourd\'hui ?',
    time: '09:30',
  },
  { role: 'user', text: 'Mon maïs a des taches orangées, que faire ?', time: '09:31' },
  {
    role: 'bot',
    text: 'J\'ai analysé votre photo. Il s\'agit de rouille du maïs (Puccinia sorghi) avec 94% de confiance. Traitez avec du Mancozèbe 2g/L le matin tôt. Évitez l\'arrosage aérien les prochains jours.',
    time: '09:32',
  },
  { role: 'user', text: 'Où acheter le Mancozèbe à Bouaké ?', time: '09:33' },
  {
    role: 'bot',
    text: 'Agri-Coop Bouaké (centre-ville) — ~1 200 FCFA/kg. Phyto-Service Bouaké (quartier Commerce) — ~1 100 FCFA/kg. Appelez avant pour confirmer le stock.',
    time: '09:33',
  },
]

const categories = ['Tous', 'Semis', 'Irrigation', 'Parasites', 'Récolte']

export function AdviceChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [input, setInput] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tous')

  function send() {
    if (!input.trim()) return
    const now = new Date()
    const time = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`
    setMessages((prev) => [...prev, { role: 'user', text: input, time }])
    setInput('')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          text: 'Merci pour votre question. Un agronome AGRI-BOT va analyser cela et vous répondre avec une recommandation adaptée à votre parcelle.',
          time,
        },
      ])
    }, 700)
  }

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <div className="flex gap-1.5 overflow-x-auto border-b border-neutral-100 p-3">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`flex-shrink-0 rounded-full border px-3 py-1.5 text-[12px] transition ${
              activeCategory === c
                ? 'border-green-600 bg-green-50 text-green-800'
                : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto bg-green-50 p-4">
        <div className="flex flex-col gap-2.5">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-[12px] leading-relaxed ${
                  m.role === 'user'
                    ? 'rounded-br-sm bg-agri-greenDark text-white'
                    : 'rounded-bl-sm bg-white text-neutral-900'
                }`}
              >
                {m.text}
                <div
                  className={`mt-1 text-[10px] ${
                    m.role === 'user' ? 'text-right text-white/55' : 'text-neutral-400'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-100 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Posez votre question..."
          className="flex-1 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2 text-[13px] outline-none focus:border-green-500"
        />
        <button
          aria-label="Message vocal"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-agri-greenDark"
        >
          <Mic size={16} className="text-white" />
        </button>
        <button
          onClick={send}
          aria-label="Envoyer"
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-agri-greenDark"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
    </div>
  )
}
