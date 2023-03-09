export default class Pipe {
    public readonly gap_height = 50;
    public readonly move_speed = 50;

    constructor(public x: number, public w: number, public gap_y: number, private ctx: CanvasRenderingContext2D) {}

    public render() {
        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.x, 0, this.w, this.ctx.canvas.height - this.gap_y);
        this.ctx.fillRect(this.x, this.ctx.canvas.height - this.gap_y + this.gap_height, this.w, this.gap_y - this.gap_height);
    }

    /** return `true` if the pipe goes past the vertical line `x=0` */
    public move(dt: number) {
        this.x -= this.move_speed * dt;
        if (this.x < 0) return true;
    }
}