/** Inline icon set — 24px grid, 1.6 stroke, currentColor. */

const s = (paths, extra = '') =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"${extra}>${paths}</svg>`

export const icons = {
  strategy: s('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4"/><path d="M12 3.5V1.5M12 22.5v-2M20.5 12h2M1.5 12h2"/>'),
  growth: s('<path d="M3 19h18"/><path d="M6 19v-5.5M11 19V9M16 19v-8M21 19V5"/>'),
  website: s('<rect x="2.5" y="4" width="19" height="15.5" rx="2.5"/><path d="M2.5 8.5h19M6 6.3h.01M8.6 6.3h.01M11.2 6.3h.01"/>'),
  ads: s('<path d="M3.5 9.5v5a1.5 1.5 0 0 0 1.5 1.5h2l6 4V4l-6 4H5a1.5 1.5 0 0 0-1.5 1.5Z"/><path d="M17.5 9a4.5 4.5 0 0 1 0 6"/><path d="M20 6.5a8 8 0 0 1 0 11"/>'),
  sales: s('<path d="M4 5h2.2l2 10.5h9.2l2-7.5H7"/><circle cx="9.5" cy="19" r="1.4"/><circle cx="17.5" cy="19" r="1.4"/>'),
  consulting: s('<path d="M12 3.5a6 6 0 0 1 3.6 10.8c-.7.5-1.1 1.3-1.1 2.2v.5h-5v-.5c0-.9-.4-1.7-1.1-2.2A6 6 0 0 1 12 3.5Z"/><path d="M10 20h4"/>'),
  target: s('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1"/>'),
  chart: s('<path d="M3.5 3.5v17h17"/><path d="M7.5 15.5l3.5-4 3 2.5 5-6.5"/>'),
  users: s('<circle cx="9.5" cy="8.5" r="3.5"/><path d="M3 19.5c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5"/><path d="M16.5 5.4a3.5 3.5 0 0 1 0 6.2M18 13.6c2 .7 3.5 2.3 3.5 4.4"/>'),
  spark: s('<path d="M12 3l1.9 5.2L19 10l-5.1 1.8L12 17l-1.9-5.2L5 10l5.1-1.8L12 3Z"/><path d="M18.5 15.5l.7 1.9 1.8.6-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.6.7-1.9Z"/>'),
  shield: s('<path d="M12 3l7 2.8v5.4c0 4.3-2.9 7.9-7 9.3-4.1-1.4-7-5-7-9.3V5.8L12 3Z"/><path d="M9 12l2.2 2.2L15.5 10"/>'),
  handshake: s('<path d="M8.5 12.5 11 15l1.6-1.6 2.2 2.2M3 9l3.5-3 3 1.5L13 6l4 1.5L21 9"/><path d="M6.5 6 3 9.5l3.5 6L9 13M17.5 6 21 9.5l-3.5 6L15 13"/>'),
  arrow: s('<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>'),
  arrowSmall: s('<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>'),
  phone: s('<path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"/>'),
  mail: s('<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>'),
  pin: s('<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
  clock: s('<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 1.8"/>'),
  arrowDown: s('<path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>'),
}

/** Brand-coloured social glyphs (solid, 24px). */
export const social = {
  whatsapp:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.86 9.86 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.3-1.95 1.35-.5.05-.99.23-3.36-.7-2.83-1.12-4.62-3.99-4.76-4.18-.14-.19-1.14-1.51-1.14-2.89s.72-2.05.98-2.33c.26-.28.56-.35.75-.35h.54c.17 0 .41-.07.64.49.24.56.8 1.94.87 2.08.07.14.12.31.02.5-.09.19-.14.31-.28.47-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.72 1.19 1.55 1.93 1.07.95 1.97 1.25 2.25 1.39.28.14.44.12.6-.07.16-.19.7-.81.88-1.09.19-.28.37-.23.63-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.11.07.65-.17 1.32Z"/></svg>',
  instagram:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none"/></svg>',
  linkedin:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3zM9.5 9h3.8v1.7h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.03-3.06-1.9-3.06-1.9 0-2.2 1.45-2.2 2.96V21h-4Z"/></svg>',
  facebook:
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5h1.65V3.63A22 22 0 0 0 14.3 3.5c-2.4 0-4.05 1.47-4.05 4.16V9.9H7.5V13h2.75v8Z"/></svg>',
}
