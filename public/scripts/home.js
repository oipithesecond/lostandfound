// Toggle filter options
function toggleFilterOptions() 
{
    const filterOptions = document.getElementById('filter-options');
    if (filterOptions.style.display === 'none' || filterOptions.style.display === '') 
    {
        filterOptions.style.display = 'block';
    } 
    else 
    {
        filterOptions.style.display = 'none';
    }
}

// Apply filters
function applyFilters() 
{
    const selectedItemType = document.getElementById('filter-item-type').value.toLowerCase();
    const selectedBuilding = document.getElementById('filter-building').value.toLowerCase();
    const items = document.querySelectorAll('.item');

    items.forEach(item => 
        {
        const itemType = item.querySelector('.type').textContent.toLowerCase();
        const itemLocation = item.querySelector('.location').textContent.toLowerCase();

        let typeMatch = selectedItemType === '' || itemType.includes(selectedItemType);
        let locationMatch = selectedBuilding === '' || itemLocation.includes(selectedBuilding);

        if (typeMatch && locationMatch) 
        {
            item.style.display = 'block';
        } 
        else 
        {
            item.style.display = 'none';
        }
    });
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', () => 
    {
    const filterButton = document.getElementById('filter-button');
    if (filterButton) {
        filterButton.addEventListener('click', toggleFilterOptions);
    }
    const applyButton = document.getElementById('apply-filters-button');
    if (applyButton) {
        applyButton.addEventListener('click', applyFilters);
    }
});
