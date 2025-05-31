# WorldExplorer
World Explorer – Fun Fact & Flag Quiz
World Explorer is a purely client‐side React application that helps users explore every country in the world and test their geography knowledge—no custom server or database required. All country data comes directly from the REST Countries API, and any user‐specific state (quiz progress, challenge links, etc.) is held in local browser storage. Players can:

Explore

Browse a searchable, alphabetically sorted grid of all nations with flag previews, capitals, populations, currencies, and fun cultural tidbits.

Click a country to see more details (larger flag, extended facts, etc.).

Quiz Modes

Flag Quiz: Identify a country from its flag (multiple choice).

Capital Quiz: Match a capital city to its country.

Language Quiz: Guess a country by one or more of its official languages.

Each quiz is ten questions, with instant feedback and a final score summary.

Social Challenges (Front‐end Only)

Generate a shareable quiz link that embeds a randomized question set and your high score.

Share via copy‐to‐clipboard or any messaging platform.

Anyone who opens that link can take the same question set (asynchronously) and compare results—no login or backend required.

Leaderboards & Tracking

Each quiz session’s score is stored in localStorage so you can revisit your personal high scores.

A “Global” leaderboard section simply shows top scores from all users who have run the app on your own machine (i.e., browser storage), so it’s scoped per device.

Offline & Performance‐Friendly

Country data is fetched once and cached in sessionStorage (or IndexedDB, if you prefer) so repeat visits are faster.

Quizzes themselves work entirely offline once the questions are loaded.

