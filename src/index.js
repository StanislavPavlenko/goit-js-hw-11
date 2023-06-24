import { Notify } from 'notiflix/build/notiflix-notify-aio';
import throttle from 'lodash.throttle';
import NewServer from './js/pixa-api';
const newServer = new NewServer();

const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const textResult = document.querySelector('.text');
const searchForm = document.querySelector('.search-form');
searchForm.addEventListener('submit', 'onFormSubmit');

function onFormSubmit(e) {
    e.preventDefault();
    showLoader()
    clearContainer();
    textResult.style.display = 'none';
    newServer.query = e.currentTarget.elemets.searchQuery.value;
    newServer.resetPage();
    setTimeout(() => {
        newServer
            .fetchSearch()
            .then(request => {
                hidenLoader();
                if (newServer.query === '') {
                    return;
                } else if (request.hits.length === 0) {
                    return Notify.failure(
                        'Sorry, there are no images matching your search query. Please try again.'
                    );
                }
                Notify.success(`Hooray! We found ${request.totalHits} images.`);
                renderResult(request.hits), lightbox.refresh();
            })
            .catch(err => {
                hidenLoader()
                console.log(err);
                Notify.failure(
                    'Sorry, there are no images matching your search query. Please try again.'
                );
            });
    }, 500);
}

function renderResult(arry) {
  const markup = arry
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
        <a href="${largeImageURL}"><img width="100%" height= "200" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
        <div class="info">
            <p class="info-item">
              <b>Likes</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views</b>
            ${views}
            </p>
            <p class="info-item">
              <b>Comments</b>
            ${comments}
            </p>
            <p class="info-item">
              <b>Downloads</b>
            ${downloads}
            </p>
        </div>
    </div>`
    )
    .join('');
  return gallery.insertAdjacentHTML('beforeend', markup);
}

function clearContainer() {
  gallery.innerHTML = '';
}

window.addEventListener('scroll', throttle(handleScroll, 500));

function handleScroll() {
  showLoader();
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    if (newServer.query === '') {
      return;
    }
    if (newServer.numberPage > newServer.totalPages()) {
      textFinish.style.display = 'block';
      hidenLoader() 
      return;
    }
    setTimeout(() => {
      newServer
        .fetchSearch()
        .then(request => {
          renderResult(request.hits), lightbox.refresh();
          const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();

          window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
          });
          hidenLoader();
        })
        .catch(err => {
          hidenLoader()
          console.log(err);
          Notify.failure(`An error occurred during the search.`);
        });
    }, 500);
  }
}

function showLoader() {
  loader.style.display = 'block';
}

function hidenLoader() {
  loader.style.display = 'none';
}