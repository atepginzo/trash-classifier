import { motion } from 'framer-motion';
import { School, BookOpen, Users } from 'lucide-react';

/* Social Icons */
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

/* ============================================================
   TEAM DATA
   ============================================================ */
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
      instagram: 'https://www.instagram.com/imamrzky.s?igsh=MTk0ZDk1a2RoZWJlNQ%3D%3D&utm_source=qr',
    },
    {
      name: 'Atep Solihin',
      id: 'CFCC554D6Y0350',
      university: 'Universitas Bale Bandung',
      major: 'Teknik Informatika',
      photo: '/team/atep.jpg',
      quote: 'Teknologi terbaik adalah teknologi yang tidak hanya memecahkan masalah hari ini, tetapi juga menjaga warisan esok hari.',
      linkedin: 'https://www.linkedin.com/in/atep-solihin-39129b291?utm_source=share_via&utm_content=profile&utm_medium=member_android',
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

/* Role badge colors */
const ROLE_COLORS = {
  'Full-Stack Web Developer': 'border-forest bg-forest/5 text-forest',
  'Data Scientist': 'border-terracotta bg-terracotta/5 text-terracotta',
  'AI Engineer': 'border-[#7C3AED] bg-[#7C3AED]/5 text-[#5B21B6]',
};

/* Initials helper (for placeholder avatar) */
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/* Avatar gradients for members with no photos */
const AVATAR_GRADIENTS = {
  'Full-Stack Web Developer': 'from-forest to-forest-light',
  'Data Scientist': 'from-terracotta to-terracotta-light',
  'AI Engineer': 'from-[#5B21B6] to-[#7C3AED]',
};

/* Single member card */
function MemberCard({ member, role, index }) {
  const badgeStyle = ROLE_COLORS[role] || 'border-sage bg-sage/10 text-body';
  const avatarGradient = AVATAR_GRADIENTS[role] || 'from-sage to-sage-light';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      style={{
        borderRadius: 24,
        backgroundColor: '#ffffff',
        border: '1px solid rgba(168, 184, 156, 0.2)',
      }}
      className="p-6 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(45,80,22,0.1)] transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        {/* Photo Container */}
        <div
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            aspectRatio: '1 / 1',
            width: '100%',
          }}
          className="relative mb-5 bg-gradient-to-br from-cream-light to-sage-light/20"
        >
          {member.photo ? (
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-full object-cover object-center transform hover:scale-103 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${avatarGradient} flex items-center justify-center shadow-md`}>
                <span className="text-white text-2xl sm:text-3xl font-serif font-bold tracking-tight">
                  {getInitials(member.name)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Member Identity */}
        <div className="text-left">
          <h3 style={{ color: '#0F1A0A' }} className="text-xl font-bold tracking-tight mb-1">
            {member.name}
          </h3>
          <p style={{ color: '#6B7160' }} className="text-[11px] font-mono mb-4 uppercase tracking-wider">
            ID: {member.id}
          </p>

          {/* Role Pill Badge */}
          <div className="mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${badgeStyle}`}>
              {role}
            </span>
          </div>

          {/* Academic Info Rows */}
          <div className="space-y-2 border-t border-sage/10 pt-4 mb-4">
            <div className="flex items-center gap-2.5">
              <School size={15} style={{ color: '#2D5016', flexShrink: 0 }} />
              <span style={{ color: '#3A3D35' }} className="text-xs font-semibold leading-tight">
                {member.university}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <BookOpen size={15} style={{ color: '#6B7160', flexShrink: 0 }} />
              <span style={{ color: '#6B7160' }} className="text-xs font-medium leading-tight">
                {member.major}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div>
        {/* Classy Quote Block */}
        <div className="border-t border-dashed border-sage/20 pt-4 mt-2">
          <p
            style={{
              color: '#3A3D35',
              borderLeft: '3px solid #2D5016',
            }}
            className="pl-3.5 text-xs font-serif italic leading-relaxed text-left opacity-90"
          >
            &ldquo;{member.quote}&rdquo;
          </p>
        </div>

        {/* Social Icons row */}
        <div className="flex items-center gap-2.5 mt-5 pt-3 border-t border-sage/10">
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
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: '1px solid rgba(168,184,156,0.3)',
                backgroundColor: '#FAFAF7',
                color: '#6B7160',
              }}
              className="flex items-center justify-center hover:bg-forest hover:text-white hover:border-forest transition-all duration-300"
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function TeamSection() {
  const groups = Object.entries(TEAM_MEMBERS);

  return (
    <section id="tim" className="relative py-20 sm:py-28 lg:py-32 bg-cream overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-sage/30 to-transparent" />

      {/* Abstract background blobs for premium aesthetic */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-sage/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-terracotta/5 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======== Section Header ======== */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full mb-4
                          bg-forest/8 border border-forest/15
                          text-forest text-xs sm:text-sm font-semibold tracking-wide">
            <Users size={14} />
            Tim Pengembang
          </span>
          <h2
            style={{ fontFamily: 'var(--font-serif)', color: '#0F1A0A' }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight mb-3"
          >
            Profil Anggota Team
          </h2>
          <p style={{ color: '#6B7160' }} className="text-base sm:text-lg max-w-lg mx-auto font-medium">
            Coding Camp DBS Foundation 2026 &middot; CC26-PSU179
          </p>
        </motion.div>

        {/* ======== Team Role-Based Containers ======== */}
        <div className="space-y-20">
          {groups.map(([role, members], groupIdx) => (
            <div
              key={role}
              style={{
                borderRadius: 32,
                backgroundColor: '#FAFAF7',
                border: '1px solid rgba(168, 184, 156, 0.15)',
              }}
              className="p-8 sm:p-10 lg:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
            >
              {/* Group Pill Header */}
              <div className="flex justify-center mb-10">
                <span className={`inline-flex items-center px-5 py-2.5 rounded-full border-2 text-xs font-bold uppercase tracking-wider
                                ${role === 'Full-Stack Web Developer'
                                  ? 'border-forest/40 bg-forest/8 text-forest'
                                  : role === 'Data Scientist'
                                    ? 'border-terracotta/40 bg-terracotta/8 text-terracotta'
                                    : 'border-[#7C3AED]/40 bg-[#7C3AED]/8 text-[#5B21B6]'
                                }`}>
                  Team {role}
                </span>
              </div>

              {/* Members Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
      </div>
    </section>
  );
}
