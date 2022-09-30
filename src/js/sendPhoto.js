const sendPhoto = () => {
  const photoFormBtn = document.querySelector('.photo-form .btn');
  const photoFormFile = document.querySelector('.photo-form [type=file]');
  photoFormBtn.addEventListener('click', () => {
    photoFormFile.click();
  });
};

sendPhoto();
