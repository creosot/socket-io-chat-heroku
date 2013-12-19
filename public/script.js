var socket = io.connect();
function addMessage(msg, name) {
	$("#chatEntries").append('<div class="message"><p>' + name + ' : ' + msg + '</p></div>');
}
function sentMessage() {
	if ($('#messageInput').val() != "") 
	{
		socket.emit('message', $('#messageInput').val());
		addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
		$('#messageInput').val('');
	}
}
socket.on('message', function(data) {
	addMessage(data['message'], data['name']);
});
$(function() {
        $("#submit").click(function() {sentMessage();});
});
