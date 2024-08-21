// Toggle sidebar expansion/collapse
document.getElementById('btn').addEventListener('click', function () {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');

    const mainContent = document.querySelector('.main-content');
    mainContent.classList.toggle('active');
});

// Handle sidebar button clicks
const sidebarButtons = document.querySelectorAll('.sidebar ul li a');

sidebarButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();

        // Remove active class from all content sections
        const allContent = document.querySelectorAll('.content');
        allContent.forEach(content => {
            content.style.display = 'none';
            content.classList.remove('active');
        });

        // Add active class to the clicked button's content section
        const buttonId = button.id.split('-btn')[0];
        const contentId = `${buttonId}-content`;
        const selectedContent = document.getElementById(contentId);
        if (selectedContent) {
            selectedContent.style.display = 'block';
            selectedContent.classList.add('active');
        }
    });
});


document.addEventListener('DOMContentLoaded', function() {
    const dateElements = document.querySelectorAll('.date');

    dateElements.forEach(function(dateElement) {
        const postDateStr = dateElement.getAttribute('data-post-date');
        const postDate = new Date(postDateStr);

        const currentDate = new Date();
        const timeDiff = currentDate.getTime() - postDate.getTime();
        const daysDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

        dateElement.textContent = `Posted ${daysDiff} days ago`;
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('description');

    function adjustTextareaHeight() {
        // Reset the height to auto to shrink if needed
        textarea.style.height = 'auto';
        // Set the height to the scrollHeight to fit content
        textarea.style.height = `${textarea.scrollHeight}px`;
    }

    // Adjust the height on input event
    textarea.addEventListener('input', adjustTextareaHeight);

    // Initial adjustment for pre-filled content
    adjustTextareaHeight();
});
