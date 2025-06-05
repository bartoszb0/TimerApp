// Register user
const form = document.querySelector('form')

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = form.querySelector('input[name="username"]').value
    const password = form.querySelector('input[name="password"]').value
    const confirmation = form.querySelector('input[name="password_confirmation"]').value

    if (!validatePass(password, confirmation)) {
        return
    }

    createUser(username, password, confirmation)

})

async function createUser(username, password, confirmation) {
    const newUser = {
        username: username,
        password: password,
        password_confirmation: confirmation,
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        const data = await response.json();

        if (!response.ok) {
            showError(data.username)
        } else {
            localStorage.setItem('success', 'Account created succesfully')
            window.location.href = '/login';
        }

    } catch (error) {
        console.error('Error:', error)
    }

}

// Validate password
function validatePass(password, confirmation) {
    if (password !== confirmation) {
        showError('Password and confirmation password are not the same')
        return false
    } else {
        return true
    }
}

// Display error message
const errorGoTo = document.querySelector('.errorMessage')

function showError(message) {
    errorGoTo.textContent = message
    form.reset();
}