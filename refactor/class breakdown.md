Class Breakdown


## Single, Pvp, Coop
display()
<br>

startGrassDrop() --> startLevelTimer()

stopGrassDrop() --> stopLevelTimer()

<br>

updateGrass() `// main game logic`

showGrass()

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

catchGrass(grass) `//return true or false`

emptyGrass() `//empty grass to basket`
