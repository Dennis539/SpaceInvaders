export default class MachineGunPowerUp {
    x: number
    y: number
    radius: number
    lightness: number
    lighter: boolean
    darker: boolean
    constructor( y: number) {
        this.y = y
        this.radius = 30
        this.x = this.radius - 30
        this.lighter = false
        this.darker = true
        this.lightness = 50
    }

    draw(c: any) {
        this.updateLightness()
        // c.globalCompositeOperation = "saturation";
        // c.fillStyle = `hsl(62,100%,50%)`;  // saturation at 100%
        c.fillStyle = `hsl(62,100%,${this.lightness}%)`;  // saturation at 100%

        c.beginPath();
        c.arc(this.x, this.y, this.radius,
            0, Math.PI * 2, false);
 
        c.fill()
        // c.globalCompositeOperation = "source-over";  // restore default comp

    }

    update(c: any) {
        this.draw(c)
        this.x += 4
    }

    updateLightness () {
        // lighter
        if(this.lighter && this.lightness < 100){
            this.lightness += 1
        } 
        
        // ligher stop
        else if(this.lightness >= 100) {
            this.lighter = false
            this.darker = true
            this.lightness -= 1
        }
        

        // fade out
        else if(this.darker && this.lightness > 50) {
            this.lightness -= 1
        }        

        // fade out stop
        else if (this.darker && this.lightness <= 50) {
            this.lighter = true
            this.darker = false
            this.lightness += 1
        }
	}
}