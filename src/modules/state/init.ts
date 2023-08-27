import { MainState } from "./state.types";

export const initState: MainState = {
  scene: "morning", // set menu
  day: 1,
  nextTributeIn: 3,
  tribute: 10,
  firstPlay: true,
  money: 1,
  men: {
    level1: 3,
    level2: 2,
    level3: 1,
  },
  xp: 0,
  lvl: 1,
  upgrades: [
    { type: "market", level: 1 },
    { type: "saltmine", level: 1 },
    { type: "storage", level: 2 },
  ],
  planing: {
    salt: { "1": 0 },
  },
  storage: {
    resources: {
      salt: 3,
      wood: -0, // -0 means hide it in UI for now until the first time it is used
      stone: -0,
      wheat: -0,
    },
  },
  activeCards: [],
};
