import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Hotel, ChevronDown, ChevronUp, Menu, X,
  UtensilsCrossed, BookOpen, Languages,
  Navigation, ExternalLink, Info, Globe,
  Map, FileText
} from 'lucide-react'
import './App.css'

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
  { value: '5', label: 'Exkursionstage' },
  { value: '260+', label: 'Sonnentage/Jahr' },
]

interface Reisetag {
  tag: number
  datum: string
  titel: string
  ort: string
  hotel?: { name: string; url: string }
  stops: string[]
  farbe: string
}

const reiseroute: Reisetag[] = [
  {
    tag: 1,
    datum: '– . Juli 2026',
    titel: `Ankunft & Heraklion`,
    ort: 'Heraklion',
    hotel: { name: `Hotel in Heraklion`, url: `https://maps.google.com/?q=Heraklion+Kreta` },
    stops: [
      `Ankunft Flughafen Heraklion`,
      `Transfer zum Hotel`,
      `Abendspaziergang am venezianischen Hafen`,
      `Abendessen im Zentrum`,
    ],
    farbe: '#1a6b9e',
  },
  {
    tag: 2,
    datum: '– . Juli 2026',
    titel: `Knossos & Heraklion`,
    ort: 'Heraklion',
    hotel: { name: `Hotel in Heraklion`, url: `https://maps.google.com/?q=Heraklion+Kreta` },
    stops: [
      `Palast von Knossos – Minoische Hochkultur`,
      `Archäologisches Museum Heraklion`,
      `Venezianische Loggia und Morosini-Brunnen`,
      `Festung Koules am Hafen`,
    ],
    farbe: '#2d6b4a',
  },
  {
    tag: 3,
    datum: '– . Juli 2026',
    titel: `Samaria-Schlucht`,
    ort: 'Westkretal',
    hotel: { name: `Hotel in Chania`, url: `https://maps.google.com/?q=Chania+Kreta` },
    stops: [
      `Fahrt nach Omalos (Hochplateau)`,
      `Wanderung Samaria-Schlucht (16 km)`,
      `Agia Roumeli am Libyschen Meer`,
      `Bootsfahrt nach Hora Sfakion`,
    ],
    farbe: '#8b4a1a',
  },
  {
    tag: 4,
    datum: '– . Juli 2026',
    titel: `Chania & Aptera`,
    ort: 'Chania',
    hotel: { name: `Hotel in Chania`, url: `https://maps.google.com/?q=Chania+Kreta` },
    stops: [
      `Altstadt Chania – Venezianischer Hafen`,
      `Archäologisches Museum Chania`,
      `Aptera – antike griechisch-römische Ruinen`,
      `Abendessen in der Altstadt Chania`,
    ],
    farbe: '#6b1a8b',
  },
  {
    tag: 5,
    datum: '– . Juli 2026',
    titel: `Rethymno & Abflug`,
    ort: 'Rethymno / Heraklion',
    stops: [
      `Altstadt Rethymno`,
      `Venezianische Festung (Fortezza)`,
      `Lighthouse und Hafen`,
      `Transfer Flughafen Heraklion – Heimflug`,
    ],
    farbe: '#1a8b6b',
  },
]

interface Restaurant {
  name: string
  ort: string
  bewertung: number
  spezialitaet: string
  note: string
}

const restaurants: Restaurant[] = [
  {
    name: `Peskesi`,
    ort: `Heraklion`,
    bewertung: 5,
    spezialitaet: `Traditionelle kretische Küche`,
    note: `Eines der besten Restaurants für authentische kretische Küche mit historischem Ambiente`,
  },
  {
    name: `To Maereio`,
    ort: `Chania`,
    bewertung: 4,
    spezialitaet: `Mezedes & Gegrilltes`,
    note: `Einfaches Lokal mit frischen Zutaten vom Markt`,
  },
  {
    name: `Thalassino Ageri`,
    ort: `Chania`,
    bewertung: 5,
    spezialitaet: `Frischer Fisch & Meeresfrüchte`,
    note: `Am Meer gelegen, täglich frischer Fang`,
  },
]

interface Speise {
  name: string
  beschreibung: string
  bild: string
}

const speisen: Speise[] = [
  {
    name: `Dakos`,
    beschreibung: `Kretischer Zwieback (Paximadi) mit Tomaten, Mizithra-Käse und Olivenöl – das kretische Nationalgericht.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Dakos_greek_food.jpg/800px-Dakos_greek_food.jpg`,
  },
  {
    name: `Gamopilafo`,
    beschreibung: `Hochzeitsreis – mit Hammel- oder Ziegenfleisch-Bouillon gekochter Reis, traditionell bei Hochzeiten auf Kreta serviert.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Pilaf_rice.jpg/800px-Pilaf_rice.jpg`,
  },
  {
    name: `Apaki`,
    beschreibung: `Geräuchertes und mariniertes Schweinefleisch, charakteristisches kretisches Wurstwaren-Produkt.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Prosciutto_di_Parma.jpg/800px-Prosciutto_di_Parma.jpg`,
  },
  {
    name: `Kalitsounia`,
    beschreibung: `Kleine Teigtaschen, gefüllt mit Mizithra-Käse und frischen Kräutern – typisches Ostergericht Kretas.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Cheese_pastry.jpg/800px-Cheese_pastry.jpg`,
  },
  {
    name: `Sfakianes Pites`,
    beschreibung: `Pfannkuchen aus Sfakia, gefüllt mit Anthotiro-Käse, mit Honig und Zimt serviert.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Sfakianopita.jpg/800px-Sfakianopita.jpg`,
  },
  {
    name: `Stamnagathi`,
    beschreibung: `Wilder Chicorée, nur auf Kreta vorkommend – roh oder gedämpft mit Olivenöl und Zitrone.`,
    bild: `https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Cichorium_spinosum.jpg/800px-Cichorium_spinosum.jpg`,
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
    titel: `Minos – König und Gesetzgeber`,
    autor: `Thukydides`,
    epoche: `5. Jh. v. Chr.`,
    original: `Μίνως γὰρ παλαίτατος ὧν ἀκοῇ ἴσμεν ναυτικὸν ἐκτήσατο...`,
    uebersetzung: `Minos nämlich ist der älteste, von dem wir durch Überlieferung wissen, dass er eine Flotte besaß und die meisten Gewässer kontrollierte...`,
    kommentar: `Thukydides beschreibt Minos als ersten Thalassokraten der griechischen Geschichte. Die minoische Seeherrschaft war die Grundlage für den kretischen Handel und die kulturelle Ausstrahlung im östlichen Mittelmeer.`,
  },
  {
    titel: `Das Labyrinth des Minotauros`,
    autor: `Ovid`,
    epoche: `1. Jh. v. Chr.`,
    original: `Clausit in hac monstrum Gortynia Daedalus aula, dissimilem nati supposuitque suem.`,
    uebersetzung: `In diesem Palast sperrte der kretische Daedalus das Ungeheuer ein und band eine Sau an, die dem Kind unähnlich war.`,
    kommentar: `Der Minotaurus-Mythos spiegelt historische Realität wider: Kreta als Tributmacht über die griechischen Festlandsstädte, symbolisiert im Menschenopfer an das Ungeheuer im Labyrinth.`,
  },
  {
    titel: `Odysseus auf Kreta`,
    autor: `Homer`,
    epoche: `8. Jh. v. Chr.`,
    original: `Κρήτη τις γαῖ᾽ ἔστι, μέσῳ ἐνὶ οἴνοπι πόντῳ, καλὴ καὶ πίειρα, περίρρυτος·`,
    uebersetzung: `Es gibt ein Land namens Kreta, mitten im weinfarbenen Meer, schön und fruchtbar, ringsum vom Wasser umgeben.`,
    kommentar: `Homer beschreibt Kreta als 100-Städte-Insel (ἑκατόμπολις). Der Odysseus-Bericht in der Odyssee spiegelt die strategische Bedeutung Kretas als Knotenpunkt des ägäischen Seeverkehrs.`,
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

const zeittafel: LexikonEintrag[] = [
  { term: `ca. 3000 v. Chr.`, definition: `Frühminoische Zeit: erste Besiedlung der Insel durch Vorgriechische Bevölkerung` },
  { term: `2000–1700 v. Chr.`, definition: `Altpalastzeit: Entstehung der Paläste von Knossos, Phaistos und Malia` },
  { term: `1700–1450 v. Chr.`, definition: `Neupalastzeit: Blütezeit der minoischen Hochkultur, Palaststil und Wandmalerei` },
  { term: `1450 v. Chr.`, definition: `Vulkanausbruch Thera (Santorin) und mykenische Übernahme Kretas` },
  { term: `1100 v. Chr.`, definition: `Zusammenbruch der mykenischen Zivilisation, Beginn der Dunklen Jahrhunderte` },
  { term: `67 v. Chr.`, definition: `Römische Eroberung Kretas unter Quintus Caecilius Metellus (Creticus)` },
  { term: `824–961 n. Chr.`, definition: `Arabische Herrschaft auf Kreta (Emirat von Kreta)` },
  { term: `1204–1669`, definition: `Venezianische Herrschaft auf Kreta (Herzogtum Kandia)` },
  { term: `1669–1898`, definition: `Osmanische Herrschaft auf Kreta` },
  { term: `1913`, definition: `Eingliederung Kretas in den griechischen Staat` },
  { term: `1941–1945`, definition: `Deutsche Besatzung, Luftlandung bei Maleme (Unternehmen Merkur)` },
]

interface GlossarEintrag {
  griechisch: string
  deutsch: string
}

const glossar: GlossarEintrag[] = [
  { griechisch: `ἀγορά (agorá)`, deutsch: `Marktplatz, Volksversammlung` },
  { griechisch: `ἄκρα (ákra)`, deutsch: `Kap, Vorgebirge` },
  { griechisch: `ἀνάκτορον (anáktoron)`, deutsch: `Palast, Herrscherresidenz` },
  { griechisch: `γλαῦκα (glaúka)`, deutsch: `blaugrau, meeresfarben` },
  { griechisch: `δαίδαλος (daídalos)`, deutsch: `kunstvoll gearbeitet; Eigenname Daidalos` },
  { griechisch: `θάλασσα (thálassa)`, deutsch: `Meer, See` },
  { griechisch: `κρήτη (Krḗtē)`, deutsch: `Kreta (Inselname)` },
  { griechisch: `λαβύρινθος (labýrinthos)`, deutsch: `Labyrinth (vorgrch. Lehnwort: Haus der Doppelaxt)` },
  { griechisch: `μίνως (Mínōs)`, deutsch: `Minos (Königsname und Titel)` },
  { griechisch: `νῆσος (nêsos)`, deutsch: `Insel` },
  { griechisch: `ξένος (xénos)`, deutsch: `Fremder, Gast; Gastfreundschaft` },
  { griechisch: `ὄλυμπος (Ólympos)`, deutsch: `Olympos (Götterberg)` },
  { griechisch: `πόλις (pólis)`, deutsch: `Stadt, Stadtstaat` },
  { griechisch: `τέκτων (téktōn)`, deutsch: `Zimmermann, Handwerker, Erbauer` },
]

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function StarRating({ n }: { n: number }) {
  return (
    <div className="stars">
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </div>
  )
}

function AccordionDay({ tag, open, onToggle }: { tag: Reisetag; open: boolean; onToggle: () => void }) {
  return (
    <div className="accordion-item">
      <button className="accordion-header" onClick={onToggle} style={{ borderLeft: `4px solid ${tag.farbe}` }}>
        <div>
          <div className="day-label" style={{ color: tag.farbe }}>Tag {tag.tag} · {tag.datum}</div>
          <div className="day-title">{tag.titel}</div>
          <div className="day-sub">{tag.ort}</div>
        </div>
        {open ? <ChevronUp size={18} color="#6b7280" /> : <ChevronDown size={18} color="#6b7280" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="accordion-body"
          >
            <ul className="stop-list">
              {tag.stops.map((s, i) => (
                <li key={i} className="stop-item">
                  <span className="stop-dot" />
                  {s}
                </li>
              ))}
            </ul>
            {tag.hotel && (
              <a href={tag.hotel.url} target="_blank" rel="noopener noreferrer" className="hotel-chip">
                <Hotel size={13} /> {tag.hotel.name} <ExternalLink size={11} />
              </a>
            )}
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
  const [openDay, setOpenDay] = useState<number | null>(null)
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [wissenTab, setWissenTab] = useState<'architektur' | 'kulinarisch' | 'zeittafel'>('architektur')
  const [glossarFilter, setGlossarFilter] = useState<string | null>(null)
  const carouselTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  // auto-rotate carousel
  useEffect(() => {
    carouselTimer.current = setInterval(() => {
      setCarouselIdx(i => (i + 1) % speisen.length)
    }, 7000)
    return () => { if (carouselTimer.current) clearInterval(carouselTimer.current) }
  }, [])

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

  const wissenData = wissenTab === 'architektur' ? architekturLexikon
    : wissenTab === 'kulinarisch' ? kulinarischesLexikon
    : zeittafel

  const glossarLetters = [...new Set(glossar.map(g => g.griechisch[0].toUpperCase()))].sort()
  const filteredGlossar = glossarFilter
    ? glossar.filter(g => g.griechisch[0].toUpperCase() === glossarFilter)
    : glossar

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
            {reiseroute.map(tag => (
              <AccordionDay
                key={tag.tag}
                tag={tag}
                open={openDay === tag.tag}
                onToggle={() => setOpenDay(openDay === tag.tag ? null : tag.tag)}
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
                    <StarRating n={r.bewertung} />
                    <h3>{r.name}</h3>
                    <div className="restaurant-meta"><MapPin size={12} style={{ display: 'inline' }} /> {r.ort}</div>
                    <div className="restaurant-specialty">{r.spezialitaet}</div>
                    <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem', lineHeight: 1.5 }}>{r.note}</p>
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
            <div style={{ background: 'white', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={carouselIdx}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.4 }}
                  className="carousel-slide"
                >
                  <img
                    src={speisen[carouselIdx].bild}
                    alt={speisen[carouselIdx].name}
                    className="carousel-image"
                    onError={e => { (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&q=60` }}
                  />
                  <div className="carousel-text">
                    <h3>{speisen[carouselIdx].name}</h3>
                    <p>{speisen[carouselIdx].beschreibung}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="carousel-dots">
                {speisen.map((_, i) => (
                  <button
                    key={i}
                    className={`carousel-dot ${i === carouselIdx ? 'active' : ''}`}
                    onClick={() => { setCarouselIdx(i); if (carouselTimer.current) clearInterval(carouselTimer.current) }}
                  />
                ))}
              </div>
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
              {(['architektur', 'kulinarisch', 'zeittafel'] as const).map(tab => (
                <button
                  key={tab}
                  className={`wissen-tab ${wissenTab === tab ? 'active' : ''}`}
                  onClick={() => setWissenTab(tab)}
                >
                  {tab === 'architektur' ? 'Architektur-Lexikon' : tab === 'kulinarisch' ? 'Kulinarisches Lexikon' : 'Zeittafel'}
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
          </motion.div>
        </div>
      </section>

      {/* 7. GLOSSAR */}
      <section id="glossar" style={{ background: 'white' }}>
        <div className="section-container">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
            <h2 className="section-title"><Languages size={28} /> Glossar</h2>
            <div className="section-divider" />
            <div className="glossar-filter">
              <button className={`glossar-letter ${!glossarFilter ? 'active' : ''}`} onClick={() => setGlossarFilter(null)}>A–Z</button>
              {glossarLetters.map(l => (
                <button
                  key={l}
                  className={`glossar-letter ${glossarFilter === l ? 'active' : ''}`}
                  onClick={() => setGlossarFilter(l === glossarFilter ? null : l)}
                >
                  {l}
                </button>
              ))}
            </div>
            <div className="glossar-list">
              {filteredGlossar.map((g, i) => (
                <div key={i} className="glossar-entry">
                  <span className="glossar-greek">{g.griechisch}</span>
                  <span className="glossar-german">{g.deutsch}</span>
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
              Interaktive Routenkarte und Höhenprofil – GPX-Daten werden nach Festlegung der Route ergänzt.
            </p>
            <div style={{ background: 'white', borderRadius: 12, padding: '3rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <Map size={48} color="#d1d5db" />
              <p style={{ color: '#9ca3af', marginTop: '1rem' }}>GPX-Routenkarte wird nach Festlegung der Reiseroute ergänzt.</p>
            </div>
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
