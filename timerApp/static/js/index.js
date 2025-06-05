// Get CSRF Token
const csrfToken = Cookies.get('csrftoken');

// Populate projects selection
const selector = document.querySelector('select[name="projects"]');
  // TODO


// Open modal for creating new project
const openModalButton = document.querySelector('#newProjectButton');
const closeModalButton = document.querySelector('#closeModal');
const createModalDiv = document.querySelector('.createModalDiv');

openModalButton.addEventListener('click', () => {
    createModalDiv.style.display = 'flex';
})

closeModalButton.addEventListener('click', closeModal)

function closeModal() {
    createModalDiv.style.display = 'none';
}

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

        console.log(data)
        closeModal()
        createForm.reset()

    } catch (error) {
        console.error('Error:', error)
    }

    console.log(newProject)
}

createForm.addEventListener('submit', createProject)