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
        var myMsg = JSON.stringify(theMessage);
        where.postMessage(myMsg, '*');
    } catch (err) {
        alert("SendMessage - Error description: " + err.message);
    }
}

function ReceiveMessage(event) {
    try {
        var eventObjData = JSON.parse(event.data);
        var theFunction = eventObjData.theFunction;
        var theData = eventObjData.theData;
        //
        if (theFunction == "replyWithContainerName") {           
            // got the Container name from LMS 
			var theContainer = theData;
			say("iFrame got the container name: " + theContainer);	
			// jQuery change form input 'container' value from 'repository' to theContainer
			$("#container").val('theContainer');
        }   
        // go on checking for function names here... 
        if (theFunction == "doSomething"){
            // do something
        }
        // You may even eval(theFunction + "(" + theData + ")") and call the original function
    } catch (err) {
        alert("ReceiveMessage - Error description: " + err.message);        
    }
}