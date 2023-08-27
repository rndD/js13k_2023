export type Resource = "salt" | "wood" | "stone" | "wheat" | "weapon";
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

  planing: PlaningState;

  storage: StorageState;
  activeCards: Card[];
}

type PlaningState = Record<Resource, Record<number, number>>;

interface Upgrade {
  type: string;
  level: number;
  effects?: Record<string, number>; // type // not sure if needed
  cost?: number;
  costResource?: Record<Resource, number>;
  requiredLvl?: number;
}

interface MenState {
  level1: number;
  level2: number;
  level3: number;
}

interface StorageState {
  resources: Record<Resource, number>;
}

interface Card {
  name: string;
  effects: Record<string, number>; // type
  duration: number;
  level: number;
}
