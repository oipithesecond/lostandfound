document.addEventListener('DOMContentLoaded', function () {
    const buildingSelect = document.getElementById('building');
    const specificAreaSection = document.getElementById('specific-area-section');
    const specificAreaSelect = document.getElementById('specific-area');
    const submitButton = document.getElementById('submit-button');
    const titleInput = document.getElementById('title');
    const itemTypeSelect = document.getElementById('item-type');
    const imageUploadInput = document.getElementById('image-upload');
    const imagePreview = document.getElementById('image-preview');
    const notification = document.getElementById('notification');
    const descriptionTextarea = document.getElementById('description');
    const haal = document.querySelector('input[name="haal"]').value;
    const MAX_WIDTH = 520;
    const MAX_HEIGHT = 560;
    const MIME_TYPE = "image/jpeg";
    const QUALITY = 0.9;

    function showNotification(message) {
        notification.innerText = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Function to compress image
    function compressImage(file) {
        return new Promise((resolve, reject) => {
            const blobURL = URL.createObjectURL(file);
            const img = new Image();
            img.src = blobURL;

            img.onerror = function () {
                URL.revokeObjectURL(this.src);
                reject("Cannot load image");
            };

            img.onload = function () {
                URL.revokeObjectURL(this.src);
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext("2d");

                const [newWidth, newHeight] = calculateSize(img, MAX_WIDTH, MAX_HEIGHT);
                canvas.width = newWidth;
                canvas.height = newHeight;
                ctx.drawImage(img, 0, 0, newWidth, newHeight);

                canvas.toBlob(
                    (blob) => {
                        resolve(new File([blob], file.name, { type: MIME_TYPE })); // Resolve with File object
                    },
                    MIME_TYPE,
                    QUALITY
                );
            };
        });
    }

    function calculateSize(img, maxWidth, maxHeight) {
        let width = img.width;
        let height = img.height;

        if (width > height) {
            if (width > maxWidth) {
                height = Math.round((height *= maxWidth / width));
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round((width *= maxHeight / height));
                height = maxHeight;
            }
        }
        return [width, height];
    }

    // Function to handle image upload
    function handleImageUpload(file) {
        const fileInfo = document.createElement('div');
        fileInfo.innerText = `Uploading ${file.name}...`;
        imagePreview.appendChild(fileInfo);

        compressImage(file).then(compressedFile => {
            fileInfo.innerHTML = `<a href="${URL.createObjectURL(compressedFile)}" target="_blank">${file.name}</a>`;
        }).catch(error => {
            console.error(error);
            fileInfo.innerText = `Failed to upload ${file.name}`;
        });
    }

    function showLoadingOverlay() {
        const loadingOverlay = document.getElementById('loading-overlay');
        const loadingSpinner = document.getElementById('loading-spinner');
        if (!loadingOverlay || !loadingSpinner) {
            console.error("Loading overlay or spinner not found in the DOM.");
            return; // Exit the function if elements are not found
        }
        loadingOverlay.style.display = 'flex';
        loadingSpinner.textContent = 'Uploading...';

        setTimeout(() => {
            loadingSpinner.textContent = 'Hang tight, we’re still working on it...';
        }, 20000); // 20 seconds

        setTimeout(() => {
            loadingSpinner.textContent = 'It\'s taking longer than usual, but don\'t worry, we\'ve got you covered.';
        }, 90000); // 90 seconds
    }

    // Event listener for submit button
    submitButton.addEventListener('click', async function (e) {
        e.preventDefault();
        submitButton.disabled = true;
        let missingDetails = [];

        if (!titleInput.value.trim()) {
            missingDetails.push('Title');
        }
        if (!itemTypeSelect.value) {
            missingDetails.push('Type of Found Item');
        }
        if (!buildingSelect.value) {
            missingDetails.push('Building');
        }
        if (specificAreaSection.style.display !== 'none' && !specificAreaSelect.value) {
            missingDetails.push('Specific Area');
        }
        if (!imageUploadInput.files.length) {
            missingDetails.push('Image');
        }

        if (missingDetails.length) {
            showNotification(`Please fill out the following fields: ${missingDetails.join(', ')}`);
            submitButton.disabled = false;
        } else {
            const formData = new FormData();
            formData.append('title', titleInput.value);
            formData.append('description', descriptionTextarea.value);
            formData.append('itemType', itemTypeSelect.value);
            formData.append('building', buildingSelect.value);
            formData.append('specificArea', specificAreaSelect.value);
            formData.append('haal', haal);

            const files = Array.from(imageUploadInput.files);
            const compressionPromises = files.map(file => compressImage(file));

            try {
                showLoadingOverlay();
                const compressedFiles = await Promise.all(compressionPromises);
                compressedFiles.forEach(file => {
                    formData.append('images', file);
                });

                const response = await fetch('/create', {
                    method: 'POST',
                    body: formData
                });

                if (response.status === 429) {
                    // Redirect if rate limit exceeded
                    window.location.href = '/rate-limit-exceeded';
                } else if (!response.ok) {
                    throw new Error('Error submitting form');
                }

                const data = await response.json();
                console.log(data);
                showNotification("Form submitted successfully");
                setTimeout(() => {
                    window.location.href = '/';
                }, 100); 
            } catch (error) {
                console.error('Error:', error);
                showNotification("Error submitting form");
                submitButton.disabled = false;
            }
        }
    });

    // Event listener for image upload input
    imageUploadInput.addEventListener('change', function () {
        const files = Array.from(imageUploadInput.files);
        files.forEach(file => handleImageUpload(file));
    });

    // Auto-expand description textarea
    descriptionTextarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight}px`;
    });
});
