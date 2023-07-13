import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getRefs } from './refs';
import { getapi, options } from './getAPI';

const ref = getRefs();
let valueOfInput = '';
let currentPage = 1;
const onFormSubmit = async evt => {
  evt.preventDefault();
  valueOfInput = evt.target.elements.searchQuery.value;
  // console.dir(valueOfInput);
  const { totalHits, hits } = await getapi(valueOfInput, currentPage);
  console.log(hits);
  ref.gallery.innerHTML = createMarkup(hits);
  const lightbox = new SimpleLightbox('.gallery a', {});
};

const onLoadClick = async () => {
  currentPage += 1;
  const { totalHits, hits } = await getapi(valueOfInput, currentPage);
  const totalPages = Math.ceil(totalHits / 40);
  ref.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
  const lightbox = new SimpleLightbox('.gallery a', {});
};

ref.formEl.addEventListener('submit', onFormSubmit);
ref.loadMoreBtn.addEventListener('click', onLoadClick);

const createMarkup = param => {
  const mappedHits = param
    .map(obj => {
      const result = `<div class="photo-card">
      <a href="${obj.largeImageURL}">
        <img src="${obj.webformatURL}" alt="" loading="lazy" />
      </a>
      <div class="info">
        <p class="info-item">
          <b>Likes ${obj.likes}</b>
        </p>
        <p class="info-item">
          <b>Views ${obj.views}</b>
        </p>
        <p class="info-item">
          <b>Comments ${obj.comments}</b>
        </p>
        <p class="info-item">
          <b>Downloads ${obj.downloads}</b>
        </p>
      </div>
    </div>;`;
      return result;
    })
    .join('');
  return mappedHits;
  // ref.gallery.insertAdjacentHTML('afterbegin', mappedHits);
};
