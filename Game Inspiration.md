# Game Inspiration

## Car Park Puzzle

The game console is a 2D overview of a car park. Player needs to drive their car out through the car park exit by moving the surrounding cars. Cars can only be moved forward or backward, without the possibiliy of making turns.

### Possible Twists

- Adjust the number of surrounding cars based on difficulty levels.
- Arrange cars in a way that they face different directions.
- Change the car park to a bus station. There are passengers waiting in a queue for different buses. Passengers need to get on the bus of the same colour as them. The game is won when all passengers are able to get on to the bus.
- Add other features of a real car park, e.g. pedestrian crossings, unloading areas for lorries. 


## Fireboy & Watergirl

### Game Type
Fireboy and Watergirl is a cooperative puzzle-platform game.

### Game Overview
This game requires two players to control characters with distinct attributes—Fireboy and Watergirl—working together to complete various levels. Fireboy is controlled using the arrow keys, while Watergirl is controlled using the WASD keys. Fireboy can safely pass through fire, while Watergirl can safely pass through water. However, if Fireboy or Watergirl touch the opposite element, they die, and the level must be restarted. Additionally, green acid is deadly to both characters. Players can collect diamonds in each level, and upon completion, a chart displays their rating based on the number of diamonds collected.

### Game Mechanisms

#### 1. Character Attributes
- **Fireboy:**
  - Controlled with the arrow keys, Fireboy has fire attributes. He can safely pass through fire pools but will die upon touching water pools or green acid.
- **Watergirl:**
  - Controlled with the WASD keys, Watergirl has water attributes. She can safely pass through water pools but will die upon touching fire pools or green acid.

#### 2. Player Actions
- Players can move left or right and jump up to navigate traps or activate specific mechanisms.

#### 3. Death Triggers
- **Character-Specific Weaknesses:**
  - **Fireboy:**
    - **Trigger:** Touching a water pool (blue liquid).
    - **Reason:** Fireboy cannot interact with water and will be "extinguished."
  - **Watergirl:**
    - **Trigger:** Touching a fire pool (red liquid).
    - **Reason:** Watergirl cannot interact with fire and will be "evaporated."
- **Shared Weaknesses:**
  - **Green Acid:**
    - Deadly to both characters upon contact. It is the only element in the game that kills both instantly.
  - **Falling into the Abyss:**
    - If a character falls off the platform or below the screen, they cannot return to the game.

#### 4. Game Over
- If either character dies, the level immediately fails, and players must restart.

#### 5. Environmental Interactions
- **Pushing Boxes:**
  - Players can push boxes to specific locations to activate switches or fill gaps.
- **Standing on Switches:**
  - Players must step on pressure plates to trigger mechanisms, such as opening doors or moving platforms.
- **Pulling Levers:**
  - Approaching a lever automatically triggers it, changing the map layout.

#### 6. Level Design
- **Maps:**
  - **Platform Jumping Maps:**
    - The entire map is visible, allowing players to plan their strategy before proceeding.
  - **Cooperative Maps:**
    - The two characters follow separate paths, often requiring collaboration to solve puzzles.
- **Mechanisms and Obstacles:**
  - Fire pools
  - Water pools
  - Green acid
  - Boxes
  - Levers
  - Pressure plates
  - And more...

#### 7. Level Objectives
- Both characters must safely reach their respective exits.

#### 8. Scoring System
- Players are rated based on the number of diamonds collected during the level.

#### 9. Extended Gameplay Options
- **Time Limits:**
  - Some levels may include a time limit, requiring players to complete the level within a set time frame. Failure to do so results in a loss.


## Flappy Bird

In this game, the player only needs to keep touching the screen to control a bird to fly and avoid the green pipes. When the screen is released, the bird will start to fall. If the bird hits an obstacle, the game will be over. Each time the bird successfully passes through a set of pipes, the player will earn one point.

### Ideas For Game Mechanic Upgrades
- Increase the game's difficulty over time by increasing the speed, reducing the gap between obstacles, or adding moving obstacles.
- Add some bonuses along the way. If the bird collects them, different effects can occur, such as increased speed, additional score, or a temporary ability to prevent falling.

### Ideas For Multiple Game Modes
- Multiplayer mode : Two players control two birds simultaneously. The obstacles will have a wider gap to allow both birds to pass through together. Players compete to collect bonuses, such as coins. If one player fails, their final scores will be compared to determine the winner.
- Time-limited mode : Within a limited time, player should collect as many bonuses as possible. The goal is to maximize the score before the timer runs out.