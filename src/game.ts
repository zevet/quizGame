import * as ex from "excalibur";
import { Dardo } from "./actors/dardo";
import { HealthBar } from "./actors/health-bar";
import { Inimigo } from "./actors/inimigo";

import { stats } from "./stats";
import { Alvo } from "./actors/alvo";
import Config from "./config";

import { animManager } from "./actors/animation-manager";
import { Images } from "./resources";
import { Cloud } from "./actors/nuvem";

export class Game extends ex.Scene {
  engine: ex.Engine;
  questoes = [
    {
      pergunta: "De qual período você mais gosta?",
      opcoes: ["Manhã", "Tarde", "Noite"]
    },
    {
      pergunta: "Qual seu lazer preferido?",
      opcoes: ["Ler", "Jogar", "Assistir"]
    },
    {
      pergunta: "Qual o seu animal preferido?",
      opcoes: ["Cachorro", "Gato", "Pássaros"]
    },
    {
      pergunta: "Qual seu esporte predileto?",
      opcoes: ["Futebol", "Vôlei", "Nenhum"]
    },
    {
      pergunta: "O que você prefere?",
      opcoes: ["Frio", "Calor"]
    }
  ];

  resultados = [
    {nome: "Fábio Assunção", resourceName: 'fabioassuncao'},
    {nome: "Regina Casé", resourceName: 'reginacase'},
    {nome: 'Xuxa Meneguel', resourceName: 'xuxa'},
    {nome: 'Eliana', resourceName: 'eliana'},
    {nome: 'Ronaldinho Gaúcho', resourceName: 'ronaldinhogaucho'},
    {nome: "Selton Mello", resourceName: "seltonmello"},
    {nome: "Caetano Veloso", resourceName: "caetanoveloso"},
    {nome: "William Bonner", resourceName: "williambonner"},
  ];

  alvosAtuais: Array<Alvo> = [];
  inimigos: Array<Inimigo> = [];
  rodadaAtual: number;
  questaoAtual: any;
  labelQuestao: ex.Label | undefined;

  respostasJogador: Array<{ questao: any; respostaJogador: string }> = [];

  finalizado = false;
  constructor(engine: ex.Engine) {
    super(engine);
    this.rodadaAtual = 1;
    this.engine = engine;
  }

  onInitialize(engine: ex.Engine) {
    engine.add(animManager);

    this.desenharNuvens(engine);

    this.desenharDardo(engine);
	  this.desenharBullets(engine);

    this.novaRodada();


    engine.on("preupdate", (evt: ex.PreUpdateEvent) => {
      if ((stats.gameOver && !this.finalizado) || stats.bullets <= 0) {
        this.finalizarJogo(engine);
      }
    });
  }
  novaRodada() {
    this.questaoAtual = this.questoes[
      Math.floor(Math.random() * 10) % this.questoes.length
    ];

    let i = 0;

    this.labelQuestao?.kill();
    this.labelQuestao = new ex.Label(this.questaoAtual.pergunta, this.engine.halfCanvasWidth - (this.questaoAtual.pergunta.length * 10 ), 50);
    this.labelQuestao.color = ex.Color.White;
    this.labelQuestao.scale = new ex.Vector(4, 4);
    this.engine.add(this.labelQuestao);

    for (const opcao of this.questaoAtual.opcoes) {
      const alvo = new Alvo(
        100 + 200 * i,
        150,
        80,
        80,
        opcao,
        this.rodadaAtual,
        this.questaoAtual.opcoes.length,
        this.callback.bind(this)
      );
      this.engine.add(alvo);
      this.alvosAtuais.push(alvo);
      i++;
    }
  }
  async callback(resposta: string) {
    // guardar resposta
    // matar os alvos
    // chamar nova rodada
    this.respostasJogador.push({
      questao: this.questaoAtual,
      respostaJogador: resposta
    });
    await this.limparOpcoes();
    this.rodadaAtual += 1;

    console.log("rodadaAtual", this.rodadaAtual);
    if (this.rodadaAtual === 5) {
      stats.gameOver = true;
    } else {
      this.novaRodada();
    }
  }

  desenharNuvens(engine: ex.Engine) {
    setTimeout(() => {
      setInterval(() => {
        const numeroDeNuvens = ex.Util.randomIntInRange(0, 3);
        for (let i = 0; i < numeroDeNuvens; i++) {
          engine.add(new Cloud());
        }
      }, 3000)
    }, 1500);
  }
  desenharDardo(engine: ex.Engine) {
    const dardo = new Dardo(engine.halfDrawWidth, 800, 80, 80);
    engine.add(dardo);
  }

  desenharBullets(engine: ex.Engine) {
    const BulletsLabel = new ex.Label("Dardos: " + stats.bullets, 20, 50);
    BulletsLabel.color = ex.Color.White;
    BulletsLabel.scale = new ex.Vector(3, 3);
    BulletsLabel.on("preupdate", function(this: ex.Label, evt) {
      this.text = "Dardos: " + stats.bullets;
    });
    engine.add(BulletsLabel);
  }

  async limparOpcoes() {
    for (const alvo of this.alvosAtuais) {
      alvo.destroyOption();
    }
    this.alvosAtuais.splice(0, this.alvosAtuais.length);
    return;
  }

  finalizarJogo(engine: ex.Engine) {
    this.finalizado = true;
    let message: string;
    let color;
    if(stats.bullets <= 0) {
      message = 'Você não conseguiu responder todas perguntas :(';
      color = ex.Color.Red;
    } else {
      const indexResultado = Math.floor(Math.random() * 10) % this.resultados.length;
      message = "Você tem os mesmos gostos do (a) " +
      this.resultados[
        indexResultado
      ].nome;
      color = ex.Color.Green;
      this.desenharFoto(engine, indexResultado);
    }
    const gameOverLabel = new ex.Label(
      message,
      engine.halfDrawWidth - (message.length * 7),
      150
    );
    gameOverLabel.color = color;
    gameOverLabel.scale = new ex.Vector(3, 3);
    gameOverLabel.actions.blink(1000, 1000, 400).repeatForever();
    engine.add(gameOverLabel);
    this.inimigos.forEach(i => i.destroyOption());
    this.alvosAtuais.forEach(a => a.destroyOption());
    this.labelQuestao?.kill();
  }

  desenharFoto(engine: ex.Engine, index: number) {
    const foto = Images[this.resultados[index].resourceName];
    const spriteFoto = foto.asSprite();
    spriteFoto.scale = new ex.Vector(0.6, 0.6);
    const actor = new ex.Actor(engine.halfCanvasWidth, engine.halfCanvasHeight, spriteFoto.drawWidth, spriteFoto.drawHeight);
    actor.addDrawing(spriteFoto);
    engine.add(actor);
  }
}
