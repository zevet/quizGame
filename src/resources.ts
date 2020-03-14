import * as ex from "excalibur";

const fighterFile = require('../res/fighter.png');
const enemyFile = require('../res/enemy.png');
const spriteexplosionFile = require('../res/spriteexplosion.png');
const gameSheetFile = require('../res/gameSheet.png');
const laserFile = require('../res/laser.wav');
const enemyfireFile = require('../res/enemyfire.wav');
const explodeFile = require('../res/explode.wav');
const hitFile = require('../res/hit.wav');
const powerupFile = require('../res/powerup.wav');
const rocketFile = require('../res/rocket.wav');


const Images: { [key: string]: ex.Texture } = {
    fighter: new ex.Texture(fighterFile),
    enemyPink: new ex.Texture(enemyFile),
    explosion: new ex.Texture(spriteexplosionFile),
    sheet: new ex.Texture(gameSheetFile),
};

const Sounds: { [key: string]: ex.Sound } = {
    laserSound: new ex.Sound(laserFile),
    enemyFireSound: new ex.Sound(enemyfireFile),
    explodeSound: new ex.Sound(explodeFile),
    hitSound: new ex.Sound(hitFile),
    powerUp: new ex.Sound(powerupFile),
    rocketSound: new ex.Sound(rocketFile),
}

const explosionSpriteSheet = new ex.SpriteSheet(Images.explosion, 5, 5, 45, 45);
const gameSheet = new ex.SpriteSheet(Images.sheet, 10.0, 10.0, 32.0, 32.0);

const loader = new ex.Loader();
const allResources = {...Images, ...Sounds};
for (const res in allResources) {
    loader.addResource(allResources[res]);
}

export { Images, Sounds, loader, explosionSpriteSheet, gameSheet };