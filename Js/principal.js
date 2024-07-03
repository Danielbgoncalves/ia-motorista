//import BuildPath from "./buildPath.js";
//import DrawPath from "./drawPath.js";

import Menu from "./menu.js";
import jesusAjuda from "./jeususAjuda.js";


const config = {
  type: Phaser.AUTO, 
  width: 900,
  height: 600,
  physics: {
    default: 'matter',
    matter: {
        gravity: { y: 0 },
        debug: false
    }
  },
  parent: 'canvas',
  scene: [
    Menu,
    jesusAjuda
  ]
};

let jogo = new Phaser.Game(config);

