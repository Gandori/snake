var body = document.querySelector("body");

var board = document.getElementById("board");
var board_size = 500;
board.style.width = board_size +"px";
board.style.height = board_size +"px";

var snake = [];
var snakehead;
var snakehead_pos;
create_snakehead();

var fruit_colors = ["red", "yellow", "purple", "green"];
var user_input = {up_key:false, down_key:false, left_key:false, right_key:false}

var score = 0;
var time = [0,0,0];
var last_direction;
var fruit = true;
var game_speed = 1000/5;
var snake_part_size;
var snake_speed = snake_part_size;

var game_interval;
var time_interval;

function main()
{
    var startpage = document.getElementById("startpage")
    startpage.style.transition = "margin 1s";
    startpage.style.marginLeft = "-5000px";

    var board_container = document.getElementById("board_container");
    board_container.style.transition = "margin 1s";
    board_container.style.marginLeft = "0px";

    setTimeout(() => {
       game_loop();
    }, 2000);
};

function game_loop()
{
    document.addEventListener("keydown", input =>test(input));
    random_start_direction();
    game_interval = setInterval(() => {
        let last_pos = move_snakehead();
        move_snake_parts(last_pos);
        spawn_fruit();
        snakehead_on_fruit_position();
        increase_score();           
    }, game_speed);    
    time_interval = setInterval(increase_time, 1000/60);
};

function test(input)
{
    var e = input;
    var keycodes = [37, 38, 39, 40];
    if(keycodes.includes(e.keyCode) == true)
    {
        for(key in user_input){user_input[key] = false;};
    };
    switch(e.keyCode) {
        case 37: //left key
            if(last_direction==39){user_input.right_key=true;break;};
          user_input.left_key = true;last_direction=37;break;
        case 38: //up key
            if(last_direction==40){user_input.down_key=true;break;};
            user_input.up_key=true;last_direction=38;break;
        case 39: //right key
            if(last_direction==37){user_input.left_key=true;break;};
            user_input.right_key=true;last_direction=39;break;
        case 40: //down key
            if(last_direction==38){user_input.up_key=true;break;};
            user_input.down_key=true;last_direction=40;break;
   };
};

function create_snakehead()
{
    snakehead = document.createElement("div");
    snakehead.setAttribute("id","snakehead");
    snake_part_size = board_size/20;
    snakehead_pos = {x:board_size/2, y:board_size/2}
    snakehead.style.width = snake_part_size + "px";
    snakehead.style.height = snake_part_size + "px";
    snakehead.style.top = snakehead_pos.y + "px";
    snakehead.style.left = snakehead_pos.x + "px";
    snakehead.style.position = "absolute";
    snakehead.style.backgroundColor = "rgb(100,100,200)";
    snakehead.style.zIndex = "3";
    board.append(snakehead);
};

function increase_score()
{
    var label = document.getElementById("score");
    label.innerHTML = "Score: " + score;
};

function increase_time()
{
    var label = document.getElementById("time");
    time[2]++;
    if(time[2] == 60)
    {
        time[2] = 0;
        time[1]++;
    };
    if(time[1] == 60)
    {
        time[1] = 0;
        time[0]++;
    };
    label.innerHTML = "Score: " + time.toString().replace(",", ".").replace(",", ".");
};

function random_start_direction()
{
    var rng = Math.floor(Math.random() *4) + 1;
    switch(rng)
    {
        case 1:
            user_input.left_key=true;
            last_direction=37;
            break;
        case 2:
            user_input.up_key=true;
            last_direction=38;
            break;
        case 3:
            user_input.right_key=true;
            last_direction=39;
            break;
        case 4:
            user_input.down_key=true;
            last_direction=40;
            break;
    };
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
        score++;
    };
};

function create_new_snake_part()
{
    let snake_part = document.createElement("div");
    snake_part.setAttribute("class","snake");
    snake_part.style.backgroundColor = "rgb(200,200,200)";
    snake_part.style.position = "absolute";
    snake_part.style.zIndex = "3";
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
        case death_position.a: a = true; break; //bottom board
        case death_position.b: a = true; break; //top board
    };

    switch(snakehead_pos.x){
        case death_position.a: a = true; break; //right board
        case death_position.b: a = true; break; //left board
    };

    snake.forEach(element => { //snakehead on snakepart position
        let x = parseInt(element.style.left);
        let y = parseInt(element.style.top);
        if(snakehead_pos.y == y && snakehead_pos.x == x) a = true;
    });

    if(a == true)
    {
        create_message(); 
        clearInterval(game_interval);
        clearInterval(time_interval)
    };
};

function create_message()
{
    let msg_container = document.createElement("div");
    msg_container.setAttribute("id", "msg_container");

    body.append(msg_container);

    let msg = document.createElement("h1");
    msg.innerHTML = "You Lose";
    msg_container.append(msg);

    let btn = document.createElement("button");
    btn.innerHTML = "Retry";
    btn.setAttribute("onclick", "window.location.reload()");
    msg_container.append(btn);
};

function retry()
{
    score = 0;
    time = [0,0,0];
    clearInterval(game_interval);
    clearInterval(time_interval)
    document.getElementById("msg_container").remove();
    game_loop();
    while(board.firstChild)
    {
        board.firstChild.remove();
    };
};