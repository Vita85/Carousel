function Carousel(options) {
  // створюю основний wrapper
  this.wrapper = document.createElement("div");
  this.wrapper.className = "wrapper";
  document.body.appendChild(this.wrapper);

  // конструктор
  this.images = [];
  this.indicators = [];
  this.counter = 0;
  this.step = 0;
  this.slideInterval = null;
  this.intervalTime = options.intervalTime || 3000;
  this.showIndicators = options.showIndicators !== false;
  this.numImages = options.numImages || 4;

  this.init();
}

// створюю метод і передаю в об'єкт функції
Carousel.prototype.init = function () {
  this.createElements();
  this.loadImages();
  this.setupEventListeners();
};

// створюю елементи
Carousel.prototype.createElements = function () {
  this.carouselContainer = document.createElement("div");
  this.carouselContainer.className = "carousel-container";
  this.wrapper.appendChild(this.carouselContainer);

  // контейнер для зображень
  this.imageContainer = document.createElement("div");
  this.imageContainer.className = "carousel-images";
  this.carouselContainer.appendChild(this.imageContainer);

  // контейнер для кнопок
  this.controls = document.createElement("div");
  this.controls.className = "controls";
  this.carouselContainer.appendChild(this.controls);

  // кнопка попередній
  this.prevButton = document.createElement("button");
  this.prevButton.className = "btn";

  //додаю зображення в кнопку
  let prevImg = document.createElement("img");
  prevImg.src = "./icons/icons8-left-60.png";

  this.prevButton.appendChild(prevImg);
  this.controls.appendChild(this.prevButton);

  // кнопка наступний
  this.nextButton = document.createElement("button");
  this.nextButton.className = "btn";

  //додаю зображення в кнопку
 let nextImg = document.createElement("img");
  nextImg.src = "./icons/icons8-right-60.png";

  this.nextButton.appendChild(nextImg);
  this.controls.appendChild(this.nextButton);

  // створюю div для індикаторів
  this.indicatorsContainer = document.createElement("div");
  this.indicatorsContainer.className = "carousel-indicators";
  this.carouselContainer.appendChild(this.indicatorsContainer);

  // створюю кнопки play і pause
  this.playButton = document.createElement("button");
  this.playButton.className = "play-slide";
  this.playButton.textContent = "Play";
  this.wrapper.appendChild(this.playButton);

  this.pauseButton = document.createElement("button");
  this.pauseButton.className = "pause-slide";
  this.pauseButton.textContent = "Pause";
  this.wrapper.appendChild(this.pauseButton);
};

//=========== функціонал

// створюю і завантажую зображення
Carousel.prototype.loadImages = function () {
  let countImages = 0; //початкова кількість зобр.
  for (let i = 0; i < this.numImages; i++) {
    const img = document.createElement("img");
    img.src = `https://picsum.photos/800/600?random=${i}`;
    img.className = "carousel-img";
    this.images.push(img);

    // якщо зобр. точно завантажилися img.onload
    img.onload = () => {
      countImages++;
      if (countImages === this.numImages) {
        this.step = this.images[0].clientWidth;
        this.updateSlider(); //оновлюю
        if (this.showIndicators) this.createIndicators(); //
        this.startSlide(); //автоматичне переключення слайдера при завантаженні сторінки
      }
    };

    this.imageContainer.appendChild(img);
  }
};

// створюю індикатори
Carousel.prototype.createIndicators = function () {
  for (let i = 0; i < this.numImages; i++) {
    const indicator = document.createElement("span");
    indicator.className = "indicator";
    indicator.addEventListener("click", () => this.goToSlide(i));
    this.indicatorsContainer.appendChild(indicator);
    this.indicators.push(indicator);
  }
};

//зміщую зображення
Carousel.prototype.updateSlider = function () {
  // if (this.images.length === 0) return;
  this.imageContainer.style.transform = `translateX(${
    -this.step * this.counter
  }px)`;
};
 
// оновлюю індикатори додаючи клас, коли його index == номеру зобр.
Carousel.prototype.updateIndicators = function () {
  this.indicators.forEach((indicator, index) => {
    indicator.classList.toggle("active", index === this.counter);
  });
};

Carousel.prototype.showNextSlide = function () {
  this.counter = (this.counter + 1) % this.numImages;
  this.updateSlider();
  this.updateIndicators();
};

Carousel.prototype.showPrevSlide = function () {
  this.counter = (this.counter - 1 + this.numImages) % this.numImages;
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


  // відслідковую позиції жести
  let startPosition = 0;
  const positionTouch = (endPosition) => {
    if (endPosition < startPosition) {
      this.showNextSlide();
    } else if (endPosition > startPosition) {
      this.showPrevSlide();
    }
  };

  // відслідковую позицію дотику
  this.imageContainer.addEventListener("touchstart", (event) => {
    startPosition = event.touches[0].clientX;
  });

  this.imageContainer.addEventListener("touchend", (event) => {
    positionTouch(event.changedTouches[0].clientX);
  });

  // відслідковую позицію миші
  this.imageContainer.addEventListener("mousedown", (event) => {
    startPosition = event.clientX;
  });

  this.imageContainer.addEventListener("mouseup", (event) => {
    positionTouch(event.clientX);
  });

  // авто прирпинення презентації коли миша знаходиться на контейнері
  this.imageContainer.addEventListener("mouseover", () => this.pauseSlide());

  this.imageContainer.addEventListener("mouseout", () => this.startSlide());
};

// Ініціалізація слайдера після завантаження HTML

  new Carousel({ numImages: 5, intervalTime: 4000, showIndicators: true });
