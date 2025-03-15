Class Breakdown


## Single, Pvp, Coop
display()
<br>

startGrassDrop() --> startLevelTimer()

stopGrassDrop() --> stopLevelTimer()

<br>

updateFallingGrass() `// main game logic`

drawGrass()

<br>
displayUI()

<br>
keyPressed()

keyReleased()

<br>
startNextLevel()

<br>
clearStats() --> stopGrassDrop() `//clear the current game stats`

restart() `//restart from the current level`

reset() `//reset to level 1`


## Player
reset()

move()

show()

checkGrassCaught(grass) `//return true or false`

emptyToBasket() `//empty grass to basket`
