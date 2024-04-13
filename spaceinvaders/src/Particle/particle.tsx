export default class Particle {
    x: number
    y: number
    radius: number
    dx: number
    dy: number
    alpha: number
    constructor(x: number, y: number, radius: number, dx: number, dy: number) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.dx = dx;
        this.dy = dy;
        this.alpha = 1;
    }
    draw(c: any) {
        c.save();
        c.globalAlpha = this.alpha;
        c.fillStyle = 'lightgray';
        c.beginPath();
 
        c.arc(this.x, this.y, this.radius,
            0, Math.PI * 2, false);
 
        c.fill();
        c.restore();
    }
    update(c: any) {
        this.draw(c)
        this.alpha -= 0.01;
        this.x += this.dx;
        this.y += this.dy;
    }
}