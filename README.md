Turtle Graphcs Do It
====================

What's this?
------------

"Turtle Graphics Do It" is the web application to draw a Turtle Graphics using JavaScript, and, share the code and graphic.

URL
----
[http://turtlegraphics-doit.azurewebsites.net/](http://turtlegraphics-doit.azurewebsites.net/)  
(or shorten: [http://goo.gl/Ku6gPC](http://goo.gl/Ku6gPC) )

"Turtle Graphics Do It" is "HTML5 Offline mode" ready, so you can play the Turtle Graphics at airplane mode if you had opened the site at once.

You can also download "Offline Package" zip file [here](https://github.com/jsakamoto/turtle-graphics-do-it/releases/tag/OfflinePackage-1.0.0).  
This package has no need connection to network.

How to control the turtle?
---------------------------

Default, the global variable "turtle" is there.

The canvas size is 400px x 400px, and the turtle positioned at the center of the canvas initially.

The turtle has only 4 commands(methods) as fllowing.

- move(*d*) ... *d* is distance of pixels.
- turn(*r*) ... *r* is degrees.
- penUp()
- penDown()

### Example

    // draw triangle.
    for (var i=1; i<=3; i++) {
        turtle.move(100);
        turtle.turn(120);
    }
