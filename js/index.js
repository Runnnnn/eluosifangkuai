var local = new Local()
document.onkeydown = function(e) {
    if (e.keyCode === 13) { // press enter to start game
        local.start()
    }
}
