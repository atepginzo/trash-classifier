const CATEGORIES = [
  'Organik', 'Plastik', 'Kertas', 'Logam',
  'Kaca', 'B3', 'Tekstil', 'Elektronik',
];

const MarqueeItems = () => (
  <>
    {CATEGORIES.map((label, i) => (
      <span key={i} className="flex items-center gap-0 shrink-0">
        <span className="text-sm sm:text-base font-medium text-slate-400 whitespace-nowrap tracking-wide">
          {label}
        </span>
        <span className="text-emerald-300 mx-4 sm:mx-6 text-lg">·</span>
      </span>
    ))}
  </>
);

export default function Marquee() {
  return (
    <section className="relative w-full overflow-hidden py-5 sm:py-6 border-y border-slate-100 bg-white/50">
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10 pointer-events-none" />
      <div className="flex items-center animate-marquee w-max">
        <MarqueeItems />
        <MarqueeItems />
        <MarqueeItems />
        <MarqueeItems />
      </div>
    </section>
  );
}
