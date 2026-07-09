
/* ============================================================
   CONFIGURATION
   ============================================================ */
const TEACHER_EMAIL = "stevengauchier@gmail.com";
const EMAILJS_SERVICE_ID = "service_jjqlfck";
const EMAILJS_TEMPLATE_ID = "template_a9uazrs";
const EMAILJS_PUBLIC_KEY = "8ZF_oJb8pHOzojn1p";
const EXAM_DURATION_SECONDS = 120 * 60; // 120 minutes
const DEADLINE = new Date("2099-12-31T23:59:59");

/* ============================================================
   HACHAGE SHA-256 (les bonnes réponses ne sont jamais en clair)
   ============================================================ */
async function sha256(text) {
  const normalized = text.trim().toLowerCase();
  const enc = new TextEncoder().encode(normalized);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/* ============================================================
   SECTION A — QCM (11 x 3 pts = 33 pts)
   ============================================================ */
const QCM = [
  { q: "Que peut-on placer dans ou sur un colis pour en assurer le suivi ?", opts: ["Déclencheur", "Capteur", "Carte d'interface de réseau", "Étiquette RFID"], hash: "" },
  { q: "Lorsque vous utilisez votre carte bancaire pour effectuer des achats à plusieurs endroits, la société émettrice de la carte peut utiliser ces informations pour connaître votre emplacement et vos préférences. Ce type de données personnelles est connu sous le nom de :", opts: ["Données fournies", "Données observées", "Données déduites", "Données secrètes"], hash: "" },
  { q: "Reportez-vous à l'illustration (schéma de réseau A — nuage — B). Quel terme identifie correctement le type de périphérique inclus dans la zone B ?", opts: ["Intermédiaire", "Source", "Fin", "Transférer"], img: "schema-reseau", hash: "" },
  { q: "Quelle adresse ne peut jamais être attribuée à un hôte ?", opts: ["192.168.1.1", "192.168.1.0", "192.168.1.10", "192.168.1.5"], hash: "" },
  { q: "Combien de bits y a-t-il dans un octet ?", opts: ["4", "8", "16", "32"], hash: "" },
  { q: "Quel câble réseau utilise des fils de cuivre torsadés par paires ?", opts: ["Câble coaxial", "Câble à paires torsadées (RJ-45)", "Fibre optique", "Câble HDMI"], hash: "" },
  { q: "Quel port standard utilise le protocole HTTP ?", opts: ["21", "25", "80", "443"], hash: "" },
  { q: "Quelle topologie réseau relie tous les postes à un point central unique ?", opts: ["Bus", "Étoile", "Anneau", "Maillée"], hash: "" },
  { q: "Quelle technologie est utilisée pour l'identification sans contact par radiofréquence, courante en domotique ?", opts: ["Bluetooth", "RFID", "NFC", "Zigbee"], hash: "" },
  { q: "Dans le modèle TCP/IP (4 couches), quelle couche correspond aux couches 5, 6 et 7 du modèle OSI combinées ?", opts: ["Couche Accès réseau", "Couche Internet", "Couche Transport", "Couche Application"], hash: "" },
  /* Nouvo kesyon A.11 sou IPv6 ajoute -- examen_reseau_v2 */
  { q: "Reportez-vous à l'illustration. Combien de bits sont représentés par chaque groupe de quatre valeurs hexadécimales contenues entre les deux points dans une adresse IPv6 ?", opts: ["8", "4", "64", "32", "16"], img: "ipv6", hash: "" },
];
const QCM_ANSWERS = [
  "Étiquette RFID", "Données déduites", "Intermédiaire", "192.168.1.0", "8",
  "Câble à paires torsadées (RJ-45)", "80", "Étoile", "RFID", "Couche Application",
  /* Repons kesyon A.11 IPv6 -- examen_reseau_v2 */
  "16"
];

/* ============================================================
   SECTION B — Vrai/Faux (10 x 2 pts = 20 pts) — B1 à B8 réécrites
   plus difficiles, B9 et B10 conservées
   ============================================================ */
const VF = [
  { q: "Si deux trames sont transmises simultanément sur un même segment de réseau partagé, une collision se produit nécessairement, quel que soit le protocole d'accès utilisé.", ans: "Faux" },
  { q: "Un paquet IP peut atteindre sa destination même si un seul routeur intermédiaire tombe en panne, à condition qu'un chemin alternatif existe.", ans: "Vrai" },
  { q: "Le port source d'une connexion TCP est presque toujours un port standard et fixe, identique à chaque nouvelle connexion.", ans: "Faux" },
  { q: "Une adresse IP privée comme 192.168.1.10 peut être directement routée sur Internet sans aucune traduction.", ans: "Faux" },
  { q: "Dans le modèle OSI, une couche ne peut lire que l'en-tête qu'elle a elle-même ajouté côté émetteur, jamais celui d'une autre couche.", ans: "Vrai" },
  { q: "Un switch (commutateur) doit consulter une table d'adresses IP pour décider sur quel port envoyer une trame.", ans: "Faux" },
  { q: "Le protocole UDP est préférable à TCP lorsque la rapidité de transmission importe davantage que la garantie de livraison de chaque paquet.", ans: "Vrai" },
  { q: "Deux machines sur le même réseau local peuvent communiquer directement par leur adresse MAC sans jamais avoir besoin de connaître leur adresse IP respective.", ans: "Faux" },
  { q: "Un capteur (sensor) en domotique collecte des données de l'environnement.", ans: "Vrai" },
  { q: "DNS traduit un nom de domaine en adresse IP.", ans: "Vrai" },
];

/* ============================================================
   SECTION C — Liste déroulante (6 x 1 pt = 6 pts)
   1 seule question OSI conservée, 5 nouvelles questions techniques
   ============================================================ */
const DD = [
  {
    q: "Quel processus consiste à placer un format de message à l'intérieur d'un autre format de message ?",
    options: ["Codage", "Contrôle de flux", "Segmentation", "Encapsulation"],
    ans: "Encapsulation"
  },
  {
    q: "Quelle bande RF sans fil les appareils IEEE 802.11b/g utilisent-ils ?",
    options: ["60 GHz", "2,4 GHz", "5 GHz", "3900 MHz"],
    ans: "2,4 GHz"
  },
  {
    q: "Quel type de modèle de réseau décrit les fonctions qui doivent intervenir sur une couche particulière sans indiquer comment chaque protocole doit fonctionner ?",
    options: ["Modèle de protocole", "Modèle TCP/IP", "Modèle de référence", "Modèle de conception hiérarchique"],
    ans: "Modèle de référence"
  },
  {
    q: "Quelle commande un technicien doit-il utiliser pour afficher les connexions réseau sur un ordinateur hôte ?",
    options: ["tracert", "netstat", "nslookup", "ipconfig"],
    ans: "netstat"
  },
  {
    q: "Quelle technologie de codage des données est utilisée dans les câbles en cuivre ?",
    options: ["Modulation de fréquences spécifiques d'ondes électromagnétiques", "Impulsions électriques", "Impulsions lumineuses", "Modulation des rayons lumineux"],
    ans: "Impulsions électriques"
  },
  {
    q: "Protocole HTTP — à quelle couche du modèle OSI appartient-il ?",
    options: ["Physique", "Liaison de données", "Réseau", "Transport", "Application"],
    ans: "Application"
  },
];

/* ============================================================
   SECTION D — Glisser-déposer (4 x 1 pt = 4 pts)
   6 réponses proposées (2 leurres plausibles) pour forcer la réflexion
   ============================================================ */
const DND = [
  { target: "Hub", ans: "Diffuse les données reçues vers tous les autres ports, sans aucune distinction de destinataire" },
  { target: "Switch", ans: "Dirige les données uniquement vers le port correspondant à l'adresse MAC de destination" },
  { target: "Routeur", ans: "Achemine les paquets entre des réseaux différents en se basant sur l'adresse IP de destination" },
  { target: "Modem", ans: "Convertit le signal numérique de l'ordinateur en signal analogique transmissible sur la ligne, et inversement" },
];
const DND_DECOYS = [
  "Amplifie le signal reçu pour prolonger la portée du câble sans analyser son contenu",
  "Filtre le trafic entrant et sortant selon des règles de sécurité prédéfinies"
];

/* ============================================================
   SECTION E — Choix multiples, plusieurs bonnes réponses
   (2 x 2 pts = 4 pts) — E3, E4, E5 retirées
   ============================================================ */
const MULTI = [
  {
    q: "Quels sont les rôles principaux d'une carte réseau (NIC) ?",
    opts: ["Convertir les données en signaux électriques ou radio", "Fournir une adresse MAC unique", "Gérer la communication entre l'ordinateur et le réseau", "Servir de pare-feu matériel", "Assurer la transmission et la réception des paquets"],
    ans: ["Convertir les données en signaux électriques ou radio", "Fournir une adresse MAC unique", "Gérer la communication entre l'ordinateur et le réseau", "Assurer la transmission et la réception des paquets"]
  },
  {
    q: "Quels sont les avantages d'une topologie en maillage (mesh) ?",
    opts: ["Haute tolérance aux pannes", "Redondance des chemins de communication", "Coût réduit en câblage", "Performance stable même en cas de panne d'un lien", "Complexité de gestion faible"],
    ans: ["Haute tolérance aux pannes", "Redondance des chemins de communication", "Performance stable même en cas de panne d'un lien"]
  },
];

/* ============================================================
   SECTION F — Questions subjectives (33 pts, 6 questions)
   ============================================================ */
const SUBJ = [
  { q: "Définissez ce qu'est un réseau informatique et expliquez la différence entre un réseau LAN et un réseau WAN.", pts: 5 },
  { q: "Expliquez le rôle du modèle OSI. Pourquoi un modèle en couches est-il utile pour comprendre les réseaux ?", pts: 5 },
  { q: "Décrivez les trois principaux modes de transmission de données (simplex, half-duplex, full-duplex) en donnant un exemple concret pour chacun.", pts: 5 },
  { q: "Expliquez la différence entre TCP et UDP. Dans quel cas utiliserait-on plutôt UDP malgré son manque de fiabilité ?", pts: 6 },
  { q: "Qu'est-ce qu'une adresse MAC, et en quoi diffère-t-elle fondamentalement d'une adresse IP en termes de portée (locale vs routable) ?", pts: 6 },
  { q: "Un poste à poste classique (P2P) montre une limite par rapport à une architecture client/serveur lorsqu'un réseau grandit en nombre de machines. Expliquez pourquoi, avec un exemple concret.", pts: 6 },
];

let timerInterval = null;
let examSubmitted = false;
let studentName = "";

/* ============================================================
   VÉRIFICATION DE LA DATE LIMITE
   ============================================================ */
function checkDeadline() {
  if (new Date() > DEADLINE) {
    document.getElementById('screen-expired').classList.add('show');
    document.getElementById('screen-intro').style.display = 'none';
    return true;
  }
  return false;
}

/* ============================================================
   INITIALISATION DES HASHES
   ============================================================ */
async function initHashes() {
  for (let i = 0; i < QCM.length; i++) QCM[i].hash = await sha256(QCM_ANSWERS[i]);
  for (let i = 0; i < VF.length; i++) VF[i].hash = await sha256(VF[i].ans);
  for (let i = 0; i < DD.length; i++) DD[i].hash = await sha256(DD[i].ans);
  for (let i = 0; i < DND.length; i++) DND[i].hash = await sha256(DND[i].ans);
}

/* ============================================================
   IMAGE DU SCHÉMA RÉSEAU (intégrée en SVG, reconstitution du schéma fourni)
   ============================================================ */
/* SVG adrès IPv6 pou kesyon A.11 -- examen_reseau_v2 */
const IPV6_DIAGRAM_SVG = `
<svg viewBox="0 0 520 70" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:520px;background:#fff;border-radius:8px;padding:12px 0">
  <text x="10" y="28" font-family="Courier New,monospace" font-size="18" font-weight="bold" fill="#333">
    <tspan fill="#2E6B82">2001</tspan><tspan fill="#888">:</tspan>
    <tspan fill="#2E6B82">0db8</tspan><tspan fill="#888">:</tspan>
    <tspan fill="#2E6B82">85a3</tspan><tspan fill="#888">:</tspan>
    <tspan fill="#2E6B82">0000</tspan><tspan fill="#888">:</tspan>
    <tspan fill="#2E6B82">0000</tspan><tspan fill="#888">:</tspan>
    <tspan fill="#2E6B82">8a2e</tspan><tspan fill="#888">:</tspan>
    <tspan fill="#2E6B82">0370</tspan><tspan fill="#888">:</tspan>
    <tspan fill="#2E6B82">7334</tspan>
  </text>
</svg>`;

const NETWORK_DIAGRAM_SVG = `
<svg viewBox="0 0 360 200" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:420px;background:#fff;border-radius:8px">
  <ellipse cx="60" cy="100" rx="50" ry="75" fill="#F4D9A0"/>
  <ellipse cx="180" cy="100" rx="65" ry="85" fill="#BFE3C4"/>
  <ellipse cx="300" cy="100" rx="50" ry="75" fill="#AFD8E8"/>
  <text x="60" y="32" text-anchor="middle" font-family="Arial" font-size="13" font-weight="bold" fill="#333">A</text>
  <text x="300" y="32" text-anchor="middle" font-family="Arial" font-size="13" font-weight="bold" fill="#333">C</text>
  <text x="60" y="180" text-anchor="middle" font-family="Arial" font-size="11" fill="#333">Source du paquet</text>
  <text x="300" y="180" text-anchor="middle" font-family="Arial" font-size="11" fill="#333">Destination du paquet</text>
  <g fill="#2E6B82">
    <rect x="40" y="55" width="20" height="14" rx="2"/>
    <rect x="40" y="95" width="20" height="14" rx="2"/>
    <rect x="40" y="135" width="20" height="14" rx="2"/>
  </g>
  <g fill="#2E6B82">
    <rect x="280" y="55" width="20" height="14" rx="2"/>
    <rect x="280" y="95" width="20" height="14" rx="2"/>
    <rect x="280" y="135" width="20" height="14" rx="2"/>
  </g>
  <g stroke="#B23B2E" stroke-width="1.5" fill="none">
    <line x1="60" y1="62" x2="150" y2="80"/>
    <line x1="60" y1="102" x2="150" y2="100"/>
    <line x1="60" y1="142" x2="150" y2="120"/>
    <line x1="150" y1="80" x2="210" y2="80"/>
    <line x1="150" y1="120" x2="210" y2="120"/>
    <line x1="150" y1="80" x2="150" y2="120"/>
    <line x1="210" y1="80" x2="210" y2="120"/>
    <line x1="210" y1="80" x2="300" y2="62"/>
    <line x1="210" y1="100" x2="300" y2="102"/>
    <line x1="210" y1="120" x2="300" y2="142"/>
  </g>
  <g fill="#3C8FA8" stroke="#1F5A6E" stroke-width="1">
    <circle cx="150" cy="80" r="11"/>
    <circle cx="210" cy="80" r="11"/>
    <circle cx="150" cy="120" r="11" />
    <circle cx="210" cy="120" r="11"/>
  </g>
  <text x="226" y="135" text-anchor="start" font-family="Arial" font-size="14" font-weight="bold" fill="#1a1a1a">B</text>
</svg>`;

/* ============================================================
   RENDU DES QUESTIONS
   ============================================================ */
function renderQCM() {
  const c = document.getElementById('qcm-container');
  let html = '';
  QCM.forEach((item, i) => {
    html += `<div class="q-card">`;
    html += `<div class="q-num">Question A.${i+1}<span class="q-points">3 pts</span></div>`;
    html += `<div class="q-text">${item.q}</div>`;
    if (item.img === 'schema-reseau') {
      html += `<div style="margin-bottom:16px">${NETWORK_DIAGRAM_SVG}</div>`;
    } else if (item.img === 'ipv6') {
      /* Afiche SVG IPv6 la -- examen_reseau_v2 */
      html += `<div style="margin-bottom:16px;text-align:center">${IPV6_DIAGRAM_SVG}</div>`;
    }
    html += `<div class="opt-list">`;
    item.opts.forEach((opt, j) => {
      html += `<div class="opt-item" id="qcm-${i}-${j}" onclick="selectRadio('qcm',${i},${j})">`;
      html += `<input type="radio" name="qcm-${i}" value="${j}">`;
      html += `<label>${opt}</label></div>`;
    });
    html += `</div></div>`;
  });
  c.innerHTML = html;
}

function renderVF() {
  const c = document.getElementById('vf-container');
  let html = '';
  VF.forEach((item, i) => {
    html += `<div class="q-card">`;
    html += `<div class="q-num">Question B.${i+1}<span class="q-points">2 pts</span></div>`;
    html += `<div class="q-text">${item.q}</div>`;
    html += `<div class="opt-list">`;
    ["Vrai", "Faux"].forEach((opt, j) => {
      html += `<div class="opt-item" id="vf-${i}-${j}" onclick="selectRadio('vf',${i},${j})">`;
      html += `<input type="radio" name="vf-${i}" value="${opt}">`;
      html += `<label>${opt}</label></div>`;
    });
    html += `</div></div>`;
  });
  c.innerHTML = html;
}

function renderDD() {
  const c = document.getElementById('dd-container');
  let html = '';
  DD.forEach((item, i) => {
    html += `<div class="q-card">`;
    html += `<div class="q-num">Question C.${i+1}<span class="q-points">1 pt</span></div>`;
    html += `<div class="q-text">${item.q}</div>`;
    html += `<select class="dd" id="dd-${i}">`;
    html += `<option value="">— Choisir une réponse —</option>`;
    item.options.forEach(o => { html += `<option value="${o}">${o}</option>`; });
    html += `</select></div>`;
  });
  c.innerHTML = html;
}

function renderDND() {
  const c = document.getElementById('dnd-container');
  const allChips = [...DND.map(d => d.ans), ...DND_DECOYS];
  const shuffledChips = allChips.sort(() => Math.random() - 0.5);

  let html = `<div class="q-card">`;
  html += `<div class="q-text">Glissez chaque description dans la case correspondant au bon équipement. Attention : il y a plus de descriptions que de cases.</div>`;
  html += `<div class="dnd-pool" id="dnd-pool">`;
  shuffledChips.forEach((chip, i) => {
    html += `<div class="dnd-chip" id="chip-${i}" draggable="true" data-text="${chip.replace(/"/g, '&quot;')}" ondragstart="dragStart(event,${i})">${chip}</div>`;
  });
  html += `</div>`;

  DND.forEach((item, i) => {
    html += `<div class="dnd-row">`;
    html += `<div class="dnd-target">${item.target}</div>`;
    html += `<div class="dnd-arrow">→</div>`;
    html += `<div class="dnd-slot" id="slot-${i}" ondragover="dragOver(event)" ondrop="dropChip(event,${i})" data-target="${item.target}">Déposez ici</div>`;
    html += `</div>`;
  });
  html += `</div>`;
  c.innerHTML = html;
}

let draggedChipIndex = null;
let chipTexts = {};

function dragStart(ev, idx) {
  draggedChipIndex = idx;
  chipTexts[idx] = ev.target.getAttribute('data-text');
}
function dragOver(ev) { ev.preventDefault(); ev.currentTarget.classList.add('over'); }
function dropChip(ev, slotIdx) {
  ev.preventDefault();
  const slot = document.getElementById('slot-' + slotIdx);
  slot.classList.remove('over');
  if (draggedChipIndex === null) return;
  const text = chipTexts[draggedChipIndex];
  slot.textContent = text;
  slot.classList.add('filled');
  slot.setAttribute('data-answer', text);
  const chipEl = document.getElementById('chip-' + draggedChipIndex);
  if (chipEl) chipEl.classList.add('placed');
  draggedChipIndex = null;
}

function renderMulti() {
  const c = document.getElementById('multi-container');
  let html = '';
  MULTI.forEach((item, qi) => {
    html += `<div class="q-card">`;
    html += `<div class="q-num">Question E.${qi+1}<span class="q-points">2 pts</span></div>`;
    html += `<div class="q-text">${item.q}<br><span style="color:var(--text-faint);font-size:12.5px">(plusieurs réponses possibles)</span></div>`;
    html += `<div class="opt-list">`;
    item.opts.forEach((opt, oi) => {
      html += `<div class="opt-item" id="multi-${qi}-${oi}" onclick="toggleCheckbox(${qi},${oi})">`;
      html += `<input type="checkbox" id="multi-cb-${qi}-${oi}" value="${opt}">`;
      html += `<label>${opt}</label></div>`;
    });
    html += `</div></div>`;
  });
  c.innerHTML = html;
}

function toggleCheckbox(qi, oi) {
  const cb = document.getElementById(`multi-cb-${qi}-${oi}`);
  cb.checked = !cb.checked;
  const item = document.getElementById(`multi-${qi}-${oi}`);
  item.classList.toggle('checked', cb.checked);
}

function renderSubj() {
  const c = document.getElementById('subj-container');
  let html = '';
  SUBJ.forEach((item, i) => {
    html += `<div class="q-card">`;
    html += `<div class="q-num">Question F.${i+1}<span class="q-points">${item.pts} pts</span></div>`;
    html += `<div class="q-text">${item.q}</div>`;
    html += `<textarea class="subj" id="subj-${i}" placeholder="Votre réponse..."></textarea>`;
    html += `</div>`;
  });
  c.innerHTML = html;
}

/* Fèmen modal pop-up la -- examen_reseau_v2 */
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('show');
}

function selectRadio(group, qIdx, optIdx) {
  document.querySelectorAll(`[id^="${group}-${qIdx}-"]`).forEach(el => el.classList.remove('checked'));
  const el = document.getElementById(`${group}-${qIdx}-${optIdx}`);
  el.classList.add('checked');
  el.querySelector('input').checked = true;
}

/* ============================================================
   DÉMARRAGE DE L'EXAMEN
   ============================================================ */
function startExam() {
  const nameInput = document.getElementById('student-name');
  studentName = nameInput.value.trim();
  if (!studentName) { nameInput.style.borderColor = '#E0654F'; nameInput.focus(); return; }

  document.getElementById('screen-intro').style.display = 'none';
  document.getElementById('screen-exam').classList.add('show');

  renderQCM(); renderVF(); renderDD(); renderDND(); renderMulti(); renderSubj();
  startTimer();
  /* Scroll otomatik pou etidyan wè Seksyon A dirèkteman -- examen_reseau_v2 */
  setTimeout(() => document.getElementById('exam-body')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

/* ============================================================
   CHRONOMÈTRE
   ============================================================ */
let remainingSeconds = EXAM_DURATION_SECONDS;

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    remainingSeconds--;
    updateTimerDisplay();
    if (remainingSeconds <= 0) { clearInterval(timerInterval); submitExam(true); }
  }, 1000);
}

function updateTimerDisplay() {
  const h = Math.floor(remainingSeconds / 3600);
  const m = Math.floor((remainingSeconds % 3600) / 60);
  const s = remainingSeconds % 60;
  const display = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  const timerEl = document.getElementById('timer');
  timerEl.textContent = display;
  if (remainingSeconds <= 300) timerEl.className = 'danger';
  else if (remainingSeconds <= 900) timerEl.className = 'warn';
}

/* ============================================================
   CORRECTION AUTOMATIQUE
   ============================================================ */
async function gradeObjective() {
  let score = 0;
  let detail = [];

  for (let i = 0; i < QCM.length; i++) {
    const checked = document.querySelector(`input[name="qcm-${i}"]:checked`);
    const userAns = checked ? QCM[i].opts[parseInt(checked.value)] : null;
    const userHash = userAns ? await sha256(userAns) : null;
    const correct = userHash === QCM[i].hash;
    if (correct) score += 3;
    detail.push(`A.${i+1}: ${userAns || '(sans réponse)'} ${correct ? '[correct]' : '[incorrect]'}`);
  }

  for (let i = 0; i < VF.length; i++) {
    const checked = document.querySelector(`input[name="vf-${i}"]:checked`);
    const userAns = checked ? checked.value : null;
    const userHash = userAns ? await sha256(userAns) : null;
    const correct = userHash === VF[i].hash;
    if (correct) score += 2;
    detail.push(`B.${i+1}: ${userAns || '(sans réponse)'} ${correct ? '[correct]' : '[incorrect]'}`);
  }

  for (let i = 0; i < DD.length; i++) {
    const sel = document.getElementById(`dd-${i}`);
    const userAns = sel ? sel.value : null;
    const userHash = userAns ? await sha256(userAns) : null;
    const correct = userHash === DD[i].hash;
    if (correct) score += 1;
    detail.push(`C.${i+1}: ${userAns || '(sans réponse)'} ${correct ? '[correct]' : '[incorrect]'}`);
  }

  for (let i = 0; i < DND.length; i++) {
    const slot = document.getElementById(`slot-${i}`);
    const userAns = slot ? slot.getAttribute('data-answer') : null;
    const userHash = userAns ? await sha256(userAns) : null;
    const correct = userHash === DND[i].hash;
    if (correct) score += 1;
    detail.push(`D (${DND[i].target}): ${userAns || '(sans réponse)'} ${correct ? '[correct]' : '[incorrect]'}`);
  }

  for (let qi = 0; qi < MULTI.length; qi++) {
    const item = MULTI[qi];
    let userSelected = [];
    item.opts.forEach((opt, oi) => {
      const cb = document.getElementById(`multi-cb-${qi}-${oi}`);
      if (cb && cb.checked) userSelected.push(opt);
    });
    const correctSet = new Set(item.ans);
    const userSet = new Set(userSelected);
    const isExactMatch = correctSet.size === userSet.size && [...correctSet].every(a => userSet.has(a));
    if (isExactMatch) score += 2;
    detail.push(`E.${qi+1}: ${userSelected.join(', ') || '(sans réponse)'} ${isExactMatch ? '[correct]' : '[incorrect]'}`);
  }

  return { score, detail };
}

function collectSubjective() {
  let answers = [];
  SUBJ.forEach((item, i) => {
    const el = document.getElementById(`subj-${i}`);
    const val = el ? el.value.trim() : '';
    answers.push(`F.${i+1} (${item.pts} pts) — ${item.q}\n${val || '(sans réponse)'}`);
  });
  return answers;
}

/* ============================================================
   SOUMISSION DE L'EXAMEN
   ============================================================ */
let lastEmailBody = '';
let lastEmailSubject = '';

/* Tcheke si etidyan an reponn omwen 1 kesyon -- examen_reseau_v2 */
function hasAnyAnswer() {
  for (let i = 0; i < QCM.length; i++) {
    if (document.querySelector(`input[name="qcm-${i}"]:checked`)) return true;
  }
  for (let i = 0; i < VF.length; i++) {
    if (document.querySelector(`input[name="vf-${i}"]:checked`)) return true;
  }
  for (let i = 0; i < DD.length; i++) {
    const sel = document.getElementById(`dd-${i}`);
    if (sel && sel.value) return true;
  }
  for (let i = 0; i < DND.length; i++) {
    const slot = document.getElementById(`slot-${i}`);
    if (slot && slot.getAttribute('data-answer')) return true;
  }
  for (let qi = 0; qi < MULTI.length; qi++) {
    const item = MULTI[qi];
    for (let oi = 0; oi < item.opts.length; oi++) {
      const cb = document.getElementById(`multi-cb-${qi}-${oi}`);
      if (cb && cb.checked) return true;
    }
  }
  for (let i = 0; i < SUBJ.length; i++) {
    const el = document.getElementById(`subj-${i}`);
    if (el && el.value.trim()) return true;
  }
  return false;
}

async function submitExam(autoSubmit) {
  if (examSubmitted) return;
  if (!autoSubmit && !hasAnyAnswer()) {
    /* Montre modal pop-up olye alert() -- examen_reseau_v2 */
    document.getElementById('modal-overlay').classList.add('show');
    return;
  }
  examSubmitted = true;
  if (timerInterval) clearInterval(timerInterval);

  const { score: objectiveScore, detail } = await gradeObjective();
  const subjectiveAnswers = collectSubjective();

  document.getElementById('screen-exam').classList.remove('show');
  document.getElementById('screen-done').classList.add('show');

  if (autoSubmit) {
    document.getElementById('done-msg').textContent =
      "Le temps imparti est écoulé. Vos réponses ont été soumises automatiquement. Cliquez sur un des boutons ci-dessous pour transmettre vos résultats à l'enseignant.";
  }

  buildEmailContent(objectiveScore, detail, subjectiveAnswers);
setupSubmitButtons(objectiveScore, detail, subjectiveAnswers);
}

function buildEmailContent(objectiveScore, detail, subjectiveAnswers) {
  lastEmailSubject = `Résultats Réseau 1 — ${studentName}`;

  let body = `EXAMEN RÉSEAU 1 — RÉSULTATS\n`;
  body += `Étudiant : ${studentName}\n`;
  body += `============================================\n\n`;
  /* Rekalkil pwen: total automat = /67 (A 33+B 20+C 6+D 4+E 4) -- examen_reseau_v2 */
  body += `NOTE AUTOMATIQUE (Sections A+B+C+D+E) : ${objectiveScore} / 67\n\n`;
  body += `--- Détail des réponses automatiques ---\n`;
  detail.forEach(line => { body += line + '\n'; });
  body += `\n============================================\n`;
  /* Seksyon F pase soti 26 a 33 pwen -- examen_reseau_v2 */
  body += `SECTION F — RÉPONSES SUBJECTIVES (à corriger, 33 pts)\n`;
  body += `============================================\n\n`;
  subjectiveAnswers.forEach(ans => { body += ans + '\n\n---\n\n'; });
  body += `============================================\n`;
  body += `CALCUL FINAL À COMPLÉTER PAR L'ENSEIGNANT :\n`;
  body += `Note automatique : ${objectiveScore} / 67\n`;
  body += `Note manuelle (Section F) : ____ / 33\n`;
  body += `TOTAL : ____ / 100   (seuil de réussite : 65/100)\n`;

  lastEmailBody = body;
}

function setupSubmitButtons(objectiveScore, detail, subjectiveAnswers) {
  const submitBtn = document.getElementById('resend-btn');
  const copyBtn = document.getElementById('copy-btn');

  // Kache bouton copie a — pa bezwen ankò
  if (copyBtn) copyBtn.style.display = 'none';

  submitBtn.textContent = 'Envoyer les résultats';
  submitBtn.onclick = () => sendEmail(objectiveScore, detail, subjectiveAnswers);

  // Voye otomatikman
  sendEmail(objectiveScore, detail, subjectiveAnswers);
}

async function sendEmail(objectiveScore, detail, subjectiveAnswers) {
  const submitBtn = document.getElementById('resend-btn');
  submitBtn.textContent = 'Envoi en cours...';
  submitBtn.disabled = true;

  const detailText = detail.join('\n');
  const subjText = subjectiveAnswers.join('\n\n---\n\n');

  try {
    await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        student_name: studentName,
        objective_score: objectiveScore,
        detail: detailText,
        subjective: subjText,
      },
      EMAILJS_PUBLIC_KEY
    );

    submitBtn.textContent = '✓ Résultats envoyés';
    submitBtn.style.background = '#1D9E75';
    document.getElementById('copy-feedback').textContent = 'Vos résultats ont été envoyés automatiquement à l\'enseignant.';
    document.getElementById('copy-feedback').classList.add('show');

  } catch (error) {
    console.error('EmailJS error:', error);
    submitBtn.textContent = 'Réessayer l\'envoi';
    submitBtn.disabled = false;
    document.getElementById('copy-feedback').textContent = 'Erreur d\'envoi — cliquez sur "Réessayer" ou copiez manuellement.';
    document.getElementById('copy-feedback').classList.add('show');
  }
}

/* ============================================================
   INITIALISATION GÉNÉRALE
   ============================================================ */
(async function init() {
  emailjs.init(EMAILJS_PUBLIC_KEY);
  if (checkDeadline()) return;
  await initHashes();
})();
