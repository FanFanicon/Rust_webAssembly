import init,{World,Direction} from 'wasm_game';

init().then(()=>{
    const CELL_SIZE=20;
    const TIME=1000;
    const GLOBAL_WIDTH=16;
    const position=Date.now()%(GLOBAL_WIDTH*GLOBAL_WIDTH);
    const world=World.new(GLOBAL_WIDTH,position);
    const worldWidth=world.width();
    const canvas=<HTMLCanvasElement>document.getElementById("snake-world");

    const context=canvas.getContext("2d");

    canvas.width=worldWidth*CELL_SIZE;
    canvas.height=worldWidth*CELL_SIZE;

    document.addEventListener("keydown",e=>{
        switch (e.code) {
            case "ArrowUp":
              world.change_snake_direction(Direction.Up)
              break;
              case "ArrowDown":
                world.change_snake_direction(Direction.Down)
                break;
              case "ArrowLeft":
                world.change_snake_direction(Direction.Left)
                break;
              case "ArrowRight":
                world.change_snake_direction(Direction.Right)
                break;
            default:
                break;
        }
    })

    function drawWorld() {
        context.beginPath();

        for (let x = 0; x < worldWidth+1; x++) {
            context.moveTo(CELL_SIZE*x,0);
            context.lineTo(CELL_SIZE*x,CELL_SIZE*worldWidth);            
        }

        for (let y = 0; y < worldWidth+1; y++) {
            context.moveTo(0,CELL_SIZE*y);
            context.lineTo(CELL_SIZE*worldWidth,CELL_SIZE*y);            
        }
        
        context.stroke();
    }

    function drawSnake(){
        const snake_index=world.snake_head_index();
        const row=Math.floor(snake_index/worldWidth);
        const col =snake_index%worldWidth;

        context.beginPath();

        context.fillRect(col*CELL_SIZE,row*CELL_SIZE,CELL_SIZE,CELL_SIZE)

        context.stroke();
    }


    function draw() {
        drawWorld();
        drawSnake();
    }

    function run() {
        setTimeout(() => {
            context.clearRect(0,0,canvas.width,canvas.width)
            world.update();
            draw();
            requestAnimationFrame(run);
        },TIME);
    }
   run();
})