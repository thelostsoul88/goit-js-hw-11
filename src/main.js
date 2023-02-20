import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import searchImg from './api';
import LoadMoreBtn from './loadMoreBtn';
import Notiflix, { Notify } from 'notiflix';

const form = document.getElementById('form');
const gallery = document.querySelector('.gallery');
const lightbox = new SimpleLightbox('.gallery a');

const API = new searchImg();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

form.addEventListener('submit', onSearch);
loadMoreBtn.button.addEventListener('click', fetchImg);

let totalPages = null;

function onSearch(e) {
  e.preventDefault();
  const form = e.currentTarget;
  const value = form.elements.search.value.trim();
  if (value.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
  API.searchQuery = value;
  API.resetPage();
  clearImgCollection();
  loadMoreBtn.show();
  fetchImg().finally(() => form.reset());
}

async function fetchImg() {
  loadMoreBtn.disable();
  try {
    const images = await API.getImg();

    totalPages = Math.ceil(API.totalHits / API.perPage);

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      clearImgCollection();
      loadMoreBtn.hide();
      return;
    }

    if (API.page > totalPages) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      loadMoreBtn.hide;
    }

    if (API.page === 2) {
      Notify.success(`Hooray! We found ${API.totalHits} images.`);
    }

    if (API.page > 2) scrollCollection();

    const markup = images.reduce(
      (markup, img) => createMarkup(img) + markup,
      ''
    );
    appendImgToList(markup);
    lightbox.refresh();
    loadMoreBtn.enable();
  } catch (err) {
    Notify.failure('Error');
    console.error(err.massege);
  }
}

function appendImgToList(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
  loadMoreBtn.enable();
}

function clearImgCollection() {
  gallery.innerHTML = '';
}

function createMarkup({
  largeImageURL,
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <div class="wrap-photo">
    <a href="${largeImageURL}">
    <img src="${webformatURL}" alt="${tags}" loading="lazy" width="640"
  /></a>
  </div>
  <div class="info">
    <p class="info-item"><b>Likes</b>${likes}</p>
    <p class="info-item"><b>Views</b>${views}</p>
    <p class="info-item"><b>Comments</b>${comments}</p>
    <p class="info-item"><b>Downloads</b>${downloads}</p>
  </div>
</div>`;
}

function scrollCollection() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
