Class Breakdown


## Single, Pvp, Coop
display()
<br>

startHayDropAndLevelTimer() --> startLevelTimer()

stopHayDropAndLevelTimer() --> stopLevelTimer()

<br>

updateFallingHay() `// main game logic`

drawHay()

<br>
displayUI()

<br>
keyPressed()

keyReleased()

<br>
startNextLevel()

<br>
clearStats() --> stopHayDropAndLevelTimer() `//clear the current game stats`

restartFromCurrentLevel() 

restartFromLevel1() 


## Player
reset()

move()

show()

catches(hay) `//return true or false`

emptyToBarrel() `//empty hay to barrel`
