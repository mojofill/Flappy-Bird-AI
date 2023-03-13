export default class Pipe {
    public readonly gap_height = 50;
    public readonly move_speed = 70;

    constructor(public x: number, public w: number, public gap_y: number, private ctx: CanvasRenderingContext2D) {}

    public render() {
        const max_height = this.ctx.canvas.height;

        this.ctx.fillStyle = 'green';
        this.ctx.fillRect(this.x, max_height - (this.gap_y - this.gap_height), this.w, max_height - (max_height - this.gap_y + this.gap_height));
        this.ctx.fillRect(this.x, 0, this.w, max_height - this.gap_y);
    }

    /** return `true` if the pipe goes past the vertical line `x=0` */
    public move(dt: number) {
        this.x -= this.move_speed * dt;
        if (this.x < 0) return true;
    }
}