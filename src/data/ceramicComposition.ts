import type { CeramicMaterial, CeramicType, CeramicExperimentResult, MicroscopeSample } from '../types';

export const ceramicMaterials: CeramicMaterial[] = [
  {
    id: 'kaolin',
    name: '高岭土',
    chineseName: '高岭土',
    category: 'clay',
    color: '#F5F1E8',
    description: '又称瓷土，是陶瓷的主要原料。由长石经长期风化而成，主要成分为含水硅酸铝，具有良好的可塑性和烧结性。景德镇高岭村所产最为著名。',
    chemicalFormula: 'Al₂O₃·2SiO₂·2H₂O',
    origin: '江西景德镇高岭村',
    meltingPoint: 1785,
    properties: {
      plasticity: 85,
      sinterability: 90,
      whiteness: 95,
      refractoriness: 85,
    },
    impact: {
      hardness: 0.8,
      color: 0.1,
      translucency: 0.6,
      shrinkage: 0.7,
    },
    historicalNote: '元代以后，高岭土的发现与使用使中国瓷器质量产生了飞跃，奠定了景德镇瓷都的地位。',
  },
  {
    id: 'feldspar',
    name: '长石',
    chineseName: '长石',
    category: 'flux',
    color: '#E8E4D8',
    description: '天然助熔剂，主要含钾、钠、钙的铝硅酸盐。在高温下熔融形成玻璃相，促进瓷胎烧结，降低烧成温度。',
    chemicalFormula: 'KAlSi₃O₈ / NaAlSi₃O₈ / CaAl₂Si₂O₈',
    origin: '湖南衡山、山东新泰',
    meltingPoint: 1200,
    properties: {
      plasticity: 10,
      sinterability: 95,
      whiteness: 85,
      refractoriness: 40,
    },
    impact: {
      hardness: 0.5,
      color: 0.1,
      translucency: 0.9,
      shrinkage: 0.3,
    },
    historicalNote: '长石的使用是陶瓷从陶向瓷转变的关键技术之一，早在商周时期就已被认识和利用。',
  },
  {
    id: 'quartz',
    name: '石英',
    chineseName: '石英',
    category: 'filler',
    color: '#FAF9F5',
    description: '主要成分为二氧化硅，是陶瓷的骨架原料。提高瓷胎的机械强度和化学稳定性，减少烧成收缩。',
    chemicalFormula: 'SiO₂',
    origin: '江苏东海、海南文昌',
    meltingPoint: 1713,
    properties: {
      plasticity: 0,
      sinterability: 30,
      whiteness: 98,
      refractoriness: 95,
    },
    impact: {
      hardness: 0.9,
      color: 0.05,
      translucency: 0.7,
      shrinkage: 0.1,
    },
    historicalNote: '石英颗粒在瓷胎中形成骨架，是宋代青瓷能够达到"类玉"效果的重要物质基础。',
  },
  {
    id: 'talc',
    name: '滑石',
    chineseName: '滑石',
    category: 'flux',
    color: '#F0EEE5',
    description: '含镁的硅酸盐矿物，作为助熔剂和乳浊剂使用。可以降低烧成温度，提高釉面的温润感和白度。',
    chemicalFormula: '3MgO·4SiO₂·H₂O',
    origin: '辽宁海城、山东平度',
    meltingPoint: 1550,
    properties: {
      plasticity: 20,
      sinterability: 75,
      whiteness: 92,
      refractoriness: 60,
    },
    impact: {
      hardness: 0.4,
      color: 0.15,
      translucency: 0.4,
      shrinkage: 0.5,
    },
    historicalNote: '滑石在唐宋时期的北方窑场中广泛使用，为邢窑、定窑白瓷的"类银类雪"提供了物质基础。',
  },
  {
    id: 'limestone',
    name: '石灰石',
    chineseName: '石灰石',
    category: 'flux',
    color: '#EFEFEA',
    description: '主要成分为碳酸钙，是传统灰釉的重要原料。高温下分解为氧化钙，作为强助熔剂促进釉料熔融。',
    chemicalFormula: 'CaCO₃',
    origin: '广泛分布，以安徽铜陵、浙江衢州为佳',
    meltingPoint: 825,
    properties: {
      plasticity: 5,
      sinterability: 85,
      whiteness: 90,
      refractoriness: 20,
    },
    impact: {
      hardness: 0.3,
      color: 0.2,
      translucency: 0.8,
      shrinkage: 0.4,
    },
    historicalNote: '石灰石与草木灰配合，是商周至唐宋时期制釉的核心技术，奠定了中国早期青瓷的发展基础。',
  },
  {
    id: 'dolomite',
    name: '白云石',
    chineseName: '白云石',
    category: 'flux',
    color: '#F2F0E8',
    description: '含镁和钙的碳酸盐矿物。可以改善釉面的热稳定性，减少釉裂，增加釉面的柔润感。',
    chemicalFormula: 'CaCO₃·MgCO₃',
    origin: '江苏南京、湖北大冶',
    meltingPoint: 735,
    properties: {
      plasticity: 8,
      sinterability: 80,
      whiteness: 88,
      refractoriness: 30,
    },
    impact: {
      hardness: 0.35,
      color: 0.25,
      translucency: 0.5,
      shrinkage: 0.45,
    },
    historicalNote: '白云石在明清官窑中被广泛使用，特别是在颜色釉中，对釉面质感的提升起到了重要作用。',
  },
  {
    id: 'red_clay',
    name: '紫金土',
    chineseName: '紫金土',
    category: 'clay',
    color: '#8B4513',
    description: '含铁量极高的天然黏土，因呈色如紫金而得名。是建盏、吉州窑等黑釉瓷的核心原料，也是官窑"紫口铁足"的成因。',
    chemicalFormula: '含铁氧化物的黏土混合物',
    origin: '福建建阳、江西吉州',
    meltingPoint: 1450,
    properties: {
      plasticity: 70,
      sinterability: 75,
      whiteness: 10,
      refractoriness: 65,
    },
    impact: {
      hardness: 0.6,
      color: 0.95,
      translucency: 0.05,
      shrinkage: 0.6,
    },
    historicalNote: '宋代建窑兔毫盏之所以能呈现"兔毫走珠"的神奇效果，紫金土中的铁元素在高温下的析晶是关键。',
  },
  {
    id: 'zisha_clay',
    name: '紫砂泥',
    chineseName: '紫砂泥',
    category: 'clay',
    color: '#704214',
    description: '宜兴特产的特种黏土，含铁量高，质地细腻。烧成后呈紫红色，透气性极佳，是制作紫砂壶的绝佳材料。',
    chemicalFormula: '含铁的黏土-石英-云母系混合物',
    origin: '江苏宜兴丁蜀镇',
    meltingPoint: 1500,
    properties: {
      plasticity: 80,
      sinterability: 65,
      whiteness: 15,
      refractoriness: 70,
    },
    impact: {
      hardness: 0.5,
      color: 0.9,
      translucency: 0.02,
      shrinkage: 0.8,
    },
    historicalNote: '明代供春首创紫砂壶，后经时大彬等名家发扬光大，紫砂泥"不挂釉而自有光泽"的特性使其成为茶具之王。',
  },
  {
    id: 'bone_ash',
    name: '骨灰',
    chineseName: '骨灰',
    category: 'flux',
    color: '#F8F6F0',
    description: '由动物骨骼经高温煅烧、粉碎而成，主要成分为磷酸钙。是骨瓷的核心原料，赋予瓷器极高的白度和透光性。',
    chemicalFormula: 'Ca₃(PO₄)₂',
    origin: '传统使用牛骨，现代多使用合成磷酸钙',
    meltingPoint: 1670,
    properties: {
      plasticity: 0,
      sinterability: 70,
      whiteness: 99,
      refractoriness: 75,
    },
    impact: {
      hardness: 0.4,
      color: 0.05,
      translucency: 0.95,
      shrinkage: 0.5,
    },
    historicalNote: '骨灰的使用起源于18世纪的英国，是欧洲模仿中国白瓷过程中的重要技术创新。',
  },
  {
    id: 'mica',
    name: '云母',
    chineseName: '云母',
    category: 'filler',
    color: '#EDEBDF',
    description: '层状硅酸盐矿物，具有珍珠光泽。少量添加可增加瓷胎的细腻感和釉面的"珠光宝气"。',
    chemicalFormula: 'KAl₂(AlSi₃O₁₀)(OH)₂',
    origin: '新疆阿尔泰、四川丹巴',
    meltingPoint: 1300,
    properties: {
      plasticity: 5,
      sinterability: 50,
      whiteness: 85,
      refractoriness: 55,
    },
    impact: {
      hardness: 0.3,
      color: 0.1,
      translucency: 0.5,
      shrinkage: 0.2,
    },
    historicalNote: '云母在宋代官窑瓷器中时有发现，被认为是官窑釉面"温润如玉"质感的贡献者之一。',
  },
  {
    id: 'nepheline',
    name: '霞石',
    chineseName: '霞石',
    category: 'flux',
    color: '#E9E5DB',
    description: '含钠和钾的铝硅酸盐矿物，是优质的低温助熔剂。可以显著降低烧成温度，节约能源。',
    chemicalFormula: 'NaAlSiO₄ / KAlSiO₄',
    origin: '云南个旧、四川冕宁',
    meltingPoint: 1250,
    properties: {
      plasticity: 10,
      sinterability: 90,
      whiteness: 80,
      refractoriness: 35,
    },
    impact: {
      hardness: 0.4,
      color: 0.2,
      translucency: 0.8,
      shrinkage: 0.35,
    },
    historicalNote: '霞石的利用是现代陶瓷工业节能技术的重要突破，在卫生陶瓷和建筑陶瓷中应用广泛。',
  },
];

export const ceramicTypes: CeramicType[] = [
  {
    id: 'ru_ware',
    name: '汝窑青瓷',
    dynasty: '北宋',
    color: '#8FA8A2',
    description: '汝窑为宋代五大名窑之首，天青色釉如"雨过天青云破处"，釉面莹润如玉，开片细密如蟹爪纹。',
    composition: [
      { materialId: 'kaolin', ratio: 45 },
      { materialId: 'feldspar', ratio: 25 },
      { materialId: 'quartz', ratio: 20 },
      { materialId: 'limestone', ratio: 8 },
      { materialId: 'mica', ratio: 2 },
    ],
    properties: {
      hardness: 72,
      whiteness: 60,
      translucency: 45,
      thermalStability: 65,
      glazeSmoothness: 95,
    },
    firingTemperature: 1250,
    atmosphere: 'reduction',
    famousPieces: ['天青釉弦纹樽', '青瓷无纹水仙盆', '莲花式温碗'],
    imagePrompt: 'Ruyao porcelain, sky blue glaze, delicate crackle pattern, Song dynasty style, elegant simplicity',
  },
  {
    id: 'jun_ware',
    name: '钧窑瓷',
    dynasty: '宋金',
    color: '#C04850',
    description: '钧窑以"窑变"著称，釉色绚丽多彩，"入窑一色，出窑万彩"。红紫相映，如晚霞变幻，有"黄金有价钧无价"之说。',
    composition: [
      { materialId: 'kaolin', ratio: 40 },
      { materialId: 'feldspar', ratio: 28 },
      { materialId: 'quartz', ratio: 18 },
      { materialId: 'limestone', ratio: 10 },
      { materialId: 'dolomite', ratio: 4 },
    ],
    properties: {
      hardness: 78,
      whiteness: 55,
      translucency: 35,
      thermalStability: 70,
      glazeSmoothness: 88,
    },
    firingTemperature: 1280,
    atmosphere: 'reduction',
    famousPieces: ['玫瑰紫釉花盆', '窑变釉弦纹瓶', '月白釉出戟尊'],
    imagePrompt: 'Junyao porcelain, flame red and purple glaze, kiln transformation effect, golden threads, magnificent colors',
  },
  {
    id: 'guan_ware',
    name: '官窑青瓷',
    dynasty: '南宋',
    color: '#7A8E8A',
    description: '南宋官窑专为宫廷烧制，釉层肥厚莹润，开片较大呈"冰裂纹"，紫口铁足，器型古朴典雅。',
    composition: [
      { materialId: 'kaolin', ratio: 35 },
      { materialId: 'feldspar', ratio: 30 },
      { materialId: 'quartz', ratio: 22 },
      { materialId: 'red_clay', ratio: 8 },
      { materialId: 'limestone', ratio: 5 },
    ],
    properties: {
      hardness: 70,
      whiteness: 50,
      translucency: 30,
      thermalStability: 60,
      glazeSmoothness: 90,
    },
    firingTemperature: 1260,
    atmosphere: 'reduction',
    famousPieces: ['青釉弦纹瓶', '青瓷尊', '圆洗'],
    imagePrompt: 'Southern Song Guan ware, celadon glaze, large ice crackle pattern, purple mouth iron foot, archaistic style',
  },
  {
    id: 'ge_ware',
    name: '哥窑瓷',
    dynasty: '宋',
    color: '#6B7A78',
    description: '哥窑以开片著称，"金丝铁线"是其标志性特征。粗裂纹呈黑色如铁线，细裂纹呈金黄色如金丝。',
    composition: [
      { materialId: 'kaolin', ratio: 38 },
      { materialId: 'feldspar', ratio: 28 },
      { materialId: 'quartz', ratio: 20 },
      { materialId: 'red_clay', ratio: 10 },
      { materialId: 'talc', ratio: 4 },
    ],
    properties: {
      hardness: 68,
      whiteness: 48,
      translucency: 25,
      thermalStability: 55,
      glazeSmoothness: 85,
    },
    firingTemperature: 1240,
    atmosphere: 'reduction',
    famousPieces: ['鱼耳炉', '青釉葵瓣口盘', '菊瓣盘'],
    imagePrompt: 'Ge ware porcelain, golden threads and iron lines crackle, two-layer crackle network, matte celadon glaze',
  },
  {
    id: 'ding_ware',
    name: '定窑白瓷',
    dynasty: '北宋',
    color: '#F0EBE2',
    description: '定窑为宋代五大名窑中唯一的白瓷窑场，釉色白中泛黄如象牙，温润典雅，有"类银类雪"之誉。',
    composition: [
      { materialId: 'kaolin', ratio: 50 },
      { materialId: 'feldspar', ratio: 25 },
      { materialId: 'quartz', ratio: 18 },
      { materialId: 'talc', ratio: 5 },
      { materialId: 'dolomite', ratio: 2 },
    ],
    properties: {
      hardness: 80,
      whiteness: 85,
      translucency: 55,
      thermalStability: 75,
      glazeSmoothness: 92,
    },
    firingTemperature: 1300,
    atmosphere: 'oxidation',
    famousPieces: ['白釉刻花折枝莲纹盘', '孩儿枕', '白釉印花云龙纹盘'],
    imagePrompt: 'Ding ware porcelain, ivory white glaze, delicate carved flower pattern, elegant form, Northern Song dynasty',
  },
  {
    id: 'longquan',
    name: '龙泉青瓷',
    dynasty: '南宋',
    color: '#6B8E6B',
    description: '龙泉窑是南方青瓷的代表，粉青、梅子青釉色如玉般温润，釉层丰厚，光泽柔和，被誉为"人造美玉"。',
    composition: [
      { materialId: 'kaolin', ratio: 42 },
      { materialId: 'feldspar', ratio: 26 },
      { materialId: 'quartz', ratio: 20 },
      { materialId: 'limestone', ratio: 8 },
      { materialId: 'talc', ratio: 4 },
    ],
    properties: {
      hardness: 75,
      whiteness: 58,
      translucency: 40,
      thermalStability: 68,
      glazeSmoothness: 93,
    },
    firingTemperature: 1260,
    atmosphere: 'reduction',
    famousPieces: ['粉青釉弦纹瓶', '梅子青釉鬲式炉', '青釉凤耳瓶'],
    imagePrompt: 'Longquan celadon, plum green glaze, jade-like texture, Southern Song dynasty, elegant form',
  },
  {
    id: 'jian_ware',
    name: '建盏',
    dynasty: '宋',
    color: '#2D1F14',
    description: '建窑黑釉瓷，以兔毫、油滴、曜变等釉色闻名。黑釉上呈现出各种神奇的结晶纹理，是宋代斗茶的首选茶具。',
    composition: [
      { materialId: 'red_clay', ratio: 55 },
      { materialId: 'kaolin', ratio: 20 },
      { materialId: 'feldspar', ratio: 12 },
      { materialId: 'quartz', ratio: 8 },
      { materialId: 'limestone', ratio: 5 },
    ],
    properties: {
      hardness: 82,
      whiteness: 10,
      translucency: 5,
      thermalStability: 85,
      glazeSmoothness: 80,
    },
    firingTemperature: 1350,
    atmosphere: 'reduction',
    famousPieces: ['曜变天目茶碗', '兔毫盏', '油滴盏'],
    imagePrompt: 'Jian ware tea bowl, black glaze with golden hare fur streaks, Song dynasty, tea ceremony utensil',
  },
  {
    id: 'blue_white',
    name: '青花瓷',
    dynasty: '元明清',
    color: '#3A5F8B',
    description: '青花瓷是中国最具代表性的瓷器品种，以氧化钴为着色剂，在白瓷胎上绘画，罩透明釉后高温烧成，蓝白相映，典雅清新。',
    composition: [
      { materialId: 'kaolin', ratio: 55 },
      { materialId: 'feldspar', ratio: 22 },
      { materialId: 'quartz', ratio: 18 },
      { materialId: 'limestone', ratio: 4 },
      { materialId: 'talc', ratio: 1 },
    ],
    properties: {
      hardness: 85,
      whiteness: 90,
      translucency: 60,
      thermalStability: 80,
      glazeSmoothness: 95,
    },
    firingTemperature: 1300,
    atmosphere: 'reduction',
    famousPieces: ['元青花鬼谷子下山罐', '永乐青花压手杯', '宣德青花云龙纹扁瓶'],
    imagePrompt: 'Blue and white porcelain, intricate cobalt blue pattern on white body, Ming dynasty style, elegant',
  },
  {
    id: 'doucai',
    name: '斗彩瓷',
    dynasty: '明成化',
    color: '#C85A5A',
    description: '斗彩是釉下青花与釉上彩相结合的彩瓷品种。先用青花绘出轮廓，高温烧成后再在釉上填绘各种色彩，争奇斗艳。',
    composition: [
      { materialId: 'kaolin', ratio: 58 },
      { materialId: 'feldspar', ratio: 20 },
      { materialId: 'quartz', ratio: 17 },
      { materialId: 'limestone', ratio: 4 },
      { materialId: 'dolomite', ratio: 1 },
    ],
    properties: {
      hardness: 83,
      whiteness: 92,
      translucency: 65,
      thermalStability: 75,
      glazeSmoothness: 94,
    },
    firingTemperature: 1280,
    atmosphere: 'reduction',
    famousPieces: ['成化斗彩鸡缸杯', '斗彩葡萄纹杯', '斗彩婴戏图杯'],
    imagePrompt: 'Doucai porcelain, Chenghua style, underglaze blue combined with overglaze colorful enamel, delicate painting',
  },
  {
    id: 'yixing_zisha',
    name: '宜兴紫砂',
    dynasty: '明清至今',
    color: '#8B4513',
    description: '紫砂器是中国特有的无釉陶瓷器，用宜兴紫砂泥制成，质地细腻，透气性佳，是制作茶具的上佳材料，被誉为"世间茶具称为首"。',
    composition: [
      { materialId: 'zisha_clay', ratio: 85 },
      { materialId: 'kaolin', ratio: 10 },
      { materialId: 'quartz', ratio: 5 },
    ],
    properties: {
      hardness: 65,
      whiteness: 12,
      translucency: 2,
      thermalStability: 90,
      glazeSmoothness: 70,
    },
    firingTemperature: 1180,
    atmosphere: 'oxidation',
    famousPieces: ['供春壶', '时大彬如意纹盖壶', '陈曼生铭紫砂壶'],
    imagePrompt: 'Yixing zisha teapot, unglazed purple clay, delicate carving, Ming dynasty style, tea ceremony',
  },
  {
    id: 'bone_china',
    name: '骨瓷',
    dynasty: '现代',
    color: '#F8F5EE',
    description: '骨瓷是世界上公认的高档瓷种，因在胎料中加入动物骨灰而得名。其特点是白度高、透光性好、器型美观、釉面光润。',
    composition: [
      { materialId: 'kaolin', ratio: 25 },
      { materialId: 'bone_ash', ratio: 45 },
      { materialId: 'feldspar', ratio: 20 },
      { materialId: 'quartz', ratio: 8 },
      { materialId: 'talc', ratio: 2 },
    ],
    properties: {
      hardness: 75,
      whiteness: 98,
      translucency: 90,
      thermalStability: 65,
      glazeSmoothness: 96,
    },
    firingTemperature: 1280,
    atmosphere: 'oxidation',
    famousPieces: ['骨瓷茶具套装', '描金骨瓷餐具', '浮雕骨瓷花瓶'],
    imagePrompt: 'Fine bone china, translucent white porcelain, delicate gold rim, elegant tableware, high translucency',
  },
  {
    id: 'dehua',
    name: '德化白瓷',
    dynasty: '明清',
    color: '#F8F3EB',
    description: '德化窑白瓷釉色温润，如脂似玉，有"猪油白"、"象牙白"之称。尤以瓷塑佛像闻名天下，被称为"东方艺术明珠"。',
    composition: [
      { materialId: 'kaolin', ratio: 60 },
      { materialId: 'feldspar', ratio: 20 },
      { materialId: 'quartz', ratio: 15 },
      { materialId: 'talc', ratio: 3 },
      { materialId: 'dolomite', ratio: 2 },
    ],
    properties: {
      hardness: 78,
      whiteness: 95,
      translucency: 75,
      thermalStability: 70,
      glazeSmoothness: 95,
    },
    firingTemperature: 1280,
    atmosphere: 'oxidation',
    famousPieces: ['何朝宗款观音像', '文昌帝君像', '达摩渡江像'],
    imagePrompt: 'Dehua white porcelain, ivory white glaze, exquisite Buddha statue, Ming dynasty, He Chaozong style',
  },
];

export const defaultExperimentRecipe = {
  materials: [
    { materialId: 'kaolin', ratio: 45 },
    { materialId: 'feldspar', ratio: 25 },
    { materialId: 'quartz', ratio: 20 },
    { materialId: 'limestone', ratio: 10 },
  ],
  firingTemperature: 1250,
  atmosphere: 'reduction' as const,
};

export function calculateExperimentResult(
  recipe: { materials: { materialId: string; ratio: number }[]; firingTemperature: number; atmosphere: 'oxidation' | 'reduction' | 'neutral' }
): CeramicExperimentResult {
  const totalRatio = recipe.materials.reduce((sum, m) => sum + m.ratio, 0);
  if (totalRatio === 0) {
    return {
      hardness: 0,
      color: '#FFFFFF',
      translucency: 0,
      shrinkage: 0,
      qualityGrade: '废品',
      description: '未添加任何原料',
      microstructure: 'amorphous',
      crystalContent: 0,
      glassPhase: 0,
      porosity: 100,
    };
  }

  let hardness = 0;
  let translucency = 0;
  let shrinkage = 0;
  let r = 245;
  let g = 242;
  let b = 235;
  let crystalContent = 0;
  let glassPhase = 0;

  for (const item of recipe.materials) {
    const material = ceramicMaterials.find((m) => m.id === item.materialId);
    if (!material) continue;

    const weight = item.ratio / totalRatio;
    hardness += material.impact.hardness * weight * 100;
    translucency += material.impact.translucency * weight * 100;
    shrinkage += material.impact.shrinkage * weight * 100;

    const colorInfluence = material.impact.color * weight;
    const matColor = material.color;
    const matR = parseInt(matColor.slice(1, 3), 16);
    const matG = parseInt(matColor.slice(3, 5), 16);
    const matB = parseInt(matColor.slice(5, 7), 16);

    r = r * (1 - colorInfluence) + matR * colorInfluence;
    g = g * (1 - colorInfluence) + matG * colorInfluence;
    b = b * (1 - colorInfluence) + matB * colorInfluence;

    if (material.category === 'filler') {
      crystalContent += weight * 40;
    } else if (material.category === 'flux') {
      glassPhase += weight * 50;
    } else if (material.category === 'clay') {
      crystalContent += weight * 25;
      glassPhase += weight * 35;
    }
  }

  const tempFactor = (recipe.firingTemperature - 1100) / 300;
  hardness = Math.min(100, hardness * (0.5 + tempFactor * 0.5));
  translucency = Math.min(100, translucency * (0.4 + tempFactor * 0.6));
  glassPhase = Math.min(95, glassPhase * (0.3 + tempFactor * 0.7));
  crystalContent = Math.min(90, crystalContent * (1 - tempFactor * 0.3));
  const porosity = Math.max(2, 100 - crystalContent - glassPhase);

  const tempColorShift = tempFactor > 0.8 ? 0.8 : tempFactor;
  if (recipe.atmosphere === 'reduction') {
    r -= tempColorShift * 15;
    g += tempColorShift * 10;
    b += tempColorShift * 20;
  } else if (recipe.atmosphere === 'oxidation') {
    r += tempColorShift * 10;
    g -= tempColorShift * 5;
    b -= tempColorShift * 10;
  }

  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));

  const color = `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;

  const overallScore = (hardness * 0.3 + translucency * 0.25 + (100 - porosity) * 0.25 + (100 - Math.abs(shrinkage - 15)) * 0.2);
  let qualityGrade: CeramicExperimentResult['qualityGrade'] = '废品';
  let description = '';

  if (totalRatio < 80) {
    qualityGrade = '废品';
    description = '原料配比不足，胎体无法正常烧结';
  } else if (recipe.firingTemperature < 1150) {
    qualityGrade = '次品';
    description = '烧成温度过低，胎体未完全烧结，致密度不足';
  } else if (recipe.firingTemperature > 1350) {
    qualityGrade = '次品';
    description = '烧成温度过高，胎体过度软化变形';
  } else if (overallScore >= 85) {
    qualityGrade = '精品';
    description = '配方精良，烧成恰到好处，胎体致密，性能优异';
  } else if (overallScore >= 70) {
    qualityGrade = '佳品';
    description = '配方合理，烧成良好，胎体质量较佳';
  } else if (overallScore >= 55) {
    qualityGrade = '合格品';
    description = '基本符合要求，但仍有优化空间';
  } else {
    qualityGrade = '次品';
    description = '配方或烧成存在缺陷，需要调整';
  }

  let microstructure: CeramicExperimentResult['microstructure'] = 'amorphous';
  if (crystalContent > 50 && glassPhase < 30) {
    microstructure = 'crystalline';
  } else if (crystalContent > 35 && glassPhase > 35) {
    microstructure = 'mixed';
  } else if (glassPhase > 50) {
    microstructure = 'glassy';
  } else if (porosity > 30) {
    microstructure = 'porous';
  }

  return {
    hardness: Math.round(hardness * 10) / 10,
    color,
    translucency: Math.round(translucency * 10) / 10,
    shrinkage: Math.round(shrinkage * 10) / 10,
    qualityGrade,
    description,
    microstructure,
    crystalContent: Math.round(crystalContent * 10) / 10,
    glassPhase: Math.round(glassPhase * 10) / 10,
    porosity: Math.round(porosity * 10) / 10,
  };
}

export const microscopeSamples: MicroscopeSample[] = [
  {
    id: 'kaolin_micro',
    name: '高岭土显微结构',
    materialId: 'kaolin',
    magnification: 1000,
    description: '高岭土在显微镜下呈现片状晶体结构，晶体直径约0.2-2微米，堆叠有序。这种片状结构赋予了黏土良好的可塑性。',
    features: ['片状晶体', '堆叠有序', '粒径均匀', '表面光滑'],
    imagePrompt: 'Kaolin clay under microscope, platy crystal structure, 1000x magnification, geological sample, scientific visualization',
  },
  {
    id: 'quartz_micro',
    name: '石英颗粒显微',
    materialId: 'quartz',
    magnification: 500,
    description: '石英颗粒呈不规则粒状，无解理，硬度高。在陶瓷胎体中作为骨架存在，其棱角分明的颗粒增加了胎体的机械强度。',
    features: ['粒状形态', '棱角分明', '无解理面', '高硬度'],
    imagePrompt: 'Quartz sand grain under microscope, irregular granular shape, angular edges, 500x magnification, geological sample',
  },
  {
    id: 'feldspar_micro',
    name: '长石熔融显微',
    materialId: 'feldspar',
    magnification: 800,
    description: '长石在高温下熔融形成玻璃相，填充于颗粒之间，是陶瓷致密化的关键。显微镜下可见玻璃相中的残余晶体。',
    features: ['玻璃相基质', '残余晶体', '流动构造', '均一分布'],
    imagePrompt: 'Feldspar melt under microscope, glassy phase with residual crystals, 800x magnification, ceramic microstructure',
  },
  {
    id: 'porcelain_body',
    name: '瓷胎显微结构',
    magnification: 400,
    description: '成熟瓷胎的显微结构：石英颗粒（无色粒状）、莫来石晶体（针状交织）、玻璃相（连续基质）三相共存，结构致密。',
    features: ['三相结构', '莫来石针晶', '石英颗粒', '致密均匀'],
    imagePrompt: 'Porcelain body microstructure under microscope, three-phase structure, quartz grains, mullite needles, glass matrix, 400x',
  },
  {
    id: 'ru_glaze',
    name: '汝窑釉显微',
    magnification: 600,
    description: '汝窑釉层中含有大量细小的气泡和未熔融的石英颗粒，这些散射中心使釉面呈现出"莹润如脂"的视觉效果。',
    features: ['密集气泡', '未熔石英', '析晶分相', '乳浊效果'],
    imagePrompt: 'Ru ware glaze under microscope, dense small bubbles, unmelted quartz particles, 600x magnification, ancient Chinese porcelain',
  },
  {
    id: 'jian_hare_fur',
    name: '建盏兔毫显微',
    magnification: 200,
    description: '建盏兔毫纹是铁氧化物在釉面定向析晶的结果。显微镜下可见磁铁矿和赤铁矿晶体沿着釉面流动方向排列成针状。',
    features: ['铁析晶', '定向排列', '针状晶簇', '分相结构'],
    imagePrompt: 'Jian ware hare fur glaze under microscope, iron oxide crystal needles, directional crystallization, 200x magnification',
  },
  {
    id: 'jun_yao_bian',
    name: '钧窑窑变显微',
    magnification: 500,
    description: '钧窑窑变的成因是液相分离。显微镜下可见两种成分不同的玻璃相互相包裹，形成绚丽的分相结构和乳光效果。',
    features: ['液相分离', '两相互相', '液滴状结构', '干涉色'],
    imagePrompt: 'Jun ware kiln transformation glaze under microscope, liquid-liquid phase separation, 500x magnification, colorful ceramic',
  },
  {
    id: 'crackle_network',
    name: '哥窑开片显微',
    magnification: 300,
    description: '哥窑金丝铁线的显微结构：粗裂纹延伸较深，其中填充了深色着色剂；细裂纹较浅，呈金黄色。两层裂纹交织成网。',
    features: ['双层裂纹', '深浅不一', '着色剂填充', '网络结构'],
    imagePrompt: 'Ge ware crackle pattern under microscope, two-layer crackle network with different colors, 300x magnification',
  },
  {
    id: 'mullite_crystal',
    name: '莫来石晶体',
    magnification: 1200,
    description: '莫来石是陶瓷胎体中的重要次生晶体，呈针状或柱状交织生长。其含量和形态直接影响瓷器的强度和热稳定性。',
    features: ['针状晶体', '交织生长', '网络骨架', '高强高韧'],
    imagePrompt: 'Mullite crystals under electron microscope, needle-like interwoven structure, 1200x magnification, ceramic mineral',
  },
  {
    id: 'bone_china_micro',
    name: '骨瓷显微结构',
    magnification: 400,
    description: '骨瓷的显微结构独具特色：磷酸钙晶体（圆形颗粒）均匀分布在玻璃基质中，这种结构赋予了骨瓷极高的透光性。',
    features: ['磷酸钙晶', '均匀分布', '高透光度', '玻璃基质'],
    imagePrompt: 'Bone china microstructure under microscope, calcium phosphate crystals in glass matrix, 400x magnification, translucent porcelain',
  },
];

export const materialCategoryLabels: Record<string, string> = {
  clay: '黏土类',
  flux: '助熔剂',
  filler: '填充剂',
};

export const materialCategoryColors: Record<string, string> = {
  clay: '#A83232',
  flux: '#C9A962',
  filler: '#2C3E50',
};

export const atmosphereOptions = [
  { value: 'oxidation', label: '氧化焰', color: '#E8A040', description: '供氧充足，金属呈高价态' },
  { value: 'reduction', label: '还原焰', color: '#7BA3A8', description: '缺氧燃烧，金属呈低价态' },
  { value: 'neutral', label: '中性焰', color: '#8BA888', description: '气氛平衡，无明显氧化还原' },
] as const;
