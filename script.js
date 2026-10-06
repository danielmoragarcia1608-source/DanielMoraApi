const API_URL =
    "https://jsonplaceholder.typicode.com/users";


/* ========================================
   ELEMENTOS
======================================== */

const loginView =
    document.getElementById("loginView");

const dashboardView =
    document.getElementById("dashboardView");

const loginForm =
    document.getElementById("loginForm");

const username =
    document.getElementById("username");

const password =
    document.getElementById("password");

const loginError =
    document.getElementById("loginError");

const togglePassword =
    document.getElementById("togglePassword");

const logoutButton =
    document.getElementById("logoutButton");

const usersContainer =
    document.getElementById("usersContainer");

const searchInput =
    document.getElementById("searchInput");

const reloadButton =
    document.getElementById("reloadButton");

const resultMessage =
    document.getElementById("resultMessage");

const totalUsers =
    document.getElementById("totalUsers");

const totalCities =
    document.getElementById("totalCities");

const apiState =
    document.getElementById("apiState");

const userModal =
    document.getElementById("userModal");

const closeModal =
    document.getElementById("closeModal");


let usuarios = [];


/* ========================================
   LOGIN
======================================== */

loginForm.addEventListener(
    "submit",
    function(event) {

        event.preventDefault();

        const user =
            username.value.trim();

        const pass =
            password.value.trim();


        if (
            user === "admin" &&
            pass === "123456"
        ) {

            loginError.textContent = "";

            sessionStorage.setItem(
                "loggedIn",
                "true"
            );

            mostrarDashboard();

        } else {

            loginError.textContent =
                "Usuario o contraseña incorrectos.";

        }

    }
);


/* ========================================
   MOSTRAR / OCULTAR CONTRASEÑA
======================================== */

togglePassword.addEventListener(
    "click",
    function() {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.textContent =
                "Ocultar";

        } else {

            password.type = "password";

            togglePassword.textContent =
                "Mostrar";

        }

    }
);


/* ========================================
   SESIÓN
======================================== */

function comprobarSesion() {

    const loggedIn =
        sessionStorage.getItem("loggedIn");

    if (loggedIn === "true") {

        mostrarDashboard();

    }

}


function mostrarDashboard() {

    loginView.classList.add("hidden");

    dashboardView.classList.remove("hidden");

    cargarUsuarios();

}


function cerrarSesion() {

    sessionStorage.removeItem(
        "loggedIn"
    );

    dashboardView.classList.add("hidden");

    loginView.classList.remove("hidden");

    username.value = "";

    password.value = "";

}


logoutButton.addEventListener(
    "click",
    cerrarSesion
);


/* ========================================
   CONSUMIR API
======================================== */

async function cargarUsuarios() {

    resultMessage.textContent =
        "Consultando información...";

    usersContainer.innerHTML = `
        <div class="loading">
            Cargando usuarios...
        </div>
    `;

    reloadButton.disabled = true;

    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                `Error HTTP ${response.status}`
            );

        }


        const data =
            await response.json();


        usuarios = data;


        actualizarEstadisticas();

        mostrarUsuarios(usuarios);


        apiState.textContent =
            "Activa";


    } catch (error) {

        console.error(error);

        apiState.textContent =
            "Error";

        resultMessage.textContent =
            "No fue posible consultar la API.";

        usersContainer.innerHTML = `
            <div class="api-error">
                <strong>Error de conexión</strong>
                <p>
                    No se pudo obtener la información.
                    Intenta nuevamente.
                </p>
            </div>
        `;

    } finally {

        reloadButton.disabled = false;

    }

}


/* ========================================
   ESTADÍSTICAS
======================================== */

function actualizarEstadisticas() {

    totalUsers.textContent =
        usuarios.length;


    const ciudades =
        new Set(
            usuarios.map(
                usuario =>
                    usuario.address.city
            )
        );


    totalCities.textContent =
        ciudades.size;

}


/* ========================================
   MOSTRAR USUARIOS
======================================== */

function mostrarUsuarios(lista) {

    usersContainer.innerHTML = "";


    if (lista.length === 0) {

        resultMessage.textContent =
            "No se encontraron usuarios.";

        usersContainer.innerHTML = `
            <div class="empty">
                No hay resultados para mostrar.
            </div>
        `;

        return;

    }


    resultMessage.textContent =
        `${lista.length} usuarios encontrados`;


    lista.forEach(usuario => {

        const iniciales =
            obtenerIniciales(
                usuario.name
            );


        const card =
            document.createElement("article");


        card.className =
            "user-card";


        card.innerHTML = `

            <div class="user-top">

                <div class="user-avatar">
                    ${iniciales}
                </div>

                <div>

                    <h3>
                        ${escapeHTML(usuario.name)}
                    </h3>

                    <span>
                        Usuario #${usuario.id}
                    </span>

                </div>

            </div>


            <div class="user-detail">

                <strong>Correo:</strong>
                ${escapeHTML(usuario.email)}

            </div>


            <div class="user-detail">

                <strong>Ciudad:</strong>
                ${escapeHTML(
                    usuario.address.city
                )}

            </div>


            <div class="user-detail">

                <strong>Empresa:</strong>
                ${escapeHTML(
                    usuario.company.name
                )}

            </div>


            <button
                class="user-button"
                data-id="${usuario.id}"
            >
                Ver información
            </button>

        `;


        usersContainer.appendChild(card);

    });

}


/* ========================================
   BUSCADOR
======================================== */

searchInput.addEventListener(
    "input",
    function() {

        const texto =
            searchInput.value
                .toLowerCase()
                .trim();


        const resultados =
            usuarios.filter(usuario => {

                return (

                    usuario.name
                        .toLowerCase()
                        .includes(texto)

                    ||

                    usuario.email
                        .toLowerCase()
                        .includes(texto)

                    ||

                    usuario.address.city
                        .toLowerCase()
                        .includes(texto)

                );

            });


        mostrarUsuarios(
            resultados
        );

    }
);


/* ========================================
   DETALLE DEL USUARIO
======================================== */

usersContainer.addEventListener(
    "click",
    function(event) {

        const button =
            event.target.closest(
                ".user-button"
            );


        if (!button) {
            return;
        }


        const id =
            Number(
                button.dataset.id
            );


        const usuario =
            usuarios.find(
                user =>
                    user.id === id
            );


        if (usuario) {

            abrirModal(usuario);

        }

    }
);


function abrirModal(usuario) {

    const iniciales =
        obtenerIniciales(
            usuario.name
        );


    document.getElementById(
        "modalAvatar"
    ).textContent = iniciales;


    document.getElementById(
        "modalName"
    ).textContent =
        usuario.name;


    document.getElementById(
        "modalEmail"
    ).textContent =
        usuario.email;


    document.getElementById(
        "modalPhone"
    ).textContent =
        usuario.phone;


    document.getElementById(
        "modalCity"
    ).textContent =
        usuario.address.city;


    document.getElementById(
        "modalCompany"
    ).textContent =
        usuario.company.name;


    document.getElementById(
        "modalWebsite"
    ).textContent =
        usuario.website;


    userModal.classList.add(
        "active"
    );

}


/* ========================================
   CERRAR MODAL
======================================== */

closeModal.addEventListener(
    "click",
    cerrarModal
);


userModal.addEventListener(
    "click",
    function(event) {

        if (
            event.target === userModal
        ) {

            cerrarModal();

        }

    }
);


function cerrarModal() {

    userModal.classList.remove(
        "active"
    );

}


/* ========================================
   ACTUALIZAR
======================================== */

reloadButton.addEventListener(
    "click",
    cargarUsuarios
);



function obtenerIniciales(nombre) {

    return nombre
        .split(" ")
        .slice(0, 2)
        .map(
            palabra =>
                palabra.charAt(0)
        )
        .join("")
        .toUpperCase();

}


function escapeHTML(texto) {

    const elemento =
        document.createElement("div");

    elemento.textContent =
        texto;

    return elemento.innerHTML;

}


comprobarSesion();