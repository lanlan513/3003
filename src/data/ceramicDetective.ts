export interface CeramicClue {
  type: 'pattern' | 'glaze' | 'shape' | 'era' | 'base' | 'technique';
  title: string;
  description: string;
  hint: string;
  difficulty: 1 | 2 | 3;
}

export interface CeramicCase {
  id: string;
  name: string;
  kiln: string;
  kilnId: string;
  dynasty: string;
  period: string;
  imagePrompt: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  clues: CeramicClue[];
  analysis: {
    reasoning: string[];
    keyEvidence: string[];
    commonMistakes: string[];
  };
  knowledge: {
    title: string;
    content: string;
  }[];
  color: string;
}

export const ceramicDetectiveCases: CeramicCase[] = [
  {
    id: 'case-001',
    name: '天青釉弦纹樽',
    kiln: '汝窑',
    kilnId: 'ru',
    dynasty: '北宋',
    period: '徽宗年间',
    imagePrompt: 'Northern Song Ru ware sky celadon glaze string pattern zun vessel, incense gray body, three sesame nail marks on base, fine crackle pattern, museum quality, soft diffused light',
    difficulty: 3,
    color: '#7BA3A8',
    clues: [
      {
        type: 'glaze',
        title: '釉色观察',
        description: '釉色呈淡雅的天青色，釉面莹润如玉，有明显的乳浊感。在30倍放大镜下观察，釉中气泡稀疏，寥若晨星。',
        hint: '这种天青色是某宋代名窑的标志性釉色，其配方至今仍是千古之谜。',
        difficulty: 2,
      },
      {
        type: 'pattern',
        title: '开片特征',
        description: '釉面布满细密的开片纹，状如蝉翼，纹片深浅不一，自然天成。',
        hint: '这种细密开片是由于胎釉膨胀系数不同造成的，被后世誉为"残缺之美"。',
        difficulty: 2,
      },
      {
        type: 'shape',
        title: '器型分析',
        description: '器型仿汉代铜樽造型，直口、深腹、平底，下承三足。器身凸起三道弦纹，古朴典雅。',
        hint: '宋代仿古青铜器造型的瓷器，大多是为了满足宫廷礼制需求。',
        difficulty: 1,
      },
      {
        type: 'base',
        title: '底足特征',
        description: '器底有五个细小的芝麻状支钉痕，露胎处呈香灰色。',
        hint: '这种支钉烧造工艺是宋代某些官窑的典型特征，支钉痕细小如芝麻。',
        difficulty: 3,
      },
      {
        type: 'era',
        title: '年代线索',
        description: '此器出土于河南宝丰清凉寺窑址附近，地层年代为北宋晚期。',
        hint: '河南宝丰是宋代某著名窑口的核心产区。',
        difficulty: 1,
      },
    ],
    analysis: {
      reasoning: [
        '天青色釉 + 香灰胎 + 芝麻支钉痕 = 汝窑的三大标志性特征',
        '北宋徽宗时期是汝窑烧造的鼎盛期，烧造时间仅约20年',
        '器型仿汉代铜樽，符合宋代宫廷"复古"的审美风尚',
        '开片细密如蝉翼，是汝窑区别于官窑、哥窑的重要特征',
      ],
      keyEvidence: [
        '釉色：典型天青色，雨过天青云破处',
        '胎质：香灰色胎，俗称"香灰胎"',
        '烧造工艺：芝麻支钉痕，满釉支烧',
        '出土地点：河南宝丰清凉寺，汝窑核心窑址',
      ],
      commonMistakes: [
        '易与官窑混淆：官窑开片更大，有"金丝铁线"',
        '易与临汝窑混淆：临汝窑釉色偏蓝，支钉痕较大',
        '易与清代仿汝釉混淆：清代仿品釉色过于均匀，缺乏层次',
      ],
    },
    knowledge: [
      {
        title: '汝窑为何被誉为"宋瓷之冠"',
        content: '汝窑位列宋代五大名窑之首，烧造时间仅约20年（1107-1127年），传世品不足百件。其天青色釉是宋徽宗赵佶的"御定之色"——"雨过天青云破处，这般颜色做将来"。汝窑以玛瑙入釉的传说虽不完全准确，但其釉料配方确实包含特殊的矿物成分，烧成后釉面呈现独特的乳浊感和如玉般的温润质感。',
      },
      {
        title: '支钉烧造工艺',
        content: '汝窑采用满釉支烧工艺，为了避免器底与窑具粘连，在器底放置细小的支钉。入窑烧造时，支钉与器物一同烧成，出窑后敲掉支钉，留下细小的支钉痕。汝窑支钉痕细小如芝麻，一般为3、5、7个，是鉴定汝窑真伪的重要依据。',
      },
    ],
  },
  {
    id: 'case-002',
    name: '青花萧何月下追韩信梅瓶',
    kiln: '景德镇窑',
    kilnId: 'jdz',
    dynasty: '元代',
    period: '至正年间',
    imagePrompt: 'Yuan Dynasty blue and white porcelain meiping plum vase with Xiao He chasing Han Xin under the moon story scene, vivid cobalt blue painting, pear shaped body, museum quality',
    difficulty: 4,
    color: '#4A6FA5',
    clues: [
      {
        type: 'glaze',
        title: '釉色特征',
        description: '釉色白中微泛青，釉面肥润有光泽。青花发色浓艳，带铁锈斑，深入胎骨。',
        hint: '这种青花发色使用的是进口钴料，来自波斯地区。',
        difficulty: 3,
      },
      {
        type: 'pattern',
        title: '纹饰分析',
        description: '器身绘人物故事图案"萧何月下追韩信"。萧何策马扬鞭，韩信牵马踌躇，人物神态生动。辅以松、竹、梅、芭蕉山石等背景。',
        hint: '元代青花瓷人物故事图案存世稀少，目前仅发现约10件。',
        difficulty: 2,
      },
      {
        type: 'shape',
        title: '器型特征',
        description: '小口外撇，短颈，丰肩，敛腹，圈足。整体造型雄浑大气，肩部丰满，有明显的时代特征。',
        hint: '梅瓶在宋代称为"经瓶"，是酒器。元代梅瓶器形更加硕大丰满。',
        difficulty: 2,
      },
      {
        type: 'base',
        title: '底足特征',
        description: '底足无釉，露胎处呈火石红色。胎质坚硬但略显粗糙，有明显的旋坯痕。',
        hint: '火石红是元代瓷器底足的典型特征，是胎料中铁元素氧化形成的。',
        difficulty: 3,
      },
      {
        type: 'technique',
        title: '工艺特征',
        description: '器身有明显的接胎痕，分三段接成：口颈、上腹、下腹。青花采用一笔点划与勾勒填色相结合的画法。',
        hint: '元代大件瓷器多采用分段制胎工艺，这是鉴定要点之一。',
        difficulty: 2,
      },
    ],
    analysis: {
      reasoning: [
        '青花浓艳带铁锈斑 + 进口苏麻离青料 = 元青花的典型特征',
        '人物故事纹 + 分段接胎 = 元青花高端产品的特征',
        '丰肩敛腹的造型 + 火石红底足 = 元代梅瓶的时代特征',
        '纹饰层次丰富但繁而不乱，符合元代青花装饰风格',
      ],
      keyEvidence: [
        '青料：进口苏麻离青，发色浓艳带铁锈斑',
        '纹饰：人物故事纹，萧何月下追韩信',
        '工艺：三段接胎，旋坯痕明显',
        '底足：火石红，无釉露胎',
      ],
      commonMistakes: [
        '易与明洪武青花混淆：洪武青花发色偏灰，铁锈斑少',
        '易与明永乐青花混淆：永乐青花胎质更细腻，火石红少',
        '易与现代仿品混淆：仿品铁锈斑过于刻意，缺乏自然晕散',
      ],
    },
    knowledge: [
      {
        title: '苏麻离青料的奥秘',
        content: '元青花使用的"苏麻离青"（又称苏勃泥青）是一种进口钴料，来自波斯地区（今伊朗一带）。这种钴料含铁量高、含锰量低，在还原焰中烧造后呈现出浓艳的蓝色，并带有自然的铁锈斑（锡光）和晕散效果，如中国水墨画般韵味无穷。明中期以后，苏麻离青料枯竭，改用国产平等青料，发色淡雅。',
      },
      {
        title: '元青花为何价值连城',
        content: '元青花是中国陶瓷史上的一个重要转折点，它将中国传统水墨画技法与陶瓷装饰完美结合。元代青花瓷存世量稀少，据估计目前全世界馆藏元青花完整器仅约300件，其中人物故事纹更是凤毛麟角，不足10件。2005年，元青花"鬼谷子下山图罐"在伦敦佳士得以2.3亿元人民币成交，创下当时中国艺术品拍卖世界纪录。',
      },
    ],
  },
  {
    id: 'case-003',
    name: '金丝铁线鱼耳炉',
    kiln: '哥窑',
    kilnId: 'ge',
    dynasty: '南宋',
    period: '中后期',
    imagePrompt: 'Southern Song Ge ware celadon incense burner with gold thread and iron wire crackle patterns, double fish ears, purple mouth iron foot, warm museum lighting',
    difficulty: 4,
    color: '#9E8B72',
    clues: [
      {
        type: 'glaze',
        title: '釉色观察',
        description: '釉色呈米黄色，釉层凝厚如脂，光泽柔和。釉中气泡密集，如"聚沫攒珠"。',
        hint: '这种密集的气泡是某宋代名窑的标志性特征，微观世界瑰丽无比。',
        difficulty: 3,
      },
      {
        type: 'pattern',
        title: '开片特征',
        description: '釉面布满大小两种开片纹：粗黑纹片（铁线）交织细黄纹片（金丝），形成著名的"金丝铁线"。',
        hint: '这种开片是哥窑最著名的特征，被誉为"残缺之美的极致"。',
        difficulty: 2,
      },
      {
        type: 'shape',
        title: '器型分析',
        description: '器身呈簋形，口沿外撇，束颈，鼓腹，圈足。颈部两侧各饰一鱼形耳，造型古朴庄重。',
        hint: '鱼耳是宋代香炉常见的装饰，寓意"金玉满堂"。',
        difficulty: 1,
      },
      {
        type: 'base',
        title: '底足特征',
        description: '口沿釉薄处因胎色透出而呈紫色，底足露胎处呈黑褐色，形成著名的"紫口铁足"。',
        hint: '"紫口铁足"是由于胎料中含铁量高，在烧成时口沿釉薄处氧化呈紫色，底足露胎处呈铁黑色。',
        difficulty: 3,
      },
      {
        type: 'era',
        title: '年代线索',
        description: '此器为清宫旧藏，《乾隆御制诗集》中有题咏此器的诗句。',
        hint: '乾隆皇帝酷爱古瓷，常为内府收藏的宋代名窑瓷器题诗刻款。',
        difficulty: 2,
      },
    ],
    analysis: {
      reasoning: [
        '金丝铁线开片 + 聚沫攒珠气泡 = 哥窑的典型组合特征',
        '紫口铁足 + 米黄釉色 = 哥窑区别于官窑的重要特征',
        '鱼耳簋形炉是宋代宫廷礼器的典型造型',
        '清代乾隆题款进一步印证了此器的重要价值',
      ],
      keyEvidence: [
        '开片：金丝铁线，大小片纹交织',
        '气泡：聚沫攒珠，釉中气泡密集',
        '胎色：紫口铁足，胎料含铁量高',
        '釉色：米黄色，釉层凝厚',
      ],
      commonMistakes: [
        '易与官窑混淆：官窑开片多为单一冰裂纹，无金丝铁线',
        '易与龙泉仿哥混淆：龙泉仿哥无聚沫攒珠气泡',
        '易与明清仿哥釉混淆：明清仿品开片过于规整，缺乏层次',
      ],
    },
    knowledge: [
      {
        title: '哥窑的千古之谜',
        content: '哥窑是宋代五大名窑中最富传奇色彩的一座。相传宋代龙泉章氏兄弟各主一窑，兄曰哥窑，弟曰弟窑（即龙泉窑）。然而，哥窑的窑址至今仍未发现，其烧造年代、产地等问题仍有争议。目前认为哥窑可能是南宋时期杭州附近的一处官窑，专门为宫廷烧造开片釉瓷器。',
      },
      {
        title: '金丝铁线是如何形成的',
        content: '"金丝铁线"是哥窑最著名的装饰特征。其形成过程是：器物烧成后，釉面因胎釉膨胀系数不同而开裂。然后将器物浸入深色墨汁中，使深色墨汁渗入较深较粗的裂纹中，形成"铁线"；再将器物浸入浅色茶汁中，使浅色茶汁渗入较浅较细的裂纹中，形成"金丝"。经过这样的人工染色，大小裂纹呈现出不同的颜色层次，妙趣天成。',
      },
    ],
  },
  {
    id: 'case-004',
    name: '白釉孩儿枕',
    kiln: '定窑',
    kilnId: 'ding',
    dynasty: '北宋',
    period: '中晚期',
    imagePrompt: 'Northern Song Ding ware white glaze pillow in shape of a sleeping child boy, creamy white ivory color, delicate carving, museum quality lighting',
    difficulty: 3,
    color: '#E8E4D8',
    clues: [
      {
        type: 'glaze',
        title: '釉色观察',
        description: '釉色白中微泛黄，呈象牙白色，釉面莹润光滑。局部釉面有流淌痕迹，如"泪痕"。',
        hint: '"泪痕"是某宋代白瓷窑口的典型特征，是施釉时釉浆流淌形成的。',
        difficulty: 2,
      },
      {
        type: 'pattern',
        title: '装饰特征',
        description: '通体素白无纹饰，以造型取胜。孩童背部为枕面，微微下凹，刻有精致的云朵纹。',
        hint: '宋代五大名窑中，定窑以白瓷刻印花装饰著称，也有大量素面器。',
        difficulty: 1,
      },
      {
        type: 'shape',
        title: '器型分析',
        description: '整体塑一俯卧的孩童形象。孩童双臂环抱，头枕于臂上，两腿交叉抬起，神态安详。背部为枕面，设计巧妙。',
        hint: '瓷枕是中国古代夏季纳凉的寝具，"半窗千里月，一枕五更风"。',
        difficulty: 1,
      },
      {
        type: 'base',
        title: '底足特征',
        description: '枕的底平切，露胎无釉。胎质洁白细腻，有"竹丝刷纹"。',
        hint: '"竹丝刷纹"是定窑坯体修整时留下的痕迹，是鉴定要点之一。',
        difficulty: 3,
      },
      {
        type: 'technique',
        title: '工艺特征',
        description: '采用分段模制工艺，分前后两半模制后粘合。入窑时采用支圈覆烧工艺，口沿无釉。',
        hint: '覆烧工艺是定窑的发明，可以提高产量，但口沿无釉，需要镶金银扣。',
        difficulty: 2,
      },
    ],
    analysis: {
      reasoning: [
        '象牙白釉 + 泪痕 + 竹丝刷纹 = 定窑的三大鉴定要点',
        '覆烧工艺 + 分段模制 = 定窑典型的制瓷工艺',
        '孩儿枕造型生动，是定窑雕塑瓷的巅峰之作',
        '素面无饰更显釉色之美，符合宋代"素雅"的审美风尚',
      ],
      keyEvidence: [
        '釉色：象牙白，白中泛黄，有泪痕',
        '胎质：洁白细腻，有竹丝刷纹',
        '工艺：支圈覆烧，分段模制',
        '造型：孩儿俯卧，生动传神',
      ],
      commonMistakes: [
        '易与邢窑白瓷混淆：邢窑釉色纯白，无泪痕',
        '易与粉定混淆：粉定是明清仿定窑，胎质更白更细',
        '易与土定混淆：土定是定窑系民间产品，胎质较粗',
      ],
    },
    knowledge: [
      {
        title: '定窑的覆烧工艺',
        content: '定窑在北宋中期发明了支圈覆烧工艺，即将器物倒扣在支圈上入窑烧造。这种工艺的优点是可以大大提高窑室的装烧量，降低成本；缺点是器物口沿无釉，称为"芒口"。为了弥补这一缺陷，定窑瓷器常在口沿镶上金、银、铜扣，称为"金装定器"，更显华贵。覆烧工艺后来被南北各窑广泛采用。',
      },
      {
        title: '瓷枕的文化意涵',
        content: '瓷枕是中国古代夏季纳凉的寝具，始于隋代，流行于唐宋。瓷枕不仅具有实用价值，还承载着丰富的文化内涵。"枕"与"正"谐音，寓意"正心"、"正行"。瓷枕上常绘刻诗词、谚语、吉祥图案，反映了古人的生活情趣和价值观念。定窑孩儿枕是瓷枕中的极品，现藏于北京故宫博物院，是镇馆之宝。',
      },
    ],
  },
  {
    id: 'case-005',
    name: '玫瑰紫釉海棠式花盆',
    kiln: '钧窑',
    kilnId: 'jun',
    dynasty: '北宋',
    period: '徽宗年间',
    imagePrompt: 'Northern Song imperial Jun ware rose purple and sky blue flambe glaze porcelain flower pot in begonia shape, miraculous kiln transformation colors, dramatic museum lighting',
    difficulty: 4,
    color: '#9B5A5A',
    clues: [
      {
        type: 'glaze',
        title: '釉色观察',
        description: '釉色变化万千：器内为天蓝色釉，器外为玫瑰紫色釉，两种釉色在口沿处自然交融。釉面有"蚯蚓走泥纹"。',
        hint: '"入窑一色，出窑万彩"是某窑口的标志性特点。',
        difficulty: 2,
      },
      {
        type: 'pattern',
        title: '釉面特征',
        description: '釉面呈乳浊状，不透明，有强烈的玉质感。仔细观察可见釉中夹杂的细小棕眼，如"橘皮纹"。',
        hint: '乳浊釉是钧窑的重要特征，能够产生"夕阳紫翠忽成岚"的艺术效果。',
        difficulty: 3,
      },
      {
        type: 'shape',
        title: '器型分析',
        description: '器身呈海棠花形，葵口、深腹、平底，下承四如意云头足。造型优美，线条流畅。',
        hint: '海棠式花盆是宋代宫廷用于种植奇花异草的"花石纲"遗物。',
        difficulty: 2,
      },
      {
        type: 'base',
        title: '底足特征',
        description: '器底刻有"重华宫"三字楷书款，底足刷酱色釉（护胎釉）。底足内侧刻有数目字"一"。',
        hint: '宋代钧官窑器底刻数目字，"一"至"十"表明器物大小，"一"为最大。',
        difficulty: 3,
      },
      {
        type: 'technique',
        title: '工艺特征',
        description: '釉层肥厚，多次施釉。以氧化铜为着色剂，在高温还原焰中烧成铜红釉。',
        hint: '铜红釉的烧成是中国陶瓷史上划时代的贡献，开创了红釉瓷器的新纪元。',
        difficulty: 2,
      },
    ],
    analysis: {
      reasoning: [
        '铜红窑变 + 乳浊釉 + 蚯蚓走泥纹 = 钧窑的三大典型特征',
        '玫瑰紫与天蓝色交融 = 钧官窑的标准釉色搭配',
        '海棠式造型 + 数目字款 = 宋徽宗"花石纲"的典型器物',
        '"重华宫"款是清代乾隆时期的刻款，表明此器曾入藏清宫',
      ],
      keyEvidence: [
        '釉色：窑变玫瑰紫与天蓝色交融',
        '釉质：乳浊不透明，有蚯蚓走泥纹',
        '款识：底刻数目字"一"，清代加刻"重华宫"',
        '器型：海棠式，四如意云头足',
      ],
      commonMistakes: [
        '易与民钧混淆：民钧无数目字款，器型多为碗盘',
        '易与仿钧窑混淆：仿品窑变过于刻意，缺乏自然过渡',
        '易与广钧（泥钧）混淆：广钧胎质较粗，釉色偏暗',
      ],
    },
    knowledge: [
      {
        title: '钧窑窑变的奥秘',
        content: '钧窑以神奇瑰丽的窑变艺术闻名于世。"入窑一色，出窑万彩"——钧窑以氧化铜为着色剂，在高温还原焰中，铜离子被还原成胶体铜颗粒，使釉色呈现出玫瑰紫、海棠红、茄皮紫、鸡血红等变幻莫测的红色。同时，釉料中的铁元素呈现出天蓝色。红、蓝两色釉料在高温下自然流动交融，形成了"夕阳紫翠忽成岚"的梦幻效果。钧窑红釉的烧成，是中国陶瓷史上划时代的贡献，开创了红釉瓷器的新纪元。',
      },
      {
        title: '钧官窑与花石纲',
        content: '北宋徽宗皇帝赵佶是一位艺术天才，酷爱奇花异石，专门在东京（今开封）设立"应奉局"，在全国搜罗奇花异石运往京城，称为"花石纲"。钧官窑就是为了满足宋徽宗宫廷园林的需求而设立的，专门烧造各类花盆、花器。钧官窑瓷器底都刻有"一"至"十"的数目字，用来标明器物的大小规格，"一"为最大，"十"为最小，以便于配套使用。',
      },
    ],
  },
  {
    id: 'case-006',
    name: '梅子青釉鬲式炉',
    kiln: '龙泉窑',
    kilnId: 'longquan',
    dynasty: '南宋',
    period: '中后期',
    imagePrompt: 'Southern Song Longquan celadon plum green glaze porcelain incense burner in li shape tri pod, jade like texture, subtle raised lines, natural zen light',
    difficulty: 3,
    color: '#6B8E6B',
    clues: [
      {
        type: 'glaze',
        title: '釉色观察',
        description: '釉色呈青翠欲滴的梅子青色，釉层肥厚如脂，光泽莹澈。釉面光滑温润，如翡翠似青玉。',
        hint: '梅子青是某南方青瓷窑口的代表釉色，被誉为"夺得千峰翠色来"。',
        difficulty: 2,
      },
      {
        type: 'pattern',
        title: '装饰特征',
        description: '通体素面，以釉色和造型取胜。三足外侧凸起竖向棱线（出筋），棱线处因釉层较薄而露出白色胎色，形成"出筋"效果。',
        hint: '"出筋"是南宋龙泉窑常用的装饰手法，利用釉的流动性形成自然的色彩变化。',
        difficulty: 2,
      },
      {
        type: 'shape',
        title: '器型分析',
        description: '器型仿古代青铜鬲造型，折沿、短颈、鼓腹，下承三袋足。造型古朴典雅，线条优美。',
        hint: '鬲是古代的炊具，宋代仿古之风盛行，常以瓷仿青铜礼器造型。',
        difficulty: 1,
      },
      {
        type: 'base',
        title: '底足特征',
        description: '三足底端无釉，露胎处呈朱红色（朱砂底）。胎质灰白细腻。',
        hint: '朱砂底是龙泉窑瓷器的典型特征之一，是胎料中铁元素在氧化气氛中形成的。',
        difficulty: 2,
      },
      {
        type: 'era',
        title: '年代线索',
        description: '此器出土于浙江龙泉大窑窑址，地层年代为南宋晚期。',
        hint: '浙江龙泉大窑是某著名青瓷窑口的核心产区。',
        difficulty: 1,
      },
    ],
    analysis: {
      reasoning: [
        '梅子青釉 + 石灰碱釉 = 南宋龙泉窑的标志性成就',
        '仿青铜鬲造型 + 出筋装饰 = 南宋龙泉窑的典型风格',
        '朱砂底 + 灰白胎 = 龙泉窑区别于越窑的重要特征',
        '大窑窑址出土，地层年代明确，断代依据充分',
      ],
      keyEvidence: [
        '釉色：梅子青，青翠欲滴，釉层肥厚',
        '装饰：出筋效果，利用釉的流动性形成自然装饰',
        '造型：仿青铜鬲，三袋足，古朴典雅',
        '底足：朱砂底，三足底端露胎',
      ],
      commonMistakes: [
        '易与越窑混淆：越窑釉色偏黄，胎质较细，无朱砂底',
        '易与南宋官窑混淆：官窑有开片，龙泉无开片',
        '易与元代龙泉混淆：元代龙泉器型硕大，釉色偏黄',
      ],
    },
    knowledge: [
      {
        title: '石灰碱釉的发明',
        content: '南宋龙泉窑发明了石灰碱釉，这是中国陶瓷史上的重要技术突破。传统的石灰釉在高温下粘度低，容易流釉，因此釉层较薄。而石灰碱釉以长石、石英、石灰石、草木灰等配制，在高温下粘度高，不易流釉，因此可以多次施釉，釉层厚度可达2-3毫米。厚厚的釉层在光线照射下产生丰富的层次感，使瓷器具有"玉质感"。龙泉窑的粉青、梅子青釉色，就是石灰碱釉的杰出成就。',
      },
      {
        title: '龙泉青瓷与海上丝绸之路',
        content: '龙泉窑是中国南方青瓷的集大成者，也是"海上丝绸之路"的大宗商品。宋元时期，龙泉青瓷通过宁波、泉州等港口远销东亚、东南亚、南亚、西亚、东非等地，甚至远达欧洲。在埃及福斯塔特遗址、伊朗锡尔夫遗址、印度尼西亚沉船等考古发现中，都出土了大量龙泉青瓷。龙泉青瓷被称为"世界陶瓷史上的里程碑"，对世界陶瓷的发展产生了深远影响。',
      },
    ],
  },
  {
    id: 'case-007',
    name: '粉彩过枝桃纹盘',
    kiln: '景德镇窑',
    kilnId: 'jdz',
    dynasty: '清代',
    period: '雍正年间',
    imagePrompt: 'Qing Dynasty Yongzheng period famille rose porcelain plate with overbranch peach and bat pattern, six peaches five bats, pastel soft colors, imperial quality',
    difficulty: 3,
    color: '#C08090',
    clues: [
      {
        type: 'glaze',
        title: '釉色观察',
        description: '釉色白中微泛青，釉面莹润光洁。盘心绘粉彩纹饰，色彩粉嫩柔和，层次丰富。',
        hint: '粉彩是清代康熙晚期创制的釉上彩品种，在雍正朝达到鼎盛。',
        difficulty: 2,
      },
      {
        type: 'pattern',
        title: '纹饰分析',
        description: '盘心绘过枝桃纹，桃树从盘外壁延伸至盘内，枝繁叶茂，硕果累累。共绘六颗桃子，五只蝙蝠，寓意"六桃五福"、"福寿双全"。',
        hint: '"过枝"是清代粉彩瓷器常见的装饰手法，纹饰从器外壁延伸至器内。',
        difficulty: 2,
      },
      {
        type: 'shape',
        title: '器型分析',
        description: '盘形规整，撇口、弧腹、圈足。胎质细腻洁白，胎体轻薄。',
        hint: '雍正瓷器以造型秀美著称，素有"雍正器型最美"之说。',
        difficulty: 1,
      },
      {
        type: 'base',
        title: '底足特征',
        description: '底足露胎处呈"泥鳅背"状，光滑圆润。底书"大清雍正年制"六字双行楷书款，字体工整秀丽。',
        hint: '"泥鳅背"是清代雍正乾隆时期瓷器底足的典型特征，因底足修整得像泥鳅的背部一样光滑圆润而得名。',
        difficulty: 3,
      },
      {
        type: 'technique',
        title: '工艺特征',
        description: '采用"玻璃白"打底，色彩由深到浅渐变，具有立体感。纹饰绘画精细，桃实的颜色有深红、粉红、浅红的变化，树叶有阴阳向背。',
        hint: '"玻璃白"是粉彩区别于五彩的重要特征，能够产生"粉化"效果。',
        difficulty: 2,
      },
    ],
    analysis: {
      reasoning: [
        '玻璃白打底 + 色彩渐变 = 粉彩区别于五彩的核心特征',
        '六桃五福 + 过枝装饰 = 雍正粉彩的典型吉祥图案',
        '泥鳅背底足 + 六字楷书款 = 雍正官窑的标准款识',
        '造型秀美 + 绘画精细 = 雍正瓷器的典型风格',
      ],
      keyEvidence: [
        '彩料：粉彩，玻璃白打底，色彩粉嫩',
        '纹饰：六桃五福，过枝装饰，寓意吉祥',
        '款识："大清雍正年制"六字楷书款',
        '底足：泥鳅背，修整精细',
      ],
      commonMistakes: [
        '易与康熙五彩混淆：五彩无玻璃白，色彩生硬',
        '易与乾隆粉彩混淆：乾隆粉彩过于繁缛，有"百花不落地"',
        '易与后仿品混淆：仿品玻璃白过厚，色彩层次不自然',
      ],
    },
    knowledge: [
      {
        title: '粉彩为何被誉为"东方艺术明珠"',
        content: '粉彩是清代康熙晚期在五彩的基础上，受珐琅彩的影响而创制的釉上彩新品种。粉彩的特点是在彩绘前，先用"玻璃白"（含砷的乳白色玻璃质）打底，然后将彩料施于玻璃白上，用干净的毛笔将颜色洗染开，使色彩由深到浅渐变，产生"粉化"效果。这种技法使纹饰色彩柔和淡雅、层次丰富、立体感强，犹如中国画中的"没骨法"。粉彩在雍正朝达到鼎盛，被誉为"雍正粉彩，前无古人，后无来者"。',
      },
      {
        title: '雍正瓷器的美学追求',
        content: '雍正皇帝胤禛是一位具有极高艺术修养的帝王，他对瓷器的要求达到了"挑剔"的程度。雍正瓷器以造型秀美、纹饰典雅、色彩柔和著称，体现了宋代以来中国传统美学"素雅、含蓄、内敛"的最高境界。雍正粉彩过枝桃纹盘是其中的代表作，"六桃五福"寓意"福寿双全"，过枝装饰寓意"长寿连绵"，是吉祥寓意与艺术表现的完美结合。',
      },
    ],
  },
  {
    id: 'case-008',
    name: '兔毫釉茶盏',
    kiln: '建窑',
    kilnId: 'jian',
    dynasty: '北宋',
    period: '中后期',
    imagePrompt: 'Northern Song Jian ware hare fur tenmoku tea bowl, dark black glaze with iridescent golden streaks, rustic elegant tea ceremony aesthetic, warm lighting',
    difficulty: 3,
    color: '#3D3D3D',
    clues: [
      {
        type: 'glaze',
        title: '釉色观察',
        description: '釉色乌黑如漆，釉面布满细长的银灰色条纹，状如兔毫，在阳光下闪烁出彩虹般的光泽。',
        hint: '兔毫盏是宋代某著名黑瓷窑口的代表产品，是宋代斗茶的首选器具。',
        difficulty: 2,
      },
      {
        type: 'pattern',
        title: '釉面特征',
        description: '兔毫纹从碗口向下延伸，由粗渐细，自然流畅。部分釉面还有"银星斑"，闪烁着金属光泽。',
        hint: '兔毫纹是釉料中的铁元素在高温下流动析晶形成的。',
        difficulty: 3,
      },
      {
        type: 'shape',
        title: '器型分析',
        description: '器型呈撇口、深腹、圈足，口沿薄，底足厚，重心下沉，握感沉稳。',
        hint: '这种造型是为了适应宋代斗茶的需要，便于观察茶汤颜色和汤花。',
        difficulty: 1,
      },
      {
        type: 'base',
        title: '底足特征',
        description: '底足无釉，露胎处呈黑褐色，胎质粗糙坚硬，俗称"铁胎"。',
        hint: '铁胎是建窑瓷器的典型特征，胎料中含铁量高达7%以上。',
        difficulty: 2,
      },
      {
        type: 'era',
        title: '年代线索',
        description: '碗底有"供御"二字刻款，表明此器是进贡宫廷的御用品。',
        hint: '宋徽宗赵佶在《大观茶论》中对建盏给予了高度评价。',
        difficulty: 2,
      },
    ],
    analysis: {
      reasoning: [
        '黑釉兔毫纹 + 铁胎 = 建窑的标志性特征',
        '撇口深腹造型 + 供御款 = 宋代宫廷斗茶用器',
        '兔毫纹自然流畅，是高温析晶的结果',
        '北宋中后期是建窑烧造的鼎盛期，与斗茶之风盛行同步',
      ],
      keyEvidence: [
        '釉色：黑釉兔毫纹，闪烁金属光泽',
        '胎质：铁胎，黑褐色，粗糙坚硬',
        '造型：撇口深腹，重心下沉，适合斗茶',
        '款识："供御"刻款，进贡宫廷之用',
      ],
      commonMistakes: [
        '易与吉州窑混淆：吉州窑胎质较白，釉面有木叶贴花',
        '易与遇林亭窑混淆：遇林亭窑有"描金彩"装饰',
        '易与现代仿品混淆：仿品兔毫纹过于规整，缺乏自然变化',
      ],
    },
    knowledge: [
      {
        title: '兔毫纹是如何形成的',
        content: '建窑兔毫盏的釉料中含有大量的铁元素（约5-8%）。在高温烧造过程中，釉料熔融，铁元素在釉中流动并向釉面聚集。当温度达到1300°C以上时，釉中的氧化铁发生析晶反应，形成富铁的辉石类晶体。这些晶体沿着釉面的流动方向排列，形成了细长的兔毫纹。兔毫纹有金兔毫、银兔毫、蓝兔毫等不同品种，是釉料成分、烧成温度、窑内气氛等多种因素共同作用的结果。',
      },
      {
        title: '宋代斗茶与建盏',
        content: '宋代是中国茶文化的鼎盛时期，斗茶之风盛行。斗茶的程序是：将研细的茶末放入茶盏，用沸水冲点，然后用茶筅击打，使茶汤表面形成白色的汤花。斗茶的标准是"以青白胜黄白"、"以水痕先者为负，耐久者为胜"。由于建盏釉色乌黑，最能衬托白色的汤花；同时建盏胎体厚重，保温性能好，茶汤不易冷却，因此成为斗茶的首选器具。宋徽宗赵佶在《大观茶论》中说："盏色贵青黑，玉毫条达者为上"，对建盏给予了高度评价。',
      },
    ],
  },
];

export const kilnOptions = ['汝窑', '官窑', '哥窑', '定窑', '钧窑', '景德镇窑', '龙泉窑', '越窑', '建窑', '吉州窑', '耀州窑', '磁州窑'];

export const dynastyOptions = ['东汉', '唐代', '五代', '北宋', '南宋', '元代', '明代', '清代'];

export const difficultyLabels: Record<number, string> = {
  1: '入门',
  2: '初级',
  3: '中级',
  4: '高级',
  5: '专家',
};
