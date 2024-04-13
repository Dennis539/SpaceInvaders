import Laser from "../Laser/laser"
import Board from "../Board/board"

type Options = {
    x: number
    y: number
    width: number
    height: number
    speed: number
}

export default class Player {
    x: number
    y: number
    width: number
    height: number
    speed: number
    direction: string
    health: number
    score: number
    constructor(options: Options) {
        this.x = options.x
        this.y = options.y
        this.width = options.width
        this.height = options.height
        this.speed = options.speed
        this.direction = 'right'
        this.health = 10
        this.score = 0
    }

    move(keys: any, canvas: any) {
        if ('ArrowLeft' in keys) {
            if (this.x / this.speed >= 1) {
                this.x -= this.speed
            } else {
                this.x = 0
            }
            this.direction = 'left'
        }
        if ('ArrowRight' in keys) {
            if (this.x + this.width <= canvas.width - this.speed) {
                this.x += this.speed
            } else {
                this.x = canvas.width - this.width
            }

            this.direction = 'right'
        }
        if ('ArrowUp' in keys) {
            if (this.y / this.speed >= 1) {
                this.y -= this.speed
            } else {
                this.y = 0
            }
            this.direction = 'up'
        }
        if ('ArrowDown' in keys) {
            if (this.y + this.height <= canvas.height - this.speed) {
                this.y += this.speed
            } else {
                this.y = canvas.height - this.height
            }

            this.direction = 'down'
        }
    }

    checkLaserCollision(laserRays: Array<Laser>, board: Board) {
        const anyCollision = laserRays.some((laser) =>
            board.checkCollision(this, "isPlayer", laser)
        )
        if (anyCollision) {
            console.log('collide')
            laserRays = laserRays.filter(
                (laser) => !board.checkCollision(this, "isPlayer", laser)
            )
            this.health -= 1
            return laserRays
        }
        return laserRays
    }
}
