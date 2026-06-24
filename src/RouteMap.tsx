import { Map } from 'lucide-react'

export default function RouteMap() {
  return (
    <div style={{ padding: '3rem', textAlign: 'center', background: '#f9fafb', borderRadius: 12 }}>
      <Map size={48} color="#d1d5db" />
      <p style={{ color: '#9ca3af', marginTop: '1rem' }}>
        GPX-Routenkarte – wird nach Festlegung der Route ergänzt.
      </p>
    </div>
  )
}
