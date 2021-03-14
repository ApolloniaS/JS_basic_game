var canvas = document.getElementById("cadre");

var ctx = canvas.getContext('2d');
//ctx = context qui est un objet pour faire des graphique avec l'élément canvas - on doit spécifier avec quel type de dimensions on joue

let screenWidth = 1000;
let screenHeight = 500;
const side = 50;
var gameOn = true;
var isRightKeyPressed = false;
var isLeftKeyPressed = false;

class GameChar {
    constructor(x, y, h, l, color, speed)
    {
        this.x = x;
        this.y = y;
        this.h = h;
        this.l = l;
        this.color = color;
        this.speed = speed;
        this.maxSpeed = 4;
    }
    moveV()
    {
        if(this.y > screenHeight - 100 || this.y < 50)
        {
            this.speed = -this.speed;

        }
        this.y += this.speed;
        
    }

    moveH()
    {
        if(this.x > screenWidth - 50 || this.x < 0)
        {
            this.speed = -this.speed;
        }
        this.x += this.speed;
    }
}

/* var rectangle = new GameChar(50, 50, 50, 50, "rgb(0,0,255)"); //color on peut faire RDB mais on doit le mettre dans une string
var rectangle2 = new GameChar(250, 400, 50, 50, "rgb(0, 255, 0");
var rectangle3 = new GameChar(550, 50, 50, 50, "rgb(255, 255, 255)");
var rectangle4 = new GameChar(800, 400, 50, 50, "rgb(0, 0, 0)");
//on peut créer tout séparément ou faire un array */

var sprites = {};

var loadSprites = function() {
    sprites.player = new Image();
    sprites.player.src = 'images/hero.png';
            
    sprites.background = new Image();
    sprites.background.src = 'images/floor.png';
            
    sprites.enemy = new Image();
    sprites.enemy.src = 'images/enemy.png';
            
    sprites.goal = new Image();
    sprites.goal.src = 'images/chest.png';
};

var opponents = 
[
    new GameChar(100, 250, side, side, "rgb(0,0,255)", 2),
    new GameChar(300, 300, side, side, "rgb(0, 255, 0", 3), //tout coder en dur mais on pourrait dire screenWidth - 100 plutôt que de calculer manuellement
    new GameChar(600, 50, side, side, "rgb(255, 255, 255)", 4),
    new GameChar(850, 400, side, side, "rgb(0, 0, 0)", 5),
];

var heros = new GameChar(0, 225, side, side, "rgb(42, 42, 42)", 0);

var objectif = new GameChar(950, 225, side, side, "rgb(255,255,0", 0); //screenWidth - width



document.onkeydown = function(event) 
{
    switch(event.key) {
        case "ArrowRight":
            isRightKeyPressed = true;
            heros.speed = heros.maxSpeed;
            break;
        case "ArrowLeft":
            isLeftKeyPressed = true;
            heros.speed = -heros.maxSpeed;
            break;
    }
}

document.onkeyup = function(event)
{
    switch(event.key){
    case "ArrowRight":
        isRightKeyPressed = false;
        if(isLeftKeyPressed){
            heros.speed = -heros.maxSpeed;
        } else {
            heros.speed = 0;
        }
        break;
    case "ArrowLeft":
        isLeftKeyPressed = false;
        if(isRightKeyPressed){
            heros.speed = -heros.maxSpeed;
        } else {
            heros.speed = 0;
        }
        break;

    }
        
}

var checkCollisions = function(rect1, rect2)
{
    var collisionX = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.l, rect2.l); //math.abs retourne une value absolue; on retourne la différence entre les deux objets
    var collisionY = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.l, rect2.l);
    return collisionX && collisionY;
}

/* mieux mais à recheck: 
var checkCollisions = function(rect1, rect2) {
    let rect1x2 = rect1.x + rect1.width;
    let rect2x2 = rect2.x + rect2.width;
    let rect1y2 = rect1.y + rect1.height;
    let rect2y2 = rect2.y + rect2.height;
    
    return rect1.x < rect2x2 && rect1x2 > rect2.x && rect1.y < rect2y2 && rect1y2 > rect2.y; 
} */

/* var draw = function() //dessine les persos sous forme de carrés
{
    ctx.clearRect(0, 0, screenWidth, screenHeight); //nettoie l'écran à chaque frame ; clearRect comme à x y et va jusque x1 et y1 
    /* ctx.fillStyle = rectangle.color; 
    ctx.fillRect(rectangle.x, rectangle.y, rectangle.l, rectangle.h); //styliser l'obj en JS

    ctx.fillStyle = rectangle2.color;
    ctx.fillRect(rectangle2.x, rectangle2.y, rectangle2.l, rectangle2.h);

    ctx.fillStyle = rectangle3.color;
    ctx.fillRect(rectangle3.x, rectangle3.y, rectangle3.l, rectangle3.h);

    ctx.fillStyle = rectangle4.color;
    ctx.fillRect(rectangle4.x, rectangle4.y, rectangle4.l, rectangle4.h); ennemi un par un, ou tous ensemble :*/

    /*opponents.forEach(function(element)
    {
        ctx.fillStyle = element.color;
        ctx.fillRect(element.x, element.y, element.l, element.h);
        
    });
    //pour les carrés
    ctx.fillStyle = heros.color;
    ctx.fillRect(heros.x, heros.y, heros.l, heros.h);
    ctx.fillStyle = objectif.color;
    ctx.fillRect(objectif.x, objectif.y, objectif.l, objectif.h); idem

} */


var draw = function() { //avec les sprites
    ctx.clearRect(0, 0, screenWidth, screenHeight);
            
    ctx.drawImage(sprites.background, 0, 0);
    ctx.drawImage(sprites.player, heros.x, heros.y);
    ctx.drawImage(sprites.goal, objectif.x, objectif.y);
 
    opponents.forEach(function(element){
        ctx.drawImage(sprites.enemy, element.x, element.y)
    });
}

var update = function() //appelle le mvt
{ 
    /* opponents[0].moveV(); un mouvement à la fois*/
    
    heros.moveH();
    if(checkCollisions(heros, objectif))
    {
        endGame("Woop woop !");
    }

    opponents.forEach(function(element)
    {
        if(checkCollisions(heros, element)){
            endGame("Nooooooo ~ !")
        }
        element.moveV();
    });
}

var endGame = function(text){
    gameOn = false;
    alert(text);
    window.location = ""; //renvoi vers une autre page
}

//création de la "boucle de jeu" --> colision, mvt, update etc.
var step = function(){
    update();
    draw();
    
    if(gameOn){
        window.requestAnimationFrame(step); //crée la frame suivante, simule le comportement d'une boucle, prend un callback en arg
    }
}

loadSprites();
step();