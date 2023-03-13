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

const dy_range = 150;
const dx_range = 150;

const init = (bird_x: number, spawnAmount: number, pipe_width: number, g: number, birds: Bird[], pipes: Pipe[]) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.style.margin = canvas.style.left = canvas.style.top = '0px';
    canvas.style.position = 'fixed';

    // spawn birds
    for (let i = 0; i < spawnAmount; i++) {
        const newBird = new Bird(bird_x, canvas.height / 2, 10, "white", ctx, g, pipes);
        birds.push(newBird);
    }

    // spawn pipes
    let extraPipeAdded: boolean = false;
    let spawn_x: number = bird_x + 500;
    const initalPipe: Pipe = new Pipe(spawn_x, pipe_width, 0.5 * canvas.height, ctx);
    pipes.push(initalPipe); // already has one in there

    while (!extraPipeAdded) {
        const pipe = spawnPipe(pipes);
        if (pipe.x >= canvas.width) extraPipeAdded = true;
    }

    requestAnimationFrame(() => loop(birds, pipes));
};

const loop = (birds: Bird[], pipes: Pipe[]) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    time.updateTime();

    // render pipes
    let existsExtra: boolean = false;

    for (let i = 0; i < pipes.length; i++) {
        const pipe = pipes[i];
        pipe.render();
        existsExtra = pipe.x > canvas.width;
        if(pipe.move(time.dt)) { // returns true if the pipe x position < 0
            pipes.splice(i, 1);
            i--;
        }
    }

    if (!existsExtra) {
        // spawn new pipe
        spawnPipe(pipes);
    }

    // render birds
    for (let i = 0; i < birds.length; i++) {
        const bird = birds[i];
        bird.render();
        bird.move(time.dt);
        bird.think();
    }

    requestAnimationFrame(() => loop(birds, pipes));
};

const spawnPipe = (pipes: Pipe[]) => {
    let spawn_y;
    while (true) {
        const rand_sign = Math.random() >= 0.5 ? -1 : 1;
        spawn_y = pipes[pipes.length - 1].gap_y + rand_sign * dy_range;
        if (spawn_y - pipes[0].gap_height> 0 && spawn_y < canvas.height) {
            console.log('height: ' + spawn_y)
            break;
        }
    }
    const pipe = new Pipe(pipes[pipes.length - 1].x + dx_range, pipes[0].w, spawn_y, ctx);
    pipes.push(pipe);
    return pipe;
}

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
