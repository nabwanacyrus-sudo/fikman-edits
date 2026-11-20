document.getElementById('year').textContent = new Date().getFullYear();
const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.main-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
const filters = document.querySelectorAll('.filter');
const cards = document.querySelectorAll('.project-card');
filters.forEach(button => button.addEventListener('click', () => {
  filters.forEach(b => b.classList.remove('active'));
  button.classList.add('active');
  const filter = button.dataset.filter;
  cards.forEach(card => {
    const show = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('hide', !show);
  });
}));
/* Pause other videos when a visitor starts playing one. */
document.querySelectorAll('video').forEach(video => video.addEventListener('play', () => {
  document.querySelectorAll('video').forEach(other => { if (other !== video) other.pause(); });
}));

/* Theme preference: default to the original dark appearance; remember visitor choice. */
const themeButton = document.querySelector('.theme-toggle');
const themeIcon = themeButton.querySelector('.theme-icon');
const themeLabel = themeButton.querySelector('.theme-label');
const themeMeta = document.getElementById('theme-color-meta');
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const light = theme === 'light';
  themeIcon.textContent = light ? '☾' : '☼';
  themeLabel.textContent = light ? 'DARK' : 'LIGHT';
  themeButton.setAttribute('aria-label', light ? 'Switch to dark mode' : 'Switch to light mode');
  themeMeta.setAttribute('content', light ? '#f3f7fc' : '#070b20');
}
let savedTheme = 'dark';
try { savedTheme = localStorage.getItem('fikman-theme') || 'dark'; } catch (e) {}
applyTheme(savedTheme === 'light' ? 'light' : 'dark');
themeButton.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('fikman-theme', next); } catch (e) {}
});


/* Cinematic brand opening: brief, skippable, and disabled for reduced-motion users. */
const cinematicLoader = document.getElementById('cinematicLoader');
const skipIntro = document.getElementById('skipIntro');
function closeIntro() {
  if (!cinematicLoader || cinematicLoader.classList.contains('loader-done')) return;
  cinematicLoader.classList.add('loader-done');
  document.body.classList.remove('intro-active');
  window.setTimeout(() => cinematicLoader.remove(), 700);
}
if (cinematicLoader) {
  document.body.classList.add('intro-active');
  skipIntro?.addEventListener('click', closeIntro);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) closeIntro();
  else window.addEventListener('load', () => window.setTimeout(closeIntro, 1450), { once: true });
  window.setTimeout(closeIntro, 3500);
}

/* Tap/click a project to open a clean in-page preview instead of leaving the portfolio. */
const projectViewer = document.getElementById('projectViewer');
const viewerImage = projectViewer?.querySelector('img');
const viewerClose = projectViewer?.querySelector('.viewer-close');
function closeProjectViewer() {
  if (!projectViewer) return;
  projectViewer.classList.remove('viewer-open');
  projectViewer.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('viewer-active');
  if (viewerImage) viewerImage.src = '';
}
document.querySelectorAll('.project-image').forEach(link => {
  link.addEventListener('click', event => {
    if (!projectViewer || !viewerImage) return;
    event.preventDefault();
    const image = link.querySelector('img');
    viewerImage.src = link.href;
    viewerImage.alt = image?.alt || 'Selected Fikman Edits project';
    projectViewer.classList.add('viewer-open');
    projectViewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('viewer-active');
    viewerClose?.focus();
  });
});
viewerClose?.addEventListener('click', closeProjectViewer);
projectViewer?.addEventListener('click', event => { if (event.target === projectViewer) closeProjectViewer(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeProjectViewer(); });


/* FIKMAN AI business assistant. AI replies use a secure Netlify Function; project briefs use Netlify Forms. */
(() => {
  const root = document.getElementById('fikmanAiRoot');
  if (!root) return;
  const launch = document.getElementById('fikmanAiLaunch');
  const panel = document.getElementById('fikmanAiPanel');
  const close = document.getElementById('fikmanAiClose');
  const messages = document.getElementById('fikmanAiMessages');
  const form = document.getElementById('fikmanAiForm');
  const input = document.getElementById('fikmanAiInput');
  const quick = document.getElementById('aiQuickActions');
  const history = [];
  let briefMode = false;
  let briefStep = 0;
  const brief = {name:'',email:'',whatsapp:'',service:'',budget:'',deadline:'',details:''};
  const briefQuestions = [
    ['name','Great! What name should we use for your enquiry?'],
    ['email',"What's the best email address to reach you?"],
    ['whatsapp',"What's your WhatsApp number, including country code? (You can type “skip”.)"],
    ['service','What do you need help with: graphic design, video editing, photography, a campaign, or something else?'],
    ['budget','Do you have an estimated budget? You can say “not sure yet”.'],
    ['deadline','When would you like the project completed?'],
    ['details','Tell me a little about the idea, deliverables and any important details.']
  ];
  function addMessage(text, who='bot', extra='') {
    const el = document.createElement('div'); el.className = `ai-message ${who === 'user' ? 'ai-user' : 'ai-bot'} ${extra}`;
    el.textContent = text; messages.appendChild(el); messages.scrollTop = messages.scrollHeight; return el;
  }
  function setOpen(open) { root.classList.toggle('ai-open', open); launch.setAttribute('aria-expanded', String(open)); panel.setAttribute('aria-hidden', String(!open)); if(open) setTimeout(()=>input.focus(),180); }
  launch.addEventListener('click',()=>setOpen(true)); close.addEventListener('click',()=>setOpen(false));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&root.classList.contains('ai-open'))setOpen(false)});
  function startBrief(){ briefMode=true; briefStep=0; Object.keys(brief).forEach(k=>brief[k]=''); quick.hidden=true; addMessage('Absolutely — I’ll help you prepare a project enquiry for the Fikman Edits team. I’ll ask a few short questions.'); addMessage(briefQuestions[0][1]); }
  async function submitBrief(){
    const data = new URLSearchParams(); data.set('form-name','fikman-project-enquiry');
    Object.entries(brief).forEach(([k,v])=>data.set(({name:'customer-name',email:'customer-email',whatsapp:'customer-whatsapp',service:'service',budget:'budget',deadline:'deadline',details:'project-details'})[k],v));
    try {
      const response = await fetch('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:data.toString()});
      if(!response.ok) throw new Error('Form submission failed');
      addMessage('Thank you! Your project enquiry has been sent to Fikman Edits for review. The team can follow up using the contact details you provided. You can also message the team directly on WhatsApp: https://wa.me/256755504550');
    } catch(err) { addMessage('I’ve prepared your project details, but the website could not submit them just now. Please send your brief directly through WhatsApp: https://wa.me/256755504550'); }
    briefMode=false; quick.hidden=false;
  }
  async function handleBriefAnswer(value){
    const [key] = briefQuestions[briefStep]; brief[key]=value.trim(); briefStep++;
    if(briefStep < briefQuestions.length){ addMessage(briefQuestions[briefStep][1]); }
    else { addMessage('Perfect — I’m sending your project brief to the team now.'); await submitBrief(); }
  }
  async function askAI(text){
    const typing=addMessage('···','bot','ai-typing');
    history.push({role:'user',content:text});
    try {
      const response=await fetch('/.netlify/functions/fikman-ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history.slice(-12)})});
      const result=await response.json(); if(!response.ok) throw new Error(result.error||'Assistant is not configured yet');
      const answer=result.reply||'I’m sorry, I couldn’t form an answer. Please contact the team directly.';
      typing.remove(); addMessage(answer); history.push({role:'assistant',content:answer});
    } catch(err){ typing.remove(); addMessage('I’m not connected to my AI service yet. You can still start a project brief with the button above, or contact the team on WhatsApp: https://wa.me/256755504550'); }
  }
  form.addEventListener('submit',async e=>{e.preventDefault();const text=input.value.trim();if(!text)return;input.value='';addMessage(text,'user');if(briefMode) await handleBriefAnswer(text);else await askAI(text);});
  quick.addEventListener('click',e=>{const button=e.target.closest('button');if(!button)return;if(button.dataset.action==='brief'){startBrief();return;}const prompt=button.dataset.prompt;if(prompt){addMessage(prompt,'user');askAI(prompt);}});
})();
