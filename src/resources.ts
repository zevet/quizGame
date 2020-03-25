import * as ex from "excalibur";

const dardo = require('../res/dardo.png');
const alvo = require('../res/alvo.png');
const nuvem = require('../res/cloud.png');
const spriteexplosionFile = require('../res/spriteexplosion.png');
const gameSheetFile = require('../res/gameSheet.png');
const laserFile = require('../res/laser.wav');
const enemyfireFile = require('../res/enemyfire.wav');
const explodeFile = require('../res/explode.wav');
const hitFile = require('../res/hit.wav');
const powerupFile = require('../res/powerup.wav');
const rocketFile = require('../res/rocket.wav');

// resultados
const fabioAsssuncao = require('../res/fabioassuncao.png');
const reginaCase = require('../res/reginacase.jpg');
const caetanoVeloso = require('../res/caetanoveloso.jpg');
const eliana = require('../res/eliana.jpg');
const ronaldinhoGaucho = require('../res/ronaldinhogaucho.jpg');
const seltonMello = require('../res/seltonmello.jpg');
const williamBonner = require('../res/williambonner.jpg');
const xuxa = require('../res/xuxa.jpg');

const Images: { [key: string]: ex.Texture } = {
    dardo: new ex.Texture(dardo),
    alvo: new ex.Texture(alvo),
    nuvem: new ex.Texture(nuvem),
    explosion: new ex.Texture(spriteexplosionFile),
    sheet: new ex.Texture(gameSheetFile),
    fabioassuncao: new ex.Texture(fabioAsssuncao),
    reginacase: new ex.Texture(reginaCase),
    caetanoveloso: new ex.Texture(caetanoVeloso),
    eliana: new ex.Texture(eliana),
    ronaldinhogaucho: new ex.Texture(ronaldinhoGaucho),
    seltonmello: new ex.Texture(seltonMello),
    williambonner: new ex.Texture(williamBonner),
    xuxa: new ex.Texture(xuxa)
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