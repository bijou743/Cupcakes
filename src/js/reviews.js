const reviews = () => {
  const toLeftBtn = document.querySelector('.reviews-buttons .left');
  const toRightBtn = document.querySelector('.reviews-buttons .right');
  const reviewList = document.querySelectorAll('.review');
  const reviewListSize = reviewList.length;
  const reviewsBlock = document.querySelector('.reviews');

  let activeItem = 1;

  toRightBtn.addEventListener('click', () => {
    if (activeItem === reviewListSize - 1) {
      return;
    }
    activeItem++;
    changeReviewSlide();
  });

  toLeftBtn.addEventListener('click', () => {
    if (activeItem === 0) {
      return;
    }
    activeItem--;
    changeReviewSlide();
  });

  function changeReviewSlide() {
    const activeReview = reviewsBlock.querySelector('.review.active');
    activeReview.classList.remove('active');
    reviewList[activeItem].classList.add('active');
    reviewsBlock.style.transform = `translateX(${-reviewList[activeItem]
      .offsetLeft}px)`;
  }
};

reviews();
