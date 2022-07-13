const selectionButtons = document.querySelectorAll('[data-selection]');
const SELECTIONS = [
    {"name": "rock", "beats": "scissors", "emoji": "✊"},
    {"name": "paper", "beats": "rock", "emoji": "✋"},
    {"name": "scissors", "beats": "paper", "emoji": "✌"}
]
const finalColumn = document.querySelector('[data-final-column]');
const playerScore = document.querySelector('[data-your-score]');
const computerScore = document.querySelector('[data-computer-score]');

selectionButtons.forEach(selectionButton => {
    selectionButton.addEventListener('click', e => {
        const selectionName = selectionButton.dataset.selection;
        const selection = SELECTIONS.find(selection => selection.name === selectionName);
        makeSelection(selection);
    });
});

function makeSelection(selection) {
    const computerSelection = randomSelection();
    const isPlayerWinner = isWinner(selection, computerSelection);
    const isComputerWinner = isWinner(computerSelection, selection);

    addSelectionResult(computerSelection, isComputerWinner);
    addSelectionResult(selection, isPlayerWinner);

    if (isPlayerWinner) incrementScore(playerScore);
    if (isComputerWinner) incrementScore(computerScore);
}

function incrementScore(scoreElement) {
    scoreElement.innerText = parseInt(scoreElement.innerText) + 1;
}

function addSelectionResult(selection, isWinner) {
    const div = document.createElement('div');
    div.innerText = selection.emoji;
    div.classList.add('result-selection');
    if (isWinner) div.classList.add('winner');
    finalColumn.after(div);
}

function isWinner(playerSelection, computerSelection) {
    return playerSelection.beats === computerSelection.name
}

function randomSelection() {
    const randomIndex = Math.floor(Math.random() * SELECTIONS.length);
    return SELECTIONS[randomIndex];
}

