// Global variable for storing the dictionary
let dictionary = [];

// Helper function to check if a character is a vowel
function isVowel(c) {
    return 'aeiouAEIOU'.includes(c);
}

// Function to calculate the penalty between two characters
function getPenalty(c1, c2) {
    if (c1 === c2) {
        return 0;  // Exact match
    }
    if (isVowel(c1) && isVowel(c2)) {
        return 1;  // Vowel/Vowel mismatch
    }
    if (!isVowel(c1) && !isVowel(c2)) {
        return 1;  // Consonant/Consonant mismatch
    }
    return 3;  // Vowel/Consonant mismatch
}

// Function to compute the minimum penalty score using dynamic programming
function minPenalty(inputWord, dictWord) {
    const n = inputWord.length;
    const m = dictWord.length;

    // Create a DP table
    let dp = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));

    // Initialize the first row and column with gap penalties
    for (let i = 1; i <= n; i++) {
        dp[i][0] = dp[i - 1][0] + 2;
    }
    for (let j = 1; j <= m; j++) {
        dp[0][j] = dp[0][j - 1] + 2;
    }

    // Fill the DP table
    for (let i = 1; i <= n; i++) {
        for (let j = 1; j <= m; j++) {
            let penalty = getPenalty(inputWord[i - 1], dictWord[j - 1]);
            dp[i][j] = Math.min(
                dp[i - 1][j - 1] + penalty,  // No gap, character comparison
                dp[i - 1][j] + 2,  // Gap in input word
                dp[i][j - 1] + 2   // Gap in dictionary word
            );
        }
    }

    return dp[n][m];
}

// Function to get the top N suggestions based on minimum penalty scores
function getTopSuggestions(inputWord, dictionary, topN = 10) {
    let wordScores = [];
    for (let word of dictionary) {
        let score = minPenalty(inputWord, word);
        wordScores.push({ word, score });
    }

    // Sort words by penalty score and take the top N
    wordScores.sort((a, b) => a.score - b.score);
    return wordScores.slice(0, topN);
}

// Function to load the dictionary from a text file
function loadDictionary() {
    fetch('dictionary.txt')
        .then(response => response.text())
        .then(text => {
            // Split the text into words and store them in the dictionary array
            dictionary = text.split('\n').map(word => word.trim().toLowerCase()).filter(word => word);
            console.log("Dictionary loaded with " + dictionary.length + " words.");
        })
        .catch(error => {
            console.error("Error loading dictionary:", error);
        });
}

// Function to display the suggestions
function getSuggestions() {
    const inputWord = document.getElementById("inputWord").value.trim().toLowerCase();
    if (!inputWord) {
        alert("Please enter a word.");
        return;
    }

    if (dictionary.length === 0) {
        alert("Dictionary is not loaded yet.");
        return;
    }

    const suggestions = getTopSuggestions(inputWord, dictionary);

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = "<h2>Suggestions:</h2>";

    suggestions.forEach((suggestion) => {
        const suggestionDiv = document.createElement("div");
        suggestionDiv.classList.add("word-suggestion");
        suggestionDiv.innerText = `${suggestion.word}: Penalty Score = ${suggestion.score}`;
        resultDiv.appendChild(suggestionDiv);
    });
}

// Load the dictionary when the page is loaded
window.onload = loadDictionary;
