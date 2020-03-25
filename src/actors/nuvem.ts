import { Images } from "../resources";
import * as ex from 'excalibur';

export class Cloud extends ex.Actor {
  constructor  (){
     super();
     this.y = ex.Util.randomInRange(50, 500);
     ex.Actor.apply(this, [-100, this.y]);
     this.width = 0;
     this.height = 0;
     var cloud = Images.nuvem.asSprite();
     cloud.scale = new ex.Vector(2, 2)
     this.addDrawing("default", cloud);
  }

  onInitialize(engine: ex.Engine) {
    this.actions.moveTo(this.pos.x + engine.browser.window.nativeComponet.window.innerWidth + 400, this.pos.y, 200).callMethod(() => this.kill());
  }
};