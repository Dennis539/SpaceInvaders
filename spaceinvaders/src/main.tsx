import React, {useEffect} from 'react'

import Player from './Player/player'
import Board from './Board/board'
import Laser from './Laser/laser'
import EnemyHorde from './Enemy/enemyHorde'
import Stars from './Stars/stars'
import Bomb from './Bomb/bomb'
import MachineGunPowerUp from './PowerUp/machineGunPowerUp'




let canvas = document.querySelector('canvas')!
const c = canvas?.getContext('2d')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

let GameOverModelEl = document.getElementById('GameOverModelEl')!
let GameOverScoreEL = document.getElementById('GameOverScoreEL')!
let RestartButtonEL = document.getElementById('RestartButtonEL')!
let StartModelEl = document.getElementById('StartModelEl')!

var keys: any = {}
window.addEventListener('keydown', function (e) {
    keys[e.key] = true
    e.preventDefault()
})
window.addEventListener('keyup', function (e) {
    delete keys[e.key]
})

let enemies: Array<EnemyHorde> = [new EnemyHorde()]
let laserRays: Array<Laser> = []
let laserRaysEnemy: Array<Laser> = []
let stars: Array<Stars> = []
let machineGunPowerUp: MachineGunPowerUp | null


let board = new Board(canvas)
let player1 = new Player({
    x: canvas.width / 2,
    y: canvas.height - 200,
    width: 50,
    height: 50,
    speed: 5
})
let laserCounter = 1
let swarmTimer = 0
let swarmInterval = 1000
let shootChance = 1000
let bombSpawnRate = 0
let gameOver = false
let spawnPowerUp = 0

for (let i = 0; i < canvas.height; i++){
    stars = addStar(stars, i)
}

function init() {
    enemies = [new EnemyHorde()]
    laserRays = []
    laserRaysEnemy = []
    stars = []
    board = new Board(canvas)
    player1 = new Player({
        x: canvas.width / 2,
        y: canvas.height - 200,
        width: 50,
        height: 50,
        speed: 5
    })
    laserCounter = 1
    swarmTimer = 0
    swarmInterval = 1000
    shootChance = 1000
    bombSpawnRate = 0
    gameOver = false
    spawnPowerUp = 0
}


function drawBoxPlayer(player1: Player) {
    const img = new Image()
    img.src = 'spaceship.png'
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

function drawScore() {
    for (let score of board.scores) {
        score.draw(c)
    }
    if (board.scores.length !== 0) {
        board.scores = board.scores.filter((score) => score.alpha >= 0.06)
    }
}

function addBomb() {
    var x = Math.floor(Math.random() * (canvas.width + 2-100))
    var y = Math.floor(Math.random() * (canvas.height + 2))

    board.bombs.push(new Bomb(x, y))
}


function drawBombs() {
    const bombs = board.bombs
    bombs.forEach((bomb, i) => {
        bomb.update(canvas)
        laserRays.forEach((laser, j) => {
            if (board.checkCollisionBomb(bomb, laser)) {
                board.bombs.splice(i, 1)
                laserRays.splice(j, 1)
            }
        })
        bomb.draw(c)
    })
}

function drawBombExplosions() {
    board.bombExplosions.forEach((bombExplosion, i) => {
        bombExplosion.update(c)
    })
    for (let enemyHorde of enemies) {
        for (let bombExplosion of board.bombExplosions) {
            enemyHorde.enemiesMatrix = enemyHorde.enemiesMatrix.map((enemyArray) =>
                enemyArray.filter((enemy) => enemy && !board.checkCollisionExplosion(enemy, bombExplosion)))
        }
    }
    board.bombExplosions = board.bombExplosions.filter((bombExplosion) => bombExplosion.radius < 300)
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

function updateLasers(laserCounter: number, laserFrequency: number, player1: Player) {
    if (' ' in keys && laserCounter > board.laserFrequency) {
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
            laserRays = enemyHorde.checkHordeLaserCollision(laserRays, board)
            if (laserRays.length === 0) {
                return laserRays
            }
        }
    }
    return laserRays
}

function drawMachineGunPowerUp() {
    machineGunPowerUp?.update(c)
    for (let laser of laserRays) {
        if (machineGunPowerUp && board.checkCollisionPowerUp(machineGunPowerUp, laser)) {
            machineGunPowerUp = null
            spawnPowerUp = 0

        }
    
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
    board.scores && drawScore()
    board.bombs && drawBombs()
    board.bombExplosions && drawBombExplosions()
    machineGunPowerUp && drawMachineGunPowerUp()

    if (c) { c.font = "48px serif" }
    c!.fillStyle = "#00ff00"

    c?.fillText(`${player1.health}`, 100, 50, 100)
    c?.fillText(`${board.score}`, 100, canvas.height - 50, 100)
}


function loop() {
    updatePlayer()
    laserCounter = updateLasers(laserCounter, board.laserFrequency, player1)
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
    if (bombSpawnRate >= 100 && board.bombs.length < 2) {
        addBomb()
        bombSpawnRate = 0
    }
    if (spawnPowerUp >= 100 && !machineGunPowerUp && !board.powerUpOn) {
        var x = Math.floor(Math.random() * (canvas.width + 2-30))
        var y = Math.floor(Math.random() * ((canvas.height/2 )+ 2))
        machineGunPowerUp = new MachineGunPowerUp(y - 30)
    }

    if (board.powerUpOn) {
        board.checkPowerUp()
    }

    if (machineGunPowerUp && (machineGunPowerUp.x -30 >= canvas.width)) {
        machineGunPowerUp = null
        spawnPowerUp = 0
    }

    bombSpawnRate += 1
    spawnPowerUp += 1

    draw()
    if (player1.health !== 0) {
        window.requestAnimationFrame(loop)
    } else {
        GameOverModelEl.style.display = 'block';
        GameOverScoreEL.innerHTML = `${board.score}`
    }
}

function preDraw() {
    c?.clearRect(0, 0, canvas.width, canvas.height)
    c!.fillStyle = "black"
    c?.fillRect(0,0, canvas.width, canvas.height)
    stars && drawStars(stars)
    const requestId = window.requestAnimationFrame(preDraw)
}

const requestId = window.requestAnimationFrame(preDraw)

RestartButtonEL.addEventListener("click", () => {
    init()
    loop()
    for (let i = 0; i < canvas.height; i++){
        stars = addStar(stars, i)
    }
    GameOverModelEl.style.display = 'none';
    cancelAnimationFrame(requestId)
})

StartModelEl.addEventListener("click", () => {
    loop()
    StartModelEl.style.display = "none"
})













