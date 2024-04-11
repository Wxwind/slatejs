import { CanvasContext, IRenderingPlugin } from '@/interface';
import { ContextSystem } from '@/systems';
import { vec2, vec3 } from 'gl-matrix';

export interface RulerScale {
  num: number;

  position: number;
  isPrimaryKey: boolean;
}

export type CoordinatePluginOpts = {
  cellSize: vec2;

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

  cellSize: vec2 = [32, 32];

  minstep = 0.05 * 16;
  maxStep = 100 * 16;

  rulerTextOffset: vec2;

  /** style */
  lineWidth = 1;
  fontSize = 8;
  fontFamily = 'monospace';
  fontWeight = 100;
  textColor = '#00000080';
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

    this.rulerTextOffset = [this.cellSize[0] - 2, this.cellSize[1] - 2];
  }

  apply = (context: CanvasContext) => {
    const { renderingSystem, renderingContext, camera, config, contextSystem } = context;
    const { devicePixelRatio } = config;
    this.dpr = devicePixelRatio;

    renderingSystem.hooks.init.tap(() => {
      camera.setFlipY(true);
      renderingContext.root.transform.setLocalScale(this.cellSize[0], this.cellSize[1]);
    });

    renderingSystem.hooks.beforeRender.tap(() => {
      const { width, height } = config;
      const ctx = (contextSystem as ContextSystem<CanvasRenderingContext2D>).getContext();

      const viewOffset = vec3.subtract(vec3.create(), camera.Position, vec3.fromValues(width / 2, height / 2, 0));

      const cellSize = this.cellSize; // pixel per unit
      const viewScaleX = cellSize[0] / camera.Zoom; // fixed pixel per unit
      const viewScaleY = cellSize[1] / camera.Zoom;

      const xList = this.calculateRulerScale(width, viewOffset[0], viewScaleX, false);
      const yList = this.calculateRulerScale(height, viewOffset[1], viewScaleY, true);
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
  private calculateRulerScale(length: number, offset: number, scale: number, flip: boolean): RulerScale[] {
    const list: RulerScale[] = [];

    //  const step = clamp(scale, this.minstep, this.maxStep);
    const step = scale;

    const begin = offset / step;
    const end = (length + offset) / step;

    // console.log('begin: %s, end: %s, axis: %s', begin, end, flip ? 'y' : 'x', offset);

    const keyUnit = 1;
    for (let i = Math.floor(begin); i <= Math.ceil(end); i += keyUnit) {
      list.push({ num: i, position: flip ? length - (i * step - offset) : i * step - offset, isPrimaryKey: true });
      const subi = i + keyUnit / 2;
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
      ctx.fillText(r.num.toFixed(2), r.position, canvasHeight - this.rulerTextOffset[0] + this.fontSize);
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
      ctx.fillText(r.num.toFixed(2), this.rulerTextOffset[1], r.position);
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
