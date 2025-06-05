// Get CSRF Token
const csrfToken = Cookies.get('csrftoken');

// Populate projects selection
const selector = document.querySelector('select[name="projects"]');

async function populateSelector() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/projects/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();

        if (data.length > 0) {
            data.forEach(project => {
                const option = document.createElement('option');
                selector.appendChild(option);
                option.textContent = project.name;
                option.style.color = project.color;
            })
        } else {
            console.log("empty") // TODO, handle this
        }

    } catch (error) {
        console.error('Error:', error)
    }
}

document.addEventListener('DOMContentLoaded', populateSelector)


// Open modal for creating new project
const openModalButton = document.querySelector('#newProjectButton');
const closeModalButton = document.querySelector('#closeModal');
const createModalDiv = document.querySelector('.createModalDiv');

openModalButton.addEventListener('click', () => {
    createModalDiv.style.display = 'flex';
})

function closeModal() {
    createModalDiv.style.display = 'none';
    createForm.reset()
}

closeModalButton.addEventListener('click', closeModal)


// Create new project
const createForm = document.querySelector('.createForm')

async function createProject(e) {
    e.preventDefault();

    const newProject = {
        name: createForm['name'].value,
        color: createForm['color'].value
    }

    try {
        const response = await fetch('http://127.0.0.1:8000/api/projects/create/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(newProject)
        });
        const data = await response.json();

        // TODO dac w modelu ze nazwa musi byc unique dla jednego uzytkownika(?)

        populateSelector()
        closeModal()

    } catch (error) {
        console.error('Error:', error)
    }
}

createForm.addEventListener('submit', createProject)