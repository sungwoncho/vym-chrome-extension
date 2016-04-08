class SlideEngine {
  constructor(slideDeck) {
    this.slideDeck = slideDeck;
    this.slideCount = slideDeck.slides.length;
    this.currentSlideNumber = 1;
  }

  moveNext() {
    this.currentSlideNumber++;
  }

  movePrev() {
    this.currentSlideNumber--;
  }

  hasNext() {
    return this.slidesCount > this.currentSlideNumber;
  }

  hasPrev() {
    return this.currentSlideNumber > 1;
  }
};

export default SlideEngine;
