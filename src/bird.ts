export default class Bird {
    public v: number = 0;
    private readonly jumpSpeed = 250;

    constructor(public global_x: number, public y: number, public r: number, public color: string, private ctx: CanvasRenderingContext2D, private g: number) {}

    public render() {
        this.ctx.fillStyle = this.color;
        this.ctx.strokeStyle = 'black';
        this.ctx.beginPath();
        this.ctx.arc(this.global_x, this.ctx.canvas.height - this.y, this.r, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    /** returns `true` if the bird goes below or touches the floor */
    public move(dt: number) {
        this.y += this.v * dt;
        this.v -= this.g * dt;

        if (this.y <= 0) return true;

        this.think();
    }

    /** this is for the AI to decide when to make the bird jump - AI TODO */
    public think() {
        // currently, for testing, when the robot goes below a certain value, make the bird jump
        if (this.y < 0.25 * this.ctx.canvas.height) this.jump();
    }

    public jump() {
        this.v = this.jumpSpeed;
    }

    /** how do i do this? i will figure it out later */
    public die() {

    }
}