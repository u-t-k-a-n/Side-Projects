const name = document.getElementById('name');
const form = document.getElementById('form');
const password = document.getElementById('password');
const errorElement = document.getElementById('error');

form.addEventListener('submit', (e) => {
    let messsages = [];
    if (name.value === '' || name.value == null) {
        messsages.push('Name is required');
    } 
    if (password.value.length < 6) {
        messsages.push('Password must be at least 6 characters');
    }
    if (password.value.length >= 20) {
        messsages.push('Password must be less than 20 characters');
    }
    if (password.value ==="password") {
        messsages.push('Password cannot be password');
    }
    if (messsages.length > 0) {
        e.preventDefault();
        errorElement.innerText = messsages.join(', ');
    }
});