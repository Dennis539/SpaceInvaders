import Laser from '../Laser/laser'
import Enemy from '../Enemy/enemy'
import Player from '../Player/player'
import Particle from '../Particle/particle'
import Score from '../Score/score'
import Bomb from '../Bomb/bomb'
import BombExplosion from '../Bomb/bombExplosion'


export default class Board {
    boundaryUp: number
    boundaryDown: number
    boundaryLeft: number
    boundaryRight: number
    enemyDirection: string
    explosions: Array<Array<Particle>>
    scores: Array<Score>
    bombs: Array<Bomb>
    bombExplosions: Array<BombExplosion>
    score: number
    constructor(canvas: any) {
        this.boundaryUp = 0
        this.boundaryDown = canvas.height
        this.boundaryLeft = 0
        this.boundaryRight = canvas.width
        this.enemyDirection = 'right'
        this.explosions = []
        this.scores = []
        this.bombs = []
        this.bombExplosions = []
        this.score = 0
    }

    checkCollision(target: Enemy | Player, targetType: string,  laser: Laser, checking: boolean) {
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
            if (checking) {
                this.explosions.push(this.createExplosion(target))
                this.scores.push(new Score(target.x, target.y, 100))
            }


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

    checkCollisionBomb(target: Bomb, laser: Laser) {

        var testX = target.x
        var testY = target.y
        if (target.x < laser.x) {
            testX = laser.x
        } else if (target.x >= laser.x + laser.width) {
            testX = laser.x + laser.width
        }
        if (target.y < laser.y) {
            testY = laser.y
        } else if (target.y > laser.y + laser.height) {
            testY = laser.y + laser.height
        }
        const distX = target.x - testX
        const distY = target.y - testY
        const distance = Math.sqrt((distX * distX) + (distY * distY))
        if (distance <= target.radius) {
            console.log("Kaboom")
            this.bombExplosions.push( new BombExplosion(target.x, target.y))
            return true
        }
        return false
    }

    checkCollisionExplosion(enemy: Enemy, bombExplosion: BombExplosion) {
        var testX = bombExplosion.x
        var testY = bombExplosion.y
        if (bombExplosion.x < enemy.x) {
            testX = enemy.x
        } else if (bombExplosion.x >= enemy.x + enemy.width) {
            testX = enemy.x + enemy.width
        }
        if (bombExplosion.y < enemy.y) {
            testY = enemy.y
        } else if (bombExplosion.y > enemy.y + enemy.height) {
            testY = enemy.y + enemy.height
        }
        const distX = bombExplosion.x - testX
        const distY = bombExplosion.y - testY
        const distance = Math.sqrt((distX * distX) + (distY * distY))
        if (distance <= bombExplosion.radius) {
            this.scores.push(new Score(enemy.x, enemy.y, 50))
            console.log("Enemy destroyed with bomb")
            this.score += 50
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
