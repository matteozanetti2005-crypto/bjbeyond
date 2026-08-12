/**
 * Privacy and Cookie policy content, transcribed verbatim from the documents in
 * `public/docs/`. Nothing here is reworded, softened or extended — these are
 * legal statements, and the rebuild changes their presentation only.
 *
 * They stay in Italian because they describe an Italian data controller's
 * obligations; the rendered page marks the switch with `lang="it"`.
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
          value:
            'Utilizziamo fornitori sicuri (Vercel, Anthropic, Groq) con Clausole Contrattuali Standard o adeguatezza.',
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
              'Statistiche anonime di visita (Vercel Analytics o simili)',
              '12 mesi',
              'Puoi rifiutare',
            ],
            ['Funzionali', 'Per tool come Phoenix Simulator', 'Sessione', 'Necessari'],
          ],
        },
        {
          kind: 'callout',
          value:
            'Non usiamo cookie di profilazione pubblicitaria né condividiamo dati con advertiser.',
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
            'Puoi accettare/rifiutare i cookie non tecnici dal banner all’ingresso (se presente).',
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
