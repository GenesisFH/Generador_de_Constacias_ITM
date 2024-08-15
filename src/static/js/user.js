document.addEventListener('DOMContentLoaded', () => {
    const userForm = document.getElementById('userForm');
    const userTableBody = document.getElementById('userTableBody');
    const updateButton = document.getElementById('updateButton');
    let users = [];
    let editIndex = -1;

    userForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;

        if (editIndex === -1) {
            users.push({ name, email, role });
        } else {
            users[editIndex] = { name, email, role };
            editIndex = -1;
            updateButton.style.display = 'none';
        }

        userForm.reset();
        renderTable();
    });

    updateButton.addEventListener('click', () => {
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const role = document.getElementById('role').value;

        users[editIndex] = { name, email, role };
        editIndex = -1;
        userForm.reset();
        updateButton.style.display = 'none';
        renderTable();
    });

    function renderTable() {
        userTableBody.innerHTML = '';
        users.forEach((user, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.role}</td>
                <td>
                    <button onclick="editUser(${index})">Editar</button>
                    <button onclick="deleteUser(${index})">Eliminar</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    }

    window.editUser = (index) => {
        const user = users[index];
        document.getElementById('name').value = user.name;
        document.getElementById('email').value = user.email;
        document.getElementById('role').value = user.role;
        editIndex = index;
        updateButton.style.display = 'block';
    };

    window.deleteUser = (index) => {
        users.splice(index, 1);
        renderTable();
    };
});
