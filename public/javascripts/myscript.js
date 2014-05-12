$(document).ready(
    function() {
        $('input:submit').attr('disabled', true);
        $('input:file').change(
            function() {
                if ($(this).val()) {
                    $('input:submit').removeAttr('disabled');
                } else {
                    $('input:submit').attr('disabled', true);
                }
            });
    });

function say(what) {
    if (window.top != window) {
        SendMessage({
            "theFunction": "say",
            "theData": what
        });
    } else if (window.console) {
        console.log(what);
    }
}


// $('#submit').click(function () {
//     var $form = $('form');

// 	if(!$("form input[type=file]").val()) {
//         alert('You must select a file!');
//         return false;
//     } else {

// 		$form.hide();
// 		$('#img').show();
// 	}
// });

$('form').on('submit', function(e) {
    e.preventDefault();
    var $this = $(this);
    var $progress = $('#progress');

    if (!$("form input[type=file]").val()) {
        alert('You must select a file!');
        return false;
    } else {
        $this.ajaxSubmit({
            url: '/upload',
            uploadProgress: function(progressEvent) {
                var totalSize = progressEvent.totalSize;
                var loaded = progressEvent.loaded;
                var percent = (loaded / totalSize) * 100;
                
                percent = parseInt(percent, 10);
                $progress.css('width', percent + '%');
            },
            success: function(data) {
                $('body').html(data);
            }
        });

        $this.hide();
        $('#img').show();
    }
});