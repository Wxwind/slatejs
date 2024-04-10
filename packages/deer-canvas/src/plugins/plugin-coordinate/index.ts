import { CanvasContext, IRenderingPlugin } from '@/interface';
import { ContextSystem } from '@/systems';
import { clamp } from '@/util';
import { vec2, vec3 } from 'gl-matrix';

export interface RulerScale {
  num: number;

  position: number;
  isPrimaryKey: boolean;
}

export class CoordinatePlugin implements IRenderingPlugin {
  rulerWidth = 10;
  cellSize: vec2 = [16, 16];

  minstep = 0.05 * 16;
  maxStep = 100 * 16;

  rulerTextOffset = 16;

  /** style */
  lineSize = 1;
  fontSize = 10;
  fontFamily = 'monospace';
  fontWeight = 100;
  textColor = '#00000080';
  gridSubkeyColor = '#CCCCCC20';
  gridKeyColor = '#CCCCCC40';

  dpr = 1;

  apply = (context: CanvasContext) => {
    const { renderingSystem, renderingContext, camera, config, contextSystem } = context;
    const { devicePixelRatio } = config;
    this.dpr = devicePixelRatio;

    renderingSystem.hooks.init.tap(() => {
      camera.setFlipY(true);
      renderingContext.root.transform.setLocalScale(this.cellSize[0], this.cellSize[1]);
    });

    renderingSystem.hooks.afterRender.tap(() => {
      const { width, height } = config;
      const ctx = (contextSystem as ContextSystem<CanvasRenderingContext2D>).getContext();

      const viewOffset = vec3.subtract(vec3.create(), camera.Position, vec3.fromValues(width / 2, height / 2, 0));

      const cellSize = this.cellSize; // pixel per unit
      const viewScaleX = cellSize[0] / camera.Zoom; // fixed pixel per unit
      const viewScaleY = cellSize[1] / camera.Zoom;

      const xList = this.calculateRulerScale(width, viewOffset[0], viewScaleX, false);
      const yList = this.calculateRulerScale(height, viewOffset[1], viewScaleY, true);
      ctx.save();
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

  calculateRulerScale(length: number, offset: number, scale: number, flip: boolean): RulerScale[] {
    const list: RulerScale[] = [];

    const step = clamp(scale, this.minstep, this.maxStep);
    const begin = offset * step;
    const end = (length + offset) * step;

    for (let i = begin; i <= end; i += step) {
      list.push({ num: i / step, position: flip ? length - i : i, isPrimaryKey: true });
      const subi = i / 2;
      list.push({ num: subi / step, position: flip ? length - subi : subi, isPrimaryKey: false });
    }

    return list;
  }

  drawXRulerScale(ctx: CanvasRenderingContext2D, rulerScale: RulerScale[], canvasHeight: number) {
    rulerScale.forEach((r) => {
      if (!r.isPrimaryKey) return;
      ctx.fillStyle = this.textColor;
      setFont(ctx, this.dpr, {
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        fontWeight: this.fontWeight,
      });
      ctx.fillText(r.num.toString(), r.position, canvasHeight - this.rulerTextOffset + this.fontSize);
    });
  }

  drawYRulerScale(ctx: CanvasRenderingContext2D, rulerScale: RulerScale[]) {
    ctx.textAlign = 'right';
    rulerScale.forEach((r) => {
      if (!r.isPrimaryKey) return;
      ctx.fillStyle = this.textColor;
      setFont(ctx, this.dpr, {
        fontSize: this.fontSize,
        fontFamily: this.fontFamily,
        fontWeight: this.fontWeight,
      });
      ctx.fillText(r.num.toString(), this.rulerTextOffset, r.position);
    });
  }

  drawGrid(
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
      ctx.lineWidth = this.lineSize;
      ctx.setLineDash([]);
      ctx.stroke();
    }
    for (const a of yRulerScale) {
      ctx.beginPath();
      ctx.moveTo(0, a.position);
      ctx.lineTo(width, a.position);
      ctx.strokeStyle = a.isPrimaryKey ? this.gridKeyColor : this.gridSubkeyColor;
      ctx.closePath();
      ctx.lineWidth = this.lineSize;
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
  strList.push(`${(opts.fontSize || 12) * dpr}px`);
  strList.push(`${opts.fontFamily || 'sans-serif'}`);
  ctx.font = `${strList.join(' ')}`;
}
