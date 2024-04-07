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
}
