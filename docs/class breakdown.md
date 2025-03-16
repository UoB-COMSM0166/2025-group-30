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

restartFromCurrentLevel() `//restart from the current level`

resetToLevel1() `//reset to level 1`


## Player
resetToLevel1()

move()

show()

checkGrassCaught(grass) `//return true or false`

emptyToBasket() `//empty grass to basket`
