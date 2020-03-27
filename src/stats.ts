import Config from "./config";

class Stats {
	public bullets: number = 10;
    public gameOver: boolean = false;
    public canShot = true;
    public reset() {
		this.bullets = 10;
        this.gameOver = false;
    }
}

const stats = new Stats()


export { stats }