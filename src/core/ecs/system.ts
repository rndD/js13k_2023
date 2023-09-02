/* eslint-disable max-classes-per-file */
import { Entity, System } from "@/lib/ecs";
import {
  Collidable,
  Draggable,
  Mov,
  Physical,
  Pos,
  Renderable,
} from "./component";
import { controls } from "../controls";
import {
  drawEngine,
  pixelScale,
  tileSize,
  tileSizeUpscaled,
} from "../draw-engine";
import {
  correctAABBCollision,
  isPointerIn,
  testAABBCollision,
} from "@/lib/physics";

// can be part of move system?
export class PhysicsSystem extends System {
  componentsRequired = new Set<Function>([Mov, Physical]);
  update(entities: Set<Entity>): void {
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity);
      const mov = comps.get(Mov);
      const phys = comps.get(Physical);

      const defaultFriction = 0.95;
      mov.dx *= phys.data.friction || defaultFriction;
      mov.dy *= phys.data.friction || defaultFriction;
    }
  }
}

export class MoveSystem extends System {
  componentsRequired = new Set<Function>([Mov, Pos]);
  update(entities: Set<Entity>): void {
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity);
      const mov = comps.get(Mov);
      const pos = comps.get(Pos);

      pos.x += mov.dx;
      pos.y += mov.dy;

      // stops if value is too small
      if (Math.abs(mov.dx) < 0.01) {
        mov.dx = 0;
      }
      if (Math.abs(mov.dy) < 0.01) {
        mov.dy = 0;
      }
    }
  }
}

export class CollideSystem extends System {
  componentsRequired = new Set<Function>([Pos, Collidable]);
  update(entities: Set<Entity>): void {
    for (const entity of entities) {
      // check only mov
      const comps = this.ecs.getComponents(entity);
      const mov = comps.get(Mov);
      if (!mov) {
        continue;
      }

      const pos = comps.get(Pos);

      for (const other of entities) {
        if (other === entity) {
          continue;
        }

        const otherComps = this.ecs.getComponents(other);
        const otherPos = otherComps.get(Pos);
        const t = testAABBCollision(
          pos,
          { w: tileSizeUpscaled, h: tileSizeUpscaled }, // FIXME: implement and use w ,h from col
          otherPos,
          { w: tileSizeUpscaled, h: tileSizeUpscaled }
        );

        if (t.collide) {
          const otherMov = otherComps.get(Mov) as Mov | undefined;
          //   console.log(
          //     "colide",
          //     comps.get(GameObject)?.type,
          //     entity,
          //     otherComps.get(GameObject)?.type,
          //     other
          //   );

          correctAABBCollision(
            { mov, pos },
            { mov: otherMov, pos: otherPos },
            t
          );
        }
      }
    }
  }
}

export class DragSystem extends System {
  componentsRequired = new Set<Function>([Mov, Pos, Draggable]);
  dragging = -1;

  update(entities: Set<Entity>): void {
    const mousePos = controls.mousePosition;

    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity);
      const pos = comps.get(Pos);
      const drag = comps.get(Draggable);

      drag.hovered = isPointerIn(mousePos, {
        x: pos.x,
        y: pos.y,
        w: tileSize * pixelScale,
        h: tileSize * pixelScale,
      });

      if (drag.hovered && !drag.dragging && this.dragging === -1) {
        if (controls.isMouseDown) {
          drag.dragging = true;
          this.dragging = entity;
        }
      }

      if (!controls.isMouseDown && drag.dragging) {
        drag.dragging = false;
        this.dragging = -1;
      }

      if (drag.dragging) {
        const mov = comps.get(Mov);
        mov.dx = (mousePos.x - pos.x) / 50; // FIXME: use mass and mouse force
        mov.dy = (mousePos.y - pos.y) / 50;
      }
    }
  }
}

export class RenderSystem extends System {
  componentsRequired = new Set<Function>([Renderable]);
  update(entities: Set<Entity>): void {
    drawEngine.drawFloor();
    // draw entities
    for (const entity of entities) {
      const comps = this.ecs.getComponents(entity);
      const render = comps.get(Renderable);
      if (!render.visible) {
        continue;
      }
      const pos = comps.get(Pos);
      const drag = comps.get(Draggable);
      if (drag) {
        if (drag.dragging) {
          drawEngine.drawShadow(pos);
        }
        if (drag.hovered && !drag.dragging) {
          drawEngine.drawOverlay(pos);
        }
      }

      drawEngine.drawEntity(pos, render.sprite);
    }
  }
}
