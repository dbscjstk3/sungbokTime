declare module 'box2d-wasm' {
  interface Box2DModule extends EmscriptenModule {
    b2Vec2: typeof b2Vec2;
    b2World: typeof b2World;
    b2Body: typeof b2Body;
    b2BodyDef: typeof b2BodyDef;
    b2FixtureDef: typeof b2FixtureDef;
    b2PolygonShape: typeof b2PolygonShape;
    b2EdgeShape: typeof b2EdgeShape;
    b2CircleShape: typeof b2CircleShape;
    b2_staticBody: number;
    b2_kinematicBody: number;
    b2_dynamicBody: number;
  }

  interface b2Vec2 {
    x: number;
    y: number;
  }

  interface b2World {
    CreateBody(def: b2BodyDef): b2Body;
    Step(timeStep: number, velocityIterations: number, positionIterations: number): void;
    ClearForces(): void;
  }

  interface b2Body {
    SetTransform(position: b2Vec2, angle: number): void;
    GetPosition(): b2Vec2;
    GetAngle(): number;
    SetAngularVelocity(velocity: number): void;
    GetAngularVelocity(): number;
    SetLinearVelocity(velocity: b2Vec2): void;
    GetLinearVelocity(): b2Vec2;
    CreateFixture(def: b2FixtureDef): b2Fixture;
    CreateFixture(shape: b2Shape, density: number): b2Fixture;
    ApplyForce(force: b2Vec2, point: b2Vec2): void;
    ApplyImpulse(impulse: b2Vec2, point: b2Vec2): void;
  }

  interface b2BodyDef {
    set_type(type: number): void;
  }

  interface b2FixtureDef {
    set_density(density: number): void;
    set_restitution(restitution: number): void;
    set_shape(shape: b2Shape): void;
  }

  interface b2Shape {
    // Base interface
  }

  interface b2PolygonShape extends b2Shape {
    SetAsBox(hx: number, hy: number, centerX: number, centerY: number, angle: number): void;
  }

  interface b2EdgeShape extends b2Shape {
    SetTwoSided(v1: b2Vec2, v2: b2Vec2): void;
  }

  interface b2CircleShape extends b2Shape {
    set_m_radius(radius: number): void;
  }

  interface b2Fixture {
    // Fixture interface
  }

  declare namespace Box2D {
    type b2Vec2 = b2Vec2;
    type b2World = b2World;
    type b2Body = b2Body;
    type b2BodyDef = b2BodyDef;
    type b2FixtureDef = b2FixtureDef;
    type b2PolygonShape = b2PolygonShape;
    type b2EdgeShape = b2EdgeShape;
    type b2CircleShape = b2CircleShape;
  }

  function Box2DFactory(): Promise<Box2DModule>;
  export default Box2DFactory;
}

