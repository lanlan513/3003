import { MapPin, Star, Sparkles, ArrowRight } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import SealLabel from '@/components/common/SealLabel';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { regionsData } from '@/data/regions';
import type { Region, DetailData } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

export default function RegionsSection({ onOpenDetail }: Props) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);

  const handleClick = (region: Region) => {
    onOpenDetail({
      type: 'region',
      id: region.id,
      title: region.name,
      subtitle: `${region.era} · ${region.location}`,
      description: region.description,
      sections: [
        { title: '工艺特征', content: region.features },
        { title: '扬名之处', content: region.famousFor },
        { title: '代表作品', content: region.masterpieces.map(m => `${m.name}——${m.desc}`) },
      ],
      color: region.color,
      bgColor: region.bgColor,
      imagePrompt: region.imagePrompt,
    });
  };

  return (
    <section id="regions" className="section-padding bg-porcelain-paper relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-porcelain-scroll/60 to-transparent pointer-events-none" />
      <div className="cloud-divider opacity-40 absolute top-0 left-0 right-0" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <SectionTitle
          tag="KILNS · 贰"
          title="主要产地"
          subtitle="宋代五大名窑与景德镇、龙泉、越窑等名窑系，各具特色，共谱中华瓷史华章"
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
            {regionsData.map((region, idx) => (
              <article
                key={region.id}
                onClick={() => handleClick(region)}
                className={`group relative porcelain-card p-0 overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-porcelain-lg stagger-${Math.min(idx + 1, 8)} ${
                  isVisible ? 'animate-fade-in-up' : ''
                }`}
              >
                <div
                  className="relative h-36 md:h-40 overflow-hidden transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ backgroundColor: region.bgColor }}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage: `radial-gradient(circle at 30% 40%, ${region.color}50 0%, transparent 50%), radial-gradient(circle at 70% 60%, ${region.color}30 0%, transparent 50%)`,
                    }}
                  />

                  <svg
                    className="absolute right-4 top-4 w-20 h-20 md:w-24 md:h-24 opacity-50 transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
                    viewBox="0 0 100 140"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M30 15 Q25 30 27 45 Q29 55 20 62 Q8 72 8 90 Q8 115 35 122 Q65 130 82 122 Q95 115 95 98 Q95 78 85 68 Q75 60 80 50 Q83 38 75 22 Q72 15 72 15 L30 15 Z"
                      stroke={region.color}
                      strokeWidth="2.5"
                      fill={`${region.color}15`}
                    />
                    <path d="M25 78 Q50 68 78 80" stroke={region.color} strokeWidth="1.2" fill="none" opacity="0.6"/>
                    <path d="M22 96 Q50 88 80 98" stroke={region.color} strokeWidth="1" fill="none" opacity="0.4"/>
                    <circle cx="45" cy="102" r="2" fill={region.color} opacity="0.5"/>
                    <circle cx="62" cy="108" r="1.5" fill={region.color} opacity="0.4"/>
                  </svg>

                  <div className="absolute top-4 left-4">
                    <div
                      className="w-12 h-12 md:w-14 md:h-14 rounded-xl shadow-lg flex items-center justify-center font-serif text-xl md:text-2xl font-bold text-white"
                      style={{
                        backgroundColor: region.color,
                        fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif',
                      }}
                    >
                      {region.shortName}
                    </div>
                  </div>

                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                    <div className="text-xs" style={{ color: region.color }}>
                      <span className="font-bold">{region.era}</span>
                    </div>
                    <SealLabel text={region.shortName} size="sm" />
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3
                        className="font-serif text-xl font-bold text-porcelain-inkbrown"
                        style={{ fontFamily: '"Noto Serif SC", serif' }}
                      >
                        {region.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-porcelain-inkbrown/55 mt-0.5">
                        <MapPin size={11} strokeWidth={2} />
                        <span>{region.location}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm font-medium mb-3" style={{ color: region.color }}>
                    {region.specialty}
                  </p>

                  <p className="text-sm text-porcelain-inkbrown/70 leading-relaxed mb-4 line-clamp-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    {region.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {region.famousFor.slice(0, 2).map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px]"
                        style={{ backgroundColor: `${region.color}15`, color: region.color }}
                      >
                        <Sparkles size={10} strokeWidth={2} />
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-porcelain-crackle/30">
                    <div className="flex items-center gap-1">
                      <Star size={12} fill="#C9A962" stroke="#C9A962" />
                      <Star size={12} fill="#C9A962" stroke="#C9A962" />
                      <Star size={12} fill="#C9A962" stroke="#C9A962" />
                      <Star size={12} fill="#C9A962" stroke="#C9A962" />
                      <Star size={12} fill="#C9A962" stroke="#C9A962" />
                    </div>
                    <button
                      className="flex items-center gap-1 text-xs font-medium transition-all"
                      style={{ color: region.color }}
                    >
                      <span className="group-hover:underline">详情</span>
                      <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
