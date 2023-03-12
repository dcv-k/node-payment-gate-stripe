const button = document.querySelector("button")
button.addEventListener("click", () => {
    fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            items: [
                {id: 1, qty: 3},
                {id: 2, qty: 1}
            ]
        })
    })
    .then((res) => {
        if(res.ok) return res.json()
        return res.json().then(data => Promise.reject(data))
    })
    .then(({ url }) => {
        window.location = url
    })
    .catch((e) => {
        console.error(e.error)
    })
})