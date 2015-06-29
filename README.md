# ImagePreloader

ImagePreloader is a lightweight JavaScript implementation of an image preloader relying on Promises. The point is to be able to preload a bunch of images in the browser before they get actually used, in order to provide the user a seamless experience.

ImagePreloader can deal with a single collection of images, but is primarily meant to handle a queue (list) of collections. It can load them in sequence (one after the other), or in parallel (first image of each collection, then second image of each collection...).

The idea is simple: you add decks (collections of images) to the preloader queue with the `.queue(array)` method. This method returns a Promise so you can use `.then(..)` on it to execute some code once it gets fully loaded. To launch the preloading, you use the `.preload()` method. That's it.

## API

* Constructor

  ```javascript
  ImagePreloader(<Object> options)
  ```

* Add collection of images to the queue

  ```javascript
  <Promise> .queue(<Array> array)
  ```

* Preload the queue

  ```javascript
  <Promise> .preload()
  ```

## Example

### Preloading a single collection of images

```javascript
var images = ['/image-1.png', 'image-2.jpg', 'http://lorempixel.com/200/400'];

// Instanciate new ImagePreloader
var ip = new ImagePreloader();

// Queue the images
ip.queue(images);

// Preload the queue
ip.preload().then(function () {
  // Code to execute once the collection is fully loaded
  console.log('Images fully preloaded.');
});
```

### Preloading several collections of images

```javascript
var deck1 = ['/image-1.png', 'image-2.jpg', 'http://lorempixel.com/200/400'];
var deck2 = ['image_4.jpg', '/34086368342.jpg', 'spacer.gif'];

// Instanciate new ImagePreloader
var ip = new ImagePreloader({
  // If `false`, then decks are loaded sequencially
  // If `true`, then decks are loaded in parallel
  parallel: true
});

// Queue the images
ip.queue(deck1).then(function () {
  console.log('First deck fully loaded.');
});
  
ip.queue(deck2).then(function () {
  console.log('Second deck fully loaded.');
});

// Preload the queue
ip.preload().then(function () {
  console.log('All decks fully loaded.');
});
```

## Demo

[Proof of concept](http://codepen.io/HugoGiraudel/pen/5acaabef85072295d7669a73afb43023). Uses images from http://lorempixel.com.
