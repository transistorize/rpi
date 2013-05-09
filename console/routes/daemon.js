
var gpsd = require('node-gpsd'),
    config = {
        program: 'gpsd',
        device: '/dev/cu.usbserial',
        port: 2947,
        pid: '/tmp/gpsd.pid',
        verbose: false
    };


var daemon,
    daemonStatus = 'unknown';


function createDaemon(force) {
    if (!daemon || force) {
        daemon = new gpsd.Daemon(config);
        daemon.on('died', function() {
            daemonStatus = 'dead';
            console.warn('daemon has died');
        });
    }
}


/*
 * GET daemon status.
 */
exports.index = function(req, res) {  
    res.send('the gpsd daemon is: ' + daemonStatus );
};


/*
 * POST daemon start.
 */
exports.start = function(req, res) {
    console.log('Calling start');
    createDaemon();
    daemon.start(function() {
        daemonStatus = 'running';
        res.send('daemon started');
        console.log('Started');
    });
};


/*
 * POST daemon stop.
 */
exports.stop = function(req, res) {
    console.log('Calling stop');
    if (daemon) {
        daemon.stop(function() {
            console.log
        });
        daemon = null;
    }
};


exports.listen = function(cb) {
  var listener = new gpsd.Listener({
     port: 2947,
     hostname: 'localhost',
     verbose: false
  });
    
  listener.connect(function() {
    console.log('Connected');
    listener.on('TPV', cb);
    listener.watch();
  });
       
}


