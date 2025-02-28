# 2025-group-30
2025 COMSM0166 group 30

## Haystacking

Link to your game [PLAY HERE](https://uob-comsm0166.github.io/2025-group-30/) 

Your game lives in the [/docs](/docs) folder, and is published using Github pages to the link above.

Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)
[🎬 Click here to watch the demo video](https://github.com/UoB-COMSM0166/2025-group-30/blob/nemo/videos/demo%20video.MP4)

## Table of Contents

## Developent Team

Add a group photo here!

| Name         | Email                              | GitHub username |
|-------------|----------------------------------|----------------|
| Lingchen Li | [yf24777@bristol.ac.uk](mailto:yf24777@bristol.ac.uk) | lingchen2333 |
| Lei Gao     | [yt24392@bristol.ac.uk](mailto:yt24392@bristol.ac.uk) | Muilka |
| Hanying Bian | [oo24343@bristol.ac.uk](mailto:oo24343@bristol.ac.uk) | Hanying-Bian |
| Shiyu Dou   | [hl24597@bristol.ac.uk](mailto:hl24597@bristol.ac.uk) | hl24597 |
| Zhuoyan Qiu | [rp24358@bristol.ac.uk](mailto:rp24358@bristol.ac.uk) | 1003-qzy |
| Liyang Li   | [gq24742@bristol.ac.uk](mailto:gq24742@bristol.ac.uk) | Misaki-1 |

## Project Report

### Introduction

- 5% ~250 words 
- Describe your game, what is based on, what makes it novel? 

Our **Haystacking** game is an innovative stacking-based casual challenge inspired by the classic game **Grass Catching**. 
Set during the harvest season on a farm, players must control their character’s movement left and right to catch falling 
haystacks and collect as much hay as possible within a limited time to reach the goal.

#### **Game Objective**
The game challenges players’ balancing and strategic skills while simulating the intensity of farm harvesting. 
Players must constantly adjust their position and respond flexibly to randomly falling hay. If too much hay 
accumulates, movement speed will slow down, making it harder to catch additional falling hay. Therefore, 
players need to empty the collection bucket at the right time to maintain stability.

#### **Game Mechanics**
Building upon **Grass Catching**, **Haystacking** introduces increased difficulty and strategic depth. In 
single-player mode, players must avoid falling shovels and buckets while collecting stars to gain extra lives. 
In two-player mode, players can either cooperate to reach a shared goal or compete to be the first to achieve 
the target. As haystack accumulation increases, movement speed gradually slows down, making the later stages 
of the game more challenging and strategic.

#### **Game Significance**
The game tests players’ reflexes, spatial awareness, and strategic planning skills while creating a relaxed 
yet challenging farm-harvesting atmosphere. With simple and intuitive controls, **Haystacking** offers both excitement and tension. Whether playing solo or competing with friends, this game delivers a uniquely entertaining experience!

#### Table 1: Game Elements
| Category  | Image  | Description  |
|-----------|--------|--------------|
| **Collection Basket** | ![Basket](image/basket.png) | The basket where players store the collected hay. Players need to transfer the caught hay into the basket to tally their score. |
| **Player** | ![Player](image/player.png) | The character controlled by the player, moving left and right to catch falling hay. |
| **Lifting Basket** | ![Lifting Basket](image/lifting_basket.png) | A secondary basket used for catching hay before transferring it to the main collection basket. |
| **Falling Hay** | ![Falling Hay](image/falling_hay.png) | The hay stacks that fall from the sky. Players must catch them efficiently to reach the target before time runs out. |

### Requirements 

- 15% ~750 words
- Use case diagrams, user stories. Early stages design. Ideation process. How did you decide as a team what to develop? 

#### Epic 1: Core gameplay mechanics is sound 
**User Story 1.1:**

As a player, I want to move my platform left and right so that I can catch falling haystack.

Acceptance Criteria:
- Given I am on the game, when I press left and right arrow keys, then the platform should move soomthly.
- Given I am on the game, when I release the arrow keys, then the movement should stop.
- Given I am on the game, when I try to move the platform off-screen, then the platform should stop.
  
**User Story 1.2:**

As a player, I want haystack to land realistically on top of each other so that the stack looks natural.

Acceptance Criteria:
- Given I am on the game, when the haystack lands unevenly, then it can fall off the platform.
- Given I am on the game, when the player moves, then the stack moves with the platform.
- Given I am on the game, when the player collects more haystack on their platform, then they should move slower.

**User Story 1.3:**

As a player, I want to lose a life if I miss a haystack and get hit by an obstacle so that the game remains challenging.

Acceptance Criteria:
- Given I am on the game, when I miss a haystack or gets hit by an obstacle, then I should lose a life. 
- Given I am on the game, when I lose all my lives, then a game-over screen should appear.
- Given I am on the game, when I gain or lose a life, then I should be able to tell how many remaining lives there are from the interface.

---

#### Epic 2: Enhance user interface and experience.
**User Story 2.1:**

As a player, I want to see my score so that I can track my progress.

Acceptance Criteria:
- Given I am on the game, when I empty my haystack into the bucket, then I should see score update in real-time. 

**User Story 2.2:**

As a player, I want to pause and restart the game so that I can take breaks or retry.

Acceptance Criteria:
- Given I am on the game, when I click the pause button, then I should be given the options to pause, resume, or restart the game.

---

#### Epic 3: Include multiplayer mode.
**User Story 3.1:**

As two players, we want to play against each other on split screen so that we can compete.

Acceptance Criteria:
- Given two players in the competitive mode, when one player moves their platform, then the other player should be able to move their platform independently.
- Given two players in the competitive mode, when one player reaches the target score first, then they should win the game.

**User Story 3.2:**

As two players, we want to work with each other so that we can beat the level together.

Acceptance Criteria:
- Given two players in the co-op mode, when they clash, then they should be able to move past each other.
- Given two players in the co-op mode, when they catch the haystack, then they should contribute to the same haystack bucket.

---

#### Epic 4: Make the game challenging.
**User Story 4.1:**

As a player, I want the game to get harder over time so that it stays engaging.

Acceptance Criteria:
- Given I am on the game, when the game progresses, then the speed of falling haystack should increase.
- Given I am on the game, when the game progresses, then new obstacles or object types should appear over time.

**User Story 4.2:**

As a player, I want to collect power-ups so that I can gain advantages.

Acceptance Criteria:
- Given I am on the game, when I catch a bonus object (e.g., stars), then I should gain an extra life.
- Given I am on the game, when I catch a bonus object (e.g., stars), then a visual indicator should appear to show that I have gained an extra life.

---

#### Epic 5: Increase Accessibility.
**User Story 5.1:**

As a new player, I want simple controls so that I can learn the game quickly.

Acceptance Criteria:
- Given I enters the game, when I click the question mark button, then I should see a short totorial explaining how to play.
- Given I am on the game, when the game progresses, then I should see a short tutorial indroducing any new objects or obstacles. 

**User Story 5.2:**

As a player, I want to adjust game settings so that I can play comfortably.

Acceptance Criteria:
- Given I am on the game, when I click the setting button, then I should be able to change the volume of background music and other sound effect.
- Given I am a user with low vision, when I click the setting button, then I should be able to resize text. 
  
### Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams. 

### Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the three areas of challenge in developing your game. 

### Evaluation

- 15% ~750 words

- One qualitative evaluation (your choice) 

- One quantitative evaluation (of your choice) 

- Description of how code was tested. 

### Process 

- 15% ~750 words

- Teamwork. How did you work together, what tools did you use. Did you have team roles? Reflection on how you worked together. 

### Conclusion

- 10% ~500 words

- Reflect on project as a whole. Lessons learned. Reflect on challenges. Future work. 

### Contribution Statement

- Provide a table of everyone's contribution, which may be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Let us know as soon as possible if there are any issues with teamwork as soon as they are apparent. 

### Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5%) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.

- **Documentation** of code (5%)

  - Is your repo clearly organised? 
  - Is code well commented throughout?
