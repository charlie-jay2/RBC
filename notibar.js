// notibar.js
async function loadNotibar() {
    try {
        const response = await fetch('/.netlify/functions/getNotibar');
        const data = await response.json();

        const notibarElement = document.getElementById('notibar');

        if (data.active) {
            // If the notibar is active and not already shown, fade it in
            if (!notibarElement.classList.contains('show')) {
                // Populate the notibar with data
                notibarElement.innerHTML = `
                    <div style="background-color: ${data.color}; padding: 30px; text-align: center;">
                        <span style="color: white;">${data.text}</span>
                        ${data.buttonActive ? `
                        <a href="${data.buttonURL}" target="_blank" style="background-color: ${data.buttonColor}; color: white; padding: 10px; border-radius: 5px; margin-left: 10px; text-decoration: none;">
                            ${data.buttonText}
                        </a>
                        ` : ''}
                    </div>
                `;

                notibarElement.style.opacity = 0; // Start hidden for fade-in effect
                notibarElement.style.display = 'block'; // Show the notibar
                requestAnimationFrame(() => {
                    notibarElement.style.transition = 'opacity 0.5s ease'; // Set the transition
                    notibarElement.style.opacity = 1; // Fade in
                });
                notibarElement.classList.add('show'); // Add show class to indicate it's visible
            }
        } else {
            // If not active, fade it out
            if (notibarElement.classList.contains('show')) {
                notibarElement.style.transition = 'opacity 0.5s ease'; // Set the transition
                notibarElement.style.opacity = 0; // Fade out

                // Set display to none after fade out transition completes
                setTimeout(() => {
                    notibarElement.style.display = 'none'; // Hide after fading out
                }, 500); // Match this timeout with the transition duration

                notibarElement.classList.remove('show'); // Remove show class to indicate it's hidden
            }
        }
    } catch (error) {
        console.error('Error loading notibar:', error);
    }
}

// Call loadNotibar to display the notification bar
loadNotibar();
setInterval(loadNotibar, 5000); // Check for updates every 5 seconds
