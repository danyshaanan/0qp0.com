# click
Multiuser pixel art drawing board.

Built with ECMAScript, jQuery, NodeJS, ExpressJS, and Socket.io.

More to be said later on.

See in action on [0qp0.com](http://0qp0.com)


### TODOs

* Add version number
* app.get('/reset', function(req, res){ if (_contains(config.modIPs,ip)) process.exit()/*?*/;});
* ...

### About logging

I've played a bit with recording and replaying the board,
but eventually it seems that an elegant implementation of a
recorder and player was not trivial,
(an un-elegant one, however, was),
and I didn't want to settle for something messy or flaky.
Also, there is something nice in the volatility of it.

Therefore, I'll keep it as is, unless someone would implement it,
or write a standalone logger that would use the `board` and `flip` events
to record the board at all times. (PhantomJS would be nice for that).
