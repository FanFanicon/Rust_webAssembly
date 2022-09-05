import init,{World,Direction,GameStatus} from 'wasm_game';
import { wasm } from 'webpack';
import {random} from './utils/random'

init().then(wasm=>{
    const CELL_SIZE=20;
    const TIME=1000;
    const GLOBAL_WIDTH=16;
    const position=random(GLOBAL_WIDTH*GLOBAL_WIDTH);
    const world=World.new(GLOBAL_WIDTH,position);
    const worldWidth=world.width();

    const gameSataus=document.getElementById("game-status");
    const gameControl=document.getElementById("game-control-btn")
    const canvas=<HTMLCanvasElement>document.getElementById("snake-world");

    const context=canvas.getContext("2d");

    canvas.width=worldWidth*CELL_SIZE;
    canvas.height=worldWidth*CELL_SIZE;

    gameControl.addEventListener("click",()=>{
        const status=world.game_status();
        if(status===undefined){
           gameControl.textContent="游戏中...";
           world.start_game();
           run();
        }else{
            location.reload();
        }
    })

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
    function drawStaus(){
        gameSataus.textContent=world.game_status_info();
    }

    function drawSnake(){
        const snakeCells=new Uint32Array(
          wasm.memory.buffer,
          world.snake_cell(),
          world.snake_length(),
        )
        snakeCells.forEach((cellIndex,i)=>{
          const col=cellIndex % worldWidth;
          const row=Math.floor(cellIndex/worldWidth);
          context.beginPath();
          context.fillStyle=i===0?'#ccc':"#000";
          context.fillRect(col*CELL_SIZE,row*CELL_SIZE,CELL_SIZE,CELL_SIZE);
        })
        context.stroke();
    }
    function drawReward(){
        const index=world.reward_cell();
        const row=Math.floor(index/worldWidth);
        const col =index%worldWidth;

        context.beginPath();
        context.fillStyle='#ff0000';

        context.fillRect(col*CELL_SIZE,row*CELL_SIZE,CELL_SIZE,CELL_SIZE)

        context.stroke();

       
    }


    function draw() {
        drawWorld();
        drawSnake();
        drawReward();
        drawStaus();
    }

    function run() {
        const status=world.game_status();
        if(status==GameStatus.Lost || GameStatus.Won){
           gameControl.textContent="再来一次";
        }
        setTimeout(() => {
            context.clearRect(0,0,canvas.width,canvas.width)
            world.update();
            draw();
            requestAnimationFrame(run);
        },TIME);
    }
    draw();
})