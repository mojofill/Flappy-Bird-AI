import Bird from "./bird";
import Pipe from "./pipe";

const canvas = document.getElementById('canvas');
if (!canvas || !(canvas instanceof HTMLCanvasElement)) throw new Error('no canvas found');

const ctx = canvas.getContext('2d');
if (!ctx || !(ctx instanceof CanvasRenderingContext2D)) throw new Error('no ctx found');

const time = {
    curr: new Date().getTime() / 1000,
    past: new Date().getTime() / 1000,
    get dt() {
        return this.curr - this.past > 0.05 ? 0 : this.curr - this.past;
    },
    updateTime() {
        this.past = this.curr;
        this.curr = new Date().getTime() / 1000;
    }
}

const init = (bird_x: number, spawnAmount: number, pipe_width: number, g: number, birds: Bird[], pipes: Pipe[]) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.style.margin = canvas.style.left = canvas.style.top = '0px';
    canvas.style.position = 'fixed';

    // spawn birds
    for (let i = 0; i < spawnAmount; i++) {
        const newBird = new Bird(bird_x, canvas.height / 2, 5, "white", ctx, g);
        birds.push(newBird);
    }

    // spawn pipes
    let extraPipeAdded: boolean = false;
    let spawn_x: number = bird_x + 500;
    const initalPipe: Pipe = new Pipe(spawn_x, pipe_width, 0.5 * canvas.height, ctx);
    pipes.push(initalPipe); // already has one in there
    const gap_height = initalPipe.gap_height;
    let index = 1;
    let dy_range = 50;
    let dx_range = 50;
    while (!extraPipeAdded) {
        spawn_x += dx_range;
        let spawn_y;
        while (true) {
            const rand_sign = Math.random() >= 0.5 ? -1 : 1;
            spawn_y = pipes[index - 1].gap_y + rand_sign * dy_range;
            if (spawn_y - gap_height > 0 && spawn_y < canvas.height) break;
        }
        const pipe = new Pipe(spawn_x, pipe_width, spawn_y, ctx);
        pipes.push(pipe);
        if (pipe.x >= canvas.width) extraPipeAdded = true;
    }

    requestAnimationFrame(() => loop(birds, pipes));
};

const loop = (birds: Bird[], pipes: Pipe[]) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    time.updateTime();

    for (let i = 0; i < birds.length; i++) {
        const bird = birds[i];
        bird.render();
        bird.move(time.dt);
        bird.think();
    }

    let existsExtra: boolean = false;

    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        pipe.render();
        pipe.move(time.dt);
        existsExtra = pipe.x > canvas.width;
    }

    if (!existsExtra) {
        // spawn new pipe
        let spawn_y;
        let dy_range = 50;
        let dx_range = 50;
        while (true) {
            const rand_sign = Math.random() >= 0.5 ? -1 : 1;
            spawn_y = pipes[pipes.length - 1].gap_y + rand_sign * dy_range;
            if (spawn_y - pipes[0].gap_height > 0 && spawn_y < canvas.height) break;
        }
        const pipe = new Pipe(pipes[pipes.length - 1].x + dx_range, pipes[0].w, spawn_y, ctx);
        pipes.push(pipe);
    }

    requestAnimationFrame(() => loop(birds, pipes));
};

const SPAWN_AMOUNT = 1;
const X_POSITION = 0.33 * canvas.width;
const PIPE_WIDTH = 10;
const g = 500;
const BIRD_ARR: Bird[] = [];
const PIPE_ARR: Pipe[] = [];

init(
    X_POSITION,
    SPAWN_AMOUNT,
    PIPE_WIDTH,
    g,
    BIRD_ARR,
    PIPE_ARR
);
