import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const baseURL = 'https://pixabay.com/api/';
// axios.defaults.headers.common['key'] = '39131974-7ca5284b81c975fe0ad28b146';

console.log('hello');
const elements = {
  form: document.querySelector('#search-form'),
  container: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

elements.form.addEventListener('submit', handlerSearch);
elements.btnLoadMore.addEventListener("click", onLoad);

let currentPage = 1;
let box = new SimpleLightbox('.photo-card a');
elements.btnLoadMore.classList.add("load-more-hidden");

function handlerSearch(evt) {
  evt.preventDefault();
  elements.container.innerHTML = '';
  const input = elements.form.elements.searchQuery.value;
  localStorage.setItem("serchWord", input);
  searchGet(input)
  .then(result => {elements.container.insertAdjacentHTML('beforeend', createMarkUp(result)); box.refresh();
  // if(resp.data.totalHits>resp.data.hits){
  //   // elements.btnLoadMore.classList.("load-more-hidden");
  // }
})
  .catch(err => console.log(err));
}

function onLoad(){
  currentPage += 1;
  let word = localStorage.getItem("serchWord");
  searchGet(word, currentPage)
  .then(result => {elements.container.insertAdjacentHTML('beforeend', createMarkUp(result)); box.refresh();})
  .catch(err => console.log(err));
}



async function searchGet(word, page=1) {
  const params = new URLSearchParams({
    key: '39131974-7ca5284b81c975fe0ad28b146',
    q: word,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  });
  try {
    const resp = await axios.get(`${baseURL}?${params}&page=${page}`);
    console.log(resp.data.total)
    const arrPhoto = resp.data.hits;
    console.log(arrPhoto);
    if (arrPhoto.length) {
      const total = resp.data.total;
      Notify.success(
        `Hooray! We found ${total} images.`
      );
      return arrPhoto;
    } else {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  } catch (err) {
    console.log(err.message);
  }
}

function createMarkUp(arr) {
const markUp = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `<div class="photo-card"><a href="${webformatURL}">
    <img src="${largeImageURL}" alt="${tags}" loading="lazy" />
    <div class="info">
      <p class="info-item">
        <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
        <b>Views: ${views}</b>
      </p>
      <p class="info-item">
        <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
        <b>Downloads: ${downloads}</b>
      </p>
    </div>
  </a></div>`
    )
    .join('');
    return markUp;
}
