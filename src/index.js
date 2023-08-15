
const BASE_URL = "https://pixabay.com/api/";
const API_KEY = "38852093-4351b0a7d2f3586ea84705b87";
const IMAGE_TYPE = "photo";
const ORIENTATION_OF_PHOTO = "horizontal";
const SAFESEARCH = "true";
const  PER_PAGE = 40;

refs = {
    searchForm :document.querySelector('.search-form'),
    gallery: document.querySelector(".gallery"),
    btn : document.querySelector(".load-more"),
}
console.log(refs.gallery);
console.log(refs.btn)
console.log(refs.searchForm)

refs.searchForm.addEventListener('submit', onSearchForm)
refs.btn.addEventListener("click", onLoadMore);

let form = '';
let page = 1;
function onSearchForm(e) {
    e.preventDefault();
    refs.gallery.innerHTML = '';
    form = e.currentTarget.elements.searchQuery.value;
    page = 1;
    console.log(form)
    refs.btn.hidden = false;
    return fetch(`${BASE_URL}?key=${API_KEY}&q=${form}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION_OF_PHOTO}&safesearch=${SAFESEARCH}&per_page=${PER_PAGE}&page=${page}`)
        .then((resp) => {
        if (!resp.ok) {
            throw new Error (resp.statusText)
            }
            
      return resp.json();
        }).then(data => {
          createMarkup(data.hits)
    }).catch(error => {
       console.log(error)
    });
   
}

function onLoadMore() {
    page += 1;
    return fetch(`${BASE_URL}?key=${API_KEY}&q=${form}&image_type=${IMAGE_TYPE}&orientation=${ORIENTATION_OF_PHOTO}&safesearch=${SAFESEARCH}&per_page=${PER_PAGE}page=${page}`)
        .then((resp) => {
        if (!resp.ok) {
            throw new Error (resp.statusText)
        }
      return resp.json();
    }).then(data => {
        createMarkup(data.hits)
        console.log(data);
    }).catch(error => {
       console.log(error)
     });
}

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
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views ${views}</b>
    </p>
    <p class="info-item">
      <b>Сomments ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads ${downloads}</b>
    </p>
  </div>
</div>`
        
    ).join("")
    refs.gallery.insertAdjacentHTML('beforeend', card);
    
}