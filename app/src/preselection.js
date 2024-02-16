var removed = false;
var checkremoved = false;

// Preselection removal
function executeFunction() {
    console.log('presection removal');
    var checkboxElements = document.querySelectorAll('input[type="checkbox"]');

    // Iterate through each checkbox element
    checkboxElements.forEach(function (checkboxElement) {
        // Check if the checkbox is preselected
        if (checkboxElement.checked && !checkremoved) {
            // If preselected, uncheck the checkbox
            checkboxElement.checked = false;
            checkboxElement.style.backgroundColor = 'yellow';
            checkboxElement.appendChild(
                document.createTextNode('Preselection removed')
            );
            checkboxElement.style.border = '5px solid red';
            var messageElement = document.createElement('div');
            messageElement.textContent = 'Preselection removed';
            messageElement.style.backgroundColor = 'lightgreen'; // Set background color to green
            messageElement.style.padding = '5px'; // Add padding for better visibility
            messageElement.style.marginTop = '5px'; // Add margin to separate from checkbox

            // Append the message element to the checkbox
            checkboxElement.parentNode.appendChild(messageElement);

            // checkboxElement.innerText=checkboxElement.innerText+"Preselection removed";
        }
    });
    checkremoved = true;
    var selectElements = document.querySelectorAll('select');

    // Iterate through each select element
    selectElements.forEach(function (selectElement) {
        // Check if any option is already selected
        var selectedOption = selectElement.querySelector('option:checked');
        if (selectedOption && !removed) {
            // If selected, change the value to "none"
            selectElement.value = 'none';
        }
    });
    removed = true;
}

// Call the function initially
executeFunction();

// Call the function every 1000 milliseconds (1 second)
setInterval(executeFunction, 5000);
