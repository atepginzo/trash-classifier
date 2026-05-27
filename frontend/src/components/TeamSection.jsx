import { motion } from 'framer-motion';
import { fadeUp, scaleIn } from '../lib/animations';

/* ── Social Icons ── */
const LinkedInIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GitHubIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

/* ── Team data ── */
const TEAM_MEMBERS = {
  'Full-Stack Web Developer': [
    {
      name: 'Imam Rizki Saputra',
      id: 'CFCC554D6Y1710',
      university: 'Universitas Bale Bandung',
      major: 'Teknik Informatika',
      photo: '/team/imam.jpg',
      quote: 'Menulis kode bukan hanya tentang instruksi komputer, tetapi tentang merancang masa depan bumi yang lebih hijau.',
      linkedin: 'https://www.linkedin.com/in/imam-rizki-saputra-64103b3ab',
      github: 'https://github.com/imamrzkys',
      instagram: 'https://www.instagram.com/imamrzky.s?igsh=MTk0ZDk1a2RoZWJlNQ==&utm_source=qr',
    },
    {
      name: 'Atep Solihin',
      id: 'CFCC554D6Y0350',
      university: 'Universitas Bale Bandung',
      major: 'Teknik Informatika',
      photo: '/team/atep.jpg',
      quote: 'Teknologi terbaik adalah teknologi yang tidak hanya memecahkan masalah hari ini, tetapi juga menjaga warisan esok hari.',
      linkedin: 'https://www.linkedin.com/in/atep-solihin-39129b291',
      github: 'https://github.com/atepginzo',
      instagram: 'https://www.instagram.com/9inzoo?igsh=cWttMDhxMzVlNmk=',
    },
  ],
  'Data Scientist': [
    {
      name: 'Fadhila Latsa Tsabita',
      id: 'CDCC011D6X2244',
      university: 'Universitas Padjadjaran',
      major: 'Teknik Informatika',
      photo: '/team/latsa.jpeg',
      quote: 'Di balik setiap tumpukan sampah, ada data tersembunyi yang siap diubah menjadi keputusan cerdas demi kelestarian alam.',
      linkedin: 'https://www.linkedin.com/in/fadhila-latsa-tsabita',
      github: 'https://github.com/FadhilaLatsaTsabita',
      instagram: 'https://www.instagram.com/latsatza?igsh=am1sZ2R4YXo2NTdn',
    },
    {
      name: 'Azmi Naifah Iftinah',
      id: 'CDCC011D6X2286',
      university: 'Universitas Padjadjaran',
      major: 'Teknik Informatika',
      photo: '/team/azmi.jpeg',
      quote: 'Kecerdasan buatan hanyalah alat. Kepedulian kitalah yang menjadikannya solusi nyata bagi keselamatan lingkungan.',
      linkedin: 'https://www.linkedin.com/in/aifaa18/',
      github: 'https://github.com/aifa18',
      instagram: 'https://www.instagram.com/iftiiinahh18?igsh=YjVhbzRxczZ3a2hr&utm_source=qr',
    },
  ],
  'AI Engineer': [
    {
      name: 'Devin Suryadi',
      id: 'CACC011D6Y0941',
      university: 'Universitas Padjadjaran',
      major: 'Teknik Informatika',
      photo: '/team/devin.jpeg',
      quote: 'Belajar dan berinovasi tanpa henti untuk menciptakan teknologi masa depan yang selaras dengan alam.',
      linkedin: 'https://www.linkedin.com/in/devin-suryadi',
      github: 'https://github.com/DevinSuryadi',
      instagram: 'https://www.instagram.com/bcs.ds?igsh=ZHNpcXJmOXd0Znhy',
    },
    {
      name: 'Darma Al Gani',
      id: 'CACC012D6Y0805',
      university: 'Universitas Telkom',
      major: 'Teknik Informatika',
      photo: '/team/darma.png',
      quote: 'Melatih model AI untuk mendeteksi limbah adalah langkah kecil kami untuk melindungi rumah kita yang paling berharga: Bumi.',
      linkedin: 'https://www.linkedin.com/in/darma-al-gani-556456262/',
      github: 'https://github.com/Daarma-IC',
      instagram: 'https://www.instagram.com/daar_maa?igsh=ZHUwOGxoZWExMGdo',
    },
  ],
};

/* ── Role config ── */
const ROLE_CONFIG = {
  'Full-Stack Web Developer': {
    color: '#059669',
    bg: 'from-emerald-400/10 to-teal-400/5',
    border: 'border-emerald-200/60 dark:border-emerald-900/40',
    badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    dot: 'bg-emerald-500',
  },
  'Data Scientist': {
    color: '#D97706',
    bg: 'from-amber-400/10 to-orange-400/5',
    border: 'border-amber-200/60 dark:border-amber-900/40',
    badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    dot: 'bg-amber-500',
  },
  'AI Engineer': {
    color: '#7C3AED',
    bg: 'from-violet-400/10 to-purple-400/5',
    border: 'border-violet-200/60 dark:border-violet-900/40',
    badge: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800',
    dot: 'bg-violet-500',
  },
};

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
}

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  visible: (i) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
};

/* ── Member Card ── */
function MemberCard({ member, role, index }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG['Full-Stack Web Developer'];

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -10, scale: 1.015 }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      className="group relative bg-white dark:bg-[#111111] rounded-3xl overflow-hidden
                 border border-slate-100 dark:border-white/5
                 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.5)]
                 hover:shadow-[0_20px_48px_rgba(0,0,0,0.13)] dark:hover:shadow-[0_20px_48px_rgba(0,0,0,0.8)]
                 transition-all duration-500 flex flex-col"
    >
      {/* ── Header band + avatar ── */}
      <div className="relative h-24 shrink-0"
        style={{ background: `linear-gradient(135deg, ${cfg.color}22, ${cfg.color}10)` }}>
        {/* Decorative circles */}
        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-20"
          style={{ background: cfg.color }} />
        <div className="absolute -bottom-4 left-8 w-16 h-16 rounded-full opacity-10"
          style={{ background: cfg.color }} />
      </div>

      {/* Avatar — overlaps header band */}
      <div className="relative -mt-14 flex justify-center shrink-0 mb-1 z-10">
        <div
          className="w-28 h-28 rounded-full border-4 border-white shadow-xl overflow-hidden
                      transition-all duration-300"
          style={{
            boxShadow: `0 0 0 0px ${cfg.color}`,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 0 3px ${cfg.color}60, 0 20px 40px rgba(0,0,0,0.15)`; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 0 0px ${cfg.color}`; }}
        >
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover object-center
                         transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold"
              style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}99)` }}>
              {getInitials(member.name)}
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="px-6 pb-6 flex flex-col flex-1 text-center">
        {/* Name & role */}
        <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight mt-1 mb-0.5 transition-colors duration-300">
          {member.name}
        </h3>
        <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 transition-colors duration-300">
          ID: {member.id}
        </p>
        <div className="flex justify-center mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                            text-xs font-semibold border transition-colors duration-300 ${cfg.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {role}
          </span>
        </div>

        {/* University info */}
        <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-white/5 mb-4 text-left transition-colors duration-300">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#059669" strokeWidth="2" strokeLinecap="round" className="shrink-0">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight transition-colors duration-300">{member.university}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" className="shrink-0">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
            <span className="text-xs text-slate-500 dark:text-slate-400 leading-tight transition-colors duration-300">{member.major}</span>
          </div>
        </div>

        {/* Quote */}
        <div className="flex-1 mb-5 text-left">
          <blockquote className="text-sm text-slate-600 dark:text-slate-400 italic leading-relaxed
                                 border-l-2 pl-3 transition-colors duration-300"
            style={{ borderColor: cfg.color }}>
            &ldquo;{member.quote}&rdquo;
          </blockquote>
        </div>

        {/* Social links */}
        <div className="flex items-center justify-center gap-2.5 pt-4 border-t border-slate-100 dark:border-white/5 transition-colors duration-300">
          {[
            { href: member.linkedin, Icon: LinkedInIcon, label: 'LinkedIn' },
            { href: member.github, Icon: GitHubIcon, label: 'GitHub' },
            { href: member.instagram, Icon: InstagramIcon, label: 'Instagram' },
          ].map(({ href, Icon, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.2, rotate: 6 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="w-9 h-9 rounded-full flex items-center justify-center
                         bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400
                         transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.background = cfg.color;
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = cfg.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '';
                e.currentTarget.style.color = '';
                e.currentTarget.style.borderColor = '';
              }}
            >
              <Icon />
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const staggerGroup = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

/* ── Section ── */
export default function TeamSection() {
  const groups = Object.entries(TEAM_MEMBERS);

  return (
    <section id="tim" className="relative py-1 sm:py-2 lg:py-3 bg-[#F8FAFC] dark:bg-black overflow-hidden transition-colors duration-300">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 dark:via-white/5 to-transparent transition-colors duration-300" />
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-emerald-100/30 dark:bg-emerald-900/10 blur-3xl transition-colors duration-300" />
        <div className="absolute bottom-0 -right-32 w-96 h-96 rounded-full bg-violet-100/20 dark:bg-violet-900/10 blur-3xl transition-colors duration-300" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

        {/* ── Header ── */}
        <motion.div
          variants={fadeUp} initial="hidden"
          whileInView="visible" viewport={{ once: true, margin: '-60px' }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5
                           bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-800/30
                           text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-widest uppercase transition-colors duration-300">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
            </svg>
            Tim Pengembang
          </span>
          <h2 className="text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem]
                         font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-[-0.025em] mb-4 transition-colors duration-300">
            Profil Anggota Tim
          </h2>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium transition-colors duration-300">
            Coding Camp DBS Foundation 2026 &middot; CC26-PSU179
          </p>
        </motion.div>

        {/* ── Groups ── */}
        <div className="space-y-20 sm:space-y-24">
          {groups.map(([role, members], gIdx) => {
            const cfg = ROLE_CONFIG[role];
            return (
              <div key={role}>
                {/* Role label */}
                <motion.div
                  variants={fadeUp} initial="hidden"
                  whileInView="visible" viewport={{ once: true, margin: '-40px' }}
                  className="flex items-center gap-4 mb-10"
                >
                  <div className="h-px flex-1 bg-slate-200 dark:bg-white/10 transition-colors duration-300" />
                  <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                                   text-xs font-bold uppercase tracking-widest border transition-colors duration-300 ${cfg.badge}`}>
                    <span className={`w-2 h-2 rounded-full animate-pulse ${cfg.dot}`} />
                    {role}
                  </span>
                  <div className="h-px flex-1 bg-slate-200 dark:bg-white/10 transition-colors duration-300" />
                </motion.div>

                {/* Cards */}
                <motion.div
                  variants={staggerGroup} initial="hidden"
                  whileInView="visible" viewport={{ once: true, margin: '-40px' }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto"
                >
                  {members.map((member, i) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      role={role}
                      index={i + gIdx * 2}
                    />
                  ))}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
