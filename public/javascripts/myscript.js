 
$('#submit').click(function () {
	if(!$("form input[type=file]").val()) {
        alert('You must select a file!');
        return false;
    } else {
		$('form').hide();
		$('#img').show();
	}
});	
 
function say(what) {
    // Avoids exceptions when console is undefined. 
    if (window.top != window) {
        SendMessage({ "theFunction": "say", "theData": what });       
    } else if (window.console) {
        console.log(what);
    } 
}