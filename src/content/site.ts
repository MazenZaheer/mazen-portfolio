/**
 * All portfolio copy lives here. Components only read from this file.
 *
 * Images: `photo()` points at placeholder photography on picsum.photos.
 * Replace with your own files by dropping them in /public/images and
 * using paths like '/images/vitals.jpg'.
 */

const photo = (id: number, w = 1600, h = 1200) => `https://picsum.photos/id/${id}/${w}/${h}`;
/** Topic-matched photos from Unsplash (free licence), cropped server-side. */
const unsplash = (id: string, w = 1600, h = 1200) =>
  `https://images.unsplash.com/${id}?w=${w}&h=${h}&fit=crop&auto=format&q=80`;

export const site = {
  name: 'Mazen Z.',
  initials: 'MZ',
  email: 'laomaaaaaaa@gmail.com',
  role: 'Researcher · Organiser · Mentor',
  location: 'Lahore ⇄ Selangor',
  headline: 'Research, operations & mentorship: from CERN beamlines to Model UN floors.',
  statement:
    'In a world that’s constantly changing, I’m driven by the promise of building a brighter future through science and technology. I’ve had the chance to co-lead a CERN affiliated research team, where we redesigned neutron spallation shielding to make experiments safer. Beyond theory, my toolkit spans from simulations and IoT prototyping to data analysis and product scaling, but what excites me most is the chance to solve problems that matter, whether in the lab, through technology, or by mentoring others. I enjoy working with teams, sharing knowledge, and turning ambitious ideas into real impact. I’m now looking for opportunities in experimental physics or quantum computing, where I can keep learning, contribute meaningfully, and help push the boundaries of what’s possible.',
  heroImage: photo(1036, 2400, 1600),
  servicesImage: photo(1043, 2000, 1400),
};

export const stats = [
  { value: 3.86, decimals: 2, label: 'GPA at XMUM' },
  { value: 6, suffix: 'A* 2A', label: 'O Level grades' },
  { value: 250, suffix: '+', label: 'MUN students mentored' },
  { value: 1560, group: false, label: 'SAT score' },
];

export type Chapter = { id: string; title: string; note: string; image: string };

/**
 * Hero carousel: one card per chapter. The homepage shows only the carousel;
 * each chapter opens as its own page at /<id> (see src/app/[chapter]).
 */
export const chapters: Chapter[] = [
  { id: 'about', title: 'About', note: 'Physics · Technology · Mentoring', image: unsplash('photo-1781330168090-a2b6721eb435', 900, 1200) },
  { id: 'academia', title: 'Academia', note: 'BISC · XMUM', image: photo(24, 900, 1200) },
  { id: 'mun', title: 'Model UN', note: '3 Best Delegations', image: photo(1040, 900, 1200) },
  { id: 'counselling', title: 'Counselling', note: 'Invicta · 1-on-1', image: photo(1060, 900, 1200) },
  { id: 'research', title: 'Research', note: 'CERN BL4S · IJSSB', image: photo(1002, 900, 1200) },
  { id: 'projects', title: 'Projects', note: 'Vitals · Miljo · IPRO', image: unsplash('photo-1603201667230-bd139210db18', 900, 1200) },
  { id: 'management', title: 'Project Management', note: '6 roles, 2023 to now', image: unsplash('photo-1512758017271-d7b84c2113f1', 900, 1200) },
  { id: 'enrichment', title: 'Enrichment', note: 'Fellowships & Olympiads', image: photo(1073, 900, 1200) },
  { id: 'courses', title: 'Courses', note: 'Industry & academic', image: photo(1, 900, 1200) },
  { id: 'services', title: 'Services', note: 'Four ways to work together', image: unsplash('photo-1532622785990-d2c36a76f5a6', 900, 1200) },
  { id: 'skills', title: 'Skills', note: 'Research · Ops · Code · Comms', image: unsplash('photo-1756829007483-414057ed33cd', 900, 1200) },
];

export type Panel = {
  id: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  highlight: { value: string; label: string };
  items: string[];
  theme: 'light' | 'dark' | 'warm';
};

export const panels: Panel[] = [
  {
    id: 'academia',
    eyebrow: 'Academia · School',
    title: 'BISC',
    subtitle: 'Where the leadership habit started.',
    highlight: { value: '6A*', label: "O Levels, 2 As · Principal's Honours List" },
    theme: 'light',
    items: [
      'Head Boy',
      'Social Welfare President',
      'English Yearbook Editor',
      'First-ever Ambassador ×2',
      'Founder, President & Vice-President of BISCMUN Society',
      'Founder of BISCSTEM Society',
    ],
  },
  {
    id: 'xmum',
    eyebrow: 'Academia · University',
    title: 'XMUM',
    subtitle: 'Xiamen University Malaysia: studying, organising, hosting.',
    highlight: { value: '3.86', label: 'GPA' },
    theme: 'dark',
    items: [
      'Class Representative',
      'Newsletter Editor',
      'VP, XMUM English Language Club',
      'Head of Contest Protocol, SDC Hackathon 2026',
      'Head of Ambassadors, XMUM Student Career Fair 2026',
      'MC Host, XMUM Student Career Fair 2026',
      'MC Host, Green Threads 2026',
      'Orientation GameMaster (Feb & Apr 2026)',
      'Event Planner: X-Awards, X-Nergy & Spookydadoo 2026',
      'AI Club Event Planner 2026',
    ],
  },
  {
    id: 'mun',
    eyebrow: 'Model United Nations',
    title: 'The floor',
    subtitle: 'Delegate, founder, head of operations, mentor.',
    highlight: { value: '250+', label: 'Students mentored to 7 BDs, 10 ODs & 2 Best Delegations' },
    theme: 'warm',
    items: [
      '3 Best Delegations, 3 Outstanding Delegations & multiple HM/SM awards',
      'Founder and President/Vice-President of BTSCMUN Society',
      'Article 19 (Aug 2024): Head of Operations, MUN Delegations, Punjab. Oversaw 15+ delegations',
      '7× ACD: BTSCMUNV, BBTMUNII, IVYMUNI, CRESMUN, ITTEHADMUNII, BBTMUNIII, BTSCMUNVI',
      'Organising committee at MUNNATION & ARCMUN',
    ],
  },
  {
    id: 'counselling',
    eyebrow: 'University Counselling',
    title: 'Invicta',
    subtitle: 'Personal mentor: turning experiences into applications.',
    highlight: { value: '1:1', label: 'Mentorship on profiles, resumes and narratives' },
    theme: 'dark',
    items: [
      'Helped students craft compelling university profiles, resumes and personal narratives',
      'Translated academic and extracurricular work into personal brands and curated project portfolios',
      'Supported ECs, SAT and A-Level prep, applications and university selection',
    ],
  },
];

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  category: 'Research' | 'Product' | 'Nonprofit' | 'Hardware';
  role: string;
  period: string;
  with?: string;
  where?: string;
  summary: string;
  image: string;
  metrics: { value: string; label: string }[];
  points: string[];
};

export const research: Project[] = [
  {
    slug: 'cern-beamline-for-schools',
    title: 'Neutron Yield & Shielding',
    kicker: 'CERN Beamline for Schools (BL4S)',
    category: 'Research',
    role: 'Co-lead, 7-person team',
    period: 'Nov 2024 – Apr 2025',
    with: 'Prof. Pervez Hoodbhoy (MIT)',
    where: 'CERN BL4S',
    summary:
      'Characterising neutron yields from iron, lead and tungsten targets, then testing how well candidate materials shield against them.',
    image: photo(1022, 1800, 1200),
    metrics: [
      { value: '3', label: 'Targets: Fe, Pb, W' },
      { value: '7', label: 'Team members, co-led' },
      { value: '2', label: 'Companion papers' },
    ],
    points: [
      'Co-led a 7-person team quantifying neutron yields from Fe, Pb and W targets with WENDI detectors and Geant4 Monte Carlo simulations.',
      'Benchmarked dose attenuation against ICRP standards.',
      'Produced two companion papers: Neutron Yield Characterisation, and Testing Radiation Shielding Materials.',
    ],
  },
  {
    slug: 'the-pale-blue-dot-effect',
    title: 'The Pale Blue Dot Effect',
    kicker: 'International Journal of Social Sciences Bulletin',
    category: 'Research',
    role: 'Researcher',
    period: 'Published Oct 2024',
    where: 'Vol. 2 No. 4 (2024) · HEC Y-Category',
    summary:
      "A theoretical study of Carl Sagan's framework and how people respond psychologically to their own cosmic insignificance.",
    image: photo(1002, 1800, 1200),
    metrics: [
      { value: 'Vol. 2', label: 'No. 4, 2024' },
      { value: 'HEC Y', label: 'Category journal' },
    ],
    points: [
      "Theoretical study of Carl Sagan's framework and human psychological responses to insignificance.",
      'Examined implications for anxiety and for how people perceive inconsequential problems.',
    ],
  },
];

export const projects: Project[] = [
  {
    slug: 'vitals',
    title: 'Vitals',
    kicker: 'AI heart-health platform',
    category: 'Product',
    role: 'Co-founder',
    period: 'Jun 2024 – Present',
    with: 'Shaukat Khanum Memorial Hospital',
    summary:
      'A heart-health platform that links patients to blood banks, teleconsultation and wearable fitness tracking, and keeps them on their prescriptions.',
    image: unsplash('photo-1513224502586-d1e602410265', 1600, 2000),
    metrics: [
      { value: '3,500+', label: 'Users, 75% monthly active' },
      { value: '62→88%', label: 'Prescription adherence' },
      { value: '450+', label: 'Counselling sessions, 4.8/5' },
      { value: '99.9%', label: 'Uptime, biweekly releases' },
    ],
    points: [
      'Scaled to 3,500+ users (75% MAU) and integrated 10 blood banks for 1,200+ on-demand requests, with 40% faster fulfilment.',
      'Raised prescription adherence from 62% to 88%.',
      'Launched teleconsultation and wearable-fitness modules: 450+ counselling sessions averaging 4.8/5, at 99.9% uptime with biweekly feature rollouts.',
    ],
  },
  {
    slug: 'miljo',
    title: 'Miljo',
    kicker: 'AI eco-conservation app',
    category: 'Product',
    role: 'Team Lead',
    period: 'Aug 2024 – Present',
    with: 'International collaborators',
    summary:
      'A wildlife recognition and sustainability app that turns everyday choices into measurable carbon savings.',
    image: unsplash('photo-1592670130429-fa412d400f50', 1600, 2000),
    metrics: [
      { value: '5,000+', label: 'Users in 3 months' },
      { value: '95%+', label: 'Recognition accuracy, 200+ species' },
      { value: '1M+', label: 'Sustainability events a month' },
      { value: '2,000 t', label: 'CO₂e savings projected yearly' },
    ],
    points: [
      'Led a 7-member team building a wildlife recognition module with 95%+ accuracy across 200+ species.',
      'Onboarded 5,000+ users in 3 months, driving an average 8% carbon-emission reduction per user.',
      'Real-time analytics tracking 1M+ sustainability events a month, with a 30% engagement boost.',
    ],
  },
  {
    slug: 'horizon-labs-ipro',
    title: 'Horizon Labs: IPRO',
    kicker: 'International Physics Research Olympiad',
    category: 'Nonprofit',
    role: 'Director of Operations',
    period: 'Aug 2024 – Dec 2025',
    where: '501(c)(3) nonprofit · USA / Mexico / Canada',
    summary:
      'Running a multi-stage physics and neuroscience competition across three countries, from judging to IRS compliance.',
    image: unsplash('photo-1781330201986-005653f25a3f', 1600, 2000),
    metrics: [
      { value: '3', label: 'Countries' },
      { value: '2', label: 'Disciplines: physics & neuroscience' },
      { value: '3', label: 'Winning nations: Singapore, USA, Bangladesh' },
    ],
    points: [
      'Executed IPRO 2025, a multi-stage physics and neuroscience competition across 3 countries, with winners from Singapore, the USA and Bangladesh.',
      'Managed judging, mentorship and volunteer coordination.',
      'Established IRS compliance, financial systems and conflict-of-interest policies.',
    ],
  },
  {
    slug: 'smart-hydration-bracelet',
    title: 'Smart Hydration Bracelet',
    kicker: 'Wearable R&D',
    category: 'Hardware',
    role: 'R&D Intern',
    period: 'Apr – May 2024',
    with: 'New York Academy of Sciences',
    summary: 'A bioimpedance-sensor bracelet that estimates hydration, prototyped and field-tested with varsity athletes.',
    image: unsplash('photo-1508685096489-7aacd43bd3b1', 1600, 2000),
    metrics: [
      { value: '±5%', label: 'Hydration accuracy' },
      { value: '15', label: 'Varsity athletes in field tests' },
      { value: '−20%', label: 'Device weight' },
    ],
    points: [
      'Designed and prototyped a bioimpedance-sensor bracelet achieving ±5% hydration accuracy in field tests with 15 varsity athletes.',
      'Reduced device weight by 20% through iterative ergonomic refinement.',
    ],
  },
];

export const allWork = [...research, ...projects];

export type Role = {
  org: string;
  role: string;
  place: string;
  period: string;
  image: string;
  points: string[];
};

export const roles: Role[] = [
  {
    org: 'Mind Works International',
    role: 'Team Lead, Young Entrepreneurs',
    place: 'Lahore (Hybrid)',
    period: '2023–25',
    image: unsplash('photo-1556761175-5973dc0f32e7', 800, 1000),
    points: [
      'Directed and mentored 20+ emerging entrepreneurs through workshops on market research, financial planning and MVP prototyping aligned with the SDGs.',
      'Managed campaigns reaching 1,500+ students; produced 10+ social posts (2,000+ impressions).',
      'Co-hosted 6+ podcast episodes, driving a 25% increase in listener engagement.',
    ],
  },
  {
    org: 'SkillsGala',
    role: 'Volunteer Coordinator & Talent Hunt Juror',
    place: 'Lahore',
    period: '2024',
    image: unsplash('photo-1761195696518-6384573549ea', 800, 1000),
    points: [
      'Facilitated 15,000+ attendees at a tech expo; cut average check-in time by 30% through volunteer team management.',
      'Judged 50+ Talent Hunt participants and gave a 20-minute talk on emerging freelance market trends (4.8/5 feedback).',
      'Facilitated startup–VC introductions that launched 3 projects.',
    ],
  },
  {
    org: 'Tajarba.pk',
    role: 'Career Coach & Soft-Skills Facilitator',
    place: 'Lahore',
    period: '2024',
    image: unsplash('photo-1573497620053-ea5300f94f21', 800, 1000),
    points: [
      'Ran 10+ workshops and 25+ one-on-one coaching sessions for cohorts of 35+.',
      '80% of mentees secured roles or promotions within 3 months; 4.7/5 satisfaction.',
    ],
  },
  {
    org: 'Your Big Year®',
    role: 'Intern & App Evaluator',
    place: 'Remote',
    period: '2024',
    image: unsplash('photo-1758270704663-9d002a4b42a2', 800, 1000),
    points: [
      'Ranked 15th of 500+ global applicants for the Global Citizens Challenge.',
      'Evaluated 6 prototype educational apps alongside a Microsoft International Intern, shortlisting the top 3 for pilots.',
    ],
  },
  {
    org: 'American Income Life',
    role: 'Appointment Setter',
    place: 'Remote, North America',
    period: '2025–26',
    image: unsplash('photo-1553775282-20af80779df7', 800, 1000),
    points: [
      'Managed high-volume appointment scheduling across multiple time zones, driving qualified lead generation and client acquisition.',
    ],
  },
  {
    org: 'Seraphic',
    role: 'Head of Content, mental-health organisation (India)',
    place: 'Remote',
    period: '2023–25',
    image: unsplash('photo-1620147461831-a97b99ade1d3', 800, 1000),
    points: [
      'Led the publications department, producing research-backed content to de-stigmatise mental health among young people across South Asia.',
    ],
  },
];

export const fellowships = [
  { name: 'GCI World 2026 (September)', meta: 'Matsuo-Iwasawa Lab · UTokyo' },
  { name: 'Civics Unplugged', meta: '20% acceptance' },
  { name: 'The Knowledge Society', meta: '10% acceptance · $4.2K aid' },
  { name: 'Harvard Youth Leadership Conference', meta: '15% acceptance' },
  { name: 'Oxbridge Summer Programme', meta: '15% acceptance' },
  { name: 'Yale Young Global Scholars', meta: 'Scholar' },
  { name: 'Yale Daily News Symposium', meta: 'Participant' },
];

export const competitions = [
  { name: 'PhysicsBrawl Online', meta: 'Top 10% globally · #1 team in Pakistan' },
  { name: 'ICC Physics & Astronomy Olympiad', meta: 'Bronze · 30th of 700' },
  { name: 'IPhO National Camp Qualifiers', meta: '39th of 4,000+ (NSTC)' },
  { name: 'International Research Olympiad', meta: 'Distinguished Research Award' },
  { name: 'IKLC English Competition', meta: '21st of 31,000 · 3-Star' },
  { name: 'Inter-School Parliamentary Debates', meta: '1st place, LHR/KHI/ISB circuit' },
];

export const courses = [
  { name: 'Next-Generation Telecom Infrastructure & Emerging Technologies', meta: 'CelcomDigi · May 2026' },
  { name: 'Enterprise Technology Solutions & UX/UI Development', meta: 'Agmo Holdings Berhad · Apr 2026' },
  { name: 'AI in Public Transport & Smart Ticketing with C++', meta: 'NSS IT Solution · Mar 2026' },
  { name: 'Civics Unplugged Fellowship', meta: 'Spring 2024' },
  { name: 'Physics2Astrophysics', meta: 'Aryan Gupta, Stanford University' },
];

export type Service = {
  title: string;
  short: string;
  description: string;
  includes: string[];
  proof: string;
};

export const services: Service[] = [
  {
    title: 'Project Management',
    short: 'Plans that survive contact with people.',
    description:
      'Scoping, scheduling and running projects end to end: volunteer teams, multi-country competitions, events for thousands.',
    includes: ['Roadmaps & timelines', 'Volunteer & team coordination', 'Operations, compliance & policy', 'Event planning & run-of-show'],
    proof: 'IPRO across 3 countries · 15,000+ attendee expo',
  },
  {
    title: 'Personal Assistant',
    short: 'Your calendar, handled.',
    description:
      'Reliable, detail-first support across time zones: scheduling, inbox triage, research and document prep.',
    includes: ['Calendar & appointment setting', 'Inbox & follow-ups', 'Research briefs & documents', 'Travel & event logistics'],
    proof: 'High-volume scheduling across North American time zones',
  },
  {
    title: 'University Training',
    short: 'Apply, enrich, research, build.',
    description:
      'One-to-one guidance from profile to offer: extracurricular strategy, research projects, essays and university selection.',
    includes: ['Profile, resume & narrative', 'EC & research project planning', 'SAT / A-Level prep support', 'Shortlisting & applications'],
    proof: 'Invicta Counselling mentor · Harvard, Yale & Oxbridge programmes',
  },
  {
    title: 'Public Speaking',
    short: 'MUN, debate and the mic.',
    description:
      'Coaching for delegates, debaters and presenters, from first speech to Best Delegate, plus MC and hosting.',
    includes: ['MUN delegate training', 'Parliamentary debate coaching', 'MC & event hosting', 'Talks & pitch delivery'],
    proof: '250+ mentored · 7 BDs, 10 ODs & 2 Best Delegations',
  },
];

export const skillGroups = [
  {
    name: 'Research & Technical',
    tags: ['Quantum mechanics', 'Geant4 Monte Carlo', 'WENDI detectors', 'Bioimpedance sensors', 'Arduino', 'LaTeX', 'Scientific writing'],
  },
  {
    name: 'Leadership & Operations',
    tags: ['Strategic planning', 'Volunteer mentorship', 'Workshop facilitation', 'Event planning', 'Jury coordination', 'Nonprofit management'],
  },
  {
    name: 'Software & Development',
    tags: ['Python', 'C++', 'HTML/CSS', 'Figma', 'GitHub', 'MATLAB', 'Mobile apps'],
  },
  {
    name: 'Communication',
    tags: ['Public speaking', 'Podcast hosting', 'MC / hosting', 'Grant proposals', 'Peer review', 'Social media'],
  },
];
