var fs = require('fs')
const { app } = require('electron');

var sidebar = document.getElementsByClassName("sidebar")[0]
var content = document.getElementsByClassName("content")[0]
var sitelist = {}
var domainRegex = /(?:\/\/)(.*)(?:\/{0,1})/

function getFavicon() {
    var favicon = undefined;
    var nodeList = document.getElementsByTagName("link");
    for (var i = 0; i < nodeList.length; i++) {
        if ((nodeList[i].getAttribute("rel") == "icon") || (nodeList[i].getAttribute("rel") == "shortcut icon")) {
            favicon = nodeList[i].getAttribute("href");
        }
    }
    return favicon;
}


function swapContent(id) {
    try {

        document.getElementsByClassName("active-content")[0].className = "content-frame"
    }
    catch {
        console.log("oopsie woopsie")
    }
    sitelist[id].className = "content-frame active-content"
}

function createMenuEntry(url, imgUrl, className) {
    let img = document.createElement("img")
    img.src = imgUrl == "" ? "https://www.google.com/s2/favicons?sz=128&domain=" + domainRegex.exec(url)[0] : imgUrl
    img.className = "linkIcon " + className
    let id = url.includes("http") ? btoa(url) : url
    img.onclick = () => {
        swapContent(id)
    }
    sidebar.appendChild(img)
}

function createFrame(url) {
    if (!url.includes("http")) {
        sitelist[url] = document.getElementById(url)
        return
    }
    let frame = document.createElement("webview")
    frame.src = url
    frame.className = "content-frame"
    frame.allow = ""
    frame.useragent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"
    if (document.getElementsByClassName("active-content").length == 0) {
        frame.className = "content-frame active-content"
    }
    frame.frameBorder = 0
    content.appendChild(frame)
    sitelist[btoa(url)] = frame
}

function addSite(url, imgUrl, classNameImg) {
    createMenuEntry(url, imgUrl, classNameImg)
    createFrame(url)
}

var settings = {}
var confFile = require('os').homedir() + "/.config/idrt/settings.json"
if (process.platform === "win32") {
    confFile = require('os').homedir() + "\\.config\\idrt\\settings.json"
}

function readSettings() {
    fs.readFile(confFile, (e, d) => {
        if (e != null) {
            console.error(e)
            document.getElementById("settings").classList.add("active-content")
            return
        }
        settings = JSON.parse(d)
        settings.sites.forEach(site => {
            createSiteOption(site.URL, site.icon)
            addSite(site.URL, site.icon)
        });

    })
    addSite("settings", "cog-solid.svg", "bottom")
}

function writeSettings() {
    fs.writeFile(confFile, JSON.stringify(settings, null, 4), () => {
    })
}
console.log(require('os').homedir() + "/.config/idrt/settings.json")
readSettings()