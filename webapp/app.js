function openPage(page) {
    fetch(`/webapp/pages/${page}/${page}.html`)
        .then(r => r.text())
        .then(html => {
            document.getElementById("content").innerHTML = html;
            loadPageJS(page);
        });
}

function loadPageJS(page) {
    const script = document.createElement("script");
    script.src = `/webapp/pages/${page}/${page}.js`;
    document.body.appendChild(script);
}

openPage("farm");
