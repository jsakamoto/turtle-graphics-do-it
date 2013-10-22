Turtle Graphcs Do It
====================

What's this?
------------

"Turtle Graphics Do It" is the web application to draw a Turtle Graphics using JavaScript, and, share the code and graphic.

URL
----
[http://turtlegraphics-doit.azurewebsites.net/](http://turtlegraphics-doit.azurewebsites.net/)  
(or shorten: [http://goo.gl/Ku6gPC](http://goo.gl/Ku6gPC) )

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
