import type { Diagnosis, Parcel, WeatherDay, RegionAlert, Farmer } from './types'

export const farmer: Farmer = {
  name: 'Kouassi Koffi',
  initials: 'KK',
  location: 'Bouaké, Côte d\'Ivoire',
  memberSince: 2019,
  totalArea: 4.5,
}

export const parcels: Parcel[] = [
  {
    id: 'p1',
    name: 'Parcelle Nord',
    crop: 'Maïs',
    area: 2,
    healthScore: 55,
    status: 'urgent',
    plantedDate: '3 mars 2026',
    harvestEstimate: 'Août 2026',
  },
  {
    id: 'p2',
    name: 'Parcelle Sud',
    crop: 'Cacao',
    area: 1.5,
    healthScore: 92,
    status: 'healthy',
    plantedDate: 'Floraison en cours',
    harvestEstimate: 'Juillet 2026',
  },
  {
    id: 'p3',
    name: 'Parcelle Est',
    crop: 'Manioc',
    area: 1,
    healthScore: 74,
    status: 'monitoring',
    plantedDate: '10 avril 2026',
    harvestEstimate: 'Octobre 2026',
  },
]

export const diagnoses: Diagnosis[] = [
  {
    id: 'd1',
    cropName: 'Maïs',
    parcelName: 'Parcelle Nord',
    diseaseName: 'Rouille du maïs',
    scientificName: 'Puccinia sorghi',
    confidence: 94,
    severity: 'high',
    status: 'urgent',
    date: '18 juin 2026, 09:32',
    symptoms:
      'Pustules orangées à brunes sur les feuilles avec halo jaune. Poudre libérée au toucher. Propagation par le vent favorisée par l\'humidité.',
    recommendations: [
      {
        icon: 'flask',
        text: 'Appliquer Mancozèbe à 2g/L, pulvériser tôt le matin (6h-8h)',
        tag: 'Traitement chimique · ~1 200 FCFA/kg',
      },
      {
        icon: 'shield',
        text: 'Isoler les plants atteints, éviter l\'arrosage par aspersion',
        tag: 'Action préventive',
      },
      {
        icon: 'calendar-repeat',
        text: 'Retraiter sous 7 à 10 jours si les symptômes persistent',
        tag: 'Suivi recommandé',
      },
    ],
    imageColor: 'from-amber-700 via-green-700 to-green-900',
  },
  {
    id: 'd2',
    cropName: 'Cacao',
    parcelName: 'Parcelle Sud',
    diseaseName: 'Aucune maladie détectée',
    scientificName: null,
    confidence: 98,
    severity: 'low',
    status: 'healthy',
    date: '17 juin 2026, 14:15',
    symptoms: 'Feuillage sain, coloration normale, aucun signe de stress hydrique ou fongique observé.',
    recommendations: [
      {
        icon: 'check',
        text: 'Continuer le programme d\'entretien actuel',
        tag: 'Aucune action requise',
      },
    ],
    imageColor: 'from-green-600 via-green-800 to-green-950',
  },
  {
    id: 'd3',
    cropName: 'Manioc',
    parcelName: 'Parcelle Est',
    diseaseName: 'Mildiou du manioc',
    scientificName: 'Phytophthora spp.',
    confidence: 89,
    severity: 'medium',
    status: 'monitoring',
    date: '12 juin 2026, 08:00',
    symptoms: 'Taches brunes irrégulières sur les feuilles basses, légère flétrissure en fin de journée.',
    recommendations: [
      {
        icon: 'flask',
        text: 'Surveiller l\'évolution, traiter si extension à plus de 20% du feuillage',
        tag: 'Surveillance active',
      },
      {
        icon: 'droplet-off',
        text: 'Réduire la fréquence d\'irrigation pour limiter l\'humidité au sol',
        tag: 'Action préventive',
      },
    ],
    imageColor: 'from-amber-800 via-amber-900 to-green-950',
  },
]

export const weatherForecast: WeatherDay[] = [
  { day: 'Aujourd\'hui', tempMax: 28, tempMin: 22, rainChance: 60, condition: 'rainy' },
  { day: 'Ven.', tempMax: 31, tempMin: 23, rainChance: 10, condition: 'sunny' },
  { day: 'Sam.', tempMax: 27, tempMin: 21, rainChance: 35, condition: 'cloudy' },
  { day: 'Dim.', tempMax: 26, tempMin: 21, rainChance: 80, condition: 'stormy' },
  { day: 'Lun.', tempMax: 33, tempMin: 24, rainChance: 5, condition: 'sunny' },
  { day: 'Mar.', tempMax: 30, tempMin: 22, rainChance: 20, condition: 'cloudy' },
  { day: 'Mer.', tempMax: 32, tempMin: 23, rainChance: 8, condition: 'sunny' },
]

export const regionAlerts: RegionAlert[] = [
  { id: 'a1', disease: 'Rouille du maïs', zone: 'Bouaké', reportCount: 142, riskLevel: 'high', lat: 7.69, lng: -5.03 },
  { id: 'a2', disease: 'Mildiou du cacao', zone: 'San-Pédro', reportCount: 67, riskLevel: 'medium', lat: 4.75, lng: -6.64 },
  { id: 'a3', disease: 'Anthracnose de la mangue', zone: 'Korhogo', reportCount: 31, riskLevel: 'medium', lat: 9.46, lng: -5.63 },
  { id: 'a4', disease: 'Pucerons', zone: 'Yamoussoukro', reportCount: 18, riskLevel: 'low', lat: 6.83, lng: -5.28 },
  { id: 'a5', disease: 'Pucerons', zone: 'Abidjan', reportCount: 9, riskLevel: 'low', lat: 5.36, lng: -4.01 },
]

export const platformStats = {
  activeFarmers: 4280,
  analysesToday: 847,
  aiAccuracy: 94,
  responseTime: 1.2,
  lossReduction: 38,
  detectableDiseases: 12,
  supportedLanguages: 3,
}
