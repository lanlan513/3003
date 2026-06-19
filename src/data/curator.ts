import type { ExhibitionTheme, Exhibition } from '@/types';

export const exhibitionThemes: ExhibitionTheme[] = [
  {
    id: 'song-minimal',
    name: '宋韵雅集',
    description: '以宋代极简美学为基调，青瓷素雅，文人气韵，展现宋瓷"雨过天青云破处"的极致审美',
    color: '#8BA888',
    bgGradient: 'from-porcelain-paper via-[#E8F0E8] to-porcelain-scroll/40',
    icon: 'moon',
  },
  {
    id: 'yuan-blue',
    name: '元青花韵',
    description: '以元代霁蓝釉里红为主色，浓墨重彩，气势雄浑，再现草原帝国的豪迈气魄',
    color: '#2C3E50',
    bgGradient: 'from-porcelain-paper via-[#E8E8F0] to-porcelain-scroll/40',
    icon: 'waves',
  },
  {
    id: 'ming-gold',
    name: '明彩华章',
    description: '以明代描金斗彩为灵感，金碧辉煌，雍容华贵，彰显宫廷气象',
    color: '#C9A962',
    bgGradient: 'from-porcelain-paper via-[#F8F1DD] to-porcelain-scroll/40',
    icon: 'crown',
  },
  {
    id: 'qing-famille',
    name: '清粉彩韵',
    description: '以清代粉彩珐琅为特色，绚丽多姿，精工细作，品味盛世繁华',
    color: '#A83232',
    bgGradient: 'from-porcelain-paper via-[#F8E8E8] to-porcelain-scroll/40',
    icon: 'flower',
  },
  {
    id: 'archeology',
    name: '考古遗珍',
    description: '以土黄灰褐色为主调，遗址现场感，呈现千年不朽的考古传奇',
    color: '#8B7355',
    bgGradient: 'from-porcelain-paper via-[#F0E8D8] to-porcelain-scroll/40',
    icon: 'dig',
  },
  {
    id: 'modern-white',
    name: '当代白瓷',
    description: '以纯白极简为风格，现代美术馆气质，突出器物本真之美',
    color: '#A0A0A0',
    bgGradient: 'from-porcelain-paper via-[#F5F5F5] to-porcelain-scroll/40',
    icon: 'frame',
  },
];

export const defaultCuratorNoteTemplates = [
  '此展品器型周正，釉色莹润，为{era}时期{originKiln}的典型代表之作。',
  '观其形，察其色，品其韵——{name}承载着千年的文化积淀与匠人心血。',
  '这件{name}历经岁月洗礼，依然光彩照人，是中华陶瓷文明的生动见证。',
  '{name}以其独特的{decoration}装饰技法闻名于世，代表了{era}时期的最高工艺水准。',
  '从{originKiln}窑火中诞生的{name}，穿越时空而来，向我们诉说着往昔的故事。',
];

export const generateCuratorNote = (
  template: string,
  artifact: { name: string; era: string; originKiln: string; decoration?: string }
) => {
  return template
    .replace('{name}', artifact.name)
    .replace('{era}', artifact.era)
    .replace('{originKiln}', artifact.originKiln)
    .replace('{decoration}', artifact.decoration || '精美');
};

export const getThemeById = (id: string) =>
  exhibitionThemes.find(t => t.id === id) || exhibitionThemes[0];

export const createNewExhibition = (): Exhibition => ({
  id: `exhibition_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
  title: '',
  subtitle: '',
  themeId: exhibitionThemes[0].id,
  description: '',
  curatorName: '',
  exhibits: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const validateExhibition = (exhibition: Exhibition): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!exhibition.title.trim()) {
    errors.push('请填写展览标题');
  }
  if (exhibition.exhibits.length === 0) {
    errors.push('请至少选择一件展品');
  }
  if (!exhibition.curatorName.trim()) {
    errors.push('请留下策展人的名字');
  }

  return { valid: errors.length === 0, errors };
};

export const rarityOrder = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };

export const eraOrder = [
  '新石器时代', '夏商', '两周', '秦汉', '三国两晋', '南北朝',
  '隋代', '唐代', '五代', '宋代', '辽金', '元代', '明代', '清代', '近现代',
];
