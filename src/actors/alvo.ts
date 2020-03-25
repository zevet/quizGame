import * as ex from "excalibur";
import { Images, Sounds, explosionSpriteSheet } from "../resources";
import Config from "../config";
import { Bullet } from "./bullet";
import { animManager } from "./animation-manager";
import { stats } from "../stats";
import { Inimigo } from "./inimigo";

export class Alvo extends ex.Actor {
    // All bullets belonging to baddies
    public static Bullets: Bullet[] = [];

    private explode?: ex.Animation;

    opcao: string;
    texto: ex.Actor | undefined;
    numberOfItens: number;
    rodada: number;
    callback: Function;
    constructor(x: number, y: number, width: number, height: number, opcao: string, rodada: number, numberOfItens: number, callback: Function) {
        super({
            pos: new ex.Vector(x, y),
            width: width,
            height: height,
        });
        this.opcao = opcao;
        this.numberOfItens = numberOfItens;
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
        this.texto.actions.moveTo(textoX + engine.browser.window.nativeComponet.window.innerWidth - (this.numberOfItens * 185), 260, this.rodada * 1.2 * Config.startSpeed)
            .moveTo(textoX, 260, this.rodada* 1.2 * Config.startSpeed)
            .repeatForever();

        this.actions.moveTo(this.pos.x + engine.browser.window.nativeComponet.window.innerWidth - (this.numberOfItens * 185), this.pos.y, this.rodada* 1.2 * Config.startSpeed)
            .moveTo(this.pos.x, this.pos.y, this.rodada * 1.2 * Config.startSpeed)
            .repeatForever();
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
                Sounds.explodeSound.play();
                this.callback(this.opcao)
                if (this.explode) {
                    animManager.play(this.explode, this.pos);
                }
    
                stats.canShot = true;
                stats.score += 100;
            }
         }
    }
}
