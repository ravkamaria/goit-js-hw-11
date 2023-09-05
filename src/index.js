import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { createMarkUp } from './createMarkup';
import { getImages } from './getImages';

const elements = {
  form: document.querySelector('#search-form'),
  container: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

let currentPage = 1;
let inputWord = '';
let pages;
let box = new SimpleLightbox('.photo-card a');

elements.form.addEventListener('submit', handlerSearch);
elements.btnLoadMore.addEventListener('click', onLoad);
elements.btnLoadMore.classList.add('load-more-hidden');

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
      pages = total / arrPhoto.length;
      if (pages < arrPhoto.length) {
        elements.btnLoadMore.classList.replace('load-more-hidden', 'load-more');
      }
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (err) {
    Notify.failure('Sorry... Please try again.');
  }
}

async function onLoad() {
  currentPage += 1;
  try {
    const result = await getImages(inputWord, currentPage);
    elements.container.insertAdjacentHTML(
      'beforeend',
      createMarkUp(result.data.hits)
    );
    box.refresh();
    if (pages < currentPage) {
      console.log(currentPage);
      elements.btnLoadMore.classList.replace('load-more', 'load-more-hidden');
    }
  } catch (err) {
    Notify.failure('Sorry... Please try again.');
  }
}
