
  class Carousel {
  constructor(options) {
   
    this.wrapper = document.createElement("div");
    this.wrapper.className = "wrapper";
    document.body.appendChild(this.wrapper);


    this.images = [];
    this.indicators = [];
    this.counter = 0;
    this.step = 0;
    this.slideInterval = null;
    this.intervalTime = options.intervalTime || 3000;
    this.showIndicators = options.showIndicators !== false;
    this.numberOfImages = options.numberOfImages || 4;
  }

  init() {
    this.createElements();
    this.loadImages();
    this.setupEventListeners();
  }

  createElements() {
    this.carouselContainer = document.createElement("div");
    this.carouselContainer.className = "carousel-container";
    this.wrapper.appendChild(this.carouselContainer);

  
    this.imageContainer = document.createElement("div");
    this.imageContainer.className = "carousel-images";
    this.carouselContainer.appendChild(this.imageContainer);


    this.controlsContainer = document.createElement("div");
    this.controlsContainer.className = "controls";
    this.carouselContainer.appendChild(this.controlsContainer);

  
    this.prevButton = document.createElement("button");
    this.prevButton.className = "btn";

  
    const prevImg = document.createElement("img");
    prevImg.src = "./icons/icons8-left-60.png";
    prevImg.alt = "Previous";
    this.prevButton.appendChild(prevImg);
    this.controlsContainer.appendChild(this.prevButton);


    this.nextButton = document.createElement("button");
    this.nextButton.className = "btn";


    const nextImg = document.createElement("img");
    nextImg.src = "./icons/icons8-right-60.png"; 
    nextImg.alt = "Next";
    this.nextButton.appendChild(nextImg);
    this.controlsContainer.appendChild(this.nextButton);

    this.indicatorsContainer = document.createElement("div");
    this.indicatorsContainer.className = "carousel-indicators";
    this.carouselContainer.appendChild(this.indicatorsContainer);

    this.playButton = document.createElement("button");
    this.playButton.className = "play-slide";
    this.playButton.textContent = "Play";
    this.wrapper.appendChild(this.playButton);

    this.pauseButton = document.createElement("button");
    this.pauseButton.className = "pause-slide";
    this.pauseButton.textContent = "Pause";
    this.wrapper.appendChild(this.pauseButton);
  }

  loadImages() {
    let countImages = 0;
    for (let i = 0; i < this.numberOfImages; i++) {
      const img = document.createElement("img");
      img.src = `https://picsum.photos/800/600?random=${i}`;
      img.className = "carousel-img";
      this.images.push(img);

      img.onload = () => {
        countImages++;
        if (countImages === this.numberOfImages) {
          this.step = this.images[0].clientWidth;
          this.updateSlider();
          if (this.showIndicators) this.createIndicators();
          this.startSlide();
        }
      };

      this.imageContainer.appendChild(img);
    }
  }

  createIndicators() {
    for (let i = 0; i < this.numberOfImages; i++) {
      const indicator = document.createElement("span");
      indicator.className = "indicator";
      indicator.addEventListener("click", () => this.goToSlide(i));
      this.indicatorsContainer.appendChild(indicator);
      this.indicators.push(indicator);
    }
  }

  updateSlider() {
    if (this.images.length === 0) return;
    this.imageContainer.style.transform = `translateX(${-this.step * this.counter}px)`;
  }

  updateIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.counter);
    });
  }

  showNextSlide() {
    this.counter = (this.counter + 1) % this.numberOfImages;
    this.updateSlider();
    this.updateIndicators();
  }

  showPrevSlide() {
    this.counter = (this.counter - 1 + this.numberOfImages) % this.numberOfImages;
    this.updateSlider();
    this.updateIndicators();
  }

  goToSlide(index) {
    this.counter = index;
    this.updateSlider();
    this.updateIndicators();
  }

  startSlide() {
    if (!this.slideInterval) {
      this.slideInterval = setInterval(() => this.showNextSlide(), this.intervalTime);
    }
  }

  pauseSlide() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  setupEventListeners() {
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

    let startPosition = 0;
    const positionTouch = (endPosition) => {
      if (endPosition < startPosition) {
        this.showNextSlide();
      } else if (endPosition > startPosition) {
        this.showPrevSlide();
      }
    };

    this.imageContainer.addEventListener("touchstart", (event) => {
      startPosition = event.touches[0].clientX;
    });

    this.imageContainer.addEventListener("touchend", (event) => {
      positionTouch(event.changedTouches[0].clientX);
    });

    this.imageContainer.addEventListener("mousedown", (event) => {
      startPosition = event.clientX;
    });

    this.imageContainer.addEventListener("mouseup", (event) => {
      positionTouch(event.clientX);
    });

    this.imageContainer.addEventListener("mouseover", () => this.pauseSlide());

    this.imageContainer.addEventListener("mouseout", () => this.startSlide());
  }
  }


  const carousel = new Carousel({ numberOfImages: 5, intervalTime: 4000, showIndicators: true });
  carousel.init();