Simple project arising from Covid-19 boredom...

# Flocking simulation using Pixi JS

Implementation of Craig Reynold's flocking approach. Inspired by The Coding Train on youtube ... taking a break from looking at videos on woodworking :)

![Screen Grab](/resources/screengrab.gif)

* Boids are can be given a limited view
  * View can be restricted by FOV and distance (via code!)
  * View cone starts from the front of boid as opposed to the centre of it
  * View cones can be enabled/disabled (via code!)
* View adjusts to window size (including debounce implementation)
* Cursor avoidance
* Colour of boid is based on the angle of the boids velocity

### To be added

* Optimise performance
* Enable manipulation of rules
* ~~Add cursor avoidance~~
* Add screen edge avoidance


### To run
```
npm i && npm start

```


### Live Demo
[coderadical-flocking](https://coderadical.com/flocking/)

### References
[Craig Reynold](https://www.red3d.com/cwr/boids/)

[Coding Challenge Flocking Video](https://thecodingtrain.com/CodingChallenges/124-flocking-boids.html)

[Coding Challenge Youtube channel](https://www.youtube.com/user/shiffman)
