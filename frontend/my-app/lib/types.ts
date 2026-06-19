export type Severity = 'low' | 'medium' | 'high'

export type DiagnosisStatus = 'healthy' | 'monitoring' | 'urgent'

export interface Diagnosis {
  id: string
  cropName: string
  parcelName: string
  diseaseName: string
  scientificName: string | null
  confidence: number
  severity: Severity
  status: DiagnosisStatus
  date: string
  symptoms: string
  recommendations: Recommendation[]
  imageColor: string
}

export interface Recommendation {
  icon: string
  text: string
  tag: string
}

export interface Parcel {
  id: string
  name: string
  crop: string
  area: number
  healthScore: number
  status: DiagnosisStatus
  plantedDate: string
  harvestEstimate: string
}

export interface WeatherDay {
  day: string
  tempMax: number
  tempMin: number
  rainChance: number
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy'
}

export interface RegionAlert {
  id: string
  disease: string
  zone: string
  reportCount: number
  riskLevel: Severity
  lat: number
  lng: number
}

export interface Farmer {
  name: string
  initials: string
  location: string
  memberSince: number
  totalArea: number
}
