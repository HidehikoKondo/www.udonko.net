//初期化
enchant();
//ゲーム画面
var game = new Core(640, 640);
//FPS
game.fps = 60;
//背景色
game.rootScene.backgroundColor = "silver";

//ゲームスタート
game.start(); // start your game!

//onLoad
game.onload = function () {
    startTitleScene();
};

var gameOverFlg = false;

//タイトル
function startTitleScene() {
    var label = new Label();
    label.width = 640;
    label.textAlign = "center";
    label.color = "white";
    label.text = "The Collision";
    label.font = "70px Helvetica";
    label.x = 0;
    label.y = 200;
    game.rootScene.addChild(label);

    var startLabel = new Label();
    startLabel.width = 640;
    startLabel.textAlign = "center";
    startLabel.color = "white";
    startLabel.text = "Tap to Start";
    startLabel.font = "40px Helvetica";
    startLabel.x = 0;
    startLabel.y = 400;
    game.rootScene.addChild(startLabel);

    game.rootScene.on('touchstart', function (e) {
        startGameScene();
    });
}

//ゲームシーン
function startGameScene() {
    //初期化
    gameOverFlg = false;
    var count = 0;

    //シーン作成
    var gameScene = new Scene();
    gameScene.backgroundColor = "silver";

    //発射台
    var triSurface = new Surface(30, 30);
    var cannon = new Sprite(30, 30);
    cannon.x = 305;
    cannon.y = 600;
    cannon.image = triSurface;
    triSurface.context.beginPath();
    triSurface.context.strokeStyle = 'rgb(200,255,0)';
    triSurface.context.moveTo(15, 0);
    triSurface.context.lineTo(0, 30);
    triSurface.context.moveTo(0, 30);
    triSurface.context.lineTo(30, 30);
    triSurface.context.moveTo(30, 30);
    triSurface.context.lineTo(15, 0);
    triSurface.context.stroke();
    triSurface.context.closePath();
    gameScene.addChild(cannon);

    gameScene.on('touchstart', function (e) {
        if (!gameOverFlg) {
            //ボール
            // 円を表示するSpriteを作成する
            var ball = new Sprite(30, 30);
            var surface = new Surface(30, 30);
            surface.context.beginPath();
            surface.context.fillStyle = 'rgb(200,255,0)';
            surface.context.arc(15, 15, 15, 0, Math.PI * 2, true);
            surface.context.fill();
            surface.context.closePath();	//パスを終了
            ball.image = surface;
            ball.x = 305;
            ball.y = 590;
            gameScene.addChild(ball);

            //ballの当たり判定
            ball.addCollision(rectGroup);
            ball.addEventListener(Event.COLLISION, function (e) {
                ball.tl.clear();
                ball.tl.scaleTo(10, 10, 10).and().fadeTo(0, 10);
                ball.tl.then(function () {
                    ball.remove();
                    gameOverFlg = true;
                    gameOver(gameScene);
                });
                //ball.remove();
            });



            ball.tl.moveBy(0, -640, 40);
            ball.tl.then(function (e) {

                count++;
                label.text = "SCORE:" + count;
                ball.remove();
            });
        }
    });
    gameScene.on('touchend', function (e) {

    });
    gameScene.tl.delay(60);
    gameScene.tl.then(function () {

    });
    gameScene.tl.loop();
    game.pushScene(gameScene);

    //グループ
    var rectGroup = new Group();
    gameScene.addChild(rectGroup);

    //インジケーターのラベル
    var label = new Label();
    label.width = 500;
    label.textAlign = "left";
    label.color = "white";
    label.text = "SCORE:" + "0";
    label.font = "30px Helvetica";
    label.x = 20;
    label.y = 20;
    gameScene.addChild(label);

    //右向き
    gameScene.tl.delay(1);
    gameScene.tl.then(function (e) {
        var random = getRandom(20, 150);
        //四角
        var rectangle = new Sprite(random, random);
        var rectangleSurface = new Surface(random, random);
        rectangle.image = rectangleSurface;
        rectangleSurface.context.fillStyle = 'rgb(' + getRandom(0, 255) + ',' + getRandom(0, 255) + ',' + getRandom(0, 255) + ')';
        rectangleSurface.context.fillRect(0, 0, random, random);
        rectangle.x = -150;
        rectangle.y = getRandom(50, 300);
        rectangle.tl.rotateBy(360, random).and().moveBy(900, 0, random);
        rectangle.tl.then(function (e) {
            rectangle.remove();
        });
        rectGroup.addChild(rectangle);
    });
    gameScene.tl.loop();

    //左向き
    gameScene.tl.delay(1);
    gameScene.tl.then(function (e) {
        var random = getRandom(20, 150);
        //四角
        var rectangle = new Sprite(random, random);
        var rectangleSurface = new Surface(random, random);
        rectangle.image = rectangleSurface;
        rectangleSurface.context.fillStyle = 'rgb(' + getRandom(0, 255) + ',' + getRandom(0, 255) + ',' + getRandom(0, 255) + ')';
        rectangleSurface.context.fillRect(0, 0, random, random);
        rectangle.x = 800;
        rectangle.y = getRandom(50, 300);
        rectangle.tl.rotateBy(-360, random).and().moveBy(-900, 0, random);
        rectangle.tl.then(function (e) {
            rectangle.remove();
        });
        rectGroup.addChild(rectangle);
    });
    gameScene.tl.loop();
}

function gameOver(gameScene, rootScene) {
    var label = new Label();
    label.width = 640;
    label.textAlign = "center";
    label.color = "white";
    label.text = "Game Over";
    label.font = "70px Helvetica";
    label.x = 0;
    label.y = 300;
    gameScene.addChild(label);

    label.tl.delay(240);
    label.tl.then(function () {
        gameScene.remove();
        startGameScene();
    });
};



function getRandom(start, end) {
    return start + Math.floor(Math.random() * (end - start + 1));
}
