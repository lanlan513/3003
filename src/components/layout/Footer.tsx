export default function Footer() {
  return (
    <footer className="relative bg-porcelain-inkbrown text-porcelain-paper crackle-bg overflow-hidden">
      <div className="absolute inset-0 opacity-5" aria-hidden="true">
        <div className="absolute inset-0 bg-rice-paper" />
      </div>

      <div className="cloud-divider opacity-20" />

      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 mb-10">
          <div>
            <h3
              className="font-serif text-3xl font-bold text-porcelain-gold mb-4"
              style={{ fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif' }}
            >
              瓷韵堂
            </h3>
            <p
              className="text-porcelain-paper/70 leading-relaxed mb-4"
              style={{ fontFamily: '"Noto Serif SC", serif' }}
            >
              以瓷为媒，传承中华五千年文明；
              <br />
              以韵为魂，品味东方美学之精髓。
            </p>
            <p className="text-porcelain-gold/60 text-sm tracking-widest">
              PORCELAIN · CULTURE · HERITAGE
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold text-porcelain-paper mb-4 border-l-2 border-porcelain-youlihong pl-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              知识导航
            </h4>
            <ul className="space-y-2">
              {['发展历史', '主要产地', '器型分类', '烧制工艺'].map((item, idx) => (
                <li key={idx}>
                  <a
                    href={`#${['history', 'regions', 'shapes', 'crafts'][idx]}`}
                    className="text-porcelain-paper/60 hover:text-porcelain-gold transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-porcelain-gold/50 group-hover:bg-porcelain-gold transition-colors" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold text-porcelain-paper mb-4 border-l-2 border-porcelain-youlihong pl-3" style={{ fontFamily: '"Noto Serif SC", serif' }}>
              五大名窑
            </h4>
            <div className="grid grid-cols-5 gap-2 mb-4">
              {[
                { name: '汝', color: '#7BA3A8' },
                { name: '官', color: '#8FA6A8' },
                { name: '哥', color: '#9E8B72' },
                { name: '定', color: '#E8E4D8' },
                { name: '钧', color: '#9B5A5A' },
              ].map((kiln) => (
                <div
                  key={kiln.name}
                  className="aspect-square rounded-md flex items-center justify-center font-serif font-bold text-sm"
                  style={{
                    backgroundColor: kiln.color,
                    color: kiln.name === '定' ? '#3D2B1F' : '#FAF7F0',
                    fontFamily: '"Ma Shan Zheng", "Noto Serif SC", serif',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.3)',
                  }}
                >
                  {kiln.name}
                </div>
              ))}
            </div>
            <p className="text-porcelain-paper/50 text-xs leading-relaxed">
              宋代五大名窑，中国古代陶瓷艺术的巅峰代表，汝窑天青、官窑粉青、哥窑开片、定窑白釉、钧窑窑变，各具风采，名垂青史。
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-porcelain-paper/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-porcelain-paper/40 text-sm">
            © 2026 瓷韵堂 Porcelain Academy · 弘扬中华陶瓷文化
          </p>
          <div className="flex items-center gap-4 text-porcelain-paper/40 text-xs tracking-wider">
            <span>匠心 · 传承 · 创新</span>
            <span className="text-porcelain-youlihong">●</span>
            <span>CRAFTSMANSHIP</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
