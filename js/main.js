//PIXI scene
"use strict";
const app = new PIXI.Application({
    width: 1200,
    height: 900
});
document.body.appendChild(app.view);

const sceneWidth = app.view.width;
const sceneHeight = app.view.height;


//variables
let stage = new PIXI.Container();
let startScene;
let gameScene;
let gameOverScene;

//label var
let scoreLabel;
let lifeLabel;
let levelLabel;
let gameOverScoreLabel;
let gameOverScoreLabelTwo;

//sound var
let shootSound;
let hitSound;
let fireballSound;
let deadSound;
let backgroundSound;

//arrays
let bullets = [];
let aliens = [];
let explosions = [];

//other var
let explosionTextures;
let score = 0;
let life = 100;
let levelNum = 1;
let paused = true;

// create a new Sprite using the texture
let texture = PIXI.Texture.from('images/assets/Main2.png');
let spaceMan = new PIXI.Sprite(texture);


//setup
function setup() {
    stage = app.stage;
    //Create the `start` scene
    startScene = new PIXI.Container();
    stage.addChild(startScene);

    //Create the main `game` scene and make it invisible
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);

    //Create the `gameOver` scene and make it invisible
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    // #4 - Create labels for all 3 scenes
    createLabelsAndButtons();

    //background
    let bg = PIXI.Texture.from('images/assets/Background.png')
    gameScene.addChild(new PIXI.Sprite(bg));

    //spaceMan = new Character();
    gameScene.addChild(spaceMan);

    //Load Sounds
    shootSound = new Howl({
        src: ['sounds/NFF-laser-gun.wav']
    });

    hitSound = new Howl({
        src: ['sounds/NFF-alien-react.wav']
    });

    fireballSound = new Howl({
        src: ['sounds/FireHit.wav']
    });

    deadSound = new Howl({
        src: ['sounds/Dead.wav']
    });

    backgroundSound = new Howl({
        src: ['sounds/Annihilate-Jeremy_Blake.mp3']
    });

    //Load sprite sheet
    explosionTextures = loadSpriteSheet();

    //Start update loop
    app.ticker.add(gameLoop);
}

function createLabelsAndButtons() {
    let buttonStyle = new PIXI.TextStyle({
        align: "center",
        fill: 0xFF0000,
        fontSize: 20,
        fontFamily: "Press Start 2P"  //Verdena or Futura before
    });

    //StartScene
    let startLabel1 = new PIXI.Text("Alien Survival");
    startLabel1.style = new PIXI.TextStyle({
        align: "center",
        fill: 0xFFFFFF,
        fontSize: 50,  //centered
        fontFamily: 'Press Start 2P', //Verdena or Futura before
        stroke: 0xFF0000,
        strokeThickness: 6
    });
    startLabel1.x = 220;
    startLabel1.y = 300;
    startScene.addChild(startLabel1);

    //Start button
    let startButton = new PIXI.Text("Fight off the Enemies!");
    startButton.style = buttonStyle;
    startButton.x = 340;
    startButton.y = sceneHeight - 380;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on('pointerover', e => e.target.alpha = 0.7);
    startButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    startScene.addChild(startButton);

    //game over text
    let gameOverText = new PIXI.Text("Game Over!");
    let goStyle = new PIXI.TextStyle({
        align: "center",
        fill: 0xFFFFFF,
        fontSize: 60,
        fontFamily: "Press Start 2P",
        stroke: 0xFF0000,
        strokeThickness: 6
    });

    gameOverText.style = goStyle;
    gameOverText.x = 300;
    gameOverText.y = sceneHeight / 2 - 160;
    gameOverScene.addChild(gameOverText);

    //Final Score
    gameOverScoreLabel = new PIXI.Text("Your final score: " + score);
    let textStyle = new PIXI.TextStyle({
        align: "center",
        fill: 0xFF0000,
        fontSize: 20,
        fontFamily: "Press Start 2P",
        stroke: 0xFFFFFF,
        strokeThickness: 1
    });
    gameOverScoreLabel.style = textStyle;
    gameOverScoreLabel.x = 400;
    gameOverScoreLabel.y = 430;

    //Final LevelNum
    gameOverScoreLabelTwo = new PIXI.Text("You survived: " + levelNum + " stages");
    let levelStyle = new PIXI.TextStyle({
        align: "center",
        fill: 0xFF0000,
        fontSize: 20,
        fontFamily: "Press Start 2P",
        stroke: 0xFFFFFF,
        strokeThickness: 1
    });
    gameOverScoreLabelTwo.style = levelStyle;
    gameOverScoreLabelTwo.x = 360;
    gameOverScoreLabelTwo.y = 470;

    //make "play again?" button
    let playAgainButton = new PIXI.Text("Play Again?");
    playAgainButton.style = buttonStyle;
    playAgainButton.x = 500;
    playAgainButton.y = sceneHeight - 300;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup", startGame); // startGame is a function reference
    playAgainButton.on('pointerover', e => e.target.alpha = 0.7); // concise arrow function with no brackets
    playAgainButton.on('pointerout', e => e.currentTarget.alpha = 1.0); // ditto
    gameOverScene.addChild(playAgainButton);
    gameOverScene.addChild(gameOverScoreLabel);
    gameOverScene.addChild(gameOverScoreLabelTwo);
}


//Game Scene
function startGame() {
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
    levelNum = 1;
    score = 0;
    life = 100;
    spaceMan.x = 550;
    spaceMan.y = 480;
    backgroundSound.play();

    let textStyle = new PIXI.TextStyle({
        fill: 0xFFFFFF,
        fontSize: 18,
        fontFamily: "Press Start 2P",
        stroke: 0xFF0000,
        strokeThickness: 4
    });

    //score
    scoreLabel = new PIXI.Text();
    scoreLabel.style = textStyle;
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);

    //life
    lifeLabel = new PIXI.Text();
    lifeLabel.style = textStyle;
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);

    //level
    levelLabel = new PIXI.Text();
    levelLabel.style = textStyle;
    levelLabel.x = 1020;
    levelLabel.y = 5;
    gameScene.addChild(levelLabel);
    levelCounter(1);

    loadLevel();

}


//------------------------------------------------interface------------------------------------------------
//interface
function increaseScoreBy(value) {
    score += value;
    scoreLabel.text = `Score: ${score}`;
}
//interface
function decreaseLifeBy(value) {
    life -= value;
    life = parseInt(life);
    lifeLabel.text = `Life: ${life}%`;
}

function levelCounter(value) {
    levelLabel.text = 'Stage: ' + levelNum;
    levelNum++;
}


//------------------------------------------------functionality------------------------------------------------
function gameLoop() {
    if (paused) return; // keep this commented out for now

    // Calculate "delta time"
    let dt = 1 / app.ticker.FPS;
    if (dt > 1 / 12) dt = 1 / 12;

    //Move Bullets
    for (let b of bullets) {
        b.move(dt);
    }

    //aliens move
    for (let c of aliens) {
        c.move(dt);
        if (c.x <= c.radius || c.x >= sceneWidth - c.radius) {
            c.reflectX(sceneWidth);
            //c.move(dt);
        }

        if (c.y <= c.radius || c.y >= sceneHeight - c.radius) {
            c.reflectY(sceneHeight);
            //c.move(dt);
        }
    }


    //Check for Collisions
    for (let c of aliens) {
        for (let b of bullets) {
            if (rectsIntersect(c, b)) {
                fireballSound.play();
                createExplosion(c.x, c.y, 64, 64);
                gameScene.removeChild(c);
                c.isAlive = false;
                gameScene.removeChild(b);
                b.isAlive = false;
                increaseScoreBy(1);
            }
        }

        if (c.isAlive && rectsIntersect(c, spaceMan)) {
            hitSound.play();
            gameScene.removeChild(c);
            c.isAlive = false;
            decreaseLifeBy(20);
        }
    }

    // #6 - Now do some clean up
    bullets = bullets.filter(b => b.isAlive);

    aliens = aliens.filter(c => c.isAlive);

    explosions = explosions.filter(e => e.playing);

    //game over?
    if (life <= 0) {
        deadSound.play();
        end();
        return;
    }

    //Load next level
    if (aliens.length == 1) {
        levelNum++;
        loadLevel();
    } 
}


// center the sprite's anchor point
spaceMan.anchor.x = 0.5;
spaceMan.anchor.y = 0.5;

// move the sprite to the center of the screen
spaceMan.position.x = 360;
spaceMan.position.y = 280;

//interactive container
app.stage.interactive = true;
app.stage.hitArea = new PIXI.Rectangle(0, 0, app.renderer.width / app.renderer.resolution, app.renderer.height / app.renderer.resolution);
app.stage.on('mousedown', mouseDown);

//current vars based on current rotation 
function mouseDown() {
    fireBullet(spaceMan.rotation, {
        x: spaceMan.position.x + Math.cos(spaceMan.rotation) * 20,
        y: spaceMan.position.y + Math.sin(spaceMan.rotation) * 20
    });
}

//bullets firing
let bulletSpeed = 8;

function fireBullet(rotation, startPosition) {
    if (paused) return;

    let bullet = new Bullet();

    bullet.position.x = startPosition.x;
    bullet.position.y = startPosition.y;

    bullet.rotation = rotation;
    app.stage.addChild(bullet);
    bullets.push(bullet);

    gameScene.addChild(bullet);
    shootSound.play();
}

//rotation
function rotateToPoint(mx, my, px, py) {
    let self = this;
    let dist_Y = my - py;
    let dist_X = mx - px;
    let angle = Math.atan2(dist_Y, dist_X);
    //let degrees = angle * 180/ Math.PI;
    return angle;
}

// start animating
animate();
//rotate character and bullet
function animate() {
    requestAnimationFrame(animate);

    // rotate spaceman
    spaceMan.rotation = rotateToPoint(app.renderer.plugins.interaction.mouse.global.x, app.renderer.plugins.interaction.mouse.global.y, spaceMan.position.x, spaceMan.position.y);

    for (let b = bullets.length - 1; b >= 0; b--) {
        bullets[b].position.x += Math.cos(bullets[b].rotation) * bulletSpeed;
        bullets[b].position.y += Math.sin(bullets[b].rotation) * bulletSpeed;
    }
    // render the container
    app.render(stage);
}

//creating homing aliens
function createAliens(numAliens) {

    //top aliens
    for (let i = 0; i < numAliens / 3; i++) {
        let c = new SeekingEnemy(5, 0xFF0000);
        c.x = Math.random() * (sceneWidth - 50) + 25;
        c.y = Math.random() * (-sceneHeight - 500) + 25;
        c.speed = 60 + (levelNum * 2);
        c.activate(spaceMan);
        aliens.push(c);
        gameScene.addChild(c);
    }

    for (let i = 0; i < numAliens / 3; i++) {
        let c = new SeekingEnemy(5, 0xFF0000);
        c.x = Math.random() * (sceneWidth - 60) + 25;
        c.y = Math.random() * (-sceneHeight - 400) + 25;
        c.speed = 60 + (levelNum * 2);
        c.activate(spaceMan);
        aliens.push(c);
        gameScene.addChild(c);
    }

    //bottom aliens
    for (let i = 0; i < numAliens / 3; i++) {
        let c = new SeekingEnemy(5, 0xFF0000);
        c.x = Math.random() * (sceneWidth - 20) ;
        c.y = Math.random() * (sceneHeight +4000) ;
        c.speed = 20 + (levelNum * 2);
        c.rotation = 170;
        c.activate(spaceMan);
        aliens.push(c);
        gameScene.addChild(c);
    }

    for (let i = 0; i < numAliens / 3; i++) {
        let c = new SeekingEnemy(5, 0xFF0000);
        c.x = Math.random() * (sceneWidth - 30) ;
        c.y = Math.random() * (sceneHeight + 4500) ;
        c.speed = 20 + (levelNum * 2);
        c.rotation = 170;
        c.activate(spaceMan);
        aliens.push(c);
        gameScene.addChild(c);
    }
}

//add mroe aliens every time a level loads
function loadLevel() {
    createAliens(levelNum * 5);
    paused = false;
}


//transitions to the new screen, and empties out all of the arrays
function end() {
    paused = true;
    aliens.forEach(c => gameScene.removeChild(c));
    aliens = [];

    bullets.forEach(b => gameScene.removeChild(b));
    bullets = [];

    explosions.forEach(e => gameScene.removeChild(e));
    explosions = [];

    gameOverScoreLabel.text = "Your final score: " + score;
    gameOverScene.visible = true;
    gameScene.visible = false;
    backgroundSound.stop();
}


//Explosions loader
function loadSpriteSheet() {
    let spriteSheet = PIXI.BaseTexture.from("images/assets/explosions.png");
    let width = 64;
    let height = 64;
    let numFrames = 16;
    let textures = [];
    for (let i = 0; i < numFrames; i++) {
        let frame = new PIXI.Texture(spriteSheet, new PIXI.Rectangle(i * width, 64, width, height));
        textures.push(frame);
    }
    return textures;
}


//create explosions
function createExplosion(x, y, frameWidth, frameHeight) {
    let w2 = frameWidth / 2;
    let h2 = frameHeight / 2;
    let expl = new PIXI.AnimatedSprite(explosionTextures);
    expl.x = x - w2;
    expl.y = y - h2;
    expl.animationSpeed = 1 / 7;
    expl.loop = false;
    expl.onComplete = e => gameScene.removeChild(expl);
    explosions.push(expl);
    gameScene.addChild(expl);
    expl.play();
}