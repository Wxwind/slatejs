import PhysX from 'physx-js-webidl';

/**
 * PhysX.PxCombineMode.
 * If a compliant (restitution < 0) material interacts with a rigid (restitution >= 0) material, the compliant behavior will be chosen independent of combine mode. In all other cases (i.e., also for compliant-compliant interactions) the combine mode is used
 */
export enum PxCombineMode {
  AVERAGE = 0x00,
  MIN = 0x01,
  MULTIPLY = 0x02,
  MAX = 0x03,
}

/**
 * PhysX.PxShapeFlag.
 * Flags which affect the behavior of PxShapes.
 */
export enum PxShapeFlag {
  /**
   * The shape will partake in collision in the physical simulation.
   */
  SIMULATION_SHAPE = 1 << 0,
  /**
   * The shape will partake in scene queries (ray casts, overlap tests, sweeps, …).
   */
  SCENE_QUERY_SHAPE = 1 << 1,
  /**
   * The shape is a trigger which can send reports whenever other shapes enter/leave its volume.
   */
  TRIGGER_SHAPE = 1 << 2,
  /**
   * Enable debug renderer for this shape.
   */
  VISUALIZATION = 1 << 3,
}
