Class Breakdown


## Single, Pvp, Coop
display()
<br>

startGrassDropAndLevelTimer() --> startLevelTimer()

stopGrassDropAndLevelTimer() --> stopLevelTimer()

<br>

updateFallingGrass() `// main game logic`

drawGrass()

<br>
displayUI()

<br>
keyPressed()

keyReleased()

<br>
setNextLevel()

<br>
resetStats() --> stopGrassDropAndLevelTimer() `//reset the current game stats`


resetToLevel1() `//reset to level 1`


## Player
reset()

move()

show()

checkGrassCaught(grass) `//return true or false`

emptyToBasket() `//empty grass to basket`
