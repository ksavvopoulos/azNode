/**
 *  ==================================================
 *  SoftChalk LessonBuilder
 *  Copyright 2003-2008 SoftChalk LLC
 *  All Rights Reserved.
 *
 *  http://www.softchalk.com
 *  ==================================================
 *
 *  LB version 7
 *  File date: September 16, 2011
 */

var my_status = "incomplete";
var API = null;
var scorm = true;
var timeElapsed = 0;
var no_implementation = qfScormNoImpA + "\n\n" + qfScormNoImpB;
var no_such_item = qfScormErrorA + "\n\n" + qfScormErrorB;
var actNumberingStart = qOrder.length;


/*
 * official SCORM names for quiz types
 */
var q_type_names = new Array();
		q_type_names[0] = ""; // not used
		q_type_names[1] = "choice";
		q_type_names[2] = "true-false";
		q_type_names[3] = "choice";
		q_type_names[4] = "fill-in";
		q_type_names[5] = "matching";
		q_type_names[6] = "sequencing";
		q_type_names[7] = "other";  //for activities


/*
 * other = 0 as a safety
 * 1 is not used
 */
var act_type_names = new Array();
		act_type_names[0] = "other"; // safety if there is an error
		act_type_names[1] = "";
		act_type_names[2] = "Flashcard activity";
		act_type_names[3] = "Seek A Word activity";
		act_type_names[4] = "Drag-N-Drop activity";
		act_type_names[5] = "Ordering activity";
		act_type_names[6] = "Crossword activity";
		act_type_names[7] = "Labeling activity";
		act_type_names[8] = "Sorting activity";
		act_type_names[9] = "Hot Spot activity";


/*
 * for QP matching, max of 10 items
 */
var alphabet = new Array("a","b","c","d","e","f","g","h","i","j");
//var alphabet = new Array("a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z");



function findAPI(win) {
	if (win.API_1484_11 != null) {        // look in this window
		return win.API_1484_11;
	}
	else {
		if (win.frames.length > 0) {        // look in this window's frameset kin
			for (var i = 0; i < win.frames.length; i++) {
		 		if (win.frames[i] && win.frames[i].API_1484_11 != null)
		 			return win.frames[i].API_1484_11;
	 		}
		}
		if (typeof(win.opener) != "undefined" && win.opener != null)	{
			return findAPI(win.opener);				// climb up to opener window & look there
		}
		if (win.parent != window && win.parent != win) {
			return findAPI(win.parent);				// climb up to parent window & look there
		}
		return null;
  }
}


function ScormOnload() {
	API = findAPI(window.self);
	if (API != null) {
		API.Initialize("");
		my_status = API.GetValue("cmi.completion_status");
		lmsStudentName = API.GetValue("cmi.learner_name");
		first_name = lmsStudentName.substring((lmsStudentName.lastIndexOf(',') + 1), lmsStudentName.length);
		my_LMS_score = API.GetValue("cmi.score.raw");
		my_time = API.GetValue("cmi.total_time");
		setInterval("incrementTime()", 1000);

		for (var i = 0; i < (qOrder.length); i++) {				//setting up questions
			var cmi_id = "cmi.interactions." + i + ".id";
			var q_id = "Q" + qOrder[i];
			API.SetValue(cmi_id, q_id);
		}

		for (var i = 0; i < actOrder.length; i++) {				//setting up activities
			var cmi_id = "cmi.interactions." + (actNumberingStart + i) + ".id";
			var a_id = "A" + actOrder[i];
			API.SetValue(cmi_id, a_id);
		}
	}
	else {
		alert(no_implementation);
	}
}


function ScormOnunload() {
	if (API != null) {
		sendLessonTime();
    API.SetValue("cmi.location", file_name);
    API.SetValue("cmi.completion_status", my_status);
    API.Terminate("");
    alert(qfScormFinishMsg);
  }
  else {
    alert(no_implementation);
  }
  window.parent.close();
}


/*
 * global variables:
 *
 * my_score
 * total_points
 * attempted_q
 * totalQ
 * scorm_completed_status
 *
 * qfSingleTry from q_functions_ext.js
 */
function sendScorm(item_number, q_type, act_type, student_answer, correct, act_percent) {
	if (API == null) {
		return;
	}

	my_status = "incomplete";

	// maybe a no-repeat lesson
	if (scorm_completed_status && (qfSingleTry || attempted_q == totalQ)) {
		my_status = "completed";
	}


	// set the id for the item to be scored,
	// set the student response
	var cmi_id;
	var student_response;

	if (q_type != 7) {																	// questions
		var display_order = -1;
		for (var i = 0; i < qOrder.length; i++) {
		  if (qOrder[i] == item_number) {
		  	display_order = i;
		  	break;
		  }
		}

		if (display_order == -1) {
			alert(no_such_item);
			return;
		}

		//var q_id = "Q" + (display_order + 1); // avoid the 0
		cmi_id = display_order;


		if (q_type == 5) {																// matching
			for (var i = 0; i < student_answer.length; i++) {
				student_answer[i] = (i + 1) + "[.]" + student_answer[i];
			}
			//student_response = q_id + ": " + student_answer.join("[,]");
			student_response = student_answer.join("[,]");
		}
		else if (q_type == 6) {														// ordering
			student_response = student_answer.join("[,]");
		}
		else {
			//student_response = q_id + ": " + student_answer;
			student_response = student_answer;
		}
	}
	else {																							// activities
		var display_order = -1;
		for (var i = 0; i < actOrder.length; i++) {
			if (actOrder[i] == item_number) {
				display_order = i;
				break;
			}
		}

		if (display_order == -1) {
			alert(no_such_item);
			return;
		}

		var a_id = "A" + (display_order + 1); // avoid the 0
		//student_response = a_id + ": " + act_type_names[act_type] + ", " + act_percent + "% correct.";
		student_response = a_id + " - " + act_type_names[act_type] + ", " + act_percent + "% correct.";
		cmi_id = actNumberingStart + display_order;
	}


	// set the values with the id
	var cmi_type = "cmi.interactions." + cmi_id + ".type";
	var cmi_response = "cmi.interactions." + cmi_id + ".learner_response";
	var cmi_result = "cmi.interactions." + cmi_id + ".result";

	API.SetValue(cmi_type, q_type_names[q_type]);
	API.SetValue(cmi_response, student_response);
	API.SetValue("cmi.score.min", "0");
	API.SetValue("cmi.score.max", total_points);
	API.SetValue("cmi.score.raw", my_score);

	var total_score = 0;
	if (my_score > 0) {
		total_score = Math.round((my_score / total_points) * 10000) / 10000;
	}
	API.SetValue("cmi.score.scaled", total_score);

	API.SetValue("cmi.completion_status", my_status);

	if (correct == "yes") {
		API.SetValue(cmi_result, "correct");
	}
	else {
		API.SetValue(cmi_result, "incorrect");
	}


	if (q_type != 7) {
		var right_answers = eval("right_answers" + item_number);

		if (q_type == 5) { // matching
			for (var i = 0; i < (right_answers.length); i++) {
				right_answers[i] = (i + 1) + "[.]" + alphabet[parseInt(right_answers[i])];
			}
			var ra = right_answers.join("[,]");
			var my_pattern = "cmi.interactions." + cmi_id + ".correct_responses.0.pattern"
			API.SetValue(my_pattern, ra);
		}
		else {
			for (var i = 0; i < (right_answers.length); i++) {
				var my_pattern = "cmi.interactions." + cmi_id + ".correct_responses." + i + ".pattern";
				API.SetValue(my_pattern, right_answers[i]);
			}
		}
	}

	API.Commit("");  //make sure that LMS is storing data sent - not sure whether to leave in??
}

function incrementTime() {
	timeElapsed += 1;
}

function sendLessonTime() {
	var result;
	if(timeElapsed == 0) {
		result = "PT0S";
	}
	else {
		result = "P";
		var tmp = timeElapsed;
		var days = tmp / 86400;
		tmp %= 86400;
		var hours = tmp / 3600;
		tmp %= 3600;
		var minutes = timeElapsed / 60;
		tmp %= 60;
		var seconds = tmp;
		if(Math.floor(days) > 0 ) result += Math.floor(days) + "D";
		result += "T";
		if(Math.floor(hours) > 0 ) result += Math.floor(hours) + "H";
		if(Math.floor(minutes) > 0) result += Math.floor(minutes) + "M";
		if(seconds > 0) result += seconds + "S";
	}

	API.SetValue("cmi.session_time", result);
}
