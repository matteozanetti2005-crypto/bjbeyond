# Stato del lavoro — bjbeyond.it

Documento di passaggio. Se stai aprendo una nuova sessione su questo repository,
leggi questo file per primo: contiene ciò che è stato fatto, ciò che resta e le
trappole già scoperte, così da non doverle ritrovare.

Ultimo aggiornamento: 14 agosto 2026.

---

## 1. Dove siamo

Sito Next.js 16 in **export statico**, servito da **GitHub Pages** sul dominio
`bjbeyond.it`. È l'unico target di deploy: `vercel.json` e `wrangler.jsonc` sono
stati rimossi (vedi fase 4).

**Trappola già risolta, ma da non reintrodurre:** la sorgente di Pages deve
restare su **GitHub Actions**, non su "Deploy from a branch". Con la sorgente su
branch, Jekyll ricostruisce il sito dalla root e — non trovando `index.html` —
renderizza il README come homepage. È esattamente il guasto da cui è partito
tutto questo lavoro.

Il deploy è `.github/workflows/deploy.yml`: builda e pubblica `out/`.

### Comandi

```bash
npm run dev        # dev server, porta 3000
npm run build      # export statico in out/
npm run typecheck  # tsc --noEmit, con noUnusedLocals attivo
npm run media      # rigenera public/media/ da media-src/
```

Non c'è `npm run lint`, ed è una scelta: vedi fase 4.

---

## 2. Cosa è stato fatto

Quattro fasi. Il registro completo dei reperti con le motivazioni tecniche è
nell'audit pubblicato come artifact (`Audit tecnico — bjbeyond.it`).

### Numeri

| | Prima | Ora |
|---|---|---|
| Artefatto di deploy | 17,95 MB | **2,58 MB** |
| **JavaScript nel caricamento iniziale** | 863 KB → 709 KB | **598 KB** |
| JavaScript totale su disco | 863 KB | 718 KB |
| Chunk librerie di animazione, iniziale | 303 KB | **0 KB** (GSAP a richiesta) |
| Elementi invisibili senza JS | 64 | **0** |
| Filtri SVG | 8 | **0** |
| Layer con `mix-blend-mode` | 16 | **0** |
| Layer promossi su mobile | 48 | **0** |
| Layer promossi da `will-change` su desktop | 48 | **0** |
| Animazioni CSS attive su mobile | ~64 | **1** (il ticker) |
| Componenti client | 18 | **15** |
| Dipendenze runtime | 7 | **4** |

Attenzione a come si legge la riga di GSAP. La libreria pesa **111 KB**, non i
158 del chunk che la conteneva: gli altri 47 KB erano il codice dei componenti
del sito, che ovviamente continua a spedirsi. Quello che è uscito dal percorso
critico è 111 KB, sostituito da uno stub di **214 byte**.

### Fase 1 — pulizia
- Cancellata `public/assets/` (15,3 MB, di cui un MP4 da 14,7 MB) — non era
  referenziata da nulla. Autorizzata esplicitamente dal proprietario.
- `js-reveal` spostata dentro i primitivi di Reveal (poi superata, vedi fase 3).
- Tolto `'use client'` da Authentia, Contact, Labs, Work: nessuno usava hook.
- Pesi dei font ridotti a quelli realmente applicati (Inter 200/300/400,
  JetBrains Mono 500).
- `fetchPriority="low"` sul logo, che competeva con l'immagine LCP nel preload.
- `noUnusedLocals` e `noUnusedParameters` in `tsconfig.json`.

### Fase 2 — costo per frame
- La sfocatura della nav non anima più il **raggio**: layer dedicato a raggio
  costante, si anima solo l'opacità.
- Padding e larghezza del logo su transizioni CSS / `transform: scale`.
- Il bagliore dei nodi del grafico da `feGaussianBlur` a `radialGradient`.

### Fase 3 — via Framer Motion
Rimosso completamente. Sostituito da:
- `lib/reveal.ts` — **un solo** IntersectionObserver condiviso che aggiunge la
  classe `is-in`. Prima erano ~70 componenti motion.
- Le curve e le durate vivono in `app/globals.css`, pilotate da tre custom
  property: `--reveal-delay`, `--reveal-duration`, `--reveal-distance`.
- `Intro` (la tenda), `Hero`, `Navigation` convertiti a classi + transizioni.
- La barra di progresso: un listener passivo coalescato in un `requestAnimationFrame`
  che scrive `scaleX` direttamente, invece di `useScroll` + `useSpring`.
- Rimossa anche `lucide-react`, che non era importata da nessun file.

### Fase 4 — GSAP fuori dal percorso critico

**Intelligence non usa più GSAP.** Era l'ultimo consumatore sotto i 1024px, e
animava due cose:

- *L'ingresso della curva.* Ora è una transizione CSS su `clip-path` (`.u-draw`
  in `globals.css`), agganciata allo stesso observer di ogni altro reveal: la
  linea si scopre da sinistra.
- *Il cambio filtro.* Resta in JavaScript perché è l'unica parte che CSS
  davvero non può fare — ogni frame è una stringa di path diversa, non un valore
  diverso di una proprietà. È un `requestAnimationFrame` con `expo.out` scritto
  a mano, sette interpolazioni per frame.

**Perché una clip e non un `stroke-dasharray`.** Il disegno a tratteggio è la
soluzione ovvia, ed è quella che non funziona qui. La curva porta
`vector-effect: non-scaling-stroke` — le serve, o il suo tratto da 1.25 verrebbe
reso a 0,42px su un telefono — e quell'effetto sposta il calcolo del tratteggio
in spazio schermo mentre la geometria del path resta in spazio utente. Misurato
contando i pixel accesi su canvas, con `pathLength="1"`:

| offset | senza `non-scaling-stroke` | con |
|---|---|---|
| 0 | 400 px accesi | 1600 |
| 0,55 | 180 | **1600** |
| 1 | 0 | 0 |

Cioè: con `non-scaling-stroke` ogni offset intermedio rende identico al pieno, e
la linea **scatta** invece di disegnarsi. `getTotalLength()` non salva la
situazione, perché riporta unità utente per un pattern applicato in pixel
schermo: **è lo stesso disallineamento che aveva anche la versione GSAP**, quindi
questa animazione non ha mai funzionato come si credeva.

`clip-path` non dipende dalle unità del tratteggio — è una percentuale della
scatola del path — quindi tiene a qualsiasi larghezza senza misurare niente e
senza ricalcolare al resize. Verificato che interpoli davvero (100% → 74,25% →
48,5% → 22,75% → -3%) e a schermo.

In più, le due `<path>` e i sette nodi ora nascono con la loro geometria nel
markup esportato: il grafico è nell'HTML invece di comparire dopo l'idratazione.
Regge perché quei valori sono costanti — React riscrive un attributo solo quando
il valore che ha reso cambia, quindi le `setAttribute` per frame e React non si
contendono gli stessi nodi.

**GSAP si carica con `import()` dietro il gate desktop.**
`lib/gsap.ts` non contiene più la libreria: contiene il cancello. `lib/gsap-runtime.ts`
è la libreria, e **nessuno deve importarlo staticamente** — basta un import
statico in un punto qualsiasi per rimettere 111 KB nel bundle iniziale.

- `useDesktopGsap(setup, scope)` sostituisce `useGSAP`. Tiene la media query
  `(min-width: 1024px) and (prefers-reduced-motion: no-preference)`, e solo se
  combacia chiede la libreria. Prima la stessa domanda la faceva
  `gsap.matchMedia()`, cioè **dentro** la libreria: un telefono scaricava 111 KB
  per farsi rispondere che niente di tutto quello valeva per un telefono.
- Il gate ascolta `change`, quindi una finestra desktop stretta e poi riallargata
  carica e ricostruisce il contesto, come faceva `gsap.matchMedia()`.
- `@gsap/react` è stato rimosso: è un hook, gli hook si importano staticamente, e
  importarlo importa GSAP. Non serviva comunque — `gsap.context()` da solo dà lo
  scoping, il cleanup e, via `ctx.add(null, fn)`, lo stesso `contextSafe`.
- **Chi ha cambiato comportamento:** `Cursor` e `Magnetic` erano dietro
  `hasFinePointer()` a qualsiasi larghezza. Ora sono anche dietro i 1024px. Per
  il cursore è una correzione — il suo markup era già `lg:block`, quindi sotto la
  soglia girava quattro tween al frame su due elementi invisibili. Per Magnetic
  significa che una finestra desktop sotto i 1024px perde l'effetto magnetico.
- Chi ha `prefers-reduced-motion: reduce` non scarica GSAP a nessuna larghezza.

**`will-change` tolto dai layer di Atmosphere** (`.u-fog-a`, `.u-fog-b`,
`.u-breathe`). Tutti e tre animano `transform`, che il compositore sa gestire da
sé: il browser promuove per la durata dell'animazione senza che glielo si chieda.
Quello che `will-change` aggiungeva era promozione che inizia prima
dell'animazione e non finisce mai — su sedici istanze, quarantotto layer tenuti
in permanenza, compresi tutti quelli fuori schermo. `backface-visibility` resta:
non è un hint di promozione.

*La misura, perché era la condizione.* Cinque passate alternate a 1280×800,
scroll programmatico di 3200px in 4s, campionando gli intervalli fra frame:

| | media | mediana | p95 | frame > 20ms |
|---|---|---|---|---|
| senza `will-change` (3 passate) | 7,05–7,14 ms | 6,90 | 7,1 | **0** |
| con `will-change` (2 passate) | 7,11–7,28 ms | 6,90 | 7,0–7,1 | **0** |

Su questa macchina (145 Hz) le due condizioni sono indistinguibili e nessuna
perde un frame. Va letta per quello che è: **conferma che togliere `will-change`
non è una regressione**, che era il rischio. Non è una prova del guadagno — la
memoria texture dei 48 layer promossi non è osservabile da JavaScript, e una
macchina che tiene i 145 Hz in entrambi i casi non può mostrarla. Su hardware più
modesto la differenza esiste o non esiste, e questo banco non lo dice.

**Rimossi `vercel.json` e `wrangler.jsonc`.** Nessuno dei due era un deploy
attivo; il secondo era registrato come `phoenix-analyzer`, il nome di un altro
progetto. Il README documentava tre target quando ce n'è uno. Sono in git se un
giorno servono.

**Tolto lo script `lint`.** Chiamava `next lint`, rimosso in Next 16, contro una
configurazione ESLint che non esisteva: ogni commento `eslint-disable` nel
codice sopprimeva una regola che non girava. La sostituzione ovvia — la flat
config di `eslint-config-next` — **non è installabile qui**: carica
`typescript-eslint`, che si rifiuta di partire contro TypeScript 7 e chiede
l'API di TS 6 ([typescript-eslint#10940][ts-eslint]). Provato anche a forzare
una copia annidata di TS 6 con `overrides`: npm risolve `typescript` dalla root
perché è una peer dependency, e il gate scatta comunque. Senza
`typescript-eslint` non esiste parser TS per ESLint — verificato: espree fallisce
su qualsiasi annotazione di tipo. Piuttosto che lasciare 300 pacchetti che non
possono girare, lo script è stato tolto. Il gate resta `npm run typecheck`.

[ts-eslint]: https://github.com/typescript-eslint/typescript-eslint/issues/10940

---

## 3. Meccanismi da conoscere prima di toccare le animazioni

**Lo stato nascosto è dietro `.js`.** Uno script inline in `app/layout.tsx`
stampa la classe `js` su `<html>` prima del primo paint. Tutte le regole
`:not(.is-in)` in `globals.css` sono scoperte da quella classe. Senza
JavaScript la regola non combacia e il contenuto è semplicemente visibile —
per questo non serve più nessun `<noscript>`. Su `<html>` c'è
`suppressHydrationWarning` proprio per questo, **non rimuoverlo**.

**Il breakpoint è 1024px, e vale per tutto.** Parallax, pin di Method, deriva
della nebbia, animazione della grana, cursore e magnetico sono tutti dietro
`(min-width: 1024px) and (prefers-reduced-motion: no-preference)` — in
`useDesktopGsap` nei componenti, o in media query in `globals.css`. Sotto quella
soglia il sito è volutamente statico. Non introdurre una seconda soglia. La
stringa vive in `DESKTOP_MOTION` in `lib/gsap.ts` ed è duplicata in
`globals.css`: cambiarne una sola le fa divergere.

**Non importare `lib/gsap-runtime.ts` staticamente.** È l'unico modulo che tocca
`gsap` e `gsap/ScrollTrigger`. Si raggiunge solo da `loadGsap()`. Un import
statico da qualunque file rimette la libreria nel bundle iniziale senza che
niente si rompa e senza che nessun test se ne accorga — il controllo è che
`out/index.html` non nomini il chunk da 111 KB.

**Ciò che segue GSAP non deve caricarlo.** `ScrollSync` usa `whenGsapReady()`,
non `loadGsap()`: su un telefono nessuno ha chiesto la libreria e lui non deve
diventare il motivo per cui arriva. Va chiamata al momento dell'uso, non al
mount: le sezioni più in basso nell'albero non hanno ancora eseguito i loro
effetti.

**`transition-colors` di Tailwind cancella le transizioni dei reveal.** Quella
utility riscrive `transition-property`. Se serve un cambio di colore su un
elemento che porta `u-reveal` o `u-mask-line`, mettila su un figlio (vedi le
voci del menu in `Navigation.tsx`).

**Non scrivere nomi di classi Tailwind nei commenti.** Tailwind scansiona i file
come testo: nominare un'utility anche solo in un commento la fa rigenerare nel
CSS anche se non è usata.

---

## 4. Dove vogliamo andare

### Cosa è già stato verificato nel browser

Sulla **build di produzione** servita da un server statico, non sul dev server —
la distinzione conta, vedi §6.

| | Esito |
|---|---|
| A 375px, chunk GSAP richiesto | **no** — 8 file JS, 488 KB |
| A 1280px, chunk GSAP richiesto | sì, 111 KB, a 143 ms, come richiesta separata |
| Ingresso della curva | clip 100% → 43% → aperta, confermato anche a schermo |
| Cambio filtro | 151,76 → 127,05 → 119,79 → … → 116,61, coda di `expo.out` |
| Pin di Method | `fixed` dentro il range; spacer 3920px = 800 + 5 × 78% |
| Scansione dei pilastri | 01 → 02 → 03 → 04 → 05 |
| Hero risalendo in cima | `opacity: 1`, `y: 0` — il guasto storico non torna |

Il pin corretto è anche la prova che l'ordine di `ScrollSync` regge: i trigger
esistono con il range giusto, quindi il `refresh()` arriva dopo che le sezioni li
hanno creati.

Resta non verificato solo il comportamento su **browser diversi da Chromium**,
in particolare il riquadro di riferimento di `clip-path` su un elemento SVG
(`fill-box`) e il comportamento del tratteggio sotto `non-scaling-stroke`, che è
stato misurato solo qui.

### Nota aperta, non tecnica

`lib/legal.ts` nomina Vercel fra i fornitori (riga 118) e cita "Vercel Analytics
o simili" (riga 204). Con Vercel non più fra i target di deploy, quel testo
descrive una realtà che non c'è. È testo legale: da correggere con il
proprietario, non di iniziativa.

### Nota estetica, non tecnica

Il ritratto in About non è una silhouette ritagliata: è una lastra rettangolare
con il suo fondo studio, con trasparenza nei margini (37,8% del fotogramma). Su
fondo scuro funziona, ma il bordo si percepisce. Il proprietario ha deciso di
**tenerlo così**. Non "correggerlo" di iniziativa.

---

## 5. Stato del repository

**Nulla è committato.** Circa trenta file modificati nell'albero di lavoro, più
`components/primitives/ButtonLink.tsx`, `lib/reveal.ts`, `lib/gsap-runtime.ts` e
questo file come nuovi; `vercel.json` e `wrangler.jsonc` cancellati.

Un push su `main` pubblica in produzione: va fatto solo su richiesta esplicita.

Prima di committare conviene far girare `npm run typecheck` e `npm run build`,
che al momento passano entrambi puliti.

---

## 6. Come verificare, e perché è stato un problema

Il pannello Browser di Claude **deve essere aperto e in primo piano**. Se è
chiuso o il tab è in secondo piano, la pagina non compone frame: niente
`requestAnimationFrame`, niente IntersectionObserver, niente lazy loading, e gli
stili calcolati letti dopo una mutazione sono inaffidabili. In quello stato ogni
verifica di animazioni dà falsi negativi — è già successo, con parecchio tempo
perso a inseguirli, ed è successo di nuovo nella fase 4.

Regola pratica: se i reveal risultano tutti a `opacity: 0` e la barra di
progresso resta a `scaleX(0)`, il problema è il pannello, non il codice. Il
controllo rapido è `requestAnimationFrame` dentro una Promise con timeout: se non
scatta, non fidarti di nient'altro.

**Il dev server non serve per verificare il code splitting.** `next dev` carica
avidamente i chunk degli `import()` dinamici: a 375px, con la media query che non
combacia, `lib_gsap-runtime_ts_*.js` risulta comunque richiesto. Non è un difetto
del gate — sulla build di produzione, alla stessa larghezza, quel chunk non
compare affatto. Per qualsiasi domanda su cosa viene scaricato, servire `out/` con
un server statico e guardare lì; il dev server risponde a un'altra domanda.

Quello che **si può** verificare senza pannello, e che conviene fare comunque
perché non dipende da nessun rendering:

```bash
npm run build
```

poi, su `out/`: che `index.html` non nomini il chunk grande di GSAP (deve
nominare solo lo stub da ~200 byte), che il CSS compilato non contenga
`will-change`, e che il markup contenga già `pathLength="1"` e la geometria del
grafico.

Il browser di sistema (Edge, Chrome) tramite computer-use è concesso **solo in
lettura**: si vede lo schermo, non si può scorrere né cliccare. Serve per
confermare a occhio, non per pilotare.
