const CATEGORIES = [
  'Organik', 'Plastik', 'Kertas', 'Logam',
  'Kaca', 'B3', 'Tekstil', 'Elektronik',
];

const MarqueeItems = () => (
  <>
    {CATEGORIES.map((label, i) => (
      <span key={i} className="flex items-center gap-0 shrink-0 mx-3">
        <span className="text-sm font-semibold text-emerald-800/70 whitespace-nowrap tracking-wider uppercase px-5 py-2 rounded-full bg-emerald-50/40 border border-emerald-100/60 backdrop-blur-sm">
          {label}
        </span>
      </span>
    ))}
  </>
);

export default function Marquee() {
  return (
    <section className="relative w-full overflow-hidden py-6 border-y border-emerald-50 bg-white/40 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-[#F8FAFC]/90 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-[#F8FAFC]/90 to-transparent z-10 pointer-events-none" />
      <div className="flex items-center animate-marquee w-max">
        <MarqueeItems />
        <MarqueeItems />
        <MarqueeItems />
        <MarqueeItems />
      </div>
    </section>
  );
}
