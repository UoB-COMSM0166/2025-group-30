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
startNextLevel()

<br>
clearStats() --> stopGrassDropAndLevelTimer() `//clear the current game stats`

restartFromCurrentLevel() 

restartFromLevel1() 


## Player
reset()

move()

show()

catches(grass) `//return true or false`

emptyToBasket() `//empty grass to basket`
