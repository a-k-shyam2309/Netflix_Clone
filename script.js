// Add a language by adding its code, display label and translations below.
const languageCatalog = {
  en: { label: 'English', welcome: 'Choose your language', continue: 'Continue →' },
  hi: { label: 'हिंदी', welcome: 'अपनी भाषा चुनें', continue: 'जारी रखें →' }
};

const strings = {
  en: { better_city:'A BETTER CITY, TOGETHER',hero_title:'Turn civic issues into visible action.',hero_text:'A trusted space where citizens report, officials act, and every resolution is evidence-grounded.',civic_connection:'Connected civic action, from report to resolution.',welcome:'WELCOME BACK',sign_in:'Sign in to NagrikSetu',sign_in_text:'Choose how you want to enter the platform.',citizen:'Citizen',admin:'Administrator',email:'Email address',password:'Password',remember:'Remember me',forgot:'Forgot password?',new_here:'New to NagrikSetu?',create_account:'Create an account',secure:'Secure civic access · Your data stays protected',menu:'MENU',overview:'Overview',report_issue:'Report an issue',civic_map:'Civic map',my_complaints:'My complaints',budget:'Community budget',dark_mode:'Dark mode',logout:'Log out',your_city:'YOUR CITY AT A GLANCE',active_reports:'Active reports',active_context:'Across your area',resolved:'Resolved this month',vs_last:'vs. last month',community_impact:'Community impact',citizens_helped:'Citizens helped',notice:'Your report #CIV-1042 is now being reviewed by Road Maintenance.',latest_report:'Latest report',track_status:'Track its status in real time',view_all:'View all →',under_review:'Under review',issue_title:'Pothole near college gate',review_progress:'Review in progress',community_priority:'Community priorities',shaped_by:'Shaped by local reports',live_data:'Live data',drainage:'Drainage improvement',streetlights:'Streetlight repair',roads:'Road repair',reports:'reports',full_name:'Full name',continue:'Continue →',register_text:"Join your community's civic action network." },
  hi: { better_city:'एक बेहतर शहर, साथ मिलकर',hero_title:'नागरिक समस्याओं को दृश्यमान कार्रवाई में बदलें।',hero_text:'एक विश्वसनीय स्थान जहाँ नागरिक रिपोर्ट करते हैं, अधिकारी कार्रवाई करते हैं और हर समाधान साक्ष्य-आधारित है।',civic_connection:'रिपोर्ट से समाधान तक, जुड़ी हुई नागरिक कार्रवाई।',welcome:'वापसी पर स्वागत है',sign_in:'NagrikSetu में साइन इन करें',sign_in_text:'चुनें कि आप प्लेटफ़ॉर्म में कैसे प्रवेश करना चाहते हैं।',citizen:'नागरिक',admin:'प्रशासक',email:'ईमेल पता',password:'पासवर्ड',remember:'मुझे याद रखें',forgot:'पासवर्ड भूल गए?',new_here:'NagrikSetu पर नए हैं?',create_account:'खाता बनाएँ',secure:'सुरक्षित नागरिक पहुँच · आपका डेटा सुरक्षित है',menu:'मेनू',overview:'अवलोकन',report_issue:'समस्या दर्ज करें',civic_map:'नागरिक मानचित्र',my_complaints:'मेरी शिकायतें',budget:'सामुदायिक बजट',dark_mode:'डार्क मोड',logout:'लॉग आउट',your_city:'आपका शहर एक नज़र में',active_reports:'सक्रिय रिपोर्ट',active_context:'आपके क्षेत्र में',resolved:'इस माह हल की गई',vs_last:'पिछले माह से',community_impact:'सामुदायिक प्रभाव',citizens_helped:'नागरिकों की मदद',notice:'आपकी रिपोर्ट #CIV-1042 अब सड़क रखरखाव विभाग द्वारा देखी जा रही है।',latest_report:'नवीनतम रिपोर्ट',track_status:'वास्तविक समय में स्थिति देखें',view_all:'सभी देखें →',under_review:'समीक्षा में',issue_title:'कॉलेज गेट के पास गड्ढा',review_progress:'समीक्षा जारी है',community_priority:'सामुदायिक प्राथमिकताएँ',shaped_by:'स्थानीय रिपोर्टों से निर्मित',live_data:'लाइव डेटा',drainage:'जल निकासी सुधार',streetlights:'स्ट्रीटलाइट मरम्मत',roads:'सड़क मरम्मत',reports:'रिपोर्ट',full_name:'पूरा नाम',continue:'जारी रखें →',register_text:'अपने समुदाय के नागरिक कार्रवाई नेटवर्क से जुड़ें।' }
};

let language = localStorage.getItem('ns-language') || 'en';
let role = 'citizen';
const languageMenus = [];
const $ = selector => document.querySelector(selector);
const $$ = selector => document.querySelectorAll(selector);

function currentStrings() { return strings[language] || strings.en; }
function makeLanguageMenu(host, compact = false) {
  const menu = document.createElement('div');
  menu.className = `language-menu${compact ? ' compact' : ''}`;
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'language-menu-button';
  const list = document.createElement('div');
  list.className = 'language-menu-list'; list.setAttribute('role', 'menu');
  Object.entries(languageCatalog).forEach(([code, info]) => {
    const option = document.createElement('button');
    option.type = 'button'; option.setAttribute('role', 'menuitem'); option.dataset.language = code; option.textContent = info.label;
    option.addEventListener('click', () => { setLanguage(code); menu.classList.remove('open'); });
    list.append(option);
  });
  button.addEventListener('click', () => { languageMenus.forEach(item => { if (item !== menu) item.classList.remove('open'); }); menu.classList.toggle('open'); });
  menu.append(button, list); host.replaceWith(menu); languageMenus.push(menu); return menu;
}
function populateLanguageMenus() {
  const welcomeMenu = $('#welcome-language');
  if (welcomeMenu) makeLanguageMenu(welcomeMenu);
  $$('.language-trigger').forEach(trigger => makeLanguageMenu(trigger, true));
  document.addEventListener('click', event => { if (!event.target.closest('.language-menu')) languageMenus.forEach(menu => menu.classList.remove('open')); });
}
function translate() {
  const copy = currentStrings();
  document.documentElement.lang = language;
  document.body.classList.toggle('hindi', language === 'hi');
  $$('[data-i18n]').forEach(element => { if (copy[element.dataset.i18n]) element.textContent = copy[element.dataset.i18n]; });
  languageMenus.forEach(menu => {
    menu.querySelector('.language-menu-button').textContent = `${languageCatalog[language].label}⌄`;
    menu.querySelectorAll('[data-language]').forEach(option => option.classList.toggle('selected', option.dataset.language === language));
  });
  const continueButton = $('#continue-language');
  if (continueButton) continueButton.textContent = languageCatalog[language].continue;
  const languageTitle = $('#language-title');
  if (languageTitle) languageTitle.textContent = languageCatalog[language].welcome;
  document.querySelector('[data-placeholder]')?.setAttribute('placeholder', copy.full_name);
}
function setLanguage(nextLanguage) {
  if (!languageCatalog[nextLanguage]) return;
  language = nextLanguage;
  localStorage.setItem('ns-language', language);
  translate();
}
function enterPlatform() {
  $('#language-screen').classList.add('hidden');
  $('#auth-screen').classList.remove('hidden');
}

populateLanguageMenus();
translate();
$('#continue-language')?.addEventListener('click', enterPlatform);
$$('.role').forEach(button => button.addEventListener('click', () => { $$('.role').forEach(item => item.classList.remove('active')); button.classList.add('active'); role = button.dataset.role; }));
$('#show-password').addEventListener('click', () => { const input = $('#password'); input.type = input.type === 'password' ? 'text' : 'password'; });
$$('.theme-toggle').forEach(button => button.addEventListener('click', () => { document.body.classList.toggle('dark'); localStorage.setItem('ns-theme', document.body.classList.contains('dark') ? 'dark' : 'light'); }));
$('#login-form').addEventListener('submit', event => { event.preventDefault(); $('#auth-screen').classList.add('hidden'); $('#dashboard').classList.remove('hidden'); $('#dashboard-heading').textContent = role === 'admin' ? (language === 'hi' ? 'सुप्रभात, अधिकारी।' : 'Good morning, Administrator.') : (language === 'hi' ? 'सुप्रभात, आन्या।' : 'Good morning, Aanya.'); });
$('#logout').addEventListener('click', () => { $('#dashboard').classList.add('hidden'); $('#auth-screen').classList.remove('hidden'); });
$('#register-button').addEventListener('click', () => $('#register-modal').classList.remove('hidden'));
$$('.close-modal').forEach(button => button.addEventListener('click', () => $('#register-modal').classList.add('hidden')));
$$('.password-visibility').forEach(button => button.addEventListener('click', () => {
  const input = $(`#${button.dataset.target}`);
  input.type = input.type === 'password' ? 'text' : 'password';
  button.setAttribute('aria-label', input.type === 'password' ? 'Show password' : 'Hide password');
}));
$('#new-password').addEventListener('input', event => {
  const value = event.target.value;
  const checks = { length: value.length >= 8, upper: /[A-Z]/.test(value), lower: /[a-z]/.test(value), number: /\d/.test(value), symbol: /[!@#$%^&*]/.test(value) };
  Object.entries(checks).forEach(([rule, passed]) => document.querySelector(`[data-rule="${rule}"]`).classList.toggle('met', passed));
});
$('#register-form').addEventListener('submit', event => {
  event.preventDefault();
  const password = $('#new-password').value;
  const confirmation = $('#confirm-password').value;
  const message = $('#password-message');
  if (password !== confirmation) { message.textContent = language === 'hi' ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.'; return; }
  message.textContent = '';
  $('#register-modal').classList.add('hidden'); $('#dashboard').classList.remove('hidden'); $('#auth-screen').classList.add('hidden');
});
if (localStorage.getItem('ns-theme') === 'dark') document.body.classList.add('dark');
