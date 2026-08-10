const loginform = document.getElementById("logInForm");


loginform.addEventListener("submit", async(event) => {
    event.preventDefault();
    const formdata = new FormData(loginform);

    const data =  {
        username: formdata.get("username"),
        password: formdata.get("login-password")
    };

    try {
        const response = await fetch("http://127.0.0.1:3000/core/user/login", {
            method: "POST",
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