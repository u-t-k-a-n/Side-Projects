const characterAmountNumber = document.getElementById('characterAmountNumber');
const characterAmountRange = document.getElementById('characterAmountRange');
const passwordGeneratorForm = document.getElementById('passwordGeneratorForm');
const includeUppercaseElement = document.getElementById('includeUppercase');
const includeNumbersElement = document.getElementById('includeNumbers');
const includeSpecialCharactersElement = document.getElementById('includeSpecialCharacters');
const passwordDisplay = document.getElementById('passwordDisplay');
const UPPERCASE_CHAR_CODES = arrayFromLowestToHighest(65, 90);
const LOWERCASE_CHAR_CODES = arrayFromLowestToHighest(97, 122);
const NUMBER_CHAR_CODES = arrayFromLowestToHighest(48, 57);
const SPECIAL_CHAR_CODES = arrayFromLowestToHighest(33, 47).concat(arrayFromLowestToHighest(58, 64))
                           .concat(arrayFromLowestToHighest(91, 96)).concat(arrayFromLowestToHighest(123, 126));

characterAmountNumber.addEventListener('input', syncCharacterAmount);
characterAmountRange.addEventListener('input', syncCharacterAmount);
passwordGeneratorForm.addEventListener('submit', e => {
    e.preventDefault();
    const characterAmount = characterAmountNumber.value;
    const includeUppercase = includeUppercaseElement.checked;
    const includeNumbers = includeNumbersElement.checked;
    const includeSpecialCharacters = includeSpecialCharactersElement.checked;
    const password = generatePassword(characterAmount, includeUppercase, includeNumbers, includeSpecialCharacters);
    passwordDisplay.innerText = password;
    console.log(password);
});

function syncCharacterAmount(e) {
  const target = e.target.value;
  characterAmountNumber.value = target;
  characterAmountRange.value = target;
}

function arrayFromLowestToHighest(lowest, highest) {
    const array = [];
    for (let i = lowest; i <= highest; i++) {
        array.push(i);
    }
    return array;
}

function generatePassword(characterAmount, includeUppercase, includeNumbers, includeSpecialCharacters) {
    let charCodes = LOWERCASE_CHAR_CODES;
    if (includeUppercase) {
        charCodes = charCodes.concat(UPPERCASE_CHAR_CODES);
    }
    if (includeNumbers) {
        charCodes = charCodes.concat(NUMBER_CHAR_CODES);
    }
    if (includeSpecialCharacters) {
        charCodes = charCodes.concat(SPECIAL_CHAR_CODES);
    }
    const passwordCharacters = [];
    for (let i = 0; i < characterAmount; i++) {
        const characterCode = charCodes[Math.floor(Math.random() * charCodes.length)];
        passwordCharacters.push(String.fromCharCode(characterCode));
    }
    return passwordCharacters.join('');
}