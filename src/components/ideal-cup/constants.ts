import { BibimbapIcon, BurgerIcon, InstantIcon, KimbapIcon, MysteryIcon, NoodleIcon, SteakIcon, SushiIcon } from "./Icons";

export const CATEGORIES = [
  { id: '한식', sub: '든든하게!', icon: BibimbapIcon },
  { id: '중식', sub: '기름지게!', icon: NoodleIcon },
  { id: '일식', sub: '깔끔하게!', icon: SushiIcon },
  { id: '양식', sub: '고급지게!', icon: SteakIcon },
  { id: '분식', sub: '추억 삼아!', icon: KimbapIcon },
  { id: '패스트푸드', sub: '빠르게!', icon: BurgerIcon },
  { id: '카페', sub: '달콤하게!', icon: InstantIcon },
  { id: '기타', sub: '이도 저도?', icon: MysteryIcon },
];

export const DEFAULT_CATEGORY_ICON: Record<string, string> = {
  '한식':       'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f35a.svg',
  '중식':       'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f35c.svg',
  '일식':       'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f363.svg',
  '양식':       'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f35d.svg',
  '분식':       'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f359.svg',
  '패스트푸드':  'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f354.svg',
  '간편식':     'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f35c.svg',
  '카페':       'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/2615.svg',
  '기타':       'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f372.svg',
};

export type DBFood = {
  id: number;
  name: string;
  category: string;
  imgUrl: string | null;
};

export function getBracketSize(count: number): number {
  const sizes = [8, 4, 2]; // 8강, 4강, 결승
  for (const size of sizes) {
    if (count >= size) return size;
  }
  return 0; 
}

export function mapDBtoFoods(dbFoods: DBFood[]): Record<string, any[]> {
  return dbFoods.reduce((acc, food) => {
    if (!acc[food.category]) acc[food.category] = [];
    acc[food.category].push({
      id:   food.id, 
      name: food.name,
      cat:  food.category,
      icon: food.imgUrl ?? DEFAULT_CATEGORY_ICON[food.category] ?? 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14/assets/svg/1f372.svg',
    });
    return acc;
  }, {} as Record<string, any[]>);
}