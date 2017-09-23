var Local = function() {
    var game
    var time
    var bindKeyEvent = function() {
        document.onkeydown = function(e) {
            console.log(e.keyCode)
            if (e.keyCode === 38) { // up
                game.rotate()
            } else if (e.keyCode === 39) { // right
                game.right()
            } else if (e.keyCode === 40) { // down
                game.down()
            } else if (e.keyCode === 37) { // left
                game.left()
            } else if (e.keyCode === 32) { // space
                game.fall()
            }
        }
    }
    var unbindKeyEvent = function() {
        document.onkeydown = function(e) {
            if (e.keyCode === 13) {
                start()
            }
        }
    }

    var generateType = function() {
        return Math.ceil(Math.random() * 7) - 1
    }
    var generateDir = function() {
        return Math.ceil(Math.random() * 4) - 1
    }
    var naturalFall = function(doms) {
        var canFall = true
        var stitv = setInterval(function() {
            if (canFall) {
                canFall = game.down()
            } else {
                game.fixed()
                var lines = game.checkClear()
                if (lines) {
                    game.addScore(lines)
                }
                if (game.checkGameOver()) {
                    stop()
                    clearInterval(stitv)
                } else {
                    game.performNext(generateType(), generateDir())
                    naturalFall(doms)
                    clearInterval(stitv)
                }
            }
        }, 300)
    }
    var start = function() {
        var doms = {
            gameDiv: document.getElementById('game'),
            nextDiv: document.getElementById('next'),
            timeDiv: document.getElementById('time'),
            scoreDiv: document.getElementById('score'),
            gameoverDiv: document.getElementById('gameover')
        }
        game = new Game()
        game.init(doms, generateType(), generateDir())
        game.performNext(generateType(), generateDir())
        time = game.initTime(doms.timeDiv)
        naturalFall(doms)
        bindKeyEvent()
    }
    var stop = function() {
        unbindKeyEvent()
        clearInterval(time)
        game.gameover(false)
    }
    this.start = start
}