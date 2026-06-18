import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  tag?: string;
  align?: 'center' | 'left';
}

export default function SectionTitle({ title, subtitle, tag, align = 'center' }: SectionTitleProps) {
  const { ref, isVisible } = useScrollAnimation<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} mb-12 md:mb-16 ${
        align === 'center' ? 'text-center' : 'text-left'
      }`}
    >
      {tag && (
        <div className="inline-flex items-center gap-2 mb-4">
          <span className="w-8 h-px bg-porcelain-gold/60"></span>
          <span className="text-porcelain-gold font-medium tracking-widest text-sm">
            {tag}
          </span>
          <span className="w-8 h-px bg-porcelain-gold/60"></span>
        </div>
      )}
      <h2
        className={`font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-porcelain-inkbrown mb-4 tracking-wide`}
        style={{ fontFamily: '"Noto Serif SC", serif' }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={`max-w-2xl ${
            align === 'center' ? 'mx-auto' : ''
          } text-porcelain-inkbrown/70 text-base md:text-lg leading-relaxed`}
          style={{ fontFamily: '"Noto Serif SC", serif' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
