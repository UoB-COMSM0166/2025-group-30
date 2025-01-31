# 1. Haystacking

In this game, the player needs to move their avatar left and right to catch the haystack falling from the sky to meet the target within the time limit.

## Game Mechanics

There is an option for a single player mode and one for two player mode.

### Single Player Mode

Each player has three lives to begin with. They lose a life when hit by a shovel or a bucket, and gain an extra life when they collect a star.

The haystack is of different shape and the player needs to balance them well on the platform. The player will lose the current haystack if it topples. The player could empty their haystack to a collection bucket on the side, where the percentage of target achieved is shown.

The next two items to be falling from the sky is shown on the console.

As the player has more haystack on their platform, they will move slower.

### Double Player Mode

The two players can either collaborate to reach a common target, or play against each other.

When playing together, the game mechanics are similar to that of the single player mode except for now the stack will be falling at a faster speed and the next two stacks will not be shown.

In the competition mode, the game console will be divided into two, each half will have features from the single player mode. Whoever that reaches the target first will win the game.


<video src="https://github.com/user-attachments/assets/2bc9ad40-728b-4c61-b258-6c2530942f93" controls width="600"></video>

# 2.Multiplayer Cooperative Game

## Game Objective
The core of the game is teamwork—players must cooperate to pass levels, fostering collaboration and improving their synergy.

## Game Mechanics and Potential Innovations
### 1. Unique Player Abilities for Different Levels
Each level assigns players distinct abilities, requiring coordinated teamwork to progress.
Example:
A level with vertical laser beams that cause instant failure upon contact.
One player has a vertical shield that blocks horizontal lasers.
Another player has a horizontal shield and must stand on the first player’s shoulders to navigate through the level together.

### 2. Triggering Special Abilities with Interactive Buttons
Players can step on buttons to activate abilities and help teammates.
Example:
"+" Button: Increases player size (useful for stacking, overcoming obstacles).
"-" Button: Shrinks the player (allows passing through narrow gaps).

### 3. Dynamic Light Hazard
Some levels have changing light beams from above.
If a player is caught in the light, they instantly die, adding tension and challenge.

### 4. Restricted Player Contact & Unstable Terrain
Certain levels prohibit physical contact between players while introducing environmental hazards.
Example:
Ice Surfaces add inertia-based movement, making precise navigation harder.

### 5. Rhythm-Based Interaction
Background music affects the level environment:
Platforms appear on specific beats.
Players must time jumps and movements with the rhythm for success.

### 6. Elemental Interaction Gameplay
Each player controls one of four elements: Wind, Water, Fire, Electricity, each affecting the environment uniquely:
Wind: Blows away obstacles or propels players.
Water: Fills pits, allowing teammates to swim across.
Fire: Burns wooden barriers or lights torches to unlock doors.
Electricity: Activates mechanisms or short-circuits enemy devices.
Example Combinations:
Water + Electricity → Creates a conductive path.
Wind + Fire → Triggers explosive mechanisms.

## Game Development Challenges

### 1. Physics Interactions & Collision Detection
Problem:
Multiplayer interactions involve complex physics, including:
Standing on top of other players.
Jumping, sliding, and collision detection.
Shields blocking lasers accurately.
Implementation Challenges:
Utilize Box2D or Unity Physics Engine to manage rigid body physics.
Ensure shield and laser interactions don’t cause false detections.
Optimize collision detection to prevent issues like clipping or physics jittering.

### 2. Level Design & Difficulty Balancing
Problem:
Player count and skill combinations impact level difficulty.
Implementation Challenges:
Dynamic Difficulty Adjustment: If players fail multiple times, adjust the challenge (e.g., extend laser intervals).
Multiple Solutions: Ensure levels offer varied solutions to avoid player frustration.

### 3. Advanced Character Physics & Interaction
Problem:
Characters need realistic physical interactions, including:
Jumping, climbing, stacking, sliding, and size changes.
Implementation Challenges:
Use Box2D.js or Matter.js for physics calculations.
Implement shield blocking mechanics with proper laser detection & feedback.
Add friction & inertia mechanics (e.g., ice surfaces cause sliding).

### 4. Custom Level System
Problem:
Levels require custom rules (buttons, obstacles, moving lights).
Implementation Challenges:
Use JSON or Tiled Map Editor for level configuration.
Implement a flexible event-trigger system (e.g., buttons triggering actions).

### 5. Dynamic Lighting & Hazard Mechanics
Problem:
Overhead moving light projections must detect which players are in illuminated zones.
Implementation Challenges:
Use Canvas API or WebGL (Three.js) for real-time lighting calculations.
Optimize performance for multiplayer real-time gameplay.
Setup & Development
Technologies Used
Game Engine: Unity / Phaser.js / Custom WebGL
Physics Engine: Box2D, Matter.js
Level Design Tools: Tiled Map Editor, JSON Configurations
Rendering: WebGL, Three.js
