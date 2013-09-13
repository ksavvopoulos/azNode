function WriteSwfObject(strSwfFile, nWidth, nHeight, strScale, strAlign, strQuality, strBgColor, strFlashVars)
{
	var strHtml = "";

	strHtml += "<object classid='clsid:d27cdb6e-ae6d-11cf-96b8-444553540000' codebase='http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,79,0' id='player' width='" + nWidth + "' height='" + nHeight + "' align='" + strAlign + "'>";
	strHtml += "<param name='allowScriptAccess' value='sameDomain' />";
	strHtml += "<param name='scale' value='" + strScale + "' />";
	strHtml += "<param name='movie' value='" + strSwfFile + "' />";
	strHtml += "<param name='quality' value='" + strQuality + "' />";
	strHtml += "<param name='bgcolor' value='" + strBgColor + "' />";
	strHtml += "<param name='flashvars' value='" + strFlashVars + "' />";
	strHtml += "<embed src='" + strSwfFile +"' name='player' flashvars='" + strFlashVars + "' scale='" + strScale + "' quality='" + strQuality + "' bgcolor='" + strBgColor + "' width='" + nWidth + "' height='" + nHeight + "' align='" + strAlign + "' allowscriptaccess='sameDomain' type='application/x-shockwave-flash' pluginspage='http://www.macromedia.com/go/getflashplayer' />";
	strHtml += "</object>";

	document.write(strHtml);
}
