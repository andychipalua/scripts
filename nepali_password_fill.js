function delayForDomLoad(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fillForm(data, ddData) {
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

    const dropdowns = $("mat-select").closest('.form-group');
    for (let a = 0; a < dropdowns.length; a++) {
        const $ddElem = $(dropdowns[a]);
        const labelText = $ddElem.find('label').text().trim();
        if (ddData[labelText] !== undefined) {
            const ddSelectValue = ddData[labelText];
            const dropdownElemId = $ddElem.find("mat-select").attr("id");
            $("#" + dropdownElemId + " " + ".mat-select-trigger").click();
            await delayForDomLoad(400);
            const $optionElem = $("#" + dropdownElemId + "-panel mat-optgroup mat-option");
            for (let i = 0; i < $optionElem.length; i++) {
                const optID = $($optionElem[i]).attr('id');

                if ($("#" + optID + " .mat-option-text").text().trim() == ddSelectValue) {
                    $("#" + optID).click();
                }
            }
        }
    }
}

// Fill the form with the required data
fillForm({
        lastName: 'Your Last name',
        firstName: 'Your First name',
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
        contactLastName: "emergency last namme",
        contactFirstName: "emergency first name",
        contactStreetVillage: "emergency street",
        contactWard: "emergency ward no",
        contactPhone: "emergency phone no",
        contactEmail: "emergency email",
        currentTDIssueDate: "2020-01-01",
        currentTDNum: "passport number",
        nin: "National identity number",
        citizenNum: "Citizen number",
        citizenIssueDateBS: "2041-01-01",
    }, {
        "Place of Birth (District/Country if born abroad)": "Kavrepalanchok",
        "Citizenship Place of Issue (District)": "Kavrepalanchok",
        "Main Address Province": "Bagmati",
        "Main Address District": "Kavrepalanchok",
        "Main Address Municipality": "Banepa Municipality",
        "Province": "Bagmati",
        "District": "Kavrepalanchok",
        "Municipality": "Banepa Municipality",
        "Place of Issue (District) - For Existing Passport": "DAO Kathmandu",
    }
);

