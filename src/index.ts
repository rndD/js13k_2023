import { drawEngine } from "./lib/draw-engine";

import { controls } from "@/lib/controls";
import { html } from "./lib/innerself";
import { MainState } from "./modules/state/state.types";
import { attach, connect } from "./modules/state/index";

const DayComponent = connect(({ day }: { day: number }) => {
  return html`<div class="f3 fl-m f-headline-m">Day ${day}</div> `;
});

function App(state: MainState) {
  return html`<div class="dt w-100 mw8 center">${DayComponent()}</div> `;
}

attach(App, document.querySelector("#root")!);
