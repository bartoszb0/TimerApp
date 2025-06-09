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
                addToSelector(project)
                addToEditModal(project)
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
const openCreateModalButton = document.querySelector('#newProjectButton');
const closeCreateModalButton = document.querySelector('#closeCreateModal');
const createModalDiv = document.querySelector('.createModalDiv');

openCreateModalButton.addEventListener('click', () => {
    createModalDiv.style.display = 'flex';
})

function closeModal() {
    createModalDiv.style.display = 'none';
    createForm.reset()
}

closeCreateModalButton.addEventListener('click', closeModal)


// Creating new project
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
        
        addToSelector(data);
        addToEditModal(data);
        closeModal();

    } catch (error) {
        console.error('Error:', error);
    }
}

createForm.addEventListener('submit', createProject);

// Helper function for adding new projects to selector dropdown
function addToSelector(project) {
    const option = document.createElement('option');
    selector.appendChild(option);
    option.dataset.id = project.id;
    option.textContent = project.name;
    option.style.color = project.color;
}


// Open modal for editing existing projects
const openEditModalButton = document.querySelector('#editModalButton');
const closeEditModalButton = document.querySelector('#closeEditModal')
const editModalDiv = document.querySelector('.editModalDiv');

const editModalTable = document.querySelector('#existingProjects');

openEditModalButton.addEventListener('click', () => {
    editModalDiv.style.display = 'flex';
})

closeEditModalButton.addEventListener('click', () => {
    editModalDiv.style.display = 'none';
})

function addToEditModal(project) {
    const newTableRow = document.createElement('tr');
    newTableRow.dataset.id = project.id
    editModalTable.appendChild(newTableRow);
    
    const name = document.createElement('td');
    name.textContent = project.name;
    newTableRow.appendChild(name);

    const color = document.createElement('input');
    color.type = 'color';
    color.value = project.color;
    newTableRow.appendChild(color);
    color.addEventListener('change', () => editColor(color))

    const deleteButton = document.createElement('button');
    deleteButton.classList.add('deleteProjectButton');
    deleteButton.textContent = 'DELETE';
    deleteButton.addEventListener('click', deleteProject)
    newTableRow.appendChild(deleteButton);
    // TODO zrobic zapytanie czy user chce napewno usunac po kliknieciu w przycisk
    // przycisk zmienia kolor i tekst i jak kliknie sie drugi raz to dopiero wtedy projekt sie usuwa
}

async function editColor(color) {
    const newColorValue = color.value;
    const id = color.parentElement.dataset.id;

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/projects/patch/color/${id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify({color: newColorValue})
        });
        
        if (response.ok) {
            updateSelectorColor(id, newColorValue)
        } else {
            const error = await response.json();
            console.error('Error:', error);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

function updateSelectorColor(id, color) {
    const option = document.querySelector(`option[data-id="${id}"]`)
    option.style.color = color;
}


// Delete project
async function deleteProject() {
    const id = this.parentElement.dataset.id

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/projects/delete/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
        });

        if (response.ok) {
            this.parentElement.remove()
        } else {
            const error = await response.json();
            console.error('Error:', error);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}
