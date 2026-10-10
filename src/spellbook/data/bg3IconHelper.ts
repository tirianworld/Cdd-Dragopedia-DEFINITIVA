import bg3IconsData from './bg3Icons.json';
import { ASTRAEA_EMBLEM_BG3_DATA_URL } from './astraeaIconData';

export interface Bg3IconInfo {
  name: string;
  file: string;
  url: string;
}

const bg3Icons: Record<string, Bg3IconInfo> = bg3IconsData as Record<string, Bg3IconInfo>;

// Manual high-priority aliases for Baldur's Gate 3 spells
const SPELL_TO_BG3_KEY: Record<string, string> = {
  // Special / Homebrew & Dragopedia Sacred Spells
  'bendiciondeastraea': ASTRAEA_EMBLEM_BG3_DATA_URL,
  'bendicionastraea': ASTRAEA_EMBLEM_BG3_DATA_URL,
  'astraeasblessing': ASTRAEA_EMBLEM_BG3_DATA_URL,

  // Cantrips
  'firebolt': 'firebolt',
  'saetadefuego': 'firebolt',
  'rayoffrost': 'rayoffrost',
  'rayodeescarcha': 'rayoffrost',
  'eldritchblast': 'eldritchblast',
  'descargasobrenatural': 'eldritchblast',
  'sacredflame': 'sacredflame',
  'llamasagrada': 'sacredflame',
  'magehand': 'magehand',
  'manodemago': 'magehand',
  'minorillusion': 'minorillusion',
  'ilusionmenor': 'minorillusion',
  'viciousmockery': 'viciousmockery',
  'burladanina': 'viciousmockery',
  'guidance': 'guidance',
  'guiadivina': 'guidance',
  'guia': 'guidance',
  'shockinggrasp': 'shockinggrasp',
  'agarreelectrizante': 'shockinggrasp',
  'chilltouch': 'bonechill',
  'bonechill': 'bonechill',
  'toquehelado': 'bonechill',
  'poison喷': 'poisonspray',
  'poisonspray': 'poisonspray',
  'rociodeveneno': 'poisonspray',
  'acidsplash': 'acidsplash',
  'salpicaduradeacido': 'acidsplash',
  'bladeward': 'bladeward',
  'guardiadehojas': 'bladeward',
  'truestrike': 'truestrike',
  'certerogolpe': 'truestrike',
  'friends': 'friends',
  'amigos': 'friends',
  'dancinglights': 'dancinglights',
  'lucesdanzantes': 'dancinglights',
  'light': 'light',
  'luz': 'light',
  'shillelagh': 'shillelagh',
  'porrademadera': 'shillelagh',
  'thornwhip': 'thornwhip',
  'latigodeespinas': 'thornwhip',
  'produceflame': 'produceflame',
  'producirllama': 'produceflame',
  'mending': 'mending',
  'reparar': 'mending',
  'resistance': 'resistancecantrip',
  'resistencia': 'resistancecantrip',
  'thaumaturgy': 'thaumaturgy',
  'taumaturgia': 'thaumaturgy',

  // Level 1
  'magicmissile': 'magicmissile',
  'misilmagico': 'magicmissile',
  'curewounds': 'curewounds',
  'curarheridas': 'curewounds',
  'healingword': 'healingword',
  'palabradesanacion': 'healingword',
  'shield': 'shieldspell',
  'escudo': 'shieldspell',
  'magearmor': 'magearmour',
  'armadurademago': 'magearmour',
  'guidingbolt': 'guidingbolt',
  'saetaguia': 'guidingbolt',
  'inflictwounds': 'inflictwounds',
  'infligirheridas': 'inflictwounds',
  'bless': 'bless',
  'bendicion': 'bless',
  'bane': 'banespell',
  'perdicion': 'banespell',
  'burninghands': 'burninghands',
  'manosardientes': 'burninghands',
  'chromaticorb': 'chromaticorb',
  'orbecromatico': 'chromaticorb',
  'thunderwave': 'thunderwave',
  'oladetrueno': 'thunderwave',
  'witchbolt': 'witchbolt',
  'saetadebruja': 'witchbolt',
  'sleep': 'sleep',
  'dormir': 'sleep',
  'sueno': 'sleep',
  'charmperson': 'charmperson',
  'hechizarpersona': 'charmperson',
  'command': 'commandapproach',
  'orden': 'commandapproach',
  'disguiseself': 'disguiseself',
  'disfrazarse': 'disguiseself',
  'faeriefire': 'faeriefire',
  'fuegofeerico': 'faeriefire',
  'fogcloud': 'fogcloud',
  'nubedeneblina': 'fogcloud',
  'featherfall': 'featherfall',
  'caidadepluma': 'featherfall',
  'findfamiliar': 'findfamiliar',
  'encontrarfamiliar': 'findfamiliar',
  'grease': 'grease',
  'grasa': 'grease',
  'hellishrebuke': 'hellishrebuke',
  'reprocheinfernal': 'hellishrebuke',
  'heroism': 'heroism',
  'heroaismo': 'heroism',
  'huntersmark': 'huntersmark',
  'marcadelcazador': 'huntersmark',
  'sanctuary': 'sanctuary',
  'santuario': 'sanctuary',
  'shieldoffaith': 'shieldoffaith',
  'escudodelafe': 'shieldoffaith',
  'speakwithanimals': 'speakwithanimals',
  'hablarconanimales': 'speakwithanimals',
  'dissonantwhispers': 'dissonantwhispers',
  'susurrosdisonantes': 'dissonantwhispers',
  'entangle': 'entangle',
  'enredar': 'entangle',
  'falselife': 'falselife',
  'falsavida': 'falselife',
  'armorofagathys': 'armourofagathys',
  'armaduradeagathys': 'armourofagathys',
  'longstrider': 'longstrider',
  'zancadalarga': 'longstrider',
  'iceknife': 'iceknife',
  'cuchillodehielo': 'iceknife',
  'rayofsickness': 'rayofsickness',
  'rayodeenfermedad': 'rayofsickness',
  'hex': 'hex',
  'maldicion': 'hex',
  'tashashideouslaughter': 'tashashideouslaughter',
  'risahorrible': 'tashashideouslaughter',

  // Level 2
  'mistystep': 'mistystep',
  'pasobrumoso': 'mistystep',
  'mirrorimage': 'mirrorimage',
  'imagendeespejo': 'mirrorimage',
  'scorchingray': 'scorchingray',
  'rayoabrasador': 'scorchingray',
  'holdperson': 'holdperson',
  'inmovilizarpersona': 'holdperson',
  'invisibility': 'invisibilityspell',
  'invisibilidad': 'invisibilityspell',
  'spiritualweapon': 'spiritualweapongreatsword',
  'armaespiritual': 'spiritualweapongreatsword',
  'shatter': 'shatter',
  'estallido': 'shatter',
  'darkness': 'darkness',
  'oscuridad': 'darkness',
  'darkvision': 'darkvisionspell',
  'visionenlaoscuridad': 'darkvisionspell',
  'enhanceability': 'enhanceability',
  'mejorarhabilidad': 'enhanceability',
  'enlargereduce': 'enlargereduce',
  'agrandarreducir': 'enlargereduce',
  'flamingsphere': 'flamingsphere',
  'esferallameante': 'flamingsphere',
  'heatmetal': 'heatmetal',
  'calentarmetal': 'heatmetal',
  'knock': 'knock',
  'abrir': 'knock',
  'lesserrestoration': 'lesserrestoration',
  'restauracionmenor': 'lesserrestoration',
  'levitate': 'levitate',
  'levitar': 'levitate',
  'moonbeam': 'moonbeam',
  'rayodeluna': 'moonbeam',
  'passwithouttrace': 'passwithouttrace',
  'pasosinrastro': 'passwithouttrace',
  'seeinvisibility': 'seeinvisibility',
  'verinvisibilidad': 'seeinvisibility',
  'silence': 'silence',
  'silencio': 'silence',
  'spikegrowth': 'spikegrowth',
  'crecimientodeespinas': 'spikegrowth',
  'web': 'web',
  'telarana': 'web',
  'blur': 'blur',
  'borrosidad': 'blur',
  'barkskin': 'barkskin',
  'pieldecorteza': 'barkskin',
  'blindness': 'blindness',
  'ceguera': 'blindness',
  'cloudofdaggers': 'cloudofdaggers',
  'nubededagas': 'cloudofdaggers',
  'shadowblade': 'shadowblade',
  'hojasombraria': 'shadowblade',

  // Level 3
  'fireball': 'fireball',
  'boladefuego': 'fireball',
  'counterspell': 'counterspell',
  'contrahechizo': 'counterspell',
  'haste': 'haste',
  'acelerar': 'haste',
  'slow': 'slow',
  'ralentizar': 'slow',
  'lightningbolt': 'lightningbolt',
  'relampago': 'lightningbolt',
  'fly': 'grantflight',
  'volar': 'grantflight',
  'revivify': 'revivify',
  'revivir': 'revivify',
  'spiritguardians': 'spiritguardians',
  'espiritusguardianes': 'spiritguardians',
  'masshealingword': 'masshealingword',
  'palabradesanacionenmasa': 'masshealingword',
  'animatedead': 'animatedead',
  'animaralosmuertos': 'animatedead',
  'calllightning': 'calllightning',
  'convocarrelampagos': 'calllightning',
  'hypnoticpattern': 'hypnoticpattern',
  'patronhipnotico': 'hypnoticpattern',
  'fear': 'fear',
  'miedo': 'fear',
  'gaseousform': 'gaseousform',
  'formagaseosa': 'gaseousform',
  'daylight': 'daylight',
  'luzdeldia': 'daylight',
  'hungerofhadar': 'hungerofhadar',
  'hambredehadar': 'hungerofhadar',
  'bestowcurse': 'bestowcurse',
  'maldecir': 'bestowcurse',
  'blink': 'blink',
  'parpadeo': 'blink',
  'glyphofwarding': 'glyphofwarding',
  'glifodeproteccion': 'glyphofwarding',
  'protectionfromenergy': 'protectionfromenergy',
  'proteccioncontralaenergia': 'protectionfromenergy',
  'removecurse': 'removecurse',
  'quitarmaldicion': 'removecurse',
  'sleetstorm': 'sleetstorm',
  'tormentadeaguanieve': 'sleetstorm',
  'speakwithdead': 'speakwithdead',
  'hablarconlosmuertos': 'speakwithdead',
  'stinkingcloud': 'stinkingcloud',
  'nubenauseabunda': 'stinkingcloud',
  'vampirictouch': 'vampirictouch',
  'toquevampirico': 'vampirictouch',

  // Level 4
  'banishment': 'banishment',
  'destierro': 'banishment',
  'dimensiondoor': 'dimensiondoor',
  'puertadimensional': 'dimensiondoor',
  'greaterinvisibility': 'greaterinvisibility',
  'invisibilidadmayor': 'greaterinvisibility',
  'polymorph': 'polymorph',
  'polimorfia': 'polymorph',
  'walloffire': 'walloffire',
  'murodefuego': 'walloffire',
  'blight': 'blight',
  'marchitamiento': 'blight',
  'icestorm': 'icestorm',
  'tormentadehielo': 'icestorm',
  'stoneskin': 'stoneskin',
  'pieldecripta': 'stoneskin',
  'pieldepiedra': 'stoneskin',
  'deathward': 'deathward',
  'proteccioncontralamuerte': 'deathward',
  'fireshield': 'fireshield',
  'escudodefuego': 'fireshield',
  'guardianoffaith': 'guardianoffaith',
  'guardiandelafe': 'guardianoffaith',
  'phantasmalkiller': 'phantasmalkiller',
  'asesinofantasmal': 'phantasmalkiller',
  'confusion': 'confusion',
  'dominatebeast': 'dominatebeast',
  'dominarbestia': 'dominatebeast',
  'evardsblacktentacles': 'evardsblacktentacles',
  'tentaculosnegros': 'evardsblacktentacles',
  'resilientsphere': 'otilukesresilientsphere',
  'esferaelastica': 'otilukesresilientsphere',

  // Level 5
  'cloudkill': 'cloudkill',
  'nubedeaniquilacion': 'cloudkill',
  'coneofcold': 'coneofcold',
  'conodefrío': 'coneofcold',
  'conodefrio': 'coneofcold',
  'dominateperson': 'dominateperson',
  'dominarpersona': 'dominateperson',
  'greaterrestoration': 'greaterrestoration',
  'restauracionmayor': 'greaterrestoration',
  'holdmonster': 'holdmonster',
  'inmovilizarmonstruo': 'holdmonster',
  'masscurewounds': 'masscurewounds',
  'curacionenmasa': 'masscurewounds',
  'flamestrike': 'flamestrike',
  'golpedellama': 'flamestrike',
  'insectplague': 'insectplague',
  'plagadeinsectos': 'insectplague',
  'telekinesis': 'telekinesis',
  'telequinesis': 'telekinesis',
  'wallofforce': 'wallofforce',
  'murodefuerza': 'wallofforce',
  'wallofstone': 'wallofstone',
  'murodepiedra': 'wallofstone',
  'seeming': 'seeming',
  'apariencia': 'seeming',

  // Level 6
  'chainlightning': 'chainlightning',
  'rayoencadena': 'chainlightning',
  'disintegrate': 'disintegrate',
  'desintegrar': 'disintegrate',
  'globeofinvulnerability': 'globeofinvulnerability',
  'globodeinvulnerabilidad': 'globeofinvulnerability',
  'heal': 'heal',
  'sanar': 'heal',
  'heroesfeast': 'heroesfeast',
  'festindeheroes': 'heroesfeast',
  'sunbeam': 'sunbeam',
  'rayodesol': 'sunbeam',
  'wallofice': 'wallofice',
  'murodehielo': 'wallofice',
  'windwalk': 'windwalk',
  'caminardelviento': 'windwalk',
  'circleofdeath': 'circleofdeath',
  'circulodelamuerte': 'circleofdeath',
  'eyebite': 'eyebiteasleep',
  'mordiscodeojo': 'eyebiteasleep',
  'fleshtostone': 'fleshtostone',
  'carnepiedra': 'fleshtostone',
  'harm': 'harm',
  'danar': 'harm',
  'planarally': 'planarally',
  'aliadoplanar': 'planarally',
  'trueseeing': 'trueseeing',
  'visionverdadera': 'trueseeing',
  'bladebarrier': 'bladebarrier',
  'barreradehojas': 'bladebarrier',

  // Level 9
  'powerwordkill': 'powerwordkill',
  'palabradepoderparar': 'powerwordkill',
  'palabradepodermatar': 'powerwordkill',
};

function normalizeKey(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Fast lookup for file name -> static url
const FILE_TO_STATIC_URL = new Map<string, string>();
for (const item of Object.values(bg3Icons)) {
  if (item && item.file && item.url) {
    FILE_TO_STATIC_URL.set(item.file.toLowerCase(), item.url);
    FILE_TO_STATIC_URL.set(item.file.toLowerCase().replace(/ /g, '_'), item.url);
    FILE_TO_STATIC_URL.set(encodeURIComponent(item.file).toLowerCase(), item.url);
  }
}

/**
 * Sanitizes any BG3 wiki URL:
 * Converts dynamic Special:FilePath/... URLs into static nginx/CDN URLs
 */
export function sanitizeBg3Url(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes('Special:FilePath/')) {
    const rawFile = url.split('Special:FilePath/')[1]?.split(/[?#]/)[0] || '';
    const decoded = decodeURIComponent(rawFile).trim().toLowerCase();
    const match = FILE_TO_STATIC_URL.get(decoded) ||
                  FILE_TO_STATIC_URL.get(decoded.replace(/ /g, '_')) ||
                  FILE_TO_STATIC_URL.get(decoded.replace(/_/g, ' '));
    if (match) return match;
  }
  return url;
}

/**
 * Returns the best official Baldur's Gate 3 spell icon URL.
 * Automatically tries:
 * 1. Spell explicit bg3IconUrl (sanitized)
 * 2. SPELL_TO_BG3_KEY alias lookup (by English name, Spanish name, or ID)
 * 3. Direct bg3Icons dictionary key lookup
 * 4. Partial substring matching in bg3Icons
 * 5. Semantic keyword matching in spell name (fire, ice, lightning, healing, shadow, etc.)
 * 6. Thematic school & damage type fallback to authentic BG3 icons (guaranteed 100% BG3)
 */
export function getOfficialSpellIconUrl(spell: {
  id?: string;
  name?: string;
  nameEn?: string;
  school?: string;
  damageType?: string;
  bg3IconUrl?: string | null;
  iconUrl?: string | null;
}): string {
  // 1. If already assigned a BG3 URL or custom icon asset
  if (spell.bg3IconUrl && typeof spell.bg3IconUrl === 'string') {
    const sanitized = sanitizeBg3Url(spell.bg3IconUrl);
    if (sanitized) return sanitized;
  }

  const rawId = spell.id ? spell.id.replace(/^(xphb|tce|xge|egw|ggr|idrotf|ftd|scc|aag)-/, '') : '';
  const candidates = [
    rawId ? normalizeKey(rawId) : '',
    spell.nameEn ? normalizeKey(spell.nameEn) : '',
    spell.name ? normalizeKey(spell.name) : '',
    spell.id ? normalizeKey(spell.id) : '',
  ].filter(Boolean);

  for (const cand of candidates) {
    // 2. Direct alias table
    const mappedKey = SPELL_TO_BG3_KEY[cand];
    if (mappedKey) {
      if (mappedKey.startsWith('/') || mappedKey.startsWith('http')) {
        return mappedKey;
      }
      if (bg3Icons[mappedKey]) {
        return bg3Icons[mappedKey].url;
      }
    }

    // 3. Direct bg3Icons lookup
    if (bg3Icons[cand]) {
      return bg3Icons[cand].url;
    }

    // 4. Partial check: e.g. "magicmissileicon" -> "magicmissile"
    for (const [key, icon] of Object.entries(bg3Icons)) {
      if (key === cand || key.startsWith(cand) || cand.startsWith(key)) {
        return icon.url;
      }
    }
  }

  // 5. Semantic keyword matching in Spanish and English names
  const combinedText = `${spell.name || ''} ${spell.nameEn || ''} ${rawId}`.toLowerCase();

  // Fire / Fuego
  if (/fuego|fire|llama|flame|ignis|ardiente|piroc|quema/.test(combinedText)) {
    return bg3Icons['fireball']?.url || bg3Icons['scorchingray']?.url || 'https://bg3.wiki/w/images/c/cb/Fireball_Icon.webp';
  }
  // Ice / Cold / Frío / Hielo
  if (/frio|frío|cold|hielo|ice|frost|escarcha|congel|glacial/.test(combinedText)) {
    return bg3Icons['coneofcold']?.url || bg3Icons['iceknife']?.url || bg3Icons['rayoffrost']?.url || 'https://bg3.wiki/w/images/e/e0/Cone_of_Cold_Icon.webp';
  }
  // Lightning / Relámpago / Rayo / Electricidad
  if (/relampago|relámpago|lightning|rayo|electric|electr|shock|chispa/.test(combinedText)) {
    return bg3Icons['lightningbolt']?.url || bg3Icons['calllightning']?.url || bg3Icons['witchbolt']?.url || 'https://bg3.wiki/w/images/7/77/Lightning_Bolt_Icon.webp';
  }
  // Thunder / Trueno / Sonido
  if (/trueno|thunder|sonido|boom|estallido|vibrac/.test(combinedText)) {
    return bg3Icons['thunderwave']?.url || bg3Icons['shatter']?.url || 'https://bg3.wiki/w/images/c/c5/Thunderwave_Icon.webp';
  }
  // Healing / Curación / Vida
  if (/curar|cura|curacion|curación|heal|vida|salud|sanar|sanacion|sanación|vital/.test(combinedText)) {
    return bg3Icons['curewounds']?.url || bg3Icons['healingword']?.url || bg3Icons['masscurewounds']?.url || 'https://bg3.wiki/w/images/5/52/Cure_Wounds_Icon.webp';
  }
  // Radiant / Radiante / Sol / Luz / Celestial
  if (/radiant|radiante|sol|sun|luz|light|sagrad|alba|aurora|divin/.test(combinedText)) {
    return bg3Icons['guidingbolt']?.url || bg3Icons['sunbeam']?.url || bg3Icons['sacredflame']?.url || 'https://bg3.wiki/w/images/8/87/Guiding_Bolt_Icon.webp';
  }
  // Necrotic / Necrosis / Muerte / Oscuridad / Sombra / Abisal
  if (/necro|muert|death|sombra|shadow|oscur|dark|vacio|vacío|peste|podred|hueso|bone|fantas|alma|soul/.test(combinedText)) {
    return bg3Icons['blight']?.url || bg3Icons['circleofdeath']?.url || bg3Icons['animatedead']?.url || bg3Icons['bonechill']?.url || 'https://bg3.wiki/w/images/b/b2/Blight_Icon.webp';
  }
  // Force / Fuerza / Arcano / Proyectil
  if (/fuerza|force|misil|proyectil|arcano|telequ|pulso/.test(combinedText)) {
    return bg3Icons['magicmissile']?.url || bg3Icons['eldritchblast']?.url || bg3Icons['wallofforce']?.url || 'https://bg3.wiki/w/images/2/29/Magic_Missile_Icon.webp';
  }
  // Psychic / Psíquico / Mente / Cerebro
  if (/psiqu|psíqu|psychic|mente|mind|cerebr|pensam|ilusion|ilusión|sueno|sueño|pesadilla/.test(combinedText)) {
    return bg3Icons['dissonantwhispers']?.url || bg3Icons['detectthoughts']?.url || bg3Icons['holdperson']?.url || 'https://bg3.wiki/w/images/e/ea/Dissonant_Whispers_Icon.webp';
  }
  // Acid / Ácido
  if (/acido|ácido|acid|corros/.test(combinedText)) {
    return bg3Icons['acidsplash']?.url || 'https://bg3.wiki/w/images/8/8a/Acid_Splash_Icon.webp';
  }
  // Poison / Veneno
  if (/venen|poison|toxin|toxico|tóxico/.test(combinedText)) {
    return bg3Icons['poisonspray']?.url || bg3Icons['rayofsickness']?.url || 'https://bg3.wiki/w/images/f/f6/Poison_Spray_Icon.webp';
  }
  // Shield / Protection / Armor / Barrera
  if (/escudo|shield|armadur|armour|armor|protec|barrera|guard|resisten/.test(combinedText)) {
    return bg3Icons['shieldspell']?.url || bg3Icons['magearmour']?.url || bg3Icons['bladeward']?.url || 'https://bg3.wiki/w/images/e/e7/Shield_Icon.webp';
  }
  // Teleportation / Movement / Flight / Door / Paso
  if (/teleport|paso|step|puerta|door|portal|viaje|transporte|vuelo|volar|fly|salto|jump/.test(combinedText)) {
    return bg3Icons['mistystep']?.url || bg3Icons['dimensiondoor']?.url || bg3Icons['grantflight']?.url || 'https://bg3.wiki/w/images/d/df/Misty_Step_Icon.webp';
  }
  // Nature / Plants / Animals / Bestias
  if (/natur|animal|bestia|beast|arbol|árbol|planta|plant|espina|thorn|enred|viento|wind/.test(combinedText)) {
    return bg3Icons['entangle']?.url || bg3Icons['thornwhip']?.url || bg3Icons['speakwithanimals']?.url || 'https://bg3.wiki/w/images/f/fb/Entangle_Icon.webp';
  }
  // Mirrors / Reflection
  if (/espejo|mirror|reflejo|cristal|vidrio/.test(combinedText)) {
    return bg3Icons['mirrorimage']?.url || 'https://bg3.wiki/w/images/0/07/Mirror_Image_Icon.webp';
  }

  // 6. Thematic Fallback based on School and Damage Type (100% BG3 guaranteed)
  const school = (spell.school || '').toLowerCase();
  const damage = (spell.damageType || '').toLowerCase();

  if (damage.includes('fuego') || damage.includes('fire')) return bg3Icons['fireball']?.url || 'https://bg3.wiki/w/images/c/cb/Fireball_Icon.webp';
  if (damage.includes('frio') || damage.includes('frío') || damage.includes('cold')) return bg3Icons['coneofcold']?.url || 'https://bg3.wiki/w/images/e/e0/Cone_of_Cold_Icon.webp';
  if (damage.includes('relampago') || damage.includes('relámpago') || damage.includes('lightning')) return bg3Icons['lightningbolt']?.url || 'https://bg3.wiki/w/images/7/77/Lightning_Bolt_Icon.webp';
  if (damage.includes('trueno') || damage.includes('thunder')) return bg3Icons['thunderwave']?.url || 'https://bg3.wiki/w/images/c/c5/Thunderwave_Icon.webp';
  if (damage.includes('radiante') || damage.includes('radiant')) return bg3Icons['guidingbolt']?.url || 'https://bg3.wiki/w/images/8/87/Guiding_Bolt_Icon.webp';
  if (damage.includes('necrot') || damage.includes('necrót')) return bg3Icons['blight']?.url || 'https://bg3.wiki/w/images/b/b2/Blight_Icon.webp';
  if (damage.includes('fuerza') || damage.includes('force')) return bg3Icons['magicmissile']?.url || 'https://bg3.wiki/w/images/2/29/Magic_Missile_Icon.webp';
  if (damage.includes('psiqu') || damage.includes('psíq') || damage.includes('psychic')) return bg3Icons['dissonantwhispers']?.url || 'https://bg3.wiki/w/images/e/ea/Dissonant_Whispers_Icon.webp';
  if (damage.includes('curac') || damage.includes('cura') || damage.includes('heal')) return bg3Icons['curewounds']?.url || 'https://bg3.wiki/w/images/5/52/Cure_Wounds_Icon.webp';
  if (damage.includes('acido') || damage.includes('ácido') || damage.includes('acid')) return bg3Icons['acidsplash']?.url || 'https://bg3.wiki/w/images/8/8a/Acid_Splash_Icon.webp';
  if (damage.includes('veneno') || damage.includes('poison')) return bg3Icons['poisonspray']?.url || 'https://bg3.wiki/w/images/f/f6/Poison_Spray_Icon.webp';

  // School Fallback
  if (school.includes('abjurac') || school.includes('abjurat')) return bg3Icons['shieldspell']?.url || 'https://bg3.wiki/w/images/e/e7/Shield_Icon.webp';
  if (school.includes('adivin') || school.includes('divinat')) return bg3Icons['guidance']?.url || 'https://bg3.wiki/w/images/5/5b/Guidance_Icon.webp';
  if (school.includes('conjur') || school.includes('summon')) return bg3Icons['mistystep']?.url || 'https://bg3.wiki/w/images/d/df/Misty_Step_Icon.webp';
  if (school.includes('encanta') || school.includes('enchant')) return bg3Icons['holdperson']?.url || 'https://bg3.wiki/w/images/3/30/Hold_Person_Icon.webp';
  if (school.includes('evocac') || school.includes('evocat')) return bg3Icons['chromaticorb']?.url || 'https://bg3.wiki/w/images/5/5d/Chromatic_Orb_Thunder_Icon.webp';
  if (school.includes('ilus') || school.includes('illus')) return bg3Icons['minorillusion']?.url || 'https://bg3.wiki/w/images/9/91/Minor_Illusion_Icon.webp';
  if (school.includes('nigrom') || school.includes('necro')) return bg3Icons['blight']?.url || 'https://bg3.wiki/w/images/b/b2/Blight_Icon.webp';
  if (school.includes('transmut')) return bg3Icons['haste']?.url || 'https://bg3.wiki/w/images/1/14/Haste_Icon.webp';
  if (school.includes('reflex') || school.includes('espejo')) return bg3Icons['mirrorimage']?.url || 'https://bg3.wiki/w/images/0/07/Mirror_Image_Icon.webp';

  // Ultimate Baldur's Gate 3 iconic spell
  return 'https://bg3.wiki/w/images/c/cb/Fireball_Icon.webp';
}
