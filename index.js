const videoElem = document.querySelector('#camera');
const galleryElement = document.querySelector('#gallery');

  
function createNotification() {
    const notification = new Notification('Notis från Bröllopsfotografen',{
        body: 'Din bild är nu sparad',
        icon: './images/icons/icon-192.png'    
    })
}

function activePage() {
    const takePictureButton = document.querySelector('#camera-stream');
    const canvasButton = document.querySelector('#canvas-capture');
    const photoIconButton = document.querySelector('#camera-page');
    const galleryIconButton = document.querySelector('#gallery-page');
    const cameraSection = document.querySelector('.camera-section');
    const canvasSection = document.querySelector('.canvas-section');
    const gallerySection = document.querySelector('.gallery-section')
    
    takePictureButton.addEventListener('click', () => {
        addImage()
        createNotification()    
        cameraSection.classList.remove('active-page')
        canvasSection.classList.add('active-page')
        gallerySection.classList.remove('active-page')
    })
    canvasButton.addEventListener('click', () => {
        cameraSection.classList.add('active-page')
        canvasSection.classList.remove('active-page')
        gallerySection.classList.remove('active-page')
    })
    galleryIconButton.addEventListener('click', () => {
        cameraSection.classList.remove('active-page')
        canvasSection.classList.remove('active-page')
        gallerySection.classList.add('active-page')
    })
    photoIconButton.addEventListener('click', () => {
        cameraSection.classList.add('active-page')
        canvasSection.classList.remove('active-page')
        gallerySection.classList.remove('active-page')
    })
}

function addImage(){
    const canvas = document.querySelector('#picture');
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoElem, 0, 0, canvas.width, canvas.height);
    const imageData = canvas.toDataURL('images/png'); 

    canvas.addEventListener('click', () => {
        showModal(imageData)
    })

    const images = getImages()
    const imageObject = {
        id: Math.floor(Math.random()*100),
        content: imageData
    }
    const imageElement = createImageElement(imageObject.id, imageObject.content)
    galleryElement.append(imageElement)

    images.push(imageObject)
    saveImages(images)
}

function getImages(){
    return JSON.parse(localStorage.getItem('weddingApp') || '[]')
}

getImages().forEach(img => {
    const imageElement = createImageElement(img.id, img.content)
    galleryElement.append(imageElement)
})

function saveImages(images){
    if (navigator.onLine) {
        updateJSON(images)
    }
    // navigator.onLine &&= updateJSON(images)
    localStorage.setItem('weddingApp', JSON.stringify(images))
}

function createImageElement(id,content){
    const divImageElement = document.createElement('div')
    divImageElement.classList.add('image-container') 
    const deleteElement = document.createElement('span')
    deleteElement.classList.add('delete')
    deleteElement.innerHTML = '<i class="fa-solid fa-trash"></i>Delete'
    const viewElement = document.createElement('span')
    viewElement.classList.add('view')
    viewElement.innerHTML = '<i class="fa-solid fa-eye"></i>View'
    const imageElement = document.createElement('img')
    imageElement.setAttribute('src', content)

    viewElement.addEventListener('click', () => {
        showModal(content)
    })
    deleteElement.addEventListener('click', () => {
        let doDelete = confirm('Vill du verkligen tabort???')
        if (doDelete) {
            deleteImage(id, divImageElement)
        }
        // doDelete &&= deleteImage(id, divImageElement)
    })

    divImageElement.append(viewElement, deleteElement,imageElement)
    return divImageElement
}

function deleteImage(id, element){
    const images = getImages().filter(img => img.id != id)
    saveImages(images)
    galleryElement.removeChild(element)
}

function showModal(src){
    const modalSection = document.querySelector('.modal-section')
    const modalElement = document.querySelector('#modalImage')

    modalSection.classList.add('show')
    modalSection.addEventListener('click', () => {
        modalSection.classList.remove('show')
    })
    modalElement.setAttribute('src', src)
}


const scrollToTop = () => {
  window.scrollTo({top: 0})
}

async function updateJSON(images) {
    const API_KEY = '$2b$10$DQubYfZjjvlr5mrNtjgAi.1fvre2YIsgU9hz.IXFE609scCmZII4C'
    const URL_BIN = 'https://api.jsonbin.io/b/62931f0405f31f68b3ac7ff2'

    const res = await fetch(URL_BIN, { 
        method: 'PUT',
        body: JSON.stringify(images), 
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': API_KEY
        }
    })
    const data = await res.json()
}

window.addEventListener('load', async () => {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('service-worker.js')
        } catch (error) {
            console.error('Something is wrong!', error);
        }
    }
    if ('mediaDevices' in navigator) {
        try {
            let stream = await navigator.mediaDevices.getUserMedia({video: true, autio: false})
            videoElem.srcObject = stream
        } catch (error) {
            alert('Vänligen tillåt kamera i dina inställningar!')
        }
    }
    if (Notification.permission === 'denied') {
        alert('Vänligen tillåt notifikation i dina inställningar!')
    } else if (Notification.permission !== 'granted') {
        Notification.requestPermission()
    }
    if (navigator.onLine) {
        let localStorageImages = JSON.parse(localStorage.getItem('weddingApp') || '[]')
        if (!localStorage.length == 0) {
            updateJSON(localStorageImages)
        }
        // localStorage.length ??= updateJSON(localStorageImages)
    }
    activePage()
})