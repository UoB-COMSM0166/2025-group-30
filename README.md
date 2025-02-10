# 2025-group-30
2025 COMSM0166 group 30

## Your Game

Link to your game [PLAY HERE](https://peteinfo.github.io/COMSM0166-project-template/)

Your game lives in the [/docs](/docs) folder, and is published using Github pages to the link above.

Include a demo video of your game here (you don't have to wait until the end, you can insert a work in progress video)

## Your Group

Add a group photo here!

- Group member 1, name, email, role
- Group member 2, name, email, role
- Group member 3, name, email, role
- Group member 4, name, email, role
- Group member 5, name, email, role
- Group member 6, name, email, role

## Project Report

### Introduction

- 5% ~250 words 
- Describe your game, what is based on, what makes it novel? 

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
