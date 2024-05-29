// chiave per pexels
const pexelsKey ='sVcRVar9HatcKvwo0CH4yJJzs6C3XF3IKGuf7zsWgT4LVlgVsmKMFumE';
let photos = []
let favourites = []
let firstCard = document.getElementsByClassName('myCard')[0].cloneNode(true)

let voidBookmark = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmarks" viewBox="0 0 16 16"><path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v10.566l3.723-2.482a.5.5 0 0 1 .554 0L11 14.566V4a1 1 0 0 0-1-1z"/><path d="M4.268 1H12a1 1 0 0 1 1 1v11.768l.223.148A.5.5 0 0 0 14 13.5V2a2 2 0 0 0-2-2H6a2 2 0 0 0-1.732 1"/></svg>'
let filledBookmark = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bookmarks-fill" viewBox="0 0 16 16"><path d="M2 4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L7 13.101l-4.223 2.815A.5.5 0 0 1 2 15.5z"/><path d="M4.268 1A2 2 0 0 1 6 0h6a2 2 0 0 1 2 2v11.5a.5.5 0 0 1-.777.416L13 13.768V2a1 1 0 0 0-1-1z"/></svg>'

// funzione per ricercare immagini su prompt dell'utente
let search = async function(){
    let qry = document.getElementById('searchField').value.replaceAll(' ', '-')
    document.getElementById('searchField').value = ''
    
    clearPhotos()
    clearPhotosArray()
    await queryPexels(qry)
    showPhotos(photos)
    
}

// funzione per effettuare una query su pexels
let queryPexels = async function(queryText){
    let req = await fetch('https://api.pexels.com/v1/search?query='+queryText, {headers:{"Authorization": pexelsKey}});
    let data = await req.json()
    // console.log(data)
    let photoArray = data.photos

    mapPhotoArray(photoArray)
    // console.log(photos)
}

// funzione per mappare l'array di immagini con le info che uso
let mapPhotoArray = async function(arr){
    arr.map(p => {
        let photo = {
            id: p.id,
            avgColor: p.avg_color,
            photographer: p.photographer,
            img: p.src.medium,
            height: p.height,
            width: p.width
        }
        photos.push(photo)
    })
    return photos
}


// funzione per ricercare un'immagine in base all'id
let queryPexelsById = async function(id){
    let req = await fetch('https://api.pexels.com/v1/photos/'+id, {headers:{"Authorization": pexelsKey}});
    let data = await req.json()
    console.log(data)
    return data
}

// funzione per estrarre le immagini favourites e metterle in un array temporaneo
let getFavourites = async function(){
    let tempPhotos = []
    favourites.forEach(async (id)=>{
        let ph = await queryPexelsById(id)
        tempPhotos.push(ph)
    })
    await console.log(tempPhotos)
    await clearPhotos()
    await mapPhotoArray(tempPhotos)
    await console.log(photos)
}

// funzione per ripulire l'array di foto
let clearPhotosArray = function(){
    photos = []
}

// funzione per pulre le foto dal DOM
let clearPhotos = function(){
    document.getElementById('cardsContainer').innerHTML = ''
    clearPhotosArray()
}

// funzione per creare una card
let createCard = function(p){
    let img = firstCard.querySelectorAll('img')[0]
    img.setAttribute('src',p.img)
    
    let author = firstCard.querySelectorAll('h5')[0]
    author.innerHTML = p.photographer
    
    let favButton = firstCard.querySelectorAll('button')[0]
    favButton.setAttribute('onClick', `toggleFavourite(${p.id}, this)`)
    
    firstCard.classList.remove("d-none")
    
    document.getElementById('cardsContainer').appendChild(firstCard.cloneNode(true))
}

// funzione per ciclare un array di foto
let showPhotos = function(pa){
    pa.forEach(p => {
        createCard(p)
    });
}

// funzione per aggiungere\rimuovere un'immagine ai favourite
let toggleFavourite = function(fav, el){
    if (favourites.includes(fav)) {
        let idx = favourites.indexOf(fav)
        favourites.splice(idx,1)
        el.innerHTML = voidBookmark
    }
    else{
        favourites.push(fav)
        el.innerHTML = filledBookmark
    }
    refreshBookmarked()
    
}

// funzione per aggiornare il contatore dei favoriti
let refreshBookmarked = function(){
    document.getElementById('nrBookmarks').innerHTML = `(${favourites.length})`
}

// fast load photos
onload = async (e) => {
    await queryPexels('mountain-range')
    showPhotos(photos)
}