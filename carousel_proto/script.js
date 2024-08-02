function Carousel(options) {
  // create wrapper
  this.wrapper = document.createElement("div");
  this.wrapper.className = "wrapper";
  document.body.appendChild(this.wrapper);

  // constructor
  this.images = [];
  this.indicators = [];
  this.counter = 0;
  this.step = 0;
  this.slideInterval = null;
  this.intervalTime = options.intervalTime || 3000;
  this.showIndicators = options.showIndicators !== false;
  this.numberOfImages = options.numberOfImages || 4;
}

// create method init with functions;
Carousel.prototype.init = function () {
  this.createElements();
  this.loadImages();
  this.setupEventListeners();
};

// create elements
Carousel.prototype.createElements = function () {
  this.carouselContainer = document.createElement("div");
  this.carouselContainer.className = "carousel-container";
  this.wrapper.appendChild(this.carouselContainer);

  //create container for images
  this.imageContainer = document.createElement("div");
  this.imageContainer.className = "carousel-images";
  this.carouselContainer.appendChild(this.imageContainer);

  //create container for buttons
  this.controlsContainer = document.createElement("div");
  this.controlsContainer.className = "controls";
  this.carouselContainer.appendChild(this.controlsContainer);

  //create prev button
  this.prevButton = document.createElement("button");
  this.prevButton.className = "btn";

  //img for button
  let prevImg = document.createElement("img");
  prevImg.src = "./icons/icons8-left-60.png";

  this.prevButton.appendChild(prevImg);
  this.controlsContainer.appendChild(this.prevButton);

  //create next button
  this.nextButton = document.createElement("button");
  this.nextButton.className = "btn";

  //img for button
  let nextImg = document.createElement("img");
  nextImg.src = "./icons/icons8-right-60.png";

  this.nextButton.appendChild(nextImg);
  this.controlsContainer.appendChild(this.nextButton);

  //create div for indicators
  this.indicatorsContainer = document.createElement("div");
  this.indicatorsContainer.className = "carousel-indicators";
  this.carouselContainer.appendChild(this.indicatorsContainer);

  //create buttons play / pause
  this.playButton = document.createElement("button");
  this.playButton.className = "play-slide";
  this.playButton.textContent = "Play";
  this.wrapper.appendChild(this.playButton);

  this.pauseButton = document.createElement("button");
  this.pauseButton.className = "pause-slide";
  this.pauseButton.textContent = "Pause";
  this.wrapper.appendChild(this.pauseButton);
};

//==========functions

//create and load images
Carousel.prototype.loadImages = function () {
  let countImages = 0;
  for (let i = 0; i < this.numberOfImages; i++) {
    const img = document.createElement("img");
    img.src = `https://picsum.photos/800/600?random=${i}`;
    img.className = "carousel-img";
    this.images.push(img);

    // img.onload
    img.onload = () => {
      countImages++;
      if (countImages === this.numberOfImages) {
        this.step = this.images[0].clientWidth;
        this.updateSlider();
        if (this.showIndicators) this.createIndicators(); //
        this.startSlide();
      }
    };

    this.imageContainer.appendChild(img);
  }
};

// create indicators
Carousel.prototype.createIndicators = function () {
  for (let i = 0; i < this.numberOfImages; i++) {
    const indicator = document.createElement("span");
    indicator.className = "indicator";
    indicator.addEventListener("click", () => this.goToSlide(i));
    this.indicatorsContainer.appendChild(indicator);
    this.indicators.push(indicator);
  }
};

//translate image
Carousel.prototype.updateSlider = function () {
  // if (this.images.length === 0) return;
  this.imageContainer.style.transform = `translateX(${
    -this.step * this.counter
  }px)`;
};

//update indicators when index = counter
Carousel.prototype.updateIndicators = function () {
  this.indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === this.counter);
  });
};

Carousel.prototype.showNextSlide = function () {
  this.counter = (this.counter + 1) % this.numberOfImages;
  this.updateSlider();
  this.updateIndicators();
};

Carousel.prototype.showPrevSlide = function () {
  this.counter = (this.counter - 1 + this.numberOfImages) % this.numberOfImages;
  this.updateSlider();
  this.updateIndicators();
};

Carousel.prototype.goToSlide = function (index) {
  this.counter = index;
  this.updateSlider();
  this.updateIndicators();
};

Carousel.prototype.startSlide = function () {
  if (!this.slideInterval) {
    this.slideInterval = setInterval(
      () => this.showNextSlide(),
      this.intervalTime
    );
  }
};

Carousel.prototype.pauseSlide = function () {
  if (this.slideInterval) {
    clearInterval(this.slideInterval);
    this.slideInterval = null;
  }
};

Carousel.prototype.setupEventListeners = function () {
  this.prevButton.addEventListener("click", () => this.showPrevSlide());
  this.nextButton.addEventListener("click", () => this.showNextSlide());

  this.playButton.addEventListener("click", () => this.startSlide());
  this.pauseButton.addEventListener("click", () => this.pauseSlide());

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      this.showPrevSlide();
    } else if (event.key === "ArrowRight") {
      this.showNextSlide();
    }
  });

  // Touches
  let startPosition = 0;
  const positionTouch = (endPosition) => {
    if (endPosition < startPosition) {
      this.showNextSlide();
    } else if (endPosition > startPosition) {
      this.showPrevSlide();
    }
  };

  //touch
  this.imageContainer.addEventListener("touchstart", (event) => {
    startPosition = event.touches[0].clientX;
  });

  this.imageContainer.addEventListener("touchend", (event) => {
    positionTouch(event.changedTouches[0].clientX);
  });

  //mouse
  this.imageContainer.addEventListener("mousedown", (event) => {
    startPosition = event.clientX;
  });

  this.imageContainer.addEventListener("mouseup", (event) => {
    positionTouch(event.clientX);
  });

  // mouseover
  this.imageContainer.addEventListener("mouseover", () => this.pauseSlide());

  this.imageContainer.addEventListener("mouseout", () => this.startSlide());
};

//initialization carousel

const carousel = new Carousel({
  numberOfImages: 5,
  intervalTime: 4000,
  showIndicators: true,
});
carousel.init();
