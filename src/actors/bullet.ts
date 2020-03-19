import * as ex from "excalibur";
import Config from "../config";
import { gameSheet, Images } from "../resources";
import { Alvo } from "./alvo";

export class Bullet extends ex.Actor {
    public owner?: ex.Actor;
    isEnemy: boolean;
    constructor(x: number, y: number, dx: number, dy: number, owner?: ex.Actor, isEnemy: boolean = false) {
        super({
            pos: new ex.Vector(x, y),
            vel: new ex.Vector(dx, dy),
            width: Config.bulletSize,
            height: Config.bulletSize,
        });
        this.body.collider.type = ex.CollisionType.Passive;
        this.owner = owner;
        this.isEnemy = isEnemy;
    }
    
    onInitialize(engine: ex.Engine) {
        this.on('precollision', this.onPreCollision);
        // Clean up on exit viewport
        this.on('exitviewport', () => this.killAndRemoveFromBullets());

        if (this.isEnemy) {
            const anim = gameSheet.getAnimationByIndices(engine, [3, 4, 5, 6, 7, 8, 7, 6, 5, 4], 100);
            anim.scale = new ex.Vector(2, 2);
            this.addDrawing('default', anim);
        } else {
            const dardo = Images.dardo.asSprite();
            dardo.scale = new ex.Vector(0.2, 0.2);
            this.addDrawing('default', dardo);
        }

    }

    private onPreCollision(evt: ex.PreCollisionEvent) {
        if (!(evt.other instanceof Bullet) && 
            evt.other !== this.owner) {
                this.killAndRemoveFromBullets();
        }
    }

    private killAndRemoveFromBullets() {
        this.kill();
        ex.Util.removeItemFromArray(this, Alvo.Bullets);
    }
}