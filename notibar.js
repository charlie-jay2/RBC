document.addEventListener("DOMContentLoaded", function () {
    // Variables to control Notibar and button states
    let notibarActive = false; // Control the visibility of the Notibar
    let button1Active = false; // Control the first button visibility
    let button2Active = true; // Control the second button visibility
    let button3Active = false; // Control the third button visibility

    // Function to configure and show the Notibar
    function configureNotibar(message, buttonTexts, buttonLinks, styles) {
        const notibar = document.getElementById("notibar"); // Get the Notibar element
        notibar.innerHTML = ""; // Clear any existing content

        // Show or hide based on the active state
        notibar.style.display = notibarActive ? "block" : "none";

        // Set styles
        notibar.style.backgroundColor = styles.backgroundColor || "#333"; // Default background color
        notibar.style.color = styles.textColor || "white"; // Default text color
        notibar.style.padding = "10px"; // Add padding for better spacing
        notibar.style.textAlign = "center"; // Center the text and buttons
        notibar.style.fontSize = styles.fontSize || "16px"; // Default font size

        // Add message text
        const notibarText = document.createElement("span");
        notibarText.textContent = message;
        notibarText.style.margin = "0 0px"; // Add margin
        notibar.appendChild(notibarText);

        // Add buttons
        [button1Active, button2Active, button3Active].forEach((isActive, index) => {
            if (isActive) {
                const button = document.createElement("button");
                button.textContent = buttonTexts[index] || `Button ${index + 1}`;
                button.onclick = () => {
                    if (buttonLinks[index]) {
                        window.location.href = buttonLinks[index]; // Navigate to link on button click
                    }
                };
                button.style.margin = "0 5px"; // Add margin between buttons
                button.style.color = styles.buttonTextColor || "white"; // Button text color
                button.style.backgroundColor = styles.buttonBackgroundColor || "#007BFF"; // Button background color
                button.style.border = `1px solid ${styles.buttonBorderColor || "black"}`; // Button border color
                button.style.borderRadius = styles.buttonBorderRadius || "5px"; // Button border radius
                button.style.padding = "10px 30px"; // Button padding
                button.style.fontSize = styles.buttonFontSize || "16px"; // Default button font size
                button.style.cursor = "pointer"; // Change cursor to pointer
                button.onmouseover = () => button.style.cursor = "pointer"; // Pointer on hover
                button.onmouseout = () => button.style.cursor = ""; // Reset cursor
                notibar.appendChild(button);
            }
        });
    }

    // Function to toggle the Notibar visibility and configure it
    window.toggleNotibar = function (isActive, message, buttonTexts, buttonLinks, styles) {
        notibarActive = isActive; // Update the active state
        const notibar = document.getElementById("notibar"); // Get the Notibar element
        notibar.style.display = notibarActive ? "block" : "none"; // Ensure visibility matches active state
        configureNotibar(message, buttonTexts, buttonLinks, styles); // Configure Notibar
    };

    // Example usage: Show the Notibar with buttons and styles
    toggleNotibar(true,
        "This website is under development | Our contact form is unavailable",
        ["Learn More", "Contact Us", "Dismiss"],
        ["shows.html", "https://discord.gg/rbctv", target = "_blank", ""], // Button links
        {
            backgroundColor: "#333", // Notibar background color
            textColor: "white", // Notibar text color
            buttonTextColor: "#ffffff", // Button text color
            buttonBackgroundColor: "#b06cfc", // Button background color
            buttonBorderColor: "#b06cfc", // Button border color
            buttonBorderRadius: "5px", // Button border radius
            fontSize: "18px", // Customize the font size
            buttonFontSize: "18px", // Customize button font size
        }
    );
});
