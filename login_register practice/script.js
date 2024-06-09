function inputValue(id) {
    return document.getElementById(id).value
}

function getRandomId() {
    let randomId = Math.random().toString(36).slice(2)
    return randomId
}

function showOutput(output) {
    document.getElementById("output").innerHTML = output
}


// Array of Users
let users = JSON.parse(localStorage.getItem("users")) || []

// Array of Todos
let todos = JSON.parse(localStorage.getItem("todos")) || []

function handleRegister() {
    event.preventDefault()

    let email = inputValue("registerEmail")

    let password = inputValue("registerPassword")

    if (!email) {
        showNotification("Enter Email", "error")
        return
    }

    if (!password) {
        showNotification("Enter Password", "error")
        return
    }

    if (password.length < 6) {
        showNotification("Minimum length of password is 6 characters", "error")
        return
    }

    let user = {
        email,
        password,
        id: getRandomId(),
        createdAt: new Date(),
        status: "Active"
    }

    const userFind = users.find(user => user.email === email)

    if (userFind) {
        showNotification("User already registered", "error")
        return
    }
    else {
        users.push(user)
        showNotification("Successfully Registered", "success")
        localStorage.setItem("users", JSON.stringify(users))
    }
    window.location.href = "login.html"

}

function handleLogin() {
    event.preventDefault()

    let email = inputValue("loginEmail")

    let password = inputValue("loginPassword")

    if (!email || !password) {
        showNotification("Enter email and password correctly", "error")
    }

    const userFind = users.find(user => user.email === email)

    if (userFind) {
        const checkPassword = users.find(user => user.password === password)
        if (checkPassword) {
            showNotification("Successfully loggedIn", "success")
            localStorage.setItem("loggedInUser", JSON.stringify(userFind))
            window.location.href = "todos.html"

        }
        else {
            showNotification("Incorrect Password", "error")
            return
        }
    } else {
        showNotification("Incorrect Email", "error")
        return
    }

}




function toCreate() {

    let title = inputValue("title")

    if (!title) {
        showNotification("Please enter your title", "error")
        return
    }

    let description = inputValue("description")

    if (!description) {
        showNotification("Please enter your description", "error")
        return
    }

    let date = inputValue("date")

    if (!date) {
        showNotification("Please enter your date", "error")
        return
    }

    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    if (!loggedInUser) {
        showNotification("User not logged in", "error")
        return
    }


    let todo = {
        title,
        description,
        date,
        status: "incomplete",
        id: getRandomId(),
        createdAt: new Date(),
        serialNumber: (todos.length + 1),
        uid: loggedInUser.id
    }

    const checkCreate = todos.find(todo => todo.title === title)
    console.log(checkCreate)

    if (checkCreate) {
        showNotification("todo already created", "error")
        return
    } else {
        todos.push(todo)
    }

    localStorage.setItem("todos", JSON.stringify(todos))

    showTable()
}

function toRead() {
    // const todos = JSON.parse(localStorage.getItem("todos"))
    console.log(todos)
}

function toUpdate() {

    // let todos = JSON.parse(localStorage.getItem("todos"))

    let getSerialNumber = Number(prompt("Enter serial Number whose description you want to update"))

    let toUpdateDescription = prompt("Enter the description you want to appear")

    let updatedDescription = todos.map((todo, index) => {
        if (getSerialNumber === index + 1) {
            return { ...todo, description: toUpdateDescription }
        } else {
            return todo
        }
    })

    todos = updatedDescription
    localStorage.setItem("todos", JSON.stringify(todos))
    showTable()
}

function toDelete() {
    // let todos = JSON.parse(localStorage.getItem("todos"))
    let getSerialNumber = Number(prompt("Enter the serial number of object which  you wanted  to delete"))

    const filteredtodo = todos.filter((todo, index) => index + 1 !== getSerialNumber)

    todos = filteredtodo
    localStorage.setItem("todos", JSON.stringify(todos))
    showTable()
}

function showTable() {

    // let todos = JSON.parse(localStorage.getItem("todos"))
    if (!todos.length) {
        showNotification("No single todo is registered", "error")
        return
    }

    let tableStarting = '<div class="table-responsive"><table class="table">'
    let tableEnding = '</table></div>'

    let tableHead = "<thead><tr><th scope='col'>#</th><th scope='col'>Title</th><th scope='col'>Description</th><th scope='col'>Date</th><th scope='col'>Status</th><th scope='col'>ID</th><th scope='col'>LoggedIn User Id</tr></thead>"

    let tableBody = ""

    todos = todos.map((todo, index) => {
        return { ...todo, serialNumber: index + 1 }
    })

    for (let i = 0; i < todos.length; i++) {
        tableBody += '<tr><th scope="row">' + (i + 1) + '</th><td>' + todos[i].title + '</td><td>' + todos[i].description + '</td><td>' + todos[i].date + '</td><td>' + todos[i].status + '</td><td>' + todos[i].id + '</td><td>' + todos[i].uid + '</td></tr>'
    }

    let table = tableStarting + tableHead + '<tbody>' + tableBody + '</tbody>' + tableEnding

    localStorage.setItem("todos", JSON.stringify(todos))

    showOutput(table)
}

function showNotification(message, type) {

    let bgColor

    switch (type) {
        case 'success':
            bgColor = "linear-gradient(to right, #1D976C, #93F9B9)"
            break
        case 'error':
            bgColor = "linear-gradient(to right, #93291e, #ed213a)"
            break
        default:
            bgColor = "#000"
    }

    Toastify({
        text: message,
        duration: 3000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "left", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
            background: bgColor,
        },
        onClick: function () { } // Callback after click
    }).showToast();
}

window.onload = () => {
    let year = new Date()
    document.getElementById("currentYear").innerHTML = year.getFullYear()

    // Display logged-in user email
    const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"))
    if (loggedInUser) {
        document.getElementById("userGmail").innerText = loggedInUser.email
    } else {
        // Redirect to login page if no user is logged in
        window.location.href = "login.html"
    }
}