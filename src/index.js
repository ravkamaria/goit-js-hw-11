import axios from "axios";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const baseURL = "https://pixabay.com/api/";
// axios.defaults.headers.common['key'] = '39131974-7ca5284b81c975fe0ad28b146';

console.log("hello")
const elements = {
    form: document.querySelector("#search-form"),
    container: document.querySelector(".gallery"),
    btnLoadMore: document.querySelector(".load-more")
}
// let gallery = new SimpleLightbox(elements.container);
// let lightbox = new SimpleLightbox('.photo-card', { /* options */ });



elements.form.addEventListener("submit", handlerSearch);

function handlerSearch(evt){
    evt.preventDefault();
    const input = elements.form.elements.searchQuery.value;
    searchGet(input);
}

let box = new SimpleLightbox('.photo-card a');

function searchGet(word){
    elements.container.innerHTML = "";   

    const params = new URLSearchParams({
        key: '39131974-7ca5284b81c975fe0ad28b146',
        q: word,
        image_type: "photo",
        orientation: "horizontal",
        safesearch: true
});
    axios.get(`${baseURL}?${params}`)
    .then(resp => {
        const arrPhoto = resp.data.hits;
        console.log(arrPhoto);
        if(arrPhoto.length){
            createMarkUp(arrPhoto);
        }else{
            Notify.failure("Sorry, there are no images matching your search query. Please try again."); //Не відображається
            console.log("problem")
        }
    })
    .catch(err => {
        console.log(err)
    });
}



function createMarkUp(arr){
    const markUp = arr.map(({webformatURL, largeImageURL, tags, likes, views, comments, downloads}) => `<div class="photo-card"><a href="${webformatURL}">
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
  </a></div>`).join("");
   elements.container.insertAdjacentHTML("beforeend", markUp);
  box.refresh();
}
