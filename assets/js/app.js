const username = 'musfiqurjahin';
let allRepos = [];
let filteredRepos = [];
let currentPage = 1;
const reposPerPage = 9;
let currentStreak = 0;

//Follow button
const followBtn = document.getElementById('follow-btn');
// Dynamically set the href using the username variable
followBtn.href = `https://github.com/${username}`;

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();

window.onload = async function () {
    try {
        await loadAllData();
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data. Please check your connection.');
    }
};



async function loadAllData() {
    await loadUserData();
    await loadRepositories();

    updateProfileUI();
    updateStatsUI();
    filterAndDisplayRepos();
    updateAnalytics();
    setupEventListeners();
    updateLoadMoreButton();
}

async function loadUserData() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}`);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        window.userData = data;
    } catch (error) {
        console.error('Error loading user data:', error);
        window.userData = {
            avatar_url: `https://github.com/${username}.png`,
            name: 'Musfiqur Jahin',
            login: username,
            bio: 'Software Developer | GitHub Enthusiast | Passionate about creating impactful solutions with modern technologies',
            location: 'Bangladesh',
            blog: '',
            created_at: '2020-01-01T00:00:00Z',
            public_repos: 0,
            followers: 0
        };
    }
}

async function loadRepositories() {
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
        if (!response.ok) throw new Error('API Error');
        const data = await response.json();
        allRepos = data;
    } catch (error) {
        console.error('Error loading repositories:', error);
        allRepos = [];
    }
}

async function fetchGitHubStreak() {
    try {
        const eventsResponse = await fetch(`https://api.github.com/users/${username}/events`);
        if (eventsResponse.ok) {
            const events = await eventsResponse.json();
            const streak = calculateStreakFromEvents(events);
            if (streak > 0) {
                return streak;
            }
        }

        return calculateStreakFromRepos();

    } catch (error) {
        console.error('Error fetching streak:', error);
        return calculateStreakFromRepos();
    }
}

function calculateStreakFromEvents(events) {
    if (!events || events.length === 0) return 0;

    const contributionDates = new Set();
    const now = new Date();

    events.forEach(event => {
        if (event.type === 'PushEvent' || event.type === 'CreateEvent' ||
            event.type === 'PullRequestEvent' || event.type === 'IssuesEvent') {
            const eventDate = new Date(event.created_at);
            const dateStr = eventDate.toISOString().split('T')[0];
            contributionDates.add(dateStr);
        }
    });

    let streak = 0;
    let currentDate = new Date(now);

    for (let i = 0; i < 365; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];

        if (contributionDates.has(dateStr)) {
            streak++;
        } else {
            if (i === 0) {
                continue;
            } else {
                break;
            }
        }

        currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
}

function calculateStreakFromRepos() {
    if (allRepos.length === 0) return 0;

    const now = new Date();
    const recentRepos = [...allRepos]
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        .slice(0, 20);

    const recentDates = recentRepos.map(repo => {
        const date = new Date(repo.updated_at);
        return date.toISOString().split('T')[0];
    });

    const uniqueDates = [...new Set(recentDates)];

    let streak = 0;
    let currentDate = new Date(now);

    for (let i = 0; i < 30; i++) {
        const dateStr = currentDate.toISOString().split('T')[0];

        if (uniqueDates.includes(dateStr)) {
            streak++;
        } else if (i === 0) {
            continue;
        } else {
            break;
        }

        currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
}

async function updateStreakInfo() {
    currentStreak = await fetchGitHubStreak();
    updateStreakUI();
}

function updateStreakUI() {
    const streakValue = document.getElementById('current-streak');
    const streakBadge = document.getElementById('streak-badge');

    streakValue.textContent = currentStreak;

    if (currentStreak >= 7) {
        streakBadge.innerHTML = `<i class="fas fa-fire"></i><span>${currentStreak} day streak!</span>`;
        streakBadge.style.background = 'rgba(16, 185, 129, 0.1)';
        streakBadge.style.color = 'var(--success)';
    } else if (currentStreak >= 3) {
        streakBadge.innerHTML = `<i class="fas fa-bolt"></i><span>${currentStreak} day streak</span>`;
        streakBadge.style.background = 'rgba(245, 158, 11, 0.1)';
        streakBadge.style.color = 'var(--warning)';
    } else if (currentStreak > 0) {
        streakBadge.innerHTML = `<i class="fas fa-bolt"></i><span>${currentStreak} day streak</span>`;
        streakBadge.style.background = 'rgba(37, 99, 235, 0.1)';
        streakBadge.style.color = 'var(--primary-light)';
    } else {
        streakBadge.innerHTML = `<i class="fas fa-bolt"></i><span>Start coding!</span>`;
        streakBadge.style.background = 'rgba(255, 255, 255, 0.1)';
        streakBadge.style.color = 'var(--gray)';
    }
}

function extractStreakFromImage() {
    setTimeout(async () => {
        await updateStreakInfo();
    }, 1000);
}

function handleStreakImageError() {
    console.log('Streak image failed to load, using API calculation');
    updateStreakInfo();
}

function updateProfileUI() {
    if (!window.userData) return;

    const user = window.userData;

    const avatarPlaceholder = document.getElementById('avatar-placeholder');
    avatarPlaceholder.innerHTML = `<img src="${user.avatar_url}" alt="${user.name || user.login}" style="width: 100%; height: 100%; object-fit: cover;">`;

    document.getElementById('profile-name').textContent = user.name || user.login;
    document.getElementById('profile-username').innerHTML = `<i class="fab fa-github"></i><span>@${user.login}</span>`;
    document.getElementById('profile-bio').textContent = user.bio || 'No bio available';


    const locationEl = document.getElementById('location');
    const websiteEl = document.getElementById('website');
    const joinedEl = document.getElementById('joined-date');

    if (user.location) {
        locationEl.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>${user.location}</span>`;
    } else {
        locationEl.innerHTML = `<i class="fas fa-map-marker-alt"></i><span>Location not set</span>`;
    }

    if (user.blog) {
        const blogUrl = user.blog.startsWith('http') ? user.blog : `https://${user.blog}`;
        websiteEl.innerHTML = `<i class="fas fa-link"></i><a href="${blogUrl}" target="_blank" style="color: var(--gray); text-decoration: none;">Website</a>`;
    } else {
        websiteEl.innerHTML = `<i class="fas fa-link"></i><span>No website</span>`;
    }

    if (user.created_at) {
        const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });
        joinedEl.innerHTML = `<i class="fas fa-calendar-alt"></i><span>Joined ${joinDate}</span>`;
    }
}

function updateStatsUI() {
    if (!window.userData) return;

    const user = window.userData;

    document.getElementById('total-repos').textContent = user.public_repos || allRepos.length;
    document.getElementById('total-followers').textContent = user.followers || 0;

    const totalStars = allRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    document.getElementById('total-stars').textContent = totalStars;

    const totalContributions = calculateTotalContributions();
    document.getElementById('total-contributions-value').textContent = totalContributions;

    const totalLines = calculateTotalLinesOfCode();
    document.getElementById('total-lines').textContent = totalLines;

    updateStreakInfo();
}

function calculateTotalContributions() {
    let totalCommits = 0;

    allRepos.forEach(repo => {
        const daysSinceUpdate = Math.floor((new Date() - new Date(repo.updated_at)) / (1000 * 60 * 60 * 24));
        const isActive = daysSinceUpdate < 90;

        if (isActive) {
            totalCommits += Math.floor(repo.size / 100) + 5;
        } else {
            totalCommits += Math.floor(repo.size / 500) + 1;
        }
    });

    return Math.max(totalCommits, 42);
}

function calculateTotalLinesOfCode() {
    const totalSize = allRepos.reduce((sum, repo) => sum + (repo.size || 0), 0);
    const estimatedLines = Math.round(totalSize * 75);
    return estimatedLines.toLocaleString();
}

function filterAndDisplayRepos() {
    filteredRepos = [...allRepos].sort((a, b) =>
        new Date(b.updated_at) - new Date(a.updated_at)
    );

    currentPage = 1;
    displayReposPage();
}

function displayReposPage() {
    const reposContainer = document.getElementById('repos-container');

    if (allRepos.length === 0) {
        reposContainer.innerHTML = `
                    <div class="error-state" style="grid-column: 1 / -1;">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>No repositories found</h3>
                        <p>Could not load repositories</p>
                    </div>
                `;
        updateLoadMoreButton();
        return;
    }

    const startIndex = (currentPage - 1) * reposPerPage;
    const endIndex = Math.min(startIndex + reposPerPage, filteredRepos.length);

    let reposHTML = '';

    for (let i = startIndex; i < endIndex; i++) {
        const repo = filteredRepos[i];
        reposHTML += createRepoCardHTML(repo);
    }

    reposContainer.innerHTML = reposHTML;

    document.querySelectorAll('.repo-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const repoIndex = startIndex + index;
            openRepoModal(filteredRepos[repoIndex]);
        });
    });

    updateLoadMoreButton();
}

function loadMoreRepos() {
    const reposContainer = document.getElementById('repos-container');
    const startIndex = (currentPage - 1) * reposPerPage;
    const endIndex = Math.min(startIndex + reposPerPage, filteredRepos.length);

    for (let i = startIndex; i < endIndex; i++) {
        const repo = filteredRepos[i];
        const repoCard = document.createElement('div');
        repoCard.className = 'repo-card';
        repoCard.innerHTML = createRepoCardHTML(repo);
        reposContainer.appendChild(repoCard);

        repoCard.addEventListener('click', () => {
            openRepoModal(repo);
        });
    }

    updateLoadMoreButton();
}

function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('load-more');
    const endIndex = Math.min(currentPage * reposPerPage, filteredRepos.length);
    const remaining = filteredRepos.length - endIndex;

    if (remaining > 0) {
        loadMoreBtn.classList.remove('hidden');
        loadMoreBtn.querySelector('.text').textContent = 'Load More';
        loadMoreBtn.querySelector('.count').textContent = remaining;
        loadMoreBtn.querySelector('i').className = 'fas fa-chevron-down';
    } else {
        loadMoreBtn.classList.add('hidden');
    }
}

function createRepoCardHTML(repo) {
    const description = repo.description ?
        (repo.description.length > 120 ? repo.description.substring(0, 120) + '...' : repo.description) :
        'No description provided';

    const languageColor = getLanguageColor(repo.language);

    const updatedDate = new Date(repo.updated_at);
    const now = new Date();
    const diffTime = Math.abs(now - updatedDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    let updatedText;

    if (diffDays === 0) {
        updatedText = 'Today';
    } else if (diffDays === 1) {
        updatedText = 'Yesterday';
    } else if (diffDays < 7) {
        updatedText = `${diffDays} days ago`;
    } else if (diffDays < 30) {
        updatedText = `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
        updatedText = updatedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    const createdDate = new Date(repo.created_at);
    const createdText = createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

    const sizeInKB = repo.size ? Math.round(repo.size / 1024 * 10) / 10 : 0;
    const sizeText = sizeInKB > 1024 ?
        `${Math.round(sizeInKB / 1024 * 10) / 10} MB` :
        `${sizeInKB} KB`;

    const openIssues = repo.open_issues_count || 0;
    const hasIssues = openIssues > 0;

    const topicsHTML = repo.topics && repo.topics.length > 0 ?
        `<div class="repo-topics">
                    ${repo.topics.slice(0, 3).map(topic => `<span class="repo-topic">${topic}</span>`).join('')}
                    ${repo.topics.length > 3 ? `<span class="repo-topic">+${repo.topics.length - 3}</span>` : ''}
                </div>` : '';

    return `
                <div class="repo-card">
                    <div class="repo-header">
                        <div class="repo-name-container">
                            <div class="repo-name">${repo.name}</div>
                        </div>
                        <span class="repo-visibility">${repo.private ? 'Private' : 'Public'}</span>
                    </div>
                    <p class="repo-desc">${description}</p>
                    
                    ${topicsHTML}
                    
                    <div class="repo-meta">
                        <div class="repo-meta-item" title="Last Updated">
                            <i class="fas fa-calendar"></i>
                            <span>${updatedText}</span>
                        </div>
                        <div class="repo-meta-item" title="Repository Size">
                            <i class="fas fa-database"></i>
                            <span>${sizeText}</span>
                        </div>
                        ${repo.license && repo.license.name ? `
                            <div class="repo-meta-item" title="License">
                                <i class="fas fa-balance-scale"></i>
                                <span>${repo.license.name}</span>
                            </div>
                        ` : ''}
                        ${hasIssues ? `
                            <div class="repo-meta-item" title="Open Issues">
                                <i class="fas fa-exclamation-circle"></i>
                                <span>${openIssues}</span>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="repo-footer">
                        <div class="repo-language">
                            ${repo.language ? `
                                <div class="language-color" style="background-color: ${languageColor}"></div>
                                <span>${repo.language}</span>
                            ` : '<span style="color: var(--gray);">No language Specified</span>'}
                        </div>
                        <div class="repo-stats">
                            <div class="repo-stat" title="Stars">
                                <i class="fas fa-star"></i>
                                <span>${repo.stargazers_count || 0}</span>
                            </div>
                            <div class="repo-stat" title="Forks">
                                <i class="fas fa-code-branch"></i>
                                <span>${repo.forks_count || 0}</span>
                            </div>
                            <div class="repo-stat" title="Watchers">
                                <i class="fas fa-eye"></i>
                                <span>${repo.watchers_count || 0}</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
}

function openRepoModal(repo) {
    const modal = document.getElementById('repo-modal');
    const title = document.getElementById('repo-modal-title');
    const body = document.getElementById('repo-modal-body');
    const link = document.getElementById('repo-modal-link');

    title.textContent = repo.name;
    link.href = repo.html_url;

    const createdDate = new Date(repo.created_at);
    const updatedDate = new Date(repo.updated_at);
    const createdText = createdDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });
    const updatedText = updatedDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long'
    });

    const languageColor = getLanguageColor(repo.language);
    const sizeInKB = repo.size || 0;
    const sizeInMB = (sizeInKB / 1024).toFixed(2);
    const sizeText = sizeInKB > 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`;

    const daysSinceUpdate = Math.floor((new Date() - updatedDate) / (1000 * 60 * 60 * 24));
    const activityLevel = daysSinceUpdate < 7 ? 'High' : daysSinceUpdate < 30 ? 'Medium' : 'Low';

    const topicsHTML = repo.topics && repo.topics.length > 0 ?
        `<div class="modal-topics">
                    <div class="repo-detail-label">
                        <i class="fas fa-tags"></i>
                        Topics
                    </div>
                    ${repo.topics.map(topic => `<span class="modal-topic">${topic}</span>`).join('')}
                </div>` : '';

    body.innerHTML = `
                <div class="repo-details-header">
                    <div class="repo-main-info">
                        <h2 class="repo-name-large">${repo.name}</h2>
                        <span class="repo-visibility-large">${repo.private ? 'Private' : 'Public'} Repository</span>
                    </div>
                </div>
                
                <p class="repo-description">${repo.description || 'No description available for this repository.'}</p>
                
                <div class="repo-stats-grid">
                    <div class="repo-stat-item">
                        <div class="repo-stat-value">${repo.stargazers_count || 0}</div>
                        <div class="repo-stat-label">Stars</div>
                    </div>
                    <div class="repo-stat-item">
                        <div class="repo-stat-value">${repo.forks_count || 0}</div>
                        <div class="repo-stat-label">Forks</div>
                    </div>
                    <div class="repo-stat-item">
                        <div class="repo-stat-value">${repo.watchers_count || 0}</div>
                        <div class="repo-stat-label">Watchers</div>
                    </div>
                    <div class="repo-stat-item">
                        <div class="repo-stat-value">${repo.open_issues_count || 0}</div>
                        <div class="repo-stat-label">Open Issues</div>
                    </div>
                </div>
                
                <div class="repo-details-grid">
                    <div class="repo-detail-item">
                        <div class="repo-detail-label">
                            <i class="fas fa-code"></i>
                            Primary Language
                        </div>
                        <div class="repo-detail-value" style="display: flex; align-items: center; gap: 10px;">
                            <div class="language-color" style="background-color: ${languageColor}; width: 16px; height: 16px;"></div>
                            ${repo.language || 'Not specified'}
                        </div>
                    </div>
                    
                    <div class="repo-detail-item">
                        <div class="repo-detail-label">
                            <i class="fas fa-database"></i>
                            Size
                        </div>
                        <div class="repo-detail-value">${sizeText}</div>
                    </div>
                    
                    <div class="repo-detail-item">
                        <div class="repo-detail-label">
                            <i class="fas fa-calendar-plus"></i>
                            Created
                        </div>
                        <div class="repo-detail-value">${createdText}</div>
                    </div>
                    
                    <div class="repo-detail-item">
                        <div class="repo-detail-label">
                            <i class="fas fa-calendar-check"></i>
                            Last Updated
                        </div>
                        <div class="repo-detail-value">${updatedText}</div>
                    </div>
                    
                    ${repo.license && repo.license.name ? `
                        <div class="repo-detail-item">
                            <div class="repo-detail-label">
                                <i class="fas fa-balance-scale"></i>
                                License
                            </div>
                            <div class="repo-detail-value">${repo.license.name}</div>
                        </div>
                    ` : ''}
                    
                    <div class="repo-detail-item">
                        <div class="repo-detail-label">
                            <i class="fas fa-chart-line"></i>
                            Activity Level
                        </div>
                        <div class="repo-detail-value" style="color: ${activityLevel === 'High' ? 'var(--success)' : activityLevel === 'Medium' ? 'var(--warning)' : 'var(--gray)'}">
                            ${activityLevel}
                        </div>
                    </div>
                    
                    <div class="repo-detail-item">
                        <div class="repo-detail-label">
                            <i class="fas fa-shield-alt"></i>
                            Default Branch
                        </div>
                        <div class="repo-detail-value">${repo.default_branch || 'main'}</div>
                    </div>
                    
                    <div class="repo-detail-item">
                        <div class="repo-detail-label">
                            <i class="fas fa-archive"></i>
                            Archived
                        </div>
                        <div class="repo-detail-value" style="color: ${repo.archived ? 'var(--warning)' : 'var(--success)'}">
                            ${repo.archived ? 'Yes' : 'No'}
                        </div>
                    </div>
                    
                    <div class="repo-detail-item">
                        <div class="repo-detail-label">
                            <i class="fas fa-code-fork"></i>
                            Fork
                        </div>
                        <div class="repo-detail-value" style="color: ${repo.fork ? 'var(--warning)' : 'var(--success)'}">
                            ${repo.fork ? 'Yes' : 'No'}
                        </div>
                    </div>
                </div>
                
                ${topicsHTML}
                
                ${repo.homepage ? `
                    <div class="repo-detail-item" style="margin-top: 20px;">
                        <div class="repo-detail-label">
                            <i class="fas fa-globe"></i>
                            Homepage
                        </div>
                        <a href="${repo.homepage}" target="_blank" style="color: var(--primary-light); text-decoration: none; font-size: 1.1rem;">${repo.homepage}</a>
                    </div>
                ` : ''}
            `;

    modal.classList.add('active');
}

async function openFollowersModal() {
    const modal = document.getElementById('followers-modal');
    const list = document.getElementById('followers-list');

    list.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Loading followers...</p>
                </div>
            `;

    modal.classList.add('active');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/followers`);
        const followers = await response.json();

        if (!followers || followers.length === 0) {
            list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--gray);">No followers yet</div>';
            return;
        }

        let followersHTML = '';
        followers.forEach(follower => {
            followersHTML += `
                        <div class="follower-item">
                            <div class="follower-avatar">
                                <img src="${follower.avatar_url}" alt="${follower.login}">
                            </div>
                            <div class="follower-info">
                                <div class="follower-name">${follower.login}</div>
                                <div class="follower-username">@${follower.login}</div>
                            </div>
                            <a href="https://github.com/${follower.login}" target="_blank" class="follower-btn"><i class="fas fa-external-link-alt"></i> View </a>
                        </div>
                    `;
        });

        list.innerHTML = followersHTML;
    } catch (error) {
        console.error('Error loading followers:', error);
        list.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--gray);">Failed to load followers</div>';
    }
}

function updateAnalytics() {
    const languages = {};
    allRepos.forEach(repo => {
        if (repo.language) {
            languages[repo.language] = (languages[repo.language] || 0) + 1;
        }
    });

    const topLanguages = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const languageList = document.getElementById('language-list');
    if (topLanguages.length > 0) {
        let languageHTML = '';
        topLanguages.forEach(([lang, count]) => {
            const percentage = Math.round((count / allRepos.length) * 100);
            const color = getLanguageColor(lang);

            languageHTML += `
                        <div class="language-item">
                            <div style="display: flex; align-items: center; gap: 8px; min-width: 100px;">
                                <div class="language-color" style="background-color: ${color}; width: 12px; height: 12px;"></div>
                                <span style="font-size: 0.9rem;">${lang}</span>
                            </div>
                            <div class="language-bar">
                                <div class="language-fill" style="width: ${percentage}%; background: ${color}"></div>
                            </div>
                            <span style="min-width: 40px; text-align: right; font-size: 0.85rem; font-weight: 600;">${percentage}%</span>
                        </div>
                    `;
        });
        languageList.innerHTML = languageHTML;
    } else {
        languageList.innerHTML = '<div style="color: var(--gray); font-size: 0.9rem; text-align: center; padding: 20px;">No language data available</div>';
    }

    const repoStats = document.getElementById('repo-stats');
    const avgStars = allRepos.length > 0 ?
        (allRepos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0) / allRepos.length).toFixed(1) : 0;
    const avgForks = allRepos.length > 0 ?
        (allRepos.reduce((sum, repo) => sum + (repo.forks_count || 0), 0) / allRepos.length).toFixed(1) : 0;
    const avgSize = allRepos.length > 0 ?
        (allRepos.reduce((sum, repo) => sum + (repo.size || 0), 0) / allRepos.length).toFixed(0) : 0;
    const totalIssues = allRepos.reduce((sum, repo) => sum + (repo.open_issues_count || 0), 0);

    repoStats.innerHTML = `
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                        <div style="color: var(--gray); font-size: 0.85rem; margin-bottom: 5px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-code-branch" style="color: var(--primary-light);"></i>
                            <span>Total Repos</span>
                        </div>
                        <div style="font-weight: 700; font-size: 1.5rem; color: var(--light);">${allRepos.length}</div>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                        <div style="color: var(--gray); font-size: 0.85rem; margin-bottom: 5px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-star" style="color: var(--primary-light);"></i>
                            <span>Avg Stars</span>
                        </div>
                        <div style="font-weight: 700; font-size: 1.5rem; color: var(--light);">${avgStars}</div>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                        <div style="color: var(--gray); font-size: 0.85rem; margin-bottom: 5px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-code-branch" style="color: var(--primary-light);"></i>
                            <span>Avg Forks</span>
                        </div>
                        <div style="font-weight: 700; font-size: 1.5rem; color: var(--light);">${avgForks}</div>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px;">
                        <div style="color: var(--gray); font-size: 0.85rem; margin-bottom: 5px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-database" style="color: var(--primary-light);"></i>
                            <span>Avg Size</span>
                        </div>
                        <div style="font-weight: 700; font-size: 1.5rem; color: var(--light);">${avgSize} KB</div>
                    </div>
                    <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 8px; grid-column: 1 / -1;">
                        <div style="color: var(--gray); font-size: 0.85rem; margin-bottom: 5px; display: flex; align-items: center; gap: 8px;">
                            <i class="fas fa-exclamation-circle" style="color: var(--primary-light);"></i>
                            <span>Total Open Issues</span>
                        </div>
                        <div style="font-weight: 700; font-size: 1.5rem; color: var(--light);">${totalIssues}</div>
                    </div>
                </div>
            `;
}

function setupEventListeners() {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            applyFilter(filter);
        });
    });

    let searchTimeout;
    document.getElementById('repo-search').addEventListener('input', (e) => {
        clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            const searchTerm = e.target.value.toLowerCase().trim();

            if (searchTerm === '') {
                filteredRepos = [...allRepos];
            } else {
                filteredRepos = allRepos.filter(repo =>
                    repo.name.toLowerCase().includes(searchTerm) ||
                    (repo.description && repo.description.toLowerCase().includes(searchTerm)) ||
                    (repo.topics && repo.topics.some(topic => topic.toLowerCase().includes(searchTerm)))
                );
            }

            currentPage = 1;
            displayReposPage();
        }, 300);
    });

    const loadMoreBtn = document.getElementById('load-more');
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        loadMoreRepos();
    });

    document.getElementById('followers-stat').addEventListener('click', openFollowersModal);

    document.getElementById('repo-modal-close').addEventListener('click', () => {
        document.getElementById('repo-modal').classList.remove('active');
    });

    document.getElementById('repo-modal-close-btn').addEventListener('click', () => {
        document.getElementById('repo-modal').classList.remove('active');
    });

    document.getElementById('followers-modal-close').addEventListener('click', () => {
        document.getElementById('followers-modal').classList.remove('active');
    });

    document.getElementById('followers-modal-close-btn').addEventListener('click', () => {
        document.getElementById('followers-modal').classList.remove('active');
    });

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

function applyFilter(filter) {
    filteredRepos = [...allRepos];

    switch (filter) {
        case 'stars':
            filteredRepos.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));
            break;
        case 'updated':
            filteredRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            break;
        case 'all':
        default:
            filteredRepos.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            break;
    }

    currentPage = 1;
    displayReposPage();
}

function getLanguageColor(language) {
    if (!language) return '#8b5cf6';

    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C#': '#178600',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'CSS': '#563d7c',
        'HTML': '#e34c26',
        'Go': '#00ADD8',
        'Shell': '#89e051',
        'Vue': '#2c3e50',
        'React': '#61dafb',
        'Swift': '#ffac45'
    };

    return colors[language] || '#8b5cf6';
}

function showError(message) {
    const reposContainer = document.getElementById('repos-container');
    reposContainer.innerHTML = `
                <div class="error-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>Something went wrong</h3>
                    <p>${message}</p>
                    <button class="retry-btn" onclick="location.reload()">
                        <i class="fas fa-redo"></i> Retry
                    </button>
                </div>
            `;
}

