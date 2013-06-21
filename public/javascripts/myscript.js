 $(document).ready(
    function(){
        $('input:submit').attr('disabled',true);
        $('input:file').change(
            function(){
                if ($(this).val()){  $('input:submit').removeAttr('disabled');   }
                else { $('input:submit').attr('disabled',true); }
            });
    });	
$('#submit').click(function () {	 
		$('form').hide();
		$('#img').show();	 
});	 
function say(what) { 
    if (window.top != window) { SendMessage({ "theFunction": "say", "theData": what });       
    } else if (window.console) {  console.log(what);  } 
}