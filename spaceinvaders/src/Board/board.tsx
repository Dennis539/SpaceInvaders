import Laser from '../Laser/laser'
import Enemy from '../Enemy/enemy'
import Player from '../Player/player'
import Particle from '../Particle/particle'


export default class Board {
    boundaryUp: number
    boundaryDown: number
    boundaryLeft: number
    boundaryRight: number
    enemyDirection: string
    explosions: Array<Array<Particle>>
    constructor(canvas: any) {
        this.boundaryUp = 0
        this.boundaryDown = canvas.height
        this.boundaryLeft = 0
        this.boundaryRight = canvas.width
        this.enemyDirection = 'right'
        this.explosions = []
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
            this.explosions.push(this.createExplosion(target))

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
    createExplosion(target: Enemy | Player) {
        let explosion = []
        for (let i = 0; i <= 150; i++) {
            let dx = (Math.random() - 0.5) * (Math.random() * 6);
            let dy = (Math.random() - 0.5) * (Math.random() * 6);
            let radius = Math.random() * 3;
            const explosionX = target.x + (target.width/2)
            const explosionY = target.y + (target.height/2)
            let particle = new Particle(explosionX, explosionY, radius, dx, dy);
            explosion.push(particle)
        }
        return explosion
    }

}
