$(document).ready(function() {
    var pongTable = document.getElementById("pongTable");
    var pongTableContext = pongTable.getContext("2d");
    var playerScore = 0;
    var computerScore = 0;
    var endGameScore = 11;
    
    var playerScoreDisplay = document.getElementById("playerScoreDisplay");
    var computerScoreDisplay = document.getElementById("computerScoreDisplay");

    //continuosly render gameplay
    var animate = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame  ||
        window.mozRequestAnimationFrame     ||
        window.oRequestAnimationFrame       ||
        window.msRequestAnimationFrame      ||
    function(callback)  { window.setTimeout(callback, 1000/60) };

    var pongTable = document.getElementById('pongTable');
    var width = 850;
    var height = 550;
    pongTable.width = width;
    pongTable.height = height;
    var context = pongTable.getContext('2d');
    
    // create paddles
    var Paddle = function(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
    };

    Paddle.prototype.render = function() {
        pongTableContext.fillRect(this.x, this.y, this.width, this.height);
    };

    Paddle.prototype.move = function(speed) {
        this.speed = speed;
        this.y +=this.speed;
        if (this.y < 0) {
            this.y = 0
        } else if (this.y > 450) {
            this.y = 550
        }
    };

    var Player = function(paddle) {
        this.paddle = paddle;
    };

    var Computer = function(paddle) {
        this.paddle = paddle;
    };

    Player.prototype.render = function() {
        this.paddle.render()
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
            playerScore++;
            playerScoreDisplay.innerHTML = "Player Score: " + playerScore;
            resetBall(this)
        } else if (this.x > 850) {
            computerScore++;
            computerScoreDisplay.innerHTML = "Computer Score: " + computerScore;
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
        new Paddle(830, 200, 10, 80)
    );

    var computer = new Computer(
        new Paddle(10, 200, 10, 80)
    );

    var ball = new Ball();

    function displayMessage() {
        if (computerScore === endGameScore) {
            pongTableContext.font = 'bold 35pt Helvetica';
            pongTableContext.fillText('You Lost', 320, 200);
            pongTableContext.font = 'bold 20pt Helvetica';
            pongTableContext.fillText('Want to play again?  Refresh the page to start a new game.', 70, 330);
        } else if (computerScore === endGameScore) {
            pongTableContext.font = 'bold 35pt Helvetica';
            pongTableContext.fillText('You Won', 320, 200);
            pongTableContext.font = 'bold 20pt Helvetica';
            pongTableContext.fillText('Want to play again?  Refresh the page to start a new game.', 70, 330);
        }
    }

    function step() {
        pongTableContext.clearRect(0, 0, 850, 550);
        displayMessage();
        player.render();
        computer.render();
        ball.render();
        if (computerScore < endGameScore && playerScore < endGameScore) {
            ball.move ();
            computer.update();
            animate(step);
        }
    }

    animate(step);
    computerScoreDisplay.innerHTML = "Computer score: " + computerScore;
    playerScoreDisplay.innerHTML = "Player Score: " + playerScore;

    window.addEventListener('keydown', function(event) {
        if (event.keyCode ===38) {
            player.paddle.move(-35);
        } else if (event.keyCode === 40) {
            player.paddle.move(35);
        }
    });
});
