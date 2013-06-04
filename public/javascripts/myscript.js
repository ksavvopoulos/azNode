(function () {
    $('#submit').click(function () {
        $('form').hide();
        $('#img').show();
    });
	//SendMessage({"theFunction":"findMyID", "thaData":""});
	SendMessage({"theFunction":"tellMeTheOrganizationName", "thaData":""});
})();