const strengthMeter = document.getElementById('strength-meter');
const passwordInput = document.getElementById('password-input');
const reasonsContainer = document.getElementById('reasons');

passwordInput.addEventListener('input', updateStrengthMeter);
updateStrengthMeter();

function updateStrengthMeter(){
    const weaknesses = calculatePasswordStrength(passwordInput.value);
    let strength = 100;
    reasonsContainer.innerHTML = '';
    weaknesses.forEach(weakness => {
        if (weakness == null) return;
        strength -= weakness.deduction;
        const messageElement = document.createElement('div');
        messageElement.innerHTML = weakness.message;
        reasonsContainer.appendChild(messageElement);
    });
    strengthMeter.style.setProperty('--strength', strength);
}

function calculatePasswordStrength(password){
    const weaknesses = [];
    weaknesses.push(lengthWeakness(password));
    weaknesses.push(lowercaseWeakness(password));
    weaknesses.push(uppercaseWeakness(password));
    weaknesses.push(numberWeakness(password));
    weaknesses.push(speacialCharacterWeakness(password));
    weaknesses.push(repeatCharacterWeakness(password));
    return weaknesses;
}

function lengthWeakness(password){
    if(password.length <= 5){
        return {
            message: 'Password is too short',
            deduction: 40
        }
    }
    if(password.length <= 10){
        return {
            message: 'Password could be longer',
            deduction: 15
        }
    }
}

function lowercaseWeakness(password){
    return characterTypeWeakness(password,/[a-z]/g,'lowercase');
}

function uppercaseWeakness(password){
    return characterTypeWeakness(password,/[A-Z]/g,'uppercase');
}

function numberWeakness(password){
    return characterTypeWeakness(password,/[0-9]/g,'number');
}

function speacialCharacterWeakness(password){
    return characterTypeWeakness(password,/[^a-zA-Z0-9]/g,'special character');
}

function characterTypeWeakness(password,regex,type){
    const matches = password.match(regex) || [];
    if (matches.length === 0){
        return {
            message: `Password should contain at least one ${type}`,
            deduction: 20
        }
    }
    if (matches.length <= 2){
        return {
            message: `Password should contain more ${type}`,
            deduction: 5
        }
    }
}

function repeatCharacterWeakness(password){
    const matches = password.match(/(.)\1/g) || [];
    if (matches.length > 0){
        return {
            message: `Password should not contain repeating characters`,	
            deduction: matches.length * 10
        }
    }
}