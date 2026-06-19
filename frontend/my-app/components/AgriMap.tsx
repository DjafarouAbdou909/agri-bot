'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { regionAlerts } from '@/lib/mock-data'
import type { Severity } from '@/lib/types'

const riskColor: Record<Severity, string> = {
  high: '#E24B4A',
  medium: '#EF9F27',
  low: '#639922',
}

const riskLabel: Record<Severity, string> = {
  high: 'Critique',
  medium: 'Modéré',
  low: 'Faible',
}

export function AgriMap() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    delete (window as any).L?.Icon?.Default?.prototype?._getIconUrl
  }, [])

  if (!isClient) {
    return (
      <div className="flex h-full items-center justify-center text-[12px] text-neutral-400">
        Chargement de la carte...
      </div>
    )
  }

  return (
    <MapContainer
      center={[7.54, -5.55]}
      zoom={7}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {regionAlerts.map((alert) => (
        <CircleMarker
          key={alert.id}
          center={[alert.lat, alert.lng]}
          radius={8 + alert.reportCount / 30}
          pathOptions={{
            color: '#fff',
            weight: 2,
            fillColor: riskColor[alert.riskLevel],
            fillOpacity: 0.85,
          }}
        >
          <Popup>
            <div style={{ fontSize: 12, minWidth: 140 }}>
              <p style={{ fontWeight: 500, marginBottom: 2 }}>{alert.disease}</p>
              <p style={{ color: '#666', marginBottom: 6 }}>
                {alert.zone} · {alert.reportCount} signalements
              </p>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 500,
                  padding: '2px 8px',
                  borderRadius: 20,
                  background: riskColor[alert.riskLevel] + '22',
                  color: riskColor[alert.riskLevel],
                }}
              >
                {riskLabel[alert.riskLevel]}
              </span>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  )
}
