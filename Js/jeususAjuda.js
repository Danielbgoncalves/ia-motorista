const maxCarPosition = 850;
let usuarioCria;

export default class BuildPath extends Phaser.Scene {
    constructor() {
        super({ key: "BuildPath" });

        this.steps = [
            {extraRotation: -(Math.PI/2.2), carAngle: -20 },
            {extraRotation: 0, carAngle: 0 },
            {extraRotation: +(Math.PI/2.2), carAngle: +20 }
        ];

        this.podeIniciar = false;
    }

    init(data){
        usuarioCria = data.usuarioCria;
    }

    preload() {
        this.load.image('paredeG', './Assets/paredeG.png');
        this.load.image('inicio', './Assets/inicio.png');
        this.load.image('chegada', './Assets/chegada.png');
        this.load.image('asfalto', './Assets/asfalto.png');
        this.load.image('iniciar', './Assets/iniciar.png');
    }

    create() {

        // Imagens básicas da simulação
        this.add.image(450, 300, 'asfalto');
        this.add.image(31, 400, 'inicio');
        this.add.image(885, 300, 'chegada');
        let iniciarBtt = this.add.image(70, 530, 'iniciar');
        iniciarBtt.setInteractive();
        
        // O carro
        this.car = this.matter.add.image(30, 400, 'car', null, { isStatic: false });
        this.car.angle = 0;
        
        // Prepara a criação ou não da pista
        this.addParedesConstantes();
        usuarioCria ? this.pistaPersonalizada() : this.pistaPadrao();
  

        // Raycasting setup
        this.rayStart = new Phaser.Math.Vector2(this.car.x, this.car.y);
        this.rayEnd = new Phaser.Math.Vector2(this.car.x + 500, this.car.y); // Raio de 500 pixels de comprimento

        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });

        this.distancias = [];  

        // botao de inicio da simulação
        iniciarBtt.on('pointerdown', ()=>{
            this.car.x = 30;
            this.car.y = 400;
            this.podeIniciar = true;
        });

        // escreve instrução pro usuário
        let texto = this.escreveTexto('Arraste as paredes e monte a pista do seu jeito!');
        this.time.delayedCall( 3000, () =>{
            texto.destroy();
        });
        
    }

    pistaPadrao(){
        // Essas são as paredes da pista
        this.matter.add.image(262, 440, 'paredeG');        
        this.matter.add.image(320, 387, 'paredeG').angle = 90;
        this.matter.add.image(205, 302, 'paredeG').angle = 90; 
        this.matter.add.image(320, 285, 'paredeG').angle = 90; 
        this.matter.add.image(205, 201, 'paredeG').angle = 90;
        this.matter.add.image(260, 146, 'paredeG');
        this.matter.add.image(375, 240, 'paredeG');  
        this.matter.add.image(362, 146, 'paredeG');  
        this.matter.add.image(464, 146, 'paredeG');  
        this.matter.add.image(420, 297, 'paredeG').angle = 90;
        this.matter.add.image(520, 130, 'paredeG').angle = 90;
        this.matter.add.image(520, 230, 'paredeG').angle = 90;
        this.matter.add.image(520, 330, 'paredeG').angle = 90;
        this.matter.add.image(420, 398, 'paredeG').angle = 90;
        this.matter.add.image(475, 452, 'paredeG');  
        this.matter.add.image(575, 452, 'paredeG');  
        this.matter.add.image(675, 452, 'paredeG');  
        this.matter.add.image(775, 452, 'paredeG');  
        this.matter.add.image(875, 452, 'paredeG');  
        this.matter.add.image(577, 375, 'paredeG');  
        this.matter.add.image(677, 375, 'paredeG');  
        this.matter.add.image(777, 375, 'paredeG');
        this.matter.add.image(877, 375, 'paredeG');
    }

    pistaPersonalizada(){
        for(let i = 0; i < 20; i++){
            let borda = this.matter.add.image(70,10, 'paredeG');
            borda.setInteractive({ draggable: true});
            this.matter.body.setStatic(borda.body, true);
        }

        for(let i = 0; i < 20; i++){
            let borda = this.matter.add.image(10,70, 'paredeG');
            borda.angle = 90;
            borda.setInteractive({ draggable: true});
            this.matter.body.setStatic(borda.body, true);
        }
        
        this.input.on('drag', (pointer, obj, dragX, dragY) => {
            obj.x = dragX;
            obj.y = dragY;
        });
    }

    addParedesConstantes(){
        let values = [
            {x: 60, y: 360},
            {x: 160, y: 360},
            {x: 60, y: 440},
            {x: 160, y: 440}
        ];

        values.forEach((body) =>{
            let parede = this.matter.add.image(body.x, body.y, 'paredeG'); 
            parede.setInteractive({draggable: true});
            this.matter.body.setStatic(parede.body, true);
        });

    }

    escreveTexto(conteudo, textPositionX){
        let escrita = this.add.text(450, 200, conteudo, {
            font: '25px Arial', 
            fill: '#ffffff',
            align: 'center',
        });
        return escrita.setOrigin(0.5);

    }

    update() {
        if(this.podeIniciar){
                   
        this.graphics.clear(); // Limpa os desenhos anteriores
        if(this.car.x > maxCarPosition){
            this.podeIniciar = false;
            return;
        }

        this.steps.forEach(step => {
            const rayStart = new Phaser.Math.Vector2(
                this.car.x + 26 * Math.cos(this.car.rotation),
                this.car.y + 26 * Math.sin(this.car.rotation),
            );
            const rayEnd = new Phaser.Math.Vector2(
                this.car.x + 500 * Math.cos(this.car.rotation + step.extraRotation),
                this.car.y + 500 * Math.sin(this.car.rotation + step.extraRotation)
            );
    
            // Desenha o raio
            this.graphics.lineStyle(2, 0xff0000, 1);
            this.graphics.lineBetween(rayStart.x, rayStart.y, rayEnd.x, rayEnd.y);
    
            // Encontra interseções
            const collisions = this.findRayCollisions(rayStart, rayEnd);
    
            if (collisions.length > 0) {
                const closestCollision = collisions.reduce((closest, collision) => {
                    const distance = Phaser.Math.Distance.Between(this.car.x, this.car.y, collision.x, collision.y);
                    return (!closest || distance < closest.distance) ? { ...collision, distance } : closest;
                }, null);
    
                // Desenha o ponto de colisão
                this.graphics.fillStyle(0x00ff00, 1);
                this.graphics.fillCircle(closestCollision.x, closestCollision.y, 5);
                
                // Coleta as ditâncias
                this.distancias.push({dist: closestCollision.distance, angle: step.carAngle});
            } else {
                this.distancias.push({ angle: step.extraRotation, dist: 499 });
            }
        });
        
        let maxDist = 0;
        let minRay = {
            dist: 180,
            angle: 0,
        };
        let bestAngle = 0;
        for(let i = 0; i < this.distancias.length; i ++){
            if( this.distancias[i].dist > maxDist){
                maxDist = this.distancias[i].dist
                bestAngle = this.distancias[i].angle;
            }
            if(this.distancias[i].dist < minRay.dist){
                minRay.dist = this.distancias[i].dist;
                minRay.angle = this.distancias[i].angle;
            }
        }

        if(minRay.dist < 40){
            console.log('min ray ativado')
            bestAngle = -minRay.angle;
        } 
                
            /*console.log(this.distancias)
            console.log(maxDist);
            console.log(bestAngle);*/

        this.car.angle += bestAngle;

        //if(this.inicial3.x > 550) this.podeIniciar = true;

        const force = 0.5; // "velocidade" do carro
        const velocityX = Math.cos(this.car.rotation ) * force;
        const velocityY = Math.sin(this.car.rotation ) * force;
        this.car.setVelocity(velocityX, velocityY);
        this.distancias = [];
            
        }
    }

    findRayCollisions(rayStart, rayEnd) {
        const bodies = this.matter.world.localWorld.bodies; // Encontra todos os corpos colidíveis do mundo
        const collisions = []; 

        bodies.forEach(body => {
            const vertices = body.vertices;
            for (let i = 0; i < vertices.length; i++) {
                const v1 = vertices[i];
                const v2 = vertices[(i + 1) % vertices.length];
                const intersection = this.getLineIntersection(rayStart, rayEnd, new Phaser.Math.Vector2(v1.x, v1.y), new Phaser.Math.Vector2(v2.x, v2.y));
                if (intersection) {
                    collisions.push(intersection);
                }
            }
        });

        return collisions;
    }

    getLineIntersection(p1, p2, p3, p4) {
        const denom = (p4.y - p3.y) * (p2.x - p1.x) - (p4.x - p3.x) * (p2.y - p1.y);
        if (denom === 0) return null; // Lines are parallel

        const ua = ((p4.x - p3.x) * (p1.y - p3.y) - (p4.y - p3.y) * (p1.x - p3.x)) / denom;
        const ub = ((p2.x - p1.x) * (p1.y - p3.y) - (p2.y - p1.y) * (p1.x - p3.x)) / denom;

        if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) {
            return new Phaser.Math.Vector2(p1.x + ua * (p2.x - p1.x), p1.y + ua * (p2.y - p1.y));
        }

        return null; // No intersection
    }
}
