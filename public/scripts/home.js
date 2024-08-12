// Toggle filter options visibility
function toggleFilterOptions() {
    const filterOptions = document.getElementById('filter-options');
    const sidebar = document.querySelector('.sidebar');
    const isSidebarActive = sidebar.classList.contains('active');
    
    if (isSidebarActive) {
        if (filterOptions.style.display === 'block') {
            // If sidebar is active and filter options are visible, collapse both
            sidebar.classList.remove('active');
            filterOptions.style.display = 'none';
        } else {
            // If sidebar is active but filter options are not visible, just toggle filter options
            filterOptions.style.display = 'block';
        }
    } else {
        // If sidebar is not active, open it and display filter options
        sidebar.classList.add('active');
        setTimeout(() => {
            filterOptions.style.display = 'block';
            filterOptions.classList.add('visible');
        }, 300); // Delay to match the sidebar expand transition
    }
}

// Apply filters to items
function applyFilters() {
    const selectedItemType = document.getElementById('filter-item-type').value.toLowerCase();
    const selectedBuilding = document.getElementById('filter-building').value.toLowerCase();
    const items = document.querySelectorAll('.item');

    items.forEach(item => {
        const itemType = item.querySelector('.type').textContent.toLowerCase();
        const itemLocation = item.querySelector('.location').textContent.toLowerCase();

        let typeMatch = selectedItemType === '' || itemType.includes(selectedItemType);
        let locationMatch = selectedBuilding === '' || itemLocation.includes(selectedBuilding);

        if (typeMatch && locationMatch) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });

    const sidebar = document.querySelector('.sidebar');
    const filterOptions = document.getElementById('filter-options');
    if (sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        filterOptions.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const filterButton = document.getElementById('filterButton'); // Adjusted ID to match HTML
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
});

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

function closeSidebarOnClickOutside(event) {
    const sidebar = document.querySelector('.sidebar');
    const filterOptions = document.getElementById('filter-options');

    // Check if the click was outside the sidebar and filter options
    if (!sidebar.contains(event.target) && !filterOptions.contains(event.target)) {
        if (sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
        if (filterOptions.style.display === 'block') {
            filterOptions.style.display = 'none';
            filterOptions.classList.remove('visible');
        }
    }
}

document.addEventListener('click', closeSidebarOnClickOutside);




