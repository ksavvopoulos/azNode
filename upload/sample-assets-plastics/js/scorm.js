
var scoreTotal = 0;

var ScormStartTime = (new Date()).getTime();

var API = null; /* SCORM API */

/* look up through the frameset hierarchy for the SCORM API */
function findAPI(win)
{
	while ((win.API == null) && (win.parent != null) && (win.parent != win))
	{
		win = win.parent;
	}
	API = win.API;
}

/* initialize the SCORM API */
function initAPI(win)
{
	/* look for the SCORM API up in the frameset */
	findAPI(win);

	/* if we still have not found the API, look at the opener and its frameset */
	if ((API == null) && (win.opener != null))
	{
		findAPI(win.opener);
	}
}

var ScormSubmitted = false; //use this to check whether LMSFinish has been called later.

function ScormStartUp(){
	initAPI(window);
	if (API != null){
		API.LMSInitialize(''); 
		API.LMSSetValue('cmi.core.lesson_status', 'browsed');
		API.LMSSetValue('cmi.core.score.min', 0);
		API.LMSSetValue('cmi.core.score.max', 100);
		API.LMSCommit('');
	}
}

function CheckLMSFinish(){
	if (API != null){
		if (ScormSubmitted == false){
			API.LMSCommit('');
			API.LMSFinish('');
			ScormSubmitted = true;
		}
	}
}

function SetScormIncomplete(){
	if (ScormSubmitted == true){
		return;
	}
	SetScormScore();
	if (API != null){
		API.LMSSetValue('cmi.core.lesson_status', 'incomplete');
		API.LMSSetValue('cmi.core.session_time', MillisecondsToTime((new Date()).getTime() - ScormStartTime));
		API.LMSCommit('');
	}
}

function SetScormComplete(){
	if (API != null){
		API.LMSSetValue('cmi.core.session_time', MillisecondsToTime((new Date()).getTime() - ScormStartTime));
		API.LMSSetValue('cmi.core.lesson_status', 'completed');
		SetScormScore();
		API.LMSCommit('');
		API.LMSFinish('');
		ScormSubmitted = true;
	}
}

function SetScormTimedOut(){
	if (API != null){
		if (ScormSubmitted == false){
			SetScormScore();
			API.LMSSetValue('cmi.core.exit', 'time-out'); 
			API.LMSCommit('');
			CheckLMSFinish();
		}
	}
}


function SetScormScore( Score ){
//Reports the current score and any other information back to the LMS
	if (API != null){
		if( scoreTotal ) {
			Score = scoreTotal;
		}
		API.LMSSetValue('cmi.core.score.raw', Score);
		API.LMSCommit('');
	}
}

ScormStartUp();


function updateScore( score ) {
	
	scoreTotal += score;
	
}

$(window).unload(function() {
	
	SetScormComplete();
	
});

