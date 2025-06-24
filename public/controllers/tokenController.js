fetch('/get-cookie', {
    method: "GET"
}).then(response => {
    if (response.status == 403) {
        window.location.href = "/login";
    } else {
        document.querySelector('body').style.display = '';
    }
});