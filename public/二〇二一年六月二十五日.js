[
    "www.landiannews.com",
    "www.tmtpost.com",
    "www.iplaysoft.com",
    "www.ithome.com",
    "www.ifanr.com",
    "www.pingwest.com",

]
    .map((u) => {
        var a = document.createElement("a");

        a.href = "./" + u + "/";
        a.innerText = a.href;
        var h2 = document.createElement("h2");
        h2.appendChild(a);
        return h2;
    })
    .forEach((a) => {
        document.body.appendChild(a);
    });
