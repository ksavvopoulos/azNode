/* Copyright © 2003-2005 Rustici Software, LLC  All Rights Reserved. */

//Configuration Parameters
var blnDebug = true;						//set this to false if you don't want the overhead of recording debug information

var strLMSStandard = "SCORM";				//used in versions that support multiple standards, set to "NONE" to default
											//to StandAlone mode. Possible values = "NONE", "SCORM", "AICC", ""SCORM2004", "AUTO"
											//AUTO mode will automatically determine the best standard to use (it first tries SCORM 2004, then SCORM 1.2/1.1 then AICC, then NONE)

var DEFAULT_EXIT_TYPE = EXIT_TYPE_SUSPEND;	//When the content is unloaded without an API function indicating the type of exit, 
											//what default behavior do you want to assume.  Use EXIT_TYPE_SUSPEND if you plan to
											//call Finish when the content is complete.  Use EXIT_TYPE_FINISH if you do not plan
											//to call Finish.


var AICC_LESSON_ID = "1";					//if recording question answers in AICC in an LMS that supports interactions,
											//this field need to match the system_id on line in the .DES file that describes
											//this course, the default is 1. Be sure that this value does not contain double quote characters (")
											
var EXIT_BEHAVIOR = "SCORM_RECOMMENDED";		//used to control window closing behavior on call of ConcedeControl
												//Possible Values: SCORM_RECOMMENDED, ALWAYS_CLOSE, ALWAY_CLOSE_TOP, NOTHING, REDIR_CONTENT_FRAME

var EXIT_TARGET = "lms/goodbye.html";			//Used in conjunction with EXIT_BEHAVIOR, only with REDIR_CONTENT_FRAME. This should be a neutral page that is displayed
											//after the course has exited, but before it has been taked away by the LMS

var AICC_COMM_DISABLE_XMLHTTP = false;		//false is the preferred value, true can be required in certain cross domain situations
var AICC_COMM_DISABLE_IFRAME = false;		//false is the preferred value, true can be required in certain cross domain situations

var AICC_COMM_PREPEND_HTTP_IF_MISSING = true;		//Some AICC LMS's will omit the "http://" from the AICC_URL value. If this is the case,
													//set this setting to true to have the API prepend the "http://" value

var AICC_REPORT_MIN_MAX_SCORE = false;		//Some AICC LMS's have trouble processing a score falue which contains a min and max value. Setting this 
											//value to false allows you to turn off that reporting to accommodate those LMS's.

/*
These variables control how long the API should wait on an AICC form submission before timing out
AICC_RE_CHECK_LOADED_INTERVAL = Number of milliseconds the API waits between checks to see if the form is loaded
AICC_RE_CHECK_ATTEMPTS_BEFORE_TIMEOUT = Number of times the API checks to see if the form is loaded
AICC_RE_CHECK_LOADED_INTERVAL * AICC_RE_CHECK_ATTEMPTS_BEFORE_TIMEOUT = Desired time out in milliseconds
*/
var AICC_RE_CHECK_LOADED_INTERVAL = 250;
var AICC_RE_CHECK_ATTEMPTS_BEFORE_TIMEOUT = 240;
