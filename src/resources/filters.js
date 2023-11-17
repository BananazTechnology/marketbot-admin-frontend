/**
 * Table Filter Functions
 * Author: Aaron Renner
 */
function filterActiveRows(event) {
    event.preventDefault();
    console.log("Filtering rows...");
    console.log("show active1: " + showActive);
    // Toggle the filter state for the next click (null -> true -> false -> null)
    if (showActive === null) {
        showActive = true;
    } else if (showActive) {
        showActive = false;
    } else {
        showActive = null;
    }
    console.log("show active2: " + showActive);

    // Iterate through each row in the table body
    $("#mainTable tbody tr").each(function () {
        // Check if the 'Active' column (4th column) contains the text 'true'
        const isActive = $(this).find("td:nth-child(4)").text().trim() === "true";

        // Toggle rows based on the current filter state
        if (showActive === null || (showActive && isActive) || (!showActive && !isActive)) {
            // Show rows that match the current filter state (or show all if showActive is null)
            $(this).show();
        } else {
            // Hide rows that do not match the current filter state
            $(this).hide();
        }
    });

    // Update the button text to indicate the current filter state
    const filterButton = $("#filterButton");
    if (showActive === null) {
        filterButton.text("Showing All");
    } else if (showActive) {
        filterButton.text("Showing Active");
    } else {
        filterButton.text("Showing Inactive");
    }
}