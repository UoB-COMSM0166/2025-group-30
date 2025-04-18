# 2025-group-30
2025 COMSM0166 group 30

## Table of Contents
- [Game](#game)
- [Team](#team)
- [Introduction](#introduction)
- [Requirements](#requirements)
- [Design](#design)
- [Implementation](#implementation)
- [Evaluation](#evaluation)
- [Sustainability](#sustainability)
- [Process](#process)
- [Conclusion](#conclusion)
- [Contribution Statement](#contribution-statement)

## Game

Link to your game [PLAY HERE](https://uob-comsm0166.github.io/2025-group-30/) 

Your game lives in the [docs](/docs) folder, and is published using Github pages to the link above.

Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)
[🎬 Click here to watch the demo video](https://github.com/UoB-COMSM0166/2025-group-30/blob/nemo/videos/demo%20video.MP4)

## Team

<div align="center">
  <img src="https://github.com/user-attachments/assets/eb3712a0-9c24-4ab3-aac4-865b2566a9b3" width="500" >
</div>

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

## Introduction


Our game is a casual stacking challenge inspired by a classic mini-game from the popular title *Mole Manor*. Drawing from its gameplay, we set the game’s backdrop during the harvest season on a farm. Players must control their character’s left and right movements to catch falling haystacks and place them into a basket within a limited time in order to reach the collection goal and advance to the next level.

To increase the game’s difficulty and reflect real-world limitations on how much a person can carry, each player can catch a maximum of five haystacks at a time. If this limit is exceeded, the character will stumble and drop all collected hay. This mechanic not only adds tension but also introduces strategic decision-making—players must carefully balance between collecting more hay and emptying their basket in time.

As hay accumulates, the character’s movement speed gradually slows down, requiring players to choose the right moment to clear their collection bucket and maintain agility. Building on the original gameplay, the game introduces more challenging elements: in single-player mode, players must dodge falling shovels and buckets while collecting stars for extra lives. In two-player mode, players can either collaborate to achieve a shared goal or compete to see who finishes first. These design features enrich the gameplay and deliver a fun, fast-paced, yet relaxing farm harvest experience.

The following table shows the main elements of the game:
#### Table 1: Game Elements
| Category  | Image  | Description  |
|-----------|--------|--------------|
| **Player & lifting basket** | <img src="docs/assets/player1.webp" width="50" style="vertical-align: middle;"> | The character controlled by the player, moving left and right to catch falling hay. |
| **collection Basket** | <img src="docs/assets/basket.webp" width="50" style="vertical-align: middle;"> | A secondary basket used for catching hay before transferring it to the main collection basket. |
| **Falling Hay** | <img src="docs/assets/hay.webp" width="50" style="vertical-align: middle;"> | The hay stacks that fall from the sky. Players must catch them efficiently to reach the target before time runs out. |

- 5% ~250 words 
- Describe your game, what is based on, what makes it novel? 

## Requirements 
- 15% ~750 words
- Use case diagrams, user stories. Early stages design. Ideation process. How did you decide as a team what to develop? 

### Game Idea Brainstorming Overview

As part of our early ideation process, our team participated in a collaborative brainstorming session to generate and explore a variety of game concepts. We studied a wide range of existing games, focusing on their core mechanics, player engagement strategies, and potential for creative development. Our goal was to identify gameplay elements that are not only fun and challenging, but also flexible enough to allow for innovation and adaptation.

The table below summarizes our findings. For each game, we described its core concept and proposed potential extensions or twists to make the gameplay more unique, engaging, or suitable for different audiences and platforms.

| Game Genre             | Game Inspiration      | Game Description                                                                                                                             | Creative Expansion Ideas                                                                                                                           |
|------------------------|------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| Puzzle Game            | Car Park Puzzle        | A logic-based game where players must move surrounding vehicles forward or backward to clear a path for their own car to exit the parking lot. | - Dynamically generate car layouts based on difficulty <br> - Add cars facing different directions <br> - Bus station mode: match passengers with buses <br> - Real-world elements like crosswalks, truck unloading zones |
| Cooperative Puzzle Platformer | Fireboy & Watergirl | Two players work together to navigate levels by controlling Fireboy and Watergirl, each immune to their respective element. Touching the wrong element or falling results in failure. | - New elements like electricity/ice/wind <br> - Attribute swapping mechanics <br> - Time-limited challenges and multiple endings <br> - Unlockable skills and collectibles |
| Casual Reaction Game   | Flappy Bird            | Players tap to keep a bird in the air and avoid pipes. Each successful pass earns one point. The game restarts upon failure.                   | - Moving or rotating obstacles <br> - Power-up system: shields, speed boosts <br> - Multiplayer co-op or versus mode <br> - Timed bonus collection mode |
| Multiplayer Cooperative Puzzle | Pico Park             | Players collect keys and open gates while navigating obstacles together. Movement is limited to up, down, left, and right. Supports 2–8 players. | - Random events triggered by pressure plates <br> - Fog to limit visibility <br> - Assign unique skills to each player (fly, climb, lift) <br> - Add immersive story mode |
| Strategy + Reflex Mini Game | Grass Catching         | Players catch falling grass. The more they collect, the slower they move, increasing challenge and requiring strategic movement and timing.    | - Cooperative or versus mode <br> - Special grass types (e.g. poison, explosive) <br> - Weather effects influencing falling patterns <br> - Speed boost or weight-reducing power-ups |

#### Game Delection Process

As part of our game development planning, our team initially brainstormed and analyzed five different game inspirations. After careful discussion and evaluation, we shortlisted two candidates for prototyping:Fireboy & Watergirl and Grass Catching.

To better understand and experience the game mechanics, we created paper prototypes for both games. By interacting with the prototypes directly, we were able to simulate the core gameplay and interaction flow, design basic maps and character movement paths, observe players’ intuitive understanding and reactions, and evaluate whether the gameplay was engaging and expandable.

The following are our paper prototypes for Fireboy & Watergirl and Grass Catching.

<div style="display: flex; justify-content: center; gap: 30px;">

  <div style="text-align: center;">
    <strong>Paper Prototype of Grass-Catching Game</strong><br>
    <video src="https://github.com/user-attachments/assets/2bc9ad40-728b-4c61-b258-6c2530942f93"
           controls
           style="width: 360px; height: 240px; object-fit: cover; background: black;"></video>
  </div>

  <div style="text-align: center;">
    <strong>Paper Prototype of Fireboy & Watergirl Game</strong><br>
    <video src="https://github.com/user-attachments/assets/15159520-670e-4dd5-a12c-df1f558a09c6"
           controls
           style="width: 360px; height: 240px; object-fit: cover; background: black;"></video>
  </div>

</div>

### Final Decision
After multiple rounds of testing and team feedback, we ultimately selected Grass Catching as the core game for our project. This decision was based on several key factors: the gameplay mechanics are simple yet offer meaningful challenge, making the game easy to implement while allowing for depth through the addition of items, constraints, and variations.

It also features high replayability—players slow down as they collect more grass, creating a naturally increasing difficulty curve well-suited for score-based challenges. Furthermore, the concept has great potential for creative expansion, such as adding multiplayer modes, weather effects, special types of grass, and animated visual effects. Finally, its intuitive gameplay makes it highly accessible and easy to promote, appealing to a wide range of players and suitable for release on web or mobile platforms.

### Digital Paper Prototype tool

To help players quickly get familiar with the game, we created a digital model based on the paper prototype. Hanying attempted to generate the digital model using her iPad, which allowed for a representation that more closely resembled the actual game compared to the paper prototype.

This animation shows the player successfully catching the grass and placing it into the barrel.

<p align="center"><b>Success</b></p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/dfb59e37-652d-4112-a203-70f36f721ae3" width="500">
</p>

This animation shows the player failing to catch the grass and losing one life as a result.

<p align="center"><b>Failed</b></p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/a21f37c9-d280-421e-a664-1148eeae3f51" width="500">
</p>

**Project overview**

The project aims to develop a simple 2D mini-game where players stack square grass blocks.
Initially, we considered using different shapes for stacking as the core gameplay mechanism and planned to integrate an external physics engine for realistic physics simulation. 
However, after preliminary research and technical assessment, we found that our current skill level poses certain limitations in implementing this approach. Therefore, we reassessed the feasibility.
Eventually, we decided to remove the physics engine and use a simple square grass block stacking mechanism to reduce technical complexity.

### User Stories and Epics
At the early stage of the project, we created initial user stories based on the behavior patterns and expectations of different types of players (such as casual players, hardcore players, social players, etc.), in order to ensure that the core gameplay of HayStacking would meet the diverse needs of its target users.

In the later development phase, we further refined and expanded these user stories by incorporating a sustainability perspective, particularly drawing from the five dimensions defined in the SusAF framework: Individual, Social, Environmental, Economic, and Technical. This allowed us to evaluate the potential impacts of the game from a more holistic standpoint. The following table presents the finalized user stories along with their corresponding acceptance criteria.
<table>
<tr>
  <th style="width: 12%;">User Type</th>
  <th style="width: 15%;">Epic</th>
  <th style="width: 35%;">User Story</th>
  <th style="width: 38%;">Acceptance Criteria</th>
</tr>

<tr>
  <td>Developer</td>
  <td>Modular Architecture</td>
  <td>As a developer, I want the game logic to be modular so that it is easy to maintain and expand later.</td>
  <td>Given I am updating the game, when I modify a gameplay function, then it should not affect unrelated systems or cause bugs.</td>
</tr>
<tr>
  <td>Casual Player</td>
  <td>Beginner-Friendly Experience</td>
  <td>As a casual player, I want the game controls to be simple and intuitive so that I can quickly learn and enjoy the game.</td>
  <td>Given I am playing the game, when I use the controls, then they should be minimal and easy to understand.</td>
</tr>
<tr>
  <td></td>
  <td></td>
  <td>As a casual player, I want a clear tutorial when I first enter the game so that I can quickly learn how to play.</td>
  <td>Given it is my first time entering the game, when I start playing, then a tutorial should appear explaining the basic controls and rules.</td>
</tr>
<tr>
  <td></td>
  <td></td>
  <td>As a casual player, I want a pause and resume function so that I can play at my own pace.</td>
  <td>Given I am in a game session, when I click the pause button, then I should be presented with options to pause, resume, or restart.</td>
</tr>
<tr>
  <td></td>
  <td>Replayability</td>
  <td>As a casual player, I want to replay levels to improve my skills and gain a sense of achievement.</td>
  <td>Given I complete a level, when I choose to replay, then I should be able to restart the same level without restrictions.</td>
</tr>
<tr>
  <td>Hardcore Player</td>
  <td>Character Progression</td>
  <td>As a hardcore player, I want to upgrade my character’s equipment so that I can compete at higher difficulty levels.</td>
  <td>Given I have in-game currency or rewards, when I visit the store, then I should be able to buy gear to enhance my character.</td>
</tr>
<tr>
  <td></td>
  <td></td>
  <td>As a hardcore player, I want to compare scores with my friends so that I can compete with them.</td>
  <td>Given I have friends added in-game, when I view the friends leaderboard, then I should see their scores to compare with mine.</td>
</tr>
<tr>
  <td></td>
  <td>Game Challenge</td>
  <td>As a hardcore player, I want the game to become more challenging over time so that it remains engaging.</td>
  <td>Given the game progresses, when I reach higher levels, then the game should introduce faster speeds or new obstacles.</td>
</tr>
<tr>
  <td>Social Player</td>
  <td>Multiplayer Mode</td>
  <td>As a social player, I want to compete or cooperate with my friends so that we can play together.</td>
  <td>Given I enter multiplayer mode, when I choose competitive or co-op, then the game should support both modes and show rankings after matches.</td>
</tr>
<tr>
  <td>Creative Player</td>
  <td>Character Customization</td>
  <td>As a creative player, I want to customize my character so that I can personalize my gaming experience.</td>
  <td>Given I open the customization menu, when I select different options, then I should be able to save and use them in-game.</td>
</tr>
<tr>
  <td>Detail-Oriented Player</td>
  <td>Realistic Physics</td>
  <td>As a detail-oriented player, I want realistic physics for stacking objects and accurate sound effects when catching items.</td>
  <td>Given I am stacking hay or catching it, when physics interactions occur, then they should follow real-world rules and trigger appropriate sound effects.</td>
</tr>
</table>

**Requirement Analysis**

#### 1. User Requirements
- Players should be able to control and stack square grass blocks smoothly

#### 2. Technical Requirements
- Client-side Development: Implement the game interface and handle user input
- Physics Simulation: Remove the external physics engine and use a simple square block stacking mechanism

#### Technical Feasibility Study

##### Initial Plan
- Use an external physics engine (e.g., Box2D, Matter.js) for simulating different shape interactions
- Requires complex physics calculations, including collision detection and gravity simulation

##### Feasibility Evaluation
- Lack of experience in physics engine development makes debugging and optimization challenging
- Complex physics calculations may lead to high computational resource consumption, affecting game performance

##### Alternative Plan
- Switch to simple square grass block stacking without relying on an external physics engine
- Use a rule-based stacking method where each block is placed according to predefined logic
- Implement basic rectangle overlap detection for collision handling to improve development efficiency

Based on the feasibility analysis, we have decided to adjust the game design by abandoning the complex physics engine integration and opting for a simple square grass block stacking mechanism. This will reduce technical difficulty, improve development efficiency, and ensure game stability.

### Stakeholders Analysis 

<p align="center"><strong>Onion Model</strong></p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/5ef9c5c4-04e5-4d8f-b85d-7bf6b9ef1358" width="500">
</p>

#### Core Layer: Group 30
Group 30-2025 are the core creators of the game, responsible for its design, development, and implementation. They determine the quality, gameplay, and overall experience of the game.

#### Internal Layer: Players and Lecturers
- **Players**: The end-users of the game, including:
  - New Players
  - Old Players
  - Casual Players
  - Competitive Players
- **Lecturers**: The evaluators of the assignment, responsible for assessing the quality of the game and whether it meets course requirements

### Competition Layer: Other Teams
Other teams are competitors in the assignment, and their performance may influence the evaluation by lecturers and bystanders.

### External Layer: Broader Audience
Bystanders are potential users who may not directly participate in the game but could be attracted to become new players.

<p align="center"><strong>Use Case Diagram</strong></p>

<p align="center">
  <img width="925" alt="Image" src="https://github.com/user-attachments/assets/1f5c1da4-c239-4662-898a-9b46e998b081" />
</p>

### 1. Players
Players are the primary users of the game, interacting with the game system to achieve objectives.

Main Use Cases:
- Choose game mode: Select between single-player or multi-player mode
- Play game: Control character movement, catch grass, and drop grass into the basket
- Pause game: Pause the current game

### 2. Developers
Developers are responsible for maintaining and updating the game to ensure it runs smoothly.

Main Use Cases:
- Debug game: Fix errors in the game
- Update game: Add new features or optimize existing ones
- Test game: Test the game to ensure stability
- Monitor game: Monitor the game's performance to identify potential issues

### 3. Game System
Game system manages the core logic and state of the game.

Main Functions:
- Update score: Update the score when players drop grass into the basket
- Decrease lives: Reduce lives when players fail
- Level up: Increase game difficulty when players reach a certain score
- Game over: End the game when lives reach zero
  
## Design

- 15% ~750 words 
- System architecture. Class diagrams, behavioural diagrams. 

## Implementation

- 15% ~750 words

- Describe implementation of your game, in particular highlighting the three areas of challenge in developing your game. 

## Evaluation
To ensure a balance between functionality and usability during the game development process, we chose to combine both qualitative and quantitative evaluation methods. Qualitative analysis helped us identify issues within the game, while quantitative evaluation provided insights into user perceptions, guiding us to iteratively improve the design.
### Qualitative Evaluation - Heuristic Evaluation
 For the qualitative method, we adopted Heuristic Evaluation, a practical and widely used approach that examines the interface based on Nielsen’s ten usability principles. By systematically reviewing each screen of our game, we identified several usability issues, including unclear navigation flow, inconsistent system feedback, limited user control, and lack of clarity in competitive scoring. Each issue was evaluated across three dimensions—Frequency, Impact, and Persistence—to calculate a severity score and prioritize the most critical problems.The results are shown in the following table:
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

Based on the severity scores in the evaluation table, we will prioritize addressing high-severity issues, such as speed inconsistency across platforms and insufficient time display in multiplayer mode.    next development focus will be on enhancing the user experience by improving UI feedback, adding return and help buttons, and introducing a store system for character/tool customization. Through these improvements, we aim to create a smoother, more intuitive, and more engaging gameplay experience.

### Quantitative Evaluation - SUS evaluation
We collected and analyzed SUS questionnaire data from 12 users for both Level 1 and Level 2, calculating their total SUS scores. We then used the Wilcoxon Signed-Rank Test to examine whether there was a statistically significant difference in usability scores between the two levels. Click [here](sus.md) to see the raw data.
<div align="center">
  <img src="SUS evaluation.png" width="533">
</div>

<div align="center">
  <img src="averageScore.png" width="533">
</div>
The results of the Wilcoxon Signed-Rank Test for the System Usability Scale (SUS) scores show no statistically significant difference between the two difficulty levels (W = 10.5, p = 0.5461). Although individual user scores vary slightly, both the easy and hard levels received generally high SUS scores. This suggests that users found the game to be consistently usable across both difficulty settings.


- 15% ~750 words

- One qualitative evaluation (your choice) 
- One quantitative evaluation (of your choice) 
- Description of how code was tested. 

## Sustainability


## Process

In this project, our team adopted the **Scrum** framework, a core methodology in Agile development, to organize teamwork and manage task progression. This approach ensured our project followed a structured workflow while staying aligned with the weekly teaching schedule.

---

### 🗂 Project Management and Task Allocation

We used **GitHub’s Kanban Board** to visualize project tasks and track progress. Each week, based on the course schedule, we set **Sprint goals** and assigned tasks to team members. Tasks were categorized into three stages:

- 🟡 **To Do**
- 🔵 **In Progress**
- 🟢 **Done**

Responsibilities such as asset creation, audio collection, and documentation were distributed organically among team members, reflecting our self-organizing working style. This helped us clearly monitor each task’s status and streamline our workflow.

---

### 🔀 Version Control and Code Management

We used **Git** for version control. Each member worked on their own **feature branch**. After completing their work, they submitted a **Pull Request** for code review. Only after approval would the code be merged into the `main` branch.  
This ensured code quality and minimized the risk of conflicts.

---

### 👥 Team Meetings and Collaboration

We held **meetings every week** to:

- ✅ Review current progress
- ✅ Analyze completed tasks
- ✅ Discuss existing issues
- ✅ Distribute new tasks

After each meeting, we updated the **Kanban board** to reflect progress and task updates, keeping everyone aligned. Even for bug fixing or visual polish tasks, the team collaborated without rigid role assignments.

---

### 💬 Communication Tools

We used **WhatsApp** for quick daily communication and **Teams** for formal discussions and screen sharing.  
This setup supported efficient, consistent collaboration, even during remote work.

---

### 🌱 Agile Practices and Flexibility

While our work followed a Sprint-based structure, internal task distribution remained flexible. Members took initiative to work on tasks based on their interests and expertise.  
Tasks such as tutorial UI, sound design, asset preparation, and even bug fixing were shared among the team in a collaborative and adaptive way. This self-organizing model allowed us to stay responsive, communicate openly, and maintain consistent progress.

---

### ✅ Summary

By combining **Scrum methodology**, **Kanban-based task tracking**, and **frequent team communication**, we enhanced our development efficiency, maintained progress, and built a strong, collaborative work environment.

- 15% ~750 words

- Teamwork. How did you work together, what tools did you use. Did you have team roles? Reflection on how you worked together. 

## Conclusion

- 10% ~500 words

- Reflect on project as a whole. Lessons learned. Reflect on challenges. Future work. 

## Contribution Statement
| Name |Contribution |
|------------|----------|
| Lingchen Li |  |
| Lei Gao |  |
| Hanying Bian |  |
| Shiyu Dou |  |
| Zhuoyan Qiu |  |
| Liyang Li |  |

- Provide a table of everyone's contribution, which may be used to weight individual grades. We expect that the contribution will be split evenly across team-members in most cases. Let us know as soon as possible if there are any issues with teamwork as soon as they are apparent. 

## Additional Marks

You can delete this section in your own repo, it's just here for information. in addition to the marks above, we will be marking you on the following two points:

- **Quality** of report writing, presentation, use of figures and visual material (5%) 
  - Please write in a clear concise manner suitable for an interested layperson. Write as if this repo was publicly available.

- **Documentation** of code (5%)

  - Is your repo clearly organised? 
  - Is code well commented throughout?
