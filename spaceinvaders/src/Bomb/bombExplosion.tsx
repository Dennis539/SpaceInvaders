import Bomb from "./bomb"
import Laser from "../Laser/laser"
import Enemy from "../Enemy/enemy"

export default class BombExplosion {
    x: number
    y: number
    radius: number
    alpha: number
    constructor(x: number, y: number) {
        this.radius = 100
        this.x = x
        this.y = y
        this.alpha = 1
    }

    draw(c: any) {
        c.save();
        c.fillStyle = 'red';
        c.globalAlpha = this.alpha;

        c.beginPath();
        c.arc(this.x, this.y, this.radius,
            0, Math.PI * 2, false);
        c.fill()
        c.restore()
    }

    update(c: any) {
        this.draw(c)
        if (this.radius < 300) {
            this.radius += 10
        }
        this.alpha -= 0.02
    }

}