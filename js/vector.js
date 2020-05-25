const calcMagnitude = (x, y) => {
    return Math.sqrt(x * x + y * y)
}
/**
 * Rough 2D Vector class... next time don't reinvent the wheel
 */
class Vector {
    constructor(x, y) {
        this.x = x || 0
        this.y = y || 0
    }

    add(v) {
        this.x += v.x
        this.y += v.y
        return this
    }

    subtract(v) {
        this.x -= v.x
        this.y -= v.y
        return this
    }

    divideBy(value) {
        if(value > 0) {
            this.x /= value
            this.y /= value
        }
        return this
    }

    multiplyBy(value) {
        this.x *= value
        this.y *= value
        return this
    }

    setMagnitude(value) {
        this.normalize()
        this.x *= value
        this.y *= value
        return this
    }

    limitMagnitude(value) {
        const mag = calcMagnitude(this.x, this.y)
        if(mag > value) {
            this.setMagnitude(value)
        }
        return this
    }

    getMagnitude() {
        return calcMagnitude(this.x, this.y)
    }

    normalize() {
        const mag = calcMagnitude(this.x, this.y)
        if (mag === 0) {
            this.x = 1
            this.y = 0
        } else {
            this.x /= mag
            this.y /= mag
        }
        
        return this
    }

    static distanceBetween(v1, v2) {
        const dx = v1.x - v2.x
        const dy = v1.y - v2.y
        return calcMagnitude(dx, dy);
    }

    static subtract(v1, v2) {
        return new Vector(v1.x - v2.x, v1.y - v2.y)
    }

    static add(v1, v2) {
        return new Vector(v1.x + v2.x, v1.y + v2.y)
    }
}

