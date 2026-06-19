import type {
  MarketItem,
  MarketPeriod,
  MarketCategory,
  MarketRarity,
  MarketCondition,
  MarketEvent,
} from '../types';

export const periodConfig: Record<MarketPeriod, { name: string; valueMultiplier: number; color: string }> = {
  shangzhou: { name: '商周', valueMultiplier: 1.8, color: '#8B4513' },
  qinhan: { name: '秦汉', valueMultiplier: 1.6, color: '#CD853F' },
  suitang: { name: '隋唐', valueMultiplier: 1.7, color: '#DAA520' },
  song: { name: '宋代', valueMultiplier: 2.0, color: '#2F4F4F' },
  yuan: { name: '元代', valueMultiplier: 1.9, color: '#4682B4' },
  ming: { name: '明代', valueMultiplier: 1.8, color: '#B22222' },
  qing: { name: '清代', valueMultiplier: 1.7, color: '#6B8E23' },
  republic: { name: '民国', valueMultiplier: 1.3, color: '#708090' },
  modern: { name: '现代', valueMultiplier: 1.0, color: '#A9A9A9' },
};

export const categoryConfig: Record<MarketCategory, { name: string; valueMultiplier: number }> = {
  vase: { name: '瓶', valueMultiplier: 1.5 },
  bowl: { name: '碗', valueMultiplier: 1.0 },
  jar: { name: '罐', valueMultiplier: 1.3 },
  plate: { name: '盘', valueMultiplier: 0.9 },
  teapot: { name: '壶', valueMultiplier: 1.4 },
  cup: { name: '杯', valueMultiplier: 0.8 },
  figure: { name: '塑像', valueMultiplier: 1.6 },
  other: { name: '其他', valueMultiplier: 1.0 },
};

export const rarityConfig: Record<MarketRarity, { name: string; valueMultiplier: number; color: string }> = {
  common: { name: '普通', valueMultiplier: 1.0, color: '#808080' },
  uncommon: { name: '少见', valueMultiplier: 1.8, color: '#2E8B57' },
  rare: { name: '稀有', valueMultiplier: 3.5, color: '#4169E1' },
  epic: { name: '珍品', valueMultiplier: 7.0, color: '#9932CC' },
  legendary: { name: '国宝', valueMultiplier: 15.0, color: '#FFD700' },
};

export const conditionConfig: Record<MarketCondition, { name: string; valueMultiplier: number }> = {
  perfect: { name: '完美', valueMultiplier: 1.3 },
  excellent: { name: '完好', valueMultiplier: 1.15 },
  good: { name: '良好', valueMultiplier: 1.0 },
  fair: { name: '一般', valueMultiplier: 0.75 },
  damaged: { name: '残缺', valueMultiplier: 0.4 },
};

export const kilnNames = [
  '景德镇窑', '汝窑', '官窑', '哥窑', '钧窑', '定窑',
  '龙泉窑', '耀州窑', '磁州窑', '建窑', '吉州窑', '德化窑',
  '石湾窑', '宜兴窑', '越窑', '邢窑', '长沙窑', '寿州窑',
];

const itemTemplatePool: Omit<MarketItem, 'id' | 'currentMarketPrice' | 'priceTrend' | 'priceChangePercent'>[] = [
  {
    name: '青花瓷梅瓶',
    period: 'qing',
    periodName: '清代',
    category: 'vase',
    categoryName: '瓶',
    rarity: 'rare',
    condition: 'good',
    kiln: '景德镇窑',
    description: '器型端庄典雅，通体绘青花缠枝莲纹，发色青翠，层次分明。',
    historicalSignificance: '清代康熙年间青花瓷达到历史巅峰，此瓶为典型官窑风格。',
    authentication: 'unauthenticated',
    baseValue: 28000,
    imagePrompt: 'Qing Dynasty blue and white porcelain plum vase with lotus pattern, Jingdezhen kiln, imperial quality, museum photography, soft lighting',
    color: '#1E3A5F',
    features: ['青花发色纯正', '器型规整', '纹饰精美', '底款清晰'],
    exhibitIncome: 500,
    exhibitDuration: 3,
  },
  {
    name: '汝窑天青釉弦纹樽',
    period: 'song',
    periodName: '宋代',
    category: 'other',
    categoryName: '其他',
    rarity: 'legendary',
    condition: 'excellent',
    kiln: '汝窑',
    description: '天青釉色如雨过天晴，器身饰弦纹三道，古朴雅致，釉面开片细密。',
    historicalSignificance: '汝窑为宋代五大名窑之首，天青釉为其代表，传世品极少。',
    authentication: 'unauthenticated',
    baseValue: 2800000,
    imagePrompt: 'Song Dynasty Ru ware sky blue glazed three-stringed zun vessel, rare antique porcelain, subtle crackle glaze, museum collection, elegant composition',
    color: '#87CEEB',
    features: ['天青釉色纯正', '开片细密如蝉翼', '器型古朴', '传世稀少'],
    exhibitIncome: 8000,
    exhibitDuration: 7,
  },
  {
    name: '钧窑玫瑰紫釉花盆',
    period: 'song',
    periodName: '宋代',
    category: 'other',
    categoryName: '其他',
    rarity: 'epic',
    condition: 'good',
    kiln: '钧窑',
    description: '玫瑰紫釉交融变幻，如晚霞般绚烂，器型稳重典雅。',
    historicalSignificance: '钧窑"入窑一色，出窑万彩"，玫瑰紫为钧瓷名贵品种。',
    authentication: 'unauthenticated',
    baseValue: 350000,
    imagePrompt: 'Song Dynasty Jun ware rose purple glazed flower pot, kiln transformation colors, magnificent glaze effect, antique Chinese porcelain',
    color: '#C71585',
    features: ['窑变瑰丽', '釉色交融', '造型典雅', '底刻数字'],
    exhibitIncome: 1500,
    exhibitDuration: 5,
  },
  {
    name: '定窑白釉刻花折枝莲纹盘',
    period: 'song',
    periodName: '宋代',
    category: 'plate',
    categoryName: '盘',
    rarity: 'rare',
    condition: 'good',
    kiln: '定窑',
    description: '白釉温润如象牙，盘心刻折枝莲花，刀法流畅，纹饰清雅。',
    historicalSignificance: '定窑为宋代五大名窑之一，以白釉刻印花著称。',
    authentication: 'unauthenticated',
    baseValue: 45000,
    imagePrompt: 'Song Dynasty Ding ware white glaze carved lotus pattern plate, ivory white porcelain, delicate carving, antique ceramic',
    color: '#FFF8DC',
    features: ['白釉温润', '刻花流畅', '芒口包银', '纹饰清雅'],
    exhibitIncome: 600,
    exhibitDuration: 3,
  },
  {
    name: '官窑青釉贯耳瓶',
    period: 'song',
    periodName: '宋代',
    category: 'vase',
    categoryName: '瓶',
    rarity: 'epic',
    condition: 'excellent',
    kiln: '官窑',
    description: '粉青釉色莹润如玉，器型端庄对称，两侧贯耳古朴典雅。',
    historicalSignificance: '官窑为宋代宫廷御窑，器型多仿古青铜器，传世稀少。',
    authentication: 'unauthenticated',
    baseValue: 480000,
    imagePrompt: 'Song Dynasty Guan ware celadon glazed vase with tubular handles, imperial porcelain, subtle crackle, elegant archaistic form',
    color: '#98D8C8',
    features: ['粉青釉纯正', '开片自然', '器型仿古', '宫廷制式'],
    exhibitIncome: 2000,
    exhibitDuration: 5,
  },
  {
    name: '哥窑金丝铁线贯耳瓶',
    period: 'song',
    periodName: '宋代',
    category: 'vase',
    categoryName: '瓶',
    rarity: 'epic',
    condition: 'good',
    kiln: '哥窑',
    description: '釉面开片纵横交错，"金丝铁线"明显，紫口铁足特征显著。',
    historicalSignificance: '哥窑为宋代五大名窑之一，金丝铁线开片为其标志性特征。',
    authentication: 'unauthenticated',
    baseValue: 420000,
    imagePrompt: 'Song Dynasty Ge ware vase with golden thread and iron crackle pattern, distinctive purple mouth and iron foot, legendary antique porcelain',
    color: '#D2B48C',
    features: ['金丝铁线开片', '紫口铁足', '釉面温润', '传世稀少'],
    exhibitIncome: 1800,
    exhibitDuration: 5,
  },
  {
    name: '龙泉窑粉青釉鬲式炉',
    period: 'song',
    periodName: '宋代',
    category: 'other',
    categoryName: '其他',
    rarity: 'rare',
    condition: 'good',
    kiln: '龙泉窑',
    description: '粉青釉色柔和温润，鬲式造型仿古青铜器，三足鼎立稳重典雅。',
    historicalSignificance: '龙泉窑为宋代南方著名青瓷窑场，鬲式炉为其经典造型。',
    authentication: 'unauthenticated',
    baseValue: 38000,
    imagePrompt: 'Song Dynasty Longquan celadon glazed tripod censer, powdered green glaze, archaistic bronze form, antique porcelain',
    color: '#90EE90',
    features: ['粉青釉纯正', '鬲式造型', '釉色莹润', '三足规整'],
    exhibitIncome: 550,
    exhibitDuration: 3,
  },
  {
    name: '建窑黑釉兔毫盏',
    period: 'song',
    periodName: '宋代',
    category: 'cup',
    categoryName: '杯',
    rarity: 'rare',
    condition: 'excellent',
    kiln: '建窑',
    description: '黑釉如漆，兔毫纹细密如丝，金光闪烁，为斗茶利器。',
    historicalSignificance: '宋代斗茶之风盛行，建窑兔毫盏为斗茶首选，备受推崇。',
    authentication: 'unauthenticated',
    baseValue: 52000,
    imagePrompt: 'Song Dynasty Jian ware black glaze tea bowl with silver hare\'s fur pattern, tenmoku glaze, tea ceremony utensil',
    color: '#1C1C1C',
    features: ['兔毫纹精美', '釉色黑亮', '器型周正', '底足规整'],
    exhibitIncome: 700,
    exhibitDuration: 3,
  },
  {
    name: '青花缠枝莲纹玉壶春瓶',
    period: 'ming',
    periodName: '明代',
    category: 'vase',
    categoryName: '瓶',
    rarity: 'rare',
    condition: 'good',
    kiln: '景德镇窑',
    description: '器型优美如淑女，青花发色浓艳，缠枝莲纹层次分明。',
    historicalSignificance: '明代永乐、宣德年间青花瓷达到巅峰，玉壶春瓶为经典器型。',
    authentication: 'unauthenticated',
    baseValue: 85000,
    imagePrompt: 'Ming Dynasty blue and white porcelain yuhuchunping vase with lotus scroll pattern, Yongle period style, Jingdezhen imperial kiln',
    color: '#191970',
    features: ['青花发色浓艳', '器型优美', '纹饰流畅', '胎质细腻'],
    exhibitIncome: 900,
    exhibitDuration: 4,
  },
  {
    name: '斗彩鸡缸杯',
    period: 'ming',
    periodName: '明代',
    category: 'cup',
    categoryName: '杯',
    rarity: 'legendary',
    condition: 'perfect',
    kiln: '景德镇窑',
    description: '胎薄如纸，釉白如玉，斗彩鸡群栩栩如生，色彩艳丽和谐。',
    historicalSignificance: '明代成化斗彩鸡缸杯为千古名品，现存世寥寥无几，价值连城。',
    authentication: 'unauthenticated',
    baseValue: 28000000,
    imagePrompt: 'Ming Dynasty Chenghua doucai chicken cup, extremely rare imperial porcelain, delicate painting of rooster hen and chicks, museum masterpiece',
    color: '#FFFACD',
    features: ['胎薄透光', '斗彩精细', '色彩和谐', '画工精湛'],
    exhibitIncome: 50000,
    exhibitDuration: 10,
  },
  {
    name: '五彩云龙纹盖罐',
    period: 'ming',
    periodName: '明代',
    category: 'jar',
    categoryName: '罐',
    rarity: 'epic',
    condition: 'good',
    kiln: '景德镇窑',
    description: '通体绘五彩云龙纹，色彩浓艳，龙纹矫健威武，气势磅礴。',
    historicalSignificance: '明代万历五彩为彩瓷巅峰之作，云龙纹为皇家专用纹饰。',
    authentication: 'unauthenticated',
    baseValue: 680000,
    imagePrompt: 'Ming Dynasty Wanli period wucai five-color porcelain lidded jar with dragon pattern, vibrant colors, imperial porcelain',
    color: '#DC143C',
    features: ['五彩浓艳', '龙纹矫健', '器型硕大', '盖钮完整'],
    exhibitIncome: 2500,
    exhibitDuration: 6,
  },
  {
    name: '釉里红三果纹梅瓶',
    period: 'qing',
    periodName: '清代',
    category: 'vase',
    categoryName: '瓶',
    rarity: 'rare',
    condition: 'excellent',
    kiln: '景德镇窑',
    description: '釉里红发色纯正娇艳，三果纹寓意吉祥，红白相映成趣。',
    historicalSignificance: '釉里红烧制难度极高，清代雍正年间技术达到顶峰。',
    authentication: 'unauthenticated',
    baseValue: 120000,
    imagePrompt: 'Qing Dynasty underglaze red porcelain plum vase with three fruits pattern, Yongzheng period, Jingdezhen imperial quality',
    color: '#B22222',
    features: ['釉里红纯正', '三果纹吉祥', '器型端庄', '釉面莹润'],
    exhibitIncome: 1200,
    exhibitDuration: 4,
  },
  {
    name: '粉彩九桃纹天球瓶',
    period: 'qing',
    periodName: '清代',
    category: 'vase',
    categoryName: '瓶',
    rarity: 'epic',
    condition: 'perfect',
    kiln: '景德镇窑',
    description: '粉彩柔丽雅致，九桃纹寓意长寿，色彩层次丰富，画工精细入微。',
    historicalSignificance: '清代乾隆粉彩为彩瓷集大成者，九桃天球瓶为经典官窑精品。',
    authentication: 'unauthenticated',
    baseValue: 850000,
    imagePrompt: 'Qing Dynasty Qianlong period famille rose porcelain tianqiuping vase with nine peaches pattern, imperial quality, delicate painting',
    color: '#FFB6C1',
    features: ['粉彩柔丽', '九桃吉祥', '画工精湛', '器型硕大'],
    exhibitIncome: 3000,
    exhibitDuration: 7,
  },
  {
    name: '珐琅彩花鸟纹瓶',
    period: 'qing',
    periodName: '清代',
    category: 'vase',
    categoryName: '瓶',
    rarity: 'legendary',
    condition: 'perfect',
    kiln: '景德镇窑',
    description: '珐琅彩料细润华贵，花鸟纹栩栩如生，诗书画印四绝合璧。',
    historicalSignificance: '珐琅彩为清代宫廷绝密工艺，专为皇室烧制，民间难得一见。',
    authentication: 'unauthenticated',
    baseValue: 5500000,
    imagePrompt: 'Qing Dynasty falangcai enamel painted porcelain vase with birds and flowers pattern, imperial court ware, exquisite detail',
    color: '#FFE4E1',
    features: ['珐琅彩华贵', '画工绝伦', '题诗雅致', '皇家御用'],
    exhibitIncome: 15000,
    exhibitDuration: 10,
  },
  {
    name: '茶叶末釉绶带耳葫芦瓶',
    period: 'qing',
    periodName: '清代',
    category: 'vase',
    categoryName: '瓶',
    rarity: 'uncommon',
    condition: 'good',
    kiln: '景德镇窑',
    description: '茶叶末釉色古朴典雅，葫芦造型寓意福禄，绶带耳装饰别致。',
    historicalSignificance: '茶叶末釉为清代官窑名贵单色釉品种，釉色如茶末般细腻。',
    authentication: 'unauthenticated',
    baseValue: 28000,
    imagePrompt: 'Qing Dynasty tea dust glazed gourd-shaped vase with ribbon handles, antique monochrome porcelain, Jingdezhen kiln',
    color: '#6B5D4B',
    features: ['茶叶末釉纯正', '葫芦造型', '绶带耳别致', '寓意吉祥'],
    exhibitIncome: 450,
    exhibitDuration: 3,
  },
  {
    name: '豇豆红釉菊瓣瓶',
    period: 'qing',
    periodName: '清代',
    category: 'vase',
    categoryName: '瓶',
    rarity: 'rare',
    condition: 'excellent',
    kiln: '景德镇窑',
    description: '豇豆红釉色如桃花，娇嫩欲滴，菊瓣造型清雅脱俗。',
    historicalSignificance: '豇豆红为康熙官窑名贵品种，烧制极难，有"美人醉"之称。',
    authentication: 'unauthenticated',
    baseValue: 180000,
    imagePrompt: 'Qing Dynasty Kangxi period peach bloom glazed porcelain vase with chrysanthemum petal design, rare imperial monochrome',
    color: '#E9967A',
    features: ['豇豆红娇艳', '釉色均匀', '菊瓣雅致', '康熙御窑'],
    exhibitIncome: 1500,
    exhibitDuration: 5,
  },
  {
    name: '青瓷莲花尊',
    period: 'suitang',
    periodName: '隋唐',
    category: 'other',
    categoryName: '其他',
    rarity: 'epic',
    condition: 'good',
    kiln: '越窑',
    description: '通体雕刻莲花瓣纹，层次繁复，釉色青中泛黄，古朴厚重。',
    historicalSignificance: '南北朝至隋唐青瓷珍品，莲花尊为佛教艺术与陶瓷结合的典范。',
    authentication: 'unauthenticated',
    baseValue: 320000,
    imagePrompt: 'Sui-Tang Dynasty celadon lotus petal shaped zun vessel, Yue kiln, intricate carving, ancient Chinese porcelain',
    color: '#9ACD32',
    features: ['莲花雕刻精美', '釉色古雅', '器型硕大', '佛教题材'],
    exhibitIncome: 1800,
    exhibitDuration: 6,
  },
  {
    name: '三彩骆驼载乐俑',
    period: 'qinhan',
    periodName: '秦汉',
    category: 'figure',
    categoryName: '塑像',
    rarity: 'epic',
    condition: 'good',
    kiln: '其他',
    description: '三彩釉色斑斓绚丽，骆驼昂首伫立，乐俑姿态生动，展现盛唐气象。',
    historicalSignificance: '唐代唐三彩为古代彩陶巅峰之作，骆驼载乐俑为其中精品。',
    authentication: 'unauthenticated',
    baseValue: 420000,
    imagePrompt: 'Tang Dynasty sancai tri-color glazed pottery camel with musicians figurine, vibrant colors, ancient Chinese sculpture',
    color: '#D2691E',
    features: ['三彩釉色绚丽', '造型生动', '人物众多', '盛唐气象'],
    exhibitIncome: 2200,
    exhibitDuration: 6,
  },
  {
    name: '原始青瓷大口尊',
    period: 'shangzhou',
    periodName: '商周',
    category: 'other',
    categoryName: '其他',
    rarity: 'rare',
    condition: 'fair',
    kiln: '其他',
    description: '原始青瓷，釉色青中带褐，器型古朴厚重，印纹清晰可见。',
    historicalSignificance: '商周时期为瓷器起源阶段，原始青瓷是研究瓷器起源的重要实物。',
    authentication: 'unauthenticated',
    baseValue: 68000,
    imagePrompt: 'Shang-Zhou Dynasty proto-porcelain large mouth zun, ancient ceramic, stamped pattern, early Chinese porcelain',
    color: '#8B7355',
    features: ['原始青瓷', '印纹清晰', '器型古朴', '历史悠久'],
    exhibitIncome: 800,
    exhibitDuration: 4,
  },
  {
    name: '紫砂提梁壶',
    period: 'modern',
    periodName: '现代',
    category: 'teapot',
    categoryName: '壶',
    rarity: 'uncommon',
    condition: 'perfect',
    kiln: '宜兴窑',
    description: '紫砂泥质细腻温润，提梁设计典雅，壶身素面无饰，尽显材质之美。',
    historicalSignificance: '宜兴紫砂壶"泡茶不走味，贮茶不变色"，为历代茶人所珍爱。',
    authentication: 'unauthenticated',
    baseValue: 12000,
    imagePrompt: 'Modern Yixing zisha purple clay teapot with overhead handle, elegant form, unadorned surface, Chinese tea ware',
    color: '#8B4513',
    features: ['紫砂泥质上乘', '提梁设计', '工艺精湛', '出水流畅'],
    exhibitIncome: 250,
    exhibitDuration: 2,
  },
  {
    name: '白釉观音坐像',
    period: 'ming',
    periodName: '明代',
    category: 'figure',
    categoryName: '塑像',
    rarity: 'rare',
    condition: 'good',
    kiln: '德化窑',
    description: '德化白瓷如凝脂冻玉，观音面容慈祥，衣纹飘逸自然，栩栩如生。',
    historicalSignificance: '明代德化窑"中国白"闻名于世，何朝宗款观音像为其代表。',
    authentication: 'unauthenticated',
    baseValue: 95000,
    imagePrompt: 'Ming Dynasty Dehua kiln blanc de chine seated Guanyin statue, ivory white porcelain, compassionate expression, flowing robes',
    color: '#FFFFF0',
    features: ['白釉温润如脂', '面容慈祥', '衣纹飘逸', '德化名窑'],
    exhibitIncome: 1000,
    exhibitDuration: 4,
  },
  {
    name: '青花山水人物纹笔筒',
    period: 'qing',
    periodName: '清代',
    category: 'other',
    categoryName: '其他',
    rarity: 'uncommon',
    condition: 'good',
    kiln: '景德镇窑',
    description: '青花山水意境深远，人物点缀其间，为文房雅致之器。',
    historicalSignificance: '清代康熙年间青花山水笔筒为文房收藏热门品类。',
    authentication: 'unauthenticated',
    baseValue: 22000,
    imagePrompt: 'Qing Dynasty blue and white porcelain brush pot with landscape and figures, Kangxi period, scholars desk object',
    color: '#4682B4',
    features: ['青花山水意境', '文房雅器', '器型周正', '釉面莹润'],
    exhibitIncome: 400,
    exhibitDuration: 3,
  },
  {
    name: '粉彩百蝶纹赏瓶',
    period: 'qing',
    periodName: '清代',
    category: 'vase',
    categoryName: '瓶',
    rarity: 'rare',
    condition: 'excellent',
    kiln: '景德镇窑',
    description: '粉彩蝴蝶色彩缤纷，百蝶飞舞寓意吉祥，器型端庄秀美。',
    historicalSignificance: '清代光绪年间粉彩百蝶瓶为慈禧万寿定制瓷，存世稀少。',
    authentication: 'unauthenticated',
    baseValue: 150000,
    imagePrompt: 'Qing Dynasty famille rose porcelain appreciation vase with hundred butterflies pattern, Guangxu period, imperial ware',
    color: '#FFF0F5',
    features: ['百蝶纹吉祥', '粉彩艳丽', '器型秀美', '宫廷制式'],
    exhibitIncome: 1300,
    exhibitDuration: 5,
  },
  {
    name: '绿釉刻花凤首壶',
    period: 'suitang',
    periodName: '隋唐',
    category: 'teapot',
    categoryName: '壶',
    rarity: 'rare',
    condition: 'good',
    kiln: '其他',
    description: '绿釉鲜艳欲滴，凤首造型独特，刻花纹饰精美，融合中西风格。',
    historicalSignificance: '唐代凤首壶受波斯金银器影响，是丝绸之路文化交流的见证。',
    authentication: 'unauthenticated',
    baseValue: 75000,
    imagePrompt: 'Tang Dynasty green glazed phoenix head ewer, carved decoration, Silk Road influence, ancient Chinese ceramic',
    color: '#228B22',
    features: ['凤首造型', '绿釉鲜艳', '中西合璧', '丝路见证'],
    exhibitIncome: 850,
    exhibitDuration: 4,
  },
  {
    name: '青花瓷龙纹大盘',
    period: 'qing',
    periodName: '清代',
    category: 'plate',
    categoryName: '盘',
    rarity: 'uncommon',
    condition: 'good',
    kiln: '景德镇窑',
    description: '体型硕大，青花龙纹矫健有力，祥云环绕，气势恢宏。',
    historicalSignificance: '清代青花龙纹盘为宫廷常用器，龙纹象征皇权，等级森严。',
    authentication: 'unauthenticated',
    baseValue: 35000,
    imagePrompt: 'Qing Dynasty large blue and white porcelain plate with dragon pattern, imperial ware, powerful dragon design',
    color: '#000080',
    features: ['体型硕大', '龙纹矫健', '青花纯正', '宫廷用器'],
    exhibitIncome: 500,
    exhibitDuration: 3,
  },
];

const calculateBaseValue = (
  period: MarketPeriod,
  category: MarketCategory,
  rarity: MarketRarity,
  condition: MarketCondition,
  base: number
): number => {
  return Math.round(
    base *
    periodConfig[period].valueMultiplier *
    categoryConfig[category].valueMultiplier *
    rarityConfig[rarity].valueMultiplier *
    conditionConfig[condition].valueMultiplier
  );
};

const generateRandomId = (): string => {
  return `market-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const generatePriceTrend = (): { trend: 'rising' | 'stable' | 'falling'; change: number } => {
  const rand = Math.random();
  if (rand < 0.3) {
    return { trend: 'rising', change: Math.round((Math.random() * 25 + 5) * 100) / 100 };
  } else if (rand < 0.7) {
    return { trend: 'stable', change: Math.round((Math.random() * 10 - 5) * 100) / 100 };
  } else {
    return { trend: 'falling', change: Math.round(-(Math.random() * 25 + 5) * 100) / 100 };
  }
};

export const generateMarketItem = (): MarketItem => {
  const template = itemTemplatePool[Math.floor(Math.random() * itemTemplatePool.length)];
  const priceTrend = generatePriceTrend();
  const baseValue = calculateBaseValue(
    template.period,
    template.category,
    template.rarity,
    template.condition,
    template.baseValue
  );
  
  const currentPrice = Math.round(baseValue * (1 + priceTrend.change / 100));
  
  const hasForgery = template.rarity !== 'legendary' && Math.random() < 0.2;
  
  return {
    ...template,
    id: generateRandomId(),
    baseValue,
    currentMarketPrice: hasForgery ? Math.round(baseValue * 0.6) : currentPrice,
    priceTrend: priceTrend.trend,
    priceChangePercent: priceTrend.change,
    authentication: hasForgery ? 'unauthenticated' : 'unauthenticated',
    color: periodConfig[template.period].color,
  };
};

export const generateMarketItems = (count: number = 8): MarketItem[] => {
  const items: MarketItem[] = [];
  const usedNames = new Set<string>();
  
  while (items.length < count) {
    const item = generateMarketItem();
    if (!usedNames.has(item.name)) {
      usedNames.add(item.name);
      items.push(item);
    }
  }
  
  return items;
};

export const eventTemplatePool: Omit<MarketEvent, 'id' | 'startTime'>[] = [
  {
    name: '宋代瓷器收藏热潮',
    description: '近期宋代五大名窑瓷器受到市场热捧，价格大幅上涨。',
    type: 'positive',
    affectedPeriods: ['song'],
    affectedCategories: [],
    priceMultiplier: 1.4,
    duration: 5,
  },
  {
    name: '明清官窑精品拍卖创新高',
    description: '国际拍卖行明清官窑瓷器屡创天价，带动市场信心。',
    type: 'positive',
    affectedPeriods: ['ming', 'qing'],
    affectedCategories: [],
    priceMultiplier: 1.25,
    duration: 4,
  },
  {
    name: '考古新发现震惊学界',
    description: '新出土的唐代陶瓷珍品引发研究热潮，相关藏品价值提升。',
    type: 'positive',
    affectedPeriods: ['suitang'],
    affectedCategories: [],
    priceMultiplier: 1.3,
    duration: 3,
  },
  {
    name: '经济下行影响收藏市场',
    description: '宏观经济形势不佳，高端艺术品市场整体低迷。',
    type: 'negative',
    affectedPeriods: [],
    affectedCategories: [],
    priceMultiplier: 0.8,
    duration: 4,
  },
  {
    name: '赝品泛滥引发信任危机',
    description: '近期爆出多起高仿赝品事件，买家观望情绪浓厚。',
    type: 'negative',
    affectedPeriods: [],
    affectedCategories: [],
    priceMultiplier: 0.75,
    duration: 3,
  },
  {
    name: '单色釉瓷器异军突起',
    description: '藏家审美回归质朴，宋代单色釉瓷器备受青睐。',
    type: 'positive',
    affectedPeriods: ['song'],
    affectedCategories: ['vase', 'bowl', 'other'],
    priceMultiplier: 1.35,
    duration: 4,
  },
  {
    name: '文房雅器成为新宠',
    description: '文人收藏热潮兴起，笔筒、水盂等文房瓷器价格飙升。',
    type: 'positive',
    affectedPeriods: ['qing', 'ming'],
    affectedCategories: ['other'],
    priceMultiplier: 1.3,
    duration: 3,
  },
  {
    name: '茶器文化复兴',
    description: '茶文化复兴带动茶具收藏，建盏、紫砂壶价格稳步上涨。',
    type: 'positive',
    affectedPeriods: ['song', 'modern', 'ming'],
    affectedCategories: ['teapot', 'cup'],
    priceMultiplier: 1.25,
    duration: 5,
  },
  {
    name: '海外回流精品增多',
    description: '大量海外回流文物进入市场，增加供给的同时提升整体质量。',
    type: 'neutral',
    affectedPeriods: [],
    affectedCategories: [],
    priceMultiplier: 0.95,
    duration: 3,
  },
  {
    name: '新博物馆开馆收购藏品',
    description: '多家新建博物馆大量收购陶瓷藏品，市场需求旺盛。',
    type: 'positive',
    affectedPeriods: [],
    affectedCategories: [],
    priceMultiplier: 1.2,
    duration: 6,
  },
  {
    name: '高古瓷政策松绑',
    description: '高古瓷交易政策放宽，商周秦汉瓷器交易活跃。',
    type: 'positive',
    affectedPeriods: ['shangzhou', 'qinhan'],
    affectedCategories: [],
    priceMultiplier: 1.3,
    duration: 4,
  },
  {
    name: '民国瓷器价值重估',
    description: '珠山八友等民国名家作品被重新认识，价格持续走高。',
    type: 'positive',
    affectedPeriods: ['republic'],
    affectedCategories: [],
    priceMultiplier: 1.4,
    duration: 5,
  },
];

export const generateMarketEvent = (): MarketEvent | null => {
  if (Math.random() > 0.3) return null;
  
  const template = eventTemplatePool[Math.floor(Math.random() * eventTemplatePool.length)];
  
  return {
    ...template,
    id: generateRandomId(),
    startTime: Date.now(),
  };
};

export const authenticationNotes = [
  '经专家组鉴定，此器造型、纹饰、釉色均符合时代特征，为真品无疑。',
  '胎质细腻，釉面温润，底款字体工整，确认为到代精品。',
  '综合显微观察和成分分析，此器为现代仿品，仿造水平较高。',
  '器型有偏差，釉色过于刻意，鉴定为仿品。',
  '虽有修补痕迹，但主体为真品，研究价值较高。',
  '经过热释光检测，确认为宋代真品，距今约800年。',
];

export const getAuthenticateResult = (isAuthentic: boolean): { success: boolean; isAuthentic: boolean; note: string } => {
  const success = Math.random() > 0.1;
  const actualResult = success ? isAuthentic : !isAuthentic;
  
  const notes = isAuthentic
    ? authenticationNotes.filter((_, i) => i < 3)
    : authenticationNotes.filter((_, i) => i >= 2);
  
  return {
    success,
    isAuthentic: actualResult,
    note: notes[Math.floor(Math.random() * notes.length)],
  };
};

export const shopUpgradeCosts = [0, 50000, 200000, 500000, 1000000];
export const shopCapacityByLevel = [10, 15, 20, 25, 30];
export const shopExhibitSlotsByLevel = [2, 3, 4, 5, 6];
export const shopReputationBonusByLevel = [1, 1.1, 1.2, 1.35, 1.5];

export const formatMoney = (amount: number): string => {
  if (amount >= 100000000) {
    return `¥${(amount / 100000000).toFixed(2)}亿`;
  } else if (amount >= 10000) {
    return `¥${(amount / 10000).toFixed(1)}万`;
  }
  return `¥${amount.toLocaleString()}`;
};
