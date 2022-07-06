var assets = [
    "images/title.png",// タイトル
    "sounds/hit.mp3",
    "sounds/pointget.mp3",
    "sounds/pointlost.mp3",
    "images/ms_bomb.png",
    "images/do_oyaji.png",
    "images/do_oyaji_1.png",
    "images/do_oyaji_2.png",
    "images/do_oyaji_3.png",
    "images/washi_kick_l.png",
    "images/washi_sit.png",
    "images/washi_stand.png",
    "images/washi_jump.png",
    "images/back_town.png",
    "images/bomb.png",
    "sounds/ready.mp3",
    "sounds/ok.mp3",
    "sounds/miss.mp3",
    "sounds/bomb_l.mp3",
    "sounds/voice-imada.mp3",
    "sounds/voice-seeno.mp3",
    "sounds/voice-yoisho.mp3",
    "sounds/voice-to.mp3",
    "sounds/voice-ei.mp3",
    "sounds/voice-ya.mp3",
    "sounds/voice-yarare1.mp3",
    "sounds/voice-yarare2.mp3",
    "sounds/voice-yarare3.mp3",
    "sounds/voice-yarare4.mp3",
    "sounds/voice-yarare5.mp3",
    "sounds/voice-yarare6.mp3",
    "sounds/voice-yarare7.mp3",
    "sounds/voice-yarare8.mp3",
];

function gameStart() {
    var scene = new Scene();
    core.replaceScene(scene); core.resume();

    //==========
    // ここから
    //==========
    scene.backgroundColor = "black";

    var background = new ExSprite(480, 480);
    background.image = core.assets["images/back_town.png"];
    background.x = 0;
    background.y = 0;
    scene.addChild(background);


    //得点の表示
    // ラベルを表示しよう
    var titleLabel = new Label();
    titleLabel.text = "おしゃべり！ エアホッケー！";
    titleLabel.color = 'white';
    titleLabel.font = "30px 'meiryo'";
    titleLabel.width = 480;
    titleLabel.x = 0;
    titleLabel.y = 100;
    titleLabel.textAlign = "center";
    scene.addChild(titleLabel);



    //変数いろいろ
    var playerPoint = 5;  //プレイヤーのポイント
    var enemyPoint = 5;  //敵のポイント
    var pointGet = 0; //0:player 1:enemy どっちがポイントを取ったか判定
    var playing = true; //true: 試合中　false:ゲーム終了

    // （１）重力のある世界を作る
    var world = new PhysicsWorld(0, 0);
    scene.addEventListener(Event.ENTER_FRAME, function () {
        world.step(core.fps);
    });

    // 円を表示するSpriteを作成する
    var ball = new PhyCircleSprite(15, enchant.box2d.DYNAMIC_SPRITE, 1.0, 0.1, 1.0);
    ball.image = core.assets["images/ms_bomb.png"];

    // var surface = new Surface(30, 30);
    // surface.context.beginPath();
    // surface.context.fillStyle = 'white';
    // surface.context.arc(15, 15, 15, 0, Math.PI * 2, true);
    // surface.context.fill();
    // surface.context.closePath();
    // ball.image = surface;
    //ボールの弾む力の調整（あとから変えたいとき）
    //ball.body.m_density = xxx;
    scene.addChild(ball);



    //ラベルの表示
    var resultLabel = new Label();
    resultLabel.text = "result";
    resultLabel.color = 'white';
    resultLabel.font = "50px 'PixelMplus10'";
    resultLabel.width = 480;
    resultLabel.x = 0;
    resultLabel.y = 80;
    resultLabel.textAlign = "center";
    scene.addChild(resultLabel);
    resultLabel.visible = false;

    resultLabel.tl.delay(20);
    resultLabel.tl.then(function () {
        resultLabel.opacity = 1;
    });
    resultLabel.tl.delay(20);
    resultLabel.tl.then(function () {
        resultLabel.opacity = 0;
    });
    resultLabel.tl.loop();



    var restartLabel = new Label();
    restartLabel.text = "Tap to restart!";
    restartLabel.color = 'white';
    restartLabel.font = "30px 'PixelMplus10'";
    restartLabel.width = 480;
    restartLabel.x = 0;
    restartLabel.y = 250;
    restartLabel.textAlign = "center";
    scene.addChild(restartLabel);
    restartLabel.visible = false;

    restartLabel.addEventListener(Event.TOUCH_START, function (e) {

    });

    //ボールを真ん中にもどす
    start();

    //計算
    // y = 1+((x-150)*(-1)/100));
    //150がラケットのY座標の中間地点　ここは要調整

    // 左側　プレイヤー
    var player = new PhyCircleSprite(22, enchant.box2d.STATIC_SPRITE, 1.0, 0.1, 1.1);
    player.image = core.assets["images/do_oyaji.png"];
    player.frame = [0, 1];
    //    player.backgroundColor = "blue";
    // var surface = new Surface(50, 50);
    // surface.context.beginPath();
    // surface.context.fillStyle = 'yellow';
    // surface.context.arc(25, 25, 25, 0, Math.PI * 2, true);
    // surface.context.fill();
    // surface.context.closePath();
    // player.image = surface;
    player.x = 5;
    player.y = 140;
    scene.addChild(player);
    player.angle = 0;

    //プレイヤーとボールの当たり判定
    player.addCollision(ball);
    player.addEventListener(Event.COLLISION, function (e) {
        var sound = core.assets["sounds/hit.mp3"].clone();
        sound.play();

        var random = getRandom(0, 2);
        var hitVoice;
        if(random == 0 ){
            hitVoice = core.assets["sounds/voice-imada.mp3"].clone();
        }else if(random == 1){
            hitVoice = core.assets["sounds/voice-seeno.mp3"].clone();
        }else if(random == 2){
            hitVoice = core.assets["sounds/voice-yoisho.mp3"].clone();
        }
        hitVoice.play();

        player.tl.then(function () {
            player.image = core.assets["images/do_oyaji_2.png"];
        });
        player.tl.delay(6);
        player.tl.then(function () {
            player.image = core.assets["images/do_oyaji_3.png"];
        });
        player.tl.delay(6);
        player.tl.then(function () {
            player.image = core.assets["images/do_oyaji_1.png"];
        });
    });


    // 右側　敵
    var enemy = new PhyCircleSprite(82, enchant.box2d.STATIC_SPRITE, 1.0, 0.1, 1.0);
    enemy.image = core.assets["images/washi_stand.png"];
    // var surface = new Surface(50, 50);
    // surface.context.beginPath();
    // surface.context.fillStyle = 'red';
    // surface.context.arc(25, 25, 25, 0, Math.PI * 2, true);
    // surface.context.fill();
    // surface.context.closePath();
    // enemy.image = surface;

    //敵とボールの当たり判定
    enemy.addCollision(ball);
    enemy.addEventListener(Event.COLLISION, function (e) {
        var sound = core.assets["sounds/hit.mp3"].clone();
        sound.play();

        var random = getRandom(0, 2);
        var hitVoice;
        if(random == 0 ){
            hitVoice = core.assets["sounds/voice-ei.mp3"].clone();
        }else if(random == 1){
            hitVoice = core.assets["sounds/voice-ya.mp3"].clone();
        }else if(random == 2){
            hitVoice = core.assets["sounds/voice-to.mp3"].clone();
        }
        hitVoice.play();

        enemy.tl.then(function () {
            enemy.image = core.assets["images/washi_kick_l.png"];
        });
        enemy.tl.delay(10);
        enemy.tl.then(function () {
            enemy.image = core.assets["images/washi_sit.png"];
        });
        enemy.tl.delay(10);
        enemy.tl.then(function () {
            enemy.image = core.assets["images/washi_jump.png"];
        });
        enemy.tl.delay(10);
        enemy.tl.then(function () {
            enemy.image = core.assets["images/washi_stand.png"];
        });
    });

    enemy.x = 380;
    enemy.y = 140;
    scene.addChild(enemy);
    //    enemy.angle = -10;

    //壁
    var table = new PhyBoxSprite(480, 10, enchant.box2d.STATIC_SPRITE, 1.0, 0, 1.0);
    table.x = 0;
    table.y = 320;
    table.backgroundColor = "rgb(0,255,0)";
    scene.addChild(table);

    table.addCollision(ball);

    table.addEventListener(Event.COLLISION, function (e) {
        var sound = core.assets["sounds/hit.mp3"].clone();
        sound.play();
    });

    var table2 = new PhyBoxSprite(480, 10, enchant.box2d.STATIC_SPRITE, 1.0, 0, 1.0);
    table2.x = 0;
    table2.y = 0 - table.height;
    table2.backgroundColor = "rgb(0,255,0)";
    scene.addChild(table2);

    table2.addCollision(ball);
    table2.addEventListener(Event.COLLISION, function (e) {
        var sound = core.assets["sounds/hit.mp3"].clone();
        sound.play();
    });
    

    scene.addEventListener(Event.TOUCH_MOVE, function (e) {
        //マウスカーソルの位置を検出
        player.y = e.y - (player.height / 2);
    });

    scene.addEventListener(Event.TOUCH_START, function (e) {
        //試合終了後、画面をタップしたらゲームを再開する
        if (playing == false) {
            console.log("tap");
            resultLabel.visible = false;
            restartLabel.visible = false;
            enemyPoint = 5;
            playerPoint = 5;
            playerLabel.text = "SCORE:" + playerPoint;
            enemyLabel.text = "SCORE:" + enemyPoint;
            playing = true;
            start();
        }
    });



    ball.tl.delay(30);
    ball.tl.then(function () {
        //敵が無駄に動かないように
        if (ball.x > 120) {
            //敵の移動
            enemy.tl.moveTo(enemy.x, ball.y, 15);
            //Todo:
            // ラケットのY座標によって反発の強さを変える計算式
            // r:restitution 
            // y:y座標
            //player.body.m_restitution = 1 + ((player.y - 150) * (-1 / 100));
        }
    });
    ball.tl.loop();

    scene.addEventListener(Event.ENTER_FRAME, function (e) {
        //得点を計算して、ゲームの結果を表示、ボールを中央に戻す。
        if (player.x - 50 > ball.x) {
            addEnemyPoint();
            result();
        } else if (enemy.x + 50 < ball.x) {
            addPlayerPoint();
            result();
        }
    });


    //得点の表示
    // ラベルを表示しよう
    var playerLabel = new Label();
    playerLabel.text = "SCORE:" + playerPoint;
    playerLabel.color = 'yellow';
    playerLabel.font = "20px 'PixelMplus10'";
    playerLabel.width = 200;
    playerLabel.x = 20;
    playerLabel.y = 300;
    playerLabel.textAlign = "left";
    scene.addChild(playerLabel);

    var enemyLabel = new Label();
    enemyLabel.text = "SCORE:" + enemyPoint;
    enemyLabel.color = 'red';
    enemyLabel.font = "20px 'PixelMplus10'";
    enemyLabel.width = 200;
    enemyLabel.x = 260;
    enemyLabel.y = 300;
    enemyLabel.textAlign = "right";
    scene.addChild(enemyLabel);


    //得点の計算をする
    function addPlayerPoint() {
        console.log("■addPlayerPoint");
        //プレイヤーが得点ゲット

        var random = getRandom(0, 3);
        var yarareVoice;
        if(random == 0 ){
            yarareVoice = core.assets["sounds/voice-yarare1.mp3"].clone();
        }else if(random == 1){
            yarareVoice = core.assets["sounds/voice-yarare2.mp3"].clone();
        }else if(random == 2){
            yarareVoice = core.assets["sounds/voice-yarare3.mp3"].clone();
                }else if(random == 3){
            yarareVoice = core.assets["sounds/voice-yarare4.mp3"].clone();
        }
        yarareVoice.play();

        pointGet = 0;

        enemyPoint--;
        if (enemyPoint < 0) {
            enemyPoint = 0;
        } else {
            // var sound = core.assets["sounds/ok.mp3"].clone();
            // sound.play();
        }
        enemyLabel.text = "SCORE:" + enemyPoint;
        ball.vx = 0;
        ball.vy = 0;

        //位置を１pxずらすことでポイントが加算され続けるのを回避
        ball.x = ball.x - 1;

    }

    function addEnemyPoint() {
        console.log("★addEnemyPoint");
        var random = getRandom(0, 3);
        var yarareVoice;
        if(random == 0 ){
            console.log("★★");
            yarareVoice = core.assets["sounds/voice-yarare5.mp3"].clone();
        }else if(random == 1){
            yarareVoice = core.assets["sounds/voice-yarare6.mp3"].clone();
        }else if(random == 2){
            yarareVoice = core.assets["sounds/voice-yarare7.mp3"].clone();
        }else if(random == 3){
            yarareVoice = core.assets["sounds/voice-yarare8.mp3"].clone();
        }
        yarareVoice.play();

        //敵が得点ゲット
        pointGet = 1;

        playerPoint--;
        if (playerPoint < 0) {
            playerPoint = 0;
        } else {
            // var sound = core.assets["sounds/miss.mp3"].clone();
            // sound.play();
        }
        playerLabel.text = "SCORE:" + playerPoint;
        ball.vx = 0;
        ball.vy = 0;

        //位置を１pxずらすことでポイントが加算され続けるのを回避
        ball.x = ball.x + 1;
    }

    //ボールの位置を真ん中に戻す
    function start() {
        ball.tl.show();
        //最初の１回だけReadyGoを再生
        if (playerPoint == 5 && enemyPoint == 5) {
            var voice = core.assets["sounds/ready.mp3"].clone();
            voice.play();
            titleLabel.tl.delay(120);
            titleLabel.tl.then(function(){
                titleLabel.remove();
            });
        }

        ball.x = scene.width / 2 - (ball.width / 2);
        ball.y = scene.height / 2 - (ball.height / 2);
        ball.vx = 0;
        ball.vy = 0;

        //~秒後にボールを飛ばす
        scene.tl.delay(60);
        scene.tl.then(function () {
            //ランダムじゃなくて得点した人の方向へ向ける
            var randomY = getRandom(0, 1);
            var ballX = 0;
            var ballY = 0;
            if (randomY == 0) {
                ballY = 1;
            } else {
                ballY = -1;
            }
            if (pointGet == 0) {
                //プレイヤーがポイントゲットした時
                ballX = -8;
            } else {
                //敵がポイントをゲットした時
                ballX = 8;
            }
            ball.addImpulse(ballX, ballY);
        })
    }

    //ボールを止める
    function stop() {
        ball.vx = 0;
        ball.vy = 0;
    }

    //結果の判定
    function result() {
        if (playerPoint <= 0 || enemyPoint <= 0) {
            if (playerPoint > enemyPoint) {
                resultDisplay("You Win!!");

                var sound = core.assets["sounds/ok.mp3"].clone();
                sound.play();

                //爆弾を爆発
                ball.tl.hide();
                var bomb = new ExSprite(32, 32);
                bomb.image = core.assets["images/bomb.png"];
                bomb.x = 460;
                bomb.y = ball.y;
                scene.addChild(bomb);
                bomb.tl.scaleTo(5, 5, 0);
                bomb.frame = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, null];
                bomb.addEventListener(Event.ANIMATION_END, function () {
                    bomb.remove();
                });

                var bombvoice = core.assets["sounds/bomb_l.mp3"].clone();
                bombvoice.play();
            } else {
                resultDisplay("You Lose...");

                //爆弾を爆発
                ball.tl.hide();
                var bomb = new ExSprite(32, 32);
                bomb.image = core.assets["images/bomb.png"];
                bomb.x = 20;
                bomb.y = ball.y;
                scene.addChild(bomb);
                bomb.tl.scaleTo(5, 5, 0);
                bomb.frame = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, null];
                bomb.addEventListener(Event.ANIMATION_END, function () {
                    bomb.remove();
                });
                var bombvoice = core.assets["sounds/bomb_l.mp3"].clone();
                bombvoice.play();
                var sound = core.assets["sounds/miss.mp3"].clone();
                sound.play();
            }
            ball.vx = 0;
            ball.vy = 0;
            //状態を試合終了にする
            playing = false;
        } else {
            //ボールを最初の位置に戻す
            start();
        }
    }


    function resultDisplay(message) {
        resultLabel.visible = true;
        restartLabel.visible = true;
        resultLabel.text = message;
    }

    function dummy() {
        var point = 0;
        //0.5秒おきにプラス１する
        scene.tl.delay(8);
        scene.tl.then(function () {
            //pointが１６０以下のときはプラス１する
            if (point <= 160) {
                point++;
            }
        });
        scene.tl.loop();
    }

    //==========
    // ここまで
    //==========

};

function titleStart() {// タイトル画面
    var scene = gameManager.createTitleScene();
    core.replaceScene(scene); core.pause();
    scene.on(enchant.Event.TOUCH_START, function () { gameStart(); });
}

//==========
//EnchantJS
enchant();
var gameManager;
var core;
var scene;
window.onload = function () {
    gameManager = new common.GameManager();
    core = gameManager.createCore(480, 320);
    core.preload(assets);
    core.fps = 60;
    core.onload = function () { titleStart(); };
    core.start();
};