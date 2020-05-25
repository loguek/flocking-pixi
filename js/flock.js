const OPTIONS = {
    autoResize: true,
    backgroundColor: World.skyColor,
    antialias: true,
}

class Flock {
    constructor() {
        this.app = new PIXI.Application(OPTIONS)

        // Creating a seperate ticker so as to stop it while resizing the screen
        // ... doesn't seem to have any performance benefits over just using a flag though
        this.ticker = new PIXI.ticker.Ticker();
        this.ticker.stop()

        document.body.appendChild(this.app.view);

        this.mousePosition = new Vector(-100, -100)
        this.resize()
        this.createFlock()
        window.addEventListener('resize', () => { this.resize() })
        window.addEventListener('mousemove', e => { this.updateMousePosition(e) })
        window.addEventListener('mouseleave', e =>{ this. updateMousePosition({ x:-100, y:-100 })} )
        
        this.ticker.add(() => {
            this.update()
        })
    }

    updateMousePosition({ x, y }) {
        this.mousePosition.x = x
        this.mousePosition.y = y
    }

    resize() {
        this.ticker.stop()
        
        this.timeout = clearTimeout(this.timeout)
        this.timeout = setTimeout(()=> {
            this.timeout = null
            World.width = window.innerWidth
            World.height = window.innerHeight
            this.app.renderer.resize(window.innerWidth, window.innerHeight);
            this.ticker.start()
        }, 250)
    }


    // Only used for testing
    renderPalette() {
        let x = 0, size = 2
        const paletteGraphic = new PIXI.Graphics()
        BirdDefaults.palette.forEach((color, index) => {
            paletteGraphic.beginFill(color)
            paletteGraphic.drawRect(size * index, 0, size, 100)
            paletteGraphic.endFill()  
        })
        this.app.stage.addChild(paletteGraphic)
    }

    update() {
        this.birds.forEach( bird => {
            bird.birdsInView = 0
            const visibleBirds = this.birds.filter(otherBird => bird.canSee(otherBird))
            bird.update(visibleBirds, this.mousePosition)
        })
        //this.renderPalette()
       
        this.birds.forEach( bird => {
            bird.draw()
        })
    }
    
    createFlock() {
        if (this.birds === undefined) {
            this.birds = []
            for(let i=0; i < World.flock.size; i++) {
                const position = new Vector(Math.random() * window.innerWidth, Math.random() * window.innerHeight)
                const velocity = new Vector(Math.random() * 2 - 1, Math.random() * 2 - 1)
                velocity.setMagnitude((Math.random() * 2 + 2))

                let bird = new Bird(
                    position,
                    velocity, 
                    () => new PIXI.Graphics()
                )
                this.birds.push(bird)
                this.app.stage.addChild(bird.graphic)
            }        
        }
    }
}