//SpaceMan
class Character extends PIXI.Sprite {
    constructor(x = 0, y = 0) {
        super(app.loader.resources["images/assets/Main.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(0.1);
        this.x = x;
        this.y = y;
    }
}

//Alien
class Enemy extends PIXI.Sprite {
    constructor(x = 0, y = 0, rotation = 0) {
        super(app.loader.resources["images/assets/Alien2.png"].texture);
        this.anchor.set(.5, .5);
        this.scale.set(1.1);
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.fwd = getRandomUnitVector();
        this.speed = 50;
        this.isAlive = true;
    }

    // abstract method - declared, but no implementation
    activate() {

    }

    // public methods to be called from main.js
    move(dt = 1 / 60) {
        this.x += this.fwd.x * this.speed * dt;
        this.y += this.fwd.y * this.speed * dt;
    }

    // protected methods
    _wrapX(sceneWidth) {
        if (this.fwd.x < 0 && this.x < 0 - this.radius) {
            this.x = sceneWidth + this.radius;
        }
        if (this.fwd.x > 0 && this.x > sceneWidth + this.radius) {
            this.x = 0 - this.radius;
        }
    }

    _wrapY(sceneHeight) {
        if (this.fwd.y < 0 && this.y < 0 - this.radius) {
            this.y = sceneHeight + this.radius;
        }
        if (this.fwd.y > 0 && this.y > sceneHeight + this.radius) {
            this.y = 0 - this.radius;
        }
    }

    _chase(dt) {
        let t = this.target;
        let amt = 3.0 * dt;
        let newX = cosineInterpolate(this.x, t.x, amt);
        let newY = cosineInterpolate(this.y, t.y, amt);
        this.x = newX;
        this.y = newY;
    }
}

//homing Alien
class SeekingEnemy extends Enemy {
    activate(target) {
        this.target = target;
    }

    move(dt) {
        super._chase(dt);
    }
}


//bullet
class Bullet extends PIXI.Sprite {
    // constructor(team = 0, x = 0, y = 0, dirX, dirY, spd, b = 0) {
    constructor(team = 0, x = 0, y = 0, b) {
        super(app.loader.resources["images/assets/Battery2.png"].texture);
        this.anchor.set(0.5, 0.5);
        this.scale.set(0.9);
        this.radius = 0;
        this.x = x;
        this.y = y;
        this.speed = 400;
        this.isAlive = true;
        this.team = team;
    }
    
    move(dt = 1 / 60) {
        if (this.hasOwnProperty("direction")) {
            this.x += this.direction.x * this.speed * dt;
            this.y += this.direction.y * this.speed * dt;
        }
    }
}
