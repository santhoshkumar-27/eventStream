const express = require('express');
const parser = require('body-parser');
const app = express();
const cors = require('cors');
const EventEmitter = require('events');
const Stream = new EventEmitter();
app.use(cors({
    origin: '*'
}));
app.use(parser.json());
app.use(
    parser.urlencoded({
        extended: true,
    }),
    );
    app.get('/my-endpoint', function (request, response) {
    response.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
    });
    Stream.on('push', function (event, data) {
        response.write('event: ' + String(event) + '\n' + 'data:' + JSON.stringify(data) + `\n\n`)
    });
});
let count = 0;
const id = setInterval(function () {
    ++count;
    if (count < 100) {
        Stream.emit('push', 'message', { msg: `count is increasing ${count}` });
    } else {
        // Stream.off('push')
        clearInterval(id);
    }
}, 1000);
app.listen(3000);
console.log("Express E2E mock server is running");