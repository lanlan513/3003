import { useEffect, useState } from 'react';
import { Scroll, Clock, MapPin, Layers, Flame, Sparkles, Globe, Pickaxe, Beaker, Palette, ShoppingBag, Workflow, FlaskConical } from 'lucide-react';

const navItems = [
  { id: 'history', label: '发展历史', icon: Clock },
  { id: 'timeline', label: '陶瓷长廊', icon: Clock },
  { id: 'trade', label: '贸易交流', icon: Globe },
  { id: 'regions', label: '主要产地', icon: MapPin },
  { id: 'shapes', label: '器型分类', icon: Layers },
  { id: 'crafts', label: '烧制工艺', icon: Flame },
  { id: 'ceramic-composition', label: '成分解密', icon: FlaskConical },
  { id: 'process-editor', label: '流程编辑', icon: Workflow },
  { id: 'pottery-game', label: '瓷火模拟', icon: Sparkles },
  { id: 'excavation', label: '考古发掘', icon: Pickaxe },
  { id: 'glaze-lab', label: '釉色实验室', icon: Beaker },
  { id: 'curator', label: '策展工坊', icon: Palette },
  { id: 'market', label: '瓷市经营', icon: ShoppingBag },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);

      const sections = navItems.map((item) => document.getElementById(item.id));
      const scrollPos = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'bg-porcelain-paper/95 backdrop-blur-md shadow-porcelain border-b border-porcelain-crackle/30'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <a
            href="#top"
            className="flex items-center gap-2 group"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span className={`relative transition-colors ${scrolled ? 'text-porcelain-youlihong' : 'text-porcelain-paper'}`}>
              <Scroll size={28} strokeWidth={1.5} className="animate-glow-pulse" style={{ animationDelay: '0.2s' }} />
            </span>
            <div className="flex flex-col">
              <span
                className={`font-serif text-xl md:text-2xl font-bold tracking-wide transition-colors ${
                  scrolled ? 'text-porcelain-inkbrown' : 'text-porcelain-paper'
                }`}
                style={{ fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif' }}
              >
                瓷韵堂
              </span>
              <span
                className={`text-[10px] tracking-widest transition-colors ${
                  scrolled ? 'text-porcelain-gold' : 'text-porcelain-gold/90'
                }`}
              >
                PORCELAIN ACADEMY
              </span>
            </div>
          </a>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative px-4 py-2 rounded-md transition-all duration-300 group ${
                  scrolled ? 'text-porcelain-inkbrown/80' : 'text-porcelain-paper/90'
                } ${activeSection === item.id ? (scrolled ? 'text-porcelain-ji-blue' : 'text-porcelain-gold') : ''}`}
              >
                <span className="flex items-center gap-1.5 text-sm font-medium">
                  <item.icon size={16} strokeWidth={1.8} />
                  {item.label}
                </span>
                <span
                  className={`absolute bottom-1 left-4 right-4 h-0.5 rounded-full transition-all duration-300 ${
                    activeSection === item.id
                      ? 'scale-x-100 bg-porcelain-youlihong'
                      : 'scale-x-0 bg-porcelain-gold group-hover:scale-x-100'
                  }`}
                />
              </button>
            ))}
          </nav>

          <div className="md:hidden flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`p-2 rounded-md transition-colors ${
                  activeSection === item.id
                    ? scrolled
                      ? 'bg-porcelain-youlihong/10 text-porcelain-youlihong'
                      : 'bg-porcelain-gold/20 text-porcelain-gold'
                    : scrolled
                    ? 'text-porcelain-inkbrown/70'
                    : 'text-porcelain-paper/80'
                }`}
                aria-label={item.label}
              >
                <item.icon size={20} strokeWidth={1.8} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
