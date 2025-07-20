document.addEventListener("DOMContentLoaded", function () {
    const notesContainer = document.getElementById("notesContainer")
    const addNoteBtn = document.getElementById("addNoteBtn")
    const addNoteModal = document.getElementById("addNoteModal")
    const closeModalBtn = document.getElementById("closeModalBtn")
    const noteForm = document.getElementById("noteForm")
    const searchInput = document.getElementById("searchInput")
    const filterSelect = document.getElementById("filterSelect")
    const emptyState = document.getElementById("emptyState")
    const confirmModal = document.getElementById("confirmModal")
    const cancelDeleteBtn = document.getElementById("cancelDeleteBtn")
    const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")

    let notes = JSON.parse(localStorage.getItem("notes")) || []
    let noteToDeleteId = null

    renderNotes()
    updateEmptyState()

    addNoteBtn.addEventListener("click", openAddNoteModal)
    closeModalBtn.addEventListener("click", closeAddNoteModal)
    noteForm.addEventListener("submit", handleNoteSubmit)
    searchInput.addEventListener("input", filterNotes)
    filterSelect.addEventListener("change", filterNotes)
    cancelDeleteBtn.addEventListener("click", closeConfirmModal)
    confirmDeleteBtn.addEventListener("click", confirmDeleteNote)

    function renderNotes(notesToRender = notes) {
        notesContainer.innerHTML = ""

        notesToRender.forEach((note, index) => {
            const noteElement = document.createElement("div")
            noteElement.className = "note-card fade-in"
            noteElement.innerHTML = `
            <div class="note-content">
                <div class="note-header">
                    <h3 class="note-title">${note.title}</h3>
                    <div class="note-actions">
                        <button class="delete-btn" data-id="${index}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p class="note-text">${note.content}</p>
                <div class="note-footer">
                    <span class="note-tag ${getTagClass(note.tag)}">
                        ${getTagIcon(note.tag)} ${getTagName(note.tag)}
                    </span>
                    <span class="note-date">${formatDate(note.date)}</span>
                </div>
            </div>`
            notesContainer.appendChild(noteElement)
        })

        document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", function () {
                noteToDeleteId = parseInt(this.getAttribute("data-id"))
                openConfirmModal()
            })
        })
    }

    function getTagClass(tag) {
        const classes = {
            work: "tag-work",
            personal: "tag-personal",
            ideas: "tag-ideas",
            reminders: "tag-reminders",
        }
        return classes[tag] || ""
    }

    function getTagIcon(tag) {
        const icons = {
            work: '<i class="fas fa-briefcase"></i>',
            personal: '<i class="fas fa-user"></i>',
            ideas: '<i class="fas fa-lightbulb"></i>',
            reminders: '<i class="fas fa-bell"></i>',
        }
        return icons[tag] || ""
    }

    function getTagName(tag) {
        const names = {
            work: "Work",
            personal: "Personal",
            ideas: "Ideas",
            reminders: "Reminders",
        }
        return names[tag] || tag
    }

    function formatDate(dateString) {
        const date = new Date(dateString)
        return date.toLocaleDateString("en-US", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    function openAddNoteModal() {
        addNoteModal.classList.add("active")
        document.body.style.overflow = "hidden"
    }

    function closeAddNoteModal() {
        addNoteModal.classList.remove("active")
        document.body.style.overflow = "auto"
        noteForm.reset()
    }

    function openConfirmModal() {
        confirmModal.classList.add("active")
        document.body.style.overflow = "hidden"
    }

    function closeConfirmModal() {
        confirmModal.classList.remove("active")
        document.body.style.overflow = "auto"
        noteToDeleteId = null
    }

    function handleNoteSubmit(e) {
        e.preventDefault()

        const title = document.getElementById("noteTitle").value
        const content = document.getElementById("noteContent").value
        const tag = document.querySelector(
            'input[name="noteTag"]:checked'
        ).value

        const newNote = {
            title,
            content,
            tag,
            date: new Date().toISOString(),
        }

        notes.unshift(newNote)
        saveNotes()
        renderNotes()
        closeAddNoteModal()
        updateEmptyState()
        filterNotes()
    }

    function confirmDeleteNote() {
        if (noteToDeleteId !== null) {
            notes.splice(noteToDeleteId, 1)
            saveNotes()
            renderNotes()
            updateEmptyState()
            filterNotes()
            closeConfirmModal()
        }
    }

    function saveNotes() {
        localStorage.setItem("notes", JSON.stringify(notes))
    }

    function filterNotes() {
        const searchTerm = searchInput.value.toLowerCase()
        const filterValue = filterSelect.value

        let filteredNotes = notes

        if (searchTerm) {
            filteredNotes = filteredNotes.filter(
                (note) =>
                    note.title.toLowerCase().includes(searchTerm) ||
                    note.content.toLowerCase().includes(searchTerm)
            )
        }

        if (filterValue !== "all") {
            filteredNotes = filteredNotes.filter(
                (note) => note.tag === filterValue
            )
        }

        renderNotes(filteredNotes)
        updateEmptyState(filteredNotes)
    }

    function updateEmptyState(notesToCheck = notes) {
        if (notesToCheck.length === 0) {
            emptyState.style.display = "block"
        } else {
            emptyState.style.display = "none"
        }
    }
})

document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("task-input")
    const addTaskBtn = document.getElementById("add-task-btn")
    const taskList = document.getElementById("task-list")
    const emptyImg = document.querySelector(".empty-img")
    const todoWrapper = document.querySelector(".todo-wrapper")
    const progressBar = document.getElementById("progress")
    const progressNumbers = document.getElementById("numbers")

    const toggleEmptyState = () => {
        emptyImg.style.display = taskList.children.length === 0 ? "block" : "none"
        todoWrapper.style.width = taskList.children.length > 0 ? "100%" : "50%"
    }

    const updateProgress = (checkCompletion = true) => {
        const totalTasks = taskList.children.length
        const completedTasks = taskList.querySelectorAll(".checkbox:checked").length

        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : "0%"

        progressNumbers.textContent = `${completedTasks} / ${totalTasks}`

        if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            Confetti()
        }
    }

    const saveTaskToLocalStorage = () => {
        const tasks = Array.from(taskList.querySelectorAll("li")).map(li => ({
            text: li.querySelector("span").textContent,
            completed: li.querySelector(".checkbox").checked
        }))
        localStorage.setItem("tasks", JSON.stringify(tasks))
    }

    const loadTaskFromLocalStorage = () => {
        const savedTasks = JSON.parse(localStorage.getItem("tasks")) || []
        savedTasks.forEach(({text, completed}) => addTask(text, completed, false))
        toggleEmptyState()
        updateProgress()
    }

    const addTask = (text, completed = false, checkCompletion = true) => {
        const taskText = text || taskInput.value.trim()
        if (!taskText) {
            return
        }

        const li = document.createElement("li")
        li.innerHTML = `
        <input type="checkbox" class="checkbox" ${completed ? "checked" : ""}>
        <span>${taskText}</span>
        <div class="task-buttons">
            <button class="todo-edit-btn"><i class="fa-solid fa-pen"></i></button>
            <button class="todo-delete-btn"><i class="fa-solid fa-trash"></i></button>
        </div>
        `
        const checkbox = li.querySelector(".checkbox")
        const editBtn = li.querySelector(".todo-edit-btn")

        if (completed) {
            li.classList.add("completed")
            editBtn.disabled = true
            editBtn.style.opacity = "0.5"
            editBtn.style.pointerEvents = "none"
        }

        checkbox.addEventListener("change", () => {
            const isChecked = checkbox.checked
            li.classList.toggle("completed", isChecked)
            editBtn.disabled = isChecked
            editBtn.style.opacity = isChecked ? "0.5" : "1"
            editBtn.style.pointerEvents = isChecked ? "none" : "auto"
            updateProgress()
            saveTaskToLocalStorage()
        })

        editBtn.addEventListener("click", () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector("span").textContent
                li.remove()
                toggleEmptyState()
                updateProgress(false)
                saveTaskToLocalStorage()
            }
        });

        li.querySelector(".todo-delete-btn").addEventListener("click", () => {
            li.remove()
            toggleEmptyState()
            updateProgress()
            saveTaskToLocalStorage()
        })

        taskList.appendChild(li)
        taskInput.value = ""
        toggleEmptyState()
        updateProgress(checkCompletion)
        saveTaskToLocalStorage()
    }

    addTaskBtn.addEventListener("click", () =>
        addTask()
    )
    taskInput.addEventListener("keypress", (e) => {
        if (e.key == "Enter") {
            e.preventDefault()
            addTask()
        }
    })

    loadTaskFromLocalStorage()
})

const Confetti = () => {
    const count = 200,
        defaults = {
            origin: { y: 0.7 },
        };

    function fire(particleRatio, opts) {
        confetti(
            Object.assign({}, defaults, opts, {
                particleCount: Math.floor(count * particleRatio),
            })
        );
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55,
    });

    fire(0.2, {
        spread: 60,
    });

    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
    });

    fire(0.1, {
        spread: 120,
        startVelocity: 45,
    });
}



// ============= DARK MODE ================
let darkmode = localStorage.getItem("dark-mode")
const themeSwitch = document.getElementById("theme-switch")

const enableDarkmode = () => {
    document.body.classList.add("dark-mode")
    localStorage.setItem("dark-mode", "active")
}

const disableDarkmode = () => {
    document.body.classList.remove("dark-mode")
    localStorage.setItem("dark-mode", null)
}

if (darkmode === "active") enableDarkmode()

themeSwitch.addEventListener("click", () => {
    darkmode = localStorage.getItem("dark-mode")
    darkmode !== "active" ? enableDarkmode() : disableDarkmode()
})