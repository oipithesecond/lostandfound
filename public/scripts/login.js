// console.clear();

// const loginBtn = document.getElementById('login');
// const signupBtn = document.getElementById('signup');

// loginBtn.addEventListener('click', (e) => {
// 	let parent = e.target.parentNode.parentNode;
// 	Array.from(e.target.parentNode.parentNode.classList).find((element) => {
// 		if(element !== "slide-up") {
// 			parent.classList.add('slide-up')
// 		}else{
// 			signupBtn.parentNode.classList.add('slide-up')
// 			parent.classList.remove('slide-up')
// 		}
// 	});
// });

// signupBtn.addEventListener('click', (e) => {
// 	let parent = e.target.parentNode;
// 	Array.from(e.target.parentNode.classList).find((element) => {
// 		if(element !== "slide-up") {
// 			parent.classList.add('slide-up')
// 		}else{
// 			loginBtn.parentNode.parentNode.classList.add('slide-up')
// 			parent.classList.remove('slide-up')
// 		}
// 	});
// });

// document.querySelector('.signup form').addEventListener('submit', function(e) {
// 	const nameInput = document.querySelector('.signup form input[name="name"]');
//     const name = nameInput.value;
//     const namePattern = /^[a-zA-Z\s]{3,}$/;

//     if (!namePattern.test(name)) {
//         e.preventDefault(); 
//         alert("Name can only contain letters and spaces and it should be of minimum three letters.");
//     }
//     const emailInput = document.querySelector('.signup form input[name="email"]');
//     const email = emailInput.value;
//     const emailPattern = /^[a-zA-Z0-9._%+-]+@vitapstudent\.ac\.in$/;

//     if (!emailPattern.test(email)) {
//         e.preventDefault();  
//         alert("Please enter a valid VIT-AP student email address.");
//     }
// 	const passwordInput = document.querySelector('.signup form input[name="password"]');
//     const password = passwordInput.value;
//     const passwordPattern = /^\S{5,}$/; 

//     if (!passwordPattern.test(password)) {
//         e.preventDefault();  
//         alert("Password must be at least 5 characters long and cannot contain spaces.");
//     }
// });

// JavaScript to hide the loading overlay when the image is fully loaded
window.addEventListener('load', function () {
    const loghinBackground = document.querySelector('.loghin');
    const loadingOverlay = document.querySelector('.loading-overlay');

    const img = new Image();
    img.src = "https://picsum.photos/600/800?grayscale";

    const timeoutId = setTimeout(() => {
        loadingOverlay.classList.add('hidden');
    }, 5000); // Hide after 5 seconds as a fallback

    img.onload = function () {
        loghinBackground.style.backgroundImage = `url(${img.src})`;
        loadingOverlay.classList.add('hidden');
    };
    img.onerror = function () {
        // If there's an error loading the image, hide the overlay anyway
        loadingOverlay.classList.add('hidden');
    };
});