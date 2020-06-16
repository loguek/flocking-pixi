import * as PIXI from 'pixi.js';
import { World, BirdDefaults } from './settings';
import Vector from './vector';
import Bird from './bird';

export class FlockingApp {
    private app: PIXI.Application;
    private ticker: PIXI.Ticker;
    private mousePosition: Vector;
    private timer: ReturnType<typeof setTimeout>;
    private birds: Bird[];

    constructor() {
        this.app = new PIXI.Application({
            backgroundColor: World.skyColor,
            antialias: true,
        });

        this.mousePosition = new Vector(-100, -100);
        this.ticker = new PIXI.Ticker();
        this.ticker.stop();
        this.ticker.add(() => {
            this.update();
        });

        const displayDiv = document.querySelector('#display');
        displayDiv.appendChild(this.app.view);

        window.addEventListener('resize', () => {
            this.resize();
        });
        window.addEventListener('mousemove', (e) => {
            this.updateMousePosition(e);
        });
        window.addEventListener('mouseleave', () => {
            this.updateMousePosition({
                x: -100,
                y: -100,
            });
        });

        this.resize();
        this.createFlock();

        this.setupRange('alignment');
        this.setupRange('cohesion');
        this.setupRange('seperation');
    }

    private update(): void {
        this.birds.forEach((bird) => {
            const visibleBirds = this.birds.filter((otherBird) => bird.canSee(otherBird));
            bird.update(visibleBirds, this.mousePosition);
        });

        this.birds.forEach((bird) => {
            bird.draw();
        });
    }

    private updateMousePosition({ x, y }): void {
        this.mousePosition.x = x;
        this.mousePosition.y = y;
    }

    private setupRange(id: string): void {
        const domElement = <HTMLInputElement>document.getElementById(id);
        if (domElement) {
            domElement.addEventListener('change', () => {
                World.multipliers[id] = Number(domElement.value) / 100;
            });
        }
    }

    resize(): void {
        this.ticker.stop();

        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.timer = null;
            World.width = window.innerWidth;
            World.height = window.innerHeight;
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            this.ticker.start();
        }, 250);
    }

    private renderPalette(): void {
        const size = 2;
        const paletteGraphic = new PIXI.Graphics();

        BirdDefaults.palette.forEach((color, index) => {
            paletteGraphic.beginFill(color);
            paletteGraphic.drawRect(size * index, 0, size, 100);
            paletteGraphic.endFill();
        });

        this.app.stage.addChild(paletteGraphic);
    }

    private createFlock(): void {
        if (this.birds === undefined) {
            this.birds = [];
            for (let i = 0; i < World.flock.size; i++) {
                const position = new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight);
                const velocity = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1);
                velocity.setMagnitude(Math.random() * 2 + 2);

                const bird = new Bird(position, velocity);
                this.birds.push(bird);
                this.app.stage.addChild(bird.graphic);
            }
        }
    }
}
