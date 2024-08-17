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

    // Buildings with specific areas
    const buildingsWithAreas = {
    "Academic Block-1 (AB-1)": ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],

    "Academic Block-2 (AB-2)": ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor"],

    "Central Block": ["Ground Floor", "1st Floor", "2nd Floor", "3rd Floor", "4th Floor", "5th Floor", "6th Floor"],

    "Rock Plaza": ["Cafeteria", "Badminton Court", "Tennis Court", "Gym", "2nd Floor"],

    "LH-1": ["Mess", "Other"],

    "LH-2": ["Mess", "Other"],

    "MH-1": ["Mess", "Other"],

    "MH-2": ["Mess", "Other"],

    "MH-3": ["Mess", "Other"],

    "MH-4": ["Mess", "Other"],

    "MH-5": ["Mess", "Other"]

}

// Alphabetically sort building names
const sortedBuildings = Object.keys(buildingsWithAreas).sort();

// Displaying building names in alphabetical order
sortedBuildings.forEach(building => {
    let areas = "";
    if (buildingsWithAreas[building].areas) {
        areas = `Specific Area: ${buildingsWithAreas[building].areas.join(", ")}`;
    }
    console.log(`${building}\n${areas}`);
});

    // Function to populate specific areas dropdown based on selected building
    function populateSpecificAreas(building) {
        specificAreaSelect.innerHTML = '<option value="">Select a specific area</option>';

        if (buildingsWithAreas[building]) {
            buildingsWithAreas[building].forEach(area => {
                specificAreaSelect.innerHTML += `<option value="${area}">${area}</option>`;
            });
            specificAreaSection.style.display = 'block';
        } else {
            specificAreaSection.style.display = 'none';
            specificAreaSelect.value = ''; // Reset specific area select
        }
    }

    // Event listener for building select
    buildingSelect.addEventListener('change', function () {
        const selectedBuilding = buildingSelect.value;
        populateSpecificAreas(selectedBuilding);
    });

    // Function to show notification
    function showNotification(message) {
        notification.innerText = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    // Function to handle image upload
    function handleImageUpload(file) {
        const reader = new FileReader();
        const fileInfo = document.createElement('div');
        fileInfo.innerText = `Uploading ${file.name}...`;
        imagePreview.appendChild(fileInfo);

        reader.onload = function (e) {
            fileInfo.innerHTML = `<a href="${e.target.result}" target="_blank">${file.name}</a>`;
        };

        reader.readAsDataURL(file);
    }

    // Event listener for submit button
    submitButton.addEventListener('click', function (e) {
        e.preventDefault();
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
        } else {
            const formData = new FormData();
            formData.append('title', titleInput.value);
            formData.append('description', descriptionTextarea.value);
            formData.append('itemType', itemTypeSelect.value);
            formData.append('building', buildingSelect.value);
            formData.append('specificArea', specificAreaSelect.value);
            Array.from(imageUploadInput.files).forEach(file => {
            formData.append('images', file);
        });
        fetch('/create', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
        console.log(data);
        showNotification("Form submitted successfully");
        setTimeout(() => {
            window.location.href = '/';
        }, 2000); // 2-second delay
        })
        .catch(error => {
        console.error('Error:', error);
        showNotification("Error submitting form");
        });
        }
    });

    // Event listener for image upload input
    imageUploadInput.addEventListener('change', function () {
        const files = Array.from(imageUploadInput.files);
        files.forEach(file => {
            handleImageUpload(file);
        });
    });

    // Auto-expand description textarea
    descriptionTextarea.addEventListener('input', function () {
        this.style.height = 'auto';
        this.style.height = `${this.scrollHeight}px`;
    });
});

function handleClick() {
    var button = document.getElementById('submit-button');
    button.disabled = true;
    button.innerText = 'Submitting...';
    setTimeout(function() {
      button.disabled = false;
      button.innerText = 'Submit';
    }, 300000); 
  }