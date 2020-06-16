const calcMagnitude = (x: number, y: number): number => Math.sqrt(x * x + y * y);
/**
 * Rough 2D Vector class... next time don't reinvent the wheel
 */
export default class Vector {
    public x: number;
    public y: number;

    constructor(x?: number, y?: number) {
        this.x = x || 0;
        this.y = y || 0;
    }

    add(v: Vector): Vector {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    subtract(v: Vector): Vector {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    divideBy(value: number): Vector {
        if (value > 0) {
            this.x /= value;
            this.y /= value;
        }
        return this;
    }

    multiplyBy(value: number): Vector {
        this.x *= value;
        this.y *= value;
        return this;
    }

    setMagnitude(value: number): Vector {
        this.normalize();
        this.x *= value;
        this.y *= value;
        return this;
    }

    limitMagnitude(value: number): Vector {
        const mag: number = calcMagnitude(this.x, this.y);
        if (mag > value) {
            this.setMagnitude(value);
        }
        return this;
    }

    getMagnitude(): number {
        return calcMagnitude(this.x, this.y);
    }

    normalize(): Vector {
        const mag: number = calcMagnitude(this.x, this.y);
        if (mag === 0) {
            this.x = 1;
            this.y = 0;
        } else {
            this.x /= mag;
            this.y /= mag;
        }

        return this;
    }

    clone(): Vector {
        return new Vector(this.x, this.y);
    }

    static distanceBetween(v1: Vector, v2: Vector): number {
        const dx = v1.x - v2.x;
        const dy = v1.y - v2.y;
        return calcMagnitude(dx, dy);
    }

    static subtract(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x - v2.x, v1.y - v2.y);
    }

    static add(v1: Vector, v2: Vector): Vector {
        return new Vector(v1.x + v2.x, v1.y + v2.y);
    }
}
