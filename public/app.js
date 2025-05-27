        // Dashboard content storage in memory
        window.dashboardContent = {
            careerRecommendations: null,
            jobProspects: null,
            skillAssessment: null,
            matchedJobs: null,
            learningResources: null,
            networkingOpportunities: null,
            skillData: null
        };

        // Check login status on page load
        document.addEventListener('DOMContentLoaded', function () {
            // Set user as logged in for dashboard page
            localStorage.setItem('isLoggedIn', 'true');
            const username = localStorage.getItem('username') || 'User';

            // Update username display in navbar and profile
            document.querySelectorAll('.username').forEach(el => {
                el.textContent = username;
            });

            // Show logged-in navigation items
            document.querySelectorAll('.logged-in-nav').forEach(el => {
                el.style.display = 'block';
            });
            document.querySelectorAll('.logged-out-nav').forEach(el => {
                el.style.display = 'none';
            });

            // Check and apply theme
            const darkMode = localStorage.getItem('darkMode') !== 'false';
            if (darkMode) {
                document.body.classList.add('dark-mode');
                document.body.classList.remove('light-mode');
                document.getElementById('modeSwitch').innerHTML = '<i class="fas fa-moon"></i>';
            } else {
                document.body.classList.add('light-mode');
                document.body.classList.remove('dark-mode');
                document.getElementById('modeSwitch').innerHTML = '<i class="fas fa-sun"></i>';
            }

            // Load saved content and profile
            loadSavedContent();
            loadSavedSkillChart();
            loadUserProfile();

            // Set up button event listeners
            setupButtonListeners();
        });

        // Toggle between light and dark mode
        function toggleMode() {
            const isDarkMode = document.body.classList.contains('dark-mode');
            if (isDarkMode) {
                document.body.classList.remove('dark-mode');
                document.body.classList.add('light-mode');
                document.getElementById('modeSwitch').innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('darkMode', 'false');
            } else {
                document.body.classList.remove('light-mode');
                document.body.classList.add('dark-mode');
                document.getElementById('modeSwitch').innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('darkMode', 'true');
            }
        }

        // Handle logout
        function logout() {
            localStorage.setItem('isLoggedIn', 'false');
        }

        // Set loading state for buttons
        function setLoadingState(button, loading) {
            const cardBody = button.closest('.card-body');
            if (loading) {
                button.classList.add('loading');
                if (cardBody) cardBody.closest('.card').classList.add('loading');
                button.disabled = true;
            } else {
                button.classList.remove('loading');
                if (cardBody) cardBody.closest('.card').classList.remove('loading');
                button.disabled = false;
            }
        }

        // Format API response text
        function formatText(text) {
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
            text = text.replace(/\n/g, '<br>');
            text = text.replace(/- \[ \] (.*?)(?=\n|$)/g, '<ul><li>$1</li></ul>');
            text = text.replace(/\d+\. (.*?)(?=\n|$)/g, '<ol><li>$1</li></ol>');
            return text;
        }

        // Load saved user profile from multiple sources
        function loadUserProfile() {
            // Try multiple sources for profile data
            let profile = window.userProfile ||
                JSON.parse(sessionStorage.getItem('userProfile') || 'null') ||
            {
                bio: sessionStorage.getItem('bio') || '',
                skills: sessionStorage.getItem('skills') || '',
                careerGoals: sessionStorage.getItem('careerGoals') || '',
                location: sessionStorage.getItem('location') || '',
                experience: sessionStorage.getItem('experience') || ''
            };

            if (profile && (profile.bio || profile.skills)) {
                window.userProfile = profile;
                console.log('Profile loaded:', profile);
            }
        }

        // Load saved AI-generated content on page refresh
        function loadSavedContent() {
            const contentMappings = [
                { id: 'career-recommendations', key: 'careerRecommendations' },
                { id: 'job-prospects', key: 'jobProspects' },
                { id: 'skill-assessment', key: 'skillAssessment' },
                { id: 'matched-jobs', key: 'matchedJobs' },
                { id: 'learning-resources', key: 'learningResources' },
                { id: 'networking-opportunities', key: 'networkingOpportunities' }
            ];

            contentMappings.forEach(({ id, key }) => {
                const savedContent = window.dashboardContent[key] || sessionStorage.getItem(key);

                if (savedContent && document.getElementById(id)) {
                    document.getElementById(id).innerHTML = `<div class="enhanced-text">${savedContent}</div>`;
                }
            });
        }

      
        // Enhanced API call function with content persistence
        async function callGeminiAPI(promptTemplate, elementId, button) {
            setLoadingState(button, true);

            // Get profile from multiple sources
            let profile = window.userProfile ||
                JSON.parse(sessionStorage.getItem('userProfile') || '{}') ||
            {
                bio: sessionStorage.getItem('bio') || 'Not provided',
                skills: sessionStorage.getItem('skills') || 'Not provided',
                careerGoals: sessionStorage.getItem('careerGoals') || 'Not provided'
            };

            if (profile && (profile.bio !== 'Not provided' || profile.skills !== 'Not provided')) {
                const prompt = promptTemplate
                    .replace('${bio}', profile.bio || 'Not provided')
                    .replace('${skills}', profile.skills || 'Not provided')
                    .replace('${careerGoals}', profile.careerGoals || 'Not provided');

                try {
                    const response = await fetch(
                        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyDNeMYy5q3mGJv7-Bj6KMwPmDL6f51RJ9s`,
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                contents: [{ parts: [{ text: prompt }] }],
                            }),
                        }
                    );

                    if (!response.ok) throw new Error('API request failed');

                    const data = await response.json();
                    const text = data.candidates[0].content.parts[0].text;
                    const formattedText = formatText(text);

                    // Save content to memory based on elementId
                    const contentKey = getContentKey(elementId);
                    if (contentKey) {
                        window.dashboardContent[contentKey] = formattedText;
                        sessionStorage.setItem(contentKey, formattedText);
                    }

                    // Display content
                    if (document.getElementById(elementId)) {
                        document.getElementById(elementId).innerHTML = `<div class="enhanced-text">${formattedText}</div>`;
                    }

                } catch (error) {
                    if (document.getElementById(elementId)) {
                        document.getElementById(elementId).innerHTML = '<p>Error loading data. Please try again.</p>';
                    }
                    console.error('Error:', error);
                } finally {
                    setLoadingState(button, false);
                }
            } else {
                if (document.getElementById(elementId)) {
                    document.getElementById(elementId).innerHTML = '<p>Please complete your profile first.</p>';
                }
                setLoadingState(button, false);
            }
        }

        // Helper function to map element IDs to content keys
        function getContentKey(elementId) {
            const mappings = {
                'career-recommendations': 'careerRecommendations',
                'job-prospects': 'jobProspects',
                'skill-assessment': 'skillAssessment',
                'matched-jobs': 'matchedJobs',
                'learning-resources': 'learningResources',
                'networking-opportunities': 'networkingOpportunities'
            };
            return mappings[elementId] || null;
        }

        
        // Setup all button event listeners
        function setupButtonListeners() {
            // Button event listeners for Gemini API calls
            document.getElementById('get-career-recommendations-btn').addEventListener('click', function () {
                const promptTemplate = "Generate detailed career recommendations for a user with bio: '${bio}', skills: '${skills}', and career goals: '${careerGoals}'. Include specific job roles and why they are suitable.";
                callGeminiAPI(promptTemplate, 'career-recommendations', this);
            });

            document.getElementById('get-job-prospects-btn').addEventListener('click', function () {
                const promptTemplate = "Provide job prospects and market outlook for a user with skills: '${skills}' and career goals: '${careerGoals}'. Highlight growth areas and competitive advantages.";
                callGeminiAPI(promptTemplate, 'job-prospects', this);
            });

            document.getElementById('assess-skills-btn').addEventListener('click', function () {
                const promptTemplate = "Assess user skills based on bio: '${bio}', skills: '${skills}', and career goals: '${careerGoals}'.";
                callGeminiAPI(promptTemplate, 'skill-assessment', this);
            });

            document.getElementById('match-jobs-btn').addEventListener('click', function () {
                const promptTemplate = "Match job opportunities for a user with bio: '${bio}', skills: '${skills}', and career goals: '${careerGoals}'. Provide job titles, required skills, and match strength.";
                callGeminiAPI(promptTemplate, 'matched-jobs', this);
            });

            document.getElementById('get-learning-resources-btn').addEventListener('click', function () {
                const promptTemplate = "Recommend learning resources (courses, books, communities) for a user with skills: '${skills}' and career goals: '${careerGoals}'.";
                callGeminiAPI(promptTemplate, 'learning-resources', this);
            });

            document.getElementById('find-networking-opportunities-btn').addEventListener('click', function () {
                const promptTemplate = "Suggest networking opportunities (events, online communities, organizations) for a user with bio: '${bio}' and career goals: '${careerGoals}'.";
                callGeminiAPI(promptTemplate, 'networking-opportunities', this);
            });

            // Smooth scroll for sidebar links
            document.querySelectorAll('.sidebar a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth'
                        });
                    }
                });
            });

            // Change profile picture on file input change
            const profilePictureInput = document.getElementById('profilePictureInput');
            const profilePictureWrapper = document.querySelector('.profile-picture-wrapper');
            const profilePicture = document.querySelector('.profile-picture');

            if (profilePictureWrapper && profilePictureInput) {
                profilePictureWrapper.addEventListener('click', () => {
                    profilePictureInput.click();
                });

                profilePictureInput.addEventListener('change', function () {
                    const file = this.files[0];
                    if (file && profilePicture) {
                        const reader = new FileReader();
                        reader.onload = function (e) {
                            profilePicture.src = e.target.result;
                        };
                        reader.readAsDataURL(file);
                    }
                });
            }
        }