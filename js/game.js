var Game = function() {
    var gameDiv
    var nextDiv
    var scoreDiv
    var gameoverDiv
    var totalScore = 0

    var gameData = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]

    var cur
    var next

    var nextDivs = []
    var gameDivs = []

    var renderDiv = function(dom, data, divs) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] === 0) {
                    divs[i][j].className = 'none'
                } else if (data[i][j] === 1) {
                    divs[i][j].className = 'done'
                } else if (data[i][j] === 2) {
                    divs[i][j].className = 'current'
                }
            }
        }
        for (var i = 0; i < divs.length; i++) {
            for (var k = 0; k < divs[0].length; k++) {
                dom.appendChild(divs[i][k])
            }
        }
    }
    var initDiv = function(dom, data, divs) {
        for (var i = 0; i < data.length; i++) {
            var div = []
            for (var j = 0; j < data[0].length; j++) {
                var cell = document.createElement('div')
                cell.className = 'none'
                cell.style.top = i * 20 + 'px'
                cell.style.left = j * 20 + 'px'
                div.push(cell)
            }
            divs.push(div)
        }
        renderDiv(dom, data, divs)
    }

    var check = function(pos, x, y) {
        if (pos.x + x < 0) {
            return false
        } else if (pos.x + x >= gameData.length) {
            return false
        } else if (pos.y + y < 0) {
            return false
        } else if (pos.y + y >= gameData[0].length) {
            return false
        } else if (gameData[pos.x + x][pos.y + y] === 1) {
            return false
        } else {
            return true
        }
    }
    var isValid = function(pos, data) {
        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[0].length; j++) {
                if (data[i][j] !== 0 && !check(pos, i, j)) {
                    return false
                }
            }
        }
        return true
    }
    var calculateData = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = cur.data[i][j]
                }
            }
        }
    }
    var clearData = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    gameData[cur.origin.x + i][cur.origin.y + j] = 0
                }
            }
        }
    }

    var rotate = function() {
        if (cur.allowRotate(isValid)) {
            clearData()
            cur.rotate()
            calculateData()
            renderDiv(gameDiv, gameData, gameDivs)
        }
    }
    var down = function() {
        if (cur.allowDown(isValid)) {
            clearData()
            cur.down()
            calculateData()
            renderDiv(gameDiv, gameData, gameDivs)
            return true
        } else {
            return false
        }
    }
    var left = function() {
        if (cur.allowLeft(isValid)) {
            clearData()
            cur.left()
            calculateData()
            renderDiv(gameDiv, gameData, gameDivs)
        }
    }
    var right = function() {
        if (cur.allowRight(isValid)) {
            clearData()
            cur.right()
            calculateData()
            renderDiv(gameDiv, gameData, gameDivs)
        }
    }
    var fixed = function() {
        for (var i = 0; i < cur.data.length; i++) {
            for (var j = 0; j < cur.data[0].length; j++) {
                if (check(cur.origin, i, j)) {
                    if (gameData[cur.origin.x + i][cur.origin.y + j] === 2) {
                        gameData[cur.origin.x + i][cur.origin.y + j] = 1
                    }
                }
            }
        }
        renderDiv(gameDiv, gameData, gameDivs)
    }
    var performNext = function(type, dir) {
        cur = next
        calculateData()
        next = SquareFactory(type, dir)
        renderDiv(gameDiv, gameData, gameDivs)
        renderDiv(nextDiv, next.data, nextDivs)
    }
    var checkClear = function() {
        var lines = 0
        for (var i = gameData.length - 1; i >= 0; i--) {
            var allowClear = true
            for (var j = 0; j < gameData[0].length; j++) {
                if (gameData[i][j] !== 1) {
                    allowClear = false
                    break
                }
            }
            if (allowClear) {
                lines = lines + 1
                for (var m = i; m > 0; m--) {
                    for (var n = 0; n < gameData[0].length; n++) {
                        gameData[m][n] = gameData[m - 1][n]
                    }
                    gameData[0] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
                }
                i++
            }
        }
        return lines
    }
    var checkGameOver = function() {
        var gameOver = false
        for (var i = 0; i < gameData[0].length; i++) {
            if (gameData[1][i] === 1) {
                gameOver = true
            }
        }
        return gameOver
    }
    var addScore = function(lines) {
        var score = 0
        switch (lines) {
            case 1:
                score = 10
                break
            case 2:
                score = 30
                break
            case 3:
                score = 50
                break
            case 4:
                score = 80
                break
            default:
                score = 10
                break
        }
        totalScore = totalScore + score
        scoreDiv.textContent = totalScore
    }
    var initTime = function(timeDiv) {
        var time = 0
        return setInterval(function() {
            time = time + 1
            timeDiv.textContent = time 
        }, 1000)
    }
    var init = function(doms, type, dir) {
        gameDiv = doms.gameDiv
        nextDiv = doms.nextDiv
        scoreDiv = doms.scoreDiv
        gameoverDiv = doms.gameoverDiv
        cur = SquareFactory(1, 2)
        next = SquareFactory(type, dir)
        // calculateData()

        initDiv(gameDiv, gameData, gameDivs)
        initDiv(nextDiv, next.data, nextDivs)
    }
    var gameover = function(win) {
        if (win) {
            gameoverDiv.textContent = 'You Win'
        } else {
            gameoverDiv.textContent = 'Game Over'
        }
        
    }

    this.init = init
    this.down = down
    this.left = left
    this.right = right
    this.rotate = rotate
    this.fall = function() {
        var canFall = down()
        var stitv = setInterval(function() {
            if (canFall) {
                canFall = down()
            } else {
                clearInterval(stitv)
            }
        }, 40)
    }
    this.fixed = fixed
    this.performNext = performNext
    this.checkClear = checkClear
    this.checkGameOver = checkGameOver
    this.initTime = initTime
    this.addScore = addScore
    this.gameover = gameover
}