import { MainState } from "./state.types";

export const initState: MainState = {
  scene: "day", // set menu
  day: 1,
  nextTributeIn: 3,
  tribute: 10,
  firstPlay: true,
  money: 1,

  men: {
    level1: 0,
    level2: 1,
    level3: 0,
  },
  xp: 0,
  lvl: 1,
  upgrades: [],
  storage: {
    capacity: 3,
    resources: {
      salt: 4,
      wood: -0,
      stone: -0,
      wheat: -0,
    },
  },
  activeCards: [],
};
