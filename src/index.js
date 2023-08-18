import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

let lightbox = new SimpleLightbox('.photo-card a',  {
  
      captionDelay: 250,
      close:false,
    });
   

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "38852093-4351b0a7d2f3586ea84705b87";
const IMAGE_TYPE = "photo";
const ORIENTATION_OF_PHOTO = "horizontal";
const SAFESEARCH = "true";
const  PER_PAGE = 40;
let form = '';
let page = 1;
let sumHits = 0;

refs = {
  searchForm: document.querySelector('.search-form'),
  input:document.querySelector('.input'),
  submitBtn:document.querySelector('search'),
  gallery: document.querySelector(".gallery"),
  btn : document.querySelector(".load-more"),
}
console.log(refs.gallery);
console.log(refs.btn)
console.log(refs.searchForm)
console.log(refs.submitBtn)
console.log(refs.input)

const options = {
  root: null,
  rootMargin: "300px",
 
};

const observer = new IntersectionObserver(callback, options);
const guard = document.querySelector('.js-guard');

async function searchByBreed() {
  const resp = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${form}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION_OF_PHOTO}&safesearch=${SAFESEARCH}&per_page=${PER_PAGE}&page=${page}`).then(resp=>resp.data)

 return await resp

}

refs.searchForm.addEventListener('submit', onSearchForm)

async function onSearchForm(e) {
  e.preventDefault();
  
  refs.gallery.innerHTML = '';
  form = e.currentTarget.elements.searchQuery.value.trim();
  page = 1;
if (form === '') {
    return
  }

  try {
    const data = await searchByBreed()

   if (data.hits.length === Number(0)) {
    return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  } else {
     createMarkup(data.hits);
     Notify.success(`Hooray! We found ${data.totalHits} images.`)
     observer.observe(guard);
     return lightbox.refresh();
 }
  } catch (err) {
    console.log(err)
}  
}

function callback(entries) {
  entries.forEach(async (entry) => {
    if (entry.isIntersecting) {
      page += 1;
   
      try {
       const data = await searchByBreed(page)
        createMarkup(data.hits)
        sumHits += (data.hits.length)
        const totalHits = data.totalHits-sumHits
   
      if (totalHits===20) {
        observer.unobserve(guard);
         Notify.info("We're sorry, but you've reached the end of search results.")
        }
      } catch (err) {
        console.log( console.log(err))
      }
   }
  });
}


// refs.btn.addEventListener("click", onLoadMore);
// function onLoadMore() {
 
//   page += 1;
//    refs.btn.classList.add('is-hidden-btn');
//     fetchByBreed(page).then(data => {
//       createMarkup(data.hits)

//       refs.btn.classList.remove('is-hidden-btn');
      
//       if (data.hits.pageURL===500) {
//         refs.btn.classList.add('is-hidden-btn');
//         return Notify.info("We're sorry, but you've reached the end of search results.")
//         }
//     }).catch(error => {
//        console.log(error)
//      });
// }





// function serviseCharacter() {
//     return fetch(`${BASE_URL}?key=${API_KEY}&q=cat&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION_OF_PHOTO}&safesearch=${SAFESEARCH}`)
//         .then((resp) => {
//         if (!resp.ok) {
//             throw new Error (resp.statusText)
//         }
//       return resp.json();
//     })
// }



// onSearchForm().then((data) => {
//     console.log(data)
//     refs.gallery.innerHTML = createMarkup(data.hits);
// })




function createMarkup(array) {
   const card = array.map(({ webformatURL, tags, likes, views, comments, downloads, largeImageURL}) => 
    `<div class="photo-card">
     <a class="gallery_link" href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy"   /></a>
 
  <div class="info">
    <p class="info-item">
      <b>Likes</b>${likes}
    </p>
    <p class="info-item">
      <b>Views</b>${views}
    </p>
    <p class="info-item">
      <b>Сomments</b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>${downloads}
    </p>
  </div>
</div>`
        
    ).join("")
    refs.gallery.insertAdjacentHTML('beforeend', card);
    
}