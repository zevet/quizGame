import * as ex from "excalibur";
import Config from "../config";
import { Images } from "../resources";
import { Alvo } from "./alvo";
import { stats } from "../stats";

export class Bullet extends ex.Actor {
    public owner?: ex.Actor;
    constructor(x: number, y: number, dx: number, dy: number, owner?: ex.Actor) {
        super({
            pos: new ex.Vector(x, y),
            vel: new ex.Vector(dx, dy),
            width: Config.bulletSize,
            height: Config.bulletSize,
        });
        this.body.collider.type = ex.CollisionType.Passive;
        this.owner = owner;
    }
    
    onInitialize(engine: ex.Engine) {
        this.on('precollision', this.onPreCollision);
        // Clean up on exit viewport
        this.on('exitviewport', () => this.killAndRemoveFromBullets());
        const dardo = Images.dardo.asSprite();
        dardo.scale = new ex.Vector(0.2, 0.2);
        this.addDrawing('default', dardo);
    }
    _postupdate() {
        if (this.y < 0) {
            this.kill();
            stats.canShot = true;
        }
    }

    private onPreCollision(evt: ex.PreCollisionEvent) {
        if ((evt.other instanceof Alvo) && 
            evt.other !== this.owner) {
                this.killAndRemoveFromBullets();
        }
    }

    private killAndRemoveFromBullets() {
        this.kill();
        ex.Util.removeItemFromArray(this, Alvo.Bullets);
    }
}