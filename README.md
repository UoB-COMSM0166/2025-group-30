# 2025-group-30
2025 COMSM0166 group 30

## Your Game

Link to your game [PLAY HERE](https://uob-comsm0166.github.io/2025-group-30/) 

Your game lives in the [/docs](/docs) folder, and is published using Github pages to the link above.

Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)
[🎬 Click here to watch the demo video](https://github.com/UoB-COMSM0166/2025-group-30/blob/nemo/videos/demo%20video.MP4)

## Table of Contents

## Development Team

Add a group photo here!

<div align="center">

| Name | Email | GitHub username |
|------------|------------------------------------|----------------|
| Lingchen Li | [yf24777@bristol.ac.uk](mailto:yf24777@bristol.ac.uk) | lingchen2333 |
| Lei Gao | [yt24392@bristol.ac.uk](mailto:yt24392@bristol.ac.uk) | Muilka |
| Hanying Bian | [oo24343@bristol.ac.uk](mailto:oo24343@bristol.ac.uk) | Hanying-Bian |
| Shiyu Dou | [hl24597@bristol.ac.uk](mailto:hl24597@bristol.ac.uk) | hl24597 |
| Zhuoyan Qiu | [rp24358@bristol.ac.uk](mailto:rp24358@bristol.ac.uk) | 1003-qzy |
| Liyang Li | [gq24742@bristol.ac.uk](mailto:gq24742@bristol.ac.uk) | Misaki-1 |

</div>


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

#### Inspiration

In the first week of our game project, we held a team meeting to discuss various game ideas based on our understanding of different game concepts. We evaluated each idea based on familiarity, innovation, and feasibility, ultimately brainstorming five potential game concepts. After thorough discussion, we conducted a vote, and the Grass Catching Game emerged as the final winner.

The inspiration for our grass-catching game comes from Mole's World. Unlike the grass-catching mechanics in Mole's World, where the grass follows a parabolic trajectory, our game adopts a vertical free-fall motion, emphasizing players' reaction speed and precise judgment. Additionally, the grass may have different falling speeds and shapes, allowing for difficulty adjustments that present players with more challenging grass-catching tasks.

#### Prototype

During the conceptualization of the grass-catching game, we created a paper prototype to help visualize and test early game mechanics, including the way the grass falls, as well as the player's movement and interactions. Based on our initial discussions, we refined the game flow and mechanics, adding new elements to enhance the game's fun and challenge. To provide players with a clearer understanding of the game, we created a video based on the paper prototype, offering an intuitive demonstration of the gameplay.


<div style="text-align: center;">
  <strong>Paper Prototype of Grass-Catching Game</strong>
</div>

<div style="text-align: center;">
  <video src="https://github.com/user-attachments/assets/2bc9ad40-728b-4c61-b258-6c2530942f93" controls width="600"></video>
</div>


#### Digita Paper Prototype tool

To help players quickly get familiar with the game, we created a digital model based on the paper prototype. Hanying attempted to generate the digital model using her iPad, which allowed for a representation that more closely resembled the actual game compared to the paper prototype.

<p align="center"><b>Digital·Paper·Prototype·Tool</b></p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/dfb59e37-652d-4112-a203-70f36f721ae3" width="500">
</p>

<p align="center"><b>Failed</b></p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/a21f37c9-d280-421e-a664-1148eeae3f51" width="500">
</p>

#### User Stories and Epics

<table>
  <tr>
    <th style="width: 12%;">User Type</th>
    <th style="width: 15%;">Epic</th>
    <th style="width: 35%;">User Story</th>
    <th style="width: 38%;">Acceptance Criteria</th>
  </tr>
  <tr>
    <td>Casual Player</td>
    <td>Beginner-Friendly Experience</td>
    <td>As a casual player, I want the game controls to be simple and intuitive so that I can quickly learn and enjoy the game.</td>
    <td>The game should have minimal controls and simple rules to ensure ease of learning.</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td>As a casual player, I want a clear tutorial when I first enter the game so that I can quickly learn how to play.</td>
    <td>A tutorial should appear the first time a player enters the game, explaining basic controls and mechanics.</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td>As a casual player, I want a pause and resume function so that I can play at my own pace.</td>
    <td>Players should be able to pause the game by clicking the "Pause" button and resume from where they left off using the "Continue" button.</td>
  </tr>
  <tr>
    <td></td>
    <td>Replayability</td>
    <td>As a casual player, I want to replay levels to improve my skills and gain a sense of achievement.</td>
    <td>The game should allow players to replay the same level multiple times without restrictions.</td>
  </tr>
  <tr>
    <td>Hardcore Player</td>
    <td>Character Progression</td>
    <td>As a hardcore player, I want to upgrade my character’s equipment so that I can compete at higher difficulty levels.</td>
    <td>Characters should be able to purchase gear using in-game currency or rewards, enhancing their abilities.</td>
  </tr>
  <tr>
    <td></td>
    <td>Ranking System</td>
    <td>As a hardcore player, I want to see global rankings so that I can compete with other players for high scores.</td>
    <td>The main menu should display a leaderboard showing the top 10 players.</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td>As a hardcore player, I want to compare scores with my friends so that I can compete with them.</td>
    <td>The game should include a friends’ leaderboard to compare scores easily.</td>
  </tr>
  <tr>
    <td></td>
    <td>Game Challenge</td>
    <td>As a hardcore player, I want the game to become more challenging over time so that it remains engaging.</td>
    <td>The game should introduce new obstacles or increase speed as the game progresses to enhance difficulty.</td>
  </tr>
  <tr>
    <td>Social Player</td>
    <td>Multiplayer Mode</td>
    <td>As a social player, I want to compete or cooperate with my friends so that we can play together.</td>
    <td>The game should offer both competitive and cooperative two-player modes, with rankings displayed after matches.</td>
  </tr>
  <tr>
    <td>Creative Player</td>
    <td>Character Customization</td>
    <td>As a creative player, I want to customize my character so that I can personalize my gaming experience.</td>
    <td>The character customization menu should offer various appearance options and allow players to save their selections.</td>
  </tr>
  <tr>
    <td>Detail-Oriented Player</td>
    <td>Realistic Physics</td>
    <td>As a detail-oriented player, I want realistic physics for stacking objects and accurate sound effects when catching items.</td>
    <td>Objects should follow physics rules, smoothly falling and settling on surfaces while triggering appropriate sound effects.</td>
  </tr>
</table>
  
### Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams. 

### Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the three areas of challenge in developing your game. 

### Evaluation

- 15% ~750 words

- One qualitative evaluation (your choice) 
#### Heuristic Evaluation Table

<table>
  <tr>
    <th style="width: 15%;">Interface</th>
    <th style="width: 35%;">Issue</th>
    <th style="width: 25%;">Heuristic(s)</th>
    <th style="width: 5%;">F (0-4)</th>
    <th style="width: 5%;">I (0-4)</th>
    <th style="width: 5%;">P (0-4)</th>
    <th style="width: 10%;">Severity</th>
  </tr>
  <tr>
    <td>Main Menu</td>
    <td>The extra "Start" button is unnecessary; players should select the mode first and then start.</td>
    <td>User control and freedom</td>
    <td>3</td>
    <td>3</td>
    <td>3</td>
    <td>3.00</td>
  </tr>
  <tr>
    <td>Mode Selection</td>
    <td>The single-player or multiplayer selection screen lacks a button to return to the main menu.</td>
    <td>User control and freedom</td>
    <td>3</td>
    <td>3</td>
    <td>4</td>
    <td>3.33</td>
  </tr>
  <tr>
    <td>Multiplayer End</td>
    <td>Missing score comparison prevents players from visually comparing their scores.</td>
    <td>Visibility of system status</td>
    <td>3</td>
    <td>3</td>
    <td>4</td>
    <td>3.33</td>
  </tr>
  <tr>
    <td>Multiplayer Gameplay</td>
    <td>The time display is only on the left side, making it difficult for the right-side player to see the remaining time.</td>
    <td>Visibility of system status</td>
    <td>4</td>
    <td>3</td>
    <td>4</td>
    <td>3.67</td>
  </tr>
  <tr>
    <td>Gameplay Speed</td>
    <td>The grass-cutting speed varies on different platforms, affecting the gaming experience.</td>
    <td>Error prevention</td>
    <td>4</td>
    <td>4</td>
    <td>4</td>
    <td>4.00</td>
  </tr>
  <tr>
    <td>Character Store</td>
    <td>The lack of a store system prevents players from selecting different characters or grass-cutting tools.</td>
    <td>Flexibility and efficiency of use</td>
    <td>3</td>
    <td>2</td>
    <td>3</td>
    <td>2.67</td>
  </tr>
  <tr>
    <td>Multiplayer Gameplay</td>
    <td>In multiplayer mode, the character/tool selection cannot meet the personalized needs of different players.</td>
    <td>Flexibility and efficiency of use</td>
    <td>3</td>
    <td>2</td>
    <td>3</td>
    <td>2.67</td>
  </tr>
</table>

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
