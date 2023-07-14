import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { getRefs } from './refs';
import { getapi, options } from './getAPI';

const ref = getRefs();
let valueOfInput = '';
let currentPage = 1;
let lightbox = null
const onFormSubmit = async evt => {
  evt.preventDefault();
  valueOfInput = evt.target.elements.searchQuery.value;
  // console.dir(valueOfInput);
  currentPage = 1
  if (valueOfInput.trim()==='') {
    ref.loadMoreBtn.classList.add('visually-hidden')
    return
  }
  const { totalHits, hits } = await getapi(valueOfInput, currentPage);
  if (hits.length === 0) {
    Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    ref.loadMoreBtn.classList.add('visually-hidden')
    ref.gallery.innerHTML = '';
    return;
}
 createMarkup(hits)
  ref.gallery.innerHTML = createMarkup(hits);
  lightbox = new SimpleLightbox('.gallery a', {});
  lightbox.refresh();
  ref.loadMoreBtn.classList.remove('visually-hidden')
};


const onLoadClick = async () => {
  currentPage += 1;
  const { totalHits, hits } = await getapi(valueOfInput, currentPage);
  const totalPages = Math.ceil(totalHits / 40);
  ref.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
  lightbox = new SimpleLightbox('.gallery a', {});
  if (currentPage >= totalPages) {
    ref.loadMoreBtn.classList.add('visually-hidden');
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
} else {
    ref.loadMoreBtn.classList.remove('visually-hidden')
}

  lightbox.refresh();
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
