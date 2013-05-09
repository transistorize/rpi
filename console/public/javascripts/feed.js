
console.log('starting io connection');
var socket = io.connect('http://localhost');

socket.on('status', function (message) {
    feedArea.text = feedArea.text + "\n" + message.statusUpdate;
    viewModel.addDebugCommand('status', message);   
});

socket.on('push', function(message) {
    viewModel.addToFeed(message.data);    
});

socket.on('shutdown', function(message) {
    feedArea.text = feedArea.text + "\n" + message.goodbye;
    viewModel.addToFeed(message.goodbye);
    viewModel.addDebugCommand('shutdown', message);
});

socket.on('contact_received', function(message) {
    viewModel.addDebugCommand('contact_received', message);
});

viewModel.setSocket(socket);

// init client -> server communication
socket.emit('contact', {uuid: 'random data ui id'});

