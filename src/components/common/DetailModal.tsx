import { useEffect, useRef } from 'react';
import { X, ArrowRight } from 'lucide-react';
import type { DetailData } from '@/types';

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DetailData | null;
  onOpenDetail?: (data: DetailData) => void;
}

export default function DetailModal({ isOpen, onClose, data, onOpenDetail }: DetailModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    const originalFocus = document.activeElement as HTMLElement;
    modalRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
      originalFocus?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const imageUrl = `https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=${encodeURIComponent(data.imagePrompt)}&image_size=landscape_4_3`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-porcelain-inkbrown/60 backdrop-blur-sm animate-fade-in" />

      <div
        ref={modalRef}
        tabIndex={-1}
        className="relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-lg shadow-porcelain-lg bg-porcelain-paper animate-fade-in-up flex flex-col"
        style={{ animationDelay: '0.1s' }}
      >
        <div
          className="absolute top-0 left-0 right-0 h-3 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, ${data.color || '#C9A962'}40, ${data.color || '#C9A962'}80, ${data.color || '#C9A962'}40)`,
          }}
        />

        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-porcelain-crackle/50 bg-porcelain-paper/95 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            {data.bgColor && (
              <span
                className="w-10 h-10 rounded-full shadow-inner"
                style={{ backgroundColor: data.bgColor }}
              />
            )}
            <div>
              <h3
                id="modal-title"
                className="font-serif text-xl md:text-2xl font-bold text-porcelain-inkbrown"
                style={{ fontFamily: '"Noto Serif SC", serif' }}
              >
                {data.title}
              </h3>
              {data.subtitle && (
                <p className="text-sm text-porcelain-inkbrown/60 mt-0.5">
                  {data.subtitle}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-porcelain-crackle/30 text-porcelain-inkbrown/70 hover:text-porcelain-inkbrown transition-colors"
            aria-label="关闭"
          >
            <X size={24} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="relative h-64 md:h-80 overflow-hidden bg-porcelain-scroll">
            <img
              src={imageUrl}
              alt={data.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
                (e.target as HTMLImageElement).parentElement!.style.background =
                  data.bgColor || '#F0EAD8';
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `linear-gradient(to top, ${data.bgColor || '#FAF7F0'}50, transparent 60%)`,
              }}
            />
          </div>

          <div className="p-6 md:p-10">
            <p className="text-lg leading-relaxed text-porcelain-inkbrown/85 mb-8" style={{ fontFamily: '"Noto Serif SC", serif', textIndent: '2em' }}>
              {data.description}
            </p>

            <div className="space-y-8">
              {data.sections.map((section, idx) => (
                <div key={idx}>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-1.5 h-6 rounded-full"
                      style={{ backgroundColor: data.color || '#C9A962' }}
                    />
                    <h4 className="font-serif text-lg font-semibold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      {section.title}
                    </h4>
                  </div>
                  <ul className="space-y-2 pl-5">
                    {section.content.map((item, i) => (
                      <li
                        key={i}
                        className="text-porcelain-inkbrown/80 leading-relaxed pl-2 relative before:absolute before:left-0 before:top-2.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-porcelain-gold/60"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {data.linkedArtifacts && data.linkedArtifacts.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="w-1.5 h-6 rounded-full"
                      style={{ backgroundColor: data.color || '#C9A962' }}
                    />
                    <h4 className="font-serif text-lg font-semibold text-porcelain-inkbrown" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                      关联典型器物
                    </h4>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-5">
                    {data.linkedArtifacts.map((artifact) => (
                      <button
                        key={artifact.id}
                        onClick={() => {
                          if (!onOpenDetail) return;
                          import('@/data/trade').then(({ tradeData }) => {
                            const full = tradeData.exportedArtifacts.find((a) => a.id === artifact.id);
                            if (!full) return;
                            onOpenDetail({
                              type: 'exported-artifact',
                              id: full.id,
                              title: full.name,
                              subtitle: `${full.originDynasty} · ${full.originKiln}`,
                              description: full.description + '\n\n' + full.significance,
                              sections: [
                                {
                                  title: '流传经过',
                                  content: [
                                    `产地：${full.originKiln}`,
                                    `出土地：${full.discoveredIn}`,
                                    `现存地点：${full.currentLocation}`,
                                    `材质：${full.material}`,
                                  ],
                                },
                                { title: '历史意义', content: [full.significance] },
                              ],
                              color: full.color,
                              bgColor: `${full.color}15`,
                              imagePrompt: full.imagePrompt,
                            });
                          });
                        }}
                        className="group text-left bg-porcelain-scroll/50 rounded-xl p-4 border border-porcelain-crackle/30 hover:shadow-md hover:border-porcelain-gold/40 transition-all duration-300"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-12 h-12 rounded-lg flex-shrink-0 flex items-center justify-center"
                            style={{ backgroundColor: `${artifact.color}20` }}
                          >
                            <div
                              className="w-6 h-6 rounded-full"
                              style={{
                                background: `radial-gradient(circle at 30% 30%, ${artifact.color}50, ${artifact.color}80)`,
                                boxShadow: `0 4px 12px ${artifact.color}30`,
                              }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-serif text-sm font-bold text-porcelain-inkbrown group-hover:text-porcelain-youlihong transition-colors line-clamp-1" style={{ fontFamily: '"Noto Serif SC", serif' }}>
                              {artifact.name}
                            </h5>
                            <div className="flex items-center gap-1.5 text-[10px] text-porcelain-inkbrown/50 mt-0.5">
                              <span>{artifact.originDynasty}</span>
                              <span>·</span>
                              <span>{artifact.originKiln}</span>
                            </div>
                            <p className="text-[11px] text-porcelain-inkbrown/55 leading-relaxed line-clamp-2 mt-1">
                              {artifact.description}
                            </p>
                          </div>
                          <ArrowRight size={14} className="text-porcelain-inkbrown/20 group-hover:text-porcelain-gold group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-2 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, ${data.color || '#C9A962'}40, ${data.color || '#C9A962'}80, ${data.color || '#C9A962'}40)`,
          }}
        />
      </div>
    </div>
  );
}
