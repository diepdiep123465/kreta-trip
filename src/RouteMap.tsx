import { useState } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip as MapTooltip } from 'react-leaflet'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip,
  ReferenceArea, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import 'leaflet/dist/leaflet.css'

interface Pt {
  name: string
  lat: number
  lng: number
  ele: number
  day: number
}

interface ProfilPt extends Pt {
  dist: number
}

export const dayColors: Record<number, string> = {
  1: '#1a6b9e', 2: '#2d6b4a', 3: '#8b4a1a', 4: '#6b1a8b',
  5: '#b5651d', 6: '#1a8b6b', 7: '#7a1f3d', 8: '#444b54',
}

const dayLabels: Record<number, string> = {
  1: 'Fr 17.7. Anreise & Lassithi',
  2: 'Sa 18.7. Ostkreta',
  3: 'So 19.7. Spinalonga & Lato',
  4: 'Mo 20.7. Messara-Ebene',
  5: 'Di 21.7. Knossos',
  6: 'Mi 22.7. Arkadi & Rethymno',
  7: 'Do 23.7. Chania',
  8: 'Fr 24.7. Heimreise',
}

// Haltepunkte der Reise mit ungefährer Höhe (m)
const punkte: Pt[] = [
  { name: 'Flughafen Heraklion', lat: 35.339, lng: 25.180, ele: 35, day: 1 },
  { name: 'Lassithi-Hochebene (Tzermiado)', lat: 35.199, lng: 25.487, ele: 840, day: 1 },
  { name: 'Zeus-Höhle (Psychro)', lat: 35.163, lng: 25.446, ele: 860, day: 1 },
  { name: 'Ierapetra', lat: 35.011, lng: 25.741, ele: 10, day: 1 },
  { name: 'Hotel Coriva Beach', lat: 35.008, lng: 25.796, ele: 15, day: 1 },
  { name: 'Gournia', lat: 35.109, lng: 25.792, ele: 50, day: 2 },
  { name: 'Sitia', lat: 35.209, lng: 26.102, ele: 10, day: 2 },
  { name: 'Kato Zakros', lat: 35.098, lng: 26.261, ele: 10, day: 2 },
  { name: 'Vai (Palmenstrand)', lat: 35.254, lng: 26.264, ele: 5, day: 2 },
  { name: 'Moni Toplou', lat: 35.220, lng: 26.216, ele: 130, day: 2 },
  { name: 'Hotel Coriva Beach', lat: 35.008, lng: 25.796, ele: 15, day: 2 },
  { name: 'Olous / Elounda', lat: 35.264, lng: 25.735, ele: 5, day: 3 },
  { name: 'Spinalonga', lat: 35.297, lng: 25.738, ele: 5, day: 3 },
  { name: 'Kritsa (Panagia Kera)', lat: 35.155, lng: 25.647, ele: 360, day: 3 },
  { name: 'Lato', lat: 35.178, lng: 25.650, ele: 380, day: 3 },
  { name: 'Malia (Palast)', lat: 35.293, lng: 25.492, ele: 10, day: 3 },
  { name: 'Agios Nikolaos', lat: 35.190, lng: 25.716, ele: 15, day: 3 },
  { name: 'Hotel Coriva Beach', lat: 35.008, lng: 25.796, ele: 15, day: 3 },
  { name: 'Gortyn', lat: 35.063, lng: 24.947, ele: 170, day: 4 },
  { name: 'Festos', lat: 35.051, lng: 24.813, ele: 100, day: 4 },
  { name: 'Agia Triada', lat: 35.059, lng: 24.792, ele: 60, day: 4 },
  { name: 'Matala', lat: 34.995, lng: 24.749, ele: 5, day: 4 },
  { name: 'Hotel Dedalos (Sfakaki)', lat: 35.383, lng: 24.584, ele: 10, day: 4 },
  { name: 'Vathipetro', lat: 35.229, lng: 25.163, ele: 600, day: 5 },
  { name: 'Berg Jouchtas', lat: 35.246, lng: 25.140, ele: 760, day: 5 },
  { name: 'Archanes / Fourni', lat: 35.239, lng: 25.161, ele: 380, day: 5 },
  { name: 'Knossos', lat: 35.298, lng: 25.163, ele: 100, day: 5 },
  { name: 'Hotel Dedalos (Sfakaki)', lat: 35.383, lng: 24.584, ele: 10, day: 5 },
  { name: 'Eleftherna', lat: 35.324, lng: 24.672, ele: 380, day: 6 },
  { name: 'Moni Arkadi', lat: 35.310, lng: 24.629, ele: 500, day: 6 },
  { name: 'Moni Preveli', lat: 35.156, lng: 24.475, ele: 170, day: 6 },
  { name: 'Rethymno', lat: 35.371, lng: 24.474, ele: 10, day: 6 },
  { name: 'Hotel Dedalos (Sfakaki)', lat: 35.383, lng: 24.584, ele: 10, day: 6 },
  { name: 'Aptera', lat: 35.462, lng: 24.141, ele: 150, day: 7 },
  { name: 'Chania', lat: 35.516, lng: 24.018, ele: 10, day: 7 },
  { name: 'Maleme (Soldatenfriedhof)', lat: 35.529, lng: 23.833, ele: 20, day: 7 },
  { name: 'Souda (Soldatenfriedhof)', lat: 35.487, lng: 24.074, ele: 15, day: 7 },
  { name: 'Hotel Dedalos (Sfakaki)', lat: 35.383, lng: 24.584, ele: 10, day: 7 },
  { name: 'Heraklion (Museum)', lat: 35.339, lng: 25.133, ele: 30, day: 8 },
  { name: 'Flughafen Heraklion', lat: 35.339, lng: 25.180, ele: 35, day: 8 },
]

function haversineKm(a: Pt, b: Pt): number {
  const R = 6371
  const dLat = (b.lat - a.lat) * Math.PI / 180
  const dLng = (b.lng - a.lng) * Math.PI / 180
  const s = Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

// Höhenprofil: kumulative Distanz (Luftlinie zwischen Haltepunkten)
const profil: ProfilPt[] = punkte.map((p, i) => {
  let dist = 0
  for (let j = 1; j <= i; j++) dist += haversineKm(punkte[j - 1], punkte[j])
  return { ...p, dist: Math.round(dist) }
})

// Distanzbereiche pro Tag für farbige Hintergrundflächen im Profil
const dayRanges = Object.keys(dayColors).map(d => {
  const day = Number(d)
  const pts = profil.filter(p => p.day === day)
  const prevEnd = profil.filter(p => p.day < day).pop()
  return {
    day,
    x1: prevEnd ? prevEnd.dist : 0,
    x2: pts.length ? pts[pts.length - 1].dist : 0,
  }
}).filter(r => r.x2 > r.x1)

function ProfilTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ProfilPt }> }) {
  if (!active || !payload || !payload.length) return null
  const p = payload[0].payload
  return (
    <div className="profil-tooltip">
      <div className="profil-tooltip-name" style={{ color: dayColors[p.day] }}>Tag {p.day} · {p.name}</div>
      <div>{p.ele} m ü. M. · km {p.dist}</div>
    </div>
  )
}

export default function RouteMap() {
  const [hover, setHover] = useState<ProfilPt | null>(null)

  return (
    <div className="route-map-wrap">
      <MapContainer center={[35.25, 25.05]} zoom={9} scrollWheelZoom={false} className="route-map">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {punkte.slice(1).map((p, i) => (
          <Polyline
            key={i}
            positions={[[punkte[i].lat, punkte[i].lng], [p.lat, p.lng]]}
            pathOptions={{ color: dayColors[p.day], weight: 4, opacity: 0.85 }}
          />
        ))}
        {punkte.map((p, i) => (
          <CircleMarker
            key={`m${i}`}
            center={[p.lat, p.lng]}
            radius={5}
            pathOptions={{ color: '#fff', weight: 1.5, fillColor: dayColors[p.day], fillOpacity: 1 }}
          >
            <MapTooltip>Tag {p.day} · {p.name}</MapTooltip>
          </CircleMarker>
        ))}
        {hover && (
          <CircleMarker
            center={[hover.lat, hover.lng]}
            radius={10}
            pathOptions={{ color: '#dc2626', weight: 3, fillColor: '#dc2626', fillOpacity: 0.6 }}
          />
        )}
      </MapContainer>

      <div className="route-legend">
        {Object.entries(dayColors).map(([d, c]) => (
          <span key={d} className="route-legend-chip">
            <span className="route-legend-dot" style={{ background: c }} />
            {dayLabels[Number(d)]}
          </span>
        ))}
      </div>

      <h3 className="profil-title">Höhenprofil der Route (Hover zeigt Position auf der Karte)</h3>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart
          data={profil}
          margin={{ top: 10, right: 20, bottom: 5, left: 0 }}
          onMouseMove={(state) => {
            const s = state as unknown as { activePayload?: Array<{ payload: ProfilPt }> }
            const p = s?.activePayload?.[0]?.payload
            if (p) setHover(p)
          }}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="eleFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a6b9e" stopOpacity={0.5} />
              <stop offset="100%" stopColor="#1a6b9e" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          {dayRanges.map(r => (
            <ReferenceArea key={r.day} x1={r.x1} x2={r.x2} fill={dayColors[r.day]} fillOpacity={0.10} />
          ))}
          <XAxis dataKey="dist" type="number" domain={[0, 'dataMax']} unit=" km" tick={{ fontSize: 12 }} />
          <YAxis unit=" m" tick={{ fontSize: 12 }} width={55} />
          <ChartTooltip content={<ProfilTooltip />} />
          <Area type="monotone" dataKey="ele" stroke="#0f4a72" strokeWidth={2} fill="url(#eleFill)" activeDot={{ r: 5, fill: '#dc2626' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
