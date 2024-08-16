export default class Score {
    alpha: number
    alphaMax: number
    fadeIn: boolean
    fadeOut: boolean
    score: number
    x: number
    y: number
    constructor(x: number, y: number, score: number) {
        this.alpha = 0.06
        this.alphaMax = 1
        this.fadeIn = true
        this.fadeOut = false
        this.score = score
        this.x = x
        this.y = y
    }
    checkFading() {
        if (this.alpha === this.alphaMax && !this.fadeOut) {
            this.fadeIn = true
            this.fadeOut = true
        }
    }
    
    draw(c: any) {
        c.save();
        this.updateAlpha(c)
        c.globalAlpha = this.alpha;
        c.fillStyle = 'lightgray';
        c?.fillText(`${this.score}`, this.x, this.y)

 
        c.fill();
        c.restore();
    }

    updateAlpha (c: any) {
        // fade in
        if(this.fadeIn && this.alpha < this.alphaMax){
            this.alpha += 0.02
        } 
        
        // fade in stop
        else if(this.alpha >= this.alphaMax) {
            this.fadeIn = false
            this.fadeOut = true
            this.alpha -= 0.02
        }
        

        // fade out
        else if(this.fadeIn == false && this.alpha < this.alphaMax) {
            this.alpha -= 0.02
        }        
	}
}