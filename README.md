# ImagePreloader

A lightweight JavaScript implementation of an image preloader relying on Promises.

ImagePreloader can deal with a single collection of images, but is meant to handle a queue of collections. It can load them in sequence (first collection in queue, then second, then third...), or in parallel (first image of each collection, then second image of each collection...).

## Preloading a single collection of images

```javascript
var images = ['/image-1.png', 'image-2.jpg', 'http://lorempixel.com/200/400'];

// Instanciate new ImagePreloader
var ip = new ImagePreloader();

// Queue the images
ip.queue(images).then(function () {
  console.log('Images are now pre-loaded.');
});

// Preload the queue
ip.preload();
```

## Preloading several collections of images

```javascript
var deck1 = ['/image-1.png', 'image-2.jpg', 'http://lorempixel.com/200/400'];
var deck2 = ['image_4.jpg', '/34086368342.jpg', 'spacer.gif'];
```

### In sequence

```javascript
// Instanciate new ImagePreloader
var ip = new ImagePreloader();

// Queue the images
ip.queue(deck1).then(function () {
  console.log('Deck 1 fully loaded');
});
ip.queue(deck2).then(function () {
  console.log('Deck 2 fully loaded');
});

// Preload the queue
ip.preload();
```

In this case, the first deck will be loaded first, then the second.

### In parallel

```javascript
// Instanciate new ImagePreloader
var ip = new ImagePreloader({
  parallel: true
});

// Queue the images
ip.queue(deck1).then(function () {
  console.log('Deck 1 fully loaded');
});
ip.queue(deck2).then(function () {
  console.log('Deck 2 fully loaded');
});

// Preload the queue
ip.preload();
```

In this case, all decks are loaded in parallel so the outcome might vary on which is fully loaded first.
