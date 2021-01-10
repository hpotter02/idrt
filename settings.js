var csitelist = document.getElementById("SiteList")

function createSiteOption(url, icon) {
    let le = document.createElement("div")
    le.className = "listElement"
    let tiu = document.createElement("input")
    tiu.type = "text"
    tiu.name = "URL"
    tiu.value = url
    tiu.placeholder = "URL"
    let tii = document.createElement("input")
    tii.type = "text"
    tii.name = "icon"
    tii.value = icon
    tii.placeholder = "Icon URI"
    let frm = document.createElement("form")
    frm.onsubmit = submithandler
    let del = document.createElement("button")
    del.className = "deleteButton"
    del.innerText = "X"
    frm.appendChild(tiu)
    frm.appendChild(tii)
    frm.appendChild(del)
    le.appendChild(frm)
    csitelist.insertBefore(le, csitelist.childNodes[csitelist.childElementCount - 1])
}

function submithandler(e) {
    e.preventDefault()
    e.target.parentNode.remove()
}

function getConfig() {
    let config = {}
    let sa = []
    for (let i = 0; i < csitelist.childElementCount - 1; i++) {
        let fd = new FormData(csitelist.childNodes[i].childNodes[0])
        sa.push(fdToObj(fd))
    }
    config["sites"] = sa
    return config
}

function fdToObj(fd) {
    let ka = Array.from(fd.keys())
    let va = Array.from(fd.values())
    let ra = {}
    for (let i = 0; i < ka.length; i++) {
        ra[ka[i]] = va[i]
    }
    return ra
}

function applySettings() {
    settings = getConfig()
    writeSettings()
    document.location.reload()
}