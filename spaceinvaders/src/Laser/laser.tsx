import Enemy from '../Enemy/enemy'
import Board from '../Board/board'

type Options = {
    x: number
    y: number
    speed: number
}
export default class Laser {
    x: number
    y: number
    width: number
    height: number
    collided: boolean
    constructor(options: Options) {
        this.x = options.x
        this.y = options.y
        this.width = 10
        this.height = 10
        this.collided = false
    }
}
