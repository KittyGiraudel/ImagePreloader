(function (global) {
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
    this.options.parallel = options.parallel || false;
    this.items = [];
  };

  /**
   * @param  {Array} array - Array of images to add the queue
   * @return {Promise}
   */
  ImagePreloader.prototype.queue = function (array) {
    if (!Array.isArray(array)) {
      array = [array];
    }
    
    var deferred = defer();

    this.items.push({
      collection: array,
      deferred: deferred
    });
    
    return deferred.promise;
  };

  /**
   * Preload a single image
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
   * Preload the whole queue (sequencially or in parallel depending on the value
   * of `this.options.parallel`)
   */
  ImagePreloader.prototype.preload = function () {
    if (this.options.parallel) {
      this.preloadParallel();
    } else {
      this.preloadSequence();
    }

    this.items.forEach(function (item) {
      Promise.all(item.collection)
        .then(item.deferred.resolve.bind(item.deferred))
        .catch(console.log.bind(console));
      });
  };

  /**
   * Preload the queue in parallel
   */
  ImagePreloader.prototype.preloadParallel = function () {
    var max = Math.max.apply(Math, this.items.map(function (el) { return el.collection.length; }));
    
    for (var i = 0; i < max; i++) {
      this.items.forEach(function (item) {
        if (typeof item.collection[i] !== 'undefined') {
          item.collection[i] = this.preloadImage(item.collection[i])
        }
      }, this);
    }
  };

  /**
   * Preload the queue in sequence
   */
  ImagePreloader.prototype.preloadSequence = function () {
    this.items.forEach(function (item) {
      item.collection.forEach(function (image, i) {
        item.collection[i] = this.preloadImage(image);
      }, this);
    }, this);
  };

  global.ImagePreloader = ImagePreloader;

}(window));
