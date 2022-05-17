const body = document.querySelector("body");

const board = document.getElementById("board");
const board_size = 800;
board.style.width = board_size +"px";
board.style.height = board_size +"px";

const snake = [];
const snakehead = document.getElementById("snakehead");
const snakehead_pos = {x:board_size/2, y:board_size/2}
const snake_part_size = 40;
snakehead.style.width = snake_part_size + "px";
snakehead.style.height = snake_part_size + "px";
snakehead.style.top = snakehead_pos.y + "px";
snakehead.style.left = snakehead_pos.x + "px";

const fruit_colors = ["red", "yellow", "purple", "green"];
const user_input = {up_key:false, down_key:false, left_key:false, right_key:false}

var fruit = true;
var game_speed = 1000/7;
var snake_speed = snake_part_size;

function main()
{
    document.getElementById("startpage").style.display = "none";
    board.style.display = "block";

    //set user input
    document.addEventListener('keydown', (e) =>{
        const keycodes = [37, 38, 39, 40];
        if(keycodes.includes(e.keyCode) == true)
        {
            for(key in user_input){user_input[key] = false;};
        };
        switch(e.keyCode) {
            case 37:user_input.left_key = true;break; //left keybreak
            case 38:user_input.up_key = true;break;//up keybreak
            case 39:user_input.right_key = true;break;//right key
            case 40:user_input.down_key = true;break;//down key
        };
    });

    //random start direction
    switch(Math.floor(Math.random() * 4) +1){
        case 1:user_input.up_key = true;break;
        case 2:user_input.down_key = true;break;
        case 3:user_input.left_key = true;break;
        case 4:user_input.right_key = true;break;
    };

    //mainloop
    interval = setInterval(function()
    {
        let last_pos = move_snakehead();
        move_snake_parts(last_pos);
        spawn_fruit();
        snakehead_on_fruit_position();
    }, game_speed);
};

function move_snakehead()
{
    let pos = {x:snakehead_pos.x, y:snakehead_pos.y}

    if(user_input.left_key == true)
    {
        snakehead_pos.x = snakehead_pos.x - snake_speed;
        snakehead.style.left = snakehead_pos.x + "px";
    };
    if(user_input.right_key == true)
    {
        snakehead_pos.x = snakehead_pos.x + snake_speed;
        snakehead.style.left = snakehead_pos.x + "px";
    };
    if(user_input.up_key == true)
    {
        snakehead_pos.y = snakehead_pos.y - snake_speed;
        snakehead.style.top = snakehead_pos.y + "px";
    };
    if(user_input.down_key == true)
    {
        snakehead_pos.y = snakehead_pos.y + snake_speed;
        snakehead.style.top = snakehead_pos.y + "px";
    };
    death();
    return pos;
};

function move_snake_parts(pos)
{
    let pos_last_snake_part;
    snake.forEach(element => {
        let i = snake.indexOf(element);
        if(i > 0)
        {
            let pos = {x:parseInt(element.style.left), y:parseInt(element.style.top)};
            element.style.left = pos_last_snake_part.x + "px";
            element.style.top = pos_last_snake_part.y + "px";
            pos_last_snake_part = pos;
        }
        else
        {
            pos_last_snake_part = {x:parseInt(element.style.left), y:parseInt(element.style.top)};
            element.style.left = pos.x + "px";
            element.style.top = pos.y + "px";
        };
    });
};

function spawn_fruit()
{
    if(fruit == true)
    {
        let rng;
        fruit = document.createElement("div");
        fruit.style.width = snake_part_size + "px";
        fruit.style.height = snake_part_size + "px";

        rng = Math.floor(Math.random() *(board_size - snake_part_size)) +0;
        fruit.style.top = Math.round(rng/snake_part_size) *snake_part_size + "px";

        rng = Math.floor(Math.random() *(board_size - snake_part_size)) +0;
        fruit.style.left = Math.round(rng/snake_part_size) *snake_part_size + "px";
       
        fruit.style.position = "absolute";

        rng = Math.floor(Math.random() *fruit_colors.length) +0;
        fruit.style.backgroundColor = fruit_colors[rng];
        board.append(fruit);
    };
};

function snakehead_on_fruit_position()
{
    if (snakehead_pos.y == parseInt(fruit.style.top) && 
        snakehead_pos.x == parseInt(fruit.style.left))
    {
        fruit.remove();
        fruit = true;
        create_new_snake_part();
    };
};

function create_new_snake_part()
{
    snake_part = document.createElement("div");
    snake_part.setAttribute("class","snake");
    snake_part.style.width = snake_part_size +"px";
    snake_part.style.height = snake_part_size +"px";
    snake_part.style.top = snakehead_pos.y + "px";
    snake_part.style.left = snakehead_pos.x + "px";
    snake.push(snake_part);
    board.append(snake_part);
};

function death()
{
    let death_position = {a:board_size, b:0-snake_part_size}
    let a;
    
    switch(snakehead_pos.y){
        case death_position.a: a = true; break;
        case death_position.b: a = true; break;
    };
    
    switch(snakehead_pos.x){
        case death_position.a: a = true; break;
        case death_position.b: a = true; break;
    };

    snake.forEach(element => {
        let x = parseInt(element.style.left);
        let y = parseInt(element.style.top);
        if(snakehead_pos.y == y && snakehead_pos.x == x) a = true;
    });

    if(a == true) create_message() ,clearInterval(interval);
};

function create_message()
{
    let message = document.createElement("h1");
    message.innerHTML = "You Lose";
    message.style.color = "red";
    message.style.position = "absolute";
    message.style.fontFamily = "monospace";
    body.append(message);
};