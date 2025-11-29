interface EmscriptenModule {
  [key: string]: any;
}

declare namespace Box2D {
  interface b2Vec2 {
    x: number;
    y: number;
  }

  interface b2World {
    CreateBody(def: b2BodyDef): b2Body;
    DestroyBody(body: b2Body): void;
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
    SetAwake(flag: boolean): void;
    SetEnabled(flag: boolean): void;
    CreateFixture(def: b2FixtureDef): b2Fixture;
    CreateFixture(shape: b2Shape, density: number): b2Fixture;
    ApplyForce(force: b2Vec2, point: b2Vec2): void;
    ApplyImpulse(impulse: b2Vec2, point: b2Vec2): void;
    ApplyLinearImpulseToCenter(impulse: b2Vec2, wake?: boolean): void;
    GetContactList(): any;
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
}

declare module 'box2d-wasm' {
  interface Box2DModule extends EmscriptenModule {
    b2Vec2: new (x: number, y: number) => Box2D.b2Vec2;
    b2World: new (gravity: Box2D.b2Vec2) => Box2D.b2World;
    b2Body: any;
    b2BodyDef: new () => Box2D.b2BodyDef;
    b2FixtureDef: new () => Box2D.b2FixtureDef;
    b2PolygonShape: new () => Box2D.b2PolygonShape;
    b2EdgeShape: new () => Box2D.b2EdgeShape;
    b2CircleShape: new () => Box2D.b2CircleShape;
    b2_staticBody: number;
    b2_kinematicBody: number;
    b2_dynamicBody: number;
  }

  function Box2DFactory(): Promise<Box2DModule>;
  export default Box2DFactory;
}
