import { CreateStore } from './lib/innerself'

declare module '*.jpg';
declare module '*.png';

declare global {
  interface Window {
    dispatch: ReturnType<CreateStore>['dispatch']
    c2d: HTMLCanvasElement
  }
}