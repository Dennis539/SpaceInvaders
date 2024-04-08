import Enemy from './enemy'
import Laser from '../Laser/laser'
import Board from '../Board/board'
export default class EnemyHorde {
    direction: string
    enemiesMatrix: Array<Array<Enemy | null>>
    shootChance: number
    constructor() {
        this.direction = 'right'
        this.shootChance = 200
        this.enemiesMatrix = this.createEnemies()
    }

    setShootChance() {
        if (this.shootChance > 500) {
            this.shootChance -= 100
        }
    }

    createEnemies() {
        let enemiesMatrix: Array<Array<Enemy | null>> = []
        var xStart = 100
        var yStart = 0
        for (let i = 0; i < 5; i++) {
            enemiesMatrix.push([])

            for (let j = 0; j < 10; j++) {
                console.log(this.shootChance)
                enemiesMatrix[i].push(
                    new Enemy({
                        x: xStart,
                        y: yStart,
                        width: 30,
                        height: 30,
                        speed: 5,
                        shootChance: this.shootChance
                    })
                )
                xStart += 100
            }
            yStart += 50
            xStart = 100
        }
        return enemiesMatrix
    }

    edgeEnemyHorde() {
        var directionEnemies = this.enemiesMatrix.map(
            (enemiesArray) =>
                enemiesArray[
                    this.direction === 'right' ? enemiesArray.length - 1 : 0
                ]
        )

        function checkMaxOrMin(
            curVal: Enemy | null,
            highestVal: Enemy | null,
            enemyHordeDirection: string
        ) {
            if (!curVal && !highestVal) {
                return highestVal
            } else if (!curVal) {
                return highestVal
            } else if (!highestVal) {
                return curVal
            } else if (enemyHordeDirection === 'right') {
                return highestVal.x < curVal.x ? curVal : highestVal
            } else {
                return highestVal.x > curVal.x ? curVal : highestVal
            }
        }

        var edgiestEnemy = directionEnemies.reduce((highestVal, curVal) =>
            checkMaxOrMin(highestVal, curVal, this.direction)
        )
        return edgiestEnemy
    }

    checkHordeLaserCollision(laserRays: Array<Laser>, board: Board) {
        for (let i = 0; i < this.enemiesMatrix.length; i++) {
            for (let j = 0; j < this.enemiesMatrix[i].length; j++) {
                if (this.enemiesMatrix[i][j]) {
                    const values = this.enemiesMatrix[i][
                        j
                    ]!.checkLaserCollision(laserRays, board)
                    const collide = values.collision
                    laserRays = values.lasers
                    if (collide) {
                        this.enemiesMatrix[i][j] = null
                    }
                }
            }
        }
        return laserRays
    }

    shootLasers(laserRaysEnemy: Array<Laser>) {
        for (let matrixArray of this.enemiesMatrix) {
            for (let i = 0; i < matrixArray.length - 1; i++) {
                if (
                    matrixArray[i] !== null &&
                    (matrixArray[i + 1] === null ||
                        i === matrixArray.length - 2)
                ) {
                    if (matrixArray[i]!.shootLaser()) {
                        const xLaser =
                            matrixArray[i]!.x + matrixArray[i]!.width / 2
                        console.log(xLaser)
                        laserRaysEnemy.push(
                            new Laser({
                                x: xLaser,
                                y: matrixArray[i]!.y,
                                speed: 10
                            })
                        )
                    }
                }
            }
        }
        return laserRaysEnemy
    }

    moveHordeRight() {
        this.enemiesMatrix.map((enemyArray) =>
            enemyArray.map((enemy) => (enemy ? (enemy.x += 1) : null))
        )
    }

    moveHordeLeft() {
        this.enemiesMatrix.map((enemyArray) =>
            enemyArray.map((enemy) => (enemy ? (enemy.x -= 1) : null))
        )
    }

    moveHordeDown() {
        this.enemiesMatrix.map((enemyArray) =>
            enemyArray.map((enemy) => (enemy ? (enemy.y += 5) : null))
        )
    }

    checkHordeRightExists() {
        return this.enemiesMatrix.every(
            (enemyArray) => enemyArray[enemyArray.length - 1] === null
        )
    }
    checkHordeLeftExists() {
        return this.enemiesMatrix.every((enemyArray) => enemyArray[0] === null)
    }
}
