import type { RestorationArtifact, PlacedFragment, RestorationScore } from '@/types';

const vaseOutline = `M 50 12 L 70 12 L 68 32 Q 90 42 84 72 Q 82 108 50 116 Q 18 108 16 72 Q 10 42 32 32 Z`;
const bowlOutline = `M 10 38 Q 50 98 90 38 Q 84 18 50 18 Q 16 18 10 38 Z`;
const jarOutline = `M 32 12 L 68 12 L 68 28 Q 92 38 88 72 Q 84 108 50 114 Q 16 108 12 72 Q 8 38 32 28 Z`;

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
    displayTransform: { scale: 3.0, offsetX: 100, offsetY: 65 },
    fragments: [
      {
        id: 'f1-1',
        targetX: 50, targetY: 20, targetRotation: 0,
        pathData: 'M -10 -13 L 10 -13 L 8 12 L -8 12 Z',
        width: 20, height: 25, color: '#E8E4D8',
      },
      {
        id: 'f1-2',
        targetX: 32, targetY: 48, targetRotation: -10,
        pathData: 'M -15 -8 Q -5 -15 10 -12 Q 14 8 4 18 Q -12 12 -16 2 Z',
        width: 30, height: 33, color: '#E0DCD0',
      },
      {
        id: 'f1-3',
        targetX: 68, targetY: 48, targetRotation: 10,
        pathData: 'M -12 -13 Q 2 -17 16 -11 Q 16 10 9 22 Q -7 15 -15 4 Z',
        width: 31, height: 35, color: '#E8E4D8',
      },
      {
        id: 'f1-4',
        targetX: 28, targetY: 82, targetRotation: -6,
        pathData: 'M -13 -15 Q 8 -12 14 12 Q 7 36 -8 40 Q -18 18 -15 -3 Z',
        width: 32, height: 55, color: '#D8D4C8',
      },
      {
        id: 'f1-5',
        targetX: 72, targetY: 82, targetRotation: 6,
        pathData: 'M -15 -12 Q 10 -10 16 14 Q 12 40 -3 43 Q -18 24 -16 0 Z',
        width: 34, height: 55, color: '#E8E4D8',
      },
      {
        id: 'f1-6',
        targetX: 50, targetY: 106, targetRotation: 0,
        pathData: 'M -20 -14 L 20 -14 Q 28 2 20 14 L -20 14 Q -28 2 -20 -14 Z',
        width: 56, height: 28, color: '#D8D4C8',
      },
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
    displayTransform: { scale: 3.4, offsetX: 88, offsetY: 78 },
    fragments: [
      {
        id: 'f2-1',
        targetX: 28, targetY: 30, targetRotation: -18,
        pathData: 'M -16 -8 Q -5 -15 13 -9 Q 17 7 5 20 Q -12 13 -17 0 Z',
        width: 34, height: 35, color: '#C5D5CB',
      },
      {
        id: 'f2-2',
        targetX: 66, targetY: 30, targetRotation: 18,
        pathData: 'M -14 -14 Q 0 -17 18 -10 Q 18 11 8 25 Q -9 16 -17 2 Z',
        width: 36, height: 39, color: '#B8C9BE',
      },
      {
        id: 'f2-3',
        targetX: 48, targetY: 52, targetRotation: 0,
        pathData: 'M -22 -8 Q -2 -16 20 -10 Q 24 19 14 35 Q -8 33 -18 21 Z',
        width: 48, height: 51, color: '#C5D5CB',
      },
      {
        id: 'f2-4',
        targetX: 22, targetY: 70, targetRotation: -12,
        pathData: 'M -11 -12 Q 3 -9 8 14 Q 2 37 -13 40 Q -19 16 -15 -3 Z',
        width: 28, height: 52, color: '#B8C9BE',
      },
      {
        id: 'f2-5',
        targetX: 72, targetY: 72, targetRotation: 12,
        pathData: 'M -13 -13 Q 4 -8 9 16 Q 3 35 -12 33 Q -19 12 -15 -3 Z',
        width: 28, height: 48, color: '#C5D5CB',
      },
      {
        id: 'f2-6',
        targetX: 48, targetY: 88, targetRotation: 0,
        pathData: 'M -14 -11 L 14 -9 L 18 12 Q 8 22 -3 18 Q -17 8 -14 -11 Z',
        width: 35, height: 33, color: '#B8C9BE',
      },
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
    displayTransform: { scale: 3.0, offsetX: 98, offsetY: 62 },
    fragments: [
      {
        id: 'f3-1',
        targetX: 50, targetY: 20, targetRotation: 0,
        pathData: 'M -18 -10 L 18 -10 L 18 10 L -18 10 Z',
        width: 36, height: 20, color: '#E8C89C',
      },
      {
        id: 'f3-2',
        targetX: 34, targetY: 50, targetRotation: -10,
        pathData: 'M -18 -10 L 12 -8 L 16 17 L 6 27 L -14 22 Z',
        width: 34, height: 39, color: '#D4A574',
      },
      {
        id: 'f3-3',
        targetX: 66, targetY: 50, targetRotation: 10,
        pathData: 'M -15 -10 L 17 -6 L 19 22 L -5 30 L -16 14 Z',
        width: 35, height: 40, color: '#C89868',
      },
      {
        id: 'f3-4',
        targetX: 50, targetY: 94, targetRotation: 0,
        pathData: 'M -24 -12 L 22 -12 L 26 13 L -22 13 Z',
        width: 52, height: 25, color: '#D4A574',
      },
      {
        id: 'f3-5',
        targetX: 30, targetY: 74, targetRotation: -5,
        pathData: 'M -12 -12 L 12 -8 L 12 24 L -10 20 Z',
        width: 26, height: 36, color: '#E8C89C',
      },
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

export function canvasToLocal(
  canvasX: number,
  canvasY: number,
  transform: { scale: number; offsetX: number; offsetY: number }
): { x: number; y: number } {
  return {
    x: (canvasX - transform.offsetX) / transform.scale,
    y: (canvasY - transform.offsetY) / transform.scale,
  };
}

export function localToCanvas(
  localX: number,
  localY: number,
  transform: { scale: number; offsetX: number; offsetY: number }
): { x: number; y: number } {
  return {
    x: localX * transform.scale + transform.offsetX,
    y: localY * transform.scale + transform.offsetY,
  };
}

export function shuffleFragments(
  fragments: RestorationArtifact['fragments'],
  canvasWidth: number,
  canvasHeight: number,
  transform: { scale: number; offsetX: number; offsetY: number }
) {
  const shuffled = [...fragments];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.map((frag, idx) => {
    const spreadAngle = (idx / shuffled.length) * Math.PI * 2 + Math.random() * 0.4;
    const artifactCenterX = canvasWidth / 2;
    const artifactCenterY = canvasHeight / 2;
    const artifactRadius = Math.min(canvasWidth, canvasHeight) * 0.22;
    const spreadRadius = Math.min(canvasWidth, canvasHeight) * 0.42;

    const angle = spreadAngle;
    let initX = artifactCenterX + Math.cos(angle) * spreadRadius;
    let initY = artifactCenterY + Math.sin(angle) * spreadRadius;

    initX = Math.max(30, Math.min(canvasWidth - 30, initX));
    initY = Math.max(30, Math.min(canvasHeight - 30, initY));

    const targetCanvas = localToCanvas(frag.targetX, frag.targetY, transform);
    void artifactCenterX; void artifactCenterY; void artifactRadius; void targetCanvas;

    return {
      ...frag,
      x: initX,
      y: initY,
      rotation: Math.floor(Math.random() * 8) * 45,
    };
  });
}

export function getFragmentAABB(
  x: number,
  y: number,
  width: number,
  height: number,
  rotationDeg: number,
  scale: number = 1
) {
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const hw = (width * scale / 2) * cos + (height * scale / 2) * sin;
  const hh = (width * scale / 2) * sin + (height * scale / 2) * cos;
  return {
    minX: x - hw,
    maxX: x + hw,
    minY: y - hh,
    maxY: y + hh,
  };
}

export function checkCollision(
  fragA: { x: number; y: number; width: number; height: number; rotation: number; scale?: number },
  fragB: { x: number; y: number; width: number; height: number; rotation: number; scale?: number }
): boolean {
  const pad = 4;
  const a = getFragmentAABB(fragA.x, fragA.y, fragA.width, fragA.height, fragA.rotation, fragA.scale ?? 1);
  const b = getFragmentAABB(fragB.x, fragB.y, fragB.width, fragB.height, fragB.rotation, fragB.scale ?? 1);
  return !(
    a.maxX + pad < b.minX ||
    a.minX - pad > b.maxX ||
    a.maxY + pad < b.minY ||
    a.minY - pad > b.maxY
  );
}

export function calculatePlacementAccuracy(
  placedLocalX: number,
  placedLocalY: number,
  placedRotation: number,
  targetX: number,
  targetY: number,
  targetRotation: number
): number {
  const distance = Math.sqrt(
    Math.pow(placedLocalX - targetX, 2) + Math.pow(placedLocalY - targetY, 2)
  );

  let rotationDiff = Math.abs(placedRotation - targetRotation) % 360;
  if (rotationDiff > 180) rotationDiff = 360 - rotationDiff;

  const distanceAccuracy = Math.max(0, 1 - distance / 12);
  const rotationAccuracy = Math.max(0, 1 - rotationDiff / 25);

  return Math.round((distanceAccuracy * 0.7 + rotationAccuracy * 0.3) * 100);
}

export function isPlacementCorrect(accuracy: number): boolean {
  return accuracy >= 55;
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

  const baseTime = totalFragments * 28;
  const speedRatio = Math.max(0, Math.min(1, 1 - Math.max(0, elapsedSeconds - baseTime) / baseTime));
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
