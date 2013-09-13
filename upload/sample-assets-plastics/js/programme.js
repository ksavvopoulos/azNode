/**
 * Focus Educational 
 */


var programme = {
	
	start: function() {
		
		/**
		 * Logout link
		 */
		$('.logout-link').click(function() {
			if( confirm('Are you sure you want to log out?') ) {
				return true;
			} else {
				return false;
			}
		});
		
		/**
		 * 'Change the topic' link clicked functionality
		 */
		$('.change-topic-link').click(function() {
			$('.header-dropdown').slideToggle('fast'); // toggle slide up/down on the pulldown header
			$(this).blur(); // blur the link
			return false; // return false
		});
		
		/**
		 * <a> elements with the class "no-link" to do nothing
		 */
		$('.no-link').click(function() {
			$(this).blur(); // blur the link
			return false; // return false
		});
		
		/**
		 * Handle top-level navigation link clicking
		 */
		$('.navigation > li > a').click(function() {

			if( $('.controller').attr('class') ) {
				$('.controller').trigger('click');
			}

			if( $(this).attr('href') != '#' ) { // if the link does not have # as the href..
				return true; // ..return true - default action on the link
			}
			
			if( $(this).parent().hasClass('open') ) { // if the link/area is already open..
				$(this).blur(); // blur the link
				$(this).parent().removeClass('open'); // remove the class
				$(this).parent().removeClass('open-nosuboptions'); // remove the class
				$(this).parent().find('ul').slideUp('fast'); // slide up any embedded <ul>'s
				return false; // return false
			} else {
				$('li.open a').each(function() {
					$(this).parent().removeClass('open'); // remove the class
					$(this).parent().removeClass('open-nosuboptions'); // remove the class
					//$(this).parent().removeClass('selected'); // remove the class
					$(this).parent().find('ul').slideUp('fast'); // slide up any embedded <ul>'s
				});
			}


			if( $(this).parent().find('ul').length > 0 ) { // if the link/area has submenu's...
				$(this).blur(); // blur the link
				$(this).parent().addClass('open'); // add the class
				$(this).parent().find('ul').slideDown('fast'); // slide down submenu's
				return false; // return false
			} else { // if the link/area does NOT have submenu's...
				$(this).blur(); // blur the link
				$(this).parent().addClass('open-nosuboptions'); // add the class
				return false; // return false
			}

		});
		
		/**
		 * Handle expand/collapse navigation links
		 */
		$('.expand_collapse_links a').click(function() { // on click...
			if( $(this).attr('id') == 'expand' ) { // if the link clicked was the 'expand all' link..
				$('.navigation > li').each(function() { // cycle through each top-level <li>
					if( $(this).find('ul').length > 0 ) { // if the current <li> has submenu's <ul>'s...
						$(this).addClass('open'); // add the class
					} else { // if the current <li> does not have any submenu <ul>'s...
						$(this).addClass('open-nosuboptions'); // add the class
					}
					$(this).find('ul').slideDown('fast'); // slide down any submenu <ul>'s
				});
			} else if( $(this).attr('id') == 'collapse' ) { // if the link clicked was the 'collapse all' link..
				$('.navigation > li').each(function() { // cycle through each top-level <li>
					if( $(this).find('ul').length > 0 ) { // if the current <li> has submenu's <ul>'s...
						$(this).removeClass('open'); // remove the class
						$(this).removeClass('open-nosuboptions'); // remove the class
						$(this).removeClass('selected'); // remove the class
					} else {// if the current <li> does not have any submenu <ul>'s...
						$(this).removeClass('open-nosuboptions'); // remove the class
					}
					$(this).find('ul').slideUp('fast'); // slide up any submenu <ul>'s
				});
			}
			return false; // return false
		});
		
		/**
		 * Instantiate the Facebox plugin against all hyperlinks with class="popup"
		 */
		//$('a[class*=popup]').facebox();
		$('a[class*=popup]').live('click', function(event) {
			event.preventDefault();
			var href = $(this).attr('href');
			jQuery.facebox({ div: $(this).attr('href') });
		});

		/**
		 * Instantiate the QTip plugin
		 */
		$('[title]').qtip({
			style: { 
				 name: 'blue'
				,tip: true
			}
			,position: {
				adjust: {
					screen: true
				}
			}
		});
		
		/**
		 * Handle image zooming
		 */
		$('img.zoom').click(function() {
			if( $(this).hasClass('zoomed-in') ) {
				
				$(this).removeClass('zoomed-in');
				
				if( $(this).hasClass('zoom-alternate') ) {
					alt = $(this).attr('alt');
					src = $(this).attr('src');
					$(this).attr('src', alt);
					$(this).attr('alt', src);
				}
				
			} else {
				
				$(this).addClass('zoomed-in');
				
				if( $(this).hasClass('zoom-alternate') ) {
					alt = $(this).attr('alt');
					src = $(this).attr('src');
					$(this).attr('src', alt);
					$(this).attr('alt', src);
				}
				
			}
		});
		
		/**
		 * Auto resize zoomable images
		 */
		$('img.zoom').each(function() {
			if( $(this).width() > $(this).height() ) {
				$(this).addClass('zoom_landscape');
			} else if( $(this).width() < $(this).height() ) {
				$(this).addClass('zoom_portrait');
			} else {
				$(this).addClass('zoom_square');
			}
		});
		
		/**
		 * Automatic SWF implementation based on <input> method
		 */
		$('input.swf').each(function() {
			var filename = $(this).val();
			var dims = $(this).attr('title').split(':');
			var width = dims[0];
			var height = dims[1];
			var bordered = dims[2];
			var flashvars = $(this).attr('id');
			var name = $(this).attr('name');

			if(bordered == "bordered") {
				var theclass = "bordered";
			} else {
				var theclass = "";
			}
			
			//var output = '<p><embed class="'+theclass+'" wmode="transparent" src="'+filename+'" quality="high" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" allowscriptaccess="sameDomain" allowfullscreen="True" height="'+height+'" width="'+width+'" /></p>';
			var id = "swf_" + randomString();
			var output = '<div id="'+id+'" class="'+theclass+'" style="width:'+width+'px; height:'+height+'px;"></div>';
			$(this).after(output);

			$('#'+id).flashembed({
				 src: filename
				,width: width
				,height: height
				,flashvars: flashvars
				,wmode: 'transparent'
				,id: name
			});

		});
		
		/**
		 * Toggle hidden elements 
		 */
		$('.togglevisibility').click(function() {
			var id = $(this).attr('rel');
			$('#' + id).toggle();
			return false;
		});
		
		/**
		 *
		 */
		$('.facebox-swf').click(function() {
			var href = $(this).attr('href');
			var rel = $(this).attr('rel');
			
			var mySplit = rel.split("&");
			var mySplit_width = mySplit[0].split("=");
			var mySplit_height = mySplit[1].split("=");
			var mySplit_bordered = mySplit[2].split("=");

			if( href.search(/.flv/) > 0 ) {
				var poster = href.replace('.flv', '.jpg');
				flashvars = "video=../" + href + "&poster=" + poster;
				href = "swf/svplayer.swf";
			}
			
			if(!flashvars) {
				var flashvars = '';
			}
			
			jQuery.facebox(function($) {
				data = '<div id="focusplayer" style="width:'+mySplit_width[1]+'px; height:'+mySplit_height[1]+'px; border:0"></div>';
				jQuery.facebox(data);
				setTimeout(function() {
					jQuery('#focusplayer').flashembed({
						 src: href
						,width: mySplit_width[1]
						,height: mySplit_height[1]
						,flashvars: flashvars
					});
				}, 1000);
			});
			
			return false;
		});
		
		/**
		 * Open a multiple choice quiz pop-up
		 */
		$('.multiplechoice').click(function() {
			var xml = $(this).attr('rel');
			var images_path = $(this).attr('name');

			if(!xml) {
				alert('Sorry, could not load the multiple choice: The XML file attribute is missing.');
			}
			if(!images_path) {
				alert('Sorry, could not load the multiple choice: The images path attribute is missing.');
			}

			jQuery.facebox({ ajax: 'popup_multiplechoicequiz.php?xml=' + xml + '&images_path=' + images_path });

			return false;
		});

		/**
		 * Open a Flash Playlist pop-up
		 */
		$('.playlist').click(function() {
			var xml = $(this).attr('rel');

			var dims = $(this).attr('name').split(':');
			var width = dims[0];
			var height = dims[1];

			if(!xml) {
				alert('Sorry, could not load the Flash Playlist: The XML file attribute is missing.');
			}

			//jQuery.facebox({ ajax: 'popup_playlist.php?xml=' + xml + '&width=' + width + '&height=' + height });

			jQuery.facebox(function($) {
				var data = '<div id="focusplaylistpopup" style="width:'+width+'px; height:'+height+'px; border:0;"></div>';
				jQuery.facebox(data);
				setTimeout(function() {
					jQuery('#focusplaylistpopup').flashembed({
						 src: 'swf/videoplaylist.swf'
						,width: width
						,height: height
						,flashvars:'playlist='+xml
					});

				}, 1000);
			});

			return false;
		});

	}
	
};

$(document).ready( programme.start ); // on DOM ready run programme.start()

function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	}
	return randomstring;
}

function sendToJavaScript(val){			
	//var s = 'woodjoints/pages/' + getHTMLFile(val);          
	var s = getHTMLFile(val);     
	clientSideInclude('info', s);
}

function clientSideInclude(id, url) {
	if(id && url) {
		$('#'+id).load( url );
	}
}

function getHTMLFile(id){
  switch(id){
     case 0:
        return 'ajax_corner_mt.html';
        break;
     case 1:
        return 'ajax_double_mt.html';
        break;
     case 2:
        return 'ajax_grooved_frame_mt.html';
        break;
     case 3:
        return 'ajax_haunched_mt.html';
        break;
     case 4:
        return 'ajax_loose_wedged_mt.html';
        break;   
     case 5:
        return 'ajax_stopped_mt.html';
        break;
     case 6:
        return 'ajax_through_mt.html';
        break;
     case 7:
        return 'ajax_twin_mt.html';
        break;
     case 8:
        return 'ajax_twin_mt.html';
        break;
     case 9:
        return 'ajax_through_mt.html';
        break;
     case 10:
        return 'ajax_dowel.html';
        break;
     case 11:
        return 'ajax_dowel.html';
        break;
     case 12:
        return 'ajax_e2e_dowel3.html';
        break;
     case 13:
        return 'ajax_dowel_butt.html';
        break;   
     case 14:
        return 'ajax_bridle_corner.html';
        break;
     case 15:
        return 'ajax_bridle_tee.html';
        break;        
     case 16:
        return 'ajax_lap.html';
        break;    
     case 17:
        return 'ajax_halving_corner.html';
        break; 
     case 18:
        return 'ajax_halving_tee.html';
        break; 
     case 19:
        return 'ajax_halving_cross.html';
        break; 
     case 20:
        return 'ajax_halving_tee.html';
        break; 
     case 21:
        return 'ajax_through_dovetail.html';
        break; 
     case 22:
        return 'ajax_lapped_dovetail.html';
        break; 
     case 23:  
        return 'ajax_finger.html';
        break; 
     case 24:
        return 'ajax_stopped_housing.html';
        break; 
     case 25:
        return 'ajax_through_housing.html';
        break; 
     case 26:
        return 'ajax_e2e_butt.html';
        break; 
     case 27:
        return 'ajax_mitre_butt.html';
        break; 
     case 28:
        return 'ajax_mitre_butt.html';
        break; 
     case 29:
        return 'ajax_e2e_splined.html';
        break; 
     case 30:
        return 'ajax_mitre_splined.html';
        break;
     case 31:
        return 'ajax_sq_end_butt.html';
        break;  
     case 32:
        return 'ajax_sq_end_butt.html';
        break;  
     case 33:
        return 'ajax_e2e_grooved.html';
        break;  
     case 34:
        return 'ajax_drawer_groove.html';
        break;  
     case 35:
        return 'ajax_e2e_biscuit.html';
        break;  
     case 36:
        return 'ajax_butt_rub.html';
        break;  
     case 37:
        return 'ajax_drawer_groove.html';
        break;  
     case 38:
        return 'ajax_rebate.html';
        break;  
     default:
        return 'ajax_blank.html';    
                
  }

}


