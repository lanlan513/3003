interface SealLabelProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function SealLabel({ text, size = 'md', className = '' }: SealLabelProps) {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs min-w-[40px]',
    md: 'px-3 py-1 text-sm min-w-[52px]',
    lg: 'px-4 py-1.5 text-base min-w-[64px]',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-serif text-porcelain-paper bg-porcelain-youlihong rounded-sm shadow-seal border-2 border-porcelain-youlihong/80 transform rotate-[-2deg] ${sizeClasses[size]} ${className}`}
      style={{
        fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif',
        letterSpacing: '0.1em',
      }}
    >
      {text}
    </span>
  );
}
