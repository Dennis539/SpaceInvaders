import Player from './Player/player'
import Enemy from './Enemy/enemy'
import Board from './Board/board'
import Laser from './Laser/laser'
import EnemyHorde from './Enemy/enemyHorde'

let canvas = document.querySelector('canvas')!
const c = canvas?.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var keys: any = {}
window.addEventListener('keydown', function (e) {
    keys[e.key] = true
    e.preventDefault()
})
window.addEventListener('keyup', function (e) {
    delete keys[e.key]
})

const board = new Board(canvas)

const player1 = new Player({
    x: canvas.width / 2,
    y: canvas.height - 200,
    width: 30,
    height: 100,
    speed: 5
})

let enemies: Array<EnemyHorde> = [new EnemyHorde()]
let laserRays: Array<Laser> = []
let laserRaysEnemy: Array<Laser> = []

function drawBoxPlayer(player1: Player) {
    c!.fillStyle = '#000000'
    c?.fillRect(player1.x, player1.y, player1.width, player1.height)
}
function drawBoxEnemies(enemies: Array<EnemyHorde>) {
    c!.fillStyle = '#F050F0'
    enemies.map((enemyHorde) =>
        enemyHorde.enemiesMatrix.map((enemyArray) =>
            enemyArray.map(
                (enemy) =>
                    enemy &&
                    c?.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
            )
        )
    )
}

function drawLasers(lasers: Array<Laser>) {
    c!.fillStyle = '#c30010'
    lasers &&
        lasers.map((laser) =>
            c?.fillRect(laser.x, laser.y, laser.width, laser.height)
        )
}

function draw() {
    c?.clearRect(0, 0, canvas.width, canvas.height)
    drawBoxPlayer(player1)
    enemies && drawBoxEnemies(enemies)
    laserRays && drawLasers(laserRays)
    laserRaysEnemy && drawLasers(laserRaysEnemy)
    if (c) { c.font = "48px serif" }
    c?.fillText(`${player1.health}`, 100, 50, 100)
}

function updatePlayer() {
    player1.move(keys, canvas)
}

function checkLaserOffScreen(laser: Laser) {
    if (laser.y <= 0) {
        return false
    }
    return true
}

function updateLasers(laserCounter: number, player1: Player) {
    if (' ' in keys && laserCounter > 10) {
        laserRays.push(
            new Laser({
                x: player1.x + player1.width / 2,
                y: player1.y,
                speed: 10
            })
        )
        return 0
    }

    laserRays && laserRays.map((laser) => (laser.y -= 10))
    laserRaysEnemy && laserRaysEnemy.map((laser) => (laser.y += 10))
    laserRays = laserRays.filter((laser) => checkLaserOffScreen(laser))
    return laserCounter + 1
}

function updateEnemies() {
    for (let enemyHorde of enemies) {
        if (enemyHorde.direction === 'right') {
            if (enemyHorde.checkHordeRightExists()) {
                enemyHorde.enemiesMatrix = enemyHorde.enemiesMatrix.map(
                    (enemyArray) => enemyArray.slice(0, -1)
                )
                continue
            }
            var rightEnemy = enemyHorde.edgeEnemyHorde()

            if (
                rightEnemy &&
                rightEnemy.x + rightEnemy.width >
                    board.boundaryRight - rightEnemy.speed
            ) {
                enemyHorde.moveHordeDown()
                enemyHorde.direction = 'left'
            } else {
                enemyHorde.moveHordeRight()
            }
        } else if (enemyHorde.direction === 'left') {
            if (enemyHorde.checkHordeLeftExists()) {
                enemyHorde.enemiesMatrix = enemyHorde.enemiesMatrix.map(
                    (enemyArray) => enemyArray.slice(1)
                )
                continue
            }
            var leftEnemy = enemyHorde.edgeEnemyHorde()

            if (
                leftEnemy &&
                leftEnemy.x < board.boundaryLeft + leftEnemy.speed
            ) {
                enemyHorde.moveHordeDown()
                enemyHorde.direction = 'right'
            } else {
                enemyHorde.moveHordeLeft()
            }
        }

        laserRaysEnemy = enemyHorde.shootLasers(laserRaysEnemy)

    }
}

function collision(laserRays: Array<Laser>) {
    if (laserRays.length !== 0) {
        for (let enemyHorde of enemies) {
            laserRays = enemyHorde.checkHordeLaserCollision(laserRays, board)
            if (laserRays.length === 0) {
                return laserRays
            }
        }
    }
    return laserRays
}

let laserCounter = 1
let swarmTimer = 0
let swarmInterval = 1000
let shootChance = 1000

function loop() {
    updatePlayer()
    laserCounter = updateLasers(laserCounter, player1)

    updateEnemies()
    if (laserRaysEnemy.length !== 0) {
        laserRaysEnemy = player1.checkLaserCollision(laserRaysEnemy, board)
    }
    laserRays = collision(laserRays)
    swarmTimer += 1
    if (swarmTimer === swarmInterval) {
        enemies.push(new EnemyHorde())
        swarmTimer = 0
    }
    draw()
    window.requestAnimationFrame(loop)
}

loop()
