const World = {
    width: 800,
    height: 600,
    skyColor: 0xfffff0,
    flock: {
        size: 200
    }
}

const BirdDefaults = {
    maxSpeed: 2,
    forceLimit: 0.025,
    size: 4,
    color: 0x000000,
    vision: {
        angle: 270,
        distance: 100,
        color: 0xaaaaff,
        opacity: 0.05,
        show: false
    }
}