const loginform = document.getElementById("logInForm");
const registerForm = document.getElementById("registerForm");


loginform.addEventListener("submit", async(event) => {
    event.preventDefault();
    const formdata = new FormData(loginform);

    const data =  {
        username: formdata.get("username"),
        password: formdata.get("login-password")
    };

    try {
        const response = await fetch("http://127.0.0.1:3000/core/user/login", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();

        console.log(result);

    } catch (error) {
        console.error("Login error:", error);
    }
});

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(registerForm);

    const data = {
        first_name: formData.get("first_name"),
        last_name: formData.get("last_name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        password: formData.get("password")
    };

    try {
        const response = await fetch("http://127.0.0.1:3000/core/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        console.log(result);

    } catch (error) {
        console.error("Registration error:", error);
    }
});