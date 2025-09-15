export interface ExampleWord {
  word: string;
  meaning: string;
  transliteration: string;
  audioSrc: string;
}

export interface Kootaksharam {
  id: string;
  conjunct: string;
  base: string;
  transliteration: string;
  examples: ExampleWord[];
}

export const kootaksharamData: Kootaksharam[] = [
  // Category: ക (ka)
  {
    id: 'kka',
    conjunct: 'ക്ക',
    base: 'ക',
    transliteration: 'kka',
    examples: [
      { word: 'പുക്ക', meaning: 'bud / sprout', transliteration: 'pukka', audioSrc: '' },
      { word: 'താക്കോൽ', meaning: 'key', transliteration: 'thaakkol', audioSrc: '' },
      { word: 'ദുക്കം', meaning: 'sorrow', transliteration: 'dukkam', audioSrc: '' },
    ],
  },
  {
    id: 'kkya',
    conjunct: 'ക്ക്യ',
    base: 'ക',
    transliteration: 'kkya',
    examples: [
        { word: 'വാക്യം', meaning: 'sentence', transliteration: 'vaakyam', audioSrc: '' },
        { word: 'ശക്യം', meaning: 'possible', transliteration: 'shakyam', audioSrc: '' },
        { word: 'ഐക്യം', meaning: 'unity', transliteration: 'aikyam', audioSrc: '' },
    ],
  },
  {
    id: 'kkra',
    conjunct: 'ക്ക്ര',
    base: 'ക',
    transliteration: 'kkra',
    examples: [
        { word: 'ചക്രം', meaning: 'wheel', transliteration: 'chakram', audioSrc: '' },
        { word: 'വിക്രം', meaning: 'valor', transliteration: 'vikram', audioSrc: '' },
        { word: 'അക്രം', meaning: 'disorder', transliteration: 'akram', audioSrc: '' },
    ],
  },
  {
    id: 'kkva',
    conjunct: 'ക്ക്വ',
    base: 'ക',
    transliteration: 'kkva',
    examples: [
        { word: 'പക്വം', meaning: 'ripe, mature', transliteration: 'pakvam', audioSrc: '' },
        { word: 'അപക്വം', meaning: 'unripe, immature', transliteration: 'apakvam', audioSrc: '' },
        { word: 'സക്വം', meaning: 'togetherness', transliteration: 'sakvam', audioSrc: '' },
    ],
  },
  {
    id: 'kta',
    conjunct: 'ക്ട',
    base: 'ക',
    transliteration: 'kṭa',
    examples: [
        { word: 'ഡോക്ടർ', meaning: 'doctor', transliteration: 'doctor', audioSrc: '' },
        { word: 'ഒക്ടോബർ', meaning: 'October', transliteration: 'october', audioSrc: '' },
        { word: 'വിക്ടറി', meaning: 'victory', transliteration: 'victory', audioSrc: '' },
    ],
  },
  {
    id: 'ktra',
    conjunct: 'ക്ട്ര',
    base: 'ക',
    transliteration: 'kṭra',
    examples: [
        { word: 'ഇലക്ട്രിക്', meaning: 'electric', transliteration: 'electric', audioSrc: '' },
        { word: 'പെട്രോൾ', meaning: 'petrol', transliteration: 'petrol', audioSrc: '' },
        { word: 'സെൻട്രൽ', meaning: 'central', transliteration: 'central', audioSrc: '' },
    ],
  },
   {
    id: 'ktha',
    conjunct: 'ക്ത',
    base: 'ക',
    transliteration: 'kta',
    examples: [
      { word: 'ശക്തി', meaning: 'power', transliteration: 'shakti', audioSrc: '' },
      { word: 'ഭക്തി', meaning: 'devotion', transliteration: 'bhakti', audioSrc: '' },
      { word: 'യുക്തി', meaning: 'strategy / reasoning', transliteration: 'yukti', audioSrc: '' },
    ],
  },
  {
    id: 'kthra',
    conjunct: 'ക്ത്ര',
    base: 'ക',
    transliteration: 'ktra',
    examples: [
        { word: 'വക്ത്രം', meaning: 'face, mouth', transliteration: 'vaktram', audioSrc: '' },
        { word: 'ഭക്ത്രൻ', meaning: 'devotee', transliteration: 'bhaktran', audioSrc: '' },
        { word: 'സൂക്ത്രം', meaning: 'hymn', transliteration: 'sooktram', audioSrc: '' },
    ],
  },
  {
    id: 'kna',
    conjunct: 'ക്ന',
    base: 'ക',
    transliteration: 'kna',
    examples: [
        { word: 'ടെക്നോളജി', meaning: 'technology', transliteration: 'technology', audioSrc: '' },
    ],
  },
  {
    id: 'kma',
    conjunct: 'ക്മ',
    base: 'ക',
    transliteration: 'kma',
    examples: [
        { word: 'രുക്മിണി', meaning: 'Rukmini (a name)', transliteration: 'rukmini', audioSrc: '' },
    ],
  },
  {
    id: 'kra',
    conjunct: 'ക്ര',
    base: 'ക',
    transliteration: 'kra',
    examples: [
        { word: 'ക്രിയ', meaning: 'action, verb', transliteration: 'kriya', audioSrc: '' },
        { word: 'ക്രമം', meaning: 'order, sequence', transliteration: 'kramam', audioSrc: '' },
        { word: 'ക്രൂരം', meaning: 'cruel', transliteration: 'krooram', audioSrc: '' },
    ],
  },
  {
    id: 'kya',
    conjunct: 'ക്യ',
    base: 'ക',
    transliteration: 'kya',
    examples: [
        { word: 'ക്യാമറ', meaning: 'camera', transliteration: 'camera', audioSrc: '' },
        { word: 'ക്യാൻസർ', meaning: 'cancer', transliteration: 'cancer', audioSrc: '' },
    ],
  },
  {
    id: 'kva',
    conjunct: 'ക്വ',
    base: 'ക',
    transliteration: 'kva',
    examples: [
        { word: 'ക്വാർട്ടർ', meaning: 'quarter', transliteration: 'quarter', audioSrc: '' },
        { word: 'ക്വാളിറ്റി', meaning: 'quality', transliteration: 'quality', audioSrc: '' },
    ],
  },
  // Category: ഗ (ga)
  {
    id: 'gga',
    conjunct: 'ഗ്ഗ',
    base: 'ഗ',
    transliteration: 'gga',
    examples: [
        { word: 'യോഗ്യത', meaning: 'suitability', transliteration: 'yogyatha', audioSrc: '' },
    ],
  },
  {
    id: 'ggya',
    conjunct: 'ഗ്ഗ്യ',
    base: 'ഗ',
    transliteration: 'ggya',
    examples: [
        { word: 'ഭാഗ്യം', meaning: 'luck', transliteration: 'bhagyam', audioSrc: '' },
        { word: 'യോഗ്യൻ', meaning: 'suitable person', transliteration: 'yogyan', audioSrc: '' },
    ],
  },
  {
    id: 'ggra',
    conjunct: 'ഗ്ഗ്ര',
    base: 'ഗ',
    transliteration: 'ggra',
    examples: [
        { word: 'അഗ്രം', meaning: 'tip, end', transliteration: 'agram', audioSrc: '' },
        { word: 'ഉഗ്രൻ', meaning: 'fierce, great', transliteration: 'ugran', audioSrc: '' },
    ],
  },
  {
    id: 'gda',
    conjunct: 'ഗ്ദ',
    base: 'ഗ',
    transliteration: 'gda',
    examples: [
        { word: 'വാഗ്ദാനം', meaning: 'promise', transliteration: 'vagdaanam', audioSrc: '' },
    ],
  },
  {
    id: 'gdha',
    conjunct: 'ഗ്ധ',
    base: 'ഗ',
    transliteration: 'gdha',
    examples: [
        { word: 'ദഗ്ധം', meaning: 'burnt', transliteration: 'dagdham', audioSrc: '' },
        { word: 'വിദഗ്ധൻ', meaning: 'expert', transliteration: 'vidagdhan', audioSrc: '' },
    ],
  },
  {
    id: 'gna',
    conjunct: 'ഗ്ന',
    base: 'ഗ',
    transliteration: 'gna',
    examples: [
        { word: 'അഗ്നി', meaning: 'fire', transliteration: 'agni', audioSrc: '' },
        { word: 'നഗ്നൻ', meaning: 'naked', transliteration: 'nagnan', audioSrc: '' },
    ],
  },
  {
    id: 'gma',
    conjunct: 'ഗ്മ',
    base: 'ഗ',
    transliteration: 'gma',
    examples: [
        { word: 'യുഗ്മം', meaning: 'pair', transliteration: 'yugmam', audioSrc: '' },
    ],
  },
  {
    id: 'gra',
    conjunct: 'ഗ്ര',
    base: 'ഗ',
    transliteration: 'gra',
    examples: [
        { word: 'ഗ്രാമം', meaning: 'village', transliteration: 'gramam', audioSrc: '' },
        { word: 'ഗ്രഹം', meaning: 'planet', transliteration: 'graham', audioSrc: '' },
    ],
  },
  {
    id: 'gya',
    conjunct: 'ഗ്യ',
    base: 'ഗ',
    transliteration: 'gya',
    examples: [
        { word: 'ഗ്യാസ്', meaning: 'gas', transliteration: 'gas', audioSrc: '' },
    ],
  },
  {
    id: 'gva',
    conjunct: 'ഗ്വ',
    base: 'ഗ',
    transliteration: 'gva',
    examples: [
        { word: 'ഗ്വാളിയോർ', meaning: 'Gwalior (place name)', transliteration: 'gwalior', audioSrc: '' },
    ],
  },
  // Category: ങ (nga)
  {
    id: 'nka',
    conjunct: 'ങ്ക',
    base: 'ങ',
    transliteration: 'ṅka',
    examples: [
        { word: 'തിങ്കൾ', meaning: 'Monday / moon', transliteration: 'thingal', audioSrc: '' },
        { word: 'ചുങ്കം', meaning: 'tax', transliteration: 'chunkam', audioSrc: '' },
    ],
  },
  {
    id: 'nkya',
    conjunct: 'ങ്ക്യ',
    base: 'ങ',
    transliteration: 'ṅkya',
    examples: [],
  },
  {
    id: 'nkra',
    conjunct: 'ങ്ക്ര',
    base: 'ങ',
    transliteration: 'ṅkra',
    examples: [],
  },
  {
    id: 'nna',
    conjunct: 'ങ്ങ',
    base: 'ങ',
    transliteration: 'ṅṅa',
    examples: [
        { word: 'ഞങ്ങൾ', meaning: 'we', transliteration: 'njangal', audioSrc: '' },
        { word: 'തിങ്ങ', meaning: 'dense', transliteration: 'thinga', audioSrc: '' },
    ],
  },
  {
    id: 'nnya',
    conjunct: 'ങ്ങ്യ',
    base: 'ങ',
    transliteration: 'ṅṅya',
    examples: [],
  },
  {
    id: 'nnra',
    conjunct: 'ങ്ങ്ര',
    base: 'ങ',
    transliteration: 'ṅṅra',
    examples: [],
  },
  // Category: ച (cha)
  {
    id: 'cca',
    conjunct: 'ച്ച',
    base: 'ച',
    transliteration: 'cca',
    examples: [
        { word: 'അച്ചൻ', meaning: 'father', transliteration: 'achchan', audioSrc: '' },
        { word: 'കൊച്ചുമോൻ', meaning: 'grandson', transliteration: 'kochumon', audioSrc: '' },
    ],
  },
  {
    id: 'ccya',
    conjunct: 'ച്ച്യ',
    base: 'ച',
    transliteration: 'ccya',
    examples: [],
  },
  {
    id: 'ccha',
    conjunct: 'ച്ഛ',
    base: 'ച',
    transliteration: 'ccha',
    examples: [
        { word: 'അച്ഛൻ', meaning: 'father', transliteration: 'achchan', audioSrc: '' },
        { word: 'ഇച്ഛ', meaning: 'wish, desire', transliteration: 'ichcha', audioSrc: '' },
    ],
  },
  {
    id: 'cchya',
    conjunct: 'ച്ഛ്യ',
    base: 'ച',
    transliteration: 'cchya',
    examples: [],
  },
  {
    id: 'cchra',
    conjunct: 'ച്ഛ്ര',
    base: 'ച',
    transliteration: 'cchra',
    examples: [],
  },
  {
    id: 'cra',
    conjunct: 'ച്ര',
    base: 'ച',
    transliteration: 'cra',
    examples: [],
  },
  {
    id: 'cya',
    conjunct: 'ച്യ',
    base: 'ച',
    transliteration: 'cya',
    examples: [],
  },
  // Category: ജ (ja)
  {
    id: 'jja',
    conjunct: 'ജ്ജ',
    base: 'ജ',
    transliteration: 'jja',
    examples: [
        { word: 'വിജയം', meaning: 'success', transliteration: 'vijayam', audioSrc: '' },
        { word: 'രാജ്ജ്യം', meaning: 'kingdom', transliteration: 'raajjyam', audioSrc: '' },
    ],
  },
  {
    id: 'jjya',
    conjunct: 'ജ്ജ്യ',
    base: 'ജ',
    transliteration: 'jjya',
    examples: [],
  },
  {
    id: 'jjra',
    conjunct: 'ജ്ജ്ര',
    base: 'ജ',
    transliteration: 'jjra',
    examples: [],
  },
  {
    id: 'jna',
    conjunct: 'ജ്ഞ',
    base: 'ജ',
    transliteration: 'jña',
    examples: [
        { word: 'വിജ്ഞാനം', meaning: 'knowledge', transliteration: 'vijnanam', audioSrc: '' },
        { word: 'അജ്ഞൻ', meaning: 'ignorant person', transliteration: 'ajnan', audioSrc: '' },
    ],
  },
  {
    id: 'jnya',
    conjunct: 'ജ്ഞ്യ',
    base: 'ജ',
    transliteration: 'jñya',
    examples: [],
  },
  {
    id: 'jra',
    conjunct: 'ജ്ര',
    base: 'ജ',
    transliteration: 'jra',
    examples: [],
  },
  {
    id: 'jya',
    conjunct: 'ജ്യ',
    base: 'ജ',
    transliteration: 'jya',
    examples: [],
  },
  // Category: ഞ (ña)
  {
    id: 'nca',
    conjunct: 'ഞ്ച',
    base: 'ഞ',
    transliteration: 'ñca',
    examples: [
        { word: 'അഞ്ചു', meaning: 'five', transliteration: 'anju', audioSrc: '' },
        { word: 'സഞ്ചാരം', meaning: 'journey', transliteration: 'sancharam', audioSrc: '' },
    ],
  },
  {
    id: 'ncya',
    conjunct: 'ഞ്ച്യ',
    base: 'ഞ',
    transliteration: 'ñcya',
    examples: [],
  },
  {
    id: 'ncra',
    conjunct: 'ഞ്ച്ര',
    base: 'ഞ',
    transliteration: 'ñcra',
    examples: [],
  },
  {
    id: 'nja',
    conjunct: 'ഞ്ജ',
    base: 'ഞ',
    transliteration: 'ñja',
    examples: [
        { word: 'പുഞ്ജം', meaning: 'heap, collection', transliteration: 'punjam', audioSrc: '' },
    ],
  },
  {
    id: 'njya',
    conjunct: 'ഞ്ജ്യ',
    base: 'ഞ',
    transliteration: 'ñjya',
    examples: [],
  },
  {
    id: 'njra',
    conjunct: 'ഞ്ജ്ര',
    base: 'ഞ',
    transliteration: 'ñjra',
    examples: [],
  },
  {
    id: 'ncha',
    conjunct: 'ഞ്ഛ',
    base: 'ഞ',
    transliteration: 'ñcha',
    examples: [],
  },
  // Category: ട (ṭa)
  {
    id: 'tta',
    conjunct: 'ട്ട',
    base: 'ട',
    transliteration: 'ṭṭa',
    examples: [
        { word: 'പട്ടം', meaning: 'kite / title', transliteration: 'paṭṭam', audioSrc: '' },
        { word: 'മുട്ട', meaning: 'egg', transliteration: 'muṭṭa', audioSrc: '' },
    ],
  },
  {
    id: 'ttya',
    conjunct: 'ട്ട്യ',
    base: 'ട',
    transliteration: 'ṭṭya',
    examples: [],
  },
  {
    id: 'ttra',
    conjunct: 'ട്ട്ര',
    base: 'ട',
    transliteration: 'ṭṭra',
    examples: [],
  },
  {
    id: 'ttha',
    conjunct: 'ട്ഠ',
    base: 'ട',
    transliteration: 'ṭṭha',
    examples: [],
  },
  // Category: ഡ (ḍa)
  {
    id: 'dda',
    conjunct: 'ഡ്ഡ',
    base: 'ഡ',
    transliteration: 'ḍḍa',
    examples: [
        { word: 'ലഡ്ഡു', meaning: 'laddu (sweet)', transliteration: 'laḍḍu', audioSrc: '' },
    ],
  },
  {
    id: 'ddya',
    conjunct: 'ഡ്ഡ്യ',
    base: 'ഡ',
    transliteration: 'ḍḍya',
    examples: [],
  },
  {
    id: 'ddra',
    conjunct: 'ഡ്ഡ്ര',
    base: 'ഡ',
    transliteration: 'ḍḍra',
    examples: [],
  },
  {
    id: 'ddva',
    conjunct: 'ഡ്ഡ്വ',
    base: 'ഡ',
    transliteration: 'ḍḍva',
    examples: [],
  },
  {
    id: 'ddvya',
    conjunct: 'ഡ്ഡ്വ്യ',
    base: 'ഡ',
    transliteration: 'ḍḍvya',
    examples: [],
  },
  {
    id: 'dra',
    conjunct: 'ഡ്ര',
    base: 'ഡ',
    transliteration: 'ḍra',
    examples: [
        { word: 'ഡ്രൈവർ', meaning: 'driver', transliteration: 'driver', audioSrc: '' },
    ],
  },
  {
    id: 'dya',
    conjunct: 'ഡ്യ',
    base: 'ഡ',
    transliteration: 'ḍya',
    examples: [],
  },
  // Category: ണ (ṇa)
  {
    id: 'nta',
    conjunct: 'ണ്ട',
    base: 'ണ',
    transliteration: 'ṇṭa',
    examples: [
        { word: 'ഉണ്ട', meaning: 'exists / is there', transliteration: 'uṇṭa', audioSrc: '' },
        { word: 'വേണ്ട', meaning: 'not required', transliteration: 'vēṇṭa', audioSrc: '' },
    ],
  },
  {
    id: 'ntya',
    conjunct: 'ണ്ട്യ',
    base: 'ണ',
    transliteration: 'ṇṭya',
    examples: [],
  },
  {
    id: 'ntra',
    conjunct: 'ണ്ട്ര',
    base: 'ണ',
    transliteration: 'ṇṭra',
    examples: [],
  },
  {
    id: 'nna',
    conjunct: 'ണ്ണ',
    base: 'ണ',
    transliteration: 'ṇṇa',
    examples: [
        { word: 'കണ്ണു', meaning: 'eye', transliteration: 'kaṇṇu', audioSrc: '' },
    ],
  },
  {
    id: 'nnya',
    conjunct: 'ണ്ണ്യ',
    base: 'ണ',
    transliteration: 'ṇṇya',
    examples: [],
  },
  {
    id: 'nnra',
    conjunct: 'ണ്ണ്ര',
    base: 'ണ',
    transliteration: 'ṇṇra',
    examples: [],
  },
  {
    id: 'nda',
    conjunct: 'ണ്ദ',
    base: 'ണ',
    transliteration: 'ṇda',
    examples: [],
  },
  {
    id: 'ndha',
    conjunct: 'ണ്ധ',
    base: 'ണ',
    transliteration: 'ṇdha',
    examples: [],
  },
  {
    id: 'nna2',
    conjunct: 'ണ്ന',
    base: 'ണ',
    transliteration: 'ṇna',
    examples: [],
  },
  // Category: ത (ta)
  {
    id: 'tta2',
    conjunct: 'ത്ത',
    base: 'ത',
    transliteration: 'tta',
    examples: [
        { word: 'മുത്ത്', meaning: 'pearl', transliteration: 'muththu', audioSrc: '' },
    ],
  },
  {
    id: 'ttya2',
    conjunct: 'ത്ത്യ',
    base: 'ത',
    transliteration: 'ttya',
    examples: [],
  },
  {
    id: 'ttra2',
    conjunct: 'ത്ത്ര',
    base: 'ത',
    transliteration: 'ttra',
    examples: [],
  },
  {
    id: 'ttva',
    conjunct: 'ത്ത്വ',
    base: 'ത',
    transliteration: 'ttva',
    examples: [],
  },
  {
    id: 'ttha2',
    conjunct: 'ത്ഥ',
    base: 'ത',
    transliteration: 'ttha',
    examples: [],
  },
  {
    id: 'tna',
    conjunct: 'ത്ന',
    base: 'ത',
    transliteration: 'tna',
    examples: [],
  },
  {
    id: 'tma',
    conjunct: 'ത്മ',
    base: 'ത',
    transliteration: 'tma',
    examples: [],
  },
  {
    id: 'tra',
    conjunct: 'ത്ര',
    base: 'ത',
    transliteration: 'tra',
    examples: [
        { word: 'പത്രം', meaning: 'letter / leaf', transliteration: 'pathram', audioSrc: '' },
    ],
  },
  {
    id: 'tya',
    conjunct: 'ത്യ',
    base: 'ത',
    transliteration: 'tya',
    examples: [],
  },
  {
    id: 'tva',
    conjunct: 'ത്വ',
    base: 'ത',
    transliteration: 'tva',
    examples: [],
  },
  {
    id: 'nta2',
    conjunct: 'ന്ത',
    base: 'ത',
    transliteration: 'nta',
    examples: [
        { word: 'ചിന്ത', meaning: 'thought / worry', transliteration: 'chinta', audioSrc: '' },
    ],
  },
  // Category: ദ (da)
  {
    id: 'dda2',
    conjunct: 'ദ്ദ',
    base: 'ദ',
    transliteration: 'dda',
    examples: [
        { word: 'ബുദ്ധി', meaning: 'intelligence', transliteration: 'buddhi', audioSrc: '' },
    ],
  },
  {
    id: 'ddya2',
    conjunct: 'ദ്ദ്യ',
    base: 'ദ',
    transliteration: 'ddya',
    examples: [],
  },
  {
    id: 'ddra2',
    conjunct: 'ദ്ദ്ര',
    base: 'ദ',
    transliteration: 'ddra',
    examples: [],
  },
  {
    id: 'ddha',
    conjunct: 'ദ്ധ',
    base: 'ദ',
    transliteration: 'ddha',
    examples: [
        { word: 'ശുദ്ധം', meaning: 'pure', transliteration: 'shuddham', audioSrc: '' },
    ],
  },
  {
    id: 'dna',
    conjunct: 'ദ്ന',
    base: 'ദ',
    transliteration: 'dna',
    examples: [],
  },
  {
    id: 'dma',
    conjunct: 'ദ്മ',
    base: 'ദ',
    transliteration: 'dma',
    examples: [],
  },
  {
    id: 'dra2',
    conjunct: 'ദ്ര',
    base: 'ദ',
    transliteration: 'dra',
    examples: [
        { word: 'ദ്രവ്യം', meaning: 'material / substance', transliteration: 'dravyam', audioSrc: '' },
    ],
  },
  {
    id: 'dya2',
    conjunct: 'ദ്യ',
    base: 'ദ',
    transliteration: 'dya',
    examples: [
        { word: 'വിദ്യ', meaning: 'knowledge', transliteration: 'vidya', audioSrc: '' },
    ],
  },
  {
    id: 'dva',
    conjunct: 'ദ്വ',
    base: 'ദ',
    transliteration: 'dva',
    examples: [],
  },
  // Category: ന (na)
  {
    id: 'nna3',
    conjunct: 'ന്ന',
    base: 'ന',
    transliteration: 'nna',
    examples: [
        { word: 'അന്നം', meaning: 'food', transliteration: 'annam', audioSrc: '' },
    ],
  },
  {
    id: 'nnya2',
    conjunct: 'ന്ന്യ',
    base: 'ന',
    transliteration: 'nnya',
    examples: [],
  },
  {
    id: 'nnra2',
    conjunct: 'ന്ന്ര',
    base: 'ന',
    transliteration: 'nnra',
    examples: [],
  },
  {
    id: 'nda2',
    conjunct: 'ന്ദ',
    base: 'ന',
    transliteration: 'nda',
    examples: [
        { word: 'ബന്ധം', meaning: 'relationship', transliteration: 'bandham', audioSrc: '' },
    ],
  },
  {
    id: 'ndya',
    conjunct: 'ന്ദ്യ',
    base: 'ന',
    transliteration: 'ndya',
    examples: [],
  },
  {
    id: 'ndra',
    conjunct: 'ന്ദ്ര',
    base: 'ന',
    transliteration: 'ndra',
    examples: [
        { word: 'ഇന്ദ്രൻ', meaning: 'Indra', transliteration: 'indran', audioSrc: '' },
    ],
  },
  {
    id: 'ndha2',
    conjunct: 'ന്ധ',
    base: 'ന',
    transliteration: 'ndha',
    examples: [
        { word: 'ബന്ധം', meaning: 'relationship', transliteration: 'bandham', audioSrc: '' },
    ],
  },
  {
    id: 'ndhya',
    conjunct: 'ന്ധ്യ',
    base: 'ന',
    transliteration: 'ndhya',
    examples: [],
  },
  {
    id: 'ndhra',
    conjunct: 'ന്ധ്ര',
    base: 'ന',
    transliteration: 'ndhra',
    examples: [],
  },
  {
    id: 'nma',
    conjunct: 'ന്മ',
    base: 'ന',
    transliteration: 'nma',
    examples: [
        { word: 'ജന്മം', meaning: 'birth', transliteration: 'janmam', audioSrc: '' },
    ],
  },
  {
    id: 'nya',
    conjunct: 'ന്യ',
    base: 'ന',
    transliteration: 'nya',
    examples: [
        { word: 'ന്യായം', meaning: 'justice', transliteration: 'nyayam', audioSrc: '' },
    ],
  },
  // Category: പ (pa)
  {
    id: 'ppa',
    conjunct: 'പ്പ',
    base: 'പ',
    transliteration: 'ppa',
    examples: [
        { word: 'കപ്പൽ', meaning: 'ship', transliteration: 'kappal', audioSrc: '' },
        { word: 'അപ്പം', meaning: 'appam (food)', transliteration: 'appam', audioSrc: '' },
    ],
  },
  {
    id: 'ppya',
    conjunct: 'പ്പ്യ',
    base: 'പ',
    transliteration: 'ppya',
    examples: [],
  },
  {
    id: 'ppra',
    conjunct: 'പ്പ്ര',
    base: 'പ',
    transliteration: 'ppra',
    examples: [
        { word: 'അപ്പ്രകാരം', meaning: 'accordingly', transliteration: 'apprakaram', audioSrc: '' },
    ],
  },
  {
    id: 'ppva',
    conjunct: 'പ്പ്വ',
    base: 'പ',
    transliteration: 'ppva',
    examples: [],
  },
  {
    id: 'pta',
    conjunct: 'പ്ത',
    base: 'പ',
    transliteration: 'pta',
    examples: [],
  },
  {
    id: 'ptha',
    conjunct: 'പ്ഥ',
    base: 'പ',
    transliteration: 'ptha',
    examples: [],
  },
  {
    id: 'pna',
    conjunct: 'പ്ന',
    base: 'പ',
    transliteration: 'pna',
    examples: [],
  },
  {
    id: 'pma',
    conjunct: 'പ്മ',
    base: 'പ',
    transliteration: 'pma',
    examples: [],
  },
  {
    id: 'pra',
    conjunct: 'പ്ര',
    base: 'പ',
    transliteration: 'pra',
    examples: [
        { word: 'പ്രഭാതം', meaning: 'morning', transliteration: 'prabhatham', audioSrc: '' },
    ],
  },
  {
    id: 'pya',
    conjunct: 'പ്യ',
    base: 'പ',
    transliteration: 'pya',
    examples: [],
  },
  {
    id: 'pva',
    conjunct: 'പ്വ',
    base: 'പ',
    transliteration: 'pva',
    examples: [],
  },
  {
    id: 'mpa',
    conjunct: 'മ്പ',
    base: 'പ',
    transliteration: 'mpa',
    examples: [
        { word: 'അമ്പലം', meaning: 'temple', transliteration: 'ambalam', audioSrc: '' },
    ],
  },
  // Category: മ (ma)
  {
    id: 'mma',
    conjunct: 'മ്മ',
    base: 'മ',
    transliteration: 'mma',
    examples: [
        { word: 'അമ്മ', meaning: 'mother', transliteration: 'amma', audioSrc: '' },
    ],
  },
  {
    id: 'mmya',
    conjunct: 'മ്മ്യ',
    base: 'മ',
    transliteration: 'mmya',
    examples: [],
  },
  {
    id: 'mmra',
    conjunct: 'മ്മ്ര',
    base: 'മ',
    transliteration: 'mmra',
    examples: [],
  },
  {
    id: 'mpra',
    conjunct: 'മ്പ്ര',
    base: 'മ',
    transliteration: 'mpra',
    examples: [
        { word: 'സമ്പ്രദായം', meaning: 'tradition', transliteration: 'sampradayam', audioSrc: '' },
    ],
  },
  {
    id: 'mna',
    conjunct: 'മ്ന',
    base: 'മ',
    transliteration: 'mna',
    examples: [],
  },
  {
    id: 'mra',
    conjunct: 'മ്ര',
    base: 'മ',
    transliteration: 'mra',
    examples: [
        { word: 'അമൃതം', meaning: 'nectar / immortality', transliteration: 'amrutam', audioSrc: '' },
    ],
  },
  {
    id: 'mya',
    conjunct: 'മ്യ',
    base: 'മ',
    transliteration: 'mya',
    examples: [],
  },
  {
    id: 'mva',
    conjunct: 'മ്വ',
    base: 'മ',
    transliteration: 'mva',
    examples: [],
  },
  // Category: യ (ya)
  {
    id: 'yya',
    conjunct: 'യ്യ',
    base: 'യ',
    transliteration: 'yya',
    examples: [
        { word: 'അയ്യോ', meaning: 'exclamation (oh no!)', transliteration: 'ayyō', audioSrc: '' },
    ],
  },
  // Category: ര (ra)
  {
    id: 'rra',
    conjunct: 'ര്ര',
    base: 'ര',
    transliteration: 'rra',
    examples: [
        { word: 'ചക്രരഥം', meaning: 'chariot', transliteration: 'chakraratham', audioSrc: '' },
    ],
  },
  // Category: ല (la)
  {
    id: 'lla',
    conjunct: 'ല്ല',
    base: 'ല',
    transliteration: 'lla',
    examples: [
        { word: 'വെള്ളം', meaning: 'water', transliteration: 'veḷḷam', audioSrc: '' },
    ],
  },
  {
    id: 'llya',
    conjunct: 'ല്ല്യ',
    base: 'ല',
    transliteration: 'llya',
    examples: [],
  },
  {
    id: 'llra',
    conjunct: 'ല്ല്ര',
    base: 'ല',
    transliteration: 'llra',
    examples: [],
  },
  {
    id: 'lpa',
    conjunct: 'ല്പ',
    base: 'ല',
    transliteration: 'lpa',
    examples: [
        { word: 'അല്പം', meaning: 'a little / small amount', transliteration: 'alpam', audioSrc: '' },
    ],
  },
  {
    id: 'lma',
    conjunct: 'ല്മ',
    base: 'ല',
    transliteration: 'lma',
    examples: [],
  },
  {
    id: 'lva',
    conjunct: 'ല്വ',
    base: 'ല',
    transliteration: 'lva',
    examples: [],
  },
  // Category: വ (va)
  {
    id: 'vva',
    conjunct: 'വ്വ',
    base: 'വ',
    transliteration: 'vva',
    examples: [
        { word: 'അവ്വിടെ', meaning: 'there', transliteration: 'avviṭe', audioSrc: '' },
    ],
  },
  {
    id: 'vra',
    conjunct: 'വ്ര',
    base: 'വ',
    transliteration: 'vra',
    examples: [
        { word: 'വ്രതം', meaning: 'vow / ritual fasting', transliteration: 'vratham', audioSrc: '' },
    ],
  },
  {
    id: 'vya',
    conjunct: 'വ്യ',
    base: 'വ',
    transliteration: 'vyā',
    examples: [
        { word: 'വ്യക്തി', meaning: 'person', transliteration: 'vyakti', audioSrc: '' },
    ],
  },
  {
    id: 'vla',
    conjunct: 'വ്ല',
    base: 'വ',
    transliteration: 'vla',
    examples: [],
  },
  // Category: ശ (śa)
  {
    id: 'ssa',
    conjunct: 'ശ്ശ',
    base: 'ശ',
    transliteration: 'śśa',
    examples: [
        { word: 'കാശ്ശി', meaning: 'cough (colloquial)', transliteration: 'kāśśi', audioSrc: '' },
    ],
  },
  {
    id: 'sca',
    conjunct: 'ശ്ച',
    base: 'ശ',
    transliteration: 'śca',
    examples: [
        { word: 'ആശ്ചര്യം', meaning: 'wonder', transliteration: 'aashcharyam', audioSrc: '' },
    ],
  },
  {
    id: 'scya',
    conjunct: 'ശ്ച്യ',
    base: 'ശ',
    transliteration: 'ścya',
    examples: [
        { word: 'വിശ്ചയം', meaning: 'certainty', transliteration: 'viścayaṁ', audioSrc: '' },
    ],
  },
  {
    id: 'scra',
    conjunct: 'ശ്ച്ര',
    base: 'ശ',
    transliteration: 'ścra',
    examples: [],
  },
  {
    id: 'sra',
    conjunct: 'ശ്ര',
    base: 'ശ',
    transliteration: 'śra',
    examples: [
        { word: 'ശ്രവണം', meaning: 'hearing / listening', transliteration: 'shravanam', audioSrc: '' },
    ],
  },
  {
    id: 'sya',
    conjunct: 'ശ്യ',
    base: 'ശ',
    transliteration: 'śya',
    examples: [],
  },
  {
    id: 'sva',
    conjunct: 'ശ്വ',
    base: 'ശ',
    transliteration: 'śva',
    examples: [
        { word: 'ശ്വാനം', meaning: 'dog', transliteration: 'śvānam', audioSrc: '' },
    ],
  },
  // Category: സ (sa)
  {
    id: 'ssa2',
    conjunct: 'സ്സ',
    base: 'സ',
    transliteration: 'ssa',
    examples: [
        { word: 'മുത്തസ്സൻ', meaning: 'grandfather', transliteration: 'muttassan', audioSrc: '' },
    ],
  },
  {
    id: 'sta',
    conjunct: 'സ്ത',
    base: 'സ',
    transliteration: 'sta',
    examples: [
        { word: 'സ്ഥലം', meaning: 'place', transliteration: 'sthalam', audioSrc: '' },
    ],
  },
  {
    id: 'stra',
    conjunct: 'സ്ത്ര',
    base: 'സ',
    transliteration: 'stra',
    examples: [
        { word: 'സ്ത്രീ', meaning: 'woman', transliteration: 'strī', audioSrc: '' },
    ],
  },
  {
    id: 'stva',
    conjunct: 'സ്ത്വ',
    base: 'സ',
    transliteration: 'stva',
    examples: [],
  },
  {
    id: 'sna',
    conjunct: 'സ്ന',
    base: 'സ',
    transliteration: 'sna',
    examples: [],
  },
  {
    id: 'sma',
    conjunct: 'സ്മ',
    base: 'സ',
    transliteration: 'sma',
    examples: [
        { word: 'സ്മരണം', meaning: 'remembrance', transliteration: 'smaraṇam', audioSrc: '' },
    ],
  },
  {
    id: 'sra2',
    conjunct: 'സ്ര',
    base: 'സ',
    transliteration: 'sra',
    examples: [
        { word: 'സ്രാവം', meaning: 'discharge / shark', transliteration: 'sraavam', audioSrc: '' },
    ],
  },
  {
    id: 'sya2',
    conjunct: 'സ്യ',
    base: 'സ',
    transliteration: 'sya',
    examples: [
        { word: 'സ്യാത്', meaning: 'may be / let it be', transliteration: 'syāt', audioSrc: '' },
    ],
  },
  {
    id: 'sva2',
    conjunct: 'സ്വ',
    base: 'സ',
    transliteration: 'sva',
    examples: [
        { word: 'സ്വയം', meaning: 'by oneself', transliteration: 'svayam', audioSrc: '' },
    ],
  },
  // Category: ഹ (ha)
  {
    id: 'hna',
    conjunct: 'ഹ്ന',
    base: 'ഹ',
    transliteration: 'hna',
    examples: [
        { word: 'ഹ്നാനം', meaning: 'destruction (rare)', transliteration: 'hnānam', audioSrc: '' },
    ],
  },
  {
    id: 'hma',
    conjunct: 'ഹ്മ',
    base: 'ഹ',
    transliteration: 'hma',
    examples: [
        { word: 'ബ്രഹ്മം', meaning: 'the absolute', transliteration: 'brahmam', audioSrc: '' },
    ],
  },
  {
    id: 'hra',
    conjunct: 'ഹ്ര',
    base: 'ഹ',
    transliteration: 'hra',
    examples: [
        { word: 'ഹൃദയം', meaning: 'heart', transliteration: 'hrudayam', audioSrc: '' },
    ],
  },
  {
    id: 'hya',
    conjunct: 'ഹ്യ',
    base: 'ഹ',
    transliteration: 'hya',
    examples: [
        { word: 'അഹ്യ', meaning: 'day (Vedic usage)', transliteration: 'ahya', audioSrc: '' },
    ],
  },
  {
    id: 'hva',
    conjunct: 'ഹ്വ',
    base: 'ഹ',
    transliteration: 'hva',
    examples: [
        { word: 'അഭിവാദ്യം', meaning: 'salutation', transliteration: 'abhivādyaṁ', audioSrc: '' },
    ],
  },
  // Category: ള (ḷa)
  {
    id: 'lla2',
    conjunct: 'ള്ള',
    base: 'ള',
    transliteration: 'ḷḷa',
    examples: [
        { word: 'വെള്ളം', meaning: 'water', transliteration: 'veḷḷam', audioSrc: '' },
    ],
  },
  {
    id: 'llya2',
    conjunct: 'ല്ല്യ',
    base: 'ള',
    transliteration: 'llya',
    examples: [],
  },
  {
    id: 'llra2',
    conjunct: 'ല്ല്ര',
    base: 'ള',
    transliteration: 'llra',
    examples: [],
  },
  {
    id: 'lpa2',
    conjunct: 'ല്പ',
    base: 'ള',
    transliteration: 'lpa',
    examples: [
        { word: 'അല്പം', meaning: 'a little / small amount', transliteration: 'alpam', audioSrc: '' },
    ],
  },
  {
    id: 'lma2',
    conjunct: 'ല്മ',
    base: 'ള',
    transliteration: 'lma',
    examples: [],
  },
  {
    id: 'lva2',
    conjunct: 'ല്വ',
    base: 'ള',
    transliteration: 'lva',
    examples: [],
  },
  // Category: ഴ (ḻa)
  {
    id: 'zhla',
    conjunct: 'ഴ്ല',
    base: 'ഴ',
    transliteration: 'ḻla',
    examples: [
        { word: 'വാഴ്ല', meaning: 'banana (colloquial)', transliteration: 'vāḻla', audioSrc: '' },
    ],
  },
  // Category: റ (ṟa)
  {
    id: 'tta3',
    conjunct: 'റ്റ',
    base: 'റ',
    transliteration: 'ṭṭa',
    examples: [
        { word: 'പട്ടം', meaning: 'kite / rank', transliteration: 'paṭṭam', audioSrc: '' },
    ],
  },
  {
    id: 'ttya3',
    conjunct: 'റ്റ്യ',
    base: 'റ',
    transliteration: 'ṭṭya',
    examples: [
        { word: 'കൊറ്റ്യം', meaning: 'court (as in palace / law court)', transliteration: 'koṭṭyaṁ', audioSrc: '' },
    ],
  },
  {
    id: 'ttra3',
    conjunct: 'റ്റ്ര',
    base: 'റ',
    transliteration: 'ṭra',
    examples: [
        { word: 'മീറ്റ്രം', meaning: 'meter (measure / verse)', transliteration: 'mīṭraṁ', audioSrc: '' },
    ],
  },
  {
    id: 'ttva2',
    conjunct: 'റ്റ്വ',
    base: 'റ',
    transliteration: 'ṭva',
    examples: [
        { word: 'ആക്ട്വൽ', meaning: 'actual', transliteration: 'ākṭval', audioSrc: '' },
    ],
  },
];