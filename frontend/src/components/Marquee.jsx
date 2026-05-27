const CATEGORIES = [
  'Organik',
  'Plastik', 
  'Kertas',
  'Logam',
  'Kaca',
  'B3',
  'Tekstil',
  'Elektronik',
  'Daun Kering',
  'Sisa Makanan',
  'Botol Plastik',
  'Kaleng Bekas',
  'Baterai Bekas',
  'Kardus',
  'Kabel Rusak',
  'Pecahan Kaca',
];

export default function Marquee() {
  return (
    <section className="relative w-full overflow-hidden py-5 sm:py-6 border-y border-slate-200 dark:border-white/5 bg-white dark:bg-black transition-colors duration-300">
      {/* fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent dark:from-black dark:to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent dark:from-black dark:to-transparent z-10 pointer-events-none" />

      {/* Continuous scrolling marquee - truly infinite */}
      <div className="flex gap-4 animate-marquee-live">
        {/* Repeat 3 times for seamless infinite scroll */}
        {[...Array(3)].map((_, setIndex) => (
          <div key={setIndex} className="flex items-center gap-4 shrink-0">
            {CATEGORIES.map((label, i) => (
              <span
                key={`${setIndex}-${i}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold 
                           bg-slate-100 dark:bg-[#111111] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 whitespace-nowrap transition-colors duration-300"
              >
                {label}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
