import { motion } from 'framer-motion';

/* ============================================================
   TEAM DATA — Edit foto di sini setelah file disiapkan
   Taruh file foto di: public/team/nama.jpg
   ============================================================ */
const TEAM_MEMBERS = {
  'Full-Stack Web Developer': [
    {
      name: 'Imam Rizki Saputra',
      id: 'CFCC554D6Y1710',
      photo: null, // Ganti: '/team/imam.jpg'
      linkedin: '#',
      github: '#',
      instagram: '#',
    },
    {
      name: 'Atep Solihin',
      id: 'CFCC554D6Y0350',
      status: 'Aktif',
      photo: null, // Ganti: '/team/atep.jpg'
      linkedin: '#',
      github: '#',
      instagram: '#',
    },
  ],
  'Data Scientist': [
    {
      name: 'Fadhila Latsa Tsabita',
      id: 'CDCC011D6X2244',
      status: 'Aktif',
      photo: null, // Ganti: '/team/fadhila.jpg'
      linkedin: '#',
      github: '#',
      instagram: '#',
    },
    {
      name: 'Azmi Naifah Iftinah',
      id: 'CDCC011D6X2286',
      status: 'Aktif',
      photo: null, // Ganti: '/team/azmi.jpg'
      linkedin: '#',
      github: '#',
      instagram: '#',
    },
  ],
  'AI Engineer': [
    {
      name: 'Devin Suryadi',
      id: 'CACC011D6Y0941',
      status: 'Aktif',
      photo: null, // Ganti: '/team/devin.jpg'
      linkedin: '#',
      github: '#',
      instagram: '#',
    },
    {
      name: 'Darma Al Gani',
      id: 'CACC012D6Y0805',
      photo: null, // Ganti: '/team/darma.jpg'
      linkedin: '#',
      github: '#',
      instagram: '#',
    },
  ],
};

/* Role badge colors */
const ROLE_COLORS = {
  'Full-Stack Web Developer': { bg: 'bg-forest', text: 'text-white' },
  'Data Scientist': { bg: 'bg-terracotta', text: 'text-white' },
  'AI Engineer': { bg: 'bg-[#5B21B6]', text: 'text-white' },
};

/* Social Icons */
const LinkedInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);
const GitHubIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
);

/* Initials helper (for placeholder avatar) */
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/* Avatar gradient colors per role */
const AVATAR_GRADIENTS = {
  'Full-Stack Web Developer': 'from-forest to-forest-light',
  'Data Scientist': 'from-terracotta to-terracotta-light',
  'AI Engineer': 'from-[#5B21B6] to-[#7C3AED]',
};

/* Single member card */
function MemberCard({ member, role, index }) {
  const roleColor = ROLE_COLORS[role];
  const avatarGradient = AVATAR_GRADIENTS[role];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group bg-white border border-sage/20 rounded-2xl overflow-hidden
                 shadow-[0_2px_16px_rgba(0,0,0,0.04)]
                 hover:shadow-[0_16px_48px_rgba(45,80,22,0.12)]
                 transition-shadow duration-400"
    >
      <div className="relative h-56 sm:h-64 overflow-hidden bg-gradient-to-br from-cream-light to-sage-light/30">
        {member.photo ? (
          <img
            src={member.photo}
            alt={member.name}
            className="w-full h-full object-cover object-center
                       group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          /* Placeholder avatar with initials */
          <div className="w-full h-full flex items-center justify-center">
            <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${avatarGradient}
                            flex items-center justify-center shadow-lg
                            group-hover:scale-110 transition-transform duration-300`}>
              <span className="text-white text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                {getInitials(member.name)}
              </span>
            </div>
          </div>
        )}
        {member.status && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
                            bg-white/90 backdrop-blur-sm border border-sage/20
                            text-xs font-semibold text-forest">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              {member.status}
            </span>
          </div>
        )}
      </div>
      <div className="px-5 pt-5 pb-4">
        <h3 className="text-lg font-bold text-heading tracking-tight mb-0.5">
          {member.name}
        </h3>
        <p className="text-xs text-muted font-mono mb-3">
          ID: {member.id}
        </p>
        <span className={`inline-flex items-center px-3 py-1 rounded-full
                         text-xs font-semibold ${roleColor.bg} ${roleColor.text}`}>
          {role}
        </span>
      </div>
      <div className="px-5 pb-5 pt-2 flex items-center gap-2 border-t border-sage/10 mt-1">
        {[
          { href: member.linkedin, Icon: LinkedInIcon, label: 'LinkedIn' },
          { href: member.github, Icon: GitHubIcon, label: 'GitHub' },
          { href: member.instagram, Icon: InstagramIcon, label: 'Instagram' },
        ].map(({ href, Icon, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-8 h-8 rounded-full bg-cream-light border border-sage/15
                       flex items-center justify-center text-muted
                       hover:bg-forest hover:text-white hover:border-forest
                       transition-all duration-300"
          >
            <Icon />
          </a>
        ))}
      </div>
    </motion.div>
  );
}



export default function TeamSection() {
  const paths = Object.entries(TEAM_MEMBERS);

  return (
    <section id="tim" className="relative py-20 sm:py-28 lg:py-32 bg-cream-light overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======== Section Header ======== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-6"
        >
          <span className="inline-flex items-center px-4 py-1.5 rounded-full mb-5
                          bg-forest/8 border border-forest/15
                          text-forest text-xs sm:text-sm font-semibold tracking-wide">
            Tim Kami
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold
                         text-heading leading-[1.15] tracking-tight mb-3">
            Profil Anggota Team
          </h2>
          <p className="text-muted text-base sm:text-lg max-w-lg mx-auto">
            Coding Camp DBS Foundation 2026
          </p>
        </motion.div>

        {/* ======== Group ID Badge ======== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-14 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                         bg-heading text-white text-sm font-mono font-medium
                         shadow-lg shadow-heading/20">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="14" height="12" rx="2" />
              <path d="M7 4V2M13 4V2M3 9h14" />
            </svg>
            Group ID: CC26-PSU179
          </div>
        </motion.div>

        {/* ======== Team Groups ======== */}
        {paths.map(([role, members], groupIdx) => (
          <div key={role} className={groupIdx < paths.length - 1 ? 'mb-16 sm:mb-20' : ''}>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-8 sm:mb-10"
            >
              <span className={`inline-flex items-center px-5 py-2 rounded-full
                              border-2 text-sm font-bold tracking-wide
                              ${role === 'Full-Stack Web Developer'
                                ? 'border-forest/30 text-forest bg-forest/5'
                                : role === 'Data Scientist'
                                  ? 'border-terracotta/30 text-terracotta bg-terracotta/5'
                                  : 'border-[#7C3AED]/30 text-[#5B21B6] bg-[#7C3AED]/5'
                              }`}>
                Team {role}
              </span>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
              {members.map((member, i) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  role={role}
                  index={i + groupIdx * 2}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
