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
        enemyArray.map(
            (enemy) =>
                enemy &&
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

function checkLaserOffScreen(laser: Laser) {
    if (laser.y <= 0) {
        return false
    }
    return true
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
    laserRays = laserRays.filter((laser) => checkLaserOffScreen(laser))
    return laserCounter + 1
}

function edgeEnemies(enemyDirection: string) {
    var directionEnemies = enemies.map(
        (enemiesArray) =>
            enemiesArray[enemyDirection === 'right' ? enemies[0].length - 1 : 0]
    )

    function checkMaxOrMin(
        curVal: Enemy,
        highestVal: Enemy,
        enemyDirection: string
    ) {
        if (!curVal && !highestVal) {
            return highestVal
        } else if (!curVal) {
            return highestVal
        } else if (!highestVal) {
            return curVal
        } else if (enemyDirection === 'right') {
            return highestVal.x < curVal.x ? curVal : highestVal
        } else {
            return highestVal.x > curVal.x ? curVal : highestVal
        }
    }

    var directionEnemy = directionEnemies.reduce((highestVal, curVal) =>
        checkMaxOrMin(highestVal, curVal, enemyDirection)
    )
    return directionEnemy
}

function updateEnemies(enemyDirection: string) {
    if (enemyDirection === 'right') {
        if (
            enemies.every(
                (enemyArray) => enemyArray[enemyArray.length - 1] === null
            )
        ) {
            enemies = enemies.map((enemyArray) => enemyArray.slice(0, -1))
            return enemies
        }
        var rightEnemy = edgeEnemies(enemyDirection)

        if (
            rightEnemy.x + rightEnemy.width >
            board.boundaryRight - rightEnemy.speed
        ) {
            enemies.map((enemyArray) =>
                enemyArray.map((enemy) => (enemy ? (enemy.y += 5) : null))
            )
            board.enemyDirection = 'left'
        } else {
            enemies.map((enemyArray) =>
                enemyArray.map((enemy) => (enemy ? (enemy.x += 1) : null))
            )
        }
    } else if (enemyDirection === 'left') {
        if (enemies.every((enemyArray) => enemyArray[0] === null)) {
            enemies = enemies.map((enemyArray) => enemyArray.slice(1))
            return enemies
        }
        var leftEnemy = edgeEnemies(enemyDirection)
        console.log(leftEnemy)

        if (leftEnemy.x < board.boundaryLeft + leftEnemy.speed) {
            enemies.map((enemyArray) =>
                enemyArray.map((enemy) => (enemy ? (enemy.y += 5) : null))
            )
            board.enemyDirection = 'right'
        } else {
            enemies.map((enemyArray) =>
                enemyArray.map((enemy) => (enemy ? (enemy.x -= 1) : null))
            )
        }
    }
    return enemies
}

function checkLaserCollision(i: number, j: number) {
    const anyCollision = laserRays.some((laser) =>
        board.checkCollision(enemies[i][j], laser)
    )
    if (anyCollision) {
        console.log('collide')
        laserRays = laserRays.filter(
            (laser) => !board.checkCollision(enemies[i][j], laser)
        )
        return { collision: true, lasers: laserRays }
    }
    return { collision: false, lasers: laserRays }
}

function collision(laserRays: Array<Laser>) {
    if (laserRays.length !== 0) {
        for (let i = 0; i < enemies.length; i++) {
            for (let j = 0; j < enemies[i].length; j++) {
                if (!!enemies[i][j]) {
                    const values = checkLaserCollision(i, j)
                    const collide = values.collision
                    laserRays = values.lasers
                    if (collide) {
                        enemies[i][j] = null
                    }
                }
            }
        }
    }
}

let laserCounter = 200

function loop() {
    updatePlayer()
    laserCounter = updateLasers(laserCounter, player1)

    enemies = updateEnemies(board.enemyDirection)
    collision(laserRays)
    draw()
    window.requestAnimationFrame(loop)
}

loop()
