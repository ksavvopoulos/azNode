function InitListener() {
    if (window.addEventListener) {
        window.addEventListener("message", ReceiveMessage, false);
    } else if (window.attachEvent) {
        window.attachEvent("onmessage", ReceiveMessage);
    } else {
        alert("could not attach event listener");
    }
}

function SendMessage(theMessage) {
    try {
        var where = window.parent  // to talk to parent frame
        var myMsg = window.JSON.stringify(theMessage);
        where.postMessage(myMsg, '*');
    } catch (err) {
        alert("SendMessage - Error description: " + err.message);
    }
}
