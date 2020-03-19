import * as ex from "excalibur";
import { Images, Sounds, gameSheet, explosionSpriteSheet } from "../resources";
import Config from "../config";
import { Bullet } from "./bullet";
import { animManager } from "./animation-manager";
import { stats } from "../stats";
import { Inimigo } from "./inimigo";

export class Alvo extends ex.Actor {
    // All bullets belonging to baddies
    public static Bullets: Bullet[] = [];

    private anim?: ex.Animation;
    private explode?: ex.Animation;
    private fireTimer?: ex.Timer;
    private fireAngle: number = Math.random() * Math.PI * 2;

    opcao: string;
    texto: ex.Actor | undefined;
    rodada: number;
    callback: Function;
    constructor(x: number, y: number, width: number, height: number, opcao: string, rodada: number, callback: Function) {
        super({
            pos: new ex.Vector(x, y),
            width: width,
            height: height,
        });
        this.opcao = opcao;
        this.rodada = rodada;
        this.callback = callback;
        // Passive recieves collision events but does not participate in resolution
        this.body.collider.type = ex.CollisionType.Passive;

        // Setup listeners
        this.on('precollision', this.onPreCollision);

    }

    // OnInitialize is called before the 1st actor update
    onInitialize(engine: ex.Engine) {
        // Initialize actor

        // Setup visuals
        // this.anim = gameSheet.getAnimationByIndices(engine, [10, 11, 12], 100)
        // this.anim.scale = new ex.Vector(4, 4);
        // this.addDrawing("default", this.anim);

        const alvo = Images.alvo.asSprite();
        alvo.scale = new ex.Vector(0.5, 0.5);
        this.addDrawing(alvo);

        this.texto = new ex.Label(this.opcao, this.pos.x - 50, 260);
        this.texto.color = ex.Color.White;
        this.texto.scale = new ex.Vector(3, 3);
        engine.add(this.texto);
        
        this.explode = explosionSpriteSheet.getAnimationForAll(engine, 40);
        this.explode.scale = new ex.Vector(3, 3);
        this.explode.loop = false;
        
        // Setup patrolling behavior
        const textoX = this.pos.x - 50
        this.texto.actions.moveTo(textoX + 400, 260, this.rodada * 1.2 * Config.startSpeed)
            .moveTo(textoX, 260, this.rodada* 1.2 * Config.startSpeed)
            .repeatForever();

        this.actions.moveTo(this.pos.x + 400, this.pos.y, this.rodada* 1.2 * Config.startSpeed)
            .moveTo(this.pos.x, this.pos.y, this.rodada * 1.2 * Config.startSpeed)
            .repeatForever();

        // Setup firing timer, repeats forever
        // this.fireTimer = new ex.Timer(() => { this.fire(engine) }, Config.enemyFireInterval, true, -1);
        // engine.addTimer(this.fireTimer);

    }

    destroyOption() {
        this.kill();
        this.texto?.kill();
    }
    // Fires before excalibur collision resoulation
    private onPreCollision(evt: ex.PreCollisionEvent) {
        // only kill a baddie if it collides with something that isn't a baddie or a baddie bullet
        if(!(evt.other instanceof Alvo || evt.other instanceof Inimigo) &&
           !ex.Util.contains(Alvo.Bullets, evt.other)) {
            if ((evt.other instanceof Bullet)) {
                if (!(evt.other.isEnemy)) {
                    Sounds.explodeSound.play();
                    this.callback(this.opcao)
                    if (this.explode) {
                        animManager.play(this.explode, this.pos);
                    }
        
                    stats.score += 100;
                    if (this.fireTimer) {
                        this.fireTimer.cancel();
                    }
                }
            }
         }
    }


    private fire(engine: ex.Engine) {
        this.fireAngle += Math.PI/20;
        const bulletVelocity = new ex.Vector(
            Config.enemyBulletVelocity * Math.cos(this.fireAngle),
            Config.enemyBulletVelocity * Math.sin(this.fireAngle));

        const bullet = new Bullet(this.pos.x, this.pos.y, bulletVelocity.x, bulletVelocity.y, this);
        Alvo.Bullets.push(bullet);
        engine.add(bullet);
    }
}
