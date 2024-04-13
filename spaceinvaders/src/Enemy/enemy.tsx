import Board from '../Board/board'
import Laser from '../Laser/laser'

type Options = {
    x: number
    y: number
    width: number
    height: number
    speed: number
    shootChance: number
}

export default class Enemy {
    x: number
    y: number
    width: number
    height: number
    speed: number
    direction: string
    shootChance: number
    image: HTMLImageElement
    constructor(options: Options) {
        this.x = options.x
        this.y = options.y
        this.width = options.width
        this.height = options.height
        this.speed = options.speed
        this.direction = 'right'
        this.shootChance = options.shootChance
        const image = new Image()
        image.src = "Invader.png"
        this.image = image
    }

    checkLaserCollision(laserRays: Array<Laser>, board: Board) {
        const anyCollision = laserRays.some((laser) =>
            board.checkCollision(this, "isEnemy", laser)
        )
        if (anyCollision) {
            console.log('collide')
            laserRays = laserRays.filter(
                (laser) => !board.checkCollision(this, "isEnemy", laser)
            )
            return { collision: true, lasers: laserRays }
        }
        return { collision: false, lasers: laserRays }
    }

    shootLaser() {
        if (
            Math.floor(Math.random() * (this.shootChance + 2)) >=
            this.shootChance
        ) {
            return true
        }
        return false
    }
}
