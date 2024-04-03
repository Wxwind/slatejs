import { CanvasContext, RenderingContext } from '../interface';
import { DisplayObject } from '../core/DisplayObject';
import { SyncHook } from '../util/tapable';
import { ICamera } from '../camera';

export class RenderingSystem {
  renderListCurrentFrame: DisplayObject[] = [];

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
    cull: new SyncHook<[DisplayObject, ICamera], DisplayObject>(),
    /**
     * called at the begining of every frame
     */
    beginFrame: new SyncHook<[]>(),
    /**
     * called before every object is rendered
     */
    beforeRender: new SyncHook<[]>(),
    /**
     * called when every object is renderings
     */
    render: new SyncHook<[DisplayObject[]]>(),
    /**
     * called after every object is rendered
     */
    afterRender: new SyncHook<[]>(),
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

    const root = this.context.renderingContext.root;
    root.transform.syncRecursive();
    this.renderDisplayObject(root, this.context.renderingContext);
    // console.log(this.stats);

    this.hooks.beginFrame.call();

    this.hooks.beforeRender.call();
    this.hooks.render.call(this.renderListCurrentFrame);
    this.hooks.afterRender.call();

    this.hooks.endFrame.call();
    this.renderListCurrentFrame = [];
  };

  /** Collect objects to render */
  private renderDisplayObject(displayObject: DisplayObject, renderingContext: RenderingContext) {
    // TODO: dirty check first
    const renderable = displayObject.renderable;
    const isDirty = true; // renderable.dirty

    if (isDirty) {
      // TODO: cull
      const needRender = this.hooks.cull.call(displayObject, this.context.camera);
      if (needRender) {
        this.stats.rerenderedCount++;
        this.renderListCurrentFrame.push(displayObject);
      }
    }

    this.stats.totalCount++;

    displayObject.children.forEach((child) => {
      this.renderDisplayObject(child, renderingContext);
    });
  }
}
