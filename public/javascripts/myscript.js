
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
    });	
	
function say(what) { 
    if (window.top != window) { SendMessage({ "theFunction": "say", "theData": what });       
    } else if (window.console) {  console.log(what);  } 
}


$('#submit').click(function () {
    var $form = $('form');

	if(!$("form input[type=file]").val()) {
        alert('You must select a file!');
        return false;
    } else {
        getProgress();
		$form.hide();
		$('#img').show();
	}
});

function getProgress(){
    $.get('/progress').done(function(progress){
        say(progress);
        setTimeout(getProgress,50);
    });
}
	