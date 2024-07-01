//import * as Matter from './node_modules/matter-js/build/matter.min.js';

export default class BuildPath extends Phaser.Scene{
    constructor(){
        super({key:"BuildPath"});
    }

    preload(){
        this.load.image('paredeG', './Assets/paredeG.png');
        this.load.image('car', './Assets/car.png');
        this.load.image('inicio', './Assets/inicio.png');
        this.load.image('chegada', './Assets/chegada.png');
        this.load.image('a', './Assets/a.png');

    }

    create(){
        this.add.image(31, 400, 'inicio');
        this.add.image(785, 300, 'chegada');

        this.car = this.matter.add.image(80,400, 'car', null, {isStatic: false});
        //this.car.angle = 90 ;

        let inicial1 = this.matter.add.image(78,300, 'paredeG');
        let inicial2 = this.matter.add.image(78,532, 'paredeG');
        this.matter.body.setStatic(inicial1.body, true);
        this.matter.body.setStatic(inicial2.body, true);


        let inicial3 = this.matter.add.image(138,402, 'paredeG');
        inicial3.angle = 90;
        this.matter.body.setStatic(inicial3.body, true);

        /*for(let i = 0; i < 20; i++){
            let borda = this.matter.add.image(70,10, 'paredeG');
            borda.setInteractive({ draggable: true});
            this.matter.body.setStatic(borda.body, true);
        }

        for(let i = 0; i < 20; i++){
            let borda = this.matter.add.image(10,70, 'paredeG');
            borda.angle = 90;
            borda.setInteractive({ draggable: true});
            this.matter.body.setStatic(borda.body, true);
        }*/
   

        this.input.on('drag', (pointer, obj, dragX, dragY) =>{
            obj.x = dragX;
            obj.y = dragY;
        });
   
            this.a();
    }

    a(){
        let car = this.car;
let distance = 170;
let distancias = [];
let angle = 3 * Math.PI / 2;

let anguloTotal = Phaser.Math.Angle.Normalize(car.angle + angle);

let rayEndX = car.x + Math.cos(anguloTotal) * distance;
let rayEndY = car.y + Math.sin(anguloTotal) * distance;

let collisions = Matter.Query.ray(this.matter.world.bodies, {x: car.x, y: car.y}, {x: rayEndX, y: rayEndY});

this.add.image(rayEndX, rayEndY, 'a');

if (collisions.length > 0) {
    let collision = collisions[0];
    let collisionPoint = collision.point;
    this.add.image(collisionPoint.x, collisionPoint.y, 'a');

    let dist = Phaser.Math.Distance.Between(car.x, car.y, collisionPoint.x, collisionPoint.y);
    distancias.push(dist);
} else {
    console.log('No collisions detected');
}

    }



    /*update(){

        let car = this.car;
        let directions = [0, Math.PI/6, -(Math.PI/6)];
        let distance = 100;
        let distancias = [];

        directions.forEach( (angle) =>{
            
            let anguloTotal = Phaser.Math.Angle.Normalize(car.angle + angle);

            let rayEndX = car.x + Math.cos(anguloTotal) * distance;
            let rayEndY = car.y + Math.sin(anguloTotal) * distance;

            let colisions = Matter.Query.ray(this.matter.world.localWorld.bodies, {x: car.x, y: car.y}, 
                {x: rayEndX, y: rayEndY});

            // ou sera que o certo é let colisions = Matter.Query.ray(this.matter.world.bodies, {x: car.x, y: car.y}, {x: rayEndX, y: rayEndY}); ?

            if(colisions[0]){
                console.log('colisions[0] existe e é:', colisions[0].bodyB.position)
            } else console.log('colisions[0] nao existe ')


            if(colisions.length > 0){
                let dist = Phaser.Math.Distance.Between(car.x, car.y, colisions[0].bodyB.position.x, colisions[0].bodyB.position.y);
                distancias.push(dist);
            }
        });

        //let max = Math.max(...distancias);

    }*/
}