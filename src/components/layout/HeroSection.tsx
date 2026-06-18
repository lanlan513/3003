import { ChevronDown, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const handleScroll = () => {
    const el = document.getElementById('history');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="top"
      className="relative min-h-screen flex items-center justify-center overflow-hidden crackle-bg bg-gradient-ji-blue"
    >
      <div className="absolute inset-0 opacity-30">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="porcelain-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M50 0 Q50 50 0 50 Q50 50 50 100 Q50 50 100 50 Q50 50 50 0" fill="none" stroke="#C9A962" strokeWidth="0.5" opacity="0.3"/>
              <circle cx="50" cy="50" r="1.5" fill="#C9A962" opacity="0.4"/>
              <path d="M150 100 Q150 150 100 150 Q150 150 150 200 Q150 150 200 150 Q150 150 150 100" fill="none" stroke="#C9A962" strokeWidth="0.5" opacity="0.3"/>
              <circle cx="150" cy="150" r="1.5" fill="#C9A962" opacity="0.4"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#porcelain-pattern)"/>
        </svg>
      </div>

      <div className="absolute top-10 left-10 w-40 h-40 md:w-64 md:h-64 rounded-full bg-porcelain-youlihong/10 blur-3xl animate-float" />
      <div className="absolute bottom-10 right-10 w-52 h-52 md:w-80 md:h-80 rounded-full bg-porcelain-gold/10 blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-porcelain-celadon/10 blur-2xl animate-float" style={{ animationDelay: '4s' }} />

      <div className="relative z-10 container mx-auto px-4 md:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="opacity-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-porcelain-gold/30 bg-porcelain-gold/10 text-porcelain-gold mb-8">
              <Sparkles size={14} strokeWidth={2} />
              <span className="text-sm tracking-[0.3em] font-medium">中华陶瓷五千年</span>
            </div>
          </div>

          <div className="relative">
            <h1
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-porcelain-paper mb-6 opacity-0 animate-fade-in-up tracking-wider"
              style={{
                fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif',
                animationDelay: '0.5s',
                textShadow: '0 2px 40px rgba(201, 169, 98, 0.3)',
              }}
            >
              瓷韵堂
            </h1>

            <div className="cloud-divider opacity-0 animate-fade-in my-6" style={{ animationDelay: '0.9s' }} />

            <p
              className="font-serif text-xl md:text-2xl lg:text-3xl text-porcelain-paper/90 mb-4 opacity-0 animate-fade-in-up tracking-widest"
              style={{ fontFamily: '"Noto Serif SC", serif', animationDelay: '0.7s' }}
            >
              探索中华陶瓷文明的瑰丽长河
            </p>
            <p
              className="text-base md:text-lg text-porcelain-paper/70 mb-2 opacity-0 animate-fade-in-up max-w-2xl mx-auto leading-relaxed"
              style={{ animationDelay: '0.9s' }}
            >
              从仰韶彩陶的质朴，到宋瓷的典雅；从元青花的雄浑，到明清彩瓷的华美
            </p>
            <p
              className="text-base md:text-lg text-porcelain-paper/70 mb-12 opacity-0 animate-fade-in-up max-w-2xl mx-auto leading-relaxed"
              style={{ animationDelay: '1.1s' }}
            >
              一器之成，凝聚千年匠人心血；方寸之间，尽显东方美学精髓
            </p>
          </div>

          <div className="opacity-0 animate-fade-in-up flex flex-wrap justify-center gap-4 md:gap-8 mb-16" style={{ animationDelay: '1.3s' }}>
            {[
              { label: '发展历史', desc: '9个历史时期', color: 'bg-porcelain-gold/20 text-porcelain-gold border-porcelain-gold/30' },
              { label: '名窑产地', desc: '8大窑系名品', color: 'bg-porcelain-youlihong/20 text-porcelain-youlihong border-porcelain-youlihong/30' },
              { label: '器型图谱', desc: '10种经典器型', color: 'bg-porcelain-celadon/20 text-porcelain-celadon border-porcelain-celadon/30' },
              { label: '烧制工艺', desc: '9道工序 + 8色釉彩', color: 'bg-porcelain-glaze/20 text-porcelain-glaze border-porcelain-glaze/30' },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`px-5 py-3 rounded-lg backdrop-blur-sm border hover:scale-105 transition-transform duration-300 cursor-default ${item.color}`}
              >
                <div className="font-serif font-bold text-base md:text-lg" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                  {item.label}
                </div>
                <div className="text-xs opacity-75 mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>

          <button
            onClick={handleScroll}
            className="group opacity-0 animate-fade-in-up inline-flex flex-col items-center text-porcelain-paper/80 hover:text-porcelain-gold transition-colors"
            style={{ animationDelay: '1.5s' }}
          >
            <span className="text-sm tracking-widest mb-2 font-medium">向下探索</span>
            <span className="p-2 rounded-full border border-porcelain-paper/30 group-hover:border-porcelain-gold group-hover:animate-glow-pulse transition-all">
              <ChevronDown size={24} strokeWidth={1.5} className="animate-bounce" />
            </span>
          </button>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 bottom-20 md:bottom-28 opacity-20 animate-float pointer-events-none" aria-hidden="true">
        <svg width="180" height="260" viewBox="0 0 180 260" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M60 10 C60 10, 50 25, 50 45 C50 65, 55 75, 45 85 C30 100, 15 115, 15 145 C15 185, 40 220, 90 220 C140 220, 165 185, 165 145 C165 115, 150 100, 135 85 C125 75, 130 65, 130 45 C130 25, 120 10, 120 10 L60 10 Z"
            stroke="#C9A962"
            strokeWidth="2"
            fill="none"
            className="animate-ink-stroke"
            style={{ strokeDasharray: 1000 }}
          />
          <path
            d="M40 130 Q90 110 140 130"
            stroke="#A83232"
            strokeWidth="1.5"
            fill="none"
            opacity="0.6"
          />
          <path
            d="M30 160 Q90 140 150 160"
            stroke="#2C3E50"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
          <circle cx="70" cy="180" r="4" fill="#C9A962" opacity="0.5"/>
          <circle cx="110" cy="195" r="3" fill="#C9A962" opacity="0.4"/>
          <circle cx="90" cy="170" r="3" fill="#A83232" opacity="0.3"/>
        </svg>
      </div>
    </section>
  );
}
