// Get CSRF Token
const csrfToken = Cookies.get('csrftoken');

// Loading page
let allProjects = [];

// Populate projects selection
const selector = document.querySelector('.selectProject');

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
                addToSelector(project);
                addToEditModal(project);
                allProjects.push(project);
            })
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
        
        if (response.ok) {
            addToSelector(data);
            addToEditModal(data);
            allProjects.push(data);
            closeModal();

            // Automatically set the new created project as chosen project
            selector.value = data.id;
            loadProject();
        } else {
            console.error('Error:', data)
        }

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
    option.value = project.id;
    option.textContent = project.name;
    option.style.color = project.color;
}

    // and one for deleting projects from selector dropdown
function removeFromSelector(id) {
    const option = document.querySelector(`option[data-id="${id}"]`)
    option.remove();
}


// Open modal for editing existing projects

    // TODO-1 only open modal if any project exists

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
    name.addEventListener('click', () => editName(name))

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
    //   przycisk zmienia kolor i tekst i jak kliknie sie drugi raz to dopiero wtedy projekt sie usuwa
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

async function editName(name) {
    // TODO
    name.textContent = "XD"
}

function updateSelectorColor(id, color) {
    const option = document.querySelector(`option[data-id="${id}"]`)
    option.style.color = color;
    // TODO - edit the color in currently shown project
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
            this.parentElement.remove();
            removeFromSelector(id);

            // Remove project from all projects array
            allProjects = allProjects.filter(project => project.id !== parseInt(id));

            loadProject();
        } else {
            const error = await response.json();
            console.error('Error:', error);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}


// Load project view
const projectNotChosenDiv = document.querySelector('.projectNotChosen');
const appDiv = document.querySelector('.app')

function loadProject() {
    // If there are no projects, go back to select screen
    if (allProjects.length <= 0) {
        noProjects();
        editModalDiv.style.display = 'none'; // TODO-1, make the edit modal not openable, close it automatically
        return;
    }

    const idToFind = parseInt(selector.value);
    const loadedProject = allProjects.find(project => project.id === idToFind);

    projectNotChosenDiv.style.display = 'none';
    appDiv.style.display = 'flex';

    const name = document.querySelector('#projectName')
    name.textContent = loadedProject.name;
    name.style.color = loadedProject.color;
    name.dataset.id = loadedProject.id;
}

selector.addEventListener('change', loadProject);


// What to do when there is no projects
function noProjects() {
    appDiv.style.display = 'none';
    projectNotChosenDiv.style.display = 'flex';
}



// TEMPORARY FUNCTION
const topMenu = document.querySelector('.topDiv');
const timerButton = document.querySelector('.timerButton');
const timerText = document.querySelector('#timerText');


function formatZero(int) {
    return int.toString().padStart(2, '0')
}

function activateTimer() {
    // Get ID of a project that entry will be related to
    const projectID = parseInt(selector.value)

    // Set a new beginning date for an entry and make it an ISO string so backend can parse it
    const beginningDate = new Date();
    const isoDate = beginningDate.toISOString();

    // Timer logic
    let seconds = 0;
    let mins = 0;
    let hours = 0;

    timerText.textContent = `${formatZero(hours)}:${formatZero(mins)}:${formatZero(seconds)}`;

    const timer = setInterval(() => {
        seconds++;

        if (seconds >= 60) {
            seconds = 0;
            mins++;
        }

        if (mins >= 60) {
            mins = 0;
            hours++;
        }

        timerText.textContent = `${formatZero(hours)}:${formatZero(mins)}:${formatZero(seconds)}`;
        document.title = timerText.textContent;
    }, 1000);

    console.log('TURNED ON');
    timerButton.classList.add('activeTimer');

    topMenu.style.visibility = 'hidden';

    timerButton.removeEventListener('click', activateTimer);
    timerButton.addEventListener('click', () => 
        deactivateTimer(timer, timerText.textContent, isoDate, projectID), {once: true});
}

async function deactivateTimer(timer, timePassed, beginningDate, projectID) {
    clearInterval(timer)
    document.title = 'TimerApp';

    console.log(timePassed)
    console.log(beginningDate)
    console.log(projectID)

    const newEntry = {
        date: beginningDate,
        time: timePassed
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/entry/project-${projectID}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            body: JSON.stringify(newEntry)
        });

        const data = await response.json()

        if (response.ok) {
            console.log('Entry saved:', data)
        } else {
            console.log('Error while saving entry:', data);
        }

        } catch (error) {
            console.error('Error:', error);
        }

    // TODO, also fetch data when user closes the page

    console.log('TURNED OFF');
    timerButton.classList.remove('activeTimer');
    timerText.textContent = 'Start timer'

    topMenu.style.visibility = 'visible';

    timerButton.addEventListener('click', activateTimer);
}

timerButton.addEventListener('click', activateTimer);


// beforeunload
window.addEventListener('beforeunload', () => {
  localStorage.setItem('xd', 'plplpl')
});

window.addEventListener('DOMContentLoaded', function() {
    console.log(localStorage.getItem('xd'))
})