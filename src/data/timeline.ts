import type { TimelineDynasty } from '../types';

export const timelineData: TimelineDynasty[] = [
  {
    id: 'neolithic',
    dynasty: '新石器时代',
    period: '仰韶 · 龙山文化',
    year: '约公元前8000年 — 前2000年',
    startYear: -8000,
    endYear: -2000,
    color: '#8B7355',
    summary: '陶器的起源，中华文明曙光初现',
    description: '新石器时代是中国陶器的滥觞时期。距今约一万年前，华夏先民在黄河、长江流域开始制作陶器，奠定了中华陶瓷文明的根基。仰韶文化的彩陶与龙山文化的黑陶交相辉映，展现了远古先民的艺术智慧。',
    achievements: [
      '发明捏塑、泥条盘筑、慢轮修整等成型技术',
      '仰韶彩陶以赭红、黑、白三色绘制几何纹、鱼纹、蛙纹',
      '龙山黑陶采用渗碳工艺，蛋壳陶壁厚仅0.5毫米',
      '出现横穴窑与竖穴窑，烧制温度可达1000°C',
    ],
    representative: [
      { name: '人面鱼纹彩陶盆', desc: '仰韶文化半坡类型，现藏国家博物馆' },
      { name: '蛋壳黑陶高柄杯', desc: '龙山文化，"黑如漆、薄如纸"的巅峰之作' },
      { name: '舞蹈纹彩陶盆', desc: '马家窑文化，描绘先民集体舞蹈的珍贵图像' },
    ],
    typicalArtifacts: [
      {
        name: '人面鱼纹彩陶盆',
        desc: '仰韶文化半坡类型的代表作品，盆内壁绘有人面与鱼纹相结合的图案，线条流畅生动，是中国史前艺术的瑰宝，现藏于中国国家博物馆。盆高16.5厘米，口径39.8厘米，用细泥红陶制成。',
        imagePrompt: 'Neolithic Yangshao culture painted pottery basin with human face and fish pattern, red terracotta with black and red geometric painting, museum exhibition lighting, archaeological artifact photography',
      },
      {
        name: '蛋壳黑陶高柄杯',
        desc: '龙山文化的巅峰之作，"黑如漆、亮如镜、薄如纸、硬如瓷"。杯壁厚仅0.5毫米，采用渗碳工艺烧制，通体漆黑光亮，造型精巧绝伦，代表了史前制陶工艺的最高水平。',
        imagePrompt: 'Longshan culture eggshell black pottery tall stem cup, extremely thin wall black polished ceramic, neolithic artifact, dramatic museum lighting against dark background',
      },
      {
        name: '舞蹈纹彩陶盆',
        desc: '马家窑文化的杰出代表，盆内壁彩绘三组舞蹈人物，每组五人，手拉手翩翩起舞，生动再现了五千年前先民集体舞蹈的场景，是研究原始舞蹈和绘画的珍贵实物资料。',
        imagePrompt: 'Majiayao culture dancing figure painted pottery basin, neolithic ceramic with human figures dancing in circle, museum quality warm lighting, detailed close-up photography',
      },
    ],
    glazeFeatures: [
      {
        name: '素面陶衣',
        color: '#A0826D',
        description: '新石器时代晚期出现的原始装饰工艺，在陶器表面涂刷一层细泥浆，烧成后形成光滑的陶衣，有红、白、灰等颜色，为后世施釉工艺奠定了基础。',
      },
      {
        name: '彩绘陶色',
        color: '#8B4513',
        description: '以天然矿物颜料绘制纹饰，主要有赭红（氧化铁）、黑（锰化物）、白（白垩土）三种颜色。颜料在高温下与胎体结合，色彩历经数千年依然鲜艳。',
      },
      {
        name: '渗碳黑陶',
        color: '#2C2C2C',
        description: '龙山文化特有的工艺，在烧制后期用浓烟熏翳，使炭黑渗入陶胎孔隙，形成通体漆黑光亮的效果。这种工艺是后世乌金釉的雏形。',
      },
    ],
    craftEvolutions: [
      {
        title: '泥条盘筑成型',
        description: '新石器时代最主要的陶器成型方法，将泥料搓成条状，从器底向上螺旋式盘筑，逐层堆叠成所需器形，再用手或工具修整内外壁。',
        impact: '这是人类最早的系统性制陶方法，使陶器能够制作出规整的大型器物，为后世拉坯成型奠定了技术基础。',
      },
      {
        title: '慢轮修整技术',
        description: '仰韶文化晚期出现的木质圆盘，靠人力拨动缓慢旋转。工匠在转动的轮盘上修整器形、绘制纹饰，使器形更加规整对称。',
        impact: '慢轮的发明是陶瓷史上的重要里程碑，直接催生了后世的快轮拉坯技术，是现代陶瓷机械的始祖。',
      },
      {
        title: '横穴窑烧制',
        description: '新石器时代最早的陶窑形制，火膛与窑室在同一水平面上，火焰从火膛经火道进入窑室。火膛较长，形如横穴。',
        impact: '陶窑的发明使烧制温度从露天堆烧的600-700°C提升到900-1000°C，陶器质量显著提高，为瓷器的发明创造了条件。',
      },
    ],
    imagePrompt: 'Ancient Chinese Neolithic Yangshao painted pottery basin with red and black geometric fish patterns, museum lighting, warm earth tones, archaeological style photography',
  },
  {
    id: 'shang-zhou',
    dynasty: '商周时期',
    period: '青铜时代的陶与原始瓷',
    year: '约公元前1600年 — 前221年',
    startYear: -1600,
    endYear: -221,
    color: '#A0522D',
    summary: '原始青瓷诞生，陶与瓷的分水岭',
    description: '商周时期，随着青铜文明的鼎盛，陶器制作也突飞猛进。商代中期，青瓷的雏形——原始瓷在越地诞生，标志着中国从陶向瓷的伟大跨越。釉的发明是陶瓷史上的里程碑。',
    achievements: [
      '商代中期出现原始青瓷，创烧于浙江上虞、萧山一带',
      '发明石灰釉，以草木灰配釉，呈青黄色泽',
      '西周印纹硬陶盛行，拍印几何纹饰具有独特装饰美',
      '白陶工艺成熟，采用高岭土烧制，为后世瓷器奠定物质基础',
    ],
    representative: [
      { name: '原始青瓷尊', desc: '商代，郑州二里岗出土，最早的青瓷器之一' },
      { name: '白陶刻纹豆', desc: '殷墟出土，器表雕刻精美饕餮纹' },
      { name: '印纹硬陶罐', desc: '西周，通体拍印回纹、米字纹' },
    ],
    typicalArtifacts: [
      {
        name: '原始青瓷尊',
        desc: '商代中期的代表性器物，出土于郑州二里岗遗址。尊高25.6厘米，敞口、鼓腹、平底，通体施青黄色釉。这是目前发现的最早的原始青瓷器之一，证明中国瓷器的起源可追溯至3500年前。',
        imagePrompt: 'Shang Dynasty proto-porcelain celadon zun wine vessel, olive green lime glaze on stoneware body, ancient Chinese ceramic artifact, museum photography with neutral background',
      },
      {
        name: '白陶刻纹豆',
        desc: '殷墟出土的白陶精品，采用高岭土烧制，胎质洁白细腻。器身雕刻精美的饕餮纹、夔龙纹，与同时期青铜器纹样如出一辙。白陶是当时贵族专用的礼器，数量稀少，弥足珍贵。',
        imagePrompt: 'Shang Dynasty white pottery dou vessel with carved taotie mask pattern, high-fired kaolin clay ceramic, intricate relief carving, archaeological museum presentation',
      },
      {
        name: '印纹硬陶罐',
        desc: '西周时期流行的印纹硬陶，器表通体拍印几何纹样，常见的有回纹、米字纹、方格纹、云雷纹等。陶胎坚硬，呈灰褐或紫褐色，烧成温度接近原始瓷水平。',
        imagePrompt: 'Western Zhou Dynasty stamped hard pottery jar with geometric pattern, brownish grey ceramic, impressed designs all over body, ancient Chinese earthenware, museum exhibition lighting',
      },
    ],
    glazeFeatures: [
      {
        name: '青黄石灰釉',
        color: '#808040',
        description: '世界上最早的陶瓷釉，商代中期发明。以草木灰为主要原料，配以瓷石或黄土，利用草木灰中的氧化钙作为助熔剂，烧成温度约1200°C，釉色多呈青黄或黄绿色。',
        formula: '草木灰 + 瓷石 + 黄土',
      },
      {
        name: '褐釉陶衣',
        color: '#6B4423',
        description: '商代陶器上的褐色薄层，以富含铁的泥浆涂刷胎体表面，入窑烧成后形成深褐或黑褐色的陶衣，是从陶衣向真正釉过渡的形态。',
      },
    ],
    craftEvolutions: [
      {
        title: '石灰釉的发明',
        description: '商代陶工偶然发现落在陶器表面的草木灰经高温熔化后形成光亮的玻璃质薄层，经过反复试验，发明了以草木灰为原料的石灰釉。',
        impact: '釉的发明是陶瓷史上最伟大的革命之一，使人类从陶器时代进入瓷器时代。石灰釉技术沿用至今，是所有青瓷釉系的源头。',
      },
      {
        title: '高岭土的发现',
        description: '商周时期，先民在江西、湖南等地发现了洁白细腻的高岭土（瓷土），并尝试用其烧制白陶。高岭土中氧化铝含量高，耐火度高，是烧制瓷器的理想原料。',
        impact: '高岭土的发现和应用，为东汉晚期成熟瓷器的诞生奠定了物质基础，是景德镇成为千年瓷都的根本原因。',
      },
      {
        title: '龙窑的雏形',
        description: '商周时期，南方越地出现了依山而建的长条形窑炉，称为"龙窑"。龙窑利用自然坡度形成抽力，火焰流动顺畅，窑温高且均匀，产量大。',
        impact: '龙窑技术是中国南方青瓷传统的核心技术，沿用数千年之久，越窑、龙泉窑、建窑等名窑均采用龙窑烧制。',
      },
    ],
    imagePrompt: 'Early Shang dynasty proto-porcelain celadon zun vessel with olive green glaze, ancient bronze aesthetic, museum quality photography, subtle lighting',
  },
  {
    id: 'han',
    dynasty: '汉代',
    period: '瓷器成熟 · 釉陶勃兴',
    year: '公元前202年 — 公元220年',
    startYear: -202,
    endYear: 220,
    color: '#6B8E6B',
    summary: '真正意义上的瓷器诞生于东汉',
    description: '汉代是中国陶瓷史上承前启后的重要时期。北方铅釉陶绚丽多彩，明器雕塑生动传神。东汉晚期，浙江上虞越窑烧制出成熟青瓷，完成了从原始瓷到真正瓷器的质变，这是划时代的伟大成就。',
    achievements: [
      '东汉晚期越窑烧制出成熟青瓷，吸水率低、胎釉结合紧密',
      '北方发明铅釉陶，以铅为助熔剂，绿釉、黄釉、褐釉色彩缤纷',
      '低温铅釉陶明器种类繁多，楼阁、谷仓、人物、动物皆可入陶',
      '龙窑技术改进，火膛与窑床分离，产量与质量双提升',
    ],
    representative: [
      { name: '越窑青瓷四系罐', desc: '东汉晚期，上虞出土，成熟瓷器的标准器' },
      { name: '绿釉陶博山炉', desc: '西汉，仙山造型，象征海上蓬莱三山' },
      { name: '击鼓说唱俑', desc: '东汉四川陶塑，神态诙谐，被誉为"天下第一俑"' },
    ],
    typicalArtifacts: [
      {
        name: '越窑青瓷四系罐',
        desc: '东汉晚期浙江上虞出土的成熟青瓷标准器。罐高22.5厘米，直口、鼓腹、平底，肩部贴有四个桥形系。胎质灰白细腻，釉色青润均匀，胎釉结合紧密，吸水率低，标志着瓷器烧制技术完全成熟。',
        imagePrompt: 'Eastern Han Dynasty Yue kiln celadon four-lobed jar, mature green glaze porcelain with smooth surface, ancient Chinese ceramic, soft museum lighting against neutral background',
      },
      {
        name: '绿釉陶博山炉',
        desc: '西汉时期的低温铅釉陶精品。炉盖堆塑成重峦叠嶂的仙山造型，其间点缀珍禽异兽、羽人仙草，象征传说中的海上蓬莱三山。通体施翠绿铅釉，色彩明丽，是汉代神仙信仰的实物见证。',
        imagePrompt: 'Western Han Dynasty green lead-glazed pottery Boshan incense burner with mythical mountain lid, detailed relief sculpture of animals and immortals, emerald glaze color, museum quality photography',
      },
      {
        name: '击鼓说唱俑',
        desc: '东汉四川彭山出土的陶塑杰作，被誉为"天下第一俑"。俑高55厘米，头戴帻，左臂抱鼓，右手举槌作欲击状，面部表情诙谐生动，张口嬉笑，是汉代陶塑艺术的巅峰之作。',
        imagePrompt: 'Eastern Han Dynasty pottery storytelling drummer figurine, Sichuan style terracotta sculpture, expressive face with wide smile, holding drum and stick, museum lighting, warm tones',
      },
    ],
    glazeFeatures: [
      {
        name: '越窑青釉',
        color: '#708090',
        description: '东汉晚期在上虞越窑烧制成功的真正意义上的瓷釉。以瓷石配釉，釉层透明莹润，釉色淡青或青绿，胎釉结合牢固，吸水率在0.5%以下，完全符合现代瓷器标准。',
        formula: '瓷石 + 少量草木灰',
      },
      {
        name: '铅绿釉',
        color: '#2E8B57',
        description: '汉代北方发明的低温色釉，以铅的氧化物为助熔剂，以铜为着色剂，烧成温度约700-800°C，釉色翠绿鲜亮，光洁如翡翠。因烧成温度低，多用于明器陪葬。',
        formula: '铅粉 + 铜矿石 + 石英砂',
      },
      {
        name: '铅黄釉',
        color: '#CD853F',
        description: '与铅绿釉同时期的低温釉，以铁为着色剂，呈深浅不同的黄色或黄褐色。常与绿釉、褐釉配合使用，形成多彩装饰效果，是唐三彩的直接源头。',
      },
    ],
    craftEvolutions: [
      {
        title: '成熟青瓷的烧成',
        description: '东汉晚期，浙江上虞的陶工通过精选瓷土、改进釉料配方、提升窑温和延长保温时间，终于烧制出胎质致密、釉色莹润、胎釉结合牢固的成熟青瓷。',
        impact: '这是人类文明史上的里程碑——中国成为世界上第一个发明瓷器的国家，比欧洲早了近1800年。瓷器从此成为中华文明对世界文明最伟大的贡献之一。',
      },
      {
        title: '低温铅釉技术',
        description: '汉代北方陶工发明了以铅为助熔剂的低温釉技术，在700-800°C即可烧成色彩鲜艳的釉陶。铅釉的发明开辟了低温色釉的新领域。',
        impact: '铅釉技术直接催生了唐代的三彩陶，影响深远。此外，低温铅釉的色彩表现力为后世彩绘瓷的发展提供了重要的技术借鉴。',
      },
      {
        title: '快轮拉坯成型',
        description: '汉代制陶成型技术取得重大突破，快轮拉坯技术成熟。匠人坐在快速转动的轮车前，双手提拉泥料成型，效率和质量远胜于泥条盘筑和慢轮修整。',
        impact: '快轮拉坯是陶瓷成型技术的革命，沿用两千余年至今，是景德镇等传统瓷区的核心技艺，使大批量、标准化生产瓷器成为可能。',
      },
    ],
    imagePrompt: 'Han Dynasty green lead-glazed pottery Boshan incense burner with mythical mountain lid, terracotta warrior style aesthetic, museum display lighting',
  },
  {
    id: 'sui-tang',
    dynasty: '隋唐五代',
    period: '南青北白 · 三彩华章',
    year: '公元581年 — 960年',
    startYear: 581,
    endYear: 960,
    color: '#CD853F',
    summary: '制瓷业格局形成，唐三彩名震寰宇',
    description: '隋唐盛世，陶瓷艺术百花齐放。"南青北白"格局确立——越窑青瓷如冰似玉，邢窑白瓷类银类雪。绚烂夺目的唐三彩是盛唐气象的缩影，长沙窑釉下彩绘开后世彩瓷先河。',
    achievements: [
      '越窑"秘色瓷"烧制成功，成为供奉朝廷的御用品',
      '邢窑白瓷"天下无贵贱通用之"，与越窑青瓷并驾齐驱',
      '唐三彩低温铅釉陶，黄、绿、白三色交融，造型雄浑饱满',
      '长沙窑发明釉下褐绿彩绘，"瓷器之路"远销海外',
    ],
    representative: [
      { name: '越窑秘色瓷花口碗', desc: '法门寺地宫出土，文献中"秘色"的实物印证' },
      { name: '邢窑白瓷"盈"字款罐', desc: '唐代官窑精品，釉色洁白如雪' },
      { name: '三彩骆驼载乐俑', desc: '盛唐杰作，丝绸之路文化交融的见证' },
    ],
    typicalArtifacts: [
      {
        name: '越窑秘色瓷花口碗',
        desc: '1987年陕西扶风法门寺塔基地宫出土，是文献记载中"秘色瓷"的首次实物发现。碗高9.4厘米，口径21.4厘米，口沿呈五瓣花形，通体施青绿色釉，釉面均匀莹润，如千峰翠色，如冰似玉。',
        imagePrompt: 'Tang Dynasty Yue kiln mi-se secret color porcelain flower-mouth bowl, exquisite celadon glaze with jade-like texture, five-petal flower rim, museum photography, soft diffused lighting',
      },
      {
        name: '邢窑白瓷"盈"字款罐',
        desc: '唐代邢窑为皇室烧制的官窑精品。罐底阴刻"盈"字款，是专为宫廷"百宝大盈库"烧制的御用瓷器。胎质坚致细腻，釉色洁白如雪，类银类雪，代表了唐代白瓷的最高水平。',
        imagePrompt: 'Tang Dynasty Xing kiln white porcelain jar with Ying character mark, pure white glaze with silver-like sheen, elegant simple form, museum presentation on dark silk background',
      },
      {
        name: '三彩骆驼载乐俑',
        desc: '盛唐时期的三彩杰作，1959年西安出土。骆驼昂首挺立，背驮一支由七名乐工和一名舞者组成的"胡汉乐队"，胡汉乐手共奏胡乐，生动再现了丝绸之路文化交融的盛景。',
        imagePrompt: 'Tang Dynasty sancai tri-colored glazed pottery camel carrying musicians, vibrant yellow green amber glazes, lively group of musicians and dancer on camel back, museum dramatic lighting',
      },
    ],
    glazeFeatures: [
      {
        name: '越窑秘色釉',
        color: '#6B8E6B',
        description: '唐代越窑专为皇室烧制的顶级青瓷釉，釉料配方秘不示人，故称"秘色"。釉色如千峰翠色，如冰似玉，釉面莹润光泽，唐人有"九秋风露越窑开，夺得千峰翠色来"之美誉。',
      },
      {
        name: '邢窑白釉',
        color: '#F5F5DC',
        description: '唐代邢窑创烧的成熟白瓷釉，以优质瓷土配釉，釉色洁白纯净，类银类雪。陆羽《茶经》评价"邢瓷类银，越瓷类玉"，与越窑青瓷并称"南青北白"。',
      },
      {
        name: '唐三彩釉',
        color: '#DAA520',
        description: '唐代盛行的低温铅釉，以黄（铁）、绿（铜）、白（无色透明）三色为主，兼用蓝、褐等色。利用铅釉的流动性，在烧制过程中自然流淌交融，形成绚丽斑斓的效果。',
        formula: '铅粉 + 石英 + 着色金属氧化物（铜/铁/钴）',
      },
      {
        name: '长沙窑釉下彩',
        color: '#556B2F',
        description: '唐代长沙窑首创的釉下彩绘工艺，先在素胎上用褐、绿颜料绘制图案，然后施透明釉入窑烧成。纹饰题材广泛，开后世青花、釉里红等釉下彩瓷之先河。',
      },
    ],
    craftEvolutions: [
      {
        title: '白瓷烧制技术成熟',
        description: '隋代至初唐，河北邢窑的工匠通过精选含铁量极低的瓷土，反复淘洗精炼，控制窑炉的氧化还原气氛，终于烧制出真正成熟的白瓷。',
        impact: '白瓷的成熟打破了青瓷一统天下的格局，形成"南青北白"的制瓷业格局。更重要的是，白瓷为后世所有彩绘瓷（青花、粉彩、珐琅彩等）提供了理想的"画布"。',
      },
      {
        title: '釉下彩绘的发明',
        description: '中晚唐时期，湖南长沙窑（铜官窑）的工匠创造性地将绘画艺术与陶瓷工艺结合，在素胎上用褐、绿颜料绘制图案，然后施透明釉入窑高温烧成。',
        impact: '长沙窑釉下彩绘的发明，开辟了陶瓷装饰从釉色装饰转向绘画装饰的新纪元，是元青花、明清五彩粉彩等彩绘瓷的直接技术源头。',
      },
      {
        title: '匣钵装烧技术',
        description: '唐代越窑等窑场广泛使用匣钵装烧瓷器，将器物放入耐火泥制成的匣钵中入窑烧制，避免火焰直接接触器表和落灰，使釉面更加光洁莹润。',
        impact: '匣钵技术是提高瓷器质量的关键工艺革新，使秘色瓷等高档瓷器的稳定生产成为可能，此技术一直沿用至今。',
      },
    ],
    imagePrompt: 'Tang Dynasty tri-colored sancai glazed pottery camel carrying musicians, vibrant yellow green amber glazes, museum exhibition, dramatic lighting',
  },
  {
    id: 'song',
    dynasty: '宋代',
    period: '五大名窑 · 美学巅峰',
    year: '公元960年 — 1279年',
    startYear: 960,
    endYear: 1279,
    color: '#708090',
    summary: '中国古代陶瓷艺术的黄金时代',
    description: '宋代是中国陶瓷艺术的巅峰时期，哲学思想与制瓷技艺完美融合。汝、官、哥、定、钧五大名窑各领风骚，釉色追求自然天成的意境。宋代瓷器以典雅含蓄、极简清逸的美学品格，成为后世难以逾越的高峰。',
    achievements: [
      '汝窑天青釉，"雨过天青云破处"的千古绝唱',
      '官窑、哥窑开片装饰，金丝铁线，自然天成的残缺之美',
      '定窑白瓷刻印花，定窑红、绿、黑釉异彩纷呈',
      '钧窑铜红窑变，"入窑一色，出窑万彩"的神奇窑变艺术',
      '景德镇青白瓷（影青）创烧，"假玉器"美誉流传',
      '建窑兔毫盏、油滴盏，斗茶风尚催生黑釉瓷艺术高峰',
    ],
    representative: [
      { name: '汝窑天青釉洗', desc: '北宋，传世仅七十余件，台北故宫博物院镇馆之宝' },
      { name: '哥窑鱼耳炉', desc: '金丝铁线开片，"聚沫攒珠"气泡特征' },
      { name: '钧窑玫瑰紫釉花盆', desc: '窑变绚丽，宋徽宗御用"花石纲"之物' },
      { name: '建窑曜变天目茶盏', desc: '宋代斗茶至宝，日本视为国宝' },
    ],
    typicalArtifacts: [
      {
        name: '汝窑天青釉洗',
        desc: '北宋汝窑为宫廷烧制的御用瓷器，传世仅约七十件。洗高3.5厘米，口径13.8厘米，通体施天青釉，釉面有细密开片。釉色如雨过天晴，温润如玉，"雨过天青云破处，这般颜色做将来"即指此色。',
        imagePrompt: 'Northern Song Dynasty Ru ware sky blue glaze porcelain brush washer, delicate crackle pattern, minimalist aesthetic, soft diffused museum lighting, celadon tone on silk background',
      },
      {
        name: '哥窑鱼耳炉',
        desc: '宋代哥窑的经典作品，因模仿商周青铜礼器簋的造型而得名。通体施青釉，釉面开片有"金丝铁线"之别——深褐色粗纹为"铁线"，金黄色细纹为"金丝"，自然天成，妙趣横生。',
        imagePrompt: 'Song Dynasty Ge ware fish-ear censer with golden thread and iron wire crackle pattern, milky celadon glaze with intricate network of cracks, antique museum display lighting',
      },
      {
        name: '钧窑玫瑰紫釉花盆',
        desc: '北宋钧窑为宋徽宗"花石纲"烧制的御用器物。盆通体呈玫瑰紫与天蓝色交融的窑变釉色，绚丽多彩，变幻莫测。底部刻有数目字"十"，表明其为成套十种规格中最大的一件。',
        imagePrompt: 'Song Dynasty Jun ware rose purple glaze flower pot, stunning copper red and sky blue flambe glaze, kiln transformation effects, museum dramatic lighting against dark background',
      },
      {
        name: '建窑曜变天目茶盏',
        desc: '宋代福建建窑烧制的斗茶专用茶盏，被誉为"碗中宇宙"。盏内外黑釉上自然形成一圈圈带有彩虹般光晕的斑点，如同深夜星空，曜变光彩。传世仅三件，均被日本列为国宝。',
        imagePrompt: 'Song Dynasty Jian ware yohen tenmoku tea bowl with starry sky iridescent oil spots, black glaze with rainbow halo effect, dramatic museum lighting in dark environment',
      },
    ],
    glazeFeatures: [
      {
        name: '汝窑天青釉',
        color: '#89A0A8',
        description: '宋代汝窑的天青釉，被誉为中国青瓷釉色的巅峰。以玛瑙为釉，釉色如雨过天晴，釉面莹润如玉，釉层中稀疏的气泡如"晨星稀朗"，开片细密如"蝉翼纹"。',
        formula: '瓷石 + 玛瑙末 + 少量草木灰',
      },
      {
        name: '官窑粉青釉',
        color: '#9FB8AD',
        description: '宋代官窑青瓷釉，釉色呈淡雅的粉青色，釉层肥润莹澈，如脂似玉。利用胎釉膨胀系数差异，烧成后自然形成开片，"紫口铁足"与金丝铁线开片相映成趣。',
      },
      {
        name: '钧窑铜红釉',
        color: '#8B3A3A',
        description: '宋代钧窑首创的铜红窑变釉，以铜为着色剂，在高温还原焰中烧成。铜离子在釉中呈现出瑰丽多变的红色、紫色、蓝色交融的窑变效果，"入窑一色，出窑万彩"。',
      },
      {
        name: '建窑黑釉',
        color: '#1A1A1A',
        description: '宋代建窑烧制的黑釉茶盏，以含铁量高的紫金土为釉料，在高温下釉面形成兔毫纹、油滴斑、曜变等各种神奇的自然结晶纹饰。宋代斗茶风尚使黑釉盏成为时代宠儿。',
      },
      {
        name: '定窑白釉',
        color: '#FFF8DC',
        description: '宋代定窑白瓷釉，釉色白中微泛黄，有如象牙质感。器内多采用刻花、划花、印花装饰，纹样精美。定窑还烧制红釉、绿釉、黑釉等彩色釉瓷，"红定"、"黑定"尤为珍贵。',
      },
    ],
    craftEvolutions: [
      {
        title: '开片釉装饰工艺',
        description: '宋代官窑和哥窑的工匠巧妙利用胎釉膨胀系数不同的特点，使器物在冷却过程中釉层自然开裂形成开片，并通过"出窑显色"工艺使裂纹呈现"金丝铁线"的效果。',
        impact: '开片装饰将工艺缺陷升华为独特的美学追求，体现了宋代"道法自然"、"残缺之美"的哲学思想，深刻影响了后世的陶瓷美学观念。',
      },
      {
        title: '铜红窑变技术',
        description: '宋代钧窑工匠在釉料中加入铜的氧化物作为着色剂，在高温还原气氛中巧妙控制窑温和气氛变化，使铜离子在釉中呈现出变幻莫测的红、紫、蓝交融的窑变效果。',
        impact: '铜红窑变技术是世界陶瓷史上的重大突破，元代釉里红、明清郎窑红、祭红等名贵红釉瓷器均直接源自钧窑的铜红釉技术。',
      },
      {
        title: '覆烧工艺',
        description: '宋代定窑发明的装烧工艺，将器物倒扣在支圈上叠烧，一匣可装多件，大大提高了窑炉利用率和产量。覆烧器物口沿因无釉形成"芒口"，需镶金银扣为饰。',
        impact: '覆烧工艺使瓷器产量大幅提高，定窑成为宋代产量最大的窑场之一。虽因"芒口"不便使用被汝窑替代，但这一高效装烧技术在陶瓷工业史上具有重要意义。',
      },
    ],
    imagePrompt: 'Song Dynasty Ru ware sky blue glaze porcelain brush washer, delicate crackle pattern, minimalist aesthetic, soft diffused museum lighting, celadon tone',
  },
  {
    id: 'yuan',
    dynasty: '元代',
    period: '青花瓷崛起 · 釉里红问世',
    year: '公元1271年 — 1368年',
    startYear: 1271,
    endYear: 1368,
    color: '#2C3E50',
    summary: '景德镇成为瓷都，彩瓷时代开启',
    description: '元代虽国祚短暂，却在中国陶瓷史上写下浓墨重彩的一笔。景德镇异军突起，成为全国制瓷中心。元青花雄浑大气、笔意酣畅，将中国绘画与制瓷工艺完美结合，自此开启彩瓷统治瓷坛的新篇章。',
    achievements: [
      '元青花成熟烧造，进口苏麻离青料发色浓艳，铁锈斑自然',
      '釉里红烧制成功，铜红釉下彩与青花并称"青花釉里红"',
      '卵白釉（枢府瓷）创烧，色白微青如鹅卵',
      '景德镇设立"浮梁瓷局"，开创官窑制度先河',
      '钴蓝釉、铜红釉单色釉烧制成熟',
    ],
    representative: [
      { name: '青花萧何月下追韩信梅瓶', desc: '元青花极品，南京市博物馆镇馆之宝' },
      { name: '青花鬼谷子下山图罐', desc: '2005年伦敦佳士得拍出2.3亿元人民币' },
      { name: '釉里红开光镂花大罐', desc: '河北保定出土，釉里红代表作' },
    ],
    typicalArtifacts: [
      {
        name: '青花萧何月下追韩信梅瓶',
        desc: '元青花中的极品，1950年江苏南京沐英墓出土。瓶高44.1厘米，通体绘萧何月下追韩信的历史故事，人物神态生动，青花发色浓艳青翠，有"青花之王"的美誉，是南京市博物馆的镇馆之宝。',
        imagePrompt: 'Yuan Dynasty blue and white porcelain meiping vase with Xiao He chasing Han Xin painting, vivid cobalt blue patterns on white body, historical figure scene, museum dramatic dark background lighting',
      },
      {
        name: '青花鬼谷子下山图罐',
        desc: '元青花的代表作品，2005年在伦敦佳士得拍卖会上以1568.8万英镑（约合2.3亿元人民币）成交，创下当时中国艺术品拍卖世界纪录。罐腹主题纹饰描绘鬼谷子下山营救弟子孙膑的故事。',
        imagePrompt: 'Yuan Dynasty blue and white porcelain jar with Guiguzi descending the mountain painting, rich cobalt blue with iron spot effects, large round jar, museum photography, dramatic lighting',
      },
      {
        name: '釉里红开光镂花大罐',
        desc: '1965年河北保定出土，是元代釉里红瓷器的代表作。罐高30.4厘米，通体釉里红装饰，腹部有四个菱形开光，内镂雕四季花卉，纹饰繁复精美。釉里红烧造难度极大，此器弥足珍贵。',
        imagePrompt: 'Yuan Dynasty underglaze red porcelain jar with openwork carved flower design, copper red glaze with intricate relief carving, rare ceramic artifact, museum exhibition lighting',
      },
    ],
    glazeFeatures: [
      {
        name: '苏麻离青青花料',
        color: '#192B52',
        description: '元青花使用的进口钴料，产自西亚波斯地区。青花发色浓艳青翠，釉面常有自然形成的铁锈斑（锡光），深入胎骨，呈凹凸不平状。这种独特的发色效果使元青花具有雄浑大气的艺术风格。',
        formula: '进口钴土矿（高铁低锰型）',
      },
      {
        name: '铜红釉里红',
        color: '#8B0000',
        description: '元代景德镇窑工在宋代钧窑铜红釉基础上发明的釉下彩工艺，以铜的氧化物为着色剂，在素胎上绘画后施透明釉，高温还原焰烧成。因铜红对窑温气氛极为敏感，成品率极低，弥足珍贵。',
      },
      {
        name: '枢府卵白釉',
        color: '#F0EAD6',
        description: '元代景德镇枢密院定烧的官窑瓷器，釉色白中微青如鹅卵，故称"卵白釉"。釉层肥厚莹润，器内多模印"枢府"二字。这种乳浊感极强的白釉为明代永乐甜白釉的出现奠定了基础。',
      },
      {
        name: '霁蓝釉',
        color: '#001F3F',
        description: '元代景德镇创烧的高温钴蓝釉，釉色深沉如蓝宝石，釉面匀净莹润。因釉色深沉庄重，多用作祭祀礼器。常与描金、白花装饰结合，金碧辉煌，极其华贵。',
      },
    ],
    craftEvolutions: [
      {
        title: '青花绘制工艺成熟',
        description: '元代景德镇工匠将中国传统绘画艺术与陶瓷工艺完美结合，用进口苏麻离青料在瓷胎上自由挥洒绘制，烧成后蓝白相映，将陶瓷装饰推向了绘画艺术的新高度。',
        impact: '元青花的成熟标志着中国陶瓷从以釉色装饰为主的时代进入了以彩绘装饰为主的时代。青花瓷从此成为中国瓷器的主流品种，影响遍及全世界。',
      },
      {
        title: '二元配方法的发明',
        description: '元代景德镇陶工创造性地将瓷石与高岭土按一定比例配合使用（所谓"二元配方"），使胎体中氧化铝含量提高，烧成温度可达1300°C，胎质更加坚致，不易变形。',
        impact: '二元配方法是景德镇制瓷业的核心技术秘密，使景德镇能够烧造出大型、规整、高质量的瓷器，奠定了景德镇成为"瓷都"的技术基础。',
      },
      {
        title: '浮梁瓷局的设立',
        description: '公元1278年，元世祖忽必烈在景德镇设立"浮梁瓷局"，专门负责为宫廷和官府烧造瓷器，这是中国历史上第一个正式的官方瓷器管理机构。',
        impact: '浮梁瓷局的设立开创了官窑制度的先河，使景德镇的制瓷业得到国家层面的支持，汇集了全国最优秀的工匠和最优质的原料，为景德镇成为世界瓷都奠定了制度基础。',
      },
    ],
    imagePrompt: 'Yuan Dynasty blue and white porcelain meiping vase with figure story painting, vivid cobalt blue patterns on white body, museum photography, dramatic dark background',
  },
  {
    id: 'ming',
    dynasty: '明代',
    period: '御器厂建立 · 斗彩五彩争奇',
    year: '公元1368年 — 1644年',
    startYear: 1368,
    endYear: 1644,
    color: '#A83232',
    summary: '景德镇独领风骚，彩瓷艺术繁盛',
    description: '明代景德镇成为名副其实的"瓷都"，御器厂设立专为皇家烧造瓷器。永乐宣德青花开一代新风，成化斗彩精巧绝伦，嘉靖万历五彩浓艳华丽。永宣甜白、弘治娇黄、宣德霁红等单色釉亦登峰造极。',
    achievements: [
      '永乐、宣德青花"发旷古之未有"，"永宣青花"成为青花典范',
      '成化斗彩创烧成功，釉下青花与釉上彩交相辉映，鸡缸杯名扬天下',
      '嘉靖、万历五彩色彩斑斓，红浓绿艳，风格豪放',
      '单色釉名品辈出：永乐甜白、宣德霁红霁蓝、弘治娇黄、德化象牙白',
      '铜胎掐丝珐琅（景泰蓝）工艺成熟，与瓷器争奇斗艳',
    ],
    representative: [
      { name: '永乐青花缠枝莲纹压手杯', desc: '明代青花之冠，杯心"永乐年制"四字篆书款' },
      { name: '成化斗彩鸡缸杯', desc: '釉下青花勾勒，釉上填彩，2014年香港拍出2.8亿港元' },
      { name: '万历五彩百鹿纹尊', desc: '釉色浓艳，寓意"百禄"，官窑精品' },
      { name: '德化窑何朝宗款观音像', desc: '"中国白"登峰造极之作，"东方艺术明珠"' },
    ],
    typicalArtifacts: [
      {
        name: '永乐青花缠枝莲纹压手杯',
        desc: '明代永乐朝官窑青花的代表作品，因杯心绘有"永乐年制"四字篆书款而成为孤例。杯高5.2厘米，口径9.3厘米，胎质细腻洁白，青花发色浓艳，造型端庄秀雅，被誉为"明代青花之冠"。',
        imagePrompt: 'Ming Dynasty Yongle period blue and white porcelain lotus pattern hand-pressing cup, delicate small cup with Yongle mark inside, elegant porcelain museum photography, soft lighting',
      },
      {
        name: '成化斗彩鸡缸杯',
        desc: '明成化朝官窑斗彩的巅峰之作，杯身以釉下青花勾勒轮廓，釉上填绘红、绿、黄、紫等彩料，描绘公鸡、母鸡与雏鸡嬉戏于花丛间。2014年香港苏富比拍卖以2.8亿港元成交，创下中国瓷器拍卖纪录。',
        imagePrompt: 'Ming Dynasty Chenghua period doucai chicken cup with overglaze enamel colors, delicate porcelain with roosters hens and chicks painting, elegant museum display on silk cushion',
      },
      {
        name: '万历五彩百鹿纹尊',
        desc: '明万历朝官窑五彩的代表作品。尊通体以红、绿、黄、蓝、褐等彩料绘制百鹿纹，鹿群形态各异，奔跑嬉戏于山林之间。百鹿谐音"百禄"，寓意吉祥，色彩浓艳热烈，是万历五彩的精品。',
        imagePrompt: 'Ming Dynasty Wanli period wucai five-color porcelain hundred deer zun vase, vibrant red green yellow overglaze enamel painting, large ceremonial vessel, dramatic museum lighting',
      },
      {
        name: '德化窑何朝宗款观音像',
        desc: '明代福建德化窑"瓷圣"何朝宗的传世杰作。观音像高46厘米，通体施象牙白釉，釉面温润如玉。观音神态慈祥端庄，衣纹飘逸流畅，代表了德化白瓷的最高水平，被誉为"东方艺术明珠"。',
        imagePrompt: 'Ming Dynasty Dehua kiln He Chaozong white porcelain Guanyin statue, ivory white glaze, elegant flowing robes, serene expression, museum photography against dark silk background',
      },
    ],
    glazeFeatures: [
      {
        name: '永宣青花料',
        color: '#1F3A5F',
        description: '明代永乐、宣德朝官窑青花使用的"苏麻离青"进口料，青花发色浓艳苍翠，铁锈斑自然晕散，如中国水墨画般韵味无穷，被誉为"开一代未有之奇"，成为青花艺术的典范。',
      },
      {
        name: '永乐甜白釉',
        color: '#FFFAF0',
        description: '明代永乐朝官窑创烧的顶级白瓷釉，釉色洁白温润，如糖似蜜，给人以"甜"的美感，故称"甜白"。胎体极薄，甚至能够透光见影，达到了白瓷艺术的巅峰。',
      },
      {
        name: '宣德霁红釉',
        color: '#722F37',
        description: '明代宣德朝官窑烧制的高温铜红釉，釉色深沉莹润如初凝的牛血，故称"霁红"或"祭红"。因釉色庄重肃穆，多用于祭祀郊庙。有"宣德祭红，价值千金"之说。',
      },
      {
        name: '弘治娇黄釉',
        color: '#F4C430',
        description: '明代弘治朝创烧的低温黄釉，釉色娇嫩淡雅如鸡油，故称"娇黄"或"鸡油黄"。因黄釉瓷器为皇家御用，象征皇权至尊，民窑不得僭用，故存世稀少。',
      },
      {
        name: '成化斗彩',
        color: '#C41E3A',
        description: '明成化朝创烧的彩瓷品种，先以釉下青花勾绘图案轮廓，入窑烧成后，再在釉上轮廓线内填绘红、绿、黄、紫等多种彩料，入低温彩炉复烧而成。釉下青花与釉上彩相互争奇斗艳，故称"斗彩"。',
      },
    ],
    craftEvolutions: [
      {
        title: '御器厂官窑制度',
        description: '明洪武年间，朝廷在景德镇设立御器厂，专门为皇室烧制御用瓷器。御器厂集中了全国最优秀的工匠，不惜工本，精益求精，代表了明代制瓷业的最高水平。',
        impact: '官窑制度的建立使景德镇制瓷业获得了国家层面的人力、物力和技术支持，极大地推动了制瓷技术的进步和创新，为明清两代中国瓷器称雄世界奠定了制度基础。',
      },
      {
        title: '斗彩彩绘工艺',
        description: '明成化年间，景德镇御器厂的工匠创造了"斗彩"新工艺——先以釉下青花勾绘轮廓，高温烧成后再在釉上填绘多种低温彩料，入彩炉低温烧成。釉下青花与釉上彩交相辉映。',
        impact: '斗彩的发明开辟了釉下彩与釉上彩相结合的新途径，是中国陶瓷彩绘工艺的重大突破，直接影响了后世五彩、粉彩、珐琅彩等彩瓷品种的发展。',
      },
      {
        title: '五彩彩绘工艺',
        description: '明代嘉靖、万历时期，在斗彩基础上发展出"五彩"工艺。五彩以红、绿、黄、蓝、紫五种颜色为主，色彩浓艳热烈，纹饰豪放饱满，不强调釉下青花的轮廓作用，画面更加自由奔放。',
        impact: '五彩工艺使中国陶瓷彩绘艺术更加丰富多彩，与素雅的青花形成鲜明对比。清代粉彩、珐琅彩等名贵彩瓷品种都是在五彩的基础上发展创新而来。',
      },
    ],
    imagePrompt: 'Ming Dynasty Chenghua doucai chicken cup with overglaze enamel colors, delicate porcelain with roosters and flowers, elegant museum display',
  },
  {
    id: 'qing',
    dynasty: '清代',
    period: '康雍乾盛世 · 陶瓷集大成',
    year: '公元1644年 — 1912年',
    startYear: 1644,
    endYear: 1912,
    color: '#C9A962',
    summary: '中国古代陶瓷的最后辉煌',
    description: '清代康雍乾三朝，中国制瓷业达到历史巅峰。景德镇御窑厂荟萃能工巧匠，仿古创新无所不精。康熙青花五彩苍劲有力，雍正粉彩典雅秀丽，乾隆珐琅彩华丽繁缛。转心瓶、镂空套瓶等奇技淫巧，令人叹为观止。',
    achievements: [
      '康熙"翠毛蓝"青花分五色层次，山水人物如纸上绘画',
      '粉彩（软彩）创烧，玻璃白粉打底，颜色柔和粉嫩',
      '珐琅彩由宫廷画师绘制，料彩精细，"古月轩"珍品',
      '郎窑红、霁红、豇豆红，铜红釉再创辉煌',
      '各种高低温颜色釉多达数十种，"厂官釉"仿制宋代名窑',
      '转心瓶、交泰瓶、镂空套瓶等工艺登峰造极',
    ],
    representative: [
      { name: '康熙青花万寿字尊', desc: '通体书写一万个不同"寿"字，为康熙祝寿而制' },
      { name: '雍正粉彩过枝桃纹盘', desc: '六桃五福，粉润娇美，雍正官窑代表作' },
      { name: '乾隆各色釉彩大瓶', desc: '"瓷母"，器身施17层釉彩，集瓷器工艺之大成' },
      { name: '乾隆珐琅彩花鸟纹瓶', desc: '宫廷画家亲绘，料地细腻，诗书画印一体' },
    ],
    typicalArtifacts: [
      {
        name: '康熙青花万寿字尊',
        desc: '清康熙朝官窑为庆祝康熙皇帝六十大寿特制的青花重器。尊通体以青花书写一万个不同字体的"寿"字，整器排列规整，气势恢宏，寓意"万寿无疆"，是康熙青花的代表作品。',
        imagePrompt: 'Qing Dynasty Kangxi period blue and white porcelain wan shou longevity character zun vase, ten thousand different shou characters all over body, large ceremonial vessel, museum photography',
      },
      {
        name: '雍正粉彩过枝桃纹盘',
        desc: '清雍正朝官窑粉彩的巅峰之作。盘内外以粉彩绘过枝桃花桃实，枝干从盘外壁延伸至盘内，绘有八颗嫣红饱满的寿桃和翩然飞舞的蝙蝠，寓意"福寿双全"。粉彩工艺精湛，色彩粉嫩娇美。',
        imagePrompt: 'Qing Dynasty Yongzheng period famille rose porcelain peach branch plate, delicate pink enamel painting of peaches and bats, elegant ceramic, soft museum lighting',
      },
      {
        name: '乾隆各色釉彩大瓶',
        desc: '清乾隆朝官窑集大成之作，被誉为"瓷母"。瓶高86.4厘米，器身自上而下装饰有17层釉彩，包括青花、粉彩、珐琅彩、斗彩、仿哥釉、仿汝釉、仿官釉、仿钧釉等，集历代名釉名彩于一器。',
        imagePrompt: 'Qing Dynasty Qianlong period multi-glaze multi-color porcelain grand vase, 17 layers of different glazes and enamels, ceramic masterpiece, luxurious museum presentation',
      },
      {
        name: '乾隆珐琅彩花鸟纹瓶',
        desc: '清乾隆朝宫廷御用珐琅彩瓷，由宫廷画家亲绘图案。瓶身绘工笔花鸟，设色精妙，栩栩如生，画面空白处配以御制诗文和朱文印章，诗书画印融为一体，是"古月轩"珐琅彩的珍品。',
        imagePrompt: 'Qing Dynasty Qianlong period falangcai enamel painted porcelain vase with flower and bird painting, imperial quality, fine brushwork, poem and seal mark, elegant museum display',
      },
    ],
    glazeFeatures: [
      {
        name: '康熙翠毛蓝',
        color: '#003366',
        description: '清康熙朝青花瓷的独特釉色，因青花发色浓翠艳丽如翠鸟羽毛而得名。康熙青花使用国产"浙料"，通过熟练的分水技法，使青花呈现出浓淡深浅五个层次，有"青花五彩"之誉。',
      },
      {
        name: '雍正粉彩',
        color: '#FFB6C1',
        description: '清雍正朝创烧成功的"粉彩"釉上彩，以玻璃白粉打底，施彩后用干净毛笔将颜色洗染晕开，使色彩呈现出由浓到淡的渐变效果，色调柔和粉嫩，故又称"软彩"，是清代彩瓷的最高成就。',
        formula: '玻璃白 + 金属氧化物着色剂',
      },
      {
        name: '乾隆珐琅彩',
        color: '#B22222',
        description: '清康熙末年从欧洲传入的"洋瓷"工艺，在景德镇烧制素胎后运至北京清宫造办处，由宫廷画师用进口珐琅彩料绘制后低温烧成。珐琅彩料色阶丰富，画面精细如西洋油画。',
      },
      {
        name: '郎窑红',
        color: '#900020',
        description: '清康熙年间江西巡抚郎廷极主持景德镇御窑时仿烧明宣德霁红釉的品种，釉色浓艳如初凝的牛血，釉面有玻璃光泽，口沿因釉层下垂而露白胎（"灯草边"），底足积釉呈深色（"垂足郎不流"）。',
      },
      {
        name: '豇豆红',
        color: '#DE3163',
        description: '清康熙朝创烧的名贵铜红釉品种，因釉色如成熟豇豆般粉红淡雅而得名。釉面常带有天然的绿色苔点，红中泛绿，相映成趣。因烧成难度极大，仅见于康熙一朝少量小件文房器物。',
      },
    ],
    craftEvolutions: [
      {
        title: '粉彩彩绘工艺',
        description: '清雍正年间，景德镇御窑工匠在五彩基础上吸收西洋珐琅彩的施彩技法，发明了"粉彩"工艺。先用玻璃白打底，再施彩料，用毛笔洗染晕开，使色彩有了明暗浓淡的变化。',
        impact: '粉彩的发明是中国陶瓷彩绘艺术的里程碑，其柔和淡雅的色彩表现力深受世人喜爱，成为清代以后彩瓷的主流品种，与青花并称为瓷器装饰的两大支柱。',
      },
      {
        title: '珐琅彩瓷工艺',
        description: '清代康熙末年，欧洲铜胎画珐琅工艺传入中国，清宫造办处的工匠将其移植到瓷胎上，创造了瓷胎画珐琅（珐琅彩）。珐琅彩料从欧洲进口，由宫廷画家绘制，是真正的"皇家御用瓷"。',
        impact: '珐琅彩将西方绘画技法与中国陶瓷工艺完美融合，极大地提高了中国彩瓷的艺术表现力，其影响深远，直接催生了粉彩的诞生，也为中国陶瓷艺术开辟了新的视野。',
      },
      {
        title: '转心瓶等特种工艺',
        description: '清乾隆年间，景德镇御窑厂的能工巧匠们创造了转心瓶、交泰瓶、镂空套瓶等各种奇巧绝伦的特种工艺瓷器。转心瓶分内瓶和外瓶，内瓶可以转动，透过外瓶镂空可见内瓶纹饰。',
        impact: '这些特种工艺代表了中国古代制瓷技术的最高水平，体现了乾隆盛世"精益求精"、"炫巧争奇"的审美追求，虽然实用价值不高，但在技术层面达到了令人叹为观止的程度。',
      },
    ],
    imagePrompt: 'Qing Dynasty Qianlong period famille rose porcelain vase with intricate flower and bird painting, imperial quality, golden accents, luxurious museum presentation',
  },
  {
    id: 'modern',
    dynasty: '近现代',
    period: '传承创新 · 大国工匠',
    year: '民国至今',
    startYear: 1912,
    endYear: 2024,
    color: '#8BA888',
    summary: '传统工艺薪火相传，陶瓷艺术走向世界',
    description: '近现代中国陶瓷历经沧桑，在战乱中艰难传承，在新时代焕发生机。珠山八友以瓷当纸、挥洒丹青；建国后"建国瓷""红色官窑"留下时代印记。今日景德镇、醴陵、宜兴、龙泉、德化等瓷区，传统与现代交融，陶瓷艺术不断开拓新境界。',
    achievements: [
      '民国珠山八友开创瓷上文人画新风，将诗书画印融为一体',
      '醴陵釉下五彩瓷成为"国瓷"，用于人民大会堂、国宴',
      '宜兴紫砂壶艺术持续发展，顾景舟等巨匠名震艺坛',
      '龙泉青瓷恢复烧制，弟窑粉青梅子青重放异彩',
      '现代陶艺兴起，与国际接轨，材料与观念不断创新',
      '陶瓷3D打印、数码施釉等新技术应用广泛',
    ],
    representative: [
      { name: '珠山八友刘雨岑粉彩花鸟瓶', desc: '"水点桃花"技法独创，设色清雅' },
      { name: '醴陵釉下五彩月季花纹餐具', desc: '人民大会堂专用瓷，毛泽东主席喜爱' },
      { name: '顾景舟制紫砂提璧壶', desc: '近现代紫砂泰斗，一壶千金' },
    ],
    typicalArtifacts: [
      {
        name: '珠山八友刘雨岑粉彩花鸟瓶',
        desc: '民国时期景德镇"珠山八友"之一刘雨岑的代表作品。刘雨岑独创"水点桃花"技法，绘桃花不用勾勒轮廓线，直接以料色点染而成，花瓣娇嫩欲滴，设色清雅脱俗，将中国文人画的意趣融入瓷画。',
        imagePrompt: 'Modern Chinese porcelain by Liu Yuchen of Zhushan Bayou group, famille rose flower and bird painting vase with water-drop peach blossom technique, literati painting style, elegant museum presentation',
      },
      {
        name: '醴陵釉下五彩月季花纹餐具',
        desc: '新中国成立后湖南醴陵为人民大会堂创制的"国瓷"。采用独创的"三烧制"釉下五彩工艺，瓷质洁白如玉，纹饰色彩鲜艳，无毒无铅，永不褪色。毛泽东主席生前最爱用此款月季花餐具。',
        imagePrompt: 'Contemporary Liling underglaze five-color porcelain tableware with rose flower pattern, official national banquet porcelain, bright vivid colors, fine china dinner set, elegant presentation',
      },
      {
        name: '顾景舟制紫砂提璧壶',
        desc: '近现代紫砂泰斗顾景舟的经典作品。壶身造型端庄大气，线条简练流畅，如古代玉璧般温润内敛。顾景舟的紫砂壶被誉为"紫砂艺术界的泰山北斗"，其作品在拍卖市场屡创天价，一壶千金。',
        imagePrompt: 'Modern Yixing purple clay teapot by Gu Jingzhou, zisha teapot with提璧 shape, elegant minimalist form, purple clay texture, studio product photography on dark background',
      },
    ],
    glazeFeatures: [
      {
        name: '醴陵釉下五彩',
        color: '#E9967A',
        description: '新中国成立后湖南醴陵独创的釉下五彩工艺，采用"三烧制"法——素烧、彩烧、釉烧，色彩多达十余种，鲜艳明快，无毒无铅，永不褪色，成为人民大会堂专用的"国瓷"。',
      },
      {
        name: '龙泉青瓷恢复釉',
        color: '#4F7942',
        description: '新中国成立后，浙江龙泉恢复了失传数百年的南宋龙泉青瓷烧制工艺。弟窑粉青釉色泽柔和淡雅，如青玉般温润；梅子青釉青翠欲滴，如枝头青梅，使千年古釉重放光彩。',
      },
      {
        name: '现代陶艺釉',
        color: '#708090',
        description: '当代陶瓷艺术家不断探索创新的各种新型釉料，包括窑变釉、结晶釉、分相釉、金属釉等，色彩和肌理更加丰富多变，为现代陶艺创作提供了广阔的表现空间。',
      },
    ],
    craftEvolutions: [
      {
        title: '瓷上文人画艺术',
        description: '民国时期，以"珠山八友"为代表的一批景德镇画家型瓷艺家，突破了传统瓷器装饰的束缚，将中国传统文人画的诗、书、画、印融为一体，在瓷胎上挥洒丹青，开创了瓷上绘画的新风格。',
        impact: '珠山八友的瓷画艺术大大提升了陶瓷的艺术品位和文化内涵，使瓷器从单纯的工艺品升华为独立的绘画艺术载体，对现当代陶瓷艺术发展影响深远。',
      },
      {
        title: '现代陶艺运动',
        description: '20世纪80年代以来，随着改革开放和国际文化交流，中国的现代陶艺运动蓬勃兴起。现代陶艺打破传统陶瓷的实用功能束缚，以纯粹的艺术表达为目的，与国际当代艺术接轨。',
        impact: '现代陶艺运动极大地拓展了陶瓷艺术的边界和可能性，使这门古老的艺术焕发了新的生命力。中国当代陶艺家在国际舞台上频频获奖，中国陶瓷正以全新的姿态走向世界。',
      },
      {
        title: '数字化制瓷技术',
        description: '进入21世纪，3D打印、数控成型、数码施釉、AI设计等高新技术逐步应用于陶瓷生产领域。传统手工技艺与现代科技相结合，为陶瓷产业开辟了全新的发展方向。',
        impact: '数字化技术正在深刻改变着传统陶瓷产业的面貌，它既提高了生产效率和精度，也为艺术家提供了前所未有的创作手段，预示着陶瓷文明将在数字时代开启新的辉煌篇章。',
      },
    ],
    imagePrompt: 'Modern Chinese ceramic art piece by 珠山八友 style, literati painting on porcelain vase with ink wash aesthetic, contemporary museum lighting, elegant presentation',
  },
];
