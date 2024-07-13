# AutoMute
![downloads](https://img.shields.io/npm/dy/automute)

React video player component that automatically disables video when there is no audio

Useful in one-many video conferencing settings such as classrooms or interactive presentations

## How to install?

This can be readily installed from `npm` using
```
npm install automute
```

## Demo
![Demo](./sample/automute_demo.gif)

## How to execute?

The component can then be included using `<AutoMute />

Props for the component are
* `showStats`: Show the associated current volume and the volume at end of `timeout`
* `fftSize`: The window size for FFT used in volume detection (default - 256)
* `timeout`: The interval time (in milliseconds) after which the video will be disabled if volume is below threshold (default - 4000 ms)
* `threshold`: The value for the volume above which video is triggered (default - 20)


## Whom to contact?

Please direct your queries to [gpavanb1](http://github.com/gpavanb1)
for any questions.

## License

MIT © [gpavanb1](https://github.com/gpavanb1)
