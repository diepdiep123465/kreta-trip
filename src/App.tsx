import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Hotel, ChevronDown, ChevronUp, Menu, X,
  UtensilsCrossed, BookOpen, Languages,
  Navigation, Info, Globe,
  Map, FileText, Music, Plane, ExternalLink, Landmark, Users, Clock
} from 'lucide-react'
import './App.css'

const RouteMap = lazy(() => import('./RouteMap'))

const fadeIn = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

// ─── DATA ───────────────────────────────────────────────────────────────────

const navItems = [
  { id: 'region',    label: 'Region',     icon: <Globe size={14} /> },
  { id: 'route',     label: 'Reiseroute', icon: <Navigation size={14} /> },
  { id: 'restaurants', label: 'Restaurants', icon: <UtensilsCrossed size={14} /> },
  { id: 'speisen',   label: 'Speisen',    icon: <UtensilsCrossed size={14} /> },
  { id: 'musik',     label: 'Musik',      icon: <Music size={14} /> },
  { id: 'texte',     label: 'Texte',      icon: <FileText size={14} /> },
  { id: 'wissen',    label: 'Wissen',     icon: <BookOpen size={14} /> },
  { id: 'glossar',   label: 'Glossar',    icon: <Languages size={14} /> },
  { id: 'karten',    label: 'Karten',     icon: <Map size={14} /> },
]

const stats = [
  { value: '8.336 km²', label: 'Fläche' },
  { value: '650.000', label: 'Einwohner' },
  { value: '1.456 m', label: 'Höchster Berg (Ida)' },
  { value: '1.000+', label: 'Jahre Minoische Kultur' },
  { value: '8', label: 'Exkursionstage' },
  { value: '260+', label: 'Sonnentage/Jahr' },
]

interface StopData {
  name: string
  desc: string
  km?: string
  image?: string
}

interface HotelData {
  name: string
  mapsQuery: string
  mapsEmbed: string
}

interface FlightInfo {
  number: string
  airline: string
  aircraft: string
  fromCode: string
  fromCity: string
  toCode: string
  toCity: string
  depTime: string
  arrTime: string
  depConfirmed: boolean
  arrConfirmed: boolean
  date: string
  statusUrl: string
}

interface DayData {
  day: number
  date: string
  weekday: string
  title: string
  image: string
  hotel?: string
  hotelData?: HotelData
  flight?: FlightInfo
  stops: StopData[]
}

const hinflug: FlightInfo = {
  number: `EW 4384`,
  airline: `Eurowings`,
  aircraft: `Airbus A320`,
  fromCode: `SZG`,
  fromCity: `Salzburg`,
  toCode: `HER`,
  toCity: `Heraklion`,
  depTime: `06:10`,
  arrTime: `09:50`,
  depConfirmed: true,
  arrConfirmed: false,
  date: `Freitag, 17. Juli 2026`,
  statusUrl: `https://www.salzburg-airport.com/?overlay=flight&num=EW+4384&tstmp=1784261400&type=departure&no_cache=1`,
}

const rueckflug: FlightInfo = {
  number: `EW 4385`,
  airline: `Eurowings`,
  aircraft: `Airbus A320`,
  fromCode: `HER`,
  fromCity: `Heraklion`,
  toCode: `SZG`,
  toCity: `Salzburg`,
  depTime: `17:25`,
  arrTime: `19:05`,
  depConfirmed: false,
  arrConfirmed: true,
  date: `Freitag, 24. Juli 2026`,
  statusUrl: `https://www.salzburg-airport.com/?overlay=flight&num=EW+4385&tstmp=1784912700&type=arrival&no_cache=1`,
}

const corivaHotel: HotelData = {
  name: `Hotel Coriva Beach`,
  mapsQuery: `Coriva+Beach+Hotel+Ierapetra+Crete`,
  mapsEmbed: `Coriva+Beach+Hotel,+Koutsounari,+Ierapetra,+Crete,+Greece`,
}

const dedalosHotel: HotelData = {
  name: `Dedalos Beach Hotel`,
  mapsQuery: `Dedalos+Beach+Hotel+Sfakaki+Rethymno`,
  mapsEmbed: `Dedalos+Beach+Hotel,+Sfakaki,+Rethymno,+Crete,+Greece`,
}

const days: DayData[] = [
  {
    day: 1, date: '17. Juli', weekday: 'Freitag',
    title: 'Salzburg – Heraklion – Lassithi – Ierapetra',
    image: `/kreta-trip/bilder/titel-1.jpg`,
    hotel: 'Hotel Coriva Beach, Ierapetra (N/F)',
    hotelData: corivaHotel,
    flight: hinflug,
    stops: [
      { name: 'Flug Salzburg – Heraklion', desc: 'Anreise per Flugzeug auf die größte griechische Insel' },
      { name: 'Eileithyia-Höhle', desc: 'Antikes Höhlenheiligtum bei Amnisos – Kultstätte der Geburtsgöttin Eileithyia, schon bei Homer erwähnt', km: '20 km', image: `/kreta-trip/bilder/eileithyia.jpg` },
      { name: 'Lassithi-Hochebene', desc: 'Fahrt über die landschaftlich reizvolle Hochebene mit ihren Windmühlen und Obstgärten', km: '75 km', image: `/kreta-trip/bilder/Lassithi3.jpg` },
      { name: 'Zeus-Höhle', desc: 'Diktäische Grotte (Psychro) – der mythische Geburtsort des Zeus', image: `/kreta-trip/bilder/zeus-hoehle.jpg` },
      { name: 'Ierapetra', desc: 'Südlichste Stadt Europas – Ankunft im Hotel Coriva Beach', km: '80 km', image: `/kreta-trip/bilder/ierapetra.jpg` },
    ],
  },
  {
    day: 2, date: '18. Juli', weekday: 'Samstag',
    title: 'Ostkreta: Gournia – Sitia – Kato Zakros – Vai',
    image: `/kreta-trip/bilder/titel-2.jpg`,
    hotel: 'Hotel Coriva Beach, Ierapetra (N/F)',
    hotelData: corivaHotel,
    stops: [
      { name: 'Gournia', desc: 'Vollständig ausgegrabene minoische Stadt mit Gassen und Wohnhäusern', km: '25 km', image: `/kreta-trip/bilder/gournia.jpg` },
      { name: 'Sitia', desc: 'Hafenstädtchen mit Archäologischem Museum', km: '50 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/SITIA-HARBOUR-CRETE-GREECE-5.jpg/960px-SITIA-HARBOUR-CRETE-GREECE-5.jpg` },
      { name: 'Kato Zakros', desc: 'Vierter minoischer Palast im äußersten Osten der Insel', km: '50 km', image: `/kreta-trip/bilder/kato-zakros.jpg` },
      { name: 'Vai', desc: 'Aufenthalt am berühmten Palmenstrand – Europas größter natürlicher Palmenhain', km: '40 km', image: `/kreta-trip/bilder/vai.jpg` },
      { name: 'Moni Toplou', desc: 'Wehrhafte Klosteranlage aus dem 15. Jahrhundert', km: '10 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Moni_Toplou_R02.jpg/960px-Moni_Toplou_R02.jpg` },
      { name: 'Rückkehr Hotel Coriva Beach', desc: 'Abendessen im Hotel', km: '65 km' },
    ],
  },
  {
    day: 3, date: '19. Juli', weekday: 'Sonntag',
    title: 'Olous / Spinalonga – Kritsa – Lato – Malia – Agios Nikolaos',
    image: `/kreta-trip/bilder/titel-3.jpg`,
    hotel: 'Hotel Coriva Beach, Ierapetra (N/F)',
    hotelData: corivaHotel,
    stops: [
      { name: 'Olous / Spinalonga', desc: 'Versunkene römische Stadt und venezianische Inselfestung, später Leprakolonie', km: '65 km', image: `/kreta-trip/bilder/spinalonga.jpg` },
      { name: 'Kritsa', desc: 'Kirche Panagia Kera mit den bedeutendsten byzantinischen Fresken Kretas', km: '20 km', image: `/kreta-trip/bilder/kritsa.jpg` },
      { name: 'Lato', desc: 'Dorische Stadtanlage mit Blick über den Golf von Mirabello', km: '5 km', image: `/kreta-trip/bilder/lato.jpg` },
      { name: 'Malia', desc: 'Dritter großer minoischer Palast mit dem berühmten Opfertisch (Kernos)', km: '35 km', image: `/kreta-trip/bilder/malia.jpg` },
      { name: 'Agios Nikolaos', desc: 'Malerische Stadt am See Voulismeni', km: '15 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Lake_Voulismeni%2C_Agios_Nikolaos%2C_Crete%2C_Sept_2019.jpg/960px-Lake_Voulismeni%2C_Agios_Nikolaos%2C_Crete%2C_Sept_2019.jpg` },
      { name: 'Badeaufenthalt Hotel Coriva Beach', desc: 'Entspannung am Hotelstrand', km: '55 km' },
    ],
  },
  {
    day: 4, date: '20. Juli', weekday: 'Montag',
    title: 'Messara-Ebene: Gortyn – Phaistos – Agia Triada – Matala',
    image: `/kreta-trip/bilder/titel-4.jpg`,
    hotel: 'Dedalos Beach Hotel, Sfakaki (N/F)',
    hotelData: dedalosHotel,
    stops: [
      { name: 'Gortyn', desc: 'Römische Provinzhauptstadt mit dem berühmten Gesetzeskodex und der Zeusplatane', km: '105 km', image: `/kreta-trip/bilder/gortyn.jpg` },
      { name: 'Phaistos', desc: 'Zweitgrößter minoischer Palast, Fundort des rätselhaften Diskos von Phaistos', km: '20 km', image: `/kreta-trip/bilder/festos.jpg` },
      { name: 'Agia Triada', desc: 'Minoische Palastvilla mit bedeutenden Funden (Boxer-Rhyton, Schnittervase)', km: '5 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Agia_Triada%2C_145788.jpg/960px-Agia_Triada%2C_145788.jpg` },
      { name: 'Matala', desc: 'Hippiestrand mit den berühmten Höhlenwohnungen im Sandstein', km: '15 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Beach_and_troglodytes_at_Matala%2C_Crete%2C_Greece.jpg/960px-Beach_and_troglodytes_at_Matala%2C_Crete%2C_Greece.jpg` },
      { name: 'Sfakaki bei Rethymnon', desc: 'Ankunft im Dedalos Beach Hotel', km: '85 km' },
    ],
  },
  {
    day: 5, date: '21. Juli', weekday: 'Dienstag',
    title: 'Vathipetro – Jouchtas – Archanes – Knossos',
    image: `/kreta-trip/bilder/titel-5.jpg`,
    hotel: 'Dedalos Beach Hotel, Sfakaki (N/F)',
    hotelData: dedalosHotel,
    stops: [
      { name: 'Vathipetro', desc: 'Minoisches Landhaus mit erhaltener Wein- und Ölpresse', km: '90 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Vathypetro_17.JPG/960px-Vathypetro_17.JPG` },
      { name: 'Berg Jouchtas', desc: 'Heiliger Berg der Minoer – im Profil das „Antlitz des Zeus"', km: '10 km', image: `/kreta-trip/bilder/jouchtas.jpg` },
      { name: 'Archanes / Fourni', desc: 'Bedeutende minoische Grabanlage (Nekropole) und kleines Museum', km: '90 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/%CE%91%CF%81%CF%87%CE%AC%CE%BD%CE%B5%CF%82_7928.jpg/960px-%CE%91%CF%81%CF%87%CE%AC%CE%BD%CE%B5%CF%82_7928.jpg` },
      { name: 'Knossos', desc: 'Der größte minoische Palast – Zentrum der Kultur um König Minos und das Labyrinth', km: '10 km', image: `/kreta-trip/bilder/knossos.jpg` },
      { name: 'Rückkehr Hotel Dedalos', desc: 'Abendessen im Hotel', km: '85 km' },
    ],
  },
  {
    day: 6, date: '22. Juli', weekday: 'Mittwoch',
    title: 'Eleftherna – Arkadi – Preveli – Rethymnon',
    image: `/kreta-trip/bilder/titel-6.jpg`,
    hotel: 'Dedalos Beach Hotel, Sfakaki (N/F)',
    hotelData: dedalosHotel,
    stops: [
      { name: 'Eleftherna', desc: 'Minoisch-dorisch-römische Stadt mit modernem Museum', km: '25 km', image: `/kreta-trip/bilder/eleftherna.jpg` },
      { name: 'Moni Arkadi', desc: 'Nationalheiligtum – Stätte des kretischen Widerstands von 1866', km: '10 km', image: `/kreta-trip/bilder/arkadi.jpg` },
      { name: 'Moni Preveli', desc: 'Byzantinisches Kloster hoch über dem Libyschen Meer', km: '65 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Preveli_World_War_II_Memorial.JPG/960px-Preveli_World_War_II_Memorial.JPG` },
      { name: 'Rethymnon', desc: 'Venezianische Fortezza, Altstadt und Archäologisches Museum', km: '40 km', image: `/kreta-trip/bilder/rethymno.jpg` },
      { name: 'Rückkehr Hotel Dedalos', desc: 'Abendessen im Hotel', km: '10 km' },
    ],
  },
  {
    day: 7, date: '23. Juli', weekday: 'Donnerstag',
    title: 'Westkreta: Aptera – Chania – Maleme – Souda',
    image: `/kreta-trip/bilder/titel-7.jpg`,
    hotel: 'Dedalos Beach Hotel, Sfakaki (N/F)',
    hotelData: dedalosHotel,
    stops: [
      { name: 'Aptera', desc: 'Antike Stadt mit gewaltigen römischen Zisternen und Blick auf die Souda-Bucht', km: '60 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Aptera_cisterns.JPG/960px-Aptera_cisterns.JPG` },
      { name: 'Chania', desc: 'Venezianischer Hafen, Markthalle und Altstadt – schönste Stadt Kretas', km: '25 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Harbor%2C_Venetian_shipyards_and_Lighthouse_in_Chania._Crete%2C_Greece.jpg/1280px-Harbor%2C_Venetian_shipyards_and_Lighthouse_in_Chania._Crete%2C_Greece.jpg` },
      { name: 'Maleme', desc: 'Deutscher Soldatenfriedhof – Schauplatz der Luftlandeschlacht 1941', km: '20 km', image: `/kreta-trip/bilder/maleme.jpg` },
      { name: 'Souda', desc: 'Britischer Soldatenfriedhof (Souda Bay War Cemetery)', km: '30 km', image: `/kreta-trip/bilder/souda.jpg` },
      { name: 'Rückkehr Hotel Dedalos', desc: 'Abendessen im Hotel', km: '70 km' },
    ],
  },
  {
    day: 8, date: '24. Juli', weekday: 'Freitag',
    title: 'Heraklion – Heimreise nach Salzburg',
    image: `/kreta-trip/bilder/titel-8.jpg`,
    flight: rueckflug,
    stops: [
      { name: 'Heraklion', desc: 'Archäologisches Museum (u.a. die berühmte „Pariserin") und Stadtbesichtigung', km: '75 km', image: `/kreta-trip/bilder/heraklion-museum.jpg` },
      { name: 'Transfer Flughafen Heraklion', desc: 'Fahrt zum Flughafen Nikos Kazantzakis', km: '10 km' },
      { name: 'Rückflug nach Salzburg', desc: 'Ende der Exkursion' },
    ],
  },
]

// ─── WETTER (Open-Meteo, live abgerufen) ────────────────────────────────────

interface DayWeather {
  tmax: number
  tmin: number
  code: number
  wind: number
  precip: number
}

// Repräsentativer Ort pro Reisetag für die Vorhersage
const wetterOrte: { day: number; name: string; lat: number; lng: number }[] = [
  { day: 1, name: 'Lassithi-Hochebene', lat: 35.19, lng: 25.48 },
  { day: 2, name: 'Vai / Ostkreta', lat: 35.25, lng: 26.26 },
  { day: 3, name: 'Agios Nikolaos', lat: 35.19, lng: 25.72 },
  { day: 4, name: 'Matala / Messara', lat: 34.99, lng: 24.75 },
  { day: 5, name: 'Knossos', lat: 35.30, lng: 25.16 },
  { day: 6, name: 'Rethymno', lat: 35.37, lng: 24.47 },
  { day: 7, name: 'Chania', lat: 35.51, lng: 24.02 },
  { day: 8, name: 'Heraklion', lat: 35.34, lng: 25.13 },
]

function wetterSymbol(code: number): { icon: string; text: string } {
  if (code === 0) return { icon: '☀️', text: 'sonnig' }
  if (code <= 2) return { icon: '🌤️', text: 'heiter' }
  if (code === 3) return { icon: '☁️', text: 'bewölkt' }
  if (code <= 48) return { icon: '🌫️', text: 'Nebel' }
  if (code <= 57) return { icon: '🌦️', text: 'Nieselregen' }
  if (code <= 67) return { icon: '🌧️', text: 'Regen' }
  if (code <= 77) return { icon: '🌨️', text: 'Schnee' }
  if (code <= 82) return { icon: '🌦️', text: 'Schauer' }
  return { icon: '⛈️', text: 'Gewitter' }
}

interface Restaurant {
  name: string
  ort: string
  bewertung: number
  spezialitaet: string
  note: string
  tag: string
  mapsQuery: string
}

const restaurants: Restaurant[] = [
  // ── Ierapetra (Tage 1–3) ──
  {
    name: `Napoleon`,
    ort: `Ierapetra`,
    bewertung: 4,
    spezialitaet: `Fisch & Meeresfrüchte`,
    note: `Ältestes Fischlokal an der Strandpromenade – traditionsreich und bei Einheimischen beliebt`,
    tag: `Tage 1–3`,
    mapsQuery: `Napoleon+Restaurant+Ierapetra+Crete`,
  },
  {
    name: `Special`,
    ort: `Ierapetra`,
    bewertung: 4,
    spezialitaet: `Kretische Küche`,
    note: `Reddit-Tipp (r/GreeceTravel): eines der wenigen empfohlenen Lokale im Lasithi-Bezirk – praktisch fürs Hotel Coriva Beach`,
    tag: `Tage 1–3`,
    mapsQuery: `Special+Restaurant+Ierapetra+Crete`,
  },
  // ── Sitia (Tag 2) ──
  {
    name: `To Limani`,
    ort: `Sitia`,
    bewertung: 4,
    spezialitaet: `Fisch am Hafen`,
    note: `Reddit-Tipp (r/GreeceTravel): Hafentaverne in Sitia – ideal für die Mittagspause auf der Ostkreta-Tour`,
    tag: `Tag 2`,
    mapsQuery: `To+Limani+Sitia+Crete`,
  },
  // ── Agios Nikolaos (Tag 3) ──
  {
    name: `Pelagos`,
    ort: `Agios Nikolaos`,
    bewertung: 5,
    spezialitaet: `Fisch im Villengarten`,
    note: `Frischer Fisch im Garten einer neoklassizistischen Villa – eine der schönsten Adressen der Stadt`,
    tag: `Tag 3`,
    mapsQuery: `Pelagos+Restaurant+Agios+Nikolaos+Crete`,
  },
  // ── Heraklion (Tage 5 & 8) ──
  {
    name: `Peskesi`,
    ort: `Heraklion`,
    bewertung: 5,
    spezialitaet: `Traditionelle kretische Küche`,
    note: `Authentische kretische Küche mit alten Rezepten und eigenen Bio-Zutaten in historischem Ambiente – auch auf Reddit (r/GreeceTravel) mehrfach empfohlen`,
    tag: `Tage 5 & 8`,
    mapsQuery: `Peskesi+Heraklion+Crete`,
  },
  {
    name: `Hovoli`,
    ort: `Heraklion`,
    bewertung: 4,
    spezialitaet: `Traditionelles Kafenio`,
    note: `Reddit-Tipp (r/GreeceTravel): traditionsreiches Lokal im Zentrum – gut für eine Pause bei der Stadtbesichtigung`,
    tag: `Tage 5 & 8`,
    mapsQuery: `Hovoli+Heraklion+Crete`,
  },
  {
    name: `Ippokambos`,
    ort: `Heraklion`,
    bewertung: 4,
    spezialitaet: `Fisch-Mezedes`,
    note: `Einfaches, sehr beliebtes Mezedopolio an der Uferstraße – oft mit Wartezeit, dafür günstig und frisch`,
    tag: `Tage 5 & 8`,
    mapsQuery: `Ippokampos+Heraklion+Crete`,
  },
  // ── Rethymno (Tag 6) ──
  {
    name: `Avli`,
    ort: `Rethymno`,
    bewertung: 5,
    spezialitaet: `Gehobene kretische Küche`,
    note: `Kreativ-kretische Küche im romantischen Innenhof eines venezianischen Herrenhauses, ausgezeichnete Weinkarte`,
    tag: `Tage 4–7`,
    mapsQuery: `Avli+Restaurant+Rethymno+Crete`,
  },
  {
    name: `Prima Plora`,
    ort: `Rethymno`,
    bewertung: 5,
    spezialitaet: `Modern-kretisch am Meer`,
    note: `Reddit-Favorit (eigener Empfehlungs-Thread auf r/crete): direkt am Wasser mit Blick auf die Fortezza – nahe eurem Hotel Dedalos`,
    tag: `Tage 4–7`,
    mapsQuery: `Prima+Plora+Rethymno+Crete`,
  },
  // ── Preveli (Tag 6) ──
  {
    name: `Gefyra Taverna`,
    ort: `Kato Moni Preveli`,
    bewertung: 4,
    spezialitaet: `Ländliche Taverne`,
    note: `Reddit-Tipp (r/GreeceTravel): Taverne an der alten Brücke unterhalb des Klosters Preveli – liegt exakt auf eurer Route am Tag 6`,
    tag: `Tag 6`,
    mapsQuery: `Gefyra+Taverna+Moni+Preveli+Crete`,
  },
  // ── Chania (Tag 7) ──
  {
    name: `Tamam`,
    ort: `Chania`,
    bewertung: 5,
    spezialitaet: `Kretisch-orientalisch`,
    note: `Beliebtes Lokal in einem ehemaligen türkischen Hamam in der Altstadt – würzige, orientalisch beeinflusste Gerichte; auf Reddit vielgenannt`,
    tag: `Tag 7`,
    mapsQuery: `Tamam+Restaurant+Chania+Crete`,
  },
  {
    name: `Tsalikis`,
    ort: `Chania (Nea Chora)`,
    bewertung: 5,
    spezialitaet: `Versteckte Fischtaverne`,
    note: `Geheimtipp von Einheimischen auf r/crete („kind of hidden") – der Fragesteller aß dort und bestätigte: hervorragende Meeresfrüchte`,
    tag: `Tag 7`,
    mapsQuery: `Tsalikis+Taverna+Nea+Chora+Chania`,
  },
  {
    name: `Achilleas`,
    ort: `Chania (Nea Chora)`,
    bewertung: 4,
    spezialitaet: `Frischer Fisch`,
    note: `Auf Reddit doppelt bestätigt (r/crete + r/GreeceTravel): Fischtaverne am Strand von Nea Chora, „fantastic"`,
    tag: `Tag 7`,
    mapsQuery: `Achilleas+Fish+Tavern+Nea+Chora+Chania`,
  },
  {
    name: `To Maridaki`,
    ort: `Chania`,
    bewertung: 5,
    spezialitaet: `Mezedes & frischer Fisch`,
    note: `Modernes Mezedopolio abseits des Touristenhafens – kreative Meze und Fisch, bei Einheimischen hoch geschätzt`,
    tag: `Tag 7`,
    mapsQuery: `To+Maridaki+Chania+Crete`,
  },
  {
    name: `Thalassino Ageri`,
    ort: `Chania`,
    bewertung: 5,
    spezialitaet: `Fisch am Meer`,
    note: `Fischtaverne auf den Felsen am Wasser (Stadtteil Tabakaria) – „insane seafood, Tische direkt am Wasser" (Reddit r/GreeceTravel)`,
    tag: `Tag 7`,
    mapsQuery: `Thalassino+Ageri+Chania+Crete`,
  },
  {
    name: `To Maereio`,
    ort: `Chania`,
    bewertung: 4,
    spezialitaet: `Mezedes & Gegrilltes`,
    note: `Kleines, ehrliches Lokal in der Altstadt mit frischen Zutaten vom Markt`,
    tag: `Tag 7`,
    mapsQuery: `To+Maereio+Chania+Crete`,
  },
]

interface Speise {
  name: string
  beschreibung: string
  bild: string
  quelle?: string
}

const vorspeisen: Speise[] = [
  {
    name: `Dakos`,
    beschreibung: `Kretischer Zwieback (Paximadi) mit geriebenen Tomaten, Mizithra-Käse, Oregano und Olivenöl – das kretische Nationalgericht schlechthin, einfach und uralt zugleich.`,
    bild: `/kreta-trip/bilder/speise-dakos.jpg`,
  },
  {
    name: `Choriatiki (Bauernsalat)`,
    beschreibung: `Der klassische griechische Salat aus Tomaten, Gurken, Zwiebeln, grünem Paprika, Oliven und einem Stück Feta obenauf – nie mit Blattsalat, dafür mit viel Olivenöl.`,
    bild: `/kreta-trip/bilder/speise-choriatiki.jpg`,
  },
  {
    name: `Dolmadakia`,
    beschreibung: `Mit Reis, Kräutern und manchmal Hackfleisch gefüllte Weinblätter, die in Zitronen-Ei-Sauce (Avgolemono) oder mit Zitronensaft serviert werden – eine mediterrane Delikatesse mit langer Tradition.`,
    bild: `/kreta-trip/bilder/speise-dolmadakia.jpg`,
  },
  {
    name: `Taramosalata`,
    beschreibung: `Cremiger Dip aus Fischrogen (Tarama), eingeweichtem Weißbrot oder Kartoffeln, Öl und Zitrone – klassische Vorspeise, meist mit Oliven und Pita gereicht.`,
    bild: `/kreta-trip/bilder/speise-taramosalata.jpg`,
  },
  {
    name: `Tiropita`,
    beschreibung: `Knuspriges Filoteig-Gebäck, gefüllt mit Feta und anderen Käsesorten – als kleines Dreieck ein beliebter Snack für unterwegs, verwandt mit den kretischen Kalitsounia.`,
    bild: `/kreta-trip/bilder/speise-tiropita.jpg`,
  },
]

const hauptspeisen: Speise[] = [
  {
    name: `Moussaka`,
    beschreibung: `Auflauf aus geschichteten Auberginen, Kartoffeln, Hackfleisch in Tomatensauce und einer Béchamel-Haube – das bekannteste griechische Gericht international.`,
    bild: `/kreta-trip/bilder/speise-mousaka.jpg`,
  },
  {
    name: `Souvlaki`,
    beschreibung: `Marinierte Fleischspieße vom Grill, meist Schwein oder Hähnchen, mit Salat, Zwiebeln, Reis oder Pommes serviert – der Klassiker griechischer Straßenküche.`,
    bild: `/kreta-trip/bilder/speise-souvlaki.jpg`,
  },
  {
    name: `Gemista`,
    beschreibung: `Mit Reis, Kräutern und Gemüse gefüllte Tomaten und Paprika, im Ofen gebacken – ein sommerliches Familiengericht, das auf fast jedem griechischen Tisch zu finden ist.`,
    bild: `/kreta-trip/bilder/speise-gemista.jpg`,
  },
  {
    name: `Giouvetsi`,
    beschreibung: `Schmorgericht aus Fleisch (meist Rind oder Lamm) und Kritharaki-Nudeln (Orzo) in Tomatensauce, im Tontopf im Ofen gegart – deftige griechische Hausmannskost.`,
    bild: `/kreta-trip/bilder/speise-jouvetsi.jpg`,
  },
  {
    name: `Stifado`,
    beschreibung: `Schmorgericht aus Rind- oder Kaninchenfleisch mit vielen kleinen Perlzwiebeln, Rotwein, Tomaten und Zimt – ein langsam gegartes Wintergericht.`,
    bild: `/kreta-trip/bilder/speise-stifado.jpg`,
  },
]

const nachspeisen: Speise[] = [
  {
    name: `Kataifi`,
    beschreibung: `Süßgebäck aus feinen Weizenfäden, gefüllt mit Nüssen und mit Zuckersirup getränkt – verwandt mit der Baklava, ein fester Bestandteil griechischer Konditoreien.`,
    bild: `/kreta-trip/bilder/speise-kataifi.jpg`,
  },
  {
    name: `Galaktoboureko`,
    beschreibung: `Warmer Grießpudding, eingebacken in knusprigen Filoteig und mit Zitronensirup getränkt – „Milchbörek“, eines der beliebtesten griechischen Desserts.`,
    bild: `/kreta-trip/bilder/speise-galaktoboureko.jpg`,
    quelle: `Foto: Badseed / Wikimedia Commons (CC BY 3.0)`,
  },
  {
    name: `Halva`,
    beschreibung: `Dichte Süßspeise aus Sesammus (Tahin) und Zucker, oft mit Pistazien oder Mandeln – hier als traditioneller Laib auf einem griechischen Markt, in Scheiben verkauft.`,
    bild: `/kreta-trip/bilder/speise-halva.jpg`,
    quelle: `Foto: Drejwen / Wikimedia Commons (CC BY 4.0)`,
  },
  {
    name: `Loukoumades`,
    beschreibung: `Frittierte Teigbällchen, warm serviert und mit Honig oder Sirup übergossen, dazu Zimt und Walnüsse – eine der ältesten Süßspeisen überhaupt, schon in der Antike den Olympiasiegern gereicht.`,
    bild: `/kreta-trip/bilder/speise-loukoumades.jpg`,
    quelle: `Foto: avlxyz / Wikimedia Commons (CC BY-SA 2.0)`,
  },
  {
    name: `Baklava`,
    beschreibung: `Vielschichtiges Filoteig-Gebäck mit gehackten Walnüssen oder Pistazien, getränkt in Honig- oder Zuckersirup – der Klassiker zu festlichen Anlässen im östlichen Mittelmeerraum.`,
    bild: `/kreta-trip/bilder/speise-baklava.jpg`,
    quelle: `Foto: Mari Beika / Wikimedia Commons (CC BY-SA 4.0)`,
  },
]

// Speisen-Karussell – rotiert automatisch alle 7 Sekunden
function SpeisenKarussel({ gerichte }: { gerichte: Speise[] }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (gerichte.length < 2) return
    const timer = setInterval(() => setIdx(i => (i + 1) % gerichte.length), 7000)
    return () => clearInterval(timer)
  }, [gerichte.length])
  const s = gerichte[idx]
  return (
    <div className="speise-karussel">
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="speise-card"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.4 }}
        >
          <div className="speise-img">
            <img src={s.bild} alt={s.name} loading="lazy" />
          </div>
          <div className="speise-body">
            <h4>{s.name}</h4>
            <p>{s.beschreibung}</p>
            {s.quelle && <span className="speise-quelle">{s.quelle}</span>}
          </div>
        </motion.div>
      </AnimatePresence>
      {gerichte.length > 1 && (
        <div className="carousel-dots">
          {gerichte.map((_, i) => (
            <button
              key={i}
              className={`carousel-dot ${i === idx ? 'active' : ''}`}
              onClick={() => setIdx(i)}
              aria-label={gerichte[i].name}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface Musikstueck {
  titel: string
  interpret: string
  videoId: string
  beschreibung: string
}

const musik: Musikstueck[] = [
  {
    titel: `Sirtaki – Zorbas' Tanz`,
    interpret: `Mikis Theodorakis · aus „Alexis Sorbas" (1964)`,
    videoId: `-RqmAK4cJlY`,
    beschreibung: `Der wohl berühmteste griechische Tanz – komponiert von Mikis Theodorakis für den Film „Alexis Sorbas". Der Sirtaki beginnt langsam (Hasapiko) und steigert sich zu einem immer schnelleren Rhythmus. Ursprünglich für den Film erfunden, wurde er weltweit zum Inbegriff griechischer Lebensfreude.`,
  },
  {
    titel: `Sirtaki – die berühmte Strandszene`,
    interpret: `Anthony Quinn als Alexis Sorbas`,
    videoId: `GIoHp6mr9Vg`,
    beschreibung: `Die legendäre Schlussszene des Films: Anthony Quinn lehrt am kretischen Strand den Sirtaki – Sinnbild dafür, dem Leben trotz aller Rückschläge tanzend zu begegnen. Gedreht wurde sie am Strand von Stavros auf der Halbinsel Akrotiri bei Chania.`,
  },
  {
    titel: `Zorba's Dance – Original-Filmmusik`,
    interpret: `Mikis Theodorakis [Original Score]`,
    videoId: `Xsen9Jh-TPo`,
    beschreibung: `Die originale Orchesterfassung der Filmmusik. Charakteristisch ist der Klang der Bouzouki – des griechischen Zupfinstruments, das durch diese Komposition weltberühmt wurde.`,
  },
]

interface SpotifyTrack {
  trackId: string
  titel: string
  interpret: string
  hinweis: string
}

const spotifyTracks: SpotifyTrack[] = [
  {
    trackId: `3guVK1NSt3hhbGZ2F8WEfu`,
    titel: `Ta pedia tou Pirea (Die Kinder von Piräus)`,
    interpret: `Melina Mercouri · Musik: Manos Hadjidakis`,
    hinweis: `Aus dem Film „Sonntags … nie!" (1960) – als „Never on Sunday" gewann das Lied den Oscar für den besten Song; die wohl bekannteste griechische Filmmelodie neben dem Sirtaki.`,
  },
  {
    trackId: `7D0fsBJbsNpG253teDJhz6`,
    titel: `Arnisi (Άρνηση – „Verleugnung")`,
    interpret: `Mikis Theodorakis · Text: Giorgos Seferis`,
    hinweis: `Vertonung eines Gedichts des Nobelpreisträgers Seferis („Sto perigiali to kryfo"). Eines der berühmtesten griechischen Lieder – bei der Beerdigung Seferis' 1971 zum Symbol des Widerstands gegen die Militärjunta.`,
  },
  {
    trackId: `4omnCI2FNMDnDpyX8cDyyd`,
    titel: `Sto Perigiali (Instrumental)`,
    interpret: `Manolis Michalakis`,
    hinweis: `Instrumentale Fassung von „Arnisi" – Bouzouki-Klänge, die das melancholische Lebensgefühl der griechischen Inselwelt einfangen.`,
  },
  {
    trackId: `7HEdLmRUt8IL6fm4TmVwiu`,
    titel: `An Anixis Tin Cardia Mou (The Beginning)`,
    interpret: `Nikos Ignatiadis · Album „Inspiration"`,
    hinweis: `Moderne griechische Instrumentalmusik – stimmungsvolle Untermalung für die mediterrane Atmosphäre Kretas.`,
  },
]

interface Textquelle {
  titel: string
  autor: string
  epoche: string
  original: string
  uebersetzung: string
  kommentar: string
}

const texte: Textquelle[] = [
  {
    titel: `Kreta – Insel der neunzig Städte`,
    autor: `Homer, Odyssee 19,172–178`,
    epoche: `8. Jh. v. Chr.`,
    original: `Κρήτη τις γαῖ᾽ ἔστι, μέσῳ ἐνὶ οἴνοπι πόντῳ,
καλὴ καὶ πίειρα, περίρρυτος· ἐν δ᾽ ἄνθρωποι
πολλοὶ ἀπειρέσιοι, καὶ ἐννήκοντα πόληες·
ἄλλη δ᾽ ἄλλων γλῶσσα μεμιγμένη· ἐν μὲν Ἀχαιοί,
ἐν δ᾽ Ἐτεόκρητες μεγαλήτορες, ἐν δὲ Κύδωνες
Δωριέες τε τριχάικες δῖοί τε Πελασγοί·
τῇσι δ᾽ ἐνὶ Κνωσός, μεγάλη πόλις, ἔνθα τε Μίνως
ἐννέωρος βασίλευε Διὸς μεγάλου ὀαριστής.`,
    uebersetzung: `Mitten im wogenden Meer liegt Kreta, fruchtbar und schön anzuschauen. Ringsum wird es von Wellen umbrandet. Unzählige Menschen wohnen dort in neunzig reichen Städten. Überall hört man verschiedene Sprachen, denn es leben dort Achäer und Kydonen, eingeborene Kreter und Dorer, die drei Stämme bilden, und edle Pelasger. Die wichtigste Stadt ist Knossos. In ihr herrscht Minos als König jeweils neun Jahre lang, als Vertrauter des Zeus, mit dem er sich berät.`,
    kommentar: `Das Eingangszitat unseres Reiseheftes: Odysseus beschreibt – als Bettler verkleidet – Penelope seine angebliche Heimat. Die Verse bezeugen die Vielvölker-Insel (Achäer, Eteokreter, Kydonen, Dorer, Pelasger) und Knossos als „große Stadt" des Minos, der als ὀαριστής („Vertrauter") des Zeus alle neun Jahre die Gesetze vom Gott selbst empfing.`,
  },
  {
    titel: `Rhadamanthys im Elysion – das Paradies bei Phaistos`,
    autor: `Homer, Odyssee 4,563–568`,
    epoche: `8. Jh. v. Chr.`,
    original: `ἀλλά σ᾽ ἐς Ἠλύσιον πεδίον καὶ πείρατα γαίης
ἀθάνατοι πέμψουσιν, ὅθι ξανθὸς Ῥαδάμανθυς,
τῇ περ ῥηίστη βιοτὴ πέλει ἀνθρώποισιν·
οὐ νιφετός, οὔτ᾽ ἂρ χειμὼν πολὺς οὔτε ποτ᾽ ὄμβρος,
ἀλλ᾽ αἰεὶ Ζεφύροιο λιγὺ πνείοντος ἀήτας
Ὠκεανὸς ἀνίησιν ἀναψύχειν ἀνθρώπους.`,
    uebersetzung: `Dort wohnt der bräunliche Held Rhadamanthys, und ruhiges Leben beseligt die Menschen alle Tage. Dort ist kein Schnee, kein Winterorkan und kein gießender Regen. Ewig wehn die Gesäuse des leise atmenden Westes, die der Ozean sendet, die Menschen sanft zu kühlen. (Übers. J. H. Voß)`,
    kommentar: `Während Minos in Knossos und Sarpedon in Mallia residierte, war Rhadamanthys König im Palast von Phaistos (Tag 4). Homer versetzt ihn ins Elysion – und die Schilderung des milden Klimas ohne Schnee und Sturm liest sich wie eine Beschreibung der Messara-Ebene selbst.`,
  },
  {
    titel: `Der Reigentanz für Ariadne`,
    autor: `Homer, Ilias 18,590–606`,
    epoche: `8. Jh. v. Chr.`,
    original: `ἐν δὲ χορὸν ποίκιλλε περικλυτὸς ἀμφιγυήεις,
τῷ ἴκελον οἷόν ποτ᾽ ἐνὶ Κνωσῷ εὐρείῃ
Δαίδαλος ἤσκησεν καλλιπλοκάμῳ Ἀριάδνῃ.`,
    uebersetzung: `Dädalos hatte einst im weit sich dehnenden Knossos einen Reigentanz ersonnen für die lockige Ariadne. Jünglinge und Jungfrauen hielten einander bei der Hand und tanzten im Kreis. Sie hüpften mit schöngemessenen Schritten anmutig im Kreis herum, wie der Töpfer die Scheibe prüfend herumdreht, ob ihr Lauf auch gleichmäßig ist. Dann tanzten sie in Reihen gegeneinander. Die Zuschauer standen dichtgedrängt um den lieblichen Reigen und freuten sich daran.`,
    kommentar: `Auf dem Schild des Achilleus bildet Hephaistos einen Tanzplatz ab – „gleich jenem, den Dädalos einst in Knossos für Ariadne schuf". Im Palast von Knossos (Tag 5) wurden tatsächlich Fresken mit Zuschauermengen und tanzenden Mädchen gefunden; die Verse gelten als früheste griechische Erinnerung an höfische Feste der Minoer – und als Keimzelle des Theaters.`,
  },
  {
    titel: `Nepenthes – das Mittel gegen Kummer`,
    autor: `Homer, Odyssee 4,219–230`,
    epoche: `8. Jh. v. Chr.`,
    original: `αὐτίκ᾽ ἄρ᾽ εἰς οἶνον βάλε φάρμακον, ἔνθεν ἔπινον,
νηπενθές τ᾽ ἄχολόν τε, κακῶν ἐπίληθον ἁπάντων.`,
    uebersetzung: `Ein neues ersann die liebliche Tochter Kronions: Sie warf in den Wein, wovon sie tranken, ein Mittel gegen Kummer und Groll und die Erinnerung an Schmerzen. Kostete einer nur von dem Wein, mit dieser Würze gemischt, benetzte ihm den ganzen Tag keine Träne die Wangen, wäre auch sein Vater und seine Mutter gestorben.`,
    kommentar: `Im Archäologischen Museum von Heraklion (Tag 8) steht die „Mohngöttin" – ein Idol vom Ende des 2. Jahrtausends v. Chr., das Mohnkapseln auf dem Kopf trägt. Homers Nepenthes, das Helena in den Wein mischt, gilt als literarisches Echo solcher Rauschkulte im alten Kreta.`,
  },
  {
    titel: `Europa auf dem Stier – die Ankunft in Matala`,
    autor: `Bakchylides, Erläuterung zu Fragment 10`,
    epoche: `5. Jh. v. Chr.`,
    original: ``,
    uebersetzung: `Zeus erblickte Europa, die Tochter des Phönix, als sie auf einer Wiese mit den Nymphen Blumen pflückte. Er verliebte sich in sie, stieg zur Erde herab und verwandelte sich in einen Stier. Er blies Safranduft aus seinem Mund, täuschte so Europa, ließ sie auf seinen Rücken steigen und trug sie über das Meer nach Kreta. Dort schlief er mit ihr und gab sie Asterios, dem König der Kreter, zur Gattin. Sie aber war schwanger geworden und gebar drei Söhne: Minos, Sarpedon und Rhadamanthys.`,
    kommentar: `Nach der Überlieferung kam Zeus mit der geraubten Europa in der Bucht von Matala an Land (Tag 4). Die Geschichte steht bei Hesiod und Bakchylides – erhalten ist sie in dieser antiken Erläuterung (Scholion) zu einem Bakchylides-Fragment; ein griechisches Original im Wortlaut ist daher nur bruchstückhaft überliefert.`,
  },
  {
    titel: `Theseus springt ins Meer`,
    autor: `Bakchylides 17,1–129 (Auszug)`,
    epoche: `5. Jh. v. Chr.`,
    original: `Κυανόπρῳρα μὲν ναῦς μενέκτυπον
Θησέα δὶς ἑπτά τ᾽ ἀγλαοὺς ἄγουσα
κούρους Ἰαόνων
Κρητικὸν τάμνε πέλαγος.`,
    uebersetzung: `Das Schiff mit dem schwarzen Schnabel, das den in Kämpfen erprobten Theseus und zweimal sieben aus der glänzenden Jugend Athens trug, durchfurchte die kretische See. […] Neben dem Schiff tauchte Theseus wieder auf. Er stieg aus dem Meer, unbenetzt vom Wasser, ein Wunder für alle. Die Geschenke der Götter leuchteten an seinem Leib. […] Gelähmt stand der Herrscher von Knossos. Die Jungen aber umringten ihren Helden, und mit lauter Stimme sangen sie den Paian.`,
    kommentar: `Der Theseus-Dithyrambos des Bakchylides: Auf der Überfahrt nach Kreta bedrängt Minos eine der athenischen Geiseln – Theseus fordert ihn heraus und beweist seine göttliche Abkunft, indem er zu Poseidon auf den Meeresgrund taucht und mit dem Purpurmantel der Amphitrite zurückkehrt. Das Chorlied wurde vermutlich auf Delos aufgeführt.`,
  },
  {
    titel: `Sarpedon und die Lykier`,
    autor: `Herodot, Historien 1,173`,
    epoche: `5. Jh. v. Chr.`,
    original: ``,
    uebersetzung: `Die Lykier stammen ursprünglich aus Kreta. Ganz Kreta wurde nämlich in alter Zeit von Barbaren bewohnt. Als Sarpedon und Minos, die Söhne der Europa, in Kreta um die Herrschaft stritten, siegte Minos und vertrieb Sarpedon und dessen Anhänger. Die Vertriebenen zogen nach Asien in das Land, das jetzt die Lykier bewohnen. Ihre Gebräuche sind zum Teil heute noch kretisch.`,
    kommentar: `Der „Vater der Geschichtsschreibung" deutet den Mythos historisch: Hinter dem Bruderstreit der Europa-Söhne stehen Machtkämpfe um Kreta, bei denen ganze Volksgruppen auswanderten. Sarpedon galt als König von Malia (Tag 3), bevor er nach Kleinasien zog.`,
  },
  {
    titel: `Rauschkulte – der „Rauchgiftraum" von Lato`,
    autor: `Herodot, Historien 1,202 und 4,75`,
    epoche: `5. Jh. v. Chr.`,
    original: `εἶναι δὲ καὶ ἄλλα σφι δένδρεα καρπὸν τοιόνδε τινὰ φέροντα, τὸν ἐπείτε ἂν ἐς τὠυτὸ συνέλθωσι κατὰ εἴλας καὶ πῦρ ἀνακαύσωνται, κύκλῳ περιιζομένους ἐπιβάλλειν ἐπὶ τὸ πῦρ, ὀσφραινομένους δὲ καταγιζομένου τοῦ καρποῦ τοῦ ἐπιβαλλομένου μεθύσκεσθαι τῇ ὀδμῇ κατά περ Ἕλληνας τῷ οἴνῳ, πλέω δὲ ἐπιβαλλομένου τοῦ καρποῦ μᾶλλον μεθύσκεσθαι, μέχρι οὗ ἐς ὄρχησίν τε ἀνίστασθαι καὶ ἐς ἀοιδὴν ἀπικνέεσθαι. (Historien 1,202)

τῆς ὦν κανναβίδος τὸ σπέρμα ἐπεὰν λάβωσι οἱ Σκύθαι, ὑπὸ τοὺς πίλους ὑποδύνουσι, καὶ ἔπειτα ἐπιβάλλουσι τὸ σπέρμα ἐπὶ τοὺς διαφανέας λίθους τῷ πυρί· τὸ δὲ θυμιᾶται ἐπιβαλλόμενον καὶ ἀτμίδα παρέχεται τοσαύτην ὥστε Ἑλληνικὴ οὐδεμία ἄν μιν πυρίη ἀποκρατήσειε. οἱ δὲ Σκύθαι ἀγάμενοι τῇ πυρίῃ ὠρύονται. (Historien 4,75)`,
    uebersetzung: `Noch andere Bäume soll es bei den Massageten (Sammelbegriff für die Volksstämme östlich des Kaspischen Meeres) geben, die eine eigene Art von Frucht tragen. Wenn sie nämlich in großer Schar zusammengekommen sind und ein Feuer angezündet haben, so setzen sie sich im Kreis um das Feuer herum und werfen von der Frucht in das Feuer. Und wenn sie dann an der brennenden Frucht riechen, so werden sie berauscht von dem Geruch, gerade so wie die Griechen vom Wein. Je mehr nun von der Frucht daraufgeworfen wird, desto berauschter werden sie, bis sie zum Tanzen sich erheben und zu singen anfangen. – Die Skythen (im Gebiet der heutigen Ukraine) nehmen den Samen von einem besonderen Hanf, kriechen damit unter eine Decke und legen die Samen auf durch Feuer glühende Steine. Die fangen dann an zu rauchen und verbreiten einen solchen Dampf, daß kein Schwitzbad darüber gehen dürfte. Die Skythen aber werden so froh dabei, daß sie laut heulen.`,
    kommentar: `Aus dem Reiseheft zur dorischen Stadt Lato (Tag 3): In der Versammlungshalle der Männer sind noch Sitzreihen mit Armlehnen zu sehen, die aschenbecherähnliche Vertiefungen haben – „vielleicht war dies ein Rauchgiftraum". Herodots Berichte über die Rauschrituale der Massageten und Skythen zeigen, dass solche Praktiken der antiken Welt durchaus vertraut waren.`,
  },
  {
    titel: `Minos – der erste Seeherrscher`,
    autor: `Thukydides, Historien 1,4`,
    epoche: `5. Jh. v. Chr.`,
    original: `Μίνως γὰρ παλαίτατος ὧν ἀκοῇ ἴσμεν ναυτικὸν ἐκτήσατο καὶ τῆς νῦν Ἑλληνικῆς θαλάσσης ἐπὶ πλεῖστον ἐκράτησε καὶ τῶν Κυκλάδων νήσων ἦρξέ τε καὶ οἰκιστὴς πρῶτος τῶν πλείστων ἐγένετο.`,
    uebersetzung: `Minos nämlich ist der älteste, von dem wir durch Überlieferung wissen, dass er sich eine Flotte verschaffte: Er beherrschte den größten Teil des heutigen griechischen Meeres, herrschte über die Kykladen und wurde erster Gründer von Kolonien auf den meisten von ihnen.`,
    kommentar: `Thukydides macht Minos zum ersten Thalassokraten der Geschichte. Die „minoische Seeherrschaft" ist für ihn ein rational fassbares Faktum – die Grundlage für Handel und kulturelle Ausstrahlung Kretas, deren Zentrum wir in Knossos besichtigen (Tag 5).`,
  },
  {
    titel: `Das Zeusgrab am Jouchtas – „Kreter sind immer Lügner"`,
    autor: `Kallimachos, Zeushymnos 4–9`,
    epoche: `3. Jh. v. Chr.`,
    original: `πῶς καί νιν, Δικταῖον ἀείσομεν ἠὲ Λυκαῖον;
ἐν δοιῇ μάλα θυμός, ἐπεὶ γένος ἀμφήριστον.
Ζεῦ, σὲ μὲν Ἰδαίοισιν ἐν οὔρεσί φασι γενέσθαι,
Ζεῦ, σὲ δ᾽ ἐν Ἀρκαδίῃ· πότεροι, πάτερ, ἐψεύσαντο;
„Κρῆτες ἀεὶ ψεῦσται"· καὶ γὰρ τάφον, ὦ ἄνα, σεῖο
Κρῆτες ἐτεκτήναντο· σὺ δ᾽ οὐ θάνες, ἐσσὶ γὰρ αἰεί.`,
    uebersetzung: `Wie soll ich dich denn nun nennen: Mann vom Dikte-Gebirge oder vom Lykaion? Ich weiß mir nicht zu helfen, deine Herkunft ist umstritten. Die einen sagen, Zeus sei auf dem Ida geboren, die anderen: in Arkadien. Einer muß lügen, aber wer? – Kreter sind immer Lügner, denn auch ein Grab haben sie dir errichtet. Aber du bist doch unsterblich, du lebst ewig.`,
    kommentar: `Bei der Rückfahrt von Knossos (Tag 5) sehen wir das Profil des Berges Jouchtas – nach alter Überlieferung das Grab des kretischen Zeus, das dem Kopf eines schlafenden bärtigen Mannes ähnelt. Für den Dichter Kallimachos ist schon die Idee eines Zeus-Grabes gotteslästerlich: Sein Spott zitiert dasselbe Kreter-Wort des Epimenides, das später Paulus im Titusbrief aufgreift.`,
  },
  {
    titel: `Finsternis über dem kretischen Meer`,
    autor: `Apollonios von Rhodos, Die Argonauten 4,1694–1701`,
    epoche: `3. Jh. v. Chr.`,
    original: `αὐτίκα δὲ Κρηταῖον ὑπὲρ μέγα λαῖτμα θέοντας
νὺξ ἐφόβει, τήν πέρ τε κατουλάδα κικλήσκουσιν·
νύκτ᾽ ὀλοὴν οὐκ ἄστρα διίσχανεν, οὐκ ἀμαρυγαὶ
μήνης, οὐρανόθεν δὲ μέλαν χάος, ἠέ τις ἄλλη
ὠρώρει σκοτίη μυχάτων ἀνιοῦσα βερέθρων.
αὐτοὶ δ᾽ εἴτ᾽ Ἀίδῃ εἴτ᾽ ὕδασιν ἐμφορέοντο
ἠείδειν οὐδ᾽ ὅσσον· ἐπέτρεψαν δὲ θαλάσσῃ
νόστον, ἀμηχανίῃ πεφορημένοι, ᾗ κε φέρῃσιν.`,
    uebersetzung: `Die nächste Nacht brach über sie herein, als sie sich weit draußen im kretischen Meer befanden. Sie fürchteten sich, denn sie waren in jene Art Nacht geraten, die das Leichentuch des Verderbens genannt wird. Kein Stern, kein Mondlicht durchbrach die Finsternis des Grabes. Schwarzes Chaos hatte sich auf sie vom Himmel herabgesenkt. Oder war diese Dunkelheit aus dem tiefsten Abgrund emporgestiegen? Sie wußten es nicht zu sagen, ob sie durch den Hades trieben oder noch auf dem Meer. Alles, was sie tun konnten, war, ihren Kurs auf die See hinaus zu nehmen, ohne irgend zu wissen, wohin er sie führen werde.`,
    kommentar: `Aus dem Reiseheft (zu Malia, Tag 3): Der Mythos von den Argonauten berichtet von einem seltsamen Naturereignis, das vielleicht verantwortlich war für das plötzliche Ende der minoischen Kultur auf Kreta und die Zerstörung der Paläste. Die unheimliche „Katoulas-Nacht" – Finsternis ohne Stern und Mond – liest sich wie die Erinnerung an die Aschewolke des Thera-Ausbruchs (um 1450 v. Chr.).`,
  },
  {
    titel: `Kreta – Wiege der Trojaner`,
    autor: `Vergil, Aeneis 3,102–142 (Auszug: 104–106)`,
    epoche: `1. Jh. v. Chr.`,
    original: `Creta Iovis magni medio iacet insula ponto,
mons Idaeus ubi et gentis cunabula nostrae.
centum urbes habitant magnas, uberrima regna.`,
    uebersetzung: `Da überlegte Anchises und dachte an die Geschichten seines Großvaters, und er sprach: »Hört mich an und schöpft neue Hoffnung. Mitten im Meer liegt Kreta, die Insel des großen Jupiter. Dort am Ida-Berg ist die Wiege des Geschlechts der Trojaner. Große Reiche gibt es dort und hundert blühende Städte.« – Doch als die Trojaner sich auf Kreta niederlassen, verdorren Saat und Bäume, eine tödliche Seuche geht um.`,
    kommentar: `Drei mächtige Reiche gingen fast gleichzeitig im östlichen Mittelmeer zugrunde: die Hethiter, Troja – und die Minoer. Vergil lässt die geflohenen Trojaner zuerst nach Kreta segeln, ins Land ihrer Väter; sie finden verlassene Küsten und leere Städte vor (vgl. die ausgegrabene Stadt Gournia, Tag 2). Erst eine Seuche treibt sie weiter nach Italien.`,
  },
  {
    titel: `Daedalus baut das Labyrinth`,
    autor: `Ovid, Metamorphosen 8,159–161`,
    epoche: `1. Jh. v. Chr. / 1. Jh. n. Chr.`,
    original: `Daedalus ingenio fabrae celeberrimus artis
ponit opus turbatque notas et lumina flexu
ducit in errorem variarum ambage viarum.`,
    uebersetzung: `Daedalus, hochberühmt durch seine Begabung für die Baukunst, errichtet das Werk: Er verwirrt die Merkzeichen und führt das Auge durch die Windungen der vielerlei Wege in die Irre.`,
    kommentar: `Für den Minotauros ließ Minos das Labyrinth errichten. Der Mythos dürfte eine Erinnerung an den Palast von Knossos (Tag 5) bewahren: Seine hunderten verschachtelten Räume mussten Festlandsgriechen wie ein unentwirrbares Gebäude erscheinen – und die Doppelaxt (labrys) gab ihm wohl den Namen.`,
  },
  {
    titel: `„Die Kreter sind von jeher Lügner" – Paulus über Kreta`,
    autor: `Paulus, Brief an Titus 1,12 (vgl. 1,5–16)`,
    epoche: `1. Jh. n. Chr.`,
    original: `εἶπέν τις ἐξ αὐτῶν ἴδιος αὐτῶν προφήτης· Κρῆτες ἀεὶ ψεῦσται, κακὰ θηρία, γαστέρες ἀργαί.`,
    uebersetzung: `Selbst einer ihrer eigenen Dichter sagt: Die Kreter sind von jeher Lügner, böse Tiere, faule Bäuche. – Paulus fährt fort: Dieses Zeugnis ist wahr. Weise sie deswegen nur derbe zurecht, damit sie im Glauben zu gesunden Begriffen gelangen.`,
    kommentar: `In römischer Zeit war Gortyn (Tag 4) Hauptstadt der Provinz Kreta und Kyrenaika. Dort setzte der Apostel Paulus seinen Gefährten Titus als Bischof ein. Das zitierte Kreter-Wort stammt vom kretischen Dichter Epimenides – als Kreter, der alle Kreter Lügner nennt, wurde er zum Paradebeispiel des logischen „Lügner-Paradoxons".`,
  },
  {
    titel: `Theseus, Ariadne und der Faden`,
    autor: `Hygin, Fabeln 41–43`,
    epoche: `1./2. Jh. n. Chr.`,
    original: ``,
    uebersetzung: `Minos führte Krieg mit den Athenern, wobei sein Sohn Androgeos getötet wurde. Die Athener verloren den Krieg und mußten als Entschädigung in jedem Jahr dem Minotaurus sieben Kinder zum Verspeisen schicken. Theseus wollte die Athener von dem Tribut befreien. In Kreta verliebte sich Ariadne, die Tochter des Minos, in ihn. Sie rettete ihn, indem sie ihm den Weg aus dem Labyrinth wies. Theseus ging hinein, erschlug den Minotaurus und fand dadurch, daß er einen Faden abwickelte, wieder aus dem Labyrinth heraus. Ariadne ließ er schlafend auf der Insel Dia zurück.`,
    kommentar: `Die knappste antike Zusammenfassung des Theseus-Mythos (nach dem Reiseheft). Der jährliche Kinder-Tribut Athens an Knossos spiegelt wohl die historische Oberherrschaft Kretas über die Ägäis – und Theseus' Sieg die spätere Emanzipation der mykenischen Griechen.`,
  },
  {
    titel: `Talos – der bronzene Wächter Kretas`,
    autor: `Apollodor, Bibliothek 1,9,26`,
    epoche: `1./2. Jh. n. Chr.`,
    original: ``,
    uebersetzung: `Die Argonauten wurden von Talos daran gehindert, in Kreta an Land zu gehen. Es heißt, er sei ein Riese aus Erz gewesen und Hephästos habe ihn dem Minos geschenkt. Eine einzige Ader lief von seinem Hals bis zu den Knöcheln, wo sie ein bronzener Nagel verschloß. Dieser Talos bewachte Kreta und lief dreimal täglich um die ganze Insel. Von Medea überlistet, kam er ums Leben: Nach den einen hat sie ihn mit Rauschgift bewußtlos gemacht, nach anderen zog sie ihm den Nagel heraus, so daß er alles Blut verlor und sterben mußte.`,
    kommentar: `Die kretischen Paläste – besonders Malia direkt am Meer (Tag 3) – hatten keinerlei Befestigungen: Eine gewaltige Flotte war die „Schiffsmauer" der Insel. Der Mythos vom bronzenen Riesen, der dreimal täglich die Insel umrundet, ist das mythische Abbild dieses Schutzes.`,
  },
  {
    titel: `Wie ein Ochse pflügt – die Gesetzesinschrift von Gortyn`,
    autor: `Pausanias, Beschreibung Griechenlands 5,17,6`,
    epoche: `2. Jh. n. Chr.`,
    original: ``,
    uebersetzung: `Es ist eine Schrift, die die Griechen »bustrophedon« (ochsenwendig) nennen. Am Ende einer Zeile läuft die nächste von rechts nach links mit verkehrten Buchstaben, so wie sich die Ochsen im Pflügen auf dem Acker umwenden oder die Wagen beim Wagenrennen umkehren.`,
    kommentar: `Der Stadtrechtskodex von Gortyn (Tag 4), in das römische Odeon verbaut, ist die längste erhaltene altgriechische Inschrift: 12 Kolumnen, rund 17.000 Buchstaben in altdorischem Dialekt (5. Jh. v. Chr.). Geregelt werden erstaunlich moderne Themen – Scheidung, Erbrecht, Beleidigung. Pausanias prägte für die zeilenweise wechselnde Schreibrichtung den Begriff βουστροφηδόν.`,
  },
  {
    titel: `Die Belagerung von Chandax – Byzanz erobert Kreta zurück`,
    autor: `Leon Diakonos, Geschichte 1,7C–8A und 2,14B–15A`,
    epoche: `10. Jh. n. Chr.`,
    original: ``,
    uebersetzung: `In kurzer Zeit sind an die vierzigtausend Barbaren umgekommen, sie wurden von den Rhomäern (Byzantinern) regelrecht niedergemetzelt. Diesen glänzenden Sieg krönte unser Feldherr (Nikephoros Phokas) mit einer weiteren Heldentat. Er ordnete nämlich an, den feindlichen Gefallenen die Köpfe abzuschlagen, sie in die Tornister zu stecken und ins Lager zu schaffen. Er versprach einem jeden, der einen Kopf mitbringe, eine Silbermünze als Belohnung. In der Nacht kehrte Nikephoros wieder ins Lager zurück. Als am folgenden Tag die Sonne am Horizont aufging, befahl der Feldherr, einen Teil der abgeschlagenen Barbarenköpfe auf Speere aufzuspießen und diese vor der Palisade nebeneinander aufzupflanzen, die übrigen Köpfe aber mit Wurfmaschinen in die Stadt zu schleudern. Sobald die Kreter erkannten, daß es die Köpfe ihrer Landsleute und Verwandten waren, erfaßte sie Schauder, ihr Verstand wurde wirr. Man hörte Geheul von Männern und Wehklagen der Frauen – doch selbst jetzt wollten sie sich den Rhomäern nicht ergeben. – Im Frühjahr darauf machte Nikephoros Phokas einen erneuten Sturm auf die Stadt. Mitten im Angriff beugte sich ein unzüchtiges, dreistes Weib überaus mutwillig über die Schutzwehr hinaus und sprach mit allerlei Gaukeleien gewisse Zaubersprüche – die Kreter sollen sich nämlich sehr leicht Weissagungen und anderem unfrommem Betrug ergeben –, wobei sie den Feldherrn mit spöttischen Worten überschüttete. Da spannte ein erfahrener Bogenschütze seinen Bogen und schoß einen Pfeil gegen die Frau. Sie stürzte vom Turm und hauchte ihr Seelchen aus. So büßte sie mit diesem gräßlichen Ende ihren Übermut.`,
    kommentar: `Aus dem Reiseheft zu Iraklion (Tag 8): Im 9. Jh. landeten arabische Seeräuber auf Kreta und bauten das Fort Rabd-el-Kandak an der Stelle des heutigen Iraklion. 960/961 belagerte der byzantinische General (und spätere Kaiser) Nikephoros Phokas die Araberstadt – die Wiedereroberung durch Byzanz ging mit unvorstellbaren Grausamkeiten einher. Der byzantinische Historiker Leon Diakonos schildert sie als Augenzeuge seiner Epoche.`,
  },
  {
    titel: `Nächtliche Gassen Iraklions – Kazantzakis erinnert sich`,
    autor: `Nikos Kazantzakis, Rechenschaft vor El Greco 2, 126/138/115/149`,
    epoche: `20. Jh.`,
    original: ``,
    uebersetzung: `Ich lief des nachts in den engen Gassen Iraklions umher, und aus jeder Ecke, aus jedem Winkel sprangen die uralten Erinnerungen hervor. Ich begegnete mir als Kind, das ganz einsam umhergehen und mit den anderen Kindern nicht spielen wollte, dann als Jüngling, der mit den Freunden auf den venezianischen Mauern oberhalb des Meeres spazierenging, in der Abenddämmerung, während eine süße, salzige Brise vom Meer her Jasminduft aus den Gärten der Nachbarschaft herwehte. Und wenn der Mond perlmutten schimmerte, verfiel ich einem tiefen unwiderstehlichen Rausch; mit mir berauschten sich auch Türen und Dachziegel der Häuser – Steine, Bretter, Quellen, Glockentürme legten die Schwere der Körperlichkeit ab und ließen im Lichte des Mondes ihre nackte Seele glänzend leuchten. – Gibt es etwas, wahrer als die Wahrheit? Ja, das Märchen; das gibt der vergänglichen Welt unsterblichen Sinn. – Ich erlebte, ohne mich von der Stelle zu rühren, Odysseus' Taten und Leiden; er war losgefahren auf die große Reise ohne Rückkehr, seine kleine Insel, seine unbedeutende Frau und der gute, wohlgesinnte Sohn genügten ihm nicht mehr; er nahm endgültig Abschied und ging fort, ging über Sparta, raubte Helena, fuhr nach Kreta herab, steckte den verfallenen Palast von Knossos an, fühlte sich auch dort beengt, auch die große herrliche Insel genügte ihm nicht. Er fuhr weiter nach dem Süden …`,
    kommentar: `Aus dem Reiseheft zu Iraklion (Tag 8): In seiner Autobiographie „Rechenschaft vor El Greco" beschwört Kazantzakis die nächtliche Magie seiner Heimatstadt – und macht Odysseus zum ruhelosen Wanderer, der selbst Knossos hinter sich lässt. Sein eigenes Epos „Odissia" (33.333 Verse) setzt genau dort an, wo Homer endet.`,
  },
  {
    titel: `„Ich erhoffe nichts, ich fürchte nichts: ich bin frei."`,
    autor: `Nikos Kazantzakis, Grabinschrift (Iraklion)`,
    epoche: `20. Jh.`,
    original: ``,
    uebersetzung: `Ich erhoffe nichts. Ich fürchte nichts. Ich bin frei.`,
    kommentar: `Auf der Südbastion der venezianischen Stadtmauer von Iraklion liegt das Grab des 1957 gestorbenen kretischen Schriftstellers – Autor von „Alexis Sorbas" (vgl. unsere Musik-Sektion). Die Amtskirche verweigerte dem kirchenkritischen Dichter ein Grab auf dem Friedhof; auf dem Stein steht der von ihm selbst verfasste Grabspruch. Wir kommen am Tag 8 in Heraklion daran vorbei.`,
  },
]

interface LexikonEintrag {
  term: string
  definition: string
}

const architekturLexikon: LexikonEintrag[] = [
  { term: `Megaron`, definition: `Großer Saal des minoischen Palastes – rechteckige Halle mit zentralem Herd und Vorhalle` },
  { term: `Lustral Basin`, definition: `Versenkter, treppenförmiger Raum in minoischen Palästen – Kultbad oder Reinigungsraum` },
  { term: `Polythyron`, definition: `System aus Türnischen mit mehreren Türen – erlaubte flexible Raumabgrenzung im Palast` },
  { term: `Piano nobile`, definition: `Oberes Hauptgeschoss minoischer Paläste mit den repräsentativen Räumen` },
  { term: `Pithoi`, definition: `Große Vorratsgefäße aus Ton – zentrale Elemente der minoischen Palastwirtschaft` },
  { term: `Stoa`, definition: `Griechische Säulenhalle, oft als Marktplatz-Umrahmung – in Aptera gut erhalten` },
]

const kulinarischesLexikon: LexikonEintrag[] = [
  { term: `Mizithra`, definition: `Frischer kretischer Weichkäse aus Schaf- oder Ziegenmolke – unverzichtbar für Dakos` },
  { term: `Anthotiro`, definition: `Milder Frischkäse aus Schaf-/Ziegenmilch – Name bedeutet „Blütenquark"` },
  { term: `Tsikoudia`, definition: `Kretischer Tresterbrand (Raki) – das Nationalgetränk der Insel, zu jeder Gelegenheit gereicht` },
  { term: `Paximadi`, definition: `Doppelt gebackener kretischer Gerstenoder Weizenzwieback – Grundlage des Dakos` },
  { term: `Staka`, definition: `Erhitzte Schafsbutter mit Weizenstärke – kretische Spezialität aus der Innenstätten` },
  { term: `Marathopita`, definition: `Fenchelkuchen – blätterteigartiger Kuchen mit Fenchel und Olivenöl` },
]

// Zeittafel nach der Zeittafel im Kreta-Heft (Teil 1, „Geschichte, Kunst, Kultur im Überblick")
interface ZeitEreignis { datum: string; text: string }
interface ZeitEpoche { epoche: string; zeitraum: string; farbe: string; ereignisse: ZeitEreignis[] }

const zeittafelDaten: ZeitEpoche[] = [
  {
    epoche: `Neolithikum`,
    zeitraum: `6000–2600 v. Chr.`,
    farbe: `#7B6B52`,
    ereignisse: [
      { datum: `ab 6500 v. Chr.`, text: `Spuren erster Besiedlung. Höhlen werden sporadisch bewohnt, Tote im rückwärtigen Teil beigesetzt. In Knossos und Phaistos entstehen erste Häuser aus Bruchstein und Lehm. Werkzeug aus Knochen, Stein und Obsidian (von der Kykladeninsel Milos importiert). Weibliche Fruchtbarkeitsidole.` },
    ],
  },
  {
    epoche: `Vorpalastzeit`,
    zeitraum: `2600–1900 v. Chr.`,
    farbe: `#a9743b`,
    ereignisse: [
      { datum: `ab 2600 v. Chr.`, text: `Entwicklung der Landwirtschaft, engere Beziehungen zur ägäischen Inselwelt, erste Bronzewerkzeuge. Kuppelgräber in der Mesara-Ebene, Siedlungen von Vassiliki und Myrtos bei Ierapetra. Kykladenidole werden importiert, reiche Grabbeigaben und Töpferware.` },
      { datum: `um 2200 v. Chr.`, text: `Erstmals Verwendung der Töpferscheibe. Goldschmiedekunst (Granulationstechnik), Scheibenräder für Ochsenkarren. Siegelsteine, Schmuck und Amulette werden gefertigt.` },
    ],
  },
  {
    epoche: `Zeit der Alten Paläste`,
    zeitraum: `1900–1700 v. Chr.`,
    farbe: `#b8860b`,
    ereignisse: [
      { datum: `ab 1900 v. Chr.`, text: `Konzentration der Macht auf einige Plätze. Größter Palast in Knossos, ferner Phaistos, Malia, Zakros, Archanes und Kydonia (Chania). Mehrstöckige Paläste mit Flügeltüren, Fenstern, Boden- und Wandschmuck sowie großen Magazinen. Minoische Seeherrschaft, Handel mit Ägypten und dem Orient.` },
      { datum: `Kamares-Ware`, text: `Feine Keramik mit hellen Ornamenten auf schwarzem Grund. Starke Bedeutung der Religion (Kultstätten in Palästen, auf Bergen und in Höhlen). Hieroglyphenschrift. Schwere Erdbeben beenden die Alte Palastzeit.` },
    ],
  },
  {
    epoche: `Zeit der Neuen Paläste – „Goldene Zeit"`,
    zeitraum: `1700–1450 v. Chr.`,
    farbe: `#c0392b`,
    ereignisse: [
      { datum: `um 1700 v. Chr.`, text: `Erneuerung der Kultur auf höherem Niveau – die Blütezeit der minoischen Hochkultur. Prächtige Palastanlagen mit Lichtschächten und Abwasserleitung. Große Städte, mehrstöckige Herrenhäuser mit Fresken. Bedeutender Seehandel, Handelsniederlassungen in Afrika, Kleinasien und auf den ägäischen Inseln.` },
    ],
  },
  {
    epoche: `Nachpalastzeit`,
    zeitraum: `1450–1100 v. Chr.`,
    farbe: `#8e6f3e`,
    ereignisse: [
      { datum: `um 1450 v. Chr.`, text: `Eine Katastrophe beendet die Blütezeit der minoischen Kultur: Paläste, Herrenhäuser und Städte werden zerstört; nur der Palast von Knossos bleibt teilweise erhalten.` },
      { datum: `ab 1450 v. Chr.`, text: `Achäer (Mykener) übernehmen die Macht, mit Königssitz in Knossos. Einführung der Linear-B-Schrift (frühes Griechisch, 1953 entziffert). Blüte des Flora- und Meeresstils in der Töpferei.` },
      { datum: `um 1380 v. Chr.`, text: `Schwere Erdbeben und Feuer zerstören den Palast von Knossos endgültig. Bauten im mykenischen „Megaronstil" in Agia Triada und Tylissos. Kultidole mit erhobenen Armen.` },
      { datum: `ab 1200 v. Chr.`, text: `Im gesamten Mittelmeerraum Unruhen und Zerstörungen – Ende der minoisch-mykenischen Hochkultur auf Kreta.` },
    ],
  },
  {
    epoche: `Protogeometrische Zeit`,
    zeitraum: `1100–900 v. Chr.`,
    farbe: `#6b7280`,
    ereignisse: [
      { datum: `ab 1100 v. Chr.`, text: `Neue Einwanderer, vorwiegend dorische Griechen. Die alteingesessene Bevölkerung wird unterworfen oder zieht sich in die Berge zurück (die „Eteokreter", die wahren Kreter). Verehrung der Vegetationsgöttin und lokaler Kulte (Diktynna, Britomartis). Eisen für Waffen und Schmuck.` },
    ],
  },
  {
    epoche: `Zeit der griechischen Stadtstaaten`,
    zeitraum: `900–67 v. Chr.`,
    farbe: `#2C6E9E`,
    ereignisse: [
      { datum: `ab 900 v. Chr.`, text: `Dorische Stadtstaaten, nach dem Vorbild Spartas organisiert und kriegerisch geprägt. Handel mit Ägypten und dem Vorderen Orient.` },
      { datum: `um 650 v. Chr.`, text: `Unter dem Einfluss Ägyptens entsteht der „dädalische" Stil in Reliefs und Plastiken (Reiterfries aus Prinias). Frühe griechische Rechtsprechung: der berühmte Gesetzestext von Gortys.` },
      { datum: `ab 500 v. Chr.`, text: `Kreta bleibt gegenüber dem übrigen Griechenland zurück, profitiert aber weiter vom Handel; die Kunst übernimmt den Stil des Festlands.` },
      { datum: `ab 200 v. Chr.`, text: `Von Kreta aus operieren Seeräuber und stören zunehmend die Interessen Roms.` },
    ],
  },
  {
    epoche: `Römische, byzantinische & arabische Herrschaft`,
    zeitraum: `67 v. Chr. – 1204 n. Chr.`,
    farbe: `#8B1A1A`,
    ereignisse: [
      { datum: `67 v. Chr.`, text: `Der römische Konsul Quintus Caecilius Metellus unterwirft Kreta nach dreijährigem Kampf und erhält den Ehrennamen „Creticus". Die Stadtstaaten werden aufgelöst, Hauptstadt der Provinz Creta et Cyrenaica wird Gortys. Großzügiger Ausbau der Städte (Tempel, Odeon, Theater, Bäder); ca. 300 000 Einwohner.` },
      { datum: `58 n. Chr.`, text: `Auf der Reise nach Rom setzt der Apostel Paulus seinen Mitarbeiter Titus als ersten Bischof Kretas ein.` },
      { datum: `824`, text: `Aus Spanien vertriebene sarazenische Araber unter Abu Hafs landen an der Südküste; die Städte werden zerstört, die Festung Chandak (heute Iraklion) errichtet.` },
      { datum: `960`, text: `Der byzantinische Feldherr und spätere Kaiser Nikephoros Phokas erobert die Insel zurück.` },
      { datum: `961–1204`, text: `Kreta gehört wieder zum Byzantinischen Reich. Religiöse Neuordnung, Verlegung der Bischofssitze; Missionare wie Joannis o Xenos gründen Klöster.` },
    ],
  },
  {
    epoche: `Venezianische Herrschaft`,
    zeitraum: `1204–1669`,
    farbe: `#1f7a6b`,
    ereignisse: [
      { datum: `1204`, text: `Nach dem Vierten Kreuzzug gelangt Kreta an Venedig. Kaiser Nikephoros siedelt später Veteranen an; die einzelnen Kastelle werden mit dem Markuslöwen geschmückt.` },
      { datum: `1239`, text: `Bau der katholischen Markus-Basilika in Iraklion, dazu San Francesco und San Nikolaos in Chania. Die orthodoxen Bischöfe müssen weichen, Land geht an venezianische Adelige – in den folgenden Jahrhunderten 14 große Aufstände (1283–99 unter Alexios Kallergis).` },
      { datum: `1299`, text: `Friedensvertrag „Pax Calergii": Steuererleichterungen; die Kreter verteidigen ihre griechische Sprache und den orthodoxen Glauben.` },
      { datum: `1453`, text: `Konstantinopel fällt an die Osmanen. Viele griechische Flüchtlinge kommen nach Kreta und geben Impulse für die „kretische Renaissance", die byzantinische und venezianische Elemente vereint.` },
      { datum: `16.–17. Jh.`, text: `Iraklion wird Zentrum der kretischen Renaissance. Ikonenmaler wie Michael Damaskinos, Georgios Klontzas und die Maler der „kretischen Schule". 1541 wird der Maler El Greco (Domenico Theotokopoulos) in Fodele bei Iraklion geboren.` },
    ],
  },
  {
    epoche: `Türkische Besatzungszeit`,
    zeitraum: `1645–1898`,
    farbe: `#6d3b8f`,
    ereignisse: [
      { datum: `1644–1645`, text: `Ausbruch des fünften venezianisch-türkischen Krieges. Chania fällt an die Türken, kurz darauf der größte Teil Kretas.` },
      { datum: `1669`, text: `Iraklion kapituliert nach dreijähriger Endbelagerung (insgesamt 21 Jahre). Das Land ist verwüstet, die Bevölkerung von 287 000 auf rund 134 000 Einwohner dezimiert.` },
      { datum: `1770`, text: `Aufstand des Ioannis Daskalogiannis in Sfakia gegen die osmanische Herrschaft.` },
      { datum: `1821–1830`, text: `Griechischer Befreiungskrieg; trotz kretischer Beteiligung bleibt die Insel osmanisch.` },
      { datum: `1866–1868`, text: `Der „Große kretische Aufstand", Höhepunkt ist die Selbstsprengung des Klosters Moni Arkadi. Der Vertrag von Chalepa bringt Zugeständnisse (u. a. Zulassung der griechischen Sprache vor Gericht).` },
      { datum: `1883`, text: `Nikos Kazantzakis, der bedeutendste Dichter Kretas, wird in Iraklion geboren (Tod 1957).` },
      { datum: `1898`, text: `Nach einem erneuten Aufstand landen internationale Truppen der Großmächte; das Ende der türkischen Herrschaft. Kreta wird autonomer Staat unter Oberhoheit des Sultans.` },
    ],
  },
  {
    epoche: `Kreta im 20. / 21. Jahrhundert`,
    zeitraum: `ab 1898`,
    farbe: `#34495e`,
    ereignisse: [
      { datum: `1898`, text: `Prinz Georg wird Hochkommissar. Die Kreter wünschen die Vereinigung (Enosis) mit Griechenland.` },
      { datum: `1900`, text: `Sir Arthur Evans beginnt mit der Ausgrabung von Knossos – die minoische Kultur wird wiederentdeckt.` },
      { datum: `1905`, text: `Erste Unruhen unter Führung von Eleftherios Venizelos, dem Anwalt aus Chania.` },
      { datum: `1913`, text: `Kreta wird mit Griechenland vereinigt; im Dezember wird die griechische Fahne auf der Festung Firka in Chania gehisst.` },
      { datum: `1923`, text: `Nach dem griechisch-türkischen Krieg großer Bevölkerungsaustausch: Griechen aus Kleinasien kommen nach Kreta, die verbliebenen Türken verlassen die Insel.` },
      { datum: `1926`, text: `Schweres Erdbeben in Iraklion; beim Wiederaufbau von Knossos werden die bekannten Betonrekonstruktionen errichtet.` },
      { datum: `20.–30. Mai 1941`, text: `Invasion deutscher Luftlandetruppen – die Luftlandeschlacht um Kreta.` },
      { datum: `1941–1945`, text: `Deutsche Besatzung. Heftiger Widerstandskampf der Kreter, viele Opfer unter der Zivilbevölkerung durch Vergeltungsmaßnahmen.` },
      { datum: `1962`, text: `Nikolaos Platon beginnt die Ausgrabungen des Palastes von Kato Zakros.` },
      { datum: `1967–1974`, text: `Militärdiktatur der „Obristen" in Griechenland; auch Kreter wie der Komponist Mikis Theodorakis leiden darunter.` },
      { datum: `ab 1970`, text: `Verstärkt einsetzender Tourismus, zunächst an der Nordküste östlich von Iraklion und am Golf von Mirabello.` },
      { datum: `1972`, text: `Gründung der Universität Kreta; Iraklion wird Hauptstadt der Insel.` },
      { datum: `1981`, text: `Griechenland wird EG-Mitglied.` },
      { datum: `2001`, text: `Griechenland wird Mitglied der Eurozone.` },
    ],
  },
]

interface GlossarEintrag {
  deutsch: string
  griechisch: string
  aussprache: string
}

interface GlossarKategorie {
  name: string
  eintraege: GlossarEintrag[]
}

// Sprachführer aus dem Kreta-Heft (Teil 3), Deutsch ↔ Neugriechisch
const glossarKategorien: GlossarKategorie[] = [
  {
    name: `Das Wichtigste`,
    eintraege: [
      { deutsch: `Ja / Nein`, griechisch: `Ναι / Όχι`, aussprache: `ne / óchi` },
      { deutsch: `Bitte`, griechisch: `Παρακαλώ`, aussprache: `parakaló` },
      { deutsch: `Danke`, griechisch: `Ευχαριστώ`, aussprache: `efcharistó` },
      { deutsch: `Entschuldigung!`, griechisch: `Συγγνώμη`, aussprache: `sighnómi` },
      { deutsch: `Wie bitte?`, griechisch: `Ορίστε;`, aussprache: `oríste` },
      { deutsch: `Ich verstehe Sie nicht.`, griechisch: `Δεν σας καταλαβαίνω.`, aussprache: `den sas katalavéno` },
      { deutsch: `Können Sie mir helfen?`, griechisch: `Μπορείτε να με βοηθήσετε;`, aussprache: `boríte na me voithísete` },
      { deutsch: `Ich möchte …`, griechisch: `Θέλω …`, aussprache: `thélo` },
      { deutsch: `Haben Sie …?`, griechisch: `Έχετε …;`, aussprache: `échete` },
      { deutsch: `Wie viel kostet das?`, griechisch: `Πόσο κοστίζει;`, aussprache: `póso kostízi` },
      { deutsch: `Wie viel Uhr ist es?`, griechisch: `Τι ώρα είναι;`, aussprache: `ti óra íne` },
      { deutsch: `Guten Morgen / Guten Tag`, griechisch: `Καλημέρα`, aussprache: `kaliméra` },
      { deutsch: `Guten Abend`, griechisch: `Καλησπέρα`, aussprache: `kalispéra` },
      { deutsch: `Gute Nacht`, griechisch: `Καληνύχτα`, aussprache: `kaliníchta` },
      { deutsch: `Hallo! / Tschüs!`, griechisch: `Γεια σου`, aussprache: `ya su` },
      { deutsch: `Auf Wiedersehen`, griechisch: `Αντίο`, aussprache: `adío` },
      { deutsch: `Wie geht es Ihnen?`, griechisch: `Πώς είστε;`, aussprache: `pos íste` },
      { deutsch: `Mein Name ist …`, griechisch: `Το όνομά μου είναι …`, aussprache: `to ónomá mu íne` },
      { deutsch: `gestern / heute / morgen`, griechisch: `χθες / σήμερα / αύριο`, aussprache: `chthes / símera / ávrio` },
      { deutsch: `morgens / mittags / abends`, griechisch: `το πρωί / το μεσημέρι / το βράδυ`, aussprache: `to proí / to mesiméri / to vrádi` },
      { deutsch: `Prost! / Zum Wohl!`, griechisch: `Στην υγειά μας!`, aussprache: `stin iyá mas` },
      { deutsch: `Guten Appetit!`, griechisch: `Καλή όρεξη!`, aussprache: `kalí órexi` },
      { deutsch: `Immer mit der Ruhe.`, griechisch: `Σιγά σιγά.`, aussprache: `sigá sigá` },
      { deutsch: `Wer? / Was? / Wann?`, griechisch: `Ποιος; / Τι; / Πότε;`, aussprache: `pjos / ti / póte` },
      { deutsch: `Warum? / Wie?`, griechisch: `Γιατί; / Πώς;`, aussprache: `jatí / pos` },
      { deutsch: `offen / geschlossen`, griechisch: `ανοιχτό / κλειστό`, aussprache: `anichtó / klistó` },
    ],
  },
  {
    name: `Notfall`,
    eintraege: [
      { deutsch: `Hilfe!`, griechisch: `Βοήθεια!`, aussprache: `voíthia` },
      { deutsch: `Vorsicht!`, griechisch: `Προσοχή!`, aussprache: `prosochí` },
      { deutsch: `Können Sie mir bitte helfen?`, griechisch: `Μπορείτε να με βοηθήσετε, παρακαλώ;`, aussprache: `boríte na me voithísete, parakaló` },
      { deutsch: `Sprechen Sie Deutsch / Englisch?`, griechisch: `Μιλάτε γερμανικά / αγγλικά;`, aussprache: `miláte jermaniká / angliká` },
      { deutsch: `Ich verstehe nicht.`, griechisch: `Δεν καταλαβαίνω.`, aussprache: `den katalavéno` },
      { deutsch: `Rufen Sie bitte einen Arzt!`, griechisch: `Καλέστε έναν γιατρό, παρακαλώ!`, aussprache: `kaléste énan jatró, parakaló` },
      { deutsch: `der Arzt`, griechisch: `ο γιατρός`, aussprache: `o jatrós` },
      { deutsch: `das Krankenhaus`, griechisch: `το νοσοκομείο`, aussprache: `to nosokomío` },
      { deutsch: `der Krankenwagen`, griechisch: `το ασθενοφόρο`, aussprache: `to asthenofóro` },
      { deutsch: `Kann ich Ihr Telefon benutzen?`, griechisch: `Μπορώ να χρησιμοποιήσω το τηλέφωνό σας;`, aussprache: `boró na chrisimopiíso to tiléfonó sas` },
    ],
  },
  {
    name: `Wochentage`,
    eintraege: [
      { deutsch: `Montag`, griechisch: `Δευτέρα`, aussprache: `deftéra` },
      { deutsch: `Dienstag`, griechisch: `Τρίτη`, aussprache: `tríti` },
      { deutsch: `Mittwoch`, griechisch: `Τετάρτη`, aussprache: `tetárti` },
      { deutsch: `Donnerstag`, griechisch: `Πέμπτη`, aussprache: `pémpti` },
      { deutsch: `Freitag`, griechisch: `Παρασκευή`, aussprache: `paraskeví` },
      { deutsch: `Samstag`, griechisch: `Σάββατο`, aussprache: `sávato` },
      { deutsch: `Sonntag`, griechisch: `Κυριακή`, aussprache: `kiriakí` },
    ],
  },
  {
    name: `Monate`,
    eintraege: [
      { deutsch: `Januar`, griechisch: `Ιανουάριος`, aussprache: `ianuários` },
      { deutsch: `Februar`, griechisch: `Φεβρουάριος`, aussprache: `fevruários` },
      { deutsch: `März`, griechisch: `Μάρτιος`, aussprache: `mártios` },
      { deutsch: `April`, griechisch: `Απρίλιος`, aussprache: `aprílios` },
      { deutsch: `Mai`, griechisch: `Μάιος`, aussprache: `máios` },
      { deutsch: `Juni`, griechisch: `Ιούνιος`, aussprache: `iúnios` },
      { deutsch: `Juli`, griechisch: `Ιούλιος`, aussprache: `iúlios` },
      { deutsch: `August`, griechisch: `Αύγουστος`, aussprache: `ávgustos` },
      { deutsch: `September`, griechisch: `Σεπτέμβριος`, aussprache: `septémvrios` },
      { deutsch: `Oktober`, griechisch: `Οκτώβριος`, aussprache: `októvrios` },
      { deutsch: `November`, griechisch: `Νοέμβριος`, aussprache: `noémvrios` },
      { deutsch: `Dezember`, griechisch: `Δεκέμβριος`, aussprache: `dekémvrios` },
    ],
  },
  {
    name: `Zahlen`,
    eintraege: [
      { deutsch: `1`, griechisch: `ένα`, aussprache: `éna` },
      { deutsch: `2`, griechisch: `δύο`, aussprache: `dío` },
      { deutsch: `3`, griechisch: `τρία`, aussprache: `tría` },
      { deutsch: `4`, griechisch: `τέσσερα`, aussprache: `téssera` },
      { deutsch: `5`, griechisch: `πέντε`, aussprache: `pénde` },
      { deutsch: `6`, griechisch: `έξι`, aussprache: `éxi` },
      { deutsch: `7`, griechisch: `εφτά`, aussprache: `eftá` },
      { deutsch: `8`, griechisch: `οχτώ`, aussprache: `ochtó` },
      { deutsch: `9`, griechisch: `εννέα`, aussprache: `enéa` },
      { deutsch: `10`, griechisch: `δέκα`, aussprache: `déka` },
      { deutsch: `11`, griechisch: `έντεκα`, aussprache: `éndeka` },
      { deutsch: `12`, griechisch: `δώδεκα`, aussprache: `dódeka` },
      { deutsch: `13`, griechisch: `δεκατρία`, aussprache: `dekatría` },
      { deutsch: `14`, griechisch: `δεκατέσσερα`, aussprache: `dekatéssera` },
      { deutsch: `15`, griechisch: `δεκαπέντε`, aussprache: `dekapénde` },
      { deutsch: `20`, griechisch: `είκοσι`, aussprache: `íkosi` },
      { deutsch: `30`, griechisch: `τριάντα`, aussprache: `triánda` },
      { deutsch: `40`, griechisch: `σαράντα`, aussprache: `saránda` },
      { deutsch: `50`, griechisch: `πενήντα`, aussprache: `penínda` },
      { deutsch: `60`, griechisch: `εξήντα`, aussprache: `exínda` },
      { deutsch: `70`, griechisch: `εβδομήντα`, aussprache: `evdomínda` },
      { deutsch: `80`, griechisch: `ογδόντα`, aussprache: `ogdónda` },
      { deutsch: `90`, griechisch: `ενενήντα`, aussprache: `enenínda` },
      { deutsch: `100`, griechisch: `εκατό`, aussprache: `ekató` },
      { deutsch: `200`, griechisch: `διακόσια`, aussprache: `diakósia` },
      { deutsch: `500`, griechisch: `πεντακόσια`, aussprache: `pendakósia` },
      { deutsch: `1000`, griechisch: `χίλια`, aussprache: `chília` },
    ],
  },
  {
    name: `Unterwegs`,
    eintraege: [
      { deutsch: `Nord / Süd`, griechisch: `Βορράς / Νότος`, aussprache: `vorás / nótos` },
      { deutsch: `West / Ost`, griechisch: `Δύση / Ανατολή`, aussprache: `dísi / anatolí` },
      { deutsch: `geradeaus`, griechisch: `ευθεία`, aussprache: `efthía` },
      { deutsch: `links / rechts`, griechisch: `αριστερά / δεξιά`, aussprache: `aristerá / dexiá` },
      { deutsch: `nah / weit`, griechisch: `κοντά / μακριά`, aussprache: `kondá / makriá` },
      { deutsch: `Wo ist …?`, griechisch: `Πού είναι …;`, aussprache: `pu íne` },
      { deutsch: `Bank`, griechisch: `τράπεζα`, aussprache: `trápeza` },
      { deutsch: `Post`, griechisch: `ταχυδρομείο`, aussprache: `tachidromío` },
      { deutsch: `Polizei`, griechisch: `αστυνομία`, aussprache: `astinomía` },
      { deutsch: `Flughafen`, griechisch: `αεροδρόμιο`, aussprache: `aerodrómio` },
      { deutsch: `Hafen`, griechisch: `λιμάνι`, aussprache: `limáni` },
      { deutsch: `Markt`, griechisch: `αγορά`, aussprache: `agorá` },
      { deutsch: `Bus`, griechisch: `λεωφορείο`, aussprache: `leoforío` },
      { deutsch: `Wie weit ist es?`, griechisch: `Πόσο μακριά είναι;`, aussprache: `póso makriá íne` },
      { deutsch: `der Strand`, griechisch: `η παραλία`, aussprache: `i paralía` },
      { deutsch: `das Meer`, griechisch: `η θάλασσα`, aussprache: `i thálassa` },
      { deutsch: `die Kirche`, griechisch: `η εκκλησία`, aussprache: `i eklisía` },
      { deutsch: `die Bushaltestelle`, griechisch: `η στάση`, aussprache: `i stási` },
      { deutsch: `die Toilette`, griechisch: `η τουαλέτα`, aussprache: `i tualéta` },
      { deutsch: `das Telefon`, griechisch: `το τηλέφωνο`, aussprache: `to tiléfono` },
    ],
  },
  {
    name: `Im Hotel`,
    eintraege: [
      { deutsch: `Hotel`, griechisch: `ξενοδοχείο`, aussprache: `xenodochío` },
      { deutsch: `Einzelzimmer`, griechisch: `μονόκλινο δωμάτιο`, aussprache: `monóklino domátio` },
      { deutsch: `Doppelzimmer`, griechisch: `δίκλινο δωμάτιο`, aussprache: `díklino domátio` },
      { deutsch: `mit Bad`, griechisch: `με μπάνιο`, aussprache: `me bánio` },
      { deutsch: `für eine Nacht`, griechisch: `για μία νύχτα`, aussprache: `ya mía níchta` },
      { deutsch: `Schlüssel`, griechisch: `κλειδί`, aussprache: `klidí` },
    ],
  },
  {
    name: `Essen & Trinken`,
    eintraege: [
      { deutsch: `Speisekarte`, griechisch: `κατάλογος`, aussprache: `katálogos` },
      { deutsch: `Die Rechnung, bitte`, griechisch: `Τον λογαριασμό, παρακαλώ`, aussprache: `ton logariasmó parakaló` },
      { deutsch: `Wasser`, griechisch: `νερό`, aussprache: `neró` },
      { deutsch: `Wein`, griechisch: `κρασί`, aussprache: `krasí` },
      { deutsch: `Bier`, griechisch: `μπύρα`, aussprache: `bíra` },
      { deutsch: `Kaffee`, griechisch: `καφές`, aussprache: `kafés` },
      { deutsch: `Brot`, griechisch: `ψωμί`, aussprache: `psomí` },
      { deutsch: `Fisch`, griechisch: `ψάρι`, aussprache: `psári` },
      { deutsch: `Fleisch`, griechisch: `κρέας`, aussprache: `kréas` },
      { deutsch: `Gemüse`, griechisch: `λαχανικά`, aussprache: `lachaniká` },
      { deutsch: `Salz / Pfeffer`, griechisch: `αλάτι / πιπέρι`, aussprache: `aláti / pipéri` },
      { deutsch: `Zucker`, griechisch: `ζάχαρη`, aussprache: `záchari` },
      { deutsch: `gegrillt`, griechisch: `στη σχάρα`, aussprache: `sti schára` },
      { deutsch: `Einen Tisch für zwei Personen, bitte.`, griechisch: `Ένα τραπέζι για δύο άτομα, παρακαλώ.`, aussprache: `éna trapézi ja dío átoma, parakaló` },
      { deutsch: `Können wir draußen sitzen?`, griechisch: `Μπορούμε να καθίσουμε έξω;`, aussprache: `boroúme na kathísume éxo` },
      { deutsch: `Vorspeisen`, griechisch: `ορεκτικά`, aussprache: `orektiká` },
      { deutsch: `Suppe`, griechisch: `σούπα`, aussprache: `soúpa` },
      { deutsch: `Huhn`, griechisch: `κοτόπουλο`, aussprache: `kotópulo` },
      { deutsch: `Kartoffeln`, griechisch: `πατάτες`, aussprache: `patátes` },
      { deutsch: `Tomaten`, griechisch: `ντομάτες`, aussprache: `domátes` },
      { deutsch: `Oliven / Olivenöl`, griechisch: `ελιές / ελαιόλαδο`, aussprache: `eliés / eleólado` },
      { deutsch: `Zitrone / Orange`, griechisch: `λεμόνι / πορτοκάλι`, aussprache: `lemóni / portokáli` },
      { deutsch: `Milch`, griechisch: `γάλα`, aussprache: `gála` },
      { deutsch: `Tee`, griechisch: `τσάι`, aussprache: `tsái` },
      { deutsch: `Weißwein / Rotwein`, griechisch: `άσπρο / κόκκινο κρασί`, aussprache: `áspro / kókkino krasí` },
      { deutsch: `Eis`, griechisch: `παγωτό`, aussprache: `pagotó` },
      { deutsch: `Joghurt`, griechisch: `γιαούρτι`, aussprache: `jaúrti` },
      { deutsch: `scharf`, griechisch: `πικάντικο`, aussprache: `pikándiko` },
    ],
  },
  {
    name: `Speisekarte`,
    eintraege: [
      { deutsch: `Ei-Zitronen-Suppe`, griechisch: `αυγολέμονο`, aussprache: `avgolémono` },
      { deutsch: `gefüllte Weinblätter`, griechisch: `ντολμάδες`, aussprache: `dolmádes` },
      { deutsch: `Fischrogencreme`, griechisch: `ταραμοσαλάτα`, aussprache: `taramosaláta` },
      { deutsch: `Frikadellen`, griechisch: `κεφτέδες`, aussprache: `keftédes` },
      { deutsch: `Fleischspieß`, griechisch: `σουβλάκι`, aussprache: `suvláki` },
      { deutsch: `Lammkoteletts`, griechisch: `παϊδάκια`, aussprache: `paidákia` },
      { deutsch: `Lamm aus dem Ofen`, griechisch: `κλέφτικο`, aussprache: `kléftiko` },
      { deutsch: `Auflauf mit Hackfleisch`, griechisch: `μουσακάς`, aussprache: `musakás` },
      { deutsch: `Rindfleisch in Zwiebel-Tomaten-Soße`, griechisch: `στιφάδο`, aussprache: `stifádo` },
      { deutsch: `Schafskäse`, griechisch: `φέτα`, aussprache: `féta` },
      { deutsch: `Wildgemüse`, griechisch: `χόρτα`, aussprache: `chórta` },
      { deutsch: `Gebäck mit Honig und Nüssen`, griechisch: `μπακλαβάς`, aussprache: `baklavás` },
    ],
  },
]

// ─── PERSÖNLICHKEITEN (aus Kreta-Heft 2018, Teil 1) ─────────────────────────

interface PersonData {
  name: string
  lebensdaten: string
  kategorie: string
  herkunft: string
  farbe: string
  kreta: string
  beschreibung: string
  bild: string
}

const personenDaten: PersonData[] = [
  {
    name: `Epimenides`,
    lebensdaten: `7./6. Jh. v. Chr.`,
    kategorie: `Seher & Dichter`,
    herkunft: `Knossos (Kreta)`,
    farbe: `#6b5b3e`,
    kreta: `Der Legende nach schlief er 57 Jahre in der Höhle des diktäischen Zeus (Tag 1) und erwachte mit der Gabe der Weissagung.`,
    beschreibung: `Halblegendärer kretischer Seher, Dichter und Philosoph, der zu den „Sieben Weisen" gezählt wurde. Um 596 v. Chr. soll er Athen von einer Pest entsühnt haben. Berühmt ist das nach ihm benannte „Epimenides-Paradox": Sein Ausspruch „Alle Kreter sind Lügner" – als Kreter gesagt – beschäftigt die Logik bis heute und wird sogar im neutestamentlichen Titusbrief (1,12) zitiert.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/c/cd/Epimenides-poet.jpg`,
  },
  {
    name: `Michael Damaskinos`,
    lebensdaten: `um 1535–1593`,
    kategorie: `Ikonenmaler`,
    herkunft: `Iraklion (Kreta)`,
    farbe: `#a0761b`,
    kreta: `Bekanntester Meister der „kretischen Schule" der Ikonenmalerei; sechs seiner Hauptwerke hängen in der Kirche Agia Ekaterini in Iraklion (Tag 8).`,
    beschreibung: `Der bedeutendste Ikonenmaler der kretischen Renaissance. Er verband die strenge byzantinische Maltradition mit Elementen der venezianischen Malerei – Licht, Schatten und räumliche Tiefe. Mehrere Jahre arbeitete er in Venedig für die griechische Gemeinde. Möglicherweise war der junge Domenikos Theotokopoulos (El Greco) sein Schüler.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Michael_Damaskinos_The_Last_Supper.png/500px-Michael_Damaskinos_The_Last_Supper.png`,
  },
  {
    name: `El Greco (Domenikos Theotokopoulos)`,
    lebensdaten: `1541–1614`,
    kategorie: `Maler`,
    herkunft: `Iraklion (Kreta)`,
    farbe: `#8b4a1a`,
    kreta: `In Iraklion geboren und als Ikonenmaler ausgebildet; ein ihm zugeschriebenes Frühwerk hängt im Historischen Museum von Iraklion (Tag 8).`,
    beschreibung: `Berühmter spanischer Maler kretischer Herkunft. Aufgewachsen in einem venezianisch-griechischen Milieu, erhielt er seine erste Ausbildung als Ikonenmaler, möglicherweise beim Meister Michael Damaskenos. Ab 1568 in Venedig (im Umkreis Tizians und Tintorettos), ab 1570 in Rom, ab 1577 in Toledo. Seine Gemälde signierte er zeitlebens mit seinem griechischen Namen in griechischen Lettern. Stark überlängte Figuren und eine dramatische, fast abstrakte Farbgebung lassen seine Bilder ekstatisch und visionär erscheinen.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/El_Greco_-_Portrait_of_a_Man_-_WGA10554.jpg/500px-El_Greco_-_Portrait_of_a_Man_-_WGA10554.jpg`,
  },
  {
    name: `Vitsentzos Kornaros`,
    lebensdaten: `1553–1613/14`,
    kategorie: `Dichter`,
    herkunft: `Trapezonda bei Sitia (Kreta)`,
    farbe: `#4a6b1a`,
    kreta: `Bei Sitia (Tag 2) geboren – dort erinnert ein Denkmal an den Dichter des kretischen Nationalepos.`,
    beschreibung: `Der große Dichter der kretischen Renaissance. Sein Versroman „Erotokritos" (rund 10 000 gereimte Fünfzehnsilber im kretischen Dialekt) erzählt die Liebesgeschichte von Erotokritos und Aretousa und gilt als Nationalepos Kretas. Verse daraus werden bis heute zu den Klängen der Lyra gesungen. Ihm zugeschrieben wird auch das geistliche Drama „Die Opferung Abrahams".`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/8/84/Thysia_tou_Abraam_exwfyllo.jpg`,
  },
  {
    name: `Ioannis Daskalogiannis`,
    lebensdaten: `um 1730–1771`,
    kategorie: `Freiheitskämpfer`,
    herkunft: `Anopoli, Sfakia (Kreta)`,
    farbe: `#8b1a1a`,
    kreta: `Führte 1770 den ersten großen kretischen Aufstand gegen die Osmanen; der Flughafen von Chania (Tag 7) trägt heute seinen Namen.`,
    beschreibung: `Wohlhabender Reeder aus dem unbeugsamen Bergland der Sfakia. 1770 erhob er sich – im Vertrauen auf russische Unterstützung, die ausblieb – mit etwa 2 000 Kämpfern gegen die osmanische Herrschaft. Der Aufstand wurde niedergeschlagen; um sein Volk zu schonen, stellte er sich den Osmanen und wurde in Iraklion grausam hingerichtet. Er gilt als erster Märtyrer des kretischen Freiheitskampfes.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/0/09/Daskalogiannis.jpg`,
  },
  {
    name: `Sir Arthur Evans`,
    lebensdaten: `1851–1941`,
    kategorie: `Archäologe`,
    herkunft: `Nash Mills (England)`,
    farbe: `#444b54`,
    kreta: `Ausgräber von Knossos (Tag 5) – seine Freilegung ab 1900 bedeutete die Wiederentdeckung der minoischen Kultur, die er nach König Minos benannte.`,
    beschreibung: `Britischer Archäologe. Zunächst Korrespondent des Manchester Guardian auf dem Balkan, wurde er 1881 wegen seines Engagements für lokale Freiheitsbestrebungen ausgewiesen. Als Direktor des Ashmolean Museum in Oxford stieß er auf Siegelsteine mit unbekannter Schrift, die ihn nach Kreta führten. Ab 1900 grub er den Palast von Knossos aus und publizierte ihn in einem monumentalen Werk (1922–35). 1911 wurde er geadelt. (Seine Rekonstruktionen in Beton sind bis heute umstritten.)`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Arthur_Evans_in_1939.jpg/500px-Arthur_Evans_in_1939.jpg`,
  },
  {
    name: `Eleftherios Venizelos`,
    lebensdaten: `1864–1936`,
    kategorie: `Staatsmann`,
    herkunft: `Mournies bei Chania (Kreta)`,
    farbe: `#7a1f3d`,
    kreta: `Aus Mournies bei Chania (Tag 7); ihm verdankt Kreta den Anschluss an Griechenland 1913 (Enosis). Der Flughafen Athens trägt seinen Namen.`,
    beschreibung: `Der bedeutendste griechische Staatsmann der Moderne. Seine Politik zielte auf die Vereinigung aller Griechen in einem Staat („Megali Idea"). Als Justizminister leitete er 1905 den Aufstand der „Therisso-Revolte". 1910 wurde er Begründer und Führer der Liberalen Partei und mehrfach griechischer Premierminister. In den Londoner Verträgen 1913 wurde Kreta dem griechischen Staatsverband einverleibt.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Eleftherios_Venizelos_1917.jpg/500px-Eleftherios_Venizelos_1917.jpg`,
  },
  {
    name: `Nikos Kazantzakis`,
    lebensdaten: `1883–1957`,
    kategorie: `Schriftsteller & Philosoph`,
    herkunft: `Iraklion (Kreta)`,
    farbe: `#1a6b9e`,
    kreta: `Der berühmteste Sohn Iraklions – sein Grab liegt auf der venezianischen Stadtmauer (Tag 8), mit der Grabinschrift „Ich erhoffe nichts, ich fürchte nichts: ich bin frei."`,
    beschreibung: `Zählt zu den berühmtesten Dichtern des modernen Griechenland. Nach juristischem Examen in Athen studierte er in Paris bei Henri Bergson Philosophie. Er verfasste Romane, Dramen, Gedichte, Reiseberichte und übersetzte Homer, Dante und Goethes „Faust" ins Neugriechische. Weltbekannt wurde er durch „Alexis Sorbas" (1946, verfilmt 1952 mit Anthony Quinn). Weitere Werke: „Freiheit oder Tod", „Griechische Passion", „Die letzte Versuchung".`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Nikos_Kazantzakis_1904.jpg/500px-Nikos_Kazantzakis_1904.jpg`,
  },
  {
    name: `Pandelis Prevelakis`,
    lebensdaten: `1909–1986`,
    kategorie: `Schriftsteller`,
    herkunft: `Rethymnon (Kreta)`,
    farbe: `#54466b`,
    kreta: `In Rethymnon (Tag 6) geboren – seine „Chronik einer Stadt" (1938) ist eine poetische Liebeserklärung an seine Heimatstadt.`,
    beschreibung: `Schriftsteller, Dichter und Kunsthistoriker, enger Freund und Biograph von Nikos Kazantzakis. Sein bekanntestes Werk, die „Chronik einer Stadt", schildert das alte Rethymnon zwischen venezianischem Erbe und türkischer Vergangenheit. Daneben schuf er die Romantrilogie „Der Kreter" über den Freiheitskampf der Insel und lehrte Kunstgeschichte an der Akademie der Schönen Künste in Athen.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Fotis_kontoglou%2C_rotratto_di_pantelis_prevelakis%2C_1938-39.jpg/500px-Fotis_kontoglou%2C_rotratto_di_pantelis_prevelakis%2C_1938-39.jpg`,
  },
  {
    name: `Odysseas Elytis`,
    lebensdaten: `1911–1996`,
    kategorie: `Dichter · Nobelpreisträger`,
    herkunft: `Iraklion (Kreta)`,
    farbe: `#2d6b4a`,
    kreta: `Der aus Iraklion gebürtige Dichter – wie Theodorakis im Widerstand gegen die Obristendiktatur engagiert.`,
    beschreibung: `Einer der Hauptvertreter der modernen griechischen Lyrik. 1979 erhielt er den Literaturnobelpreis für „seine Poesie, die mit sinnlicher Vitalität und intellektuellem Scharfblick den Kampf eines modernen Menschen für Freiheit und Kreativität gestaltet". Sein Hauptwerk „To axion esti" („Gepriesen sei", 1959) wurde von Mikis Theodorakis vertont. Weitere Werke: „Sonne, die Allmächtige", „Das Monogramm", „Maria Nefeli".`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Odysseas_Elytis_1974.jpg/500px-Odysseas_Elytis_1974.jpg`,
  },
  {
    name: `Michael Ventris`,
    lebensdaten: `1922–1956`,
    kategorie: `Architekt & Entzifferer`,
    herkunft: `Wheathampstead (England)`,
    farbe: `#0f4a72`,
    kreta: `Entzifferte 1952 die minoische Linear-B-Schrift – und bewies, dass die Sprache der Tontafeln aus Knossos (Tag 5) eine frühe Form des Griechischen ist.`,
    beschreibung: `Von Beruf Architekt, widmete sich der Engländer in seiner Freizeit der Entzifferung der „Linear-B-Schrift". 1952 gelang ihm der entscheidende Durchbruch: Er wies nach, dass es sich um eine frühe Form des Griechischen handelt. Gemeinsam mit dem Gräzisten John Chadwick setzte er seine Arbeit fort. Vier Jahre später kam er bei einem Autounfall ums Leben.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Michael_Ventris_obituary_photo.jpg/500px-Michael_Ventris_obituary_photo.jpg`,
  },
  {
    name: `Manos Hadjidakis`,
    lebensdaten: `1925–1994`,
    kategorie: `Komponist`,
    herkunft: `Xanthi (Festland)`,
    farbe: `#b5651d`,
    kreta: `Sein weltberühmtes Lied „Ta pedia tou Pirea" („Never on Sunday", 1960) hört ihr in unserer Musik-Sektion.`,
    beschreibung: `Komponist und Sänger, der kretische und festländische Folklore mit Elementen internationaler Popmusik verband. Sein berühmtester Song „Never on Sunday" wurde durch den gleichnamigen Film (1960) mit Melina Mercouri weltberühmt und gewann den Oscar für den besten Song – die erste Auszeichnung dieser Art für ein nicht-englischsprachiges Lied.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Hatzidakis_Nicopolis_1987.jpg/500px-Hatzidakis_Nicopolis_1987.jpg`,
  },
  {
    name: `Mikis Theodorakis`,
    lebensdaten: `1925–2021`,
    kategorie: `Komponist`,
    herkunft: `Chios (kretische Abstammung)`,
    farbe: `#6b1a8b`,
    kreta: `Sein „Sirtaki" aus „Alexis Sorbas" (1965) wurde zum Inbegriff der kretischen Lebensfreude – zu hören und zu sehen in unserer Musik-Sektion.`,
    beschreibung: `Auf Chios geboren, wohin sein Vater – ein Rechtsanwalt kretischer Abstammung – versetzt worden war. Er schrieb Sinfonien, Opern und Ballettmusiken, wurde aber vor allem durch seine von griechischer Volksmusik geprägten Lieder und Filmmusiken populär (u.a. den Sirtaki). Politisch aktiv im Widerstand gegen die Nazis und später gegen die Obristen, was ihm Verhaftungen und Folter einbrachte. 1990–92 amtierte er als Staatsminister.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Mikis_Theodorakis_in_Helsinki_1972_%28JOKAHBL3F_C23-9%29.tif/lossy-page1-500px-Mikis_Theodorakis_in_Helsinki_1972_%28JOKAHBL3F_C23-9%29.tif.jpg`,
  },
  {
    name: `Giannis Markopoulos`,
    lebensdaten: `1939–2023`,
    kategorie: `Komponist`,
    herkunft: `Ierapetra (Kreta)`,
    farbe: `#1a8b6b`,
    kreta: `Gebürtig aus Ierapetra (Tage 1–3) – er verbindet die kretische Volksmusik, „rauh und doch sanft wie eine Vogelfeder", mit klassisch-modernen Formen.`,
    beschreibung: `Der über Kreta hinaus in der ganzen Welt gefeierte Komponist verbindet Elemente kretischer Volksmusik – die er „frei und menschlich, ohne überflüssige Schnörkel" nennt – mit klassisch-modernen Kompositionsweisen. Einer seiner bekanntesten Interpreten war der kretische Sänger Nikos Xylouris.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/Yannis_Markopoulos_%282008%29.jpg/500px-Yannis_Markopoulos_%282008%29.jpg`,
  },
]

// ─── FLORA & FAUNA KRETAS ────────────────────────────────────────────────────

interface NaturEintrag {
  name: string
  lat: string
  ort: string
  desc: string
  img: string
  tipp?: boolean
}

const naturFlora: NaturEintrag[] = [
  {
    name: `Olivenbaum von Vouves`, lat: `Olea europaea`,
    ort: `Ano Vouves, Westkreta`,
    desc: `Kreta ist von über 30 Millionen Olivenbäumen bedeckt – das Olivenöl der Insel gilt als eines der besten der Welt. Der berühmteste Baum steht in Vouves bei Chania: Mit einem geschätzten Alter von 2000–4000 Jahren gilt er als einer der ältesten Olivenbäume der Erde und trägt noch immer Früchte. Aus seinen Zweigen wurden die Siegerkränze der Olympischen Spiele 2004 geflochten.`,
    img: `https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Olive_tree_of_Vouves.jpg/960px-Olive_tree_of_Vouves.jpg`,
  },
  {
    name: `Kretische Dattelpalme`, lat: `Phoenix theophrasti`,
    ort: `📍 Palmenstrand von Vai (Tag 2)`,
    desc: `Eine der nur zwei in Europa heimischen Palmenarten – benannt nach Theophrast, dem Schüler des Aristoteles und „Vater der Botanik". Am Strand von Vai bildet sie mit rund 5000 Bäumen den größten natürlichen Palmenhain Europas, den wir am zweiten Tag besuchen. Der Legende nach entstand er aus den Dattelkernen sarazenischer Piraten.`,
    img: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Phoenix_theophrasti_A.jpg/960px-Phoenix_theophrasti_A.jpg`,
    tipp: true,
  },
  {
    name: `Diktam (Diktamos)`, lat: `Origanum dictamnus`,
    ort: `📍 Dikti-Gebirge (Tag 1) & Bergschluchten`,
    desc: `Der „kretische Diptam" wächst ausschließlich auf Kreta, an steilen Felswänden der Berge und Schluchten – benannt nach dem Dikti-Gebirge, in dem auch die Zeus-Höhle liegt. Schon in der Antike als Wunderheilmittel berühmt: Aristoteles berichtet, verwundete Wildziegen fräßen Diktam, um Pfeile aus ihrem Körper zu treiben. Heute als Tee („Erontas" – Liebeskraut) beliebt; die Sammler, die sich früher an Seilen abseilten, hießen „Erondades".`,
    img: `https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Origanum_dictamnus_kz10.jpg/960px-Origanum_dictamnus_kz10.jpg`,
    tipp: true,
  },
  {
    name: `Platane von Gortyn`, lat: `Platanus orientalis var. cretica`,
    ort: `📍 Gortyn (Tag 4)`,
    desc: `Direkt neben dem Odeon von Gortyn steht eine berühmte immergrüne Platane – eine seltene Mutation, die ihr Laub im Winter nicht verliert. Der Mythos: Unter diesem Baum vermählte sich Zeus in Stiergestalt mit der phönizischen Königstochter Europa; aus der Verbindung ging König Minos hervor. Seitdem, so die Sage, darf die Platane ihr Laub nie mehr abwerfen.`,
    img: `https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Gortys_Plane_Tree_%285217013928%29.jpg/960px-Gortys_Plane_Tree_%285217013928%29.jpg`,
    tipp: true,
  },
  {
    name: `Stamnagathi`, lat: `Cichorium spinosum`,
    ort: `Küstenfelsen & Bergregionen`,
    desc: `Der stachelige wilde Chicorée ist DAS kretische Wildgemüse (Chórta). Die leicht bitteren Blätter werden gedämpft und mit Olivenöl und Zitrone serviert – früher Arme-Leute-Essen, heute Delikatesse in den besten Tavernen. Die kretische Ernährung mit viel Wildgemüse, Olivenöl und wenig Fleisch gilt als Musterbeispiel gesunder Mittelmeerkost.`,
    img: `https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Cichorium_spinosum.jpg/800px-Cichorium_spinosum.jpg`,
  },
  {
    name: `Johannisbrotbaum`, lat: `Ceratonia siliqua`,
    ort: `Trockene Hänge, ganz Kreta`,
    desc: `Der immergrüne „Charoupia" prägt die trockenen Hänge Kretas. Seine zuckerreichen Hülsen dienten in Notzeiten als Nahrung – zuletzt während der deutschen Besatzung. Die gleichmäßig schweren Samen nutzten schon antike Goldschmiede als Gewichtseinheit: Daraus entstand das „Karat".`,
    img: `https://upload.wikimedia.org/wikipedia/commons/3/36/Ceratonia_siliqua_MHNT.BOT.2011.3.89.jpg`,
  },
]

const naturFauna: NaturEintrag[] = [
  {
    name: `Kri-Kri (Kretische Wildziege)`, lat: `Capra aegagrus cretica`,
    ort: `Weiße Berge / Samaria-Schlucht`,
    desc: `Das Wappentier Kretas: Die scheue Wildziege mit den mächtigen, geschwungenen Hörnern lebt heute fast nur noch in der Samaria-Schlucht und auf vorgelagerten Inseln – nur wenige tausend Tiere existieren. Schon die Minoer verehrten sie; auf Siegeln und Fresken ist der „Agrimi" häufig dargestellt. Der Mythos verbindet sie mit der Ziege Amaltheia, die den Zeus-Säugling in der Diktäischen Höhle nährte.`,
    img: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Kri-kri_1.jpg/960px-Kri-kri_1.jpg`,
  },
  {
    name: `Bartgeier`, lat: `Gypaetus barbatus`,
    ort: `📍 Lassithi-Hochebene & Dikti (Tag 1)`,
    desc: `Kreta beherbergt die letzte Brutpopulation des Bartgeiers in Griechenland – nur noch wenige Paare kreisen über den Hochgebirgen. Mit bis zu 2,80 m Spannweite ist er einer der größten Greifvögel Europas. Seine Spezialität: Er lässt Knochen aus großer Höhe auf Felsen fallen, um an das Mark zu gelangen – daher sein griechischer Name „Kokkalás" (Knochenfresser). Mit Glück bei der Fahrt über die Lassithi-Hochebene zu sehen!`,
    img: `https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/Lammergeier_%28Gypaetus_barbatus%29_%2838450063712%29.jpg/960px-Lammergeier_%28Gypaetus_barbatus%29_%2838450063712%29.jpg`,
    tipp: true,
  },
  {
    name: `Unechte Karettschildkröte`, lat: `Caretta caretta`,
    ort: `📍 Strände bei Rethymnon (Tage 4–7)`,
    desc: `Die Sandstrände östlich von Rethymnon – genau dort, wo unser Hotel Dedalos liegt! – gehören zu den wichtigsten Nistplätzen dieser bedrohten Meeresschildkröte im Mittelmeer. Im Juli schlüpfen nachts die ersten Jungen und krabbeln zum Meer. Markierte Nester am Strand bitte unbedingt respektieren; nachts kein Licht am Strand.`,
    img: `https://upload.wikimedia.org/wikipedia/commons/8/8e/Loggerhead_sea_turtle.jpg`,
    tipp: true,
  },
  {
    name: `Mittelmeer-Mönchsrobbe`, lat: `Monachus monachus`,
    ort: `Abgelegene Küstenhöhlen`,
    desc: `Eines der seltensten Meeressäugetiere der Welt – nur noch etwa 700 Tiere existieren, ein Teil davon in den Gewässern um Kreta. Die scheuen Robben ziehen ihre Jungen in unzugänglichen Küstenhöhlen auf. Schon Homer erwähnt sie in der Odyssee: Der Meergreis Proteus hütet seine Robbenherde „wie ein Hirte die Schafe".`,
    img: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Monachus_monachus_DSC_0274.jpg/960px-Monachus_monachus_DSC_0274.jpg`,
  },
  {
    name: `Eleonorenfalke`, lat: `Falco eleonorae`,
    ort: `Küstenfelsen & vorgelagerte Inseln`,
    desc: `Der elegante Zugvogel brütet in Kolonien auf Kretas Küstenfelsen und unbewohnten Inseln – etwa auf Dia vor Iraklion. Einzigartig ist sein später Brutbeginn im Hochsommer: So kann er seine Jungen mit den im Herbst durchziehenden Singvögeln füttern. Im Oktober zieht die gesamte Population nach Madagaskar.`,
    img: `https://upload.wikimedia.org/wikipedia/commons/d/d8/Eleonora%27s_falcon_%28Falco_eleonorae%29_in_flight_3.jpg`,
  },
  {
    name: `Großer Tümmler`, lat: `Tursiops truncatus`,
    ort: `Küstengewässer, Golf von Mirabello`,
    desc: `Delfine begleiten seit der Antike die Schiffe der Ägäis – die berühmten Delphinfresken aus dem Palast von Knossos (Megaron der Königin, Tag 5) zeigen, wie vertraut die Minoer mit ihnen waren. Mit etwas Glück sieht man sie bei der Bootsüberfahrt nach Spinalonga (Tag 3) oder vor der Nordküste spielen.`,
    img: `https://upload.wikimedia.org/wikipedia/commons/1/10/Tursiops_truncatus_01.jpg`,
    tipp: true,
  },
]

// ─── KARTEN & PLÄNE (Fotos aus dem Bilderordner) ────────────────────────────

interface KartenEintrag {
  titel: string
  tag?: string
  bild: string
}

const kartenGruppen: { gruppe: string; icon: string; karten: KartenEintrag[] }[] = [
  {
    gruppe: `Übersichtskarten`,
    icon: `🗺`,
    karten: [
      { titel: `Kreta – Gesamtkarte mit Reiseroute`, bild: `/kreta-trip/bilder/karte-gesamt.jpg` },
      { titel: `Ostkreta`, tag: `Tage 1–3`, bild: `/kreta-trip/bilder/karte-ost.jpg` },
      { titel: `Mittel- und Ostkreta`, tag: `Tage 3–5`, bild: `/kreta-trip/bilder/karte-mitte-ost.jpg` },
      { titel: `Mittelkreta`, tag: `Tage 4–5`, bild: `/kreta-trip/bilder/karte-mitte.jpg` },
      { titel: `Westkreta`, tag: `Tage 6–7`, bild: `/kreta-trip/bilder/karte-west.jpg` },
      { titel: `Westkreta – Detail`, tag: `Tage 6–7`, bild: `/kreta-trip/bilder/karte-west2.jpg` },
    ],
  },
  {
    gruppe: `Stadtpläne`,
    icon: `🏙`,
    karten: [
      { titel: `Agios Nikolaos – Stadtplan`, tag: `Tag 3`, bild: `/kreta-trip/bilder/plan-agios-nikolaos.jpg` },
      { titel: `Rethymnon – Stadtplan`, tag: `Tag 6`, bild: `/kreta-trip/bilder/plan-rethymnon.jpg` },
      { titel: `Chania – Stadtplan`, tag: `Tag 7`, bild: `/kreta-trip/bilder/plan-chania.jpg` },
      { titel: `Chania – Umgebungskarte`, tag: `Tag 7`, bild: `/kreta-trip/bilder/karte-chania1.jpg` },
      { titel: `Iraklion – Stadtplan`, tag: `Tag 8`, bild: `/kreta-trip/bilder/plan-heraklion.jpg` },
      { titel: `Iraklion – Umgebungskarte`, tag: `Tag 8`, bild: `/kreta-trip/bilder/karte-heraklion2.jpg` },
    ],
  },
  {
    gruppe: `Ausgrabungs- und Anlagenpläne`,
    icon: `🏛`,
    karten: [
      { titel: `Gournia – minoische Stadt`, tag: `Tag 2`, bild: `/kreta-trip/bilder/plan-gournia.jpg` },
      { titel: `Kato Zakros – Palastplan`, tag: `Tag 2`, bild: `/kreta-trip/bilder/plan-kato-zakros.jpg` },
      { titel: `Lato – dorische Stadt`, tag: `Tag 3`, bild: `/kreta-trip/bilder/plan-lato.jpg` },
      { titel: `Kritsa – Panagia Kera (Fresken)`, tag: `Tag 3`, bild: `/kreta-trip/bilder/plan-kritsa1.jpg` },
      { titel: `Kritsa – Panagia Kera (Plan)`, tag: `Tag 3`, bild: `/kreta-trip/bilder/plan-kritsa2.jpg` },
      { titel: `Phaistos – Palastplan`, tag: `Tag 4`, bild: `/kreta-trip/bilder/plan-phaistos.jpg` },
      { titel: `Agia Triada – Palastvilla`, tag: `Tag 4`, bild: `/kreta-trip/bilder/plan-agia-triada.jpg` },
      { titel: `Knossos – Palastplan`, tag: `Tag 5`, bild: `/kreta-trip/bilder/plan-knossos.jpg` },
      { titel: `Eleftherna – Ausgrabung`, tag: `Tag 6`, bild: `/kreta-trip/bilder/plan-eleftherna.jpg` },
      { titel: `Moni Arkadi – Klosterplan`, tag: `Tag 6`, bild: `/kreta-trip/bilder/plan-arkadi.jpg` },
      { titel: `Moni Preveli – Klosterplan`, tag: `Tag 6`, bild: `/kreta-trip/bilder/plan-preveli.jpg` },
      { titel: `Rethymnon – Fortezza`, tag: `Tag 6`, bild: `/kreta-trip/bilder/plan-rethymnon-festung.jpg` },
    ],
  },
]

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function StarRating({ n }: { n: number }) {
  return (
    <div className="stars">
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </div>
  )
}

function HotelCard({ hotel, hotelData }: { hotel?: string; hotelData?: HotelData }) {
  const [expanded, setExpanded] = useState(false)
  if (!hotel) return null

  return (
    <div className="hotel-section">
      <div className="hotel-info" onClick={() => hotelData && setExpanded(!expanded)} style={{ cursor: hotelData ? 'pointer' : 'default' }}>
        <Hotel size={18} />
        <span>{hotel}</span>
        {hotelData && (expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
      </div>
      <AnimatePresence>
        {expanded && hotelData && (
          <motion.div
            className="hotel-map-card"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="hotel-map-inner">
              <iframe
                className="hotel-map-iframe"
                src={`https://www.google.com/maps?q=${hotelData.mapsEmbed}&output=embed`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                title={hotelData.name}
              />
              <a
                href={`https://www.google.com/maps/search/${hotelData.mapsQuery}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hotel-maps-link"
              >
                <MapPin size={14} /> Auf Google Maps öffnen (Bewertungen, Fotos, Route)
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FlightCard({ f }: { f: FlightInfo }) {
  return (
    <div className="flight-card">
      <div className="flight-card-top">
        <div className="flight-airline">
          <Plane size={16} /> {f.airline} · {f.number}
        </div>
        <div className="flight-date">{f.date}</div>
      </div>
      <div className="flight-route">
        <div className="flight-endpoint">
          <div className="flight-time">{f.depTime}{!f.depConfirmed && <span className="flight-ca">ca.</span>}</div>
          <div className="flight-code">{f.fromCode}</div>
          <div className="flight-city">{f.fromCity}</div>
        </div>
        <div className="flight-path">
          <span className="flight-line" />
          <Plane size={18} className="flight-plane" />
          <span className="flight-line" />
        </div>
        <div className="flight-endpoint">
          <div className="flight-time">{f.arrTime}{!f.arrConfirmed && <span className="flight-ca">ca.</span>}</div>
          <div className="flight-code">{f.toCode}</div>
          <div className="flight-city">{f.toCity}</div>
        </div>
      </div>
      <div className="flight-card-bottom">
        <span className="flight-aircraft">{f.aircraft}</span>
        <a href={f.statusUrl} target="_blank" rel="noopener noreferrer" className="flight-status-link">
          Live-Status <ExternalLink size={11} />
        </a>
      </div>
    </div>
  )
}

// Klick-Fassade: lädt den YouTube-Player erst beim Klick (schneller, datenschutzfreundlich)
function YouTubeFacade({ videoId, title }: { videoId: string; title: string }) {
  const [loaded, setLoaded] = useState(false)
  if (loaded) {
    return (
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    )
  }
  return (
    <button className="yt-facade" onClick={() => setLoaded(true)} aria-label={`Video abspielen: ${title}`}>
      <img src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`} alt={title} />
      <span className="facade-play">▶</span>
    </button>
  )
}

// Klick-Fassade für Spotify-Player (Track oder Playlist)
function SpotifyFacade({ embedPath, titel, height }: { embedPath: string; titel: string; height: number }) {
  const [loaded, setLoaded] = useState(false)
  if (loaded) {
    return (
      <iframe
        src={`https://open.spotify.com/embed/${embedPath}?theme=0`}
        title={titel}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    )
  }
  return (
    <button className="spotify-facade" onClick={() => setLoaded(true)} aria-label={`Spotify-Player laden: ${titel}`}>
      <span className="facade-play facade-play-sm">▶</span>
      <span className="spotify-facade-text">
        <strong>{titel}</strong>
        <small>Klicken zum Laden des Spotify-Players</small>
      </span>
    </button>
  )
}

// Säulenordnungs-Karte mit rotierenden Bildern (Struktur wie Sizilien-Seite)
interface OrdnungSlide { url: string; label: string }
interface OrdnungData { name: string; color: string; merkmale: string[]; beispiel: string; slides: OrdnungSlide[] }

function OrdnungCard({ o }: { o: OrdnungData }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % o.slides.length), 7000)
    return () => clearInterval(t)
  }, [o.slides.length])
  const s = o.slides[idx]
  return (
    <motion.div className="arch-ordnung-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
      <div className="arch-ordnung-img">
        <img src={s.url} alt={s.label} loading="lazy" />
        <div className="arch-ordnung-overlay" style={{ borderColor: o.color }}>
          <h4 style={{ color: o.color }}>{o.name}</h4>
          <span className="arch-slide-label">{s.label}</span>
        </div>
        <div className="arch-ordnung-dots">
          {o.slides.map((_, i) => (
            <button key={i} className={`arch-ordnung-dot${i === idx ? ' active' : ''}`} onClick={() => setIdx(i)} />
          ))}
        </div>
      </div>
      <div className="arch-ordnung-body">
        <ul>{o.merkmale.map((m, j) => <li key={j}>{m}</li>)}</ul>
        <div className="arch-beispiel">📍 {o.beispiel}</div>
      </div>
    </motion.div>
  )
}

function WeatherCard({ ort, datum, w }: { ort: string; datum: string; w: DayWeather | null | undefined }) {
  return (
    <div className="weather-card">
      <span className="weather-loc">🌍 Wetter {ort} · {datum}. Juli:</span>
      {w ? (
        <span className="weather-data">
          {wetterSymbol(w.code).icon} {wetterSymbol(w.code).text} · {w.tmin}–{w.tmax} °C · 💨 max. {w.wind} km/h · ☔ {w.precip} %
        </span>
      ) : (
        <span className="weather-data weather-pending">Vorhersage wird ca. 14 Tage vor dem Termin verfügbar</span>
      )}
    </div>
  )
}

function DayAccordion({ d, open, onToggle, wetter }: { d: DayData; open: boolean; onToggle: () => void; wetter?: DayWeather | null }) {
  return (
    <div className={`day-accordion${open ? ' day-accordion-open' : ''}`}>
      <div className="day-accordion-header" onClick={onToggle}>
        <span className="day-accordion-badge">{d.weekday.slice(0, 2)}<br />{d.day}</span>
        <div className="day-accordion-left">
          <div className="day-accordion-info">
            <span className="day-accordion-title">{d.title}</span>
          </div>
        </div>
        <div className="day-accordion-chevron">
          {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            className="day-accordion-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: 'hidden' }}
          >
            <div className="day-card-hero">
              <img src={d.image} alt={d.title} loading="lazy" />
              <div className="day-card-overlay">
                <span className="day-badge">Tag {d.day} – {d.weekday}</span>
                <h3>{d.date}</h3>
              </div>
            </div>
            <div className="day-card-body">
              {d.flight && <FlightCard f={d.flight} />}
              <WeatherCard
                ort={wetterOrte.find(o => o.day === d.day)?.name ?? d.title}
                datum={String(16 + d.day)}
                w={wetter}
              />
              <div className="stops-list">
                {d.stops.map((s, i) => (
                  <div key={i} className={`stop-card stop-card-v2${s.image ? ' stop-card-has-img' : ''}`}>
                    {s.image && (
                      <div className="stop-card-image">
                        <img src={s.image} alt={s.name} loading="lazy" />
                      </div>
                    )}
                    <div className="stop-card-content">
                      <div className="stop-name">{s.name} {s.km && <span className="stop-km">({s.km})</span>}</div>
                      <div className="stop-desc">{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <HotelCard hotel={d.hotel} hotelData={d.hotelData} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TextCard({ t }: { t: Textquelle }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="text-card">
      <button className="text-card-header" onClick={() => setOpen(!open)}>
        <div>
          <h3>{t.titel}</h3>
          <div className="author">{t.autor} · {t.epoche}</div>
        </div>
        {open ? <ChevronUp size={16} color="#6b7280" /> : <ChevronDown size={16} color="#6b7280" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-card-body"
          >
            {t.original && <p className="text-original">{t.original}</p>}
            <p className="text-translation">{t.uebersetzung}</p>
            <div className="text-comment"><Info size={13} style={{ display: 'inline', marginRight: 4 }} />{t.kommentar}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeSection, setActiveSection] = useState('region')
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedDays, setExpandedDays] = useState<number[]>([])
  const toggleDay = (day: number) =>
    setExpandedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day])
  const [wetter, setWetter] = useState<Record<number, DayWeather | null>>({})

  // Live-Wetter von Open-Meteo für jeden Reisetag am jeweiligen Ort
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const results = await Promise.all(wetterOrte.map(async o => {
        const date = `2026-07-${16 + o.day}`
        try {
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${o.lat}&longitude=${o.lng}` +
            `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
            `&timezone=Europe%2FAthens&start_date=${date}&end_date=${date}`
          const r = await fetch(url)
          if (!r.ok) return [o.day, null] as const
          const j = await r.json()
          const dly = j?.daily
          if (!dly?.time?.length || dly.temperature_2m_max?.[0] == null) return [o.day, null] as const
          return [o.day, {
            tmax: Math.round(dly.temperature_2m_max[0]),
            tmin: Math.round(dly.temperature_2m_min[0]),
            code: dly.weather_code?.[0] ?? 0,
            wind: Math.round(dly.wind_speed_10m_max?.[0] ?? 0),
            precip: dly.precipitation_probability_max?.[0] ?? 0,
          }] as const
        } catch {
          return [o.day, null] as const
        }
      }))
      if (!cancelled) setWetter(Object.fromEntries(results))
    })()
    return () => { cancelled = true }
  }, [])
  const [wissenTab, setWissenTab] = useState<'architektur' | 'kulinarisch'>('architektur')
  const [glossarKat, setGlossarKat] = useState(0)
  const [archOpen, setArchOpen] = useState(false)
  const [personenOpen, setPersonenOpen] = useState(false)
  const [naturOpen, setNaturOpen] = useState(false)
  const [zeittafelOpen, setZeittafelOpen] = useState(false)
  const [openKartenGruppen, setOpenKartenGruppen] = useState<number[]>([])
  const toggleKartenGruppe = (idx: number) =>
    setOpenKartenGruppen(prev => prev.includes(idx) ? prev.filter(g => g !== idx) : [...prev, idx])
  const [expandedPerson, setExpandedPerson] = useState<number | null>(null)
  const [expandedEpochen, setExpandedEpochen] = useState<number[]>([])
  const toggleEpoche = (idx: number) =>
    setExpandedEpochen(prev => prev.includes(idx) ? prev.filter(e => e !== idx) : [...prev, idx])

  // scroll spy
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id) })
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    navItems.forEach(item => {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  const wissenData = wissenTab === 'kulinarisch' ? kulinarischesLexikon : architekturLexikon


  return (
    <>
      {/* NAV */}
      <nav>
        <div className="nav-inner">
          <span className="nav-title">🏛 KRETA 2026</span>
          <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
            {navItems.map(item => (
              <button
                key={item.id}
                className={activeSection === item.id ? 'active' : ''}
                onClick={() => scrollTo(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-bg" />
        <div className="hero-overlay" />
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={fadeIn}>
          <h1>ΚΡΗΤΗ</h1>
          <p className="subtitle">Kreta – Wiege der europäischen Hochkultur</p>
          <p className="dates">GRIECHISCH-EXKURSION · JULI 2026</p>
        </motion.div>
      </div>

      {/* 1. REGION */}
      <section id="region" style={{ background: 'white' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="section-title"><Globe size={28} /> Region</h2>
            <div className="section-divider" />
            <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '1.5rem', maxWidth: 700 }}>
              Kreta ist die größte griechische Insel und Wiege der minoischen Hochkultur – der ersten
              Hochkultur Europas. Im Süden Griechenlands zwischen Ägäis und Libyschem Meer gelegen,
              war sie über Jahrtausende Kreuzungspunkt von Kulturen: Minoer, Mykener, Römer, Araber,
              Venezianer und Osmanen haben alle ihre Spuren hinterlassen.
            </p>
            <div style={{ borderRadius: 12, overflow: 'hidden', height: 400, marginBottom: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}>
              <iframe
                title="Kreta Karte"
                src="https://www.openstreetmap.org/export/embed.html?bbox=23.5%2C34.7%2C26.4%2C35.7&layer=mapnik"
                style={{ width: '100%', height: '100%', border: 'none' }}
                loading="lazy"
              />
            </div>
            <div className="stat-grid">
              {stats.map((s, i) => (
                <motion.div key={i} className="stat-tile" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: i * 0.07 }}>
                  <div className="value">{s.value}</div>
                  <div className="label">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. REISEROUTE */}
      <section id="route" style={{ background: '#f9fafb' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="section-title"><Navigation size={28} /> Reiseroute</h2>
            <div className="section-divider" />
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              8 Tage von Ost nach West durch die Wiege Europas – zum Aufklappen antippen.
            </p>
            {days.map(d => (
              <DayAccordion
                key={d.day}
                d={d}
                open={expandedDays.includes(d.day)}
                onToggle={() => toggleDay(d.day)}
                wetter={wetter[d.day]}
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. RESTAURANTS */}
      <section id="restaurants" style={{ background: 'white' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="section-title"><UtensilsCrossed size={28} /> Restaurants</h2>
            <div className="section-divider" />
            <div className="card-grid">
              {restaurants.map((r, i) => (
                <motion.div key={i} className="restaurant-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: i * 0.08 }}>
                  <div className="restaurant-card-body">
                    <div className="restaurant-card-top">
                      <StarRating n={r.bewertung} />
                      <span className="restaurant-tag">{r.tag}</span>
                    </div>
                    <h3>{r.name}</h3>
                    <div className="restaurant-meta"><MapPin size={12} style={{ display: 'inline' }} /> {r.ort}</div>
                    <div className="restaurant-specialty">{r.spezialitaet}</div>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem', lineHeight: 1.5 }}>{r.note}</p>
                    <a href={`https://www.google.com/maps/search/${r.mapsQuery}`} target="_blank" rel="noopener noreferrer" className="restaurant-maps-link">
                      <MapPin size={12} /> Auf Google Maps
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. SPEISEN */}
      <section id="speisen" style={{ background: '#f9fafb' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="section-title"><UtensilsCrossed size={28} /> Speisen</h2>
            <div className="section-divider" />
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Kulinarische Höhepunkte Kretas – von der Meze bis zum Dessert.
            </p>
            <div className="speisen-sections">
              <div className="speisen-kategorie">
                <h3 className="speisen-kat-titel">🥗 Vorspeisen</h3>
                <SpeisenKarussel gerichte={vorspeisen} />
              </div>
              <div className="speisen-kategorie">
                <h3 className="speisen-kat-titel">🍝 Hauptspeisen</h3>
                <SpeisenKarussel gerichte={hauptspeisen} />
              </div>
              <div className="speisen-kategorie">
                <h3 className="speisen-kat-titel">🍮 Nachspeisen</h3>
                <SpeisenKarussel gerichte={nachspeisen} />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* MUSIK */}
      <section id="musik" style={{ background: 'white' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="section-title"><Music size={28} /> Musik</h2>
            <div className="section-divider" />
            <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: '2rem', maxWidth: 720 }}>
              Kein anderes Stück verkörpert das Lebensgefühl Griechenlands so sehr wie der <strong>Sirtaki</strong> aus
              dem Film <em>„Alexis Sorbas"</em> (1964). Die Musik stammt von <strong>Mikis Theodorakis</strong>, gespielt
              auf der <strong>Bouzouki</strong> – dem griechischen Nationalinstrument. Obwohl der Tanz eigens für den Film
              komponiert wurde, gilt er heute als Inbegriff der griechischen Folklore.
            </p>
            <div className="musik-grid">
              {musik.map((m, i) => (
                <motion.div key={i} className="musik-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: i * 0.1 }}>
                  <div className="musik-video">
                    <YouTubeFacade videoId={m.videoId} title={m.titel} />
                  </div>
                  <div className="musik-body">
                    <h3>{m.titel}</h3>
                    <div className="musik-interpret">{m.interpret}</div>
                    <p>{m.beschreibung}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: '1.3rem', color: '#0f4a72', marginTop: '3rem', marginBottom: '0.5rem' }}>
              Weitere griechische Klassiker – unsere Playlist
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              ℹ️ Ohne Spotify-Konto spielt der Player 30-Sekunden-Vorschauen; mit (kostenlosem) Konto laufen die Stücke vollständig.
            </p>
            <div className="spotify-playlist-card">
              <SpotifyFacade embedPath={`playlist/1JfZXzlIvTIF4BCttJz0kX`} titel={`Playlist „Kreta 2026"`} height={420} />
            </div>
            <div className="spotify-grid">
              {spotifyTracks.map((t, i) => (
                <motion.div key={i} className="spotify-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: i * 0.08 }}>
                  <div className="spotify-text">
                    <div className="spotify-track-titel">{t.titel}</div>
                    <div className="spotify-interpret">{t.interpret}</div>
                    <p>{t.hinweis}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 5. TEXTE */}
      <section id="texte" style={{ background: 'white' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="section-title"><FileText size={28} /> Texte</h2>
            <div className="section-divider" />
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Antike und moderne Quellen zu Kreta – aufklappbar mit Original, Übersetzung und Kommentar.
            </p>
            {texte.map((t, i) => <TextCard key={i} t={t} />)}
          </motion.div>
        </div>
      </section>

      {/* 6. WISSEN */}
      <section id="wissen" style={{ background: '#f9fafb' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="section-title"><BookOpen size={28} /> Wissen</h2>
            <div className="section-divider" />
            <div className="wissen-tabs">
              {(['architektur', 'kulinarisch'] as const).map(tab => (
                <button
                  key={tab}
                  className={`wissen-tab ${wissenTab === tab ? 'active' : ''}`}
                  onClick={() => setWissenTab(tab)}
                >
                  {tab === 'architektur' ? 'Architektur-Lexikon' : 'Kulinarisches Lexikon'}
                </button>
              ))}
            </div>
            <div className="lexikon-grid">
              {wissenData.map((e, i) => (
                <motion.div key={i} className="lexikon-entry" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: i * 0.04 }}>
                  <div className="lexikon-term">{e.term}</div>
                  <div className="lexikon-def">{e.definition}</div>
                </motion.div>
              ))}
            </div>

            {/* ── Architektur im Detail (Struktur wie Sizilien-Seite, aufklappbar) ── */}
            <div className={`arch-header${archOpen ? '' : ' collapsed'}`} onClick={() => setArchOpen(!archOpen)}>
              <h3>
                <span className="arch-header-icon"><Landmark size={22} /></span>
                <span className="arch-header-title">Architektur im Detail</span>
                <span className="arch-chevron-area">
                  <span className="arch-toggle-hint">{archOpen ? 'Einklappen' : 'Aufklappen'}</span>
                  {archOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </span>
              </h3>
              <p>Tempelformen, Säulenordnungen, Kirchentypen auf Kreta, Gefäßformen und Vasenmalerei</p>
            </div>

            <AnimatePresence>
            {archOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>

            {/* Tempelformen */}
            <h3 className="arch-subtitle">Griechische Tempelformen</h3>
            <div className="arch-schema-detail" style={{ margin: '0 0 1.5rem 0', textAlign: 'center' }}>
              <p style={{ fontSize: '0.78rem', color: '#6b7280', marginBottom: '0.5rem', fontStyle: 'italic' }}>
                Grundrissschemata der wichtigsten Tempeltypen (Draufsicht: Punkte = Säulen, dicke Linien = Mauern)
              </p>
              <img
                src="/kreta-trip/arch-tempeltypen.svg"
                alt="Grundrissdiagramm griechischer Tempeltypen: Tholos, Antentempel, Prostylos, Peripteros, Dipteros u.a."
                style={{ maxWidth: '100%', width: '660px', border: '1px solid #e5e7eb', borderRadius: '4px', padding: '0.5rem', background: 'white' }}
              />
            </div>
            <div className="arch-grid">
              {[
                { name: 'Antentempel', desc: 'Einfachste Form: Kultraum (Naos/Cella) + Vorraum (Pronaos) mit zwei Säulen zwischen den Mauerenden (Anten).', beispiel: 'Frühe Tempel auf Kreta, z.B. Prinias' },
                { name: 'Prostylos', desc: 'Säulenhalle nur an der Vorderseite. Die Säulen stehen vor dem Pronaos.', beispiel: '' },
                { name: 'Amphiprostylos', desc: 'Säulenhallen an Vorder- und Rückseite des Tempels.', beispiel: '' },
                { name: 'Peripteros', desc: 'Vollständiger Säulenkranz (Peristasis) umgibt die Cella. Die Ringhalle heißt Pteron. Das klassische Standardschema.', beispiel: 'Parthenon (Athen); Tempel Siziliens' },
                { name: 'Dipteros', desc: 'Doppelter Säulenkranz. Sehr aufwendig – nur für die bedeutendsten Heiligtümer.', beispiel: 'Artemision von Ephesus' },
                { name: 'Pseudodipteros', desc: 'Wirkt wie Dipteros, aber die innere Säulenreihe fehlt – mehr Raum in der Ringhalle.', beispiel: '' },
                { name: 'Tholos', desc: 'Runder Tempel mit kreisförmigem Säulenkranz und runder Cella.', beispiel: '' },
                { name: 'Monopteros', desc: 'Runder Säulenkranz ohne Cella – offener Pavillon-Typ.', beispiel: '' },
              ].map((t, i) => (
                <motion.div key={i} className="arch-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                  <h4>{t.name}</h4>
                  <p>{t.desc}</p>
                  {t.beispiel && <div className="arch-beispiel">📍 {t.beispiel}</div>}
                </motion.div>
              ))}
            </div>

            {/* Säulenordnungen */}
            <h3 className="arch-subtitle">Die drei Säulenordnungen</h3>
            <div className="arch-ordnungen">
              {([
                {
                  name: 'Dorische Ordnung',
                  color: '#c9a227',
                  merkmale: ['Keine Basis – Säule steht direkt auf dem Stylobat', '16–20 Kanneluren mit scharfen Graten', 'Kapitell: Echinus (runder Wulst) + Abakus (Platte)', 'Fries: abwechselnd Triglyphen und Metopen', 'Wuchtig, schlicht, maskulin'],
                  beispiel: 'Klassische Tempel Griechenlands; dorische Bauglieder in Gortyn',
                  slides: [
                    { url: 'https://upload.wikimedia.org/wikipedia/commons/7/74/Doric_capital_-_Temple_of_Heracles_-_Agrigento_-_Italy_2015.JPG', label: 'Dorisches Kapitell – Heraklestempel, Agrigent' },
                    { url: 'https://images.unsplash.com/photo-1721250150605-6f43bae03fce?w=800&q=80', label: 'Parthenon, Athen – Dorische Säulen' },
                  ],
                },
                {
                  name: 'Ionische Ordnung',
                  color: '#7ec8e3',
                  merkmale: ['Basis: Torus + Spira + Plinthe', '24 Kanneluren mit stumpfen Stegen', 'Kapitell: charakteristische Voluten (Schnecken)', 'Architrav in drei Fascien (Streifen) gegliedert', 'Schlank, elegant, weiblich'],
                  beispiel: 'Kleinasien; Erechtheion in Athen',
                  slides: [
                    { url: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Ionic_capital_from_the_Erechtheum_at_the_British_Museum.jpg', label: 'Ionisches Kapitell – Erechtheion, Athen (British Museum)' },
                    { url: 'https://images.unsplash.com/photo-1761701826167-9b5f164e2cf8?w=800&q=80', label: 'Ionisches Volutenkapitell – Nahaufnahme' },
                  ],
                },
                {
                  name: 'Korinthische Ordnung',
                  color: '#8fce8f',
                  merkmale: ['Wie ionisch, aber aufwendigeres Kapitell', 'Kapitell mit Akanthusblättern und Voluten-Bändern', 'Entwickelt ca. 420 v. Chr. in Korinth', 'Besonders prunkvoll und dekorativ', 'In römischer Architektur am beliebtesten'],
                  beispiel: 'Römische Bauten – z.B. im römischen Gortyn (Tag 4)',
                  slides: [
                    { url: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Corinthian_capital%2C_AM_of_Epidauros%2C_202545.jpg', label: 'Korinthisches Kapitell – Arch. Museum Epidauros' },
                    { url: 'https://images.unsplash.com/photo-1767551427154-bd320d9ba413?w=800&q=80', label: 'Korinthische Säulen mit Akanthuskapitell' },
                  ],
                },
              ] as OrdnungData[]).map((o, i) => <OrdnungCard key={i} o={o} />)}
            </div>

            {/* Detailschema */}
            <div className="arch-schema-detail">
              <h3 className="arch-subtitle">Detailschema der Säulenordnungen</h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.75rem' }}>Klicken zum Vergrößern – deutsches Übersichtsschema (1892)</p>
              <a href="https://upload.wikimedia.org/wikipedia/commons/5/53/Schema_Saeulenordnungen.jpg" target="_blank" rel="noopener noreferrer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Schema_Saeulenordnungen.jpg"
                  alt="Schema der Säulenordnungen – Dorisch, Ionisch, Korinthisch"
                  loading="lazy"
                  className="arch-schema-img"
                />
              </a>
            </div>

            {/* Aufbau des Tempels */}
            <h3 className="arch-subtitle">Aufbau eines dorischen Tempels</h3>
            <div className="arch-aufbau">
              {[
                { teil: 'Stereobat', desc: 'Unterer Stufenunterbau aus drei Stufen' },
                { teil: 'Krepis', desc: 'Stufenunterbau (= Stereobat)' },
                { teil: 'Stylobat', desc: 'Oberste Stufe – Standfläche der Säulen' },
                { teil: 'Säule', desc: 'Mit Kanneluren; dorisch ohne Basis, ionisch mit Basis' },
                { teil: 'Kapitell', desc: 'Echinus (runder Wulst) und Abakus (Deckplatte)' },
                { teil: 'Architrav', desc: 'Waagrechter Träger über den Säulen' },
                { teil: 'Fries', desc: 'Dorisch: Triglyphen + Metopen; ionisch: Bilderfries' },
                { teil: 'Geison', desc: 'Vorspringendes Kranzgesims' },
                { teil: 'Tympanon', desc: 'Dreieckiges Giebelfeld, oft mit Skulpturen' },
                { teil: 'Sima', desc: 'Dachrinne mit Wasserspeiern (Löwenköpfe)' },
                { teil: 'Akroter', desc: 'Schmuckelemente an den Giebelecken und -spitzen' },
              ].map((t, i) => (
                <div key={i} className="arch-aufbau-item">
                  <span className="arch-aufbau-term">{t.teil}</span>
                  <span className="arch-aufbau-desc">{t.desc}</span>
                </div>
              ))}
            </div>

            {/* Tempel-Aufbau Diagramme */}
            <div className="arch-diagramme">
              <div className="arch-schema-detail" style={{ margin: 0 }}>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.6rem' }}>Schema: Säulenbasis (Fundament – Krepis – Stylobat)</p>
                <img src="/kreta-trip/arch-saeulenbasis.svg" alt="Dorische Säulenbasis: Fundament, Krepis, Euthynterie, Stylobat" style={{ width: '100%', maxWidth: '320px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', padding: '0.5rem' }} />
              </div>
              <div className="arch-schema-detail" style={{ margin: 0 }}>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.6rem' }}>Klicken zum Vergrößern – Beschriftetes Schema: Kapitell, Gebälk und Giebel</p>
                <a href="https://upload.wikimedia.org/wikipedia/commons/a/ae/Doric-order-labeled.jpg" target="_blank" rel="noopener noreferrer">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Doric-order-labeled.jpg" alt="Dorische Ordnung – vollständig beschriftet" loading="lazy" className="arch-schema-img" />
                </a>
              </div>
            </div>

            {/* Dorischer Eckkonflikt */}
            <div className="arch-eckkonflikt">
              <div className="arch-eckkonflikt-img-wrap">
                <img src="/kreta-trip/arch-eckkonflikt.jpg" alt="Dorischer Eckkonflikt – Schema" loading="lazy" className="arch-eckkonflikt-img" />
              </div>
              <div className="arch-eckkonflikt-text">
                <h3 className="arch-eckkonflikt-title">Dorischer Eckkonflikt</h3>
                <p>Im Steinbau dorischer Ordnung wird damit das Problem bezeichnet, eine gleichmäßige, um die Ecke biegende Abfolge von Triglyphen und Metopen im Gebälk über der Säulenstellung zu bewirken. In der kanonischen dorischen Baustruktur lagert jede zweite Triglyphe mittig über einer Säule. Dies wird an der Ecke unrealisierbar, wo die Tiefe des auf den Kapitellen lagernden Architravs die Breite einer Triglyphe übersteigt – entweder liegt der Architrav nicht mehr zentriert auf der Deckplatte des Eckkapitells auf, oder die Mitte der Ecktriglyphe rückt aus der Säulenachse nach außen.</p>
                <p>Der Eckkonflikt war in der Antike ein bekanntes, diskutiertes und am Ende ungelöstes Architekturproblem, das nach einer Aussage des Architekten Vitruv letztlich den Verzicht auf die dorische Bauordnung begründet haben soll. Als „Lösung" wurde im späten 6. Jh. vor allem die Verengung (Kontraktion) des Eckjoches entwickelt.</p>
                <div className="arch-eckkonflikt-fachbegriffe">
                  <span><strong>Normaljoch</strong> – Standardabstand zwischen zwei Säulen</span>
                  <span><strong>Eckjoch</strong> – verkleinertes Joch an der Tempelecke</span>
                  <span><strong>Triglyphe</strong> – senkrecht gerilltes Frieselement</span>
                  <span><strong>Metope</strong> – glatte oder reliefierte Platte zwischen zwei Triglyphen</span>
                </div>
              </div>
            </div>

            {/* Kirchentypen auf Kreta */}
            <h3 className="arch-subtitle">Kirchentypen auf Kreta</h3>
            <div className="arch-grid arch-grid-3">
              {[
                { name: 'Frühchristliche Basilika', desc: 'Längsgerichteter Bau mit Mittelschiff, zwei Seitenschiffen und Apsis; Vorbild ist die römische Gerichtsbasilika. Auf Kreta: die Titus-Basilika in Gortyn (6. Jh.) – der Apostelschüler Titus war erster Bischof der Insel (Tag 4).', img: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Gortyn_Agios_Titos.jpg/960px-Gortyn_Agios_Titos.jpg' },
                { name: 'Byzantinische Kreuzkuppel- und Freskenkirche', desc: 'Kompakter Bau über kreuzförmigem Grundriss bzw. mit mehreren Schiffen, innen vollständig ausgemalt. Hauptwerk auf Kreta: Panagia Kera bei Kritsa (13./14. Jh.) mit den bedeutendsten byzantinischen Fresken der Insel (Tag 3). Fachbegriffe: Narthex (Vorhalle), Bema (Altarraum), Ikonostase (Bilderwand), Pantokrator (Christus in der Kuppel).', img: '/kreta-trip/bilder/kritsa.jpg' },
                { name: 'Venezianische Kloster- und Kirchenfassade', desc: 'Unter venezianischer Herrschaft (1204–1669) verbinden sich Renaissance- und Barockformen mit orthodoxer Tradition. Prunkstück: die Fassade der Klosterkirche von Moni Arkadi (1587) mit Doppelportal, korinthischen Säulchen und geschwungenem Glockengiebel (Tag 6).', img: '/kreta-trip/bilder/arkadi.jpg' },
              ].map((k, i) => (
                <motion.div key={i} className="arch-card arch-card-church" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                  <div className="arch-card-church-img">
                    <img src={k.img} alt={k.name} loading="lazy" />
                  </div>
                  <h4>{k.name}</h4>
                  <p>{k.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* Gefäßformen */}
            <h3 className="arch-subtitle">Griechische Gefäßformen</h3>
            <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem' }}>
              Die griechische Keramik gliedert sich nach Verwendungszweck in Vorrats-, Misch-, Schöpf-, Trink- und Salbgefäße.
              Prächtige Exemplare sehen wir im Archäologischen Museum Heraklion (Tag 8) und im Museum von Sitia (Tag 2).
            </p>
            <div className="arch-grid arch-grid-3">
              {([
                { name: 'Amphore', greek: 'ἀμφορεύς · amphoreús', zweck: 'Vorratsgefäß', desc: 'Zweihenkelig, eiförmiger Bauch, enger Hals. Für Wein, Öl und Honig. Die Panathenäische Preisamphore wurde als Wettkampfpreis überreicht.', museum: 'Arch. Museum Heraklion', img: 'https://upload.wikimedia.org/wikipedia/commons/4/49/Amphorae_retouched.jpg' },
                { name: 'Hydria', greek: 'ὑδρία · hydrίa', zweck: 'Wassergefäß', desc: 'Dreihenkelig: zwei waagrechte Traghenkel, ein senkrechter Ausgusshenkel. Zum Wassertransport vom Brunnen; Frauen beim Füllen der Hydria ist häufiges Bildthema.', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Hydria_Hermonax_Rhodes.jpg' },
                { name: 'Krater', greek: 'κρατήρ · kratḗr', zweck: 'Mischgefäß', desc: 'Großes offenes Gefäß für das Mischen von Wein und Wasser beim Symposion. Typen: Volutenkrater, Glockenkrater, Kolonettenkrater, Kelchkrater.', museum: 'Arch. Museum Heraklion', img: 'https://upload.wikimedia.org/wikipedia/commons/9/9b/Bell-krater_rider_Louvre_G493.jpg' },
                { name: 'Kylix', greek: 'κύλιξ · kýlix', zweck: 'Trinkschale', desc: 'Flache Trinkschale mit zwei waagrechten Henkeln und langem Stiel. Das Innenmedaillon (Tondo) trägt mythologische Bilder.', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/Kylix_61.7_with_Helen_and_Hermes%2C_ca._420_BC%2C_part_of_the_Vassil_Bojkov_collection%2C_Sofia%2C_Bulgaria.png' },
                { name: 'Lekythos', greek: 'λήκυθος · lḗkythos', zweck: 'Öl- / Grabgefäß', desc: 'Schlanke Ölflasche mit engem Hals. Weißgrundige Lekythen mit polychromer Bemalung wurden ausschließlich als Grabbeigaben verwendet.', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Apollonia_Painter_-_Red-Figure_%22Kerch%22-Style_Lekythos_-_Walters_4884_-_Right.jpg' },
                { name: 'Oinochoe', greek: 'οἰνοχόη · oinochóē', zweck: 'Weinkanne', desc: 'Weinkrug mit einem Henkel, oft Kleeblatt-Mündung (trilobos). Diente zum Einschenken beim Symposion. Varianten: Olpe (schlank), Chus (bauchig).', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/7/72/Oinoche_Camiros_fantastic_Louvre_A318.jpg' },
                { name: 'Skyphos', greek: 'σκύφος · skýphos', zweck: 'Trinkbecher', desc: 'Tiefer Trinkbecher mit zwei waagrechten Henkeln. Alltägliches Trinkgefäß; mit Herakles assoziiert. Variante Kotyle: mit hohem Fuß.', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Skyphos_Boscoreale_Louvre_Bj2367.jpg' },
                { name: 'Stamnos', greek: 'σταμνός · stamnós', zweck: 'Vorratsgefäß', desc: 'Breites Vorratsgefäß mit kurzem Hals und zwei waagrechten Henkeln. Für Wein; seltener als die Amphore.', museum: '', img: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Stamnos_tripod_Louvre_G180.jpg' },
                { name: 'Pithos', greek: 'πίθος · píthos', zweck: 'Großspeicher', desc: 'Mannshohes Vorratsfass aus Ton – das Markenzeichen der minoischen Palastwirtschaft: In den Magazinen von Knossos, Malia und Kato Zakros stehen sie noch in situ (Tage 2/3/5).', museum: 'Knossos · Malia · Kato Zakros', img: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Knossos_-_North_Entrance_of_the_palace.jpg' },
              ] as { name: string; greek: string; zweck: string; desc: string; museum: string; img: string }[]).map((v, i) => (
                <motion.div key={i} className="arch-card arch-card-church" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                  <div className="arch-card-church-img arch-card-vessel-img">
                    <img src={v.img} alt={v.name} loading="lazy" />
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'baseline', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <h4 style={{ margin: 0 }}>{v.name}</h4>
                    <span className="arch-gefaesse-zweck">{v.zweck}</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#c9a227', fontStyle: 'italic', marginBottom: '0.4rem' }}>{v.greek}</div>
                  <p>{v.desc}</p>
                  {v.museum && <div className="arch-beispiel">📍 {v.museum}</div>}
                </motion.div>
              ))}
            </div>

            {/* Dekorstile */}
            <h3 className="arch-subtitle">Dekorstile der griechischen Vasenmalerei</h3>
            <div className="arch-grid arch-grid-3">
              {([
                { name: 'Schwarzfigurig', zeit: 'ca. 700–480 v. Chr.', desc: 'Figuren in schwarzem Firnis auf rotem Tongrund. Details durch Einritzen (Sgraffito) gearbeitet; weißer Schlicker für Frauenhaut. Entstanden in Korinth und Athen; häufige Grabbeigabe.', img: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Herakles_Geryon_Staatliche_Antikensammlungen_1379.jpg' },
                { name: 'Rotfigurig', zeit: 'ab ca. 530 v. Chr.', desc: 'Figuren bleiben im Tonrot, Hintergrund schwarz gefirnisst. Körperdetails mit dem Pinsel frei gemalt – ermöglicht naturalistischere Zeichnung. Technik erfunden in Athen.', img: 'https://upload.wikimedia.org/wikipedia/commons/3/33/Cup_Apatouria_Louvre_G138.jpg' },
                { name: 'Weißgrundig', zeit: 'ab ca. 500 v. Chr.', desc: 'Weißer Kalkschlicker als Grundierung, darüber polychrome Bemalung. Sehr fragil – fast ausschließlich für Lekythen als Grabbeigaben; Totenklage und Abschied sind typische Themen.', img: 'https://upload.wikimedia.org/wikipedia/commons/2/2c/Loutrophoros_Louvre_CA1960.jpg' },
              ] as { name: string; zeit: string; desc: string; img: string }[]).map((d, i) => (
                <motion.div key={i} className="arch-card arch-card-church" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                  <div className="arch-card-church-img">
                    <img src={d.img} alt={d.name} loading="lazy" />
                  </div>
                  <h4>{d.name}</h4>
                  <div style={{ fontSize: '0.78rem', color: '#c9a227', marginBottom: '0.4rem' }}>{d.zeit}</div>
                  <p>{d.desc}</p>
                </motion.div>
              ))}
            </div>

            </motion.div>)}
            </AnimatePresence>

            {/* ── Galerie kretischer Persönlichkeiten (aus Kreta-Heft, Teil 1) ── */}
            <div className={`arch-header${personenOpen ? '' : ' collapsed'}`} onClick={() => setPersonenOpen(!personenOpen)}>
              <h3>
                <span className="arch-header-icon"><Users size={22} /></span>
                <span className="arch-header-title">Galerie kretischer Persönlichkeiten</span>
                <span className="arch-chevron-area">
                  <span className="arch-toggle-hint">{personenOpen ? 'Einklappen' : 'Aufklappen'}</span>
                  {personenOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </span>
              </h3>
              <p>Bedeutende Menschen Kretas – zum Aufklappen antippen</p>
            </div>

            <AnimatePresence>
            {personenOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
              <div className="personen-grid">
                {personenDaten.map((p, i) => (
                  <motion.div key={i} className={`person-card${expandedPerson === i ? ' person-card-open' : ''}`} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <div className="person-card-header" style={{ borderColor: p.farbe }} onClick={() => setExpandedPerson(expandedPerson === i ? null : i)}>
                      <img src={p.bild} alt={p.name} className="person-thumb" loading="lazy" />
                      <div className="person-name-block">
                        <h4 className="person-name">{p.name}</h4>
                        <span className="person-lebensdaten" style={{ color: p.farbe }}>{p.lebensdaten}</span>
                        <span className="person-kategorie" style={{ background: p.farbe }}>{p.kategorie}</span>
                      </div>
                      <div className="person-header-right">
                        {expandedPerson === i ? <ChevronUp size={16} style={{ color: p.farbe, flexShrink: 0 }} /> : <ChevronDown size={16} style={{ color: p.farbe, flexShrink: 0 }} />}
                      </div>
                    </div>
                    <AnimatePresence>
                      {expandedPerson === i && (
                        <motion.div className="person-card-body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                          <div className="person-body-inner">
                            <img src={p.bild} alt={p.name} className="person-body-img" loading="lazy" />
                            <div>
                              <p className="person-beschreibung">{p.beschreibung}</p>
                              <div className="person-kreta">🏛 <strong>Kreta-Bezug:</strong> {p.kreta}</div>
                              <div className="person-herkunft"><MapPin size={13} /> {p.herkunft}</div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>)}
            </AnimatePresence>

            {/* ── Flora & Fauna Kretas (Struktur wie Sizilien-Seite, aufklappbar) ── */}
            <div className={`arch-header${naturOpen ? '' : ' collapsed'}`} onClick={() => setNaturOpen(!naturOpen)}>
              <h3>
                <span className="arch-header-icon">🌿</span>
                <span className="arch-header-title">Flora &amp; Fauna Kretas</span>
                <span className="arch-chevron-area">
                  <span className="arch-toggle-hint">{naturOpen ? 'Einklappen' : 'Aufklappen'}</span>
                  {naturOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </span>
              </h3>
              <p>Vom uralten Olivenbaum bis zum Kri-Kri – die Natur der Insel</p>
            </div>

            <AnimatePresence>
            {naturOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>

              <h3 className="arch-subtitle">🌱 Markante Pflanzen Kretas</h3>
              <div className="arch-grid arch-grid-3">
                {naturFlora.map((p, i) => (
                  <motion.div key={i} className="arch-card arch-card-church" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <div className="arch-card-church-img">
                      <img src={p.img} alt={p.name} loading="lazy" className="arch-card-natur-img" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.1rem' }}>
                      <span className="natur-badge natur-badge-flora">Pflanze</span>
                      {p.tipp && <span className="natur-badge natur-badge-tipp">🗺 Route-Tipp</span>}
                    </div>
                    <div className="natur-lat">{p.lat}</div>
                    <h4 style={{ margin: '0 0 0.3rem 0' }}>{p.name}</h4>
                    <p style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>{p.desc}</p>
                    <div className="arch-beispiel" style={{ marginTop: '0.4rem' }}>📍 {p.ort}</div>
                  </motion.div>
                ))}
              </div>

              <h3 className="arch-subtitle" style={{ marginTop: '2rem' }}>🦅 Tiere Kretas – Land, Luft &amp; Meer</h3>
              <div className="arch-grid arch-grid-3">
                {naturFauna.map((t, i) => (
                  <motion.div key={i} className="arch-card arch-card-church" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                    <div className="arch-card-church-img">
                      <img src={t.img} alt={t.name} loading="lazy" className="arch-card-natur-img" />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.1rem' }}>
                      <span className="natur-badge natur-badge-fauna">Tier</span>
                      {t.tipp && <span className="natur-badge natur-badge-tipp">🗺 Route-Tipp</span>}
                    </div>
                    <div className="natur-lat">{t.lat}</div>
                    <h4 style={{ margin: '0 0 0.3rem 0' }}>{t.name}</h4>
                    <p style={{ fontSize: '0.82rem', lineHeight: 1.55 }}>{t.desc}</p>
                    <div className="arch-beispiel" style={{ marginTop: '0.4rem' }}>📍 {t.ort}</div>
                  </motion.div>
                ))}
              </div>

            </motion.div>)}
            </AnimatePresence>

            {/* ── Zeittafel Kretas (aus dem Kreta-Heft, aufklappbar) ── */}
            <div className={`arch-header${zeittafelOpen ? '' : ' collapsed'}`} onClick={() => setZeittafelOpen(!zeittafelOpen)}>
              <h3>
                <span className="arch-header-icon"><Clock size={22} /></span>
                <span className="arch-header-title">Zeittafel Kretas</span>
                <span className="arch-chevron-area">
                  <span className="arch-toggle-hint">{zeittafelOpen ? 'Einklappen' : 'Aufklappen'}</span>
                  {zeittafelOpen ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                </span>
              </h3>
              <p>Acht Jahrtausende Geschichte – nach der Zeittafel aus dem Kreta-Heft</p>
            </div>

            <AnimatePresence>
            {zeittafelOpen && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
              <div className="timeline">
                {zeittafelDaten.map((epoche, ei) => {
                  const epocheOpen = expandedEpochen.includes(ei)
                  return (
                    <div key={ei} className="timeline-epoche">
                      <div className="timeline-epoche-header" style={{ borderLeftColor: epoche.farbe }} onClick={() => toggleEpoche(ei)}>
                        <div>
                          <h3 style={{ color: epoche.farbe }}>{epoche.epoche}</h3>
                          <span className="timeline-epoche-zeitraum">{epoche.zeitraum}</span>
                        </div>
                        {epocheOpen ? <ChevronUp size={18} style={{ color: epoche.farbe }} /> : <ChevronDown size={18} style={{ color: epoche.farbe }} />}
                      </div>
                      <AnimatePresence>
                        {epocheOpen && (
                          <motion.div className="timeline-ereignisse" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                            {epoche.ereignisse.map((e, i) => (
                              <div key={i} className="timeline-item">
                                <div className="timeline-dot" style={{ background: epoche.farbe }} />
                                <div className="timeline-content">
                                  <span className="timeline-datum" style={{ color: epoche.farbe }}>{e.datum}</span>
                                  <p className="timeline-text">{e.text}</p>
                                </div>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            </motion.div>)}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* 7. GLOSSAR */}
      <section id="glossar" style={{ background: 'white' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="section-title"><Languages size={28} /> Glossar</h2>
            <div className="section-divider" />
            <p style={{ color: '#6b7280', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              Sprachführer Deutsch ↔ Neugriechisch (aus dem Kreta-Reiseheft) – mit Aussprachehilfe.
            </p>
            <div className="wissen-tabs">
              {glossarKategorien.map((k, i) => (
                <button
                  key={i}
                  className={`wissen-tab ${glossarKat === i ? 'active' : ''}`}
                  onClick={() => setGlossarKat(i)}
                >
                  {k.name}
                </button>
              ))}
            </div>
            <div className="glossar-list">
              {glossarKategorien[glossarKat].eintraege.map((g, i) => (
                <div key={i} className="glossar-entry">
                  <span className="glossar-german">{g.deutsch}</span>
                  <span className="glossar-greek">{g.griechisch}</span>
                  <span className="glossar-aussprache">[{g.aussprache}]</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 8. KARTEN & PLÄNE */}
      <section id="karten" style={{ background: '#f9fafb' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="section-title"><Map size={28} /> Karten & Pläne</h2>
            <div className="section-divider" />
            <p style={{ color: '#6b7280', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Die komplette Route mit allen Haltepunkten, farblich nach Tagen unterschieden.
              Fahre mit der Maus über das Höhenprofil – der rote Punkt zeigt die Position auf der Karte.
            </p>
            <Suspense fallback={
              <div style={{ background: 'white', borderRadius: 12, padding: '3rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
                <Map size={48} color="#d1d5db" />
                <p style={{ color: '#9ca3af', marginTop: '1rem' }}>Karte wird geladen …</p>
              </div>
            }>
              <RouteMap />
            </Suspense>

            {/* Karten- und Plan-Galerie (Fotos aus dem Bilderordner, aufklappbar) */}
            {kartenGruppen.map((g, gi) => {
              const open = openKartenGruppen.includes(gi)
              return (
                <div key={gi}>
                  <div className={`arch-header${open ? '' : ' collapsed'}`} onClick={() => toggleKartenGruppe(gi)} style={{ marginTop: gi === 0 ? '2.5rem' : '1rem', marginBottom: open ? '1.5rem' : '0' }}>
                    <h3>
                      <span className="arch-header-icon">{g.icon}</span>
                      <span className="arch-header-title">{g.gruppe}</span>
                      <span className="arch-chevron-area">
                        <span className="arch-toggle-hint">{open ? 'Einklappen' : 'Aufklappen'}</span>
                        {open ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                      </span>
                    </h3>
                    <p>{g.karten.length} Karten – zum Öffnen in voller Auflösung antippen</p>
                  </div>
                  <AnimatePresence>
                  {open && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: 'hidden' }}>
                    <div className="karten-grid">
                      {g.karten.map((k, i) => (
                        <a key={i} href={k.bild} target="_blank" rel="noopener noreferrer" className="karten-card">
                          <div className="karten-card-img">
                            <img src={k.bild} alt={k.titel} loading="lazy" />
                          </div>
                          <div className="karten-card-body">
                            <div className="karten-card-title">{k.titel}</div>
                            {k.tag && <span className="karten-card-tag">{k.tag}</span>}
                          </div>
                          <div className="karten-card-open"><ExternalLink size={14} /> Öffnen</div>
                        </a>
                      ))}
                    </div>
                  </motion.div>)}
                  </AnimatePresence>
                </div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <p>Griechisch-Exkursion Kreta 2026 · Privatgymnasium der Herz-Jesu-Missionare</p>
      </footer>
    </>
  )
}
