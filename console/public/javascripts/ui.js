

function AppViewModel() {
    var self = this,
        socket,
        isCollecting = ko.observable(false),
        isDaemonAlive = ko.observable(false), 
        feedBtnName = ko.observable('Start collecting data'),
        receivedCommands = ko.observableArray([]);

    this.collectionStatus = ko.computed(function() { 
        return (self.isCollecting()) ? 'Collecting data' : 'Not collecting data'; 
    }, this);

    this.daemonStatus = ko.computed(function() {
        return (self.isDaemonAlive()) ? 'Daemon running' : 'Daemon not running';
    }, this);
    
    
    this.toggleCollectionFeed = function() {
        console.log('toggle collection feed');
        if (self.isCollecting()) {
            self.socket.emit('unsubscribe', {uuid: 'geo'});
            self.isCollecting(false);
            self.feedBtnName('Start collecting data');
        } else {
            self.socket.emit('subscribe', {uuid: 'geo'});
            self.isCollecting(true);
            self.feedBtnName('Stop collecting data');
        }
    };

    this.setSocket = function(dataSocket) {
        self.socket = dataSocket;
    };

    this.addDebugCommand = function(evt, message) {
        self.receivedCommands.push({ 'command': evt, 'message': JSON.stringify(message) });
    };

    this.addToFeed = function(data) {
        var feedArea = document.getElementById("feed");
        feedArea.innerHTML = feedArea.innerHTML + "\n" + JSON.stringify(data);
    }

}

// View Model
var viewModel = new AppViewModel();

// Activates knockout.js
ko.applyBindings(viewModel);



