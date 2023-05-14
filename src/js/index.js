import '../style.css';
import Notiflix from 'notiflix';
import { fetchImage } from './imageFetch';
import { createMarkup } from './createImages';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const axios = require('axios').default;

const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const galleryWrapper = document.querySelector('.gallery');
const loadMoreButton = document.querySelector('.btn-load');
const refs = { searchForm, searchInput, galleryWrapper, loadMoreButton };
let currentPage = 1;

searchForm.addEventListener('submit', handleSearchFormSubmit);
loadMoreButton.addEventListener('click', handleLoadMoreButtonClick);

const lightbox = new SimpleLightbox('.gallery a', { captionDelay: 250 });

async function handleSearchFormSubmit(event) {
  event.preventDefault();
  galleryWrapper.innerHTML = '';
  currentPage = 1;
  const searchQuery = searchInput.value.trim();
  if (!searchQuery) {
    loadMoreButton.hidden = true;
    return;
  }
  await performSearch(searchQuery);
}

async function performSearch(query) {
  try {
    const response = await fetchImage(query);
    const hits = response.data.hits;
    const totalHits = response.data.total;
    if (hits.length === 0) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreButton.hidden = true;
      return;
    }
    if (totalHits > 0) {
      Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
    }
    createMarkup(hits, galleryWrapper);
    lightbox.refresh();
    loadMoreButton.hidden = false;
    if (hits.length < 20) {
      loadMoreButton.hidden = true;
    }
  } catch (error) {
    console.log(error);
  }
}

loadMoreButton.hidden = true;

async function handleLoadMoreButtonClick() {
  const searchQuery = searchInput.value;
  let limitAdd;
  currentPage += 1;
  try {
    const response = await fetchImage(searchQuery, currentPage, limitAdd);
    createMarkup(response.data.hits, galleryWrapper);
    onPageScrolling();
    lightbox.refresh();
    if (response.data.hits.length < limitAdd) {
      loadMoreButton.hidden = true;
    }
  } catch (error) {
    console.log(error);
  }
}

function onPageScrolling() {
  const { height: cardHeight } =
    galleryWrapper.firstElementChild.getBoundingClientRect();
  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
