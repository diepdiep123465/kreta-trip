import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MapPin, Hotel, ChevronDown, ChevronUp, Menu, X,
  UtensilsCrossed, BookOpen, Languages,
  Navigation, Info, Globe,
  Map, FileText, Music
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

interface DayData {
  day: number
  date: string
  weekday: string
  title: string
  image: string
  hotel?: string
  hotelData?: HotelData
  stops: StopData[]
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
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Psychro-Cave_Lasithi-Plateau_20230608_131004.jpg/1280px-Psychro-Cave_Lasithi-Plateau_20230608_131004.jpg`,
    hotel: 'Hotel Coriva Beach, Ierapetra (N/F)',
    hotelData: corivaHotel,
    stops: [
      { name: 'Flug Salzburg – Heraklion', desc: 'Anreise per Flugzeug auf die größte griechische Insel' },
      { name: 'Lassithi-Hochebene', desc: 'Fahrt über die landschaftlich reizvolle Hochebene mit ihren Windmühlen und Obstgärten', km: '95 km' },
      { name: 'Zeus-Höhle', desc: 'Diktäische Grotte (Psychro) – der mythische Geburtsort des Zeus', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Psychro_Cave%2C_051240x.jpg/960px-Psychro_Cave%2C_051240x.jpg` },
      { name: 'Ierapetra', desc: 'Südlichste Stadt Europas – Ankunft im Hotel Coriva Beach', km: '80 km' },
    ],
  },
  {
    day: 2, date: '18. Juli', weekday: 'Samstag',
    title: 'Ostkreta: Gournia – Sitia – Kato Zakros – Vai',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Vai_R01.jpg/1280px-Vai_R01.jpg`,
    hotel: 'Hotel Coriva Beach, Ierapetra (N/F)',
    hotelData: corivaHotel,
    stops: [
      { name: 'Gournia', desc: 'Vollständig ausgegrabene minoische Stadt mit Gassen und Wohnhäusern', km: '25 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Gournia_007.jpg/960px-Gournia_007.jpg` },
      { name: 'Sitia', desc: 'Hafenstädtchen mit Archäologischem Museum', km: '50 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/SITIA-HARBOUR-CRETE-GREECE-5.jpg/960px-SITIA-HARBOUR-CRETE-GREECE-5.jpg` },
      { name: 'Kato Zakros', desc: 'Vierter minoischer Palast im äußersten Osten der Insel', km: '50 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Palace_of_Zakros_ruins.jpg/960px-Palace_of_Zakros_ruins.jpg` },
      { name: 'Vai', desc: 'Aufenthalt am berühmten Palmenstrand – Europas größter natürlicher Palmenhain', km: '40 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Vai_R01.jpg/1280px-Vai_R01.jpg` },
      { name: 'Moni Toplou', desc: 'Wehrhafte Klosteranlage aus dem 15. Jahrhundert', km: '10 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Moni_Toplou_R02.jpg/960px-Moni_Toplou_R02.jpg` },
      { name: 'Rückkehr Hotel Coriva Beach', desc: 'Abendessen im Hotel', km: '65 km' },
    ],
  },
  {
    day: 3, date: '19. Juli', weekday: 'Sonntag',
    title: 'Olous / Spinalonga – Kritsa – Lato – Malia – Agios Nikolaos',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/20090620_Spinalogka_Elounta_panoramic_view_from_the_mountain.jpg/1280px-20090620_Spinalogka_Elounta_panoramic_view_from_the_mountain.jpg`,
    hotel: 'Hotel Coriva Beach, Ierapetra (N/F)',
    hotelData: corivaHotel,
    stops: [
      { name: 'Olous / Spinalonga', desc: 'Versunkene römische Stadt und venezianische Inselfestung, später Leprakolonie', km: '65 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/20090620_Spinalogka_Elounta_panoramic_view_from_the_mountain.jpg/1280px-20090620_Spinalogka_Elounta_panoramic_view_from_the_mountain.jpg` },
      { name: 'Kritsa', desc: 'Kirche Panagia Kera mit den bedeutendsten byzantinischen Fresken Kretas', km: '20 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/%CE%A0%CE%B1%CE%BD%CE%B1%CE%B3%CE%B9%CE%AC_%CE%9A%CE%B5%CF%81%CE%AC_%CE%9A%CF%81%CE%B9%CF%84%CF%83%CE%AC_2253.jpg/960px-%CE%A0%CE%B1%CE%BD%CE%B1%CE%B3%CE%B9%CE%AC_%CE%9A%CE%B5%CF%81%CE%AC_%CE%9A%CF%81%CE%B9%CF%84%CF%83%CE%AC_2253.jpg` },
      { name: 'Lato', desc: 'Dorische Stadtanlage mit Blick über den Golf von Mirabello', km: '5 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Lato_-_Prytaneion_03.jpg/960px-Lato_-_Prytaneion_03.jpg` },
      { name: 'Malia', desc: 'Dritter großer minoischer Palast mit dem berühmten Opfertisch (Kernos)', km: '35 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Malia%2C_Minoan_palace%2C_exhibition_hall.jpg/960px-Malia%2C_Minoan_palace%2C_exhibition_hall.jpg` },
      { name: 'Agios Nikolaos', desc: 'Malerische Stadt am See Voulismeni', km: '15 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Lake_Voulismeni%2C_Agios_Nikolaos%2C_Crete%2C_Sept_2019.jpg/960px-Lake_Voulismeni%2C_Agios_Nikolaos%2C_Crete%2C_Sept_2019.jpg` },
      { name: 'Badeaufenthalt Hotel Coriva Beach', desc: 'Entspannung am Hotelstrand', km: '55 km' },
    ],
  },
  {
    day: 4, date: '20. Juli', weekday: 'Montag',
    title: 'Messara-Ebene: Gortyn – Festos – Agia Triada – Matala',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Festos_kreta_2016-05-11_%281%29.jpg/1280px-Festos_kreta_2016-05-11_%281%29.jpg`,
    hotel: 'Dedalos Beach Hotel, Sfakaki (N/F)',
    hotelData: dedalosHotel,
    stops: [
      { name: 'Gortyn', desc: 'Römische Provinzhauptstadt mit dem berühmten Gesetzeskodex und der Zeusplatane', km: '105 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Gortyn_Agios_Titos.jpg/960px-Gortyn_Agios_Titos.jpg` },
      { name: 'Festos', desc: 'Zweitgrößter minoischer Palast, Fundort des rätselhaften Diskos von Phaistos', km: '20 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/Festos_kreta_2016-05-11_%281%29.jpg/1280px-Festos_kreta_2016-05-11_%281%29.jpg` },
      { name: 'Agia Triada', desc: 'Minoische Palastvilla mit bedeutenden Funden (Boxer-Rhyton, Schnittervase)', km: '5 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Agia_Triada%2C_145788.jpg/960px-Agia_Triada%2C_145788.jpg` },
      { name: 'Matala', desc: 'Hippiestrand mit den berühmten Höhlenwohnungen im Sandstein', km: '15 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Beach_and_troglodytes_at_Matala%2C_Crete%2C_Greece.jpg/960px-Beach_and_troglodytes_at_Matala%2C_Crete%2C_Greece.jpg` },
      { name: 'Sfakaki bei Rethymnon', desc: 'Ankunft im Dedalos Beach Hotel', km: '85 km' },
    ],
  },
  {
    day: 5, date: '21. Juli', weekday: 'Dienstag',
    title: 'Vathipetro – Jouchtas – Archanes – Knossos',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Knossos%2C_Sept._2019e.jpg/1280px-Knossos%2C_Sept._2019e.jpg`,
    hotel: 'Dedalos Beach Hotel, Sfakaki (N/F)',
    hotelData: dedalosHotel,
    stops: [
      { name: 'Vathipetro', desc: 'Minoisches Landhaus mit erhaltener Wein- und Ölpresse', km: '90 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Vathypetro_17.JPG/960px-Vathypetro_17.JPG` },
      { name: 'Berg Jouchtas', desc: 'Heiliger Berg der Minoer – im Profil das „Antlitz des Zeus"', km: '10 km' },
      { name: 'Archanes / Fourni', desc: 'Bedeutende minoische Grabanlage (Nekropole) und kleines Museum', km: '90 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/%CE%91%CF%81%CF%87%CE%AC%CE%BD%CE%B5%CF%82_7928.jpg/960px-%CE%91%CF%81%CF%87%CE%AC%CE%BD%CE%B5%CF%82_7928.jpg` },
      { name: 'Knossos', desc: 'Der größte minoische Palast – Zentrum der Kultur um König Minos und das Labyrinth', km: '10 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Knossos%2C_Sept._2019e.jpg/1280px-Knossos%2C_Sept._2019e.jpg` },
      { name: 'Rückkehr Hotel Dedalos', desc: 'Abendessen im Hotel', km: '85 km' },
    ],
  },
  {
    day: 6, date: '22. Juli', weekday: 'Mittwoch',
    title: 'Eleftherna – Arkadi – Preveli – Rethymnon',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/%CE%9C%CE%BF%CE%BD%CE%AE_%CE%91%CF%81%CE%BA%CE%B1%CE%B4%CE%AF%CE%BF%CF%85_5463.jpg/1280px-%CE%9C%CE%BF%CE%BD%CE%AE_%CE%91%CF%81%CE%BA%CE%B1%CE%B4%CE%AF%CE%BF%CF%85_5463.jpg`,
    hotel: 'Dedalos Beach Hotel, Sfakaki (N/F)',
    hotelData: dedalosHotel,
    stops: [
      { name: 'Eleftherna', desc: 'Minoisch-dorisch-römische Stadt mit modernem Museum', km: '25 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Archaia_Eleftherna_Crete_15.jpg/960px-Archaia_Eleftherna_Crete_15.jpg` },
      { name: 'Moni Arkadi', desc: 'Nationalheiligtum – Stätte des kretischen Widerstands von 1866', km: '10 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/%CE%9C%CE%BF%CE%BD%CE%AE_%CE%91%CF%81%CE%BA%CE%B1%CE%B4%CE%AF%CE%BF%CF%85_5463.jpg/1280px-%CE%9C%CE%BF%CE%BD%CE%AE_%CE%91%CF%81%CE%BA%CE%B1%CE%B4%CE%AF%CE%BF%CF%85_5463.jpg` },
      { name: 'Moni Preveli', desc: 'Byzantinisches Kloster hoch über dem Libyschen Meer', km: '65 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Preveli_World_War_II_Memorial.JPG/960px-Preveli_World_War_II_Memorial.JPG` },
      { name: 'Rethymnon', desc: 'Venezianische Fortezza, Altstadt und Archäologisches Museum', km: '40 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Rethymnon_Lighthouse_at_the_Entrance_to_the_old_Venetian_Harbour_in_Rethymno_Crete_20_July_2019.jpg/960px-Rethymnon_Lighthouse_at_the_Entrance_to_the_old_Venetian_Harbour_in_Rethymno_Crete_20_July_2019.jpg` },
      { name: 'Rückkehr Hotel Dedalos', desc: 'Abendessen im Hotel', km: '10 km' },
    ],
  },
  {
    day: 7, date: '23. Juli', weekday: 'Donnerstag',
    title: 'Westkreta: Aptera – Chania – Maleme – Souda',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Harbor%2C_Venetian_shipyards_and_Lighthouse_in_Chania._Crete%2C_Greece.jpg/1280px-Harbor%2C_Venetian_shipyards_and_Lighthouse_in_Chania._Crete%2C_Greece.jpg`,
    hotel: 'Dedalos Beach Hotel, Sfakaki (N/F)',
    hotelData: dedalosHotel,
    stops: [
      { name: 'Aptera', desc: 'Antike Stadt mit gewaltigen römischen Zisternen und Blick auf die Souda-Bucht', km: '60 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Aptera_cisterns.JPG/960px-Aptera_cisterns.JPG` },
      { name: 'Chania', desc: 'Venezianischer Hafen, Markthalle und Altstadt – schönste Stadt Kretas', km: '25 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Harbor%2C_Venetian_shipyards_and_Lighthouse_in_Chania._Crete%2C_Greece.jpg/1280px-Harbor%2C_Venetian_shipyards_and_Lighthouse_in_Chania._Crete%2C_Greece.jpg` },
      { name: 'Maleme', desc: 'Deutscher Soldatenfriedhof – Schauplatz der Luftlandeschlacht 1941', km: '20 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/German_war_cemetery_in_Maleme._Crete%2C_Greece.jpg/960px-German_war_cemetery_in_Maleme._Crete%2C_Greece.jpg` },
      { name: 'Souda', desc: 'Britischer Soldatenfriedhof (Souda Bay War Cemetery)', km: '30 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Souda_Bay_War_Cemetery%2C_Crete._Greece.jpg/960px-Souda_Bay_War_Cemetery%2C_Crete._Greece.jpg` },
      { name: 'Rückkehr Hotel Dedalos', desc: 'Abendessen im Hotel', km: '70 km' },
    ],
  },
  {
    day: 8, date: '24. Juli', weekday: 'Freitag',
    title: 'Heraklion – Heimreise nach Salzburg',
    image: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Building_of_the_Archaeological_Museum_of_Heraklion%2C_061381.jpg/1280px-Building_of_the_Archaeological_Museum_of_Heraklion%2C_061381.jpg`,
    stops: [
      { name: 'Heraklion', desc: 'Archäologisches Museum (die minoischen Meisterwerke) und Stadtbesichtigung', km: '75 km', image: `https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Building_of_the_Archaeological_Museum_of_Heraklion%2C_061381.jpg/1280px-Building_of_the_Archaeological_Museum_of_Heraklion%2C_061381.jpg` },
      { name: 'Transfer Flughafen Heraklion', desc: 'Fahrt zum Flughafen Nikos Kazantzakis', km: '10 km' },
      { name: 'Rückflug nach Salzburg', desc: 'Ende der Exkursion' },
    ],
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
      { deutsch: `20`, griechisch: `είκοσι`, aussprache: `íkosi` },
      { deutsch: `30`, griechisch: `τριάντα`, aussprache: `triánda` },
      { deutsch: `40`, griechisch: `σαράντα`, aussprache: `saránda` },
      { deutsch: `50`, griechisch: `πενήντα`, aussprache: `penínda` },
      { deutsch: `100`, griechisch: `εκατό`, aussprache: `ekató` },
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

function DayAccordion({ d, open, onToggle }: { d: DayData; open: boolean; onToggle: () => void }) {
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
  const [carouselIdx, setCarouselIdx] = useState(0)
  const [wissenTab, setWissenTab] = useState<'architektur' | 'kulinarisch' | 'zeittafel'>('architektur')
  const [glossarKat, setGlossarKat] = useState(0)
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
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${m.videoId}`}
                      title={m.titel}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                  <div className="musik-body">
                    <h3>{m.titel}</h3>
                    <div className="musik-interpret">{m.interpret}</div>
                    <p>{m.beschreibung}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <h3 style={{ fontSize: '1.3rem', color: '#0f4a72', marginTop: '3rem', marginBottom: '1.25rem' }}>
              Weitere griechische Klassiker zum Anhören
            </h3>
            <div className="spotify-grid">
              {spotifyTracks.map((t, i) => (
                <motion.div key={i} className="spotify-card" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn} transition={{ delay: i * 0.08 }}>
                  <iframe
                    src={`https://open.spotify.com/embed/track/${t.trackId}?theme=0`}
                    title={t.titel}
                    width="100%"
                    height="152"
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                  <div className="spotify-text">
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
