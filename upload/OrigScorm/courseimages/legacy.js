// CourseLab ToolBox
var toolbox_version = "2.3.0";
var toolbox_buildDate = "2005-Sep-26";
//(c)2002-2005 Websoft Ltd. http://www.courselab.ru/

var g_Obj = new Array();


//Some array methods for IE5.0 compatibility
function shiftArray(arr) {
	if(arr instanceof Array) {
		if(arr.length==0) return null;
		var tmp = arr[0];
		for(var i=0;i<arr.length-1;i++) {
			arr[i] = arr[i+1];
		}
		arr.length-=1;
		return tmp;
	}
	return null;
}

function unshiftArray(arr,elem) {
	if(arr instanceof Array) {
		arr.length+=1;
		for(var i=arr.length-1;i>0;i--) {
			arr[i] = arr[i-1];
		}
		arr[0] = elem;
		return arr.length;
	}
	return null;
}

function pushArray(arr,elem) {
	if(arr instanceof Array) {
		arr.length+=1;
		arr[arr.length-1]=elem;
		return arr.length;
	}
	return null;
}

function popArray(arr) {
	if(arr instanceof Array) {
		if(!arr.length) return null;
		var elem=arr[arr.length-1];
		arr.length-=1;
		return elem;
	}
	return null;
}

function spliceArray(arr,it) {
	try {
		arr.splice(it,1);
		var tarr = arr;
	} catch(x) {
		var tarr = new Array(0);
		var idx=0;
		for(var i=0;i<arr.length;i++) {
			if(i!=it) {
				idx = tarr.length;
				tarr[idx] = arr[i];
			}
		}
	}
	return tarr;
}

// String trimmer
function trim(tString,start,end,doubleSpc,crlf) {
	if (typeof tString != "string") return tString;
	var retValue = tString;
	var ch;
	if(start) {
		var ch = retValue.substring(0, 1);
		while (ch==" " || ch=="\n" || ch=="\r" || ch=="\t") {
			retValue = retValue.substring(1, retValue.length);
			ch = retValue.substring(0, 1);
		}
	}
	if(end) {
   		ch = retValue.substring(retValue.length-1, retValue.length);
		while (ch==" " || ch=="\n" || ch=="\r" || ch=="\t") {
			retValue = retValue.substring(0, retValue.length-1);
			ch = retValue.substring(retValue.length-1, retValue.length);
		}
	}
	if(crlf) {
		while (retValue.indexOf("\n") != -1) {
			retValue = retValue.substring(0, retValue.indexOf("\n")) +" "+ retValue.substring(retValue.indexOf("\n")+1, retValue.length);
		}
		while (retValue.indexOf("\r") != -1) {
			retValue = retValue.substring(0, retValue.indexOf("\r")) + retValue.substring(retValue.indexOf("\r")+1, retValue.length);
		}
		while (retValue.indexOf("\t") != -1) {
			retValue = retValue.substring(0, retValue.indexOf("\t")) + retValue.substring(retValue.indexOf("\t")+1, retValue.length);
		}
	}
	if(doubleSpc) {
		while (retValue.indexOf("  ") != -1) {
			retValue = retValue.substring(0, retValue.indexOf("  ")) + retValue.substring(retValue.indexOf("  ")+1, retValue.length);
		}
	}
	return retValue;
}

function replaceStr(string, text, by) {

	var result = "";

	if(text=='\\"' && by=='"') {
		var what = /\\\"/g;
		result = string.replace(what,by)
		return result;
	}
	if(text=='"' && by=='\\"') {
		var what = /\"/g;
		result = string.replace(what,by)
		return result;
	}
	switch(text.charAt(0)) {
		case "<":
		case "^":
		case "@":
		case "|":
			var ntext = "\\"+text;
			break;
		case '\\':
			if(text=='\\"' && by=='"') ntext = '\\\"';
			break;
		case '"':
			if(text=='"' && by=='\\"') ntext = '\"';
			break;
		default:
			var ntext = text;
			break;
	}
	var what = new RegExp(ntext,"g");
	result = string.replace(what,by)
	return result;
}

function oldreplaceStr(string,text,by) {
// Replaces text with by in string
    var strLength = string.length, txtLength = text.length;
    if ((strLength == 0) || (txtLength == 0)) return string;

    var i = string.indexOf(text);
    if ((!i) && (text != string.substring(0,txtLength))) return string;
    if (i == -1) return string;

    var newstr = string.substring(0,i) + by;

    if (i+txtLength < strLength)
        newstr += replaceStr(string.substring(i+txtLength,strLength),text,by);

    return newstr;
}


// Node creator
function AppendNode(doc,root,child,text,cdata,ats) {
	if(cdata!=null && cdata!='') {
		var tNode = doc.createCDATASection(cdata);
	} else {
		if(text!=null && text!='') {
			var tNode = doc.createTextNode(text);
		}
	}
	var aNode = doc.createElement(child);
	if(ats!=null) {
		for(var i=0;i<ats.length;i++) {
			aNode.setAttribute(ats[i].name,ats[i].value);
		}
	}
	if(tNode!=null) {
		aNode.appendChild(tNode);
	}
	root.appendChild(aNode);
	return aNode;
}

function newDocWindow(url) {
	try {
		if(baseURL && baseURL!=null) {
			if(baseURL!='') {
				var jumpURL=baseURL+"/"+url;
			} else {
				var jumpURL=url;
			}
		} else {
		var jumpURL=url;
		}
	} catch(x) {
		var jumpURL=url;
	}
	name = window.open(jumpURL, 'wtdocument', 'toolbar=yes,location=no,status=yes,menubar=yes,resizable=yes,directories=no,scrollbars=yes');
	return false;
}

function ThrowDice(maxv,incl,used,maxt) {
	var rnum=0;
	var c1=0;
	var ff = false;
	if(maxt==null || isNaN(maxt)) {
		maxt=100;
	}
	do {
		if(incl) {
			rnum = Math.ceil(Math.random()*maxv);
		} else {
			rnum = Math.floor(Math.random()*maxv);
		}
		c1++;
		if(used.length==0) return rnum;
		ff = true;
		for(var i=0;i<used.length;i++) {
			if(used[i]==rnum) {
				ff = false;
				break;
			}
		}
		if(ff) return rnum;
	} while(c1<maxt);
	return 0;
}

function MM_swapImgRestore() { //v3.0
	var i,x,a=document.MM_sr;
	for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}

function MM_preloadImages() { //v3.0
	var d=document;
	if(d.images) {
		if(!d.MM_p) d.MM_p=new Array();
		var i,j=d.MM_p.length,a=MM_preloadImages.arguments;
		for(i=0; i<a.length; i++)
		if(a[i].indexOf("#")!=0) {
			d.MM_p[j]=new Image;
			d.MM_p[j++].src=a[i];
		}
	}
}

function MM_findObj(n, d) { //v3.0
	var p,i,x;
	if(!d) d=document;
	if((p=n.indexOf("?"))>0&&parent.frames.length) {
		d=parent.frames[n.substring(p+1)].document;
		n=n.substring(0,p);
	}
	if(!(x=d[n])&&d.all) x=d.all[n];
	for(i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
	for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
	return x;
}

function MM_swapImage() { //v3.0
	var i,j=0,x,a=MM_swapImage.arguments;
	document.MM_sr=new Array;
	for(i=0;i<(a.length-2);i+=3) {
 		if((x=MM_findObj(a[i]))!=null) {
			document.MM_sr[j++]=x;
			if(!x.oSrc) x.oSrc=x.src;
			x.src=a[i+2];
		}
	}
}

function getStyleObject(objectId) {
    // cross-browser function to get an object's style object
    if(document.getElementById && document.getElementById(objectId)) { // W3C DOM
		return document.getElementById(objectId).style;
    } else {
		if(document.all && document.all(objectId)) { // MSIE 4 DOM
			return document.all(objectId).style;
	    } else {
			if(document.layers && document.layers[objectId]) { // NN 4 DOM.. note: this won't find nested layers
				return document.layers[objectId];
    		} else {
				return false;
			}
		}
    }
}

function disableLink(link) {
 link.disabled = true;
 if (link.style)
  link.style.cursor = 'default';
}


function enableLink(link) {
 link.disabled = false;
 if (link.style)
  link.style.cursor = document.all ? 'hand' : 'pointer';
}

var ctx = new Array('<annals>','^0','</annals>','|0',
					'<au>','^1','</au>','|1',
					'<modified>','^2','</modified>','|2',
					'<settings>','^3','</settings>','|3',
					'<sound>','^4','</sound>','|4',
					'<trackvisited>','^5','</trackvisited>','|5',
					'<aicc>','^6','</aicc>','|6',
					'<putmethod>','^7','</putmethod>','|7',
					'<puttimer>','^8','</puttimer>','|8',
					'<history>','^9','</history>','|9',
					'<visits>','^a','</visits>','|a',
					'<objects>','^b','</objects>','|b',
					'<object','^B','</object>','|B',
					'<file>','^c','</file>','|c',
					'<objtype>','^d','</objtype>','|d',
					'<title>','^e','</title>','|e',
					'<scoring>','^f','</scoring>','|f',
					'<scoreboards>','^g','</scoreboards>','|g',
					'<scoringtype>','^h','</scoringtype>','|h',
					'<cutvalue>','^i','</cutvalue>','|i',
					'<state>','^j','</state>','|j',
					'<scoreboard','^k','</scoreboard>','|k',
					'<timer>','^l','</timer>','|l',
					'<section','^m','</section>','|m',
					'<question','^n','</question>','|n',
					'<variant','^o','</variant>','|o',
					'<maxattempts>','^p','</maxattempts>','|p',
					'<attemptslast>','^q','</attemptslast>','|q',
					'<maxweight>','^r','</maxweight>','|r',
					'<maxpoints>','^R','</maxpoints>','|R',
					'<points>','^s','</points>','|s',
					'<finalfeedback>','^t','</finalfeedback>','|t',
					'<statusrules>','^u','</statusrules>','|u',
					'<status','^U','</status>','|U',
					'<incomplete','^v','</incomplete>','|v',
					'<passed','^w','</passed>','|w',
					'<completed','^x','</completed>','|x',
					'<value','^y','</value>','|y',
					'<task','^z',
					'mask="','@M',
					'ident="','@0',
					'scored="','@1',
					'qtype="','@2',
					'state="','@3',
					'maxvalue="','@4',
					'cutvalue="','@5',
					'normalize="','@6',
					'operator="','@7',
					'id="','@8',
					'correct="','@9',
					'false','@a',
					'true','@b',
					'passed','@c',
					'attempted','@d',
					'timeout','@e',
					'exhausted','@f',
					'straight','@g',
					'regressive','@h',
					'yes','@i',
					'normal','@j',
					'total"','@k',
					'choice"','@m',
					'select"','@n',
					'range"','@o',
					'numeric"','@p',
					'text"','@q',
					'oto"','@r',
					'startvalue="','@s',
					'SLIDE_','@S',
					'images/','@I');

function compressXML(src) {
	var toc = src.xml;
	var tmp;
	if(toc.length<1000) return toc;
	toc = trim(toc,true,true,true,true);
	for(var i=0;i<ctx.length;i=i+2) {
		toc = replaceStr(toc,ctx[i],ctx[i+1]);
	}
	toc = "ws_"+toc;
	return toc;
}

function decompressXML(src) {
	var tod = src;
	tod = trim(tod,true,true,true,true);
	if(tod.indexOf("ws_")==-1) return tod;
	tod = tod.substr(tod.indexOf("ws_")+3);
	var tmp;
	for(var i=ctx.length-1;i>0;i=i-2) {
		tod = replaceStr(tod,ctx[i],ctx[i-1]);
	}
	return tod;
}



// CourseLab EngineAPI Module
var clapi_version = "2.0.0";
var clapi_buildDate = "2005-Dec-17";
//(c)2002-2005 Websoft Ltd. http://www.courselab.ru/


var engineAPI = new Object;
engineAPI.swapImage = MM_swapImage;
engineAPI.restoreImage = MM_swapImgRestore;

var engineVar = new Object;
engineVar.q = new Array();
var CLPlayer = new Object;

CLPlayer.call = CallMethod;
CLPlayer.swapImage = MM_swapImage;
CLPlayer.restoreImage = MM_swapImgRestore;


function getRect(ref)
{
	var linkx=0;
	var linky=0;
	var parent=ref;

	linkx=0;
	linky=0;
	linkt=0;
	linkb=0;

	while(parent) {
		linkx+=parent.offsetLeft;
		linky+=parent.offsetTop;
		if(parent.nodeName=="TD" && linkt==0) linkt=parent.offsetWidth;
		if(parent.nodeName=="TD") parent=parent.parentNode;
		if(parent.nodeName=="BODY" && linkb==0) linkb=parent.offsetWidth;
		if(parent.nodeName=="BODY") break;
		parent=parent.parentNode;
	}

	this.shiftx=linkx;
	this.shifty=linky;
	this.tdwidth=linkt;
	this.bodywidth=linkb;
	return this;
}

function NumericCompare(v1,v2)
{
	var n1 = parseFloat(v1);
	var n2 = parseFloat(v2);
	if(isNaN(n1) || isNaN(n2)) return 0;
	return (n1-n2);
}
