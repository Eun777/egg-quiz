// Story data
const story = [
    {
        img: "start.png", // Add your start illustration here
        text: "What egg are you?",
        options: [{ text: "Start", action: "next" }
        ],
    },
    {
        img: "kitchen.png", // Scene 1 illustration
        text: "You wake up and see that you are in a kitchen. Looking around, you see that you are an egg in an egg basket. What are you thinking?",
        options: [
        { text: "Oh cool, am I an egg now?", points: "sunny" },
        { text: "OH NO! TURN ME BACK TO A HUMAN!", points: "scrambled" },
        { text: "Am I going to get cooked?", points: "hardboiled" },
        ],
    },
    {
        img: "basket.png",
        text: "You see that there is no one around, what do you do?",
        options: [
        { text: "Just stay in place, accept your fate.", points: "poached" },
        { text: "Gotta run!", points: "scrambled" },
        { text: "Let's just stay here and see what is going to happen. Kinda curious lol", points: "sunny" }
        ],
    },
    {
        img: "talking_egg.png",
        text: "The egg to your left starts talking, 'YO WE GOTTA GO!'. What do you reply?",
        options: [
        { text: "Were you once a human too?", points: "hardboiled" },
        { text: "Oh my, can all eggs talk?", points: "scrambled" },
        { text: "Why do we have to go?", points: "poached" }
        ],
    },
    {
        img: "escape_plan.png",
        text: "The talking egg starts wobbling towards the edge of the basket. 'Quick, follow me or stay if you want to be tomorrow's breakfast!' What do you do?",
        options: [
        { text: "Welp, il follow you—what's the worst that could happen anyway?", points: "sunny" },
        { text: "Nah, I'm staying.", points: "hardboiled" },
        { text: "Wait, where are we even going??'", points: "poached" }
        ]
    },
    {
        img: "chef_arrives.png",
        text: "You are dragged out of the basket by your fellow egg friend anyway, and suddenly, you hear footsteps approaching. The chef is back! What's your move?",
        options: [
        { text: "Roll into hiding—maybe under the counter?", points: "poached" },
        { text: "Pretend to be a normal egg. Nobody will suspect a thing.", points: "hardboiled" },
        { text: "Confront the chef. 'HEY! Why am I an egg??'", points: "scrambled" }
        ]
    },
    {
        img: "fridge_stove.png",
        text: "You're now on the run, the left path leads toward the fridge, and the other toward the stove. Where do you go?",
        options: [
        { text: "The fridge. It's cold, but at least I won't get cooked.", points: "sunny" },
        { text: "The stove. If I'm gonna go out, might as well face it head-on.", points: "hardboiled" },
        { text: "Stand there, completely frozen, questioning your life choices.", points: "scrambled" }
        ]
    },
    {
        img: "egg_power.png",
        text: "You are on your way but the chef's hand swoops down to grab you. Suddenly, you hear the egg from earlier yelling, 'USE YOUR INNER EGG POWER!' What do you do?",
        options: [
        { text: "Close your eyes and focus—inner egg power? Sounds legit.", points: "poached" },
        { text: "Accept your fate. You've lived a good life (as an egg).", points: "hardboiled" },
        { text: "Scream for help. Maybe the talking egg will save you?", points: "scrambled" }
        ]
    }
    // Add more questions here
    ];

    let currentQuestion = 0;
    let scores = {
    sunny: 0,
    hardboiled: 0,
    scrambled: 0,
    deviled: 0,
    poached: 0,
    };

    function updateProgressBar() {
    const progress = document.getElementById("progress");
    const progressPercentage = ((currentQuestion / (story.length - 1)) * 100).toFixed(1);
    progress.style.width = `${progressPercentage}%`;
    }

    function displayQuestion() {
    const question = story[currentQuestion];
    const storyDiv = document.getElementById("story");
    const optionsDiv = document.getElementById("options");
    const illustrationImg = document.getElementById("illustration-img");

    updateProgressBar();

    // Update text and image
    illustrationImg.src = question.img;
    storyDiv.textContent = question.text;

    // Update options
    optionsDiv.innerHTML = ""; // Clear previous buttons
    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = option.text;
        button.onclick = () => {
        if (option.action === "next") {
            currentQuestion++;
            displayQuestion();
        } else {
            scores[option.points]++;
            currentQuestion++;
            if (currentQuestion < story.length) {
                displayQuestion();
            } else {
            showResult();
            }
        }
        };
        optionsDiv.appendChild(button);
    });
    }

    function trackLocalCompletion(eggType) {
        // Track total completions
        let completions = JSON.parse(localStorage.getItem('quizCompletions')) || 0;
        completions++;
        localStorage.setItem('quizCompletions', completions);
    
        // Track individual egg results
        let eggStats = JSON.parse(localStorage.getItem('eggStats')) || {
            sunny: 0,
            hardboiled: 0,
            scrambled: 0,
            poached: 0,
            deviled: 0
        };
        eggStats[eggType]++;
        localStorage.setItem('eggStats', JSON.stringify(eggStats));
    
        return {
            userNumber: completions,
            totalCompletions: completions,
            eggStats: eggStats
        };
    }
    
    function calculatePercentage(count, total) {
        return ((count / total) * 100).toFixed(1);
    }
    
// Add result image mapping at the top with your story data
const eggResultImages = {
    sunny: "sunny-egg-result.png",
    hardboiled: "hardboiled-egg-result.png",
    scrambled: "scrambled-egg-result.png",
    poached: "poached-egg-result.png",
    deviled: "deviled-egg-result.png"
};

// Rest of your existing story data and functions remain the same until showResult()

function showResult() {
    const storyDiv = document.getElementById("story");
    const optionsDiv = document.getElementById("options");
    const illustrationImg = document.getElementById("illustration-img");
        
    // Get the highest score
    const highestScore = Object.keys(scores).reduce((a, b) =>
        scores[a] > scores[b] ? a : b
    );

    // Get second highest and lowest scores
    const sortedScores = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const secondHighest = sortedScores[1][0];
    const lowest = sortedScores[sortedScores.length - 1][0];

    // Track completion and get stats
    const stats = trackLocalCompletion(highestScore);

    // Update the illustration to show the corresponding egg type
    illustrationImg.src = eggResultImages[highestScore];

    // Add descriptive text for each egg type
    const eggDescriptions = {
        sunny: "You're optimistic and easy-going, taking life as it comes with a bright outlook!",
        hardboiled: "You're tough on the outside but have a soft heart. Very dependable!",
        scrambled: "You're adaptable and go with the flow, making the best of any situation!",
        poached: "You're sophisticated and precise, with a delicate approach to life!",
        deviled: "You're spicy and adventurous, always adding excitement to any situation!"
    };

    storyDiv.innerHTML = `
        <h2>You are a ${highestScore.replace(/^\w/, c => c.toUpperCase())} Egg!</h2>
        <p>${eggDescriptions[highestScore]}</p>
        <p>You're least like a ${lowest.replace(/^\w/, c => c.toUpperCase())} Egg</p>
        <div class="stats-container">
            <p>You are user #${stats.userNumber}!</p>
            <p>Fun facts about your egg type:</p>
            <p>${calculatePercentage(stats.eggStats[highestScore], stats.totalCompletions)}% of users are ${highestScore.replace(/^\w/, c => c.toUpperCase())} Eggs</p>
            <div class="egg-distribution">
                <p>Egg Type Distribution:</p>
                <p>🍳 Sunny Side Up: ${calculatePercentage(stats.eggStats.sunny, stats.totalCompletions)}%</p>
                <p>🥚 Hard-boiled: ${calculatePercentage(stats.eggStats.hardboiled, stats.totalCompletions)}%</p>
                <p>🍜 Scrambled: ${calculatePercentage(stats.eggStats.scrambled, stats.totalCompletions)}%</p>
                <p>🥚 Poached: ${calculatePercentage(stats.eggStats.poached, stats.totalCompletions)}%</p>
                <p>😈 Deviled: ${calculatePercentage(stats.eggStats.deviled, stats.totalCompletions)}%</p>
            </div>
        </div>
    `;
    optionsDiv.innerHTML = `<button onclick="restart()">Restart</button>`;
}
    // Add some CSS for the stats
    const style = document.createElement('style');
    style.textContent = `
        .stats-container {
            margin-top: 20px;
            padding: 15px;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 10px;
            text-align: center;
        }
    
        .egg-distribution {
            margin-top: 15px;
            padding: 10px;
            background: rgba(252, 239, 214, 0.5);
            border-radius: 8px;
        }
    
        .egg-distribution p {
            margin: 5px 0;
        }
    `;
    document.head.appendChild(style);

    function restart() {
    currentQuestion = 0;
    scores = { sunny: 0, hardboiled: 0, scrambled: 0, deviled: 0, poached: 0 };
    displayQuestion();
    }

  // Initialize
    displayQuestion();
