//The following code changes the number shown for the number of characters that are yet to be filled
//before the user reaches the limit for the corresponding text box
var maxLengthTextarea = 1000;
var maxLengthName = 30;
$('textarea').keyup(function() {
  var length = $(this).val().length;
  var length = maxLengthTextarea-length;
  $('#chars').text(length);
});

$('#name-input').keyup(function() {
  var length = $(this).val().length;
  var length = maxLengthName-length;
  $('#chars-name').text(length);
});