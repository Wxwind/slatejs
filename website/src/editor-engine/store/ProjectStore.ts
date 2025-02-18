import { DeerEngine } from 'deer-engine';

export class ProjectStore {
  engine: DeerEngine | undefined;
  async initEngine(containerId: string) {
    const engine = await DeerEngine.create({
      containerId,
    });

    this.engine = engine;
  }
}
