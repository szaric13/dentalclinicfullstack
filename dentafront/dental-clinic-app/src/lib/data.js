export const CLINIC = {
  name: "Dr Zarić Ordinacija",
  tagline: "Vaš osmeh u sigurnim rukama",
  phone: "+381 65 971 52 11",
  phoneHref: "+381659715211",
  phoneClinic: "+381 31 715 211",
  phoneClinicHref: "+38131715211",
  email: "dentapozega@gmail.com",
  address: "Uče Dimitrijevića 7, Požega",
  mapsQuery: "Uče+Dimitrijevića+7+Požega",
  googleRating: 4.9,
  googleReviews: 327,
  instagram: "https://instagram.com/drzaric", // dodaj pravi link
};

export const WORKING_HOURS = [
  { day: "Ponedeljak", hours: "08:00 – 19:00" },
  { day: "Utorak", hours: "08:00 – 19:00" },
  { day: "Sreda", hours: "08:00 – 19:00" },
  { day: "Četvrtak", hours: "08:00 – 19:00" },
  { day: "Petak", hours: "08:00 – 19:00" },
  { day: "Subota", hours: "08:00 – 19:00" },
  { day: "Nedelja", hours: "Zatvoreno", closed: true },
];

export const WORKING_HOURS_RULES = {
  weekday: { start: "08:00", end: "19:00" },
  saturday: { start: "08:00", end: "19:00" },
};

// SAMO PROTETIKA – dr Zarić radi samo ovo
export const SPECIALTIES = [
  {
    slug: "protetika",
    name: "Protetika",
    short: "Krunice, mostovi i estetske navlake.",
    description:
        "Fiksna stomatološka protetika obuhvata izradu krunica, mostova i navlaka od najkvalitetnijih materijala. Dr Nenad Zarić se specijalizovao za ovu oblast sa više od 25 godina iskustva, pružajući pacijentima trajna i estetski savršena rešenja za obnovu osmeha.",
  },
];

// SAMO TANJA LEKIĆ – ostale sestre izbačene
export const NURSES = [
  {
    slug: "tanja-lekic",
    name: "Tanja Lekić",
    role: "Stomatološka sestra",
    bio: "Tanja asistira u hirurškim i protetskim zahvatima i poznata je po smirenom pristupu pacijentima. Sa višegodišnjim iskustvom u ordinaciji 'Denta', Tanja je nezamenjiv deo tima dr Zarića.",
    education: "Srednja medicinska škola, smer zubni tehničar",
    image: "/images/nurse-2.png",
  },
];

export const FAQ = [
  {
    q: "Kako mogu da zakažem termin?",
    a: "Termin možete zakazati online kroz našu platformu nakon registracije, ili pozivom na broj +381 65 971 52 11. Online zakazivanje vam omogućava da odaberete uslugu i slobodan termin.",
  },
  {
    q: "Koliko košta prvi pregled?",
    a: "Prvi pregled i konsultacije se naplaćuju prema cenovniku usluge koju birate. Tačne cene svih usluga možete pogledati na stranici Usluge.",
  },
  {
    q: "Da li mogu da otkažem ili pomerim termin?",
    a: "Da. Termin možete otkazati ili pomeriti najkasnije 24 sata pre zakazanog vremena, direktno iz vašeg profila.",
  },
  {
    q: "Koje je vaše radno vreme?",
    a: "Radimo radnim danima od 08:00 do 19:00 i subotom od 08:00 do 19:00. Nedeljom ne radimo.",
  },
];

export const BLOG_POSTS = [
  {
    slug: "kako-pravilno-prati-zube",
    title: "Kako pravilno prati zube — vodič od stomatologa",
    excerpt:
        "Tehnika pranja zuba važnija je od same paste. Otkrijte kako da za dva minuta efikasno očistite svaki zub.",
    image: "/images/blog-1.png",
    date: "2025-04-12",
    author: "Dr Nenad Zarić",
    content:
        "Pravilno pranje zuba traje najmanje dva minuta i obuhvata sve površine zuba. Četkicu držite pod uglom od 45 stepeni u odnosu na desni i koristite nežne kružne pokrete. Nikako nemojte četkati prejako jer to oštećuje gleđ i povlači desni. Koristite pastu sa fluorom i menjajte četkicu na svaka tri meseca. Konac za zube i tečnost za ispiranje upotpunjuju higijenu i uklanjaju naslage tamo gde četkica ne dopire.",
  },
  {
    slug: "implantati-sve-sto-treba-da-znate",
    title: "Zubni implantati: sve što treba da znate",
    excerpt:
        "Implantati su najtrajnije rešenje za nedostajuće zube. Objašnjavamo proceduru, oporavak i trajnost.",
    image: "/images/blog-2.png",
    date: "2025-03-28",
    author: "Dr Nenad Zarić",
    content:
        "Zubni implantat je titanijumski zavrtanj koji se ugrađuje u vilicu i preuzima ulogu korena zuba. Nakon perioda zarastanja od nekoliko meseci, na implantat se postavlja krunica. Implantati su izuzetno trajni i uz dobru higijenu mogu trajati ceo život. Procedura je bezbolna zahvaljujući lokalnoj anesteziji, a oporavak je brz kod većine pacijenata.",
  },
  {
    slug: "strah-od-stomatologa",
    title: "Kako pobediti strah od stomatologa",
    excerpt:
        "Dentofobija je česta, ali rešiva. Donosimo praktične savete za opuštene posete ordinaciji.",
    image: "/images/blog-3.png",
    date: "2025-03-10",
    author: "Dr Nenad Zarić",
    content:
        "Strah od stomatologa je čest i potpuno razumljiv. Ključ je u komunikaciji — recite svom stomatologu kako se osećate. Savremene tehnike anestezije čine zahvate praktično bezbolnim. Tehnike disanja, slušanje muzike i kratki dogovoreni znaci za pauzu mogu znatno smanjiti anksioznost. Redovne posete takođe smanjuju strah jer pregledi postaju rutina.",
  },
  {
    slug: "ishrana-i-zdravlje-zuba",
    title: "Ishrana i zdravlje zuba: šta jesti, a šta izbegavati",
    excerpt:
        "Ono što jedemo direktno utiče na zdravlje zuba. Saznajte koje namirnice čuvaju, a koje oštećuju gleđ.",
    image: "/images/blog-4.png",
    date: "2025-02-20",
    author: "Dr Nenad Zarić",
    content:
        "Hrana bogata kalcijumom i fosforom, poput mlečnih proizvoda i orašastih plodova, jača gleđ. Sveže voće i povrće stimulišu lučenje pljuvačke koja prirodno čisti zube. Sa druge strane, gazirana pića, slatkiši i kisele namirnice oštećuju gleđ i pospešuju karijes. Pijte dovoljno vode i ograničite unos šećera za zdrav osmeh.",
  },
];