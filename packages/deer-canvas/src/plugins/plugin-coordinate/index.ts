import { Camera } from '@/camera';
import { CanvasContext, IRenderingPlugin } from '@/interface';
import { ContextSystem } from '@/systems';
import { vec2 } from 'gl-matrix';

export interface RulerScale {
  num: number;

  position: number;
  isPrimaryKey: boolean;
}

export type CoordinatePluginOpts = {
  cellSize: number;

  minstep: number;
  maxStep: number;

  /** style */
  lineWidth: number;
  fontSize: number;
  fontFamily: string;
  fontWeight: number;
  textColor: string;
  gridSubkeyColor: string;
  gridKeyColor: string;
};

export class CoordinatePlugin implements IRenderingPlugin {
  name = 'Coordinate';

  cellSize = 32;

  minstep = 0.05 * 16;
  maxStep = 100 * 16;

  rulerTextOffset: vec2;

  /** style */
  lineWidth = 1;
  fontSize = 8;
  fontFamily = 'monospace';
  fontWeight = 100;
  textColor = '#757881';
  gridSubkeyColor = '#CCCCCC20';
  gridKeyColor = '#CCCCCC40';

  dpr = 1;

  constructor(opts?: Partial<CoordinatePluginOpts>) {
    if (opts) {
      opts.cellSize && (this.cellSize = opts.cellSize);
      opts.minstep && (this.minstep = opts.minstep);
      opts.maxStep && (this.maxStep = opts.maxStep);
      opts.lineWidth && (this.lineWidth = opts.lineWidth);
      opts.fontSize && (this.fontSize = opts.fontSize);
      opts.fontFamily && (this.fontFamily = opts.fontFamily);
      opts.fontWeight && (this.fontWeight = opts.fontWeight);
      opts.textColor && (this.textColor = opts.textColor);
      opts.gridSubkeyColor && (this.gridSubkeyColor = opts.gridSubkeyColor);
      opts.gridKeyColor && (this.gridKeyColor = opts.gridKeyColor);
    }

    this.rulerTextOffset = [this.cellSize - 2, this.cellSize - 2];
  }

  apply = (context: CanvasContext) => {
    const { renderingSystem, renderingContext, camera, config, contextSystem } = context;
    const { devicePixelRatio } = config;
    this.dpr = devicePixelRatio;
    const rootTransfrom = renderingContext.root.transform;

    renderingSystem.hooks.init.tap(() => {
      camera.setFlipY(true);

      rootTransfrom.setLocalScale(this.cellSize, this.cellSize);
    });

    renderingSystem.hooks.beforeRender.tap(() => {
      const { width, height } = config;
      const ctx = (contextSystem as ContextSystem<CanvasRenderingContext2D>).getContext();

      const cam = camera as Camera;
      const zoom = cam.Zoom;

      const cellSize = this.cellSize; // pixel per unit
      const viewScaleX = cellSize * zoom; // fixed pixel per unit
      const viewScaleY = cellSize * zoom;

      const left = cam.BoxLeft / zoom + cam.Position[0];
      const right = cam.BoxRight / zoom + cam.Position[0];
      const top = cam.BoxTop / zoom + cam.Position[1];
      const bottom = cam.BoxBottom / zoom + cam.Position[1];

      const xList = this.calculateRulerScale(width, viewScaleX, false, left, right);

      const yList = this.calculateRulerScale(height, viewScaleY, true, bottom, top);
      ctx.save();
      ctx.scale(this.dpr, this.dpr);
      ctx.clearRect(0, 0, width, height);
      this.drawXRulerScale(ctx, xList, height);
      this.drawYRulerScale(ctx, yList);

      this.drawGrid(ctx, {
        xRulerScale: xList,
        yRulerScale: yList,
        width,
        height,
      });
      ctx.restore();
    });
  };

  /**
   * @param offset offset of origin
   */
  private calculateRulerScale(
    length: number,
    scale: number,
    flip: boolean,

    begin: number,
    end: number
  ): RulerScale[] {
    const list: RulerScale[] = [];

    //  const step = clamp(scale, this.minstep, this.maxStep);
    const step = scale;

    const b = Math.floor(begin / this.cellSize); // begin num
    const e = Math.ceil(end / 32); // end num
    const offset = (begin / 32 - Math.floor(begin / 32)) * step; // offset of begin num

    // console.log(
    //   'axis: %s, number from %s to %s, offset from %s to %s, scale: %s',
    //   flip ? 'y' : 'x',
    //   b,
    //   e,
    //   begin,
    //   end,
    //   scale
    // );

    const keyUnit = 1;
    for (let i = b, j = 0; i <= e; i += keyUnit, j++) {
      list.push({
        num: i,
        position: flip ? length - (j * step * keyUnit - offset) : j * step * keyUnit - offset,
        isPrimaryKey: true,
      });
      const subi = j * keyUnit + keyUnit / 2;
      list.push({
        num: subi,
        position: flip ? length - (subi * step - offset) : subi * step - offset,
        isPrimaryKey: false,
      });
    }

    return list;
  }

  private drawXRulerScale(ctx: CanvasRenderingContext2D, rulerScale: RulerScale[], canvasHeight: number) {
    rulerScale.forEach((r) => {
      if (!r.isPrimaryKey) return;
      ctx.fillStyle = this.textColor;
      setFont(ctx, this.dpr, {
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        fontWeight: this.fontWeight,
      });
      ctx.fillText(r.num.toString(), r.position, canvasHeight - this.rulerTextOffset[0] + this.fontSize);
    });
  }

  private drawYRulerScale(ctx: CanvasRenderingContext2D, rulerScale: RulerScale[]) {
    ctx.textAlign = 'right';
    rulerScale.forEach((r) => {
      if (!r.isPrimaryKey) return;
      ctx.fillStyle = this.textColor;
      setFont(ctx, this.dpr, {
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        fontWeight: this.fontWeight,
      });
      ctx.fillText(r.num.toString(), this.rulerTextOffset[1], r.position);
    });
  }

  private drawGrid(
    ctx: CanvasRenderingContext2D,
    opts: {
      xRulerScale: RulerScale[];
      yRulerScale: RulerScale[];
      width: number;
      height: number;
    }
  ) {
    const { xRulerScale, yRulerScale, width, height } = opts;
    for (const a of xRulerScale) {
      ctx.beginPath();
      ctx.moveTo(a.position, 0);
      ctx.lineTo(a.position, height);
      ctx.strokeStyle = a.isPrimaryKey ? this.gridKeyColor : this.gridSubkeyColor;
      ctx.closePath();
      ctx.lineWidth = this.lineWidth;
      ctx.setLineDash([]);
      ctx.stroke();
    }
    for (const a of yRulerScale) {
      ctx.beginPath();
      ctx.moveTo(0, a.position);
      ctx.lineTo(width, a.position);
      ctx.strokeStyle = a.isPrimaryKey ? this.gridKeyColor : this.gridSubkeyColor;
      ctx.closePath();
      ctx.lineWidth = this.lineWidth;
      ctx.setLineDash([]);
      ctx.stroke();
    }
  }
}

function setFont(
  ctx: CanvasRenderingContext2D,
  dpr: number,
  opts: { fontSize?: number; fontFamily?: string; fontWeight?: 'bold' | number | string }
): void {
  const strList: string[] = [];
  if (opts.fontWeight) {
    strList.push(`${opts.fontWeight}`);
  }
  strList.push(`${opts.fontSize || 12}px`);
  strList.push(`${opts.fontFamily || 'sans-serif'}`);
  ctx.font = `${strList.join(' ')}`;
}
