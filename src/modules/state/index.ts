import { createStore } from "@/lib/innerself";
import reducer from "./reducer";

// @ts-ignore
const { attach, connect, dispatch } = createStore(reducer);

window.dispatch = dispatch;
export { attach, connect };
