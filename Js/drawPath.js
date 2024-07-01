//import decomp from './poly-decomp';
//window.decomp = decomp;
//import bundle from "./bundle.js";

let isDrawing = false;
let drawPath = []; // Significa caminho de desenho
let graphics;

export default class DrawPath extends Phaser.Scene{
    constructor(){
        super({key: 'DrawPath'})
    }

    preload(){
    }

    create(){
        this.car = this.matter.add.image(450,230, 'car', null, {isStatic: false});
        
        graphics = this.add.graphics({lineStyle: {width: 50, color: 0xffffff} });
        /* graphics é esse corpo que será desenhado pelo Phaser, com a espessura de 40 pixels e cor branca */
  
        this.input.on('pointerdown', (pointer) =>{
            isDrawing = true;
            drawPath.push(pointer.position.clone() );
        })
        /* quando o mouse ou dedo é precionado na tela esse método é chamado, e drawPath recebe seu primeiro
         valor em drawPath[0], essa é a posição inicial do desenho  */

        this.input.on('pointermove', (pointer) =>{
            if(isDrawing){
                drawPath.push(pointer.position.clone() );
                this.drawLine(drawPath);
            }
        })
        /* Enquanto o mouse esta precionado para baixo e se move, cada ponto por qual ele passa é clocado e 
        passado para o array drawPath.Uso .clone() ao invez de pointer.position pois como o mouse esta
        em movimento a posição passado pro array não seria a do momento exato */
        let array = [];
        let array2 = [
            {x: 200, y: 300},
            {x: 300, y: 300},
            {x: 320, y: 290},
            {x: 340, y: 300},
            {x: 300, y: 400},
            {x: 200, y: 400},

        ]

        this.input.on('pointerup', (pointer) =>{
            isDrawing = false;
            array = this.simplifyPath(drawPath, 25);
            this.addPhysicsToPath(array);
            drawPath = []; // Reseta o caminho para a próxima criação
        })

        /* Quando o clique é levantado o desenho é dado como completo e recebe a fisica necessária para o 
        funcionamento */

    }

    drawLine(path){ 
        graphics.clear(); // Limpa a tela de todos os desenhos anteriores
        graphics.beginPath(); // Inicia o desenho do usuário, para desenhos livres usa isso
        graphics.moveTo(path[0].x, path[0].y); // É o ponto inicial do grafico desenhado

        for(let i = 1; i < path.length ; i++){ // Itera sobre todo o array
            graphics.lineTo(path[i].x, path[i].y); /* Para cada ponto contido, é desenhada uma 
                                                      reta ligando com o anterior */
        }

        graphics.strokePath(); // Com o deseno completo ele ganha a espessua e a cor 
    }

    simplifyPath(path){
        let newPath = [];
        let lastI;
        const width = 20;
        for(let i = 0; i < path.length; i += 20){
            newPath.push({x:path[i].x - width, y: path[i].y -  width});
            lastI = i;
        }

        for(let j = lastI; j > -1; j -=20 ){
            newPath.push({x:path[j].x +  width, y: path[j].y +  width});
        }

        newPath.forEach(element =>{
            console.log(element);
        });

        
        return newPath;
    }

        /*calcularAngulo(ponto1, ponto2) {
            let dx = ponto2.x - ponto1.x;
            let dy = ponto2.y - ponto1.y;
            let anguloEmRadianos = Math.atan2(dy, dx);
            // Converta para graus se necessário
            let anguloEmGraus = anguloEmRadianos * 180 / Math.PI;
            return anguloEmGraus;
          }

          ajustarDeslocamento(angulo, deslocamento) {
            let anguloComplementar = 90 - angulo;
            let senoComplementar = Math.sin(anguloComplementar * Math.PI / 180);
            let cossenoComplementar = Math.cos(anguloComplementar * Math.PI / 180);
            let deslocamentoX = deslocamento * cossenoComplementar;
            let deslocamentoY = deslocamento * senoComplementar;
            return { x: deslocamentoX, y: deslocamentoY };
          }*/

        /*simplifyPath(path) {
            let newPath = [];
            let lastI;
          
            for (let i = 0; i < path.length; i++) {
              let pontoAtual = path[i];
              let proximoPonto;
          
              if (i + 1 < path.length) {
                proximoPonto = path[i + 1];
              } else {
                proximoPonto = {x:path[0].x, y: path[0].y -50}; // Conectar o último ponto ao primeiro para fechar a forma
              }
          
              let angulo = this.calcularAngulo(pontoAtual, proximoPonto);
              let deslocamentoAjustado = this.ajustarDeslocamento(angulo, 25); // Ajuste o valor de '25' para a espessura desejada
          
              newPath.push({
                x: pontoAtual.x + deslocamentoAjustado.x,
                y: pontoAtual.y + deslocamentoAjustado.y
              });
            }
          
            return newPath;
          }*/
          

        
          
          
        

    addPhysicsToPath(path){
        let valoresX = path.map(obj => obj.x);
        let minX = Math.min(...valoresX);
        let maxX = Math.max(...valoresX);

        let valoresY = path.map(obj => obj.y);
        let minY = Math.min(...valoresY);
        let maxY = Math.max(...valoresY);

        let middleX = (minX + maxX) / 2;
        let middleY = (minY + maxY) / 2;

        //const pathBody = this.matter.add.fromVertices(middleX, middleY ,[path], {isStatic: true});

        let vertices = path.map(point => [point.x, point.y]);

        // Decompor o polígono em partes convexas
        let convexPolygons = decomp.quickDecomp(vertices);

        // Criar um corpo composto a partir das partes convexas
        let compoundBody = this.matter.add.fromVertices(middleX, middleY, convexPolygons, {
            isStatic: true,
            render: {
                visible: false
            }
        });

        // Adicionar o corpo composto ao mundo Matter.js
        this.matter.world.add(compoundBody);

        // Adicionar paredes invisíveis ao redor do polígono
        convexPolygons.forEach(part => {
            this.matter.add.fromVertices(middleX, middleY, part, {
                isStatic: true,
                render: {
                    visible: true
                }
            });
        });
    

    }

        /*addPhysicsToPath(path) {
            if (path.length === 0) {
                console.error('Path is empty.');
                return;
            }
        
            let thickness = 25; // Ajuste a espessura conforme necessário
            let extendedVertices = [];
        
            for (let i = 0; i < path.length - 1; i++) {
                let p1 = path[i];
                let p2 = path[i + 1];
        
                // Calcula a direção do segmento de linha
                let angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
        
                // Calcula os pontos deslocados para criar espessura
                let offsetX = thickness * Math.cos(angle + Math.PI / 2);
                let offsetY = thickness * Math.sin(angle + Math.PI / 2);
        
                // Adiciona pontos deslocados para cima e para baixo
                extendedVertices.push({ x: p1.x - offsetX, y: p1.y - offsetY });
                extendedVertices.push({ x: p1.x + offsetX, y: p1.y + offsetY });
                extendedVertices.push({ x: p2.x - offsetX, y: p2.y - offsetY });
                extendedVertices.push({ x: p2.x + offsetX, y: p2.y + offsetY });
            }
        
            // Verifica se extendedVertices não está vazio
            if (extendedVertices.length === 0) {
                console.error('Extended vertices are empty.');
                return;
            }
        
            let valoresX = extendedVertices.map(obj => obj.x);
            let minX = Math.min(...valoresX);
            let maxX = Math.max(...valoresX);
        
            let valoresY = extendedVertices.map(obj => obj.y);
            let minY = Math.min(...valoresY);
            let maxY = Math.max(...valoresY);
        
            let middleX = (minX + maxX) / 2;
            let middleY = (minY + maxY) / 2;
        
            // Certifica-se de que os vértices estejam no formato correto
            let verticesArray = extendedVertices.map(v => [v.x, v.y]);
        
            try {
                const pathBody = this.matter.add.fromVertices(middleX, middleY, [verticesArray], { isStatic: true });
        
                // Adiciona o corpo à cena
                this.matter.world.add(pathBody);
                console.log('desenhou')
            } catch (error) {
                console.error('Error creating physics body from vertices:', error);
            }
        }*/
        
        

    update(){
        //this.car.setVelocityX(1);
    }
}