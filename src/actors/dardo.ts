import * as ex from "excalibur";
import { Sounds, explosionSpriteSheet, Images } from "../resources";
import Config from "../config";
import { Bullet } from "./bullet";
import { Alvo } from "./alvo";
import { stats } from "../stats";

type FireFunction = (engine: ex.Engine) => void;
const throttle = function(this: any, func: FireFunction, throttle: number): FireFunction {
    var lastTime = Date.now();
    var throttle = throttle;
    return (engine: ex.Engine) => {
       var currentTime = Date.now();
       if(currentTime - lastTime > throttle){
          var val = func.apply(this, [engine]);
          lastTime = currentTime;
          return val;
       }
    }
 }

export class Dardo extends ex.Actor {
    private flipBarrel = false;
    private throttleFire?: FireFunction;
    private explode?: ex.Animation;
    constructor(x: number, y: number, width: number, height: number) {
        super({
            pos: new ex.Vector(x, y),
            width: width,
            height: height,
        });

        this.body.collider.type = ex.CollisionType.Passive;
    }

    onInitialize(engine: ex.Engine) {
        this.throttleFire = throttle(this.fire, Config.playerFireThrottle);
        this.on('precollision', this.onPreCollision);

        // Keyboard
        engine.input.keyboard.on('hold', (evt) => this.handleKeyEvent(engine, evt));
        engine.input.keyboard.on('release', (evt: ex.Input.KeyEvent) => { 
            if(evt.key !== ex.Input.Keys.Space) {
                this.vel = ex.Vector.Zero.clone()
            }
         });
        
        const dardo = Images.dardo.asSprite();
        dardo.scale = new ex.Vector(0.2, 0.2);
        this.addDrawing(dardo);

        this.explode = explosionSpriteSheet.getAnimationForAll(engine, 40);
        this.explode.scale = new ex.Vector(3, 3);
        this.explode.loop = false;
    }

    onPreCollision(evt: ex.PreCollisionEvent) {
        if(evt.other instanceof Alvo || ex.Util.contains(Alvo.Bullets, evt.other)){
            Sounds.hitSound.play();
            this.actions.blink(300, 300, 3);
         }
    }

    onPostUpdate(engine: ex.Engine, delta: number) {
        // Keep player in the viewport
       if(this.pos.x < 0) this.pos.x = 0;
       if(this.pos.y < 0) this.pos.y = 0;
       if(this.pos.x > engine.drawWidth - this.width) this.pos.x = (engine.drawWidth - this.width);
       if(this.pos.y > engine.drawHeight - this.height) this.pos.y = (engine.drawHeight - this.height);
    }

    private fire = (engine: ex.Engine) => {
        if (stats.canShot) {
            let bullet = new Bullet(this.pos.x + (this.flipBarrel?-40:40), this.pos.y - 20, 0, Config.playerBulletVelocity, this);
            this.flipBarrel = !this.flipBarrel;
            Sounds.laserSound.play();
            if(stats.bullets > 0){
            stats.bullets -= 1;
            }
            stats.canShot = false;
            engine.add(bullet);
        }
    }

    handleKeyEvent = (engine: ex.Engine, evt: ex.Input.KeyEvent) => {
        let dir = ex.Vector.Zero.clone();

        if (evt.key === ex.Input.Keys.Space) {

            this.throttleFire ? this.throttleFire(engine) : null;
            if (this.vel.x !== 0 || this.vel.y !== 0) {
                dir = this.vel.normalize();
            }
        }

        if (evt.key === ex.Input.Keys.Left ||
            evt.key === ex.Input.Keys.A) {
            dir.x += -1;
        }

        if (evt.key === ex.Input.Keys.Right ||
            evt.key === ex.Input.Keys.D) {
            dir.x += 1;
        }



        if (dir.x !== 0 || dir.y !== 0) {
            this.vel = dir.normalize().scale(Config.playerSpeed);
        }
    }
}

