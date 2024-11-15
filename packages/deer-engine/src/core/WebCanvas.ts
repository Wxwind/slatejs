export class WebCanvas {
  _webCanvas: HTMLCanvasElement;

  private _width: number = 0;
  public get width(): number {
    return this._width;
  }
  public set width(v: number) {
    this._width = v;
    this._webCanvas.width = v;
  }

  private _height: number = 0;
  public get height(): number {
    return this._height;
  }
  public set height(v: number) {
    this._height = v;
    this._webCanvas.height = v;
  }

  /**  */
  resizeByClientSize(pixelRatio: number = window.devicePixelRatio): void {
    const webCanvas = this._webCanvas;

    const exportWidth = webCanvas.clientWidth * pixelRatio;
    const exportHeight = webCanvas.clientHeight * pixelRatio;
    this.width = exportWidth;
    this.height = exportHeight;
  }

  /**
   * Create a web canvas.
   * @param webCanvas - Web native canvas
   */
  constructor(webCanvas: HTMLCanvasElement) {
    const width = webCanvas.width;
    const height = webCanvas.height;
    this._webCanvas = webCanvas;
    this.width = width;
    this.height = height;
  }
}
