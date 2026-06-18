import type { RestorationArtifact, PlacedFragment, RestorationScore } from '@/types';

const vaseOutline = `M 50 15 L 70 15 L 68 35 Q 88 45 82 75 Q 80 110 50 118 Q 20 110 18 75 Q 12 45 32 35 Z`;
const bowlOutline = `M 15 40 Q 50 95 85 40 Q 80 20 50 20 Q 20 20 15 40 Z`;
const jarOutline = `M 35 15 L 65 15 L 65 30 Q 90 40 85 75 Q 82 110 50 115 Q 18 110 15 75 Q 10 40 35 30 Z`;
const plateOutline = `M 10 55 Q 50 85 90 55 Q 85 45 50 45 Q 15 45 10 55 Z`;
const teapotOutline = `M 25 45 Q 10 50 15 70 Q 25 85 50 85 Q 75 85 85 70 L 85 60 Q 92 55 90 48 L 85 45 Z M 55 30 Q 65 20 75 30 Q 75 38 68 40 L 55 40 Z`;

export const restorationArtifacts: RestorationArtifact[] = [
  {
    id: 'artifact-1',
    name: '青花缠枝莲纹梅瓶',
    era: '明代·永乐',
    origin: '江西景德镇',
    description: '此瓶为明代永乐年间景德镇官窑所造，造型端庄秀丽，通体绘青花缠枝莲纹，笔法流畅，发色青翠。梅瓶因口小仅容梅枝而得名，是古代盛酒器与陈设瓷的经典器型。',
    shape: 'vase',
    baseColor: '#E8E4D8',
    accentColor: '#2C3E50',
    difficulty: 2,
    outlinePath: vaseOutline,
    fragments: [
      { id: 'f1-1', targetX: 50, targetY: 20, targetRotation: 0, pathData: 'M 40 0 L 60 0 L 58 25 L 42 25 Z', width: 20, height: 25, color: '#E8E4D8' },
      { id: 'f1-2', targetX: 35, targetY: 45, targetRotation: -8, pathData: 'M 0 5 Q 10 0 25 5 Q 30 25 20 35 Q 5 30 0 20 Z', width: 30, height: 35, color: '#E0DCD0' },
      { id: 'f1-3', targetX: 65, targetY: 45, targetRotation: 8, pathData: 'M 5 5 Q 20 0 30 5 Q 30 20 25 35 Q 10 30 0 20 Z', width: 30, height: 35, color: '#E8E4D8' },
      { id: 'f1-4', targetX: 30, targetY: 80, targetRotation: -5, pathData: 'M 5 0 Q 25 5 30 30 Q 25 50 10 55 Q 0 35 0 15 Z', width: 30, height: 55, color: '#D8D4C8' },
      { id: 'f1-5', targetX: 70, targetY: 80, targetRotation: 5, pathData: 'M 0 0 Q 25 5 30 30 Q 30 50 20 55 Q 5 50 0 30 Z', width: 30, height: 55, color: '#E8E4D8' },
      { id: 'f1-6', targetX: 50, targetY: 105, targetRotation: 0, pathData: 'M 10 0 L 30 0 Q 40 15 30 28 L 10 28 Q 0 15 10 0 Z', width: 40, height: 28, color: '#D8D4C8' },
    ],
    knowledge: [
      { title: '梅瓶源流', content: ['梅瓶最早出现于唐代，宋辽时期颇为流行，称为"经瓶"，作盛酒用器。明清时期，梅瓶逐渐从实用器转为陈设观赏瓷。', '其造型特点为小口、丰肩、敛腹、圈足，因口径之小仅能插梅枝，清代后得名"梅瓶"。'] },
      { title: '青花工艺', content: ['青花瓷以含钴的矿石为颜料，在瓷胎上绘画纹饰后罩以透明釉，经1300°C左右高温一次烧成。', '永宣青花使用进口"苏麻离青"料，发色浓艳，铁锈斑明显，是中国青花瓷的黄金时代。'] },
    ],
    repairMethods: [
      '清洗：使用去离子水和软毛刷清除表面污垢，注意保护原有釉面',
      '拼接：采用可逆性黏合剂进行碎片对合，注意茬口对齐',
      '补配：对缺失部位使用石膏或树脂进行补配，力求形质统一',
      '作色：使用矿物颜料对补配部位进行随色处理，做到"修旧如旧"',
    ],
    historicalValue: '永乐青花代表了明代官窑瓷器的最高水平，有"永宣青花无弱者"之称。此器虽残，但其胎质、釉色、纹饰均展现了永乐官窑的典型特征，对于研究明代早期青花工艺具有重要价值。',
    imagePrompt: 'Ming Dynasty Yongle period blue and white plum vase with lotus scrolls, Chinese porcelain, museum display, soft lighting, elegant',
  },
  {
    id: 'artifact-2',
    name: '汝窑天青釉洗',
    era: '北宋',
    origin: '河南宝丰清凉寺',
    description: '汝窑为宋代五大名窑之首，天青釉洗是其典型器物。釉色如雨过天青，釉面莹润如玉，开片细密自然，有"雨过天青云破处"之誉。汝窑传世品极少，弥足珍贵。',
    shape: 'bowl',
    baseColor: '#C5D5CB',
    accentColor: '#8BA888',
    difficulty: 3,
    outlinePath: bowlOutline,
    fragments: [
      { id: 'f2-1', targetX: 30, targetY: 30, targetRotation: -15, pathData: 'M 0 5 Q 15 0 30 10 Q 35 25 20 35 Q 5 30 0 15 Z', width: 35, height: 35, color: '#C5D5CB' },
      { id: 'f2-2', targetX: 60, targetY: 30, targetRotation: 15, pathData: 'M 5 0 Q 25 0 35 10 Q 35 25 25 35 Q 5 30 0 15 Z', width: 35, height: 35, color: '#B8C9BE' },
      { id: 'f2-3', targetX: 45, targetY: 50, targetRotation: 0, pathData: 'M 0 5 Q 20 0 40 5 Q 45 30 35 45 Q 15 45 5 35 Z', width: 45, height: 45, color: '#C5D5CB' },
      { id: 'f2-4', targetX: 25, targetY: 70, targetRotation: -10, pathData: 'M 5 0 Q 20 5 25 25 Q 20 40 5 45 Q 0 25 5 0 Z', width: 25, height: 45, color: '#B8C9BE' },
      { id: 'f2-5', targetX: 65, targetY: 70, targetRotation: 10, pathData: 'M 0 0 Q 15 5 20 25 Q 15 40 0 40 Z', width: 20, height: 40, color: '#C5D5CB' },
      { id: 'f2-6', targetX: 45, targetY: 80, targetRotation: 0, pathData: 'M 0 0 L 20 0 L 25 20 Q 15 30 5 25 Q 0 15 0 5 Z', width: 25, height: 30, color: '#B8C9BE' },
    ],
    knowledge: [
      { title: '汝窑之谜', content: ['汝窑烧造时间极短，仅北宋后期约20年，因宋徽宗时期"京师自置窑烧造"而成为官窑。', '汝窑以玛瑙入釉，釉面呈淡天青色，有"雨过天青云破处，这般颜色做将来"之说。传世汝窑器不足百件。'] },
      { title: '开片之美', content: ['汝窑开片是因胎釉膨胀系数不同而在冷却过程中形成的自然裂纹，初为瑕疵，后成为独特的审美特征。', '常见有"蟹爪纹"、"鱼子纹"、"蝉翼纹"等，以细小自然者为贵。开片纹路经长久使用会形成"金丝铁线"。'] },
    ],
    repairMethods: [
      '清理：汝窑釉面莹润，清理时需格外小心，避免损伤开片纹路',
      '黏接：选用与釉色接近的黏合剂，注意控制用量避免溢胶',
      '随色：汝窑天青色极难调配，需多次试色以达到和谐统一',
      '养护：修复完成后应置于恒温恒湿环境，避免温度骤变',
    ],
    historicalValue: '汝窑为宋代五大名窑之冠，有"宋瓷之冠"的美誉。此洗虽残，但其天青釉色、开片纹路及香灰胎质均为汝窑典型特征，对于研究宋代汝窑的烧造工艺和审美取向具有极其重要的学术价值。',
    imagePrompt: 'Northern Song Dynasty Ru ware celadon glaze washer, sky blue color, ice crackle pattern, Chinese porcelain, museum quality, soft natural light',
  },
  {
    id: 'artifact-3',
    name: '唐三彩骆驼载乐俑',
    era: '唐代',
    origin: '河南洛阳',
    description: '唐三彩是唐代低温铅釉陶器的代表，以黄、绿、白三色为主。骆驼载乐俑造型生动，骆驼昂首伫立，背驮乐舞俑，展现了盛唐时期丝绸之路的繁华景象与中外文化交流的盛况。',
    shape: 'jar',
    baseColor: '#D4A574',
    accentColor: '#A83232',
    difficulty: 1,
    outlinePath: jarOutline,
    fragments: [
      { id: 'f3-1', targetX: 50, targetY: 25, targetRotation: 0, pathData: 'M 35 0 L 65 0 L 65 20 L 35 20 Z', width: 30, height: 20, color: '#E8C89C' },
      { id: 'f3-2', targetX: 35, targetY: 50, targetRotation: -10, pathData: 'M 0 0 L 30 5 L 35 30 L 25 40 L 5 35 Z', width: 35, height: 40, color: '#D4A574' },
      { id: 'f3-3', targetX: 65, targetY: 50, targetRotation: 10, pathData: 'M 5 0 L 35 5 L 35 35 L 10 40 L 0 25 Z', width: 35, height: 40, color: '#C89868' },
      { id: 'f3-4', targetX: 50, targetY: 90, targetRotation: 0, pathData: 'M 10 0 L 40 0 L 45 25 L 5 25 Z', width: 45, height: 25, color: '#D4A574' },
      { id: 'f3-5', targetX: 30, targetY: 70, targetRotation: -5, pathData: 'M 5 0 L 25 5 L 25 35 L 5 30 Z', width: 25, height: 35, color: '#E8C89C' },
    ],
    knowledge: [
      { title: '唐三彩艺术', content: ['唐三彩并非仅有三色，"三"为多之意。常见颜色有黄、绿、白、褐、蓝、黑等，以黄、绿、白三色为主。', '唐三彩以白色黏土为胎，先入窑素烧，再施釉彩二次低温烧成。主要用作明器，是研究唐代社会生活的重要实物资料。'] },
      { title: '丝路文化', content: ['骆驼载乐俑是唐三彩中的精品，生动再现了丝绸之路上的胡汉文化交融。', '骆驼是丝路上的主要交通工具，被称为"沙漠之舟"。乐俑演奏的乐器有琵琶、箜篌等，多为西域传入，反映了唐代包容开放的社会风貌。'] },
    ],
    repairMethods: [
      '脱盐：唐三彩长期埋于地下，需先进行脱盐处理，防止釉面返铅',
      '加固：陶质疏松部位需先进行渗透加固，再行拼接',
      '补塑：缺失部位可用陶土补塑，注意胎质色泽统一',
      '补釉：釉面剥落处可用仿三彩釉料补绘，但需与原釉有可辨识区别',
    ],
    historicalValue: '唐三彩骆驼载乐俑是唐代陶俑中的极品，被誉为"古代艺术的明珠"。此器虽残，但其造型神韵犹存，对于研究唐代中外文化交流、音乐舞蹈及社会生活具有极高的历史与艺术价值。',
    imagePrompt: 'Tang Dynasty sancai tri-color glazed pottery camel with musicians, Chinese art, vibrant glazes, museum artifact, warm lighting',
  },
];

export function getRandomArtifact(): RestorationArtifact {
  const index = Math.floor(Math.random() * restorationArtifacts.length);
  return restorationArtifacts[index];
}

export function shuffleFragments(fragments: RestorationArtifact['fragments'], canvasWidth: number, canvasHeight: number) {
  const shuffled = [...fragments];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.map((frag, idx) => {
    const angle = (idx / shuffled.length) * Math.PI * 2 + Math.random() * 0.5;
    const radius = Math.min(canvasWidth, canvasHeight) * 0.38;
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;

    return {
      ...frag,
      x: centerX + Math.cos(angle) * radius + (Math.random() - 0.5) * 30,
      y: centerY + Math.sin(angle) * radius + (Math.random() - 0.5) * 30,
      rotation: Math.floor(Math.random() * 4) * 90,
    };
  });
}

export function checkCollision(
  frag1: { x: number; y: number; width: number; height: number },
  frag2: { x: number; y: number; width: number; height: number }
): boolean {
  const padding = 5;
  return !(
    frag1.x + frag1.width / 2 + padding < frag2.x - frag2.width / 2 ||
    frag1.x - frag1.width / 2 - padding > frag2.x + frag2.width / 2 ||
    frag1.y + frag1.height / 2 + padding < frag2.y - frag2.height / 2 ||
    frag1.y - frag1.height / 2 - padding > frag2.y + frag2.height / 2
  );
}

export function calculatePlacementAccuracy(
  placedX: number,
  placedY: number,
  placedRotation: number,
  targetX: number,
  targetY: number,
  targetRotation: number
): number {
  const distance = Math.sqrt(
    Math.pow(placedX - targetX, 2) + Math.pow(placedY - targetY, 2)
  );

  let rotationDiff = Math.abs(placedRotation - targetRotation) % 360;
  if (rotationDiff > 180) rotationDiff = 360 - rotationDiff;

  const distanceAccuracy = Math.max(0, 1 - distance / 40);
  const rotationAccuracy = Math.max(0, 1 - rotationDiff / 30);

  return Math.round((distanceAccuracy * 0.7 + rotationAccuracy * 0.3) * 100);
}

export function isPlacementCorrect(accuracy: number): boolean {
  return accuracy >= 60;
}

export function calculateRestorationScore(
  placedFragments: PlacedFragment[],
  totalFragments: number,
  elapsedSeconds: number
): RestorationScore {
  const correctCount = placedFragments.filter((f) => f.isCorrect).length;
  const completenessScore = Math.round((correctCount / totalFragments) * 40);

  const avgAccuracy =
    placedFragments.length > 0
      ? Math.round(
          placedFragments.reduce((sum, f) => sum + f.placementAccuracy, 0) /
            placedFragments.length
        )
      : 0;
  const accuracyScore = Math.round((avgAccuracy / 100) * 35);

  const baseTime = totalFragments * 30;
  const speedRatio = Math.max(0, Math.min(1, 1 - (elapsedSeconds - baseTime) / baseTime));
  const speedScore = Math.round(speedRatio * 25);

  const totalScore = completenessScore + accuracyScore + speedScore;

  let grade: RestorationScore['grade'];
  let feedback: string;

  if (totalScore >= 90) {
    grade = '修复大师';
    feedback = '天衣无缝，恍若重生。您的修复技艺已臻化境，无愧于"修复大师"之誉！';
  } else if (totalScore >= 75) {
    grade = '巧夺天工';
    feedback = '技艺精湛，妙手回春。您的修复手法细腻精准，已得古修复之精髓！';
  } else if (totalScore >= 60) {
    grade = '匠心独运';
    feedback = '颇具匠心，初见成效。继续精进，假以时日必成大器！';
  } else if (totalScore >= 40) {
    grade = '初窥门径';
    feedback = '已入门径，仍需磨炼。注意碎片对位的精准度，多练习手感！';
  } else {
    grade = '尚需努力';
    feedback = '路漫漫其修远兮。修复之道，在于耐心与细致，切勿操之过急！';
  }

  return {
    totalScore,
    accuracyScore,
    speedScore,
    completenessScore,
    grade,
    feedback,
  };
}

export const restorationTips = [
  '先观察碎片的形状、釉色和纹饰特征，判断其在器物上的大致位置',
  '从较大的碎片开始拼接，建立起整体轮廓框架',
  '注意碎片的"茬口"，断裂面凹凸互补的往往是相邻碎片',
  '转角、口沿、底足等特征部位最容易定位，可先确定这些碎片',
  '碎片可旋转调整角度，按R键或点击旋转按钮微调方向',
  '修复之道，首在静心。不急不躁，方能妙手回春',
];
