<<<<<<< HEAD
 $(document).ready(
    function(){
        $('input:submit').attr('disabled',true);
        $('input:file').change(
            function(){
                if ($(this).val()){
                    $('input:submit').removeAttr('disabled'); 
                }
                else {
                    $('input:submit').attr('disabled',true);
                }
            });
<<<<<<< HEAD
    });	
$('#submit').click(function () {	 
		$('form').hide();
		$('#img').show();	 
});	 
function say(what) { 
    if (window.top != window) { SendMessage({ "theFunction": "say", "theData": what });       
    } else if (window.console) {  console.log(what);  } 
=======
 
$('#submit').click(function () {
	if(!$("form input[type=file]").val()) {
        alert('You must select a file!');
        return false;
    } else {
		$('form').hide();
		$('#img').show();
	}
=======
    });
	
$('#submit').click(function () {
	 
		$('form').hide();
		$('#img').show();
	 
>>>>>>> parent of 988466d... ready to move to new azure, static vars for service
});	
 
function say(what) {
    // Avoids exceptions when console is undefined. 
    if (window.top != window) {
        SendMessage({ "theFunction": "say", "theData": what });       
    } else if (window.console) {
        console.log(what);
    } 
<<<<<<< HEAD
>>>>>>> parent of eca586d... submit 2
=======
>>>>>>> parent of 988466d... ready to move to new azure, static vars for service
}