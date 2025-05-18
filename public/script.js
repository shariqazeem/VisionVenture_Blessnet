// Handle profile form submission
document.getElementById('profileForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const bio = document.getElementById('bio').value;
    const skills = document.getElementById('skills').value;
    const careerGoals = document.getElementById('careerGoals').value;

    // Save to session storage
    const profile = { bio, skills, careerGoals };
    sessionStorage.setItem('userProfile', JSON.stringify(profile));

    // Redirect to dashboard
    window.location.href = 'dashboard.html';
});

// Load recommendations on dashboard
if (window.location.pathname.includes('dashboard.html')) {
    const profile = JSON.parse(sessionStorage.getItem('userProfile'));
    if (profile) {
        getCareerRecommendations(profile);
    }
    if (profile) {
    document.getElementById('user-summary').innerHTML = `
        <p><strong>Bio:</strong> ${profile.bio}</p>
        <p><strong>Skills:</strong> ${profile.skills}</p>
        <p><strong>Career Goals:</strong> ${profile.careerGoals}</p>
        <p><strong>Location:</strong> ${profile.location}</p>
        <p><strong>Experience:</strong> ${profile.experience} years</p>
    `;
}

}

// Function to call Gemini API
async function getCareerRecommendations(profile) {
    const apiKey = 'AIzaSyDNeMYy5q3mGJv7-Bj6KMwPmDL6f51RJ9s'; // Replace with your actual key
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const prompt = `Generate career recommendations for a user with bio: "${profile.bio}", skills: "${profile.skills}", career goals: "${profile.careerGoals}"`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });
        const data = await response.json();
        const recommendations = data.candidates[0].content.parts[0].text;
        document.getElementById('career-recommendations').innerHTML = formatText(recommendations);
    } catch (error) {
        document.getElementById('career-recommendations').innerHTML = '<p>Error loading recommendations.</p>';
        console.error('Error:', error);
    }
}

// Simple text formatting function
function formatText(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/(\d+\.\s+)/g, '<p>$1</p>');
}