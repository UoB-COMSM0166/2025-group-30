
## Interface
| Interface                        | Details |
|----------------------------------|---------|
| **Initial Interface**            | Background image includes:<br>- Display **"Settings"** at coordinate (x, y)<br>- Display **"Start"** at coordinate (x, y) |
| **After clicking "Start"**       | Options for **"Single Player"** and **"Two Player"** mode appear |
| **After selecting "Single Player"** | Enter the **Single Player Character Selection** interface? |
| **After selecting "Two Player"** | Options for **"Co-op"** or **"Competitive"** mode appear |
| **After selecting "Two Player Co-op"** | Enter the **Two Player Co-op Character Selection** interface? |
| **After selecting "Two Player Competitive"** | Enter the **Two Player Competitive Character Selection** interface? |



| Single Player Game Interface | Details |
|-----------------------------|---------|
| **Top-left corner (x, y)**  | Display **SCORE** |
| **Top-left corner (x, y)**  | Display **TARGET** |
| **Top-left corner (x, y)**  | Three red hearts represent lives; losing a life turns one heart gray from right to left |
| **Top (x, y)**              | Display **NEXT** and the upcoming two types of haystacks |
| **Top-right corner (x, y)** | A rectangle of size **xx** |
| **Top-right corner (x, y)** | Display **Menu** |
| **Bottom-left corner**      | A **basket** is placed |
| **If an item is obtained**  | Display item type and remaining effect duration at coordinate (x, y) |


| Interface                          | Details |
|------------------------------------|---------|
| **Two-Player Co-op Game Interface** | Same as the **Single Player Game Interface**, but adds an additional board of the same size on the same horizontal line |
| **Two-Player Competitive Game Interface** | The screen is split into two halves, both sides are identical to the **Single Player Game Interface** |
|                                    | The game screens are mirrored: the **left player** places blocks on the **left side**, and the **right player** places blocks on the **right side** |
| **Game Pause Interface**           | Clicking the **Menu** button at the top-right corner pauses the game |
|                                    | Displays two buttons: **Continue** and **Restart** |
| **Game Over Interface**            | Displays **GAME OVER!** at coordinate (x, y) |
|                                    | Displays **FINAL SCORE: xx** at coordinate (x, y) |
|                                    | Displays **RESTART** at coordinate (x, y) (Initial version: **Press ENTER to restart**) |
| **Game Settings Interface**        | **Sound toggle** button |
|                                    | **Volume adjustment** button |
| **Character Selection Interface**  | **Single Player Mode**: Choose a character |
|                                    | **Two Player Mode**: Both players choose a character |

## Basic Gameplay

| Category | Details |
|----------|---------|
| **Size Settings (Character, Basket, Grass)** | **Basket**: xx, **Board**: 120×20, **Grass**: xx |
| **Speed Settings (Character Movement, Grass Falling)** | Grass only falls in the right area of the basket, falling speed = xx |
|  | Character can only move **left and right** on the same horizontal line (y = xx), movement speed = xx |
|  | Each time the character catches a grass pile, movement speed **decreases by xx** |
| **Collision Detection (When Grass is Considered Caught)** | If the board has **no grass**, when the **bottom of a falling grass pile** touches any part of the board, it stays still, indicating it is caught |
|  | If the board **already has grass** (less than 5), when the **bottom of a falling grass pile** touches the top of the highest grass pile, it stays still |
| **Death Conditions** | Initial lives: **3** |
|  | If a **grass pile is missed**, lives -1 |
|  | If lives reach **0**, the game ends |
|  | When the player loses a life: The **character and board flash for 1.5s**, falling grass stops, everything except the character and board **freezes**, and the **first red heart from the right turns gray** |
|  | After losing all lives, the game transitions to the **Game Over** screen |
| **Scoring Rules** | If the player moves near the **basket** (e.g., the left edge of the board touches the right edge of the basket), pressing **spacebar** drops the collected grass piles |
|  | The **score** is equal to the **number of grass piles** on the board |
|  | Each level has a **time limit**; reaching the **target score within the time** advances to the next level |
|  | Scores are **cumulative** across levels |

## Advanced Gameplay

### **Level Design**
| Level | Details |
|-------|---------|
| **Level 1** | Only square grass piles, fixed fall speed = xx, time limit = xx |
| **Level 2** | Only square grass piles, fall speed increases by xx every xx seconds, time limit = xx |
| **Level 3** | Square grass piles + buckets, fixed fall speed = xx, time limit = xx |
| **Level 4** | Square grass piles + buckets, fall speed increases by xx every xx seconds, time limit = xx |
| **Level 5** | Square grass piles + buckets + hearts, fixed fall speed = xx, time limit = xx |
| **Level 6** | Square grass piles + buckets + hearts, fall speed increases by xx every xx seconds, time limit = xx |

### **Special Items**
| Item | Effect |
|------|--------|
| **Bucket** | If hit, **-1 life** and all collected grass on the board is lost |
| **Heart** | Does **not count as a grass pile**, can be caught even if the board already holds 5 piles; grants **+1 life** |
| **Timer** | Adds **+10s** to the remaining time |
| **Slowdown Obstacle** | Reduces movement speed to **x0.8** |
| **Speed Boost Buff** | Increases movement speed to **x1.2** |
| **Bomb** | Destroys all grass on the board but **does not affect grass already placed in the basket** |

## Game Objectives

### **Single Player Mode**
| Objective | Details |
|-----------|---------|
| **Survival & Score Accumulation** | Catch as many grass piles as possible within the time limit |
| **Time Challenge** | As time progresses, grass falls faster, increasing scoring difficulty |
| **Mission Goal** | Catch **X** grass piles within **X** seconds |

### **Two-Player Co-op Mode**
| Objective | Details |
|-----------|---------|
| **Shared Score** | Both players work together to catch falling objects and increase the total team score |
| **Division of Labor** | One player manages the **left half**, the other manages the **right half** to avoid duplicate catches |
| **Item Support** | If one player fails, the other can use items like **revival or slowdown** to assist (*optional feature*) |
| **Collaboration** | Some special grass piles may require **both players to catch them simultaneously** for points (*optional feature*) |

### **Two-Player Competitive Mode**
| Objective | Details |
|-----------|---------|
| **Score Competition** | Each player scores independently; the one who catches more grass wins |
| **Time Challenge** | The player with the **highest score within the time limit** wins |


