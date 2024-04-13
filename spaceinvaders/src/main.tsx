import Player from './Player/player'
import Enemy from './Enemy/enemy'
import Board from './Board/board'
import Laser from './Laser/laser'
import EnemyHorde from './Enemy/enemyHorde'
import Stars from './Stars/stars'
import Particle from './Particle/particle'

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
    width: 50,
    height: 50,
    speed: 5
})

let enemies: Array<EnemyHorde> = [new EnemyHorde()]
let laserRays: Array<Laser> = []
let laserRaysEnemy: Array<Laser> = []
let stars: Array<Stars> = []

function drawBoxPlayer(player1: Player) {
    const img = new Image(); // Create new img element
    img.src = 'spaceship.png'; // Set source path
    c?.drawImage(img, player1.x, player1.y, player1.width, player1.height)
}


function drawBoxEnemies(enemies: Array<EnemyHorde>) {
    c!.fillStyle = '#F050F0'
    enemies.map((enemyHorde) =>
        enemyHorde.enemiesMatrix.map((enemyArray) =>
            enemyArray.map(
                (enemy) =>
                    enemy &&
                    c?.drawImage(enemy.image, enemy.x, enemy.y, enemy.width, enemy.height)

            )
        )
    )
}

function addStar(stars: Array<Stars>, yPos:number) {
    var xPos = Math.floor(Math.random() * (canvas.width + 2))
    var newStar = new Stars(xPos, yPos, Math.random()*2)
    stars.push(newStar)
    return stars
}

for (let i = 0; i < canvas.height; i++){
    stars = addStar(stars, i)
}

function drawStars(stars: Array<Stars>) {
    c!.fillStyle = 'white'
    stars = addStar(stars, canvas.height)
    for (let star of stars) {
        c?.beginPath()
        c?.arc(star.xPos, star.yPos, star.radius, 0, 2*Math.PI)
        c?.fill()
        star.yPos -= 1
    }
}

function drawLasers(lasers: Array<Laser>) {
    c!.fillStyle = '#c30010'
    const img = new Image(); // Create new img element
    img.src = 'RedLaser.jpg'; // Set source path
    
    lasers &&
        lasers.map((laser) =>
            c?.drawImage(laser.image, laser.x, laser.y, laser.width, laser.height * 2)
        )
}

function drawExplosions() {
    var explosions = board.explosions
    for (let explosion of explosions) {
        explosion.forEach((particle,i) => {
            if (particle.alpha <= 0) {
                explosion.splice(i,1)
            } else {
                particle.update(c)
            }
        });
    }
}

function draw() {
    c?.clearRect(0, 0, canvas.width, canvas.height)
    c!.fillStyle = "black"
    c?.fillRect(0,0, canvas.width, canvas.height)
    stars && drawStars(stars)

    drawBoxPlayer(player1)
    enemies && drawBoxEnemies(enemies)
    laserRays && drawLasers(laserRays)
    laserRaysEnemy && drawLasers(laserRaysEnemy)
    board.explosions && drawExplosions()

    if (c) { c.font = "48px serif" }
    c?.fillText(`${player1.health}`, 100, 50, 100)
    c?.fillText(`${player1.score}`, 100, canvas.height - 50, 100)
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
                speed: 10,
                shooter: "player"
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
            laserRays = enemyHorde.checkHordeLaserCollision(laserRays, board, player1)
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
let gameOver = false

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
    if (player1.health !== 0) {
        window.requestAnimationFrame(loop)
    }
}

var startGame = false


loop()
