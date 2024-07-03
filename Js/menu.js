let carregamento = 0;

export default class Menu extends Phaser.Scene{
    constructor(){
        super({key: 'Menu'});
    }

    preload(){
        this.load.image('fundo', './Assets/fundoMenu.png')
        this.load.image('car', './Assets/car.png');
    }

    create(){
        this.add.image(450, 300, 'fundo');
        this.car = this.add.image(50, 300, 'car');

        this.input.on('pointermove', (pointer) =>{
            this.car.x = pointer.position.x;
        });

        this.graphics = this.add.graphics(0, 0);
        this.escreveTexto('Pista padrão', 300);
        this.escreveTexto('Pista criada pelo usuário', 700);

    }

    escreveTexto(conteudo, textPositionX){
        let escrita = this.add.text(textPositionX, 200, conteudo, {
            font: '20px Arial', 
            fill: '#ffffff',
            align: 'center'
        });
        escrita.setOrigin(0.5);

    }

    update(){ 
        
        this.graphics.clear();
        if(this.car.x > 200 && this.car.x < 400){
            this.graphics.lineStyle(10, 0xff0000, 1);
            this.graphics.lineBetween(200, 230, 200 + carregamento,230);
            carregamento++;

            if(carregamento > 200) this.scene.start('BuildPath', {usuarioCria: false});

        } else if(this.car.x > 600 && this.car.x < 800){
            this.graphics.lineStyle(10, 0xff0000, 1);
            this.graphics.lineBetween(600, 230, 600 + carregamento,230);
            carregamento++;

            if(carregamento > 200) this.scene.start('BuildPath', {usuarioCria: true});

        } else {
            carregamento = 0;
        }

    }
}