export default class Bomb {
    x: number
    y: number
    dx: number
    dy: number
    radius: number
    fadeIn: boolean
    fadeOut: boolean
    alpha: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.dx = this.determineDir()
        this.dy = this.determineDir()
        this.radius = 50
        this.alpha = 1
        this.fadeIn = true
        this.fadeOut = false
    }

    draw(c: any) {
        c.fillStyle = 'red';
        c.save();
        this.updateAlpha()
        c.globalAlpha = this.alpha;
        c.beginPath();
 
        c.arc(this.x, this.y, this.radius,
            0, Math.PI * 2, false);
 
        c.fill();
        c.restore();
    }

    update(canvas: HTMLCanvasElement) {
        if (this.x - this.radius <= 0 || (this.x + (this.radius)) >= canvas.width) {
            this.dx *= -1
        } else if (this.y - this.radius <= 0 || (this.y + (this.radius)) >= canvas.height) {
            this.dy *= -1
        }
        this.x += this.dx
        this.y += this.dy
    }

    determineDir() {
        const dir = Math.random()
        return dir < 0.5 ? -2 : 2
    }

    updateAlpha () {
        // fade in
        if(this.fadeIn && this.alpha < 1){
            this.alpha += 0.01
        } 
        
        // fade in stop
        else if(this.alpha >= 1) {
            this.fadeIn = false
            this.fadeOut = true
            this.alpha -= 0.01
        }
        

        // fade out
        else if(this.fadeOut && this.alpha > 0.5) {
            this.alpha -= 0.01
        }        

        // fade out stop
        else if (this.fadeOut && this.alpha <= 0.5) {
            this.fadeIn = true
            this.fadeOut = false
            this.alpha += 0.01
        }
	}

}