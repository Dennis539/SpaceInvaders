import Laser from '../Laser/laser'
import Enemy from '../Enemy/enemy'

export default class Board {
    boundaryUp: number
    boundaryDown: number
    boundaryLeft: number
    boundaryRight: number
    enemyDirection: string
    constructor(canvas: any) {
        this.boundaryUp = 0
        this.boundaryDown = canvas.height
        this.boundaryLeft = 0
        this.boundaryRight = canvas.width
        this.enemyDirection = 'right'
    }

    checkCollision(enemy: Enemy, laser: Laser) {
        const enemyLeft = enemy.x
        const enemyRight = enemy.x + enemy.width
        const enemyBottom = enemy.y + enemy.height
        const laserLeft = laser.x
        const laserRight = laser.x + laser.width
        const laserTop = laser.y
        if (
            laserTop <= enemyBottom &&
            ((laserLeft <= enemyRight && laserLeft >= enemyLeft) ||
                (laserRight >= enemyLeft && laserRight <= enemyRight))
        ) {
            console.log('Hitmarker')
            return false
        }
        return true
    }
}
