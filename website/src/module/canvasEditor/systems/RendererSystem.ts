import { CanvasContext, RenderingContext } from '../interface';
import { DisplayObject } from '../DisplayObject';
import { SyncHook } from '../util/tapable';

export class RenderingSystem {
  private stats = {
    /**
     * the count of display objects in scene
     */
    totalCount: 0,
    /**
     * the count of display objects need to be rerendered in this frame
     */
    rerenderedCount: 0,
  };

  hooks = {
    init: new SyncHook<[]>(),
    /**
     * called at the begining of every frame
     */
    beginFrame: new SyncHook<[]>(),
    /**
     * called before every object is rendered
     */
    beforeRender: new SyncHook<[DisplayObject]>(),
    /**
     * called when every object is renderings
     */
    render: new SyncHook<[DisplayObject]>(),
    /**
     * called after every object is rendered
     */
    afterRender: new SyncHook<[DisplayObject]>(),
    /**
     * called at the end of every frame
     */
    endFrame: new SyncHook<[]>(),

    destory: new SyncHook<[]>(),
  };

  constructor(private context: CanvasContext) {}

  init = () => {
    this.hooks.init.call();
  };

  dispose = () => {
    this.hooks.destory.call();
  };

  render: () => void = () => {
    this.stats = {
      totalCount: 0,
      rerenderedCount: 0,
    };

    const { renderingContext } = this.context;

    this.renderDisplayObject(this.context.renderingContext.root, this.context.renderingContext);

    this.hooks.beginFrame.call();

    renderingContext.renderListCurrentFrame.forEach((object) => {
      this.hooks.beforeRender.call(object);
      this.hooks.render.call(object);
      this.hooks.afterRender.call(object);
    });

    this.hooks.endFrame.call();
    renderingContext.renderListCurrentFrame = [];
  };

  private renderDisplayObject(displayObject: DisplayObject, renderingContext: RenderingContext) {
    // TODO: dirty check first
    const isDirty = true;

    if (isDirty) {
      // TODO: cull
      this.stats.rerenderedCount++;
      renderingContext.renderListCurrentFrame.push(displayObject);
    }

    this.stats.totalCount++;

    displayObject.children.forEach((child) => {
      this.renderDisplayObject(child, renderingContext);
    });
  }
}
