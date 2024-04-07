import Board from '../Board/board'
import Laser from '../Laser/laser'

type Options = {
    x: number
    y: number
    width: number
    height: number
    speed: number
}

export default class Enemy {
    x: number
    y: number
    width: number
    height: number
    speed: number
    direction: string
    constructor(options: Options) {
        this.x = options.x
        this.y = options.y
        this.width = options.width
        this.height = options.height
        this.speed = options.speed
        this.direction = 'right'
    }

    checkLaserCollision(laserRays: Array<Laser>, board: Board) {
        const anyCollision = laserRays.some((laser) =>
            board.checkCollision(this, laser)
        )
        if (anyCollision) {
            console.log('collide')
            console.log(laserRays)
            laserRays = laserRays.filter(
                (laser) => !board.checkCollision(this, laser)
            )
            console.log(laserRays)
            return { collision: true, lasers: laserRays }
        }
        return { collision: false, lasers: laserRays }
    }
}
