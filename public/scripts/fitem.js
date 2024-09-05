const imagesContainer = document.querySelector('.images');
const images = imagesContainer.querySelectorAll('.item-image');
const leftButton = document.querySelector('.left-button');
const rightButton = document.querySelector('.right-button');

let currentImageIndex = 0;

function updateSlider() {
    images.forEach((image, index) => {
        if (index === currentImageIndex) {
            image.style.display = 'block';
        } else {
            image.style.display = 'none';
        }
    });
}

function moveLeft() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    updateSlider();
}

function moveRight() {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    updateSlider();
}

const isMobile = window.innerWidth <= 768;

if (isMobile) {
    leftButton.style.display = 'block';
    rightButton.style.display = 'block';

    leftButton.addEventListener('click', moveLeft);
    rightButton.addEventListener('click', moveRight);

    window.addEventListener('load', () => {
        updateSlider();
    });
} else {
    leftButton.style.display = 'none';
    rightButton.style.display = 'none';
}

document.querySelectorAll('.images img').forEach(image => {
  image.onclick = () => {
    const popupImages = document.querySelector('.popup-images');
    const popupImage = popupImages.querySelector('img');

    popupImage.src = image.getAttribute('src');
    popupImages.style.display = 'flex';
  };
});

document.querySelector('#exit-button').onclick = () => {
  document.querySelector('.popup-images').style.display = 'none';
};