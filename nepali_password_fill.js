function fillForm(data) {
    const inputs = document.querySelectorAll('[formcontrolname]');

    if (inputs.length === 0) {
        console.error("No inputs with 'formcontrolname' found on the page.");
        return;
    }

    // Iterate through each input with `formcontrolname` attribute
    inputs.forEach(input => {
        const name = input.getAttribute('formcontrolname');

        if (data[name] !== undefined) {
            if (input.type === 'radio') {
                // Handle radio buttons
                if (input.value === data[name]) {
                    input.checked = true; // Check the radio button
                    input.dispatchEvent(new Event('change')); // Trigger change event
                }
            } else {
                // Handle other input types (e.g., text)
                input.value = data[name];
                input.dispatchEvent(new Event('input')); // Trigger input event
            }
        }
    });
}

// Fill the form with the required data
fillForm({
    lastName: 'Shrestha',
    firstName: 'Rujesh',
    gender: 'M',
    dateOfBirth: "2000-01-01",
    isExactDateOfBirth: "true",
    dateOfBirthBS: "2040-01-01",
    birthDistrict: "Lalitpur",
    fatherLastName: "Shrestha",
    fatherFirstName: "Father",
    motherLastName: "Shrestha",
    motherFirstName: "Mother",
    homePhone: "+1XXXXXXXXXX",
    email: "rujesthpradhan@rujeshmail.com",
    mainAddressHouseNum: "Some house no",
    mainAddressStreetVillage: "Some address 2",
    mainAddressWard: "some ward no",
    contactLastName: "e last namme",
    contactFirstName: "e first name",
    contactStreetVillage: "e street",
    contactWard: "e ward no",
    contactPhone: "e phone no",
    contactEmail: "e email",
    currentTDIssueDate: "2020-01-01",
    currentTDNum: "passport number",
    nin: "National identity number",
    citizenNum: "Citizen number",
    citizenIssueDateBS: "2041-01-01"
});

