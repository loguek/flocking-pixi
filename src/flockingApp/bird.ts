import * as PIXI from 'pixi.js';
import Vector from './vector';

import { World, BirdDefaults } from './settings';

export default class Bird {
    public position: Vector;
    public velocity: Vector;
    public acceleration: Vector;
    public graphic: PIXI.Graphics;

    private color: number;
    private radius: number;
    private updatedPosition: Vector;

    constructor(position: Vector, velocity: Vector) {
        this.position = position;
        // This is a bit naff but we only want to update the boids position
        // after all flocking logic has been applied
        this.updatedPosition = new Vector(position.x, position.y);
        this.velocity = velocity;
        this.acceleration = new Vector();
        this.color = BirdDefaults.color;
        this.radius = BirdDefaults.size;
        this.graphic = new PIXI.Graphics();
    }

    updateColor(): void {
        //TODO: Come up with better way of achieving this
        const radians = Math.atan2(this.velocity.y, this.velocity.x);

        const angleRatio = radians >= 0 ? radians : 2 * Math.PI + radians;
        this.color = BirdDefaults.palette[Math.round((angleRatio * 180) / Math.PI)];
    }

    draw(): void {
        this.graphic.clear();
        this.updateColor();

        // Draw basic trianlge/bird/plane thing
        // Probably would be better to use a sprite
        this.graphic.beginFill(this.color);
        this.graphic.moveTo(this.radius, 0);
        this.graphic.lineTo(-this.radius, -this.radius);
        this.graphic.lineTo(-this.radius / 3, 0);
        this.graphic.lineTo(-this.radius, this.radius);
        this.graphic.lineTo(-this.radius, 0);
        this.graphic.endFill();

        if (BirdDefaults.vision.show) {
            this.graphic.beginFill(BirdDefaults.vision.color, BirdDefaults.vision.opacity);

            // TODO: Should swap out degress to radians
            const fov = (BirdDefaults.vision.angle / 2 / 180) * Math.PI;
            this.graphic.moveTo(
                this.radius + BirdDefaults.vision.distance * Math.cos(-fov),
                0 - BirdDefaults.vision.distance * Math.sin(-fov),
            );

            this.graphic.lineTo(this.radius, 0);

            this.graphic.lineTo(
                this.radius + BirdDefaults.vision.distance * Math.cos(fov),
                -BirdDefaults.vision.distance * Math.sin(fov),
            );

            // Couldn't get Pixi's arcTo function to work, but arc seems to do the job
            const arcAngles = ((180 - (360 - BirdDefaults.vision.angle) / 2) * Math.PI) / 180;
            this.graphic.arc(this.radius, 0, BirdDefaults.vision.distance, -arcAngles, arcAngles);
            this.graphic.endFill();
        }

        // Update positions of the graphic and rotation
        // Using the graphic makes it easier than applying the rotation to each line during drawing
        this.graphic.x = this.position.x = this.updatedPosition.x;
        this.graphic.y = this.position.y = this.updatedPosition.y;
        this.graphic.rotation = Math.atan2(this.velocity.y, this.velocity.x);
    }

    restrictPositionToWorld(): void {
        if (this.updatedPosition.x > World.width) {
            this.updatedPosition.x = 0;
        } else if (this.updatedPosition.x < 0) {
            this.updatedPosition.x = World.width;
        }

        if (this.updatedPosition.y > World.height) {
            this.updatedPosition.y = 0;
        } else if (this.updatedPosition.y < 0) {
            this.updatedPosition.y = World.height;
        }
    }

    applyForceLimits(v: Vector): void {
        v.setMagnitude(BirdDefaults.maxSpeed);
        v.subtract(this.velocity);
        v.limitMagnitude(BirdDefaults.forceLimit);
    }

    applyFlockingRulesLogic(birds: Bird[]): void {
        if (birds.length === 0) return;

        const avgPosition = new Vector();
        const avgVelocity = new Vector();
        const avgSeperation = new Vector();

        for (const otherBird of birds) {
            avgPosition.add(otherBird.position);
            avgVelocity.add(otherBird.velocity);

            const distance = Vector.distanceBetween(this.position, otherBird.position);
            const difference = Vector.subtract(this.position, otherBird.position);
            if (distance > 0) {
                difference.divideBy(distance);
            }
            avgSeperation.add(difference);
        }

        avgPosition.divideBy(birds.length);
        avgVelocity.divideBy(birds.length);
        avgSeperation.divideBy(birds.length);

        avgPosition.subtract(this.position);
        this.applyForceLimits(avgPosition);
        this.applyForceLimits(avgVelocity);
        this.applyForceLimits(avgSeperation);

        avgVelocity.multiplyBy(World.multipliers.alignment);
        avgPosition.multiplyBy(World.multipliers.cohesion);
        avgSeperation.multiplyBy(World.multipliers.seperation);

        this.acceleration.add(avgVelocity); // alignment
        this.acceleration.add(avgPosition); // cohesion
        this.acceleration.add(avgSeperation); // seperation
    }

    avoidMouse(mousePosition: Vector): void {
        const distance = Vector.distanceBetween(this.position, mousePosition);
        if (distance < 100) {
            const difference = Vector.subtract(this.position, mousePosition);
            const speed = Math.random() * (BirdDefaults.maxSpeed - 2) + 2;
            difference.setMagnitude(speed);
            this.acceleration.add(difference);
        }
    }

    update(birds: Bird[], mousePosition: Vector): void {
        this.applyFlockingRulesLogic(birds);
        this.avoidMouse(mousePosition);
        this.updatedPosition.add(this.velocity);
        this.velocity.add(this.acceleration);
        this.velocity.limitMagnitude(BirdDefaults.maxSpeed);
        this.restrictPositionToWorld();
    }

    // TODO: Either need to wrap boids vision around world or have the boids avoid the edges
    canSee(bird: Bird): boolean {
        if (bird === this) return false;

        const velocityAngle = Math.atan2(this.velocity.y, this.velocity.x);
        // Seemed like a great idea to shift the birds eyes not to be in the centre :(
        const eyeLocation = new Vector(
            this.position.x + this.radius * Math.cos(velocityAngle),
            this.position.y + this.radius * Math.sin(velocityAngle),
        );

        const distance = Vector.distanceBetween(bird.position, eyeLocation);
        if (distance < BirdDefaults.size) {
            // Likely already collided...
            return true;
        } else if (distance < BirdDefaults.vision.distance) {
            // check angles
            const difference = Vector.subtract(bird.position, eyeLocation);
            const viewAngle = (Math.abs(Math.atan2(difference.y, difference.x) - velocityAngle) * 180) / Math.PI;

            if (viewAngle <= BirdDefaults.vision.angle / 2) {
                return true;
            }
        }

        return false;
    }
}
