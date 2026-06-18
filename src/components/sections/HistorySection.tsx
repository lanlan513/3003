import { useRef, useEffect, useState } from 'react';
import { Calendar, Award, ArrowRight } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { historyData } from '@/data/history';
import type { HistoryPeriod, DetailData } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

export default function HistorySection({ onOpenDetail }: Props) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const atStart = scrollLeft <= 0;
      const atEnd = scrollLeft >= scrollWidth - clientWidth - 1;

      if ((e.deltaY > 0 && !atEnd) || (e.deltaY < 0 && !atStart)) {
        const isInView = scrollRef.current.getBoundingClientRect();
        if (isInView.top < window.innerHeight * 0.8 && isInView.bottom > window.innerHeight * 0.2) {
          e.preventDefault();
          scrollRef.current.scrollLeft += e.deltaY;
        }
      }
    };

    const el = scrollRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (el) el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const handleClick = (period: HistoryPeriod) => {
    onOpenDetail({
      type: 'history',
      id: period.id,
      title: `${period.dynasty} · ${period.period}`,
      subtitle: period.year,
      description: period.description,
      sections: [
        { title: '重要成就', content: period.achievements },
        { title: '代表作品', content: period.representative.map(r => `${r.name}：${r.desc}`) },
      ],
      color: period.color,
      bgColor: `${period.color}15`,
      imagePrompt: period.imagePrompt,
    });
  };

  return (
    <section id="history" className="section-padding bg-gradient-porcelain crackle-bg">
      <div className="container mx-auto px-4 md:px-8">
        <SectionTitle
          tag="DEVELOPMENT · 壹"
          title="发展历史"
          subtitle="从新石器时代的彩陶初现，到康乾盛世的登峰造极，九段历程串联起中华陶瓷五千年的文明脉络"
        />

        <div
          ref={ref}
          className={`reveal ${isVisible ? 'is-visible' : ''} relative`}
        >
          <div className="hidden md:flex items-center justify-center gap-2 mb-6 text-sm text-porcelain-inkbrown/50">
            <span>← 左右滑动或滚动鼠标浏览</span>
          </div>

          <div
            ref={scrollRef}
            className="relative overflow-x-auto pb-6 -mx-4 px-4 md:-mx-8 md:px-8 scrollbar-thin"
            style={{ scrollbarWidth: 'thin' }}
          >
            <div className="relative min-w-max pt-8 pb-4">
              <div className="absolute top-[52px] left-0 right-0 h-1 bg-gradient-to-r from-transparent via-porcelain-gold/40 to-transparent" />

              <div className="flex gap-6 md:gap-10 relative z-10 pl-4 pr-4">
                {historyData.map((period, idx) => {
                  const isHovered = hoveredId === period.id;
                  return (
                    <div
                      key={period.id}
                      className="relative flex-shrink-0 w-64 md:w-72 group"
                      onMouseEnter={() => setHoveredId(period.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ animationDelay: `${idx * 0.08}s` }}
                    >
                      <div className="absolute left-1/2 -translate-x-1/2 top-[44px] w-4 h-4 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: period.color,
                          boxShadow: isHovered
                            ? `0 0 0 4px ${period.color}30, 0 0 20px ${period.color}80`
                            : `0 0 0 3px #FAF7F0, 0 0 0 4px ${period.color}50`,
                        }}
                      />

                      <div className="flex justify-center mb-10">
                        <div
                          className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-xs font-bold shadow-md transition-transform duration-300"
                          style={{
                            backgroundColor: period.color,
                            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                          }}
                        >
                          <Calendar size={12} strokeWidth={2} />
                          {period.year.split('—')[0].trim()}
                        </div>
                      </div>

                      <article
                        onClick={() => handleClick(period)}
                        className={`porcelain-card p-5 cursor-pointer transition-all duration-300 ${
                          isHovered ? 'ring-2 scale-[1.02]' : ''
                        }`}
                        style={{
                          borderColor: isHovered ? period.color : undefined,
                          boxShadow: isHovered ? `0 12px 32px ${period.color}25, 0 4px 12px rgba(44,62,80,0.1)` : undefined,
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3
                              className="font-serif text-lg font-bold text-porcelain-inkbrown mb-0.5"
                              style={{ fontFamily: '"Noto Serif SC", serif' }}
                            >
                              {period.dynasty}
                            </h3>
                            <p className="text-xs text-porcelain-inkbrown/60">{period.period}</p>
                          </div>
                          <SealLabel text={period.dynasty.charAt(0)} size="sm" />
                        </div>

                        <div
                          className="w-full h-28 rounded-md mb-4 overflow-hidden flex items-center justify-center text-white text-sm font-serif"
                          style={{ backgroundColor: `${period.color}30` }}
                        >
                          <div className="text-center px-3">
                            <p style={{ color: period.color, fontFamily: '"Noto Serif SC", serif' }} className="text-base font-bold mb-1">
                              {period.summary.split('，')[0]}
                            </p>
                            <p className="text-xs opacity-70" style={{ color: period.color }}>
                              {period.summary.split('，').slice(1).join('，')}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-porcelain-inkbrown/75 leading-relaxed mb-4 line-clamp-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                          {period.description}
                        </p>

                        <div className="space-y-1.5 mb-4">
                          {period.achievements.slice(0, 2).map((a, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-porcelain-inkbrown/65">
                              <Award size={12} strokeWidth={2} className="mt-0.5 flex-shrink-0 text-porcelain-gold" />
                              <span className="line-clamp-1">{a}</span>
                            </div>
                          ))}
                        </div>

                        <button
                          className="flex items-center gap-1 text-sm font-medium transition-colors group/btn"
                          style={{ color: period.color }}
                        >
                          <span>深入了解</span>
                          <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" strokeWidth={2} />
                        </button>
                      </article>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
