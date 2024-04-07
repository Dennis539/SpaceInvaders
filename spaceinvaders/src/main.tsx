import Player from './Player/player'
import Enemy from './Enemy/enemy'
import Board from './Board/board'
import Laser from './Laser/laser'

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

function createEnemies() {
    let enemiesArray: Array<Array<Enemy>> = []
    var xStart = 100
    var yStart = 0
    for (let i = 0; i < 5; i++) {
        enemiesArray.push([])

        for (let j = 0; j < 10; j++) {
            enemiesArray[i].push(
                new Enemy({
                    x: xStart,
                    y: yStart,
                    width: 30,
                    height: 30,
                    speed: 5
                })
            )
            xStart += 100
        }
        yStart += 50
        xStart = 100
    }
    return enemiesArray
}

let enemies: Array<Array<Enemy>> = createEnemies()
let laserRays: Array<Laser> = []

function drawBoxPlayer(player1: Player) {
    c!.fillStyle = '#000000'
    c?.fillRect(player1.x, player1.y, player1.width, player1.height)
}
function drawBoxEnemies(enemies: Array<Array<Enemy>>) {
    c!.fillStyle = '#F050F0'
    enemies.map((enemyArray) =>
        enemyArray.map((enemy) =>
            c?.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
        )
    )
}

function drawLasers(laserRays: Array<Laser>) {
    c!.fillStyle = '#c30010'

    laserRays &&
        laserRays.map((laser) =>
            c?.fillRect(laser.x, laser.y, laser.width, laser.height)
        )
}

function draw() {
    c?.clearRect(0, 0, canvas.width, canvas.height)
    drawBoxPlayer(player1)
    drawBoxEnemies(enemies)
    laserRays && drawLasers(laserRays)
}

function updatePlayer() {
    player1.move(keys, canvas)
}

function updateLasers(laserCounter: number, player1: Player) {
    if (' ' in keys && laserCounter > 20) {
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
    return laserCounter + 1
}

function updateEnemies(enemyDirection: string) {
    if (enemyDirection === 'right') {
        var rightEnemy = enemies[0][enemies[0].length - 1]
        if (
            rightEnemy.x + rightEnemy.width >
            board.boundaryRight - rightEnemy.speed
        ) {
            enemies.map((enemyArray) =>
                enemyArray.map((enemy) => (enemy.y += 5))
            )
            board.enemyDirection = 'left'
        } else {
            enemies.map((enemyArray) =>
                enemyArray.map((enemy) => (enemy.x += 1))
            )
        }
    } else if (enemyDirection === 'left') {
        var leftEnemy = enemies[0][0]
        if (leftEnemy.x < board.boundaryLeft + leftEnemy.speed) {
            enemies.map((enemyArray) =>
                enemyArray.map((enemy) => (enemy.y += 5))
            )
            board.enemyDirection = 'right'
        } else {
            enemies.map((enemyArray) =>
                enemyArray.map((enemy) => (enemy.x -= 1))
            )
        }
    }
}

function checkLaserOffScreen(laser: Laser) {
    if (laser.y === 0) {
        return false
    }
    return true
}

function collision() {
    if (laserRays.length !== 0) {
        for (let i = 0; i < enemies.length; i++) {
            for (let j = 0; j < enemies[i].length; j++) {
                laserRays = laserRays.filter((laser) =>
                    board.checkCollision(enemies[i][j], laser)
                )
                // for (let k = 0; k < laserRays.length; k++)
                //     board.checkCollision(enemies[i][j], laserRays[k])
            }
        }
    }
}

let x = 1
let laserCounter = 200

function loop() {
    updatePlayer()
    laserCounter = updateLasers(laserCounter, player1)

    // updateEnemies(board.enemyDirection)
    collision()
    draw()
    window.requestAnimationFrame(loop)
}

loop()
