import Config from "./config";

class Stats {
	public bullets: number = 10;
    public hp: number = Config.totalHp;
    public gameOver: boolean = false;
    public score: number = 0;
    public reset() {
		this.bullets = 10;
        this.hp = Config.totalHp;
        this.gameOver = false;
        this.score = 0;
    }
}

const stats = new Stats()


export { stats }