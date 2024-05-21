import { vec2 } from 'gl-matrix';
import { Camera } from '@/camera';
import { CanvasContext, IRenderingPlugin } from '@/interface';
import { ContextSystem } from '@/systems';

export interface RulerScale {
  num: number;

  position: number;
  isPrimaryKey: boolean;
}

export type CoordinatePluginOpts = {
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

  showCoordinate?: boolean;
};

export class CoordinatePlugin implements IRenderingPlugin {
  name = 'Coordinate';

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
  originColor = '#ffffff88';

  dpr = 1;
  showCoordinate = true;

  constructor(opts?: Partial<CoordinatePluginOpts>) {
    if (opts) {
      opts.minstep && (this.minstep = opts.minstep);
      opts.maxStep && (this.maxStep = opts.maxStep);
      opts.lineWidth && (this.lineWidth = opts.lineWidth);
      opts.fontSize && (this.fontSize = opts.fontSize);
      opts.fontFamily && (this.fontFamily = opts.fontFamily);
      opts.fontWeight && (this.fontWeight = opts.fontWeight);
      opts.textColor && (this.textColor = opts.textColor);
      opts.gridSubkeyColor && (this.gridSubkeyColor = opts.gridSubkeyColor);
      opts.gridKeyColor && (this.gridKeyColor = opts.gridKeyColor);
      opts.showCoordinate && (this.showCoordinate = opts.showCoordinate);
    }

    this.rulerTextOffset = [20, 20];
  }

  apply = (context: CanvasContext) => {
    const { renderingSystem, renderingContext, camera, config, contextSystem } = context;
    const { devicePixelRatio } = config;
    this.dpr = devicePixelRatio;

    renderingSystem.hooks.init.tap(() => {
      camera.setFlipY(true);
    });

    const drawCoordinate = () => {
      const { width, height } = config;
      const ctx = (contextSystem as ContextSystem<CanvasRenderingContext2D>).getContext();

      const cam = camera as Camera;
      const zoom = cam.Zoom;

      const viewScaleX = zoom[0]; // fixed pixel per unit
      const viewScaleY = zoom[1];

      const left = cam.BoxLeft / zoom[0] + cam.Position[0];
      const right = cam.BoxRight / zoom[0] + cam.Position[0];
      const top = cam.BoxTop / zoom[1] + cam.Position[1];
      const bottom = cam.BoxBottom / zoom[1] + cam.Position[1];

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
    };

    renderingSystem.hooks.beforeRender.tap(() => {
      this.showCoordinate && drawCoordinate();
    });
  };

  private calculateRulerScale(length: number, scale: number, flip: boolean, begin: number, end: number): RulerScale[] {
    const list: RulerScale[] = [];

    //  const step = clamp(scale, this.minstep, this.maxStep);
    const step = scale;

    // console.log(
    //   'axis: %s, number from %s to %s, offset from %s to %s, scale: %s',
    //   flip ? 'y' : 'x',
    //   b,
    //   e,
    //   begin,
    //   end,
    //   scale
    // );

    const be = end - begin;

    const keyUnit = Math.pow(10, Math.ceil(Math.log10(be)) - 1);
    // find biggest lower bounds

    const beginBounds = Math.floor(begin / keyUnit) * keyUnit;
    const offsetOfZero = -begin * step;
    const offset = beginBounds * step + offsetOfZero; // offset of begin num

    for (let i = beginBounds; i <= end; i += keyUnit) {
      list.push({
        num: i,
        position: flip ? length - ((i - beginBounds) * step + offset) : (i - beginBounds) * step + offset,
        isPrimaryKey: true,
      });

      for (let subi = i + keyUnit / 5; subi < i + keyUnit; subi += keyUnit / 5) {
        list.push({
          num: subi,
          position: flip ? length - ((subi - beginBounds) * step + offset) : (subi - beginBounds) * step + offset,
          isPrimaryKey: false,
        });
      }
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
      ctx.fillText(
        (Math.round(r.num * 1000) / 1000).toString(),
        r.position,
        canvasHeight - this.rulerTextOffset[0] + this.fontSize
      );
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
      ctx.fillText((Math.round(r.num * 1000) / 1000).toString(), this.rulerTextOffset[1], r.position);
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
      if (a.num === 0) ctx.strokeStyle = this.originColor;
      else ctx.strokeStyle = a.isPrimaryKey ? this.gridKeyColor : this.gridSubkeyColor;
      ctx.closePath();
      ctx.lineWidth = this.lineWidth;
      ctx.setLineDash([]);
      ctx.stroke();
    }
    for (const a of yRulerScale) {
      ctx.beginPath();
      ctx.moveTo(0, a.position);
      ctx.lineTo(width, a.position);
      if (a.num === 0) ctx.strokeStyle = this.originColor;
      else ctx.strokeStyle = a.isPrimaryKey ? this.gridKeyColor : this.gridSubkeyColor;
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
