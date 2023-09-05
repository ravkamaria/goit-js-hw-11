import axios from 'axios';
const baseURL = 'https://pixabay.com/api/';

function getImages(inputWord, page = 1) {
  const params = new URLSearchParams({
    key: '39131974-7ca5284b81c975fe0ad28b146',
    q: inputWord,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: 40,
  });
  const resp = axios.get(`${baseURL}?${params}&page=${page}`);
  return resp;
}

export { getImages };
