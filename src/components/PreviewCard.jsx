import { motion } from 'framer-motion';

const IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=700&h=500&fit=crop',
    alt: 'Tempat sampah pemilahan modern berwarna-warni',
  },
  {
    src: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?w=500&h=300&fit=crop',
    alt: 'Petugas mendaur ulang sampah di fasilitas hijau',
  },
  {
    src: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=500&h=300&fit=crop',
    alt: 'Lingkungan hijau bersih dan asri',
  },
];

export default function PreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: -1.5 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotate: 0, y: -8, scale: 1.02 }}
      className="relative w-full max-w-md mx-auto lg:max-w-lg cursor-pointer"
    >
      <div
        className="relative overflow-hidden rounded-2xl lg:rounded-3xl
                    bg-white border border-slate-200/60
                    shadow-[0_20px_60px_rgba(0,0,0,0.1)]"
      >
        {/* Photo Grid */}
        <div className="grid grid-rows-[1fr_auto] h-full">
          {/* Main image — bigger */}
          <div className="relative overflow-hidden">
            <img
              src={IMAGES[0].src}
              alt={IMAGES[0].alt}
              loading="lazy"
              className="w-full h-[260px] sm:h-[320px] lg:h-[360px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" />
          </div>

          {/* Bottom two images */}
          <div className="grid grid-cols-2 gap-[2px] bg-slate-100">
            {IMAGES.slice(1).map((img, i) => (
              <div key={i} className="relative overflow-hidden">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-[100px] sm:h-[120px] object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
