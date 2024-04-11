import Laser from '../Laser/laser'
import Enemy from '../Enemy/enemy'
import Player from '../Player/player'

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

    checkCollision(target: Enemy | Player, targetType: string,  laser: Laser) {
        const targetLeft = target.x
        const targetRight = target.x + target.width
        const targetBottom = target.y + target.height
        const targetTop = target.y
        const laserLeft = laser.x
        const laserRight = laser.x + laser.width
        const laserBottom = laser.y + laser.height
        const laserTop = laser.y

        if (targetType === "isEnemy" &&
            laserTop <= targetBottom &&
            ((laserLeft <= targetRight && laserLeft >= targetLeft) ||
                (laserRight >= targetLeft && laserRight <= targetRight))
        ) {
            console.log('Hitmarker')
            return true
        } else if (targetType === "isPlayer" &&
            laserBottom >= targetTop &&
            laserTop <= targetBottom &&
            ((laserLeft <= targetRight && laserLeft >= targetLeft) ||
                (laserRight >= targetLeft && laserRight <= targetRight))
        ) {
            console.log("Player hit")
            return true
        }
        return false
    }
}
