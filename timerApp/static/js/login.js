// Login user

const form = document.querySelector('form')

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = form.querySelector('input[name="username"]').value
    const password = form.querySelector('input[name="password"]').value

    loginUser(username, password)

})

async function loginUser(username, password) {
    const user = {
        username: username,
        password: password,
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });

        const data = await response.json();

        if (!response.ok) {
            // If status is not 2__
            showError(data.error);
        } else {
            window.location.href = '/';
        }

    } catch (error) {
        console.error('Error:', error)
    }

}

// Display error message
const errorGoTo = document.querySelector('.errorMessage');

function showError(message) {
    errorGoTo.textContent = message;
    form.reset();
}

// Dispslay success messasge if there is one
const successGoTo = document.querySelector('.successMessage');

function showSuccess() {
    const message = localStorage.getItem('success')
    successGoTo.textContent = message
    localStorage.clear()
}

document.addEventListener('DOMContentLoaded', showSuccess);