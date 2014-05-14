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
    var $uploading = $('#uploading');
    var $unzipping = $('#unzipping');
    var $uploadText = $('#uploadText');
    var $unzipText = $('#unzipText');
    var $bar = $('#bar');

    if (!$("form input[type=file]").val()) {
        alert('You must select a file!');
        return false;
    } else {
        $this.ajaxSubmit({
            url: '/upload',
            uploadProgress: function(progressEvent) {
                var totalSize = progressEvent.totalSize || progressEvent.total;
                var loaded = progressEvent.loaded;
                var percent = (loaded / totalSize) * 100;

                percent = parseInt(percent, 10);
                $bar.css('width', percent + '%');

                if (loaded >= totalSize) {
                    unzipProgress();
                }
            },
            success: function(data) {
                $('body').html(data);
            }
        });

        $this.hide();
        $progress.show();
    }

    function unzipProgress() {
        $uploadText.text('Uploading...Done');
        $unzipText.text('Unzipping...');
        $uploading.css('display', 'none');
        $unzipping.css('opacity', '1');
    }
});