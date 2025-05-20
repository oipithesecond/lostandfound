// Toggle filter options visibility
function toggleFilterOptions() {
    const filterOptions = document.getElementById('filter-options');
    const sidebar = document.querySelector('.sidebar');
    const isSidebarActive = sidebar.classList.contains('active');
    const uploadButton = document.getElementById('uploadButton');
    const uploadOptions = document.getElementById('uploadOptions');

    if (isSidebarActive) {
        if (filterOptions.style.display === 'block') {
            // Collapse both sidebar and filter options
            sidebar.classList.remove('active');
            filterOptions.style.display = 'none';
            resetButtonPositions();
        } else {
            // Toggle filter options only
            filterOptions.style.display = 'block';
            uploadButton.classList.add('moved');
            uploadOptions.classList.add('moved');
        }
    } else {
        // Expand sidebar and show filter options
        sidebar.classList.add('active');
        setTimeout(() => {
            filterOptions.style.display = 'block';
            filterOptions.classList.add('visible');
            uploadButton.classList.add('moved');
            uploadOptions.classList.add('moved');
        }, 300); // Match sidebar transition
    }
    adjustFilterPosition(); // Adjust filter position dynamically
}

// Toggle upload options visibility
function toggleUploadOptions() {
    const sidebar = document.querySelector('.sidebar');
    const uploadOptions = document.getElementById('uploadOptions');
    const filterButton = document.getElementById('filterButton');

    const isSidebarActive = sidebar.classList.contains('active');

    // If sidebar is collapsed, expand it and then show upload options
    if (!isSidebarActive) {
        sidebar.classList.add('active');
        setTimeout(() => {
            uploadOptions.style.display = 'block';
            uploadOptions.classList.add('moved');
            filterButton.classList.add('moved');  // Adjust filter button position
        }, 300); // Match sidebar transition time
    } else {
        // Toggle the visibility of the upload options
        uploadOptions.style.display = uploadOptions.style.display === 'none' ? 'block' : 'none';

        if (uploadOptions.style.display === 'block') {
            filterButton.classList.add('moved');
            uploadOptions.classList.add('moved');
        } else {
            filterButton.classList.remove('moved');
            uploadOptions.classList.remove('moved');
        }
    }

    adjustFilterPosition(); // Adjust filter position dynamically
}

// Adjust positions of filter options when upload options open
function adjustFilterPosition() {
    const filterOptions = document.getElementById('filter-options');
    const uploadOptions = document.getElementById('uploadOptions');

    // Check if upload options are visible
    const uploadVisible = uploadOptions.style.display === 'block';

    if (uploadVisible) {
        // Calculate new position for filter options based on upload options height
        // Get the viewport height (in vh)
        const viewportHeight = window.innerHeight;

        // Get the height of the upload options
        const uploadHeight = uploadOptions.offsetHeight;

        // Adjust the margin-top of the filter options in vh (e.g., 10vh below the upload options)
        const marginTopInVh = (uploadHeight / viewportHeight) * 100 + 24; // Adding 10vh extra space, adjust as needed

        // Set the margin-top in vh units
        filterOptions.style.marginTop = `${marginTopInVh}vh`; // Add margin to push down
    } else {
        // Reset position if upload options are hidden
        filterOptions.style.marginTop = '28vh';
    }
}

// Apply filters to items
function applyFilters() {
    const selectedItemType = document.getElementById('filter-item-type').value.toLowerCase();
    const selectedBuilding = document.getElementById('filter-building').value.toLowerCase();
    const selectedStatus = document.getElementById('filter-status').value.toLowerCase();
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemType = item.querySelector('.type').textContent.toLowerCase();
        const itemLocation = item.querySelector('.location').textContent.toLowerCase();
        const itemStatusText = item.querySelector('.para').textContent.toLowerCase();
        
        const isLost = itemStatusText.includes("lost at");
        
        // Apply item type filter
        const typeMatch = selectedItemType === '' || itemType.includes(selectedItemType);
        
        // Apply location filter
        const locationMatch = selectedBuilding === '' || itemLocation.includes(selectedBuilding);
        
        // Apply status filter (lost or found)
        const statusMatch = selectedStatus === '' || 
                            (selectedStatus === 'lost' && isLost) || 
                            (selectedStatus === 'found' && !isLost);

        // Show the item if it matches all selected filters
        item.style.display = typeMatch && locationMatch && statusMatch ? 'block' : 'none';
    });

    collapseSidebarAndOptions(); // Collapse the sidebar and filter options after applying the filter
}

// Toggle sidebar visibility
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');

    if (!sidebar.classList.contains('active')) {
        collapseSidebarAndOptions();
    }
}

// Close sidebar, filter options, and upload options when clicking outside
function closeSidebarOnClickOutside(event) {
    const sidebar = document.querySelector('.sidebar');
    const filterOptions = document.getElementById('filter-options');
    const uploadOptions = document.getElementById('uploadOptions');

    if (
        !sidebar.contains(event.target) &&
        !filterOptions.contains(event.target) &&
        !uploadOptions.contains(event.target)
    ) {
        if (sidebar.classList.contains('active')) {
            collapseSidebarAndOptions();
        }
    }
}

// Collapse sidebar and reset all options
function collapseSidebarAndOptions() {
    const sidebar = document.querySelector('.sidebar');
    const filterOptions = document.getElementById('filter-options');
    const uploadOptions = document.getElementById('uploadOptions');

    sidebar.classList.remove('active');

    if (filterOptions.style.display === 'block') {
        filterOptions.style.display = 'none';
        filterOptions.classList.remove('visible');
    }

    if (uploadOptions.style.display === 'block') {
        uploadOptions.style.display = 'none';
        uploadOptions.classList.remove('moved');
    }

    resetButtonPositions();
}

// Reset button positions
function resetButtonPositions() {
    const uploadButton = document.getElementById('uploadButton');
    const filterButton = document.getElementById('filterButton');

    uploadButton.classList.remove('moved');
    filterButton.classList.remove('moved');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    const filterButton = document.getElementById('filterButton');
    if (filterButton) {
        filterButton.addEventListener('click', toggleFilterOptions);
    }

    const applyButton = document.getElementById('apply-filters-button');
    if (applyButton) {
        applyButton.addEventListener('click', applyFilters);
    }

    const toggleSidebarButton = document.querySelector('#btn');
    if (toggleSidebarButton) {
        toggleSidebarButton.addEventListener('click', toggleSidebar);
    }

    const uploadButton = document.getElementById('uploadButton');
    if (uploadButton) {
        uploadButton.addEventListener('click', toggleUploadOptions);
    }

    document.addEventListener('click', closeSidebarOnClickOutside);
});


uploadButton.addEventListener("click", function () {
    // Toggle the visibility of upload options when the button is clicked
    uploadOptions.classList.toggle("show");

    // If the sidebar is collapsed, adjust the margin of the button and content
    if (document.body.classList.contains('sidebar-collapsed')) {
        uploadOptions.style.width = "calc(100% - 20px)";  // Adjust width according to sidebar collapse
    } else {
        uploadOptions.style.width = '230px';
        uploadOptions.style.marginLeft = '14px'
        uploadOptions.style.marginBottom = '10px'// Default when sidebar is expanded
    }
});

// Handle window resize events
window.addEventListener("resize", function () {
    if (window.innerWidth <= 768) {
        // Adjust the width of the upload options on small screens
        uploadOptions.style.width = "80%";  // Relative to sidebar width
    } else {
        uploadOptions.style.width = "calc(100% - 40px)";  // Full width when sidebar is not collapsed
    }
});