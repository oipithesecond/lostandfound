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


const sendEmailButton = document.getElementById('sendEmailButton');
const emailBody = sendEmailButton.dataset.emailBody;
const userEmail = sendEmailButton.dataset.userEmail;


sendEmailButton.addEventListener('click', () => {
  const subject = "Foundit!"
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    const mailUrl = `mailto:${userEmail}?subject=${encodeURIComponent(subject)}?body=${encodeURIComponent(emailBody)}`;  
    window.location.href = mailUrl
  }else{
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${userEmail}&su=${subject}&body=${encodeURIComponent(emailBody)}`;
  window.open(gmailUrl, '_blank');
}
})