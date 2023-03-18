import AI from "./ai";
import Pipe from "./pipe";

interface Rect {
    x: number, y: number, w: number, h: number
}

export default class Bird {
    public v: number = 0;
    private readonly jumpSpeed = 250;

    public dead: boolean = false;

    public framesAlive: number = 0;
    
    constructor(public x: number, public y: number, public s: number, public color: string, private ctx: CanvasRenderingContext2D, private g: number, public ai: AI) {}

    public render() {
        if (this.dead) return;
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.ctx.canvas.height - this.y, this.s, this.s);
    }

    /** returns `true` if the bird goes below or touches the floor or if the bird hits a pipe */
    public move(dt: number, pipes: Pipe[]) {
        if (this.dead) return;

        this.framesAlive += 2;

        if (this.y >= this.ctx.canvas.height) {
            this.y = this.ctx.canvas.height;
            this.v = 0;
        }

        else if (this.y - this.s <= 0) {
            this.y = this.s;
            this.v = 0;
        }
        else {
            this.y += this.v * dt;
            this.v -= this.g * dt;

            this.think(pipes);
        }

        if (this.collisionDetect(pipes)) this.die();
    }

    public getFitness() : number {
        return this.framesAlive;
    }

    /** finna make a kid with this guy */
    public mate(partner: Bird) {
        return this.ai.mate(partner.ai, 0.5 * (partner.getFitness() + this.getFitness()));
    }

    private getClosestPipe(pipes: Pipe[]) : Pipe {
        for (let i = 0; i < pipes.length; i++) {
            if (pipes[i].x > this.x) {
                return pipes[i];
            }
        }
        throw new Error();
    }

    private collisionDetect(pipes: Pipe[]) {
        const rectIntersect = (rect: Rect) => {
            return (this.x < rect.x + rect.w &&
            this.x + this.s > rect.x &&
            this.y < rect.y + rect.h &&
            this.s + this.y > rect.y);
        }

        const pipe = this.getClosestPipe(pipes);

        const topRect = {
            x: pipe.x,
            y: -10,
            h: this.ctx.canvas.height - pipe.gap_y + 10,
            w: pipe.w
        };

        const bottomRect = {
            x: pipe.x,
            y: this.ctx.canvas.height - pipe.gap_y + pipe.gap_height,
            w: pipe.w,
            h: this.ctx.canvas.height - pipe.gap_y + pipe.gap_height
        };

        return rectIntersect(topRect) || rectIntersect(bottomRect);
    }

    /** this is for the AI to decide when to make the bird jump - AI TODO */
    public think(pipes: Pipe[]) {
        // currently, for testing, when the robot goes below a certain value, make the bird jump
        // use the AI to decide to jump or not
        const pipe = this.getClosestPipe(pipes);
        this.ai.setInput(pipe.x - this.x, pipe.gap_y - this.y, this.v);
        if (this.ai.decide()) {
            this.jump();
        }
    }

    public jump() {
        this.v = this.jumpSpeed;
    }

    /** how do i do this? i will figure it out later */
    public die() {
        this.dead = true;
    }
}