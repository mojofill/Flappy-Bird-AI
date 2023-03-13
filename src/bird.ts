import Pipe from "./pipe";

interface Rect {
    x: number, y: number, w: number, h: number
}

export default class Bird {
    public v: number = 0;
    private readonly jumpSpeed = 250;

    constructor(public x: number, public y: number, public s: number, public color: string, private ctx: CanvasRenderingContext2D, private g: number, private pipes: Pipe[]) {}

    public render() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.ctx.canvas.height - this.y, this.s, this.s);
    }

    /** returns `true` if the bird goes below or touches the floor or if the bird hits a pipe */
    public move(dt: number) {
        this.y += this.v * dt;
        this.v -= this.g * dt;

        if (this.y <= 0) return true;

        if (this.collisionDetect()) throw new Error("whoa there! i collided :OOOO");

        this.think();
    }

    private collisionDetect() {
        let pipe;
        for (let i = 0; i < this.pipes.length; i++) {
            if (this.pipes[i].x > this.x) {
                pipe = this.pipes[i];
                break;
            }
        }
        
        if (!pipe) throw new Error();

        const rectIntersect = (rect: Rect) => {
            return (this.x < rect.x + rect.w &&
            this.x + this.s > rect.x &&
            this.y < rect.y + rect.h &&
            this.s + this.y > rect.y);
        }

        const topRect = {
            x: pipe.x,
            y: 0,
            h: this.ctx.canvas.height - pipe.gap_y,
            w: pipe.w
        };

        const bottomRect = {
            x: pipe.x,
            y: pipe.gap_y - pipe.gap_height,
            w: pipe.w,
            h: this.ctx.canvas.height - pipe.gap_y + pipe.gap_height
        };

        return rectIntersect(topRect) || rectIntersect(bottomRect);
    }

    /** this is for the AI to decide when to make the bird jump - AI TODO */
    public think() {
        // currently, for testing, when the robot goes below a certain value, make the bird jump
        // TODO
        if (this.y < 0.25 * this.ctx.canvas.height) this.jump();
    }

    public jump() {
        this.v = this.jumpSpeed;
    }

    /** how do i do this? i will figure it out later */
    public die() {

    }
}