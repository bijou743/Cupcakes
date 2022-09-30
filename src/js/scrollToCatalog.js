const scrollToCatalog = () => {
  const toCatalogBtn = document.querySelector('.offer .btn');
  const catalog = document.querySelector('.catalog-wrapper');

  toCatalogBtn.addEventListener('click', () => {
    catalog.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  });
};

scrollToCatalog();
