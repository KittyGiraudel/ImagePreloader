(function (global) {

  'use strict';

  function defer() {
    var resolve, reject, promise = new Promise(function (a, b) {
      resolve = a;
      reject = b;
    });

    return {
      resolve: resolve,
      reject: reject,
      promise: promise
    };
  }

  /**
   * Image preloader
   * @param {Object} options
   */
  var ImagePreloader = function (options) {
    this.options = options || {};
    this.options.parallel = this.options.parallel || false;
    this.items = [];
    this.max = 0;
  };

  /**
   * The `queue` methods is intended to add an array (a deck) of images to the
   * queue. It does not preload the images though; only adds them to the queue.
   * @param  {Array} array - Array of images to add the queue
   * @return {Promise}
   */
  ImagePreloader.prototype.queue = function (array) {
    if (!Array.isArray(array)) {
      array = [array];
    }

    if (array.length > this.max) {
      this.max = array.length;
    }
    
    var deferred = defer();

    this.items.push({
      collection: array,
      deferred: deferred
    });
    
    return deferred.promise;
  };

  /**
   * The `preloadImage` preloads the image resource living at `path` and returns
   * a promise that resolves when the image is successfully loaded by the 
   * browser or if there is an error. Beware, the promise is not rejected in 
   * case the image cannot be loaded; it gets resolved nevertheless.
   * @param  {String} path - Image url
   * @return {Promise}
   */
  ImagePreloader.prototype.preloadImage = function (path) {
    return new Promise(function (resolve, reject) {
      var image = new Image();
      image.onload = resolve;
      image.onerror = resolve;
      image.src = path;
    });
  };

  /**
   * The `preload` method preloads the whole queue of decks added through the
   * `queue` method. It returns a promise that gets resolved when all decks have
   * been fully loaded.
   * The decks are loaded either sequencially (one after the other) or in
   * parallel, depending on the `parallel` options.
   * @return {Promise}
   */
  ImagePreloader.prototype.preload = function () {
    var deck, decks = [];

    if (this.options.parallel) {

      for (var i = 0; i < this.max; i++) {
        this.items.forEach(function (item) {
          if (typeof item.collection[i] !== 'undefined') {
            item.collection[i] = this.preloadImage(item.collection[i]);
          }
        }, this);
      }

    } else {

      this.items.forEach(function (item) {
        item.collection = item.collection.map(this.preloadImage);
      }, this);

    }

    this.items.forEach(function (item) {
      deck = Promise.all(item.collection)
        .then(item.deferred.resolve.bind(item.deferred))
        .catch(console.log.bind(console));

      decks.push(deck);
    });

    return Promise.all(decks);
  };

  global.ImagePreloader = ImagePreloader;

}(window));
