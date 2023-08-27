import { initState } from "./init";
import { MainState } from "./state.types";

export default function reducer(
  state: MainState = initState,
  action: string,
  args: any[]
) {
  switch (action) {
    case "END_MORNING": {
      const [value] = args;
      return Object.assign({}, state, {
        scene: "planing",
      });
    }
    case "ADD_MAN": {
      //   const { tasks, archive } = state;
      //   const [index] = args;
      //   const task = tasks[index];
      return Object.assign({}, state, {});
    }
    default:
      return state;
  }
}
