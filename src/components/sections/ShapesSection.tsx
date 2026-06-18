import { useState } from 'react';
import { Info, Layers, ArrowRight } from 'lucide-react';
import SectionTitle from '@/components/common/SectionTitle';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { shapeCategories, shapeItems } from '@/data/shapes';
import type { ShapeItem, DetailData } from '@/types';

interface Props {
  onOpenDetail: (data: DetailData) => void;
}

const categoryIcons: Record<string, string> = {
  cup: 'cup',
  wine: 'wine',
  bowl: 'bowl',
  vase: 'vase',
  scholar: 'scholar',
  incense: 'incense',
};

const SilhouetteSVG = ({ type = 'vase', color = '#8BA888' }: { type?: string; color?: string }) => {
  const paths: Record<string, JSX.Element> = {
    cup: (
      <g>
        <path d="M25 30 Q25 70 50 78 Q75 70 75 30 L25 30 Z M28 25 Q50 15 72 25 Q72 28 50 30 Q28 28 28 25 Z" />
        <path d="M75 40 Q88 42 88 55 Q88 68 75 70" fill="none" strokeWidth="2"/>
        <path d="M35 45 Q50 42 65 45" fill="none" strokeWidth="1" opacity="0.5"/>
      </g>
    ),
    wine: (
      <g>
        <path d="M40 15 L60 15 L58 35 Q78 50 72 78 Q68 95 50 95 Q32 95 28 78 Q22 50 42 35 Z" />
        <path d="M30 55 Q50 50 70 55" fill="none" strokeWidth="1" opacity="0.5"/>
      </g>
    ),
    bowl: (
      <g>
        <path d="M18 40 Q50 42 82 40 Q80 72 50 80 Q20 72 18 40 Z M20 35 Q50 30 80 35" fill="none" strokeWidth="2"/>
        <path d="M30 55 Q50 52 70 55" fill="none" strokeWidth="1" opacity="0.5"/>
      </g>
    ),
    vase: (
      <g>
        <path d="M36 12 L64 12 L60 28 Q78 38 72 65 Q70 90 50 95 Q30 90 28 65 Q22 38 40 28 Z" />
        <path d="M32 50 Q50 45 68 50" fill="none" strokeWidth="1.2" opacity="0.5"/>
        <path d="M30 70 Q50 65 70 70" fill="none" strokeWidth="1" opacity="0.4"/>
        <circle cx="42" cy="75" r="1.5" fill={color} opacity="0.5"/>
        <circle cx="58" cy="78" r="1" fill={color} opacity="0.4"/>
      </g>
    ),
    scholar: (
      <g>
        <path d="M20 65 L35 40 L45 55 L50 45 L55 55 L65 40 L80 65 Z" fill="none" strokeWidth="2.5"/>
        <path d="M20 65 Q50 70 80 65" fill="none" strokeWidth="2"/>
        <path d="M42 80 Q50 76 58 80 L55 90 L45 90 Z" />
      </g>
    ),
    incense: (
      <g>
        <path d="M25 55 Q30 35 35 32 L38 20 L42 20 L45 32 L55 32 L58 20 L62 20 L65 32 Q70 35 75 55 Q70 75 50 78 Q30 75 25 55 Z" />
        <path d="M40 32 L40 55 L60 55 L60 32" fill="none" strokeWidth="1" opacity="0.4"/>
        <circle cx="50" cy="15" r="2" fill={color} opacity="0.6"/>
        <circle cx="48" cy="10" r="1" fill={color} opacity="0.3"/>
        <circle cx="52" cy="8" r="1.5" fill={color} opacity="0.4"/>
      </g>
    ),
  };

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill={`${color}18`}>
        {paths[type] || paths.vase}
      </g>
    </svg>
  );
};

export default function ShapesSection({ onOpenDetail }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('drink');
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>(0.1);

  const filteredShapes = shapeItems.filter((s) => s.categoryId === activeCategory);
  const activeCat = shapeCategories.find((c) => c.id === activeCategory);

  const handleClick = (shape: ShapeItem) => {
    onOpenDetail({
      type: 'shape',
      id: shape.id,
      title: shape.name,
      subtitle: `${shape.alias} · ${shape.era}盛行`,
      description: shape.description,
      sections: [
        { title: '造型特征', content: shape.features },
        { title: '主要用途', content: [shape.usage] },
        { title: '变体款式', content: shape.variants },
      ],
      color: '#8BA888',
      bgColor: '#E6F0E6',
      imagePrompt: shape.imagePrompt,
    });
  };

  return (
    <section id="shapes" className="section-padding bg-porcelain-scroll/30 crackle-bg relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <SectionTitle
          tag="SHAPES · 叁"
          title="器型分类"
          subtitle="茶盏酒壶、碗盘瓶炉，千姿百态的器型，承载着中华造物之美与生活雅趣"
        />

        <div ref={ref} className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-10">
            {shapeCategories.map((cat, idx) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`group relative flex items-center gap-2 px-4 md:px-5 py-2.5 md:py-3 rounded-xl transition-all duration-300 border ${
                  activeCategory === cat.id
                    ? 'bg-porcelain-ji-blue text-porcelain-paper border-porcelain-ji-blue shadow-porcelain scale-105'
                    : 'bg-porcelain-paper text-porcelain-inkbrown/75 border-porcelain-crackle/50 hover:border-porcelain-ji-blue/40 hover:text-porcelain-ji-blue'
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                <span className={`w-8 h-8 transition-colors ${
                  activeCategory === cat.id ? 'text-porcelain-gold' : 'text-porcelain-celadon'
                }`}>
                  <SilhouetteSVG type={categoryIcons[cat.icon] || 'vase'} color={activeCategory === cat.id ? '#C9A962' : '#8BA888'} />
                </span>
                <div className="text-left">
                  <div className="font-serif font-bold text-sm md:text-base" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    {cat.category}
                  </div>
                  <div className={`text-[10px] md:text-xs ${activeCategory === cat.id ? 'text-porcelain-paper/70' : 'text-porcelain-inkbrown/50'}`}>
                    {cat.description}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {activeCat && (
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="w-12 h-px bg-porcelain-gold/50" />
              <span className="flex items-center gap-1.5 text-porcelain-gold text-sm font-medium">
                <Layers size={14} strokeWidth={2} />
                当前分类：{activeCat.category} · 共 {filteredShapes.length} 种
              </span>
              <span className="w-12 h-px bg-porcelain-gold/50" />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filteredShapes.map((shape, idx) => (
              <article
                key={shape.id}
                onClick={() => handleClick(shape)}
                className={`group porcelain-card p-5 cursor-pointer transition-all duration-300 hover:shadow-porcelain-lg hover:-translate-y-1.5 stagger-${Math.min(idx + 1, 8)} ${
                  isVisible ? 'animate-fade-in-up' : ''
                }`}
              >
                <div className="relative w-20 h-24 md:w-24 md:h-28 mx-auto mb-4 transition-transform duration-500 group-hover:scale-110">
                  <SilhouetteSVG type={categoryIcons[activeCat?.icon || 'vase']} color="#8BA888" />
                </div>

                <div className="text-center">
                  <h3
                    className="font-serif text-lg font-bold text-porcelain-inkbrown mb-1"
                    style={{ fontFamily: '"Noto Serif SC", serif' }}
                  >
                    {shape.name}
                  </h3>
                  <p className="text-xs text-porcelain-inkbrown/55 mb-3">
                    {shape.alias}
                  </p>

                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-porcelain-celadon/15 text-porcelain-celadon text-[11px] font-medium mb-3">
                    {shape.era}
                  </div>

                  <p className="text-xs text-porcelain-inkbrown/70 leading-relaxed mb-4 line-clamp-2" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                    {shape.features[0]}
                  </p>

                  <button className="inline-flex items-center gap-1 text-xs font-medium text-porcelain-ji-blue/80 hover:text-porcelain-ji-blue transition-colors">
                    <Info size={12} strokeWidth={2} />
                    <span className="group-hover:underline">了解器型详情</span>
                    <ArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
