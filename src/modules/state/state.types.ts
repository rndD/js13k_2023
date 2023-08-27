export interface MainState {
  scene: "menu" | "morning" | "planing" | "day" | "day-result" | "gameover";
  day: number;

  nextTributeIn: number;
  tribute: number;

  firstPlay: boolean;
  money: number;
  men: MenState;

  xp: number;
  lvl: number;

  upgrades: Upgrade[];

  storage: StorageState;
  activeCards: Card[];
}

interface Upgrade {
  name: string;
  effects: Record<string, number>; // type // not sure if needed
  cost: number;
  costResource: Record<string, number>; // type;
}

interface MenState {
  level1: number;
  level2: number;
  level3: number;
}

interface StorageState {
  capacity: number;
  resources: Record<string, number>; // type
}

interface Card {
  name: string;
  effects: Record<string, number>; // type
  duration: number;
  level: number;
}
