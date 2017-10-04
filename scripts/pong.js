$(document).ready(function() {
    var pongTable = document.getElementById("pongTable");
    var pongTableContext = pongTable.getContext("2d");

    // create paddles
    var Paddle = function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 0;
    };

    Paddle.prototype.render = function() {
        pongTableContext.fillRect(this.x, this.y, this.width, this.height);
    };

    Paddle.prototype.move = function(speed) {
        this.speed = speed;
        this.y +=this.speed;
        if (this.y < 0) {
            this.y = 0
        } else if (this.y > 400) {
            this.y = 400
        }
    };

    var Player = function(paddle) {
        this.paddle = paddle;
    };

    Player.prototype.render = function() {
        this.paddle.render()
    };

    var Computer = function(paddle) {
        this.paddle = paddle;
    };

    Computer.prototype.render = function() {
        this.paddle.render()
    };

    Computer.prototype.update = function() {
        var distY = ball.y - this.paddle.y - this.paddle.height / 2;
        var compLevel = 1;
        this.speed = 0;
        if (distY > 40) {
            this.speed = compLevel;
        }   else if (distY < -40) {
            this.speed = -compLevel;
        }

        this.paddle.move(this.speed);
    };

    //continuosly render gameplay
    var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame  ||
    window.mozRequestAnimationFrame     ||
    window.oRequestAnimationFrame       ||
    window.msRequestAnimationFrame      ||
    function(callback)  { window.setTimeout(callback, 1000/60) };

    // create ball
    var Ball = function() {
        this.x = pongTable.width / 2;
        this.y = pongTable.height / 2;
        this.radius = 5;
        this.startAngle = 0;
        this.endAngle = 2 * Math.PI;
        this.counterClockwise = false;
        this.speed = 4;
        this.speedX = (Math.round(Math.random()) * 2 - 1) * (Math.random() * (this.speed - 3) + 3);
        this.speedY = (Math.round(Math.random()) * 2 - 1) * Math.sqrt(Math.pow(this.speed, 2) - Math.pow(this.speedX, 2));
    };

    Ball.prototype.render = function () {
        pongTableContext.beginPath();
        pongTableContext.arc(this.x, this.y, this.radius, this.startAngle, this.endAngle, this.counterClockwise);
        pongTableContext.lineWidth = 10;
        pongTableContext.strokeStyle = 'black';
        pongTableContext.stroke();
        pongTableContext.closePath();
    };

    Ball.prototype.move = function() {
        this.x += this.speedX;
        this.y += this.speedY;

        function resetBall(ball) {
            ball.x = pongTable.width / 2;
            ball.y = pongTable.height / 2;
            ball.speedX = (Math.round(Math.random()) * 2 - 1) * (Math.random() * (ball.speed - 3) + 3);
            ball.speedY = (Math.round(Math.random()) * 2 - 1) * Math.sqrt(Math.pow(this.speed, 2) - Math.pow(ball.speedX, 2));
        }

        // Points scored for collision against the wall
        if (this.x < 10) {
            resetBall(this)
        } else if (this.x > 850) {
            resetBall(this)
        }

        //collisions against the walls (bounce)
        if (this.y < 10) {
            this.y = 10;
            this.speedY *= -1;
        } else if (this.y > 540) {
            this.y = 540;
            this.speedY *= -1;
        }

        // player paddle back and forth
        function ballPaddleCollision(ball, paddle) {
            var distX = Math.abs(ball.x - paddle.x - paddle.width / 2);
            var distY = Math.abs(ball.y - paddle.y - paddle.height / 2);

            if (distX > (paddle.width / 2 + this.raidus)) {return false; }
            if (distY > (paddle.height / 2 + this.radius)) {return false; }

            if ((distX <= (paddle.width / 2)) && (distY <= (paddle.height /2))) {return true; }

            var dx = distX - paddle.width / 2;
            var dy = distY - paddle.height / 2;
            return (dx * dx + dy * dy <= (Math.pow(ball.radius, 2)));
        }

        if (ballPaddleCollision(this, player.paddle)) {
            this.x = 600;
            this.speedY *= Math.abs(this.y - player.paddle.y - player.paddle.height / 2) / 20;
            this.speedX *= -1;
        }else if (ballPaddleCollision(this, computer.paddle)) {
            this.x =30;
            thisspeedY *= Math.abs(this.y - computer.paddle.y - computer.paddle.height / 2) / 20;
            this.speedX *= -1;
        }
    };

    // Construct the three elements by creating new objects from the constructors: player,  computer, and ball

    var player = new Player(
        new Paddle(600, 200, 10, 80)
    );

    var computer = new Computer(
        new Paddle(10, 200, 10, 80)
    );

    var ball = new Ball();

    function step() {
        pongTableContext.clearRect(0, 0, 850, 550);
        ball.move();
        computer.update();
        player.render();
        computer.render();
        ball.render();
        animate(step);
    }

    step();

    window.addEventListener('keydown', function(event) {
        if (event.keyCode ===38) {
            player.paddle.move(-35);
        } else if (event.keyCode === 40) {
            player.paddle.move(35);
        }
    });
});