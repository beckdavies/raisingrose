$(function() {

	var form = $('form');
	var quote = $('#quote');
	var saveBtn = $('.js-save');
	var showQuotesBtn = $('.js-show-quotes');
	var addQuoteBtn = $('.js-add-quote');
	var formWrapper = $('.js-form-wrapper');
	var quoteWrapper = $('.js-quotes-wrapper');
	var quoteContainer = $('.js-quote-container');
	var quoteActions =$('.js-quote-actions');

		
	// trigger a click event on the button contained within the form, 
	$(saveBtn).on('click', function() {
	  $('.save.is-hidden').trigger('click');
	});
	
	// when the ajax call starts, add a class to the save button and change the text
	$(document).on("ajaxStart.firstCall", function () {
       $(saveBtn).addClass('saving');
    });


	// Submit the form via AJAX
	// Set up an event listener for the contact form.
	$(form).submit(function(e) {
		// Stop the browser from submitting the form.
		e.preventDefault();

		// Serialize the form data.
		var formData = $(form).serialize();
		//console.log(formData);

		// Submit the form using AJAX.
		$.ajax({
			type: 'POST',
			url: $(form).attr('action'),
			data: formData
		})
		.done(function(response) {
			// Make sure that the formMessages div has the 'success' class.
			$(quote).removeClass('error').addClass('success');
	
			$(saveBtn).removeClass('saving').addClass('success');
	
			setTimeout(function() {
				$(saveBtn).removeClass('success');
			}, 5000);

			// Set the message text.
			$(quote).text(response);

			// Clear the form.
			$('#quote').val('');
			$('#about').val('');
		})
		.fail(function(data) {
			// Make sure that the quotes textarea has the 'error' class.
			$(quote).removeClass('success saving').addClass('error');

			// Set the message text.
			if (data.responseText !== '') {
				$(quote).text(data.responseText);
			} else {
				$(quote).text('Oops! An error occured and your quote could not be saved.');
			}
		});

	});
	

	// Retrieve data from database via AJAX
	$(showQuotesBtn).on('click', function() {	 
		
		if(!$(this).hasClass('is-clicked')) {
	  		$(this).addClass('is-clicked')
	  	} else {
	  		$(this).removeClass('is-clicked')
	  	}
	
		// there are no quotes present 
		if($(quoteWrapper).hasClass('is-empty')) {
			// ... get the quotes via AJAX
			$.ajax({
				type: 'POST',
				url: 'helpers/get-quotes.php',
				data: '',
				global: false,
			})
			.done(function(response) {
				$('.quotes').html(response);
				$(quoteWrapper).removeClass('is-empty').addClass('is-full');
				// ...hide the add a quote form
				$(formWrapper).slideToggle().removeClass('is-visible').addClass('is-hidden');
				$(addQuoteBtn).removeClass('is-clicked')
			})
			.fail(function(data) {
				console.log('Error occurred. Error code: ' + error.code);
				// 0: unknown error
				// 1: permission denied
				// 2: position unavailable (error response from location provider)
				// 3: timed out
			});
		} else {
			// quotes are showing ... 
			// hide the quotes ...		
			$('.js-quote-container').hide();
			$(quoteWrapper).removeClass('is-full').addClass('is-empty');
			$(this).removeClass('is-clicked');
			
			// ... and if the add quote form is hidden, show it
			if($(formWrapper).hasClass('is-hidden')) {
				$(formWrapper).slideToggle().removeClass('is-hidden').addClass('is-visible');
				$(this).removeClass('is-clicked');

				if(!$(addQuoteBtn).hasClass('is-clicked')) { 
					$(addQuoteBtn).addClass('is-clicked')
				} else {
					$(addQuoteBtn).removeClass('is-clicked')
				}
			}		
		}

	});
	
	// When clicking on the Add Quote button
	// show the add quote form if it is not already visible
	$(addQuoteBtn).on('click', function() {
	  
	  // if there are quotes showing and the form is hidden
	  if($(quoteWrapper).hasClass('is-full') && $(formWrapper).hasClass('is-hidden')) { 
	  	$(formWrapper).slideToggle().removeClass('is-hidden').addClass('is-visible');
	  	$(addQuoteBtn).addClass('is-clicked');
	  } else if($(quoteWrapper).hasClass('is-full') && $(formWrapper).hasClass('is-visible')) { 
	  	$(formWrapper).slideToggle().removeClass('is-visible').addClass('is-hidden');
	  	$(addQuoteBtn).removeClass('is-clicked');
	  }
	
	});
	
	// make content editable
	$(quoteWrapper).on('click', '.js-editable', function(e) { 
		e.stopPropagation();
		
		var toEdit = $(this);
		var oldText = $(toEdit).text();
		this.oldText = oldText; /*making it a javascript object instead of a jquery object, so I can pass it to the next blur event on the same object */
		var oldTextLength = oldText.length;
		var toEditHeight = $(toEdit).height();
		var hideBtn = $(this).siblings('.js-quote-action-hide');
		var quoteContainer = $(this).parent();
		
		$(toEdit).addClass('is-editing js-is-editing'); // for styling purposes only
		$(quoteContainer).addClass('js-container-is-editing'); // to know whether to show / hide the hide button
		
		//show and hide the edit links
		if (!$(quoteContainer).hasClass('js-container-is-editing')) {
			if($(hideBtn).hasClass('is-hidden')) {
				$(hideBtn).removeClass('is-hidden')	
			}
		}
		
		if($(toEdit).hasClass('date')) {
			$(toEdit).text('').append('<input name="date" class="date" />');
		} else if($(toEdit).hasClass('quote')) {
			$(toEdit).text('').append('<textarea name="quote" id="quote" style="height:'+toEditHeight+'px"></textarea>');		
		} else {
			$(toEdit).text('').append('<textarea name="about" id="about" style="height:'+toEditHeight+'px"></textarea>');
		}
		
		$(toEdit).children().val(oldText);
		$(toEdit).children().focus();
		$(toEdit).children().setCursorPosition(oldTextLength);			
	})
	
	// save the edited content
	$(quoteWrapper).on('blur', '.js-is-editing', function(e) {
		var textBeforeEditing = this.oldText;

		var toSave = $(this);
  		//$(this).css( "outline", "1px solid red" );
		//serialize the separate pieces of form data and concatenate them, to send it to the database
		var quoteData = $(this).children().serialize();
		var idData = $(this).parent().find('input[name="quote-id"]').serialize();
		var formData = quoteData+'&'+idData;
		
		// take the new copy and save it
		//var newText = $(this).children().val().replace(/\n/g, '<br/>');	
		var textAfterEditing = $(this).children().val()	
		//console.log(newText);
	
		$(toSave).removeClass('success');
		// remove the form element and set the text of the container to the new text
		$(this).children().remove();
		$(this).html(textAfterEditing);
		
		//only send the data via ajax if the content has been edited
		if (String(textBeforeEditing) != String(textAfterEditing)) {
			console.log('different');
			console.log('before: ' + textBeforeEditing);
			console.log('after: ' + textAfterEditing);
			
			$.ajax({
				type: 'POST',
				url: 'helpers/update-quote.php',
				data: formData,
				global: false,
			})
			.done(function(response) {	
				$(toSave).removeClass('is-editing js-is-editing').addClass('success');
				$(toSave).closest('.js-container-is-editing').removeClass('js-container-is-editing');
				setTimeout(function() {
					$(toSave).removeClass('success');
				}, 120000);
			})
			.fail(function(data) {
				console.log('Error occurred. Error code: ' + error.code);
			});

		}	
			
	})
	
	
	
	// hide a quote
	$(quoteWrapper).on('click', '.js-quote-action-hide', function(e) { 
		e.stopPropagation();
		e.preventDefault();
		
		$(this).parent('div').addClass('to-remove');
		var formData = $(this).next().serialize();
				
		$.ajax({
				type: 'POST',
				url: 'helpers/hide-quote.php',
				data: formData,
				global: false,
			})
			.done(function(response) {
				$('.to-remove').slideUp(500, function() {
					$(this).remove();
				});
			})
			.fail(function(data) {
				console.log('Error occurred. Error code: ' + error.code);
				// 0: unknown error
				// 1: permission denied
				// 2: position unavailable (error response from location provider)
				// 3: timed out
			});
		})
});

//SET CURSOR POSITION
$.fn.setCursorPosition = function(pos) {
  this.each(function(index, elem) {
    if (elem.setSelectionRange) {
      elem.setSelectionRange(pos, pos);
    } else if (elem.createTextRange) {
      var range = elem.createTextRange();
      range.collapse(true);
      range.moveEnd('character', pos);
      range.moveStart('character', pos);
      range.select();
    }
  });
  return this;
};

// get the GPS data
function getLocation() {
	var startPos;
	  
	var geoOptions = {
		timeout: 100000
	}

	var geoSuccess = function(position) {
		startPos = position;
		$('#lat').attr('value',startPos.coords.latitude);
		$('#long').attr('value',startPos.coords.longitude);
		$('.js-GPS-status').removeClass('finding').addClass('found');
	};
  
	var geoError = function(error) {
		console.log('Error occurred. Error code: ' + error.code);
		// 0: unknown error
		// 1: permission denied
		// 2: position unavailable (error response from location provider)
		// 3: timed out
		  
		$('.js-GPS-status').removeClass('finding').addClass('not-found');
		$('#lat').attr('value',"");
		$('#long').attr('value',"");
	};

	navigator.geolocation.getCurrentPosition(geoSuccess, geoError, geoOptions);
} //END getLocation

// when the quote box has focus, change the classes and start getting the GPS data
$('.js-quote').focus(function() {
  if ( $('.js-GPS-status').length ) {
  	$('.js-GPS-status').removeClass('found not-found').addClass('finding');
  } else {
  	$('.js-GPS-status').addClass('finding');
  }
  getLocation();
});