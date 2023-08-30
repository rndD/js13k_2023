import { Entity } from "./entity";

type CollisionTest = {
  entity1MaxX: number;
  entity1MaxY: number;
  entity2MaxX: number;
  entity2MaxY: number;
  collide: boolean;
};

export function testAABBCollision(
  entity1pos: DOMPoint,
  entity1wh: { w: number; h: number },
  entity2pos: DOMPoint,
  entity2wh: { w: number; h: number }
) {
  const test: CollisionTest = {
    entity1MaxX: entity1pos.x + entity1wh.w,
    entity1MaxY: entity1pos.y + entity1wh.h,
    entity2MaxX: entity2pos.x + entity2wh.w,
    entity2MaxY: entity2pos.y + entity2wh.h,
    collide: false,
  };

  test.collide =
    entity1pos.x < test.entity2MaxX &&
    test.entity1MaxX > entity2pos.x &&
    entity1pos.y < test.entity2MaxY &&
    test.entity1MaxY > entity2pos.y;

  return test;
}

// entity1 collided into entity2
export function correctAABBCollision(
  entity1: Entity,
  entity2: Entity,
  test: CollisionTest
) {
  const { entity1MaxX, entity1MaxY, entity2MaxX, entity2MaxY } = test;

  const deltaMaxX = entity1MaxX - entity2.pos.x;
  const deltaMaxY = entity1MaxY - entity2.pos.y;
  const deltaMinX = entity2MaxX - entity1.pos.x;
  const deltaMinY = entity2MaxY - entity1.pos.y;
  if (!entity1.moveable) {
    return;
  }

  // AABB collision response (homegrown wall sliding, not physically correct
  // because just pushing along one axis by the distance overlapped)

  // entity1 moving down/right
  if (entity1.moveable.dx > 0 && entity1.moveable.dy > 0) {
    if (deltaMaxX < deltaMaxY) {
      // collided right side first
      entity1.pos.x -= deltaMaxX;
    } else {
      // collided top side first
      entity1.pos.y -= deltaMaxY;
    }
  }
  // entity1 moving up/right
  else if (entity1.moveable.dx > 0 && entity1.moveable.dy < 0) {
    if (deltaMaxX < deltaMinY) {
      // collided right side first
      entity1.pos.x -= deltaMaxX;
    } else {
      // collided bottom side first
      entity1.pos.y += deltaMinY;
    }
  }
  // entity1 moving right
  else if (entity1.moveable.dx > 0) {
    entity1.pos.x -= deltaMaxX;
  }
  // entity1 moving down/left
  else if (entity1.moveable.dx < 0 && entity1.moveable.dy > 0) {
    if (deltaMinX < deltaMaxY) {
      // collided left side first
      entity1.pos.x += deltaMinX;
    } else {
      // collided top side first
      entity1.pos.y -= deltaMaxY;
    }
  }
  // entity1 moving up/left
  else if (entity1.moveable.dx < 0 && entity1.moveable.dy < 0) {
    if (deltaMinX < deltaMinY) {
      // collided left side first
      entity1.pos.x += deltaMinX;
    } else {
      // collided bottom side first
      entity1.pos.y += deltaMinY;
    }
  }
  // entity1 moving left
  else if (entity1.moveable.dx < 0) {
    entity1.pos.x += deltaMinX;
  }
  // entity1 moving down
  else if (entity1.moveable.dy > 0) {
    entity1.pos.y -= deltaMaxY;
  }
  // entity1 moving up
  else if (entity1.moveable.dy < 0) {
    entity1.pos.y += deltaMinY;
  }
}

export function handleCollision(a: Entity, b: Entity) {
  if (!a.physics || !b.physics) return;

  const totalMass = (a.physics.mass || 1) + (b.physics.mass || 1);

  const aDxInitial = a.moveable?.dx || 0;
  const aDyInitial = a.moveable?.dy || 0;
  const bDxInitial = b.moveable?.dx || 0;
  const bDyInitial = b.moveable?.dy || 0;

  if (a.moveable) {
    a.moveable.dx =
      (aDxInitial * (a.physics.mass || 1) +
        2 * (b.physics.mass || 1) * bDxInitial) /
      totalMass;
    a.moveable.dy =
      (aDyInitial * (a.physics.mass || 1) +
        2 * (b.physics.mass || 1) * bDyInitial) /
      totalMass;
  }

  if (b.moveable) {
    b.moveable!.dx =
      (bDxInitial * (b.physics.mass || 1) +
        2 * (a.physics.mass || 1) * aDxInitial) /
      totalMass;
    b.moveable!.dy =
      (bDyInitial * (b.physics.mass || 1) +
        2 * (a.physics.mass || 1) * aDyInitial) /
      totalMass;
  }
}

export function isPointerIn(
  pointer: DOMPoint,
  { x, y, w, h }: { x: number; y: number; w: number; h: number }
) {
  return (
    pointer.x > x && pointer.x < x + w && pointer.y > y && pointer.y < y + h
  );
}
