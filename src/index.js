import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkUp } from './createMarkup';
import { getImages } from './getImages';

const elements = {
  form: document.querySelector('#search-form'),
  container: document.querySelector('.gallery'),
  // btnLoadMore: document.querySelector('.load-more'),
  target: document.querySelector('.guard'),
};

let options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
let observer = new IntersectionObserver(onLoadScroll, options);

let currentPage = 1;
let inputWord = '';
let pages;
let box = new SimpleLightbox('.photo-card a');

elements.form.addEventListener('submit', handlerSearch);
// elements.btnLoadMore.addEventListener('click', onLoad);
// elements.btnLoadMore.classList.add('load-more-hidden');

async function handlerSearch(evt) {
  evt.preventDefault();
  elements.container.innerHTML = '';
  inputWord = elements.form.elements.searchQuery.value;
  if (inputWord === '') {
    return;
  }
  try {
    const dataSearch = await getImages(inputWord);
    const arrPhoto = dataSearch.data.hits;
    if (arrPhoto.length) {
      const total = dataSearch.data.totalHits;
      Notify.success(`Hooray! We found ${total} images.`);
      elements.container.insertAdjacentHTML(
        'beforeend',
        createMarkUp(arrPhoto)
      );
      box.refresh();
      const { height: cardHeight } =
        elements.container.firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
      observer.observe(elements.target);
      pages = total / 40;
      if (total < 40) {
        // elements.btnLoadMore.classList.replace('load-more', 'load-more-hidden');
        observer.unobserve(elements.target);
      } else {
        // elements.btnLoadMore.classList.replace('load-more-hidden', 'load-more');
        observer.observe(elements.target);
      }
    } else {
      // elements.btnLoadMore.classList.replace('load-more', 'load-more-hidden');
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (err) {
    Notify.failure('Sorry... Please try again.');
  }
}

// async function onLoad() {
//   currentPage += 1;
//   try {
//     const result = await getImages(inputWord, currentPage);
//     elements.container.insertAdjacentHTML(
//       'beforeend',
//       createMarkUp(result.data.hits)
//     );
//     box.refresh();
//     if (pages < currentPage) {
//       elements.btnLoadMore.classList.replace('load-more', 'load-more-hidden');
//       Notify.failure("We're sorry, but you've reached the end of search results.");
//     }
//   } catch (err) {
//     Notify.failure('Sorry... Please try again.');
//   }
// }

function onLoadScroll(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      getImages(inputWord, currentPage)
        .then(result => {
          elements.container.insertAdjacentHTML(
            'beforeend',
            createMarkUp(result.data.hits)
          );
          box.refresh();
          const { height: cardHeight } =
            elements.container.firstElementChild.getBoundingClientRect();
          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
          observer.observe(elements.target);
          if (pages < currentPage) {
            // elements.btnLoadMore.classList.replace('load-more', 'load-more-hidden');
            observer.unobserve(elements.target);
            Notify.failure(
              "We're sorry, but you've reached the end of search results."
            );
          }
        })
        .catch(err => {
          Notify.failure('Sorry... Please try again.');
        });
    }
  });
}
