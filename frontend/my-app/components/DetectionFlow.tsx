'use client'

import { useState, useRef, useCallback } from 'react'
import {
  Camera,
  Upload,
  Loader2,
  FlaskConical,
  Shield,
  CalendarClock,
  MessageCircle,
  Download,
  Check,
  AlertTriangle,
  Droplet,
  Microscope,
} from 'lucide-react'
import { clsx } from 'clsx'
import { diagnoses } from '@/lib/mock-data'
import { SeverityBadge } from '@/components/Badge'
import type { Diagnosis } from '@/lib/types'

type Stage = 'idle' | 'preview' | 'analyzing' | 'result'

const iconMap: Record<string, typeof FlaskConical> = {
  flask: FlaskConical,
  shield: Shield,
  'calendar-repeat': CalendarClock,
  check: Check,
  'droplet-off': Droplet,
}

export function DetectionFlow() {
  const [stage, setStage] = useState<Stage>('idle')
  const [fileName, setFileName] = useState<string>('')
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<Diagnosis | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const runAnalysis = useCallback((name: string) => {
    setFileName(name)
    setStage('preview')
    setProgress(0)

    setTimeout(() => {
      setStage('analyzing')
      let p = 0
      const interval = setInterval(() => {
        p += Math.random() * 18 + 8
        if (p >= 100) {
          p = 100
          clearInterval(interval)
          const picked = diagnoses[Math.floor(Math.random() * diagnoses.length)]
          setTimeout(() => {
            setResult(picked)
            setStage('result')
          }, 250)
        }
        setProgress(Math.min(Math.round(p), 100))
      }, 280)
    }, 700)
  }, [])

  function handleFileSelect(files: FileList | null) {
    if (files && files.length > 0) {
      runAnalysis(files[0].name)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  function reset() {
    setStage('idle')
    setResult(null)
    setProgress(0)
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-neutral-200 bg-white p-4">
          <h2 className="mb-3 text-[13px] font-medium text-neutral-900">Téléverser une photo</h2>

          {stage === 'idle' && (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={clsx(
                'flex flex-col items-center gap-2.5 rounded-xl border-2 border-dashed bg-neutral-50 px-4 py-9 transition',
                isDragging ? 'border-green-600 bg-green-50' : 'border-neutral-300'
              )}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <Camera size={26} className="text-green-800" />
              </div>
              <p className="text-[13px] font-medium text-neutral-900">Glissez une image ici</p>
              <p className="text-center text-[11px] text-neutral-500">
                ou prenez une photo directement
                <br />
                JPG, PNG — 10 Mo maximum
              </p>
              <div className="mt-1.5 flex gap-2">
                <button
                  onClick={() => runAnalysis('photo_camera.jpg')}
                  className="flex items-center gap-1.5 rounded-lg bg-agri-greenDark px-3.5 py-2 text-[12px] font-medium text-white transition hover:brightness-110"
                >
                  <Camera size={14} />
                  Photo
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-[12px] text-neutral-700 transition hover:bg-neutral-50"
                >
                  <Upload size={14} />
                  Galerie
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e.target.files)}
                />
              </div>
            </div>
          )}

          {stage !== 'idle' && (
            <div>
              <div className="relative mb-2.5 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-green-700 via-green-800 to-amber-900">
                <Camera size={44} className="text-white/30" />
                {stage === 'analyzing' && (
                  <div className="absolute inset-x-0 top-[40%] h-0.5 animate-pulse bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]" />
                )}
              </div>
              <div className="flex justify-between text-[11px] text-neutral-500">
                <span>{fileName}</span>
                <span>2.4 Mo</span>
              </div>

              {(stage === 'preview' || stage === 'analyzing') && (
                <div className="mt-2.5">
                  <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                    <div
                      className="h-full rounded-full bg-agri-greenDark transition-all duration-300"
                      style={{ width: `${stage === 'preview' ? 5 : progress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-neutral-500">
                    <Loader2 size={13} className="animate-spin text-agri-greenDark" />
                    {stage === 'preview'
                      ? 'Préparation de l\'image...'
                      : `Détection des motifs de maladie — ${progress}%`}
                  </p>
                </div>
              )}

              {stage === 'result' && (
                <button
                  onClick={reset}
                  className="mt-3 w-full rounded-lg border border-neutral-300 py-2 text-[12px] text-neutral-600 transition hover:bg-neutral-50"
                >
                  Analyser une nouvelle photo
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-4">
        <h2 className="mb-3 text-[13px] font-medium text-neutral-900">Résultat du diagnostic</h2>

        {stage !== 'result' && (
          <div className="flex h-[280px] flex-col items-center justify-center gap-2 text-center">
            <Microscope className="text-neutral-300" size={36} />
            <p className="max-w-[220px] text-[12px] text-neutral-400">
              Téléversez une photo pour obtenir un diagnostic instantané
            </p>
          </div>
        )}

        {stage === 'result' && result && (
          <div>
            <div className="mb-3 flex items-center gap-3.5">
              <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full border-[5px] border-green-600">
                <span className="text-[15px] font-medium text-neutral-900">
                  {result.confidence}%
                </span>
              </div>
              <div>
                <p className="text-[15px] font-medium text-neutral-900">{result.diseaseName}</p>
                {result.scientificName && (
                  <p className="text-[11px] italic text-neutral-500">{result.scientificName}</p>
                )}
              </div>
            </div>

            <div className="mb-3 flex gap-1.5">
              <SeverityBadge severity={result.severity} />
              <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-medium text-green-800">
                <Check size={11} />
                Traitable
              </span>
            </div>

            <div className="mb-3.5 rounded-lg bg-neutral-50 px-3 py-2.5 text-[12px] leading-relaxed text-neutral-800">
              {result.symptoms}
            </div>

            <h3 className="mb-2 text-[12px] font-medium text-neutral-900">
              Recommandations agronomiques
            </h3>
            <div className="flex flex-col gap-2">
              {result.recommendations.map((rec, i) => {
                const Icon = iconMap[rec.icon] ?? AlertTriangle
                return (
                  <div key={i} className="flex items-start gap-2.5 rounded-lg bg-neutral-50 p-2.5">
                    <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                      <Icon size={12} className="text-green-800" />
                    </div>
                    <div>
                      <p className="text-[12px] leading-relaxed text-neutral-800">{rec.text}</p>
                      <span className="mt-0.5 block text-[10px] text-green-800">{rec.tag}</span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="mt-3.5 flex gap-2">
              <a
                href="https://wa.me/"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-agri-greenDark py-2.5 text-[12px] font-medium text-white transition hover:brightness-110"
              >
                <MessageCircle size={14} />
                Parler à un agronome
              </a>
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-300 py-2.5 text-[12px] text-neutral-700 transition hover:bg-neutral-50">
                <Download size={14} />
                Exporter PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
