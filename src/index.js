import { Notify } from 'notiflix/build/notiflix-notify-aio';

const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "38852093-4351b0a7d2f3586ea84705b87";
const IMAGE_TYPE = "photo";
const ORIENTATION_OF_PHOTO = "horizontal";
const SAFESEARCH = "true";
const  PER_PAGE = 40;

refs = {
  searchForm: document.querySelector('.search-form'),
  submitBtn:document.querySelector('.search-form button'),
  gallery: document.querySelector(".gallery"),
  btn : document.querySelector(".load-more"),
}
console.log(refs.gallery);
console.log(refs.btn)
console.log(refs.searchForm)
console.log(refs.submitBtn)
// refs.submitBtn.setAttribute('disabled', "");
 

const options = {
  root: null,
  rootMargin: "300px",
 
};

const observer = new IntersectionObserver(callback, options);
const guard = document.querySelector('.js-guard');
console.log(guard)
let form = '';
let page = 1;

async function fetchByBreed() {
  const resp = await fetch (`${BASE_URL}?key=${API_KEY}&q=${form}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION_OF_PHOTO}&safesearch=${SAFESEARCH}&per_page=${PER_PAGE}&page=${page}`)
   if (!resp.ok) {
 throw new Error (resp.statusText)
  }
  
 return await resp.json()
//    .then((resp) => {
//   if (!resp.ok) {
//  throw new Error (resp.statusText)
//  }
// return resp.json();
// })
}

refs.searchForm.addEventListener('submit', onSearchForm)
// refs.btn.addEventListener("click", onLoadMore);

function onSearchForm(e) {
  e.preventDefault();
  
  refs.gallery.innerHTML = '';
  form = e.currentTarget.elements.searchQuery.value;
  page = 1;

  fetchByBreed().then(data => {
    
    if (data.hits.length === Number(0)) {
    return Notify.failure("Sorry, there are no images matching your search query. Please try again.");
  } else {
      createMarkup(data.hits);
      // refs.submitBtn.removeAttribute('disabled', "");
      console.log(data);
       observer.observe(guard);
      // refs.btn.classList.remove('is-hidden-btn');
      
    
 }
    }).catch(error => {
       console.log(error)
    });
   
}


function callback(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
     page += 1;
    fetchByBreed(page).then(data => {
      createMarkup(data.hits)
      if (data.hits.pageURL===500) {
        observer.unobserve(guard);
        return Notify.info("We're sorry, but you've reached the end of search results.")
        }
    })
   }
    
  });
}

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
   const card = array.map(({ webformatURL, tags, likes, views, comments, downloads, }) => 
    `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy"   />
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