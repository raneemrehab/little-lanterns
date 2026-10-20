// Hand-drawn style SVG illustrations. One shared stroke style (warm brown,
// round caps, ~2.2px) and the brand pastels keep them feeling like one
// family. Colours come from CSS custom properties so they follow the theme.
//
// Every function returns an SVG string. Pass `label` for an illustration
// that carries meaning (it becomes role="img" with a title); otherwise it is
// hidden from assistive technology as decoration.

const C = {
  ink: 'var(--ink)',
  cream: 'var(--cream)',
  white: 'var(--paper)',
  butter: 'var(--butter)',
  sage: 'var(--sage)',
  peach: 'var(--peach)',
  lavender: 'var(--lavender)',
  blush: 'var(--blush)',
  sand: 'var(--sand)',
  olive: 'var(--olive)',
};

let uid = 0;

function svg(viewBox, body, { label, cls = '', style = '' } = {}) {
  const a11y = label
    ? `role="img" aria-labelledby="d${++uid}"`
    : 'aria-hidden="true" focusable="false"';
  const title = label ? `<title id="d${uid}">${label}</title>` : '';
  return `<svg class="doodle ${cls}" viewBox="${viewBox}" ${a11y} ${style ? `style="${style}"` : ''} fill="none" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${title}${body}</svg>`;
}

// ---- Small marks -----------------------------------------------------------

export const star = (o = {}) =>
  svg(
    '0 0 32 32',
    `<path d="M16 3.5l3.4 7.6 8.2.8-6.2 5.5 1.9 8.1L16 21.3l-7.3 4.2 1.9-8.1-6.2-5.5 8.2-.8z" fill="${o.fill || C.butter}"/>`,
    o,
  );

export const sparkle = (o = {}) =>
  svg(
    '0 0 24 24',
    `<path d="M12 2.5c.7 5.2 2.4 7 9.5 9.5-7.1 2.5-8.8 4.3-9.5 9.5-.7-5.2-2.4-7-9.5-9.5 7.1-2.5 8.8-4.3 9.5-9.5z" fill="${o.fill || C.butter}"/>`,
    o,
  );

export const leaf = (o = {}) =>
  svg(
    '0 0 32 32',
    `<path d="M5 27C5 14 13 5 27 5c0 14-9 22-22 22z" fill="${o.fill || C.sage}"/><path d="M6 26C12 19 17 14 22 10"/>`,
    o,
  );

export const flower = (o = {}) =>
  svg(
    '0 0 32 32',
    `<g fill="${o.fill || C.blush}"><circle cx="16" cy="8.5" r="5"/><circle cx="23.5" cy="14" r="5"/><circle cx="20.5" cy="22.5" r="5"/><circle cx="11.5" cy="22.5" r="5"/><circle cx="8.5" cy="14" r="5"/></g><circle cx="16" cy="16" r="4.2" fill="${C.butter}"/>`,
    o,
  );

export const sun = (o = {}) =>
  svg(
    '0 0 48 48',
    `<g stroke-width="2"><path d="M24 3v5M24 40v5M3 24h5M40 24h5M9 9l3.5 3.5M35.5 35.5L39 39M9 39l3.5-3.5M35.5 12.5L39 9"/></g>
     <circle cx="24" cy="24" r="11" fill="${C.butter}"/>
     <path d="M20 22.5v.5M28 22.5v.5" stroke-width="2.6"/><path d="M20 27.5c2.2 2.2 5.8 2.2 8 0"/>`,
    o,
  );

export const cloud = (o = {}) =>
  svg(
    '0 0 64 36',
    `<path d="M14 31h36a10 10 0 0 0 0-20 13 13 0 0 0-24-3A10 10 0 0 0 14 31z" fill="${o.fill || C.white}"/>`,
    o,
  );

export const pencil = (o = {}) =>
  svg(
    '0 0 48 48',
    `<path d="M9 39l3-10L33 8l7 7-21 21z" fill="${C.butter}"/><path d="M29 12l7 7" /><path d="M12 29l7 7" /><path d="M9 39l3-10 7 7z" fill="${C.sand}"/><path d="M9.6 37l1.4 1.4" stroke-width="3"/><path d="M33 8l3-3 7 7-3 3" fill="${C.blush}"/>`,
    o,
  );

export const paperclip = (o = {}) =>
  svg(
    '0 0 24 48',
    `<path d="M16 14v20a5 5 0 0 1-10 0V10a3.5 3.5 0 0 1 7 0v22a1.5 1.5 0 0 1-3 0V14" stroke-width="2"/>`,
    o,
  );

export const book = (o = {}) =>
  svg(
    '0 0 56 40',
    `<path d="M28 9C22 5 12 5 5 7v27c7-2 17-2 23 2 6-4 16-4 23-2V7c-7-2-17-2-23 2z" fill="${C.white}"/><path d="M28 9v27"/><path d="M11 15c4-1 8-1 11 .5M11 21c4-1 8-1 11 .5M34 15.5c3-1.5 7-1.5 11-.5" stroke-width="1.6"/>`,
    o,
  );

export const hardHat = (o = {}) =>
  svg(
    '0 0 40 28',
    `<path d="M6 21a14 14 0 0 1 28 0" fill="${C.butter}"/><path d="M20 7v8" /><path d="M3 21h34v3H3z" fill="${C.butter}"/>`,
    o,
  );

export const toolbox = (o = {}) =>
  svg(
    '0 0 56 44',
    `<path d="M20 13V8h16v5" /><rect x="5" y="13" width="46" height="26" rx="5" fill="${C.peach}"/><path d="M5 23h46"/><rect x="24" y="20" width="8" height="7" rx="2" fill="${C.white}"/>`,
    o,
  );

// A loose hand-drawn underline for headings.
export const squiggle = (o = {}) =>
  svg(
    '0 0 160 14',
    `<path d="M3 9c12-6 22 4 34-1s21-6 32 0 22 5 34-1 22-5 30 0 15 3 24-1" stroke="${o.stroke || C.olive}" stroke-width="2.6"/>`,
    o,
  );

// ---- Brand mark ------------------------------------------------------------

export const lantern = (o = {}) => {
  const face = o.face
    ? `<path d="M16.6 24.5v.4M23.4 24.5v.4" stroke-width="2.6"/><path d="M16.5 29c2 1.8 5 1.8 7 0" stroke-width="1.9"/>`
    : `<path d="M20 15.5v19" stroke-width="1.6" opacity=".55"/>`;
  return svg(
    '0 0 40 48',
    `<path d="M16 7.5a4 4 0 0 1 8 0"/>
     <path d="M13 12.5h14l-2.3-5H15.3z" fill="${C.olive}"/>
     <rect x="8.5" y="12.5" width="23" height="25" rx="9.5" fill="${C.butter}"/>
     <ellipse cx="20" cy="25" rx="6.5" ry="8" fill="${C.white}" stroke="none" opacity=".7"/>
     ${face}
     <path d="M14 37.5h12l-1.8 4h-8.4z" fill="${C.olive}"/>`,
    o,
  );
};

// ---- Studio illustrations (160 x 120) -------------------------------------

const ground = `<path d="M14 108c22-4 40 3 66 0s44-4 66 0" stroke-width="2" opacity=".5"/>`;

export const studioArt = {
  wordGarden: (o = {}) =>
    svg(
      '0 0 160 120',
      `${ground}
       <path d="M80 106c0-18 2-34-1-52"/>
       <path d="M80 86c-14 0-22-8-24-18 12-1 22 5 24 18z" fill="${C.sage}"/>
       <path d="M80 76c12 0 20-7 21-16-10-1-19 4-21 16z" fill="${C.sage}"/>
       <g fill="${C.blush}"><circle cx="79" cy="27" r="9"/><circle cx="92" cy="37" r="9"/><circle cx="87" cy="52" r="9"/><circle cx="71" cy="52" r="9"/><circle cx="66" cy="37" r="9"/></g>
       <circle cx="79" cy="40" r="11" fill="${C.butter}"/>
       <text x="79" y="45.5" text-anchor="middle" font-family="var(--font-display)" font-size="17" font-weight="600" fill="${C.ink}" stroke="none">a</text>
       <path d="M36 106v-14"/><path d="M36 96c-6 0-9-4-10-8 5 0 9 3 10 8z" fill="${C.sage}"/>
       <text x="36" y="86" text-anchor="middle" font-family="var(--font-display)" font-size="18" font-weight="600" fill="${C.olive}" stroke="none">b</text>
       <path d="M124 106v-12"/><path d="M124 98c6 0 9-4 10-8-5 0-9 3-10 8z" fill="${C.sage}"/>
       <text x="124" y="88" text-anchor="middle" font-family="var(--font-display)" font-size="18" font-weight="600" fill="${C.olive}" stroke="none">c</text>`,
      o,
    ),

  numberNook: (o = {}) =>
    svg(
      '0 0 160 120',
      `${ground}
       <path d="M30 106V56a50 42 0 0 1 100 0v50" fill="${C.cream}" stroke-dasharray="1 6" stroke-width="2.6"/>
       <rect x="44" y="72" width="34" height="34" rx="7" fill="${C.butter}"/>
       <rect x="82" y="72" width="34" height="34" rx="7" fill="${C.peach}"/>
       <rect x="63" y="36" width="34" height="34" rx="7" fill="${C.sage}"/>
       <g font-family="var(--font-display)" font-size="20" font-weight="600" fill="${C.ink}" stroke="none" text-anchor="middle">
         <text x="61" y="96">1</text><text x="99" y="96">2</text><text x="80" y="60">3</text>
       </g>
       <path d="M124 22l2.2 4.8 5.2.6-3.9 3.5 1.1 5.1-4.6-2.6-4.6 2.6 1.1-5.1-3.9-3.5 5.2-.6z" fill="${C.butter}" stroke-width="1.8"/>`,
      o,
    ),

  everyWay: (o = {}) =>
    svg(
      '0 0 160 120',
      `${ground}
       <circle cx="80" cy="30" r="15" fill="${C.butter}"/>
       <path d="M74.5 28v.4M85.5 28v.4" stroke-width="2.6"/><path d="M74 33.5c3.2 3 8.8 3 12 0"/>
       <path d="M30 106c4-24 26-36 44-58" stroke-dasharray="1 7" stroke-width="3"/>
       <path d="M80 106c-6-10 6-16 0-26s6-16 0-26" stroke="${C.olive}"/>
       <path d="M130 106h-10v-10h-8v-10h-8v-10h-8v-12h-6" stroke-width="2"/>
       <circle cx="30" cy="106" r="5" fill="${C.lavender}"/>
       <circle cx="80" cy="106" r="5" fill="${C.sage}"/>
       <circle cx="130" cy="106" r="5" fill="${C.peach}"/>`,
      o,
    ),

  brainSparks: (o = {}) =>
    svg(
      '0 0 160 120',
      `${ground}
       <path d="M80 22a26 26 0 0 0-15 47c3 2.5 4 5 4 9v6h22v-6c0-4 1-6.5 4-9a26 26 0 0 0-15-47z" fill="${C.butter}"/>
       <path d="M70 92h20M72 99h16" />
       <path d="M74 64l6-12 6 12" stroke-width="2"/>
       <path d="M40 30l-7-5M38 52h-9M120 30l7-5M122 52h9" stroke-width="2"/>
       <g stroke-dasharray="1 5" stroke-width="2"><path d="M22 86l16-12 14 16"/><path d="M108 90l18-14 14 10"/></g>
       <g fill="${C.peach}"><circle cx="22" cy="86" r="4"/><circle cx="38" cy="74" r="4"/><circle cx="52" cy="90" r="4"/><circle cx="108" cy="90" r="4"/><circle cx="126" cy="76" r="4"/><circle cx="140" cy="86" r="4"/></g>`,
      o,
    ),

  lifeLab: (o = {}) =>
    svg(
      '0 0 160 120',
      `${ground}
       <circle cx="42" cy="62" r="24" fill="${C.white}"/>
       <path d="M42 46v16l10 6"/><circle cx="42" cy="62" r="2" fill="${C.ink}"/>
       <path d="M42 41v2M42 81v2M21 62h2M61 62h2" stroke-width="1.8"/>
       <path d="M80 70h34v20a14 14 0 0 1-14 14h-6a14 14 0 0 1-14-14z" fill="${C.blush}"/>
       <path d="M114 76h4a7 7 0 0 1 0 14h-5"/>
       <path d="M90 60c-3-4 3-6 0-11M102 60c-3-4 3-6 0-11" stroke-width="1.8" opacity=".7"/>
       <path d="M128 104l14-52" stroke-width="5" stroke="${C.ink}"/><path d="M128 104l14-52" stroke-width="2.6" stroke="${C.sage}"/>
       <rect x="137" y="38" width="12" height="16" rx="3" fill="${C.white}" transform="rotate(15 143 46)"/>`,
      o,
    ),

  makeWonder: (o = {}) =>
    svg(
      '0 0 160 120',
      `${ground}
       <path d="M78 24c-30 0-52 18-50 40 1 15 14 26 30 24 8-1 9-8 15-9 7-1 10 6 18 6 16 0 31-13 30-30-1-19-19-31-43-31z" fill="${C.white}"/>
       <ellipse cx="68" cy="68" rx="7" ry="6" fill="${C.cream}"/>
       <circle cx="56" cy="46" r="7" fill="${C.peach}"/><circle cx="78" cy="38" r="7" fill="${C.butter}"/><circle cx="100" cy="44" r="7" fill="${C.sage}"/><circle cx="108" cy="64" r="7" fill="${C.lavender}"/>
       <path d="M124 104l22-58" stroke-width="2.4"/><path d="M146 46c4-6 9-6 9-1s-5 8-11 7z" fill="${C.blush}"/>
       <path d="M18 30c6-6 12 2 18-4" stroke="${C.olive}"/>
       <path d="M140 22l1.6 3.6 3.8.4-2.9 2.6.8 3.8-3.3-2-3.3 2 .8-3.8-2.9-2.6 3.8-.4z" fill="${C.butter}" stroke-width="1.6"/>`,
      o,
    ),
};

// ---- Toy concept illustrations (160 x 120) --------------------------------

export const toyArt = {
  toyLetters: (o = {}) =>
    svg(
      '0 0 160 120',
      `<rect x="40" y="18" width="80" height="84" rx="14" fill="${C.sand}"/>
       <rect x="48" y="26" width="64" height="68" rx="10" fill="${C.cream}" stroke-width="1.6"/>
       <path d="M64 84l16-46 16 46M70 68h20" stroke-width="7" stroke="${C.sage}"/>
       <path d="M64 84l16-46 16 46M70 68h20" stroke-width="2"/>
       <g fill="${C.ink}" stroke="none"><circle cx="128" cy="40" r="2"/><circle cx="134" cy="50" r="2"/><circle cx="136" cy="62" r="2"/></g>
       <path d="M24 74c4-6 10-6 12 0" stroke-width="1.8" opacity=".6"/>`,
      o,
    ),
  toyNumbers: (o = {}) =>
    svg(
      '0 0 160 120',
      `<rect x="36" y="16" width="88" height="88" rx="16" fill="${C.butter}"/>
       <path d="M62 46c2-12 14-16 22-12 10 5 10 16 2 25L62 86h36" stroke-width="9" stroke="${C.white}"/>
       <path d="M62 46c2-12 14-16 22-12 10 5 10 16 2 25L62 86h36" stroke-width="2"/>
       <path d="M58 34l-6 4 6 5" stroke-width="2" stroke="${C.olive}"/>
       <circle cx="62" cy="46" r="3.5" fill="${C.peach}"/>`,
      o,
    ),
  toyMagnet: (o = {}) =>
    svg(
      '0 0 160 120',
      `<path d="M30 96l26-46 26 46z" fill="${C.peach}"/>
       <rect x="82" y="56" width="40" height="40" rx="6" fill="${C.sage}"/>
       <circle cx="66" cy="34" r="16" fill="${C.lavender}"/>
       <path d="M110 18v14a10 10 0 0 0 20 0V18" stroke-width="7" stroke="${C.blush}"/>
       <path d="M110 18v14a10 10 0 0 0 20 0V18" stroke-width="2"/>
       <path d="M106 18h8M126 18h8" stroke-width="2.6"/>
       <path d="M100 46l-6 4M104 50l-4 6" stroke-width="1.6" opacity=".7"/>
       <path d="M22 104h116" stroke-width="2" opacity=".5"/>`,
      o,
    ),
};

// ---- Scenes ---------------------------------------------------------------

export const heroScene = (o = {}) =>
  svg(
    '0 0 480 440',
    `<path d="M250 52c96-10 190 56 190 160 0 110-82 196-196 196S48 330 52 222C56 120 150 62 250 52z" fill="${C.butter}" stroke="none" opacity=".55"/>
     <path d="M118 66c40-30 120-40 168-8" stroke-width="2.6"/>
     <path d="M150 50c-8-12-24-12-28 0 10 4 20 4 28 0z" fill="${C.sage}"/>
     <path d="M232 46c8-12 24-12 28 0-10 4-20 4-28 0z" fill="${C.sage}"/>
     <path d="M206 50v38" stroke-width="2"/>
     <g transform="translate(150 84) scale(2.8)">
       <path d="M16 7.5a4 4 0 0 1 8 0" stroke-width="1"/>
       <path d="M13 12.5h14l-2.3-5H15.3z" fill="${C.olive}" stroke-width="1"/>
       <rect x="8.5" y="12.5" width="23" height="25" rx="9.5" fill="${C.butter}" stroke-width="1"/>
       <ellipse cx="20" cy="25" rx="6.5" ry="8" fill="${C.white}" stroke="none" opacity=".75"/>
       <path d="M16.6 23.8v.4M23.4 23.8v.4" stroke-width="1.3"/>
       <path d="M16.5 28.4c2 1.8 5 1.8 7 0" stroke-width=".9"/>
       <circle cx="14" cy="27.5" r="1.3" fill="${C.blush}" stroke="none"/><circle cx="26" cy="27.5" r="1.3" fill="${C.blush}" stroke="none"/>
       <path d="M14 37.5h12l-1.8 4h-8.4z" fill="${C.olive}" stroke-width="1"/>
     </g>
     <g class="twinkle" stroke-width="2">
       <path d="M300 128c.6 4.6 2 6.2 8 8.4-6 2.2-7.4 3.8-8 8.4-.6-4.6-2-6.2-8-8.4 6-2.2 7.4-3.8 8-8.4z" fill="${C.white}"/>
       <path d="M110 180c.5 3.6 1.6 4.8 6.2 6.5-4.6 1.7-5.7 2.9-6.2 6.5-.5-3.6-1.6-4.8-6.2-6.5 4.6-1.7 5.7-2.9 6.2-6.5z" fill="${C.white}"/>
     </g>
     <g transform="translate(360 70)"><g stroke-width="2"><path d="M24 3v5M24 40v5M3 24h5M40 24h5M9 9l3.5 3.5M35.5 35.5L39 39M9 39l3.5-3.5M35.5 12.5L39 9"/></g><circle cx="24" cy="24" r="11" fill="${C.white}"/><path d="M20 22.5v.5M28 22.5v.5" stroke-width="2.6"/><path d="M20 27.5c2.2 2.2 5.8 2.2 8 0"/></g>
     <path d="M60 128h36a10 10 0 0 0 0-20 13 13 0 0 0-24-3A10 10 0 0 0 60 128z" fill="${C.white}"/>
     <path d="M70 396c40-10 50-50 100-56s70 30 120 20 60-60 110-70" stroke-dasharray="1 12" stroke-width="4"/>
     <g fill="${C.white}"><ellipse cx="70" cy="398" rx="16" ry="7"/><ellipse cx="290" cy="360" rx="16" ry="7"/></g>
     <g transform="translate(372 254)">
       <rect x="0" y="34" width="78" height="16" rx="4" fill="${C.sage}"/>
       <rect x="8" y="18" width="66" height="16" rx="4" fill="${C.peach}"/>
       <rect x="2" y="2" width="70" height="16" rx="4" fill="${C.lavender}"/>
       <path d="M60 2v16M66 18v16M68 34v16" stroke-width="1.6"/>
     </g>
     <g transform="translate(372 216)"><path d="M26 0c4 0 6 4 4 8l-4 8-4-8c-2-4 0-8 4-8z" fill="${C.blush}" stroke-width="1.8"/><path d="M26 16v22" stroke-width="1.8"/></g>
     <g transform="translate(150 300)"><path d="M5 27C5 14 13 5 27 5c0 14-9 22-22 22z" fill="${C.sage}"/><path d="M6 26C12 19 17 14 22 10"/></g>
     <g transform="translate(110 318) rotate(-40)"><path d="M5 27C5 14 13 5 27 5c0 14-9 22-22 22z" fill="${C.sage}"/><path d="M6 26C12 19 17 14 22 10"/></g>
     <g transform="translate(316 300)"><g fill="${C.blush}"><circle cx="16" cy="8.5" r="5"/><circle cx="23.5" cy="14" r="5"/><circle cx="20.5" cy="22.5" r="5"/><circle cx="11.5" cy="22.5" r="5"/><circle cx="8.5" cy="14" r="5"/></g><circle cx="16" cy="16" r="4.2" fill="${C.butter}"/></g>`,
    { label: o.label, cls: `hero-scene ${o.cls || ''}` },
  );

// The little lantern in a hard hat, used on every coming-soon page.
export const buildingScene = (o = {}) =>
  svg(
    '0 0 240 170',
    `<path d="M20 152h200" stroke-dasharray="1 9" stroke-width="3"/>
     <g transform="translate(26 92)">
       <rect x="0" y="34" width="28" height="26" rx="4" fill="${C.sage}"/>
       <rect x="30" y="34" width="28" height="26" rx="4" fill="${C.lavender}"/>
       <rect x="14" y="6" width="28" height="28" rx="4" fill="${C.peach}" transform="rotate(-6 28 20)"/>
       <text x="28" y="27" text-anchor="middle" font-family="var(--font-display)" font-size="15" font-weight="600" fill="${C.ink}" stroke="none" transform="rotate(-6 28 20)">A</text>
       <text x="14" y="53" text-anchor="middle" font-family="var(--font-display)" font-size="14" font-weight="600" fill="${C.ink}" stroke="none">1</text>
       <text x="44" y="53" text-anchor="middle" font-family="var(--font-display)" font-size="14" font-weight="600" fill="${C.ink}" stroke="none">★</text>
     </g>
     <g transform="translate(96 42) scale(2.4)">
       <path d="M13 12.5h14l-2.3-5H15.3z" fill="${C.olive}" stroke-width="1"/>
       <rect x="8.5" y="12.5" width="23" height="25" rx="9.5" fill="${C.butter}" stroke-width="1"/>
       <ellipse cx="20" cy="25" rx="6.5" ry="8" fill="${C.white}" stroke="none" opacity=".75"/>
       <path d="M16.6 24v.4M23.4 24v.4" stroke-width="1.3"/>
       <path d="M17 28.6c1.8 1.5 4.2 1.5 6 0" stroke-width=".9"/>
       <path d="M14 37.5h12l-1.8 4h-8.4z" fill="${C.olive}" stroke-width="1"/>
       <g transform="translate(6.5 -2.5) scale(.68)"><path d="M6 21a14 14 0 0 1 28 0" fill="${C.butter}" stroke-width="1.4"/><path d="M20 7v8" stroke-width="1.4"/><path d="M2 21h36v3H2z" fill="${C.peach}" stroke-width="1.4"/></g>
       <path d="M31 27l6-6" stroke-width="1"/>
     </g>
     <g transform="translate(176 112) rotate(-30)"><path d="M0 8h34l6 4-6 4H0z" fill="${C.butter}"/><path d="M28 8v8"/><path d="M0 8h-4v8h4" fill="${C.blush}"/></g>
     <g transform="translate(166 120)"><path d="M14 10V6h14v4"/><rect x="2" y="10" width="38" height="22" rx="4" fill="${C.peach}"/><path d="M2 18h38"/><rect x="17" y="15" width="8" height="6" rx="2" fill="${C.white}"/></g>
     <path d="M200 36c.5 3.6 1.6 4.8 6.2 6.5-4.6 1.7-5.7 2.9-6.2 6.5-.5-3.6-1.6-4.8-6.2-6.5 4.6-1.7 5.7-2.9 6.2-6.5z" fill="${C.butter}" stroke-width="1.8"/>
     <path d="M40 40c.4 2.8 1.2 3.7 4.8 5-3.6 1.3-4.4 2.2-4.8 5-.4-2.8-1.2-3.7-4.8-5 3.6-1.3 4.4-2.2 4.8-5z" fill="${C.white}" stroke-width="1.6"/>`,
    { label: o.label, cls: o.cls },
  );

export const lostScene = (o = {}) =>
  svg(
    '0 0 360 260',
    `<path d="M20 228c50-30 90 10 150-14s100-50 170-34" stroke-dasharray="1 11" stroke-width="3.4"/>
     <g transform="translate(260 96)">
       <path d="M18 0v132" stroke-width="3"/>
       <path d="M0 14h56l12 12-12 12H0z" fill="${C.sage}"/>
       <text x="28" y="31" text-anchor="middle" font-family="var(--font-body)" font-size="13" font-weight="800" fill="${C.ink}" stroke="none">HOME</text>
     </g>
     <g transform="translate(112 92) scale(2.6) rotate(-8 20 24)">
       <path d="M16 7.5a4 4 0 0 1 8 0" stroke-width="1"/>
       <path d="M13 12.5h14l-2.3-5H15.3z" fill="${C.olive}" stroke-width="1"/>
       <rect x="8.5" y="12.5" width="23" height="25" rx="9.5" fill="${C.butter}" stroke-width="1"/>
       <ellipse cx="20" cy="25" rx="6.5" ry="8" fill="${C.white}" stroke="none" opacity=".75"/>
       <circle cx="17" cy="24" r="1" fill="${C.ink}" stroke="none"/><circle cx="23.4" cy="24" r="1" fill="${C.ink}" stroke="none"/>
       <ellipse cx="20" cy="29.4" rx="1.6" ry="1.3" stroke-width=".9"/>
       <path d="M14 37.5h12l-1.8 4h-8.4z" fill="${C.olive}" stroke-width="1"/>
       <path d="M17 41.5l-2 5M23 41.5l2 5" stroke-width="1"/>
     </g>
     <g font-family="var(--font-display)" font-weight="600" stroke="none">
       <text x="40" y="70" font-size="34" fill="${C.olive}" transform="rotate(-14 40 70)">a</text>
       <text x="214" y="56" font-size="30" fill="${C.olive}" transform="rotate(12 214 56)">3</text>
       <text x="70" y="176" font-size="26" fill="${C.olive}" transform="rotate(20 70 176)">?</text>
     </g>
     <path d="M190 120l2.6 5.8 6.2.6-4.7 4.2 1.4 6.1-5.5-3.2-5.5 3.2 1.4-6.1-4.7-4.2 6.2-.6z" fill="${C.butter}" stroke-width="1.8"/>
     <path d="M310 40c.6 4.6 2 6.2 8 8.4-6 2.2-7.4 3.8-8 8.4-.6-4.6-2-6.2-8-8.4 6-2.2 7.4-3.8 8-8.4z" fill="${C.white}" stroke-width="1.8"/>
     <path d="M30 120h28a8 8 0 0 0 0-16 10 10 0 0 0-19-2.4A8 8 0 0 0 30 120z" fill="${C.white}" stroke-width="1.8"/>`,
    { label: o.label, cls: o.cls },
  );
