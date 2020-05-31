function hexToRGB(hex) {
    return {
        r: (hex >> 16) & 255,
        g: (hex >> 8) & 255,
        b: hex & 255
    }
}

function rgbToDecimal(rgb) {
    return (rgb.r << 16) + (rgb.g << 8) + rgb.b
}

function generateColorGamet() {
    const interpolateColors = (startColor, endColor, stepCount) => {
        const segmentColors = []
        const factor = 1 / stepCount

        const startRGB = hexToRGB(startColor)
        const endRGB = hexToRGB(endColor)

        for(let i = 0; i < stepCount; i++) {

            segmentColors.push(
                rgbToDecimal(
                    {
                        r: startRGB.r + factor * i * (endRGB.r - startRGB.r),
                        g: startRGB.g + factor * i * (endRGB.g - startRGB.g),
                        b: startRGB.b + factor * i * (endRGB.b - startRGB.b)
                    }
                )
            )
        }
        return segmentColors
    }

    return [
        ...interpolateColors(0xff0000, 0x00ff00, 120),
        ...interpolateColors(0x00ff00, 0x0000ff, 120),
        ...interpolateColors(0x0000ff, 0xff0000, 120),
    ]
}

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
    palette: generateColorGamet(),
    vision: {
        angle: 270,
        distance: 100,
        color: 0xaaaaff,
        opacity: 0.05,
        show: false
    }
}

export { World, BirdDefaults }