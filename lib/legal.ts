/**
 * Privacy and Cookie policy content, transcribed from the documents in
 * `public/docs/`. These are legal statements: nothing is reworded or softened
 * for tone, and the rebuild changed their presentation only.
 *
 * They stay in Italian because they describe an Italian data controller's
 * obligations; the rendered page marks the switch with `lang="it"`.
 *
 * WHERE THE COOKIE POLICY NOW DIVERGES FROM THE 2026 TRANSCRIPTION, and why a
 * document that is not to be reworded was nonetheless edited: it had stopped
 * describing the site. It named "Vercel Analytics o simili" while Google
 * Analytics 4 was what was actually running; it referred to a consent banner
 * "se presente" when there was none; and it stated in as many words that the
 * site used no advertising profiling cookies and shared no data with
 * advertisers — a sentence that a Meta pixel makes false the moment it is
 * switched on.
 *
 * A privacy policy that misdescribes the processing is not a lesser problem
 * than having no policy. So the cookie sections below are now derived from
 * `lib/analytics.ts` rather than written down beside it: the marketing rows
 * appear if and only if `META_PIXEL_ID` is set. The document cannot drift from
 * the site, because the same constant decides both.
 */

export type LegalBlock =
  | { kind: 'text'; value: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'pairs'; items: { term: string; detail: string }[] }
  | { kind: 'ordered'; items: string[] }
  | { kind: 'table'; head: string[]; rows: string[][] }
  /** A standalone emphasised statement. */
  | { kind: 'callout'; value: string };

export interface LegalSection {
  id: string;
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDocument {
  index: string;
  eyebrow: string;
  title: string[];
  updated: string;
  intro: string;
  sections: LegalSection[];
  closing: string;
  /** Path the previous site served this document from. Kept working. */
  legacyPath: string;
}

import { META_PIXEL_ID } from './analytics';

const EMAIL = 'bj_beyond@tutamail.com';
const X_HANDLE = '@BJ_Beyond';
const X_URL = 'https://x.com/BJ_Beyond';

export const CONTACT_LINKS = { email: EMAIL, xHandle: X_HANDLE, xUrl: X_URL } as const;

export const PRIVACY: LegalDocument = {
  index: '01',
  eyebrow: 'LEGAL',
  title: ['PRIVACY', 'POLICY'],
  updated: '21 Luglio 2026',
  legacyPath: '/pages/privacy-policy.html',
  intro:
    'BJ Beyond (Matteo Zanetti) si impegna a proteggere la tua privacy. Questa Informativa descrive come raccogliamo, utilizziamo e proteggiamo i tuoi dati personali in conformità con il Regolamento UE 2016/679 (GDPR), il D.Lgs. 196/2003 (Codice Privacy) e le Linee Guida EDPD.',
  sections: [
    {
      id: 'titolare',
      heading: 'Titolare del Trattamento',
      blocks: [
        {
          kind: 'pairs',
          items: [
            { term: 'Titolare', detail: 'Matteo Zanetti – BJ Beyond' },
            { term: 'Sede', detail: 'Milano, Italia' },
            { term: 'Email', detail: EMAIL },
            { term: 'X', detail: X_HANDLE },
          ],
        },
      ],
    },
    {
      id: 'dati-raccolti',
      heading: 'Dati raccolti',
      blocks: [
        {
          kind: 'pairs',
          items: [
            {
              term: 'Dati di navigazione',
              detail:
                'Indirizzo IP, tipo di browser, dispositivo, pagine visitate, tempo di permanenza (tramite log di hosting o analytics anonimi).',
            },
            {
              term: 'Dati dal Phoenix Simulator',
              detail:
                'I testi dei post che inserisci vengono elaborati in locale o tramite API (Claude/Groq) senza memorizzazione permanente sul nostro server.',
            },
            {
              term: 'Dati di contatto',
              detail: 'Nome, email e messaggio se ci scrivi via form o email.',
            },
          ],
        },
        {
          kind: 'callout',
          value: 'Non raccogliamo dati sensibili né vendiamo dati a terzi.',
        },
      ],
    },
    {
      id: 'finalita',
      heading: 'Finalità e base giuridica',
      blocks: [
        {
          kind: 'ordered',
          items: [
            'Fornire i servizi richiesti (es. simulazione Phoenix) – art. 6.1.b GDPR.',
            'Migliorare il sito e analizzare l’uso in modo anonimo – Legittimo Interesse.',
            'Rispondere a richieste di contatto – Consenso o legittimo interesse.',
            'Adempiere obblighi legali.',
          ],
        },
      ],
    },
    {
      id: 'trasferimenti',
      heading: 'Trasferimenti extra-UE',
      blocks: [
        {
          kind: 'text',
          value: META_PIXEL_ID
            ? 'Utilizziamo fornitori sicuri (Vercel, Anthropic, Groq, Google Ireland Ltd., Meta Platforms Ireland Ltd.) con Clausole Contrattuali Standard o adeguatezza. Google e Meta possono trasferire dati negli Stati Uniti sulla base del EU-US Data Privacy Framework.'
            : 'Utilizziamo fornitori sicuri (Vercel, Anthropic, Groq, Google Ireland Ltd.) con Clausole Contrattuali Standard o adeguatezza. Google può trasferire dati negli Stati Uniti sulla base del EU-US Data Privacy Framework.',
        },
      ],
    },
    {
      id: 'diritti',
      heading: 'I tuoi diritti (GDPR)',
      blocks: [
        { kind: 'text', value: 'In qualsiasi momento puoi:' },
        {
          kind: 'list',
          items: [
            'Accedere, rettificare, cancellare, limitare o opporti al trattamento',
            'Chiedere la portabilità dei dati',
            'Revocare il consenso',
          ],
        },
        {
          kind: 'text',
          value: `Scrivi a ${EMAIL}. Rispondo entro 30 giorni.`,
        },
      ],
    },
    {
      id: 'conservazione',
      heading: 'Conservazione',
      blocks: [
        {
          kind: 'text',
          value:
            'I dati vengono conservati solo per il tempo necessario (log di navigazione max 12-24 mesi, dati di contatto fino a chiusura richiesta).',
        },
      ],
    },
    {
      id: 'modifiche',
      heading: 'Modifiche alla Policy',
      blocks: [
        {
          kind: 'text',
          value: 'Eventuali aggiornamenti saranno pubblicati qui con nuova data.',
        },
      ],
    },
  ],
  closing:
    'Per qualsiasi dubbio contattami su X o via email. One step beyond AI — con rispetto della tua privacy.',
};

export const COOKIES: LegalDocument = {
  index: '02',
  eyebrow: 'LEGAL',
  title: ['COOKIE', 'POLICY'],
  updated: '21 Luglio 2026',
  legacyPath: '/pages/cookie-policy.html',
  intro:
    'Questa Cookie Policy integra la Privacy Policy e ti spiega come BJ Beyond utilizza i cookie sul sito bjbeyond.it.',
  sections: [
    {
      id: 'cosa-sono',
      heading: 'Cosa sono i cookie?',
      blocks: [
        {
          kind: 'text',
          value:
            'I cookie sono piccoli file di testo che il sito memorizza sul tuo dispositivo per ricordare preferenze e migliorare l’esperienza.',
        },
      ],
    },
    {
      id: 'tipi',
      heading: 'Tipi di cookie utilizzati',
      blocks: [
        {
          kind: 'table',
          head: ['Tipo', 'Descrizione', 'Durata', 'Gestione'],
          rows: [
            [
              'Tecnici',
              'Necessari per navigazione e funzionalità (es. lingua, simulator)',
              'Sessione / 1 anno',
              'Obbligatori – non disattivabili',
            ],
            ['Preferenze', 'Ricordano scelte (es. tema dark)', '6 mesi', 'Puoi gestirli'],
            [
              'Analitici',
              'Google Analytics 4 (Google Ireland Ltd.): statistiche di visita, pagine viste, provenienza del traffico. Attivati solo dopo il tuo consenso.',
              '13 mesi',
              'Puoi rifiutare',
            ],
            ...(META_PIXEL_ID
              ? [
                  [
                    'Marketing',
                    'Meta Pixel (Meta Platforms Ireland Ltd.): misurazione delle campagne pubblicitarie su Facebook e Instagram e creazione di pubblici personalizzati. Attivato solo dopo il tuo consenso.',
                    '3 mesi',
                    'Puoi rifiutare',
                  ],
                ]
              : []),
            ['Funzionali', 'Per tool come Phoenix Simulator', 'Sessione', 'Necessari'],
          ],
        },
        {
          kind: 'callout',
          value: META_PIXEL_ID
            ? 'Nessun cookie di analisi o di marketing viene installato prima del tuo consenso. Se rifiuti, o se ignori il banner, gli script di Google e Meta non vengono nemmeno caricati.'
            : 'Nessun cookie di analisi viene installato prima del tuo consenso. Se rifiuti, o se ignori il banner, gli script di Google non vengono nemmeno caricati. Questo sito non usa attualmente cookie di profilazione pubblicitaria.',
        },
      ],
    },
    {
      id: 'gestione',
      heading: 'Come gestire i cookie',
      blocks: [
        {
          kind: 'list',
          items: [
            'Alla prima visita un banner ti chiede se accettare i cookie non tecnici. Finché non scegli, nessuno di essi viene installato.',
            'Puoi cambiare la tua scelta in qualsiasi momento dal link “COOKIE PREFERENCES” in fondo a ogni pagina.',
            'Puoi cancellarli o bloccarli dalle impostazioni del tuo browser (Chrome, Firefox, Safari, ecc.).',
            'Per istruzioni dettagliate: aboutcookies.org',
          ],
        },
        {
          kind: 'text',
          value:
            'Disabilitando alcuni cookie il sito potrebbe non funzionare perfettamente (es. simulator).',
        },
      ],
    },
    {
      id: 'aggiornamenti',
      heading: 'Aggiornamenti',
      blocks: [
        {
          kind: 'text',
          value:
            'Questa policy può essere modificata. Controlla periodicamente la data di aggiornamento.',
        },
      ],
    },
  ],
  closing: 'Per domande scrivimi via email o su X.',
};
