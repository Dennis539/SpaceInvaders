import Enemy from '../Enemy/enemy'
import Board from '../Board/board'

type Options = {
    x: number
    y: number
    speed: number
    shooter: string
}
export default class Laser {
    x: number
    y: number
    width: number
    height: number
    shooter: string
    imgUrl: string
    collided: boolean
    image: HTMLImageElement
    constructor(options: Options) {
        this.x = options.x
        this.y = options.y
        this.width = 10
        this.height = 10
        this.shooter = options.shooter
        this.imgUrl = this.imageUrl(this.shooter)
        this.collided = false

        const image = new Image()
        image.src = this.imgUrl
        this.image = image
    }
    imageUrl(shooter: string) {
        if (shooter === "enemy") {
            return "RedLaser.jpg"
        } else {
            return "GreenLaser.jpg"
        }
    }

}
