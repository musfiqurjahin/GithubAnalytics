# GitHub Portfolio Dashboard

A fully responsive, interactive GitHub portfolio dashboard that displays your GitHub profile information, repositories, and statistics in a beautiful dark-themed interface.

![GitHub Portfolio Dashboard](https://img.shields.io/badge/GitHub-Portfolio_Dashboard-blue)
![License](https://img.shields.io/badge/License-MIT-green)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-Latest-orange)
![CSS3](https://img.shields.io/badge/CSS3-Latest-blue)

## 🌟 Features

### 🔥 Core Features
- **Real-time GitHub Data**: Fetches live data from GitHub API
- **Verified Badge Display**: Professional verified badge next to your name
- **Actual GitHub Streak**: Shows real contribution streak using GitHub Events API
- **Interactive Repository Browser**: Filter, search, and browse repositories
- **Detailed Analytics**: Language breakdown, repository statistics, and more

### 📊 Statistics Display
- **Total Repositories**: Count of all public repositories
- **GitHub Streak**: Current contribution streak with visual calendar
- **Total Stars**: Sum of stars across all repositories
- **Followers Count**: Number of followers with interactive modal
- **Total Contributions**: Estimated contribution count
- **Lines of Code**: Estimated total lines of code

### 🎨 UI/UX Features
- **Dark Theme**: Modern dark interface with blue accent colors
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Interactive Modals**: 
  - Repository details modal
  - Followers list modal
- **Smooth Animations**: CSS animations and transitions
- **Search & Filter**: Filter repositories by stars, update date, or search by name

### 🔧 Technical Features
- **No Backend Required**: Pure frontend implementation
- **GitHub API Integration**: Uses official GitHub REST API
- **CORS Compatible**: Works with GitHub's CORS policies
- **Performance Optimized**: Lazy loading for repositories

## 🚀 Quick Start

### Method 1: Direct Usage
Simply open the `index.html` file in your browser!

### Method 2: Deploy to GitHub Pages
1. Fork this repository
2. Go to repository Settings → Pages
3. Select source: `main` branch
4. Save and visit your GitHub Pages URL

### Method 3: Custom Deployment
1. Clone the repository:
```bash
git clone https://github.com/yourusername/github-portfolio-dashboard.git
cd github-portfolio-dashboard
```

2. Open `index.html` in your browser or serve it using a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

## ⚙️ Configuration

### Change GitHub Username
Edit the `username` variable in the JavaScript section (line ~1290):
```javascript
const username = 'your-github-username'; // Change this
```

### Customize Colors
Modify the CSS variables in the `:root` selector (line ~15):
```css
:root {
    --primary: #2563eb;      /* Primary blue color */
    --primary-light: #3b82f6; /* Lighter blue */
    --dark: #0f172a;         /* Dark background */
    --dark-card: #1e293b;    /* Card background */
    --light: #f8fafc;        /* Light text */
    --gray: #94a3b8;         /* Gray text */
    --success: #10b981;      /* Success color */
    --warning: #f59e0b;      /* Warning color */
    --verified: #1DA1F2;     /* Verified badge color */
}
```

### Customize Streak Visualization
Update the streak image URL (line ~275):
```html
<img src="https://camo.githubusercontent.com/...your-streak-image-url..." 
     alt="GitHub Streak Stats">
```

## 📁 Project Structure

```
github-portfolio-dashboard/
│
├── index.html              # Main HTML file
│
├── CSS Features:
│   ├── Responsive grid layouts
│   ├── Dark theme with custom colors
│   ├── Smooth animations and transitions
│   ├── Modal styling
│   └── Mobile-friendly design
│
├── JavaScript Modules:
│   ├── GitHub API integration
│   ├── Streak calculation logic
│   ├── Repository filtering/search
│   ├── Modal management
│   └── Event handling
│
└── External Dependencies:
    ├── Font Awesome Icons
    ├── GitHub REST API
    └── GitHub Readme Streak Stats
```

## 🔌 API Integration

### GitHub API Endpoints Used
- `https://api.github.com/users/{username}` - User profile data
- `https://api.github.com/users/{username}/repos` - Repository list
- `https://api.github.com/users/{username}/events` - Activity events (for streak)
- `https://api.github.com/users/{username}/followers` - Followers list

### Rate Limiting
- Uses public GitHub API (60 requests per hour unauthenticated)
- Consider adding a GitHub Personal Access Token for higher limits
- Cached data to reduce API calls

## 🎯 Features in Detail

### 1. Streak Calculation
The dashboard calculates your actual GitHub streak using:
- **Primary Method**: GitHub Events API to analyze daily contributions
- **Fallback Method**: Repository update patterns
- **Visual Display**: GitHub Readme Streak Stats image integration

### 2. Repository Management
- **Pagination**: Load more repositories with animated button
- **Search**: Real-time repository search
- **Filtering**: Sort by stars, recent updates, or all
- **Details Modal**: Click any repo for detailed view

### 3. Analytics Dashboard
- **Language Distribution**: Visual percentage breakdown
- **Repository Stats**: Averages and totals
- **Contribution Metrics**: Estimated contributions and code volume

### 4. Interactive Elements
- **Clickable Stats Cards**: Followers card opens modal
- **Tab Navigation**: Switch between repositories and analytics
- **Hover Effects**: Interactive hover states
- **Loading States**: Smooth loading animations

## 🛠️ Customization Options

### Change Theme
1. **Light Theme**: Modify `--dark` and `--dark-card` variables to lighter colors
2. **Custom Colors**: Update all CSS variables to match your brand
3. **Accent Colors**: Change `--primary` for different accent colors

### Add More Stats
Extend the `updateStatsUI()` function to add:
- Commit count
- Pull request statistics
- Issue tracking
- Repository topics

### Enhance Analytics
Add more analytics cards by:
1. Creating new card HTML in analytics section
2. Adding data fetching logic
3. Implementing visualization

## 📱 Responsive Breakpoints

```css
/* Mobile: < 768px */
@media (max-width: 768px) {
    /* Stack profile header */
    /* Single column repository grid */
    /* Full-width search box */
}

/* Tablet: 768px - 1024px */
/* Default styles work well */

/* Desktop: > 1024px */
/* Multi-column layouts */
/* Fixed sidebars if added */
```

## 🔒 Privacy & Security

- **No Data Storage**: All data is fetched live, not stored
- **Public Data Only**: Only accesses publicly available GitHub data
- **No Authentication Required**: Works without GitHub tokens (optional for rate limits)
- **CORS Safe**: Uses browser-safe API calls

## 🚨 Limitations & Known Issues

1. **Rate Limiting**: Unauthenticated API calls limited to 60/hour
2. **Streak Accuracy**: Streak calculation depends on GitHub event data availability
3. **First Load Speed**: May be slow with many repositories
4. **Image Loading**: Streak image from external service may have loading delays

## 🚀 Performance Optimization Tips

1. **Add Caching**: Implement localStorage caching for API responses
2. **Add Pagination**: Reduce initial repository load count
3. **Lazy Load Images**: Implement lazy loading for avatars
4. **Minify Assets**: Minify CSS and JavaScript for production

## 🤝 Contributing

Contributions are welcome! Here's how:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Areas for Contribution
- Additional analytics visualizations
- Performance optimizations
- Theme customization options
- Accessibility improvements
- Mobile UX enhancements

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [GitHub REST API](https://docs.github.com/en/rest) for data
- [Font Awesome](https://fontawesome.com/) for icons
- [GitHub Readme Streak Stats](https://github.com/DenverCoder1/github-readme-streak-stats) for streak visualization
- All contributors and users of this dashboard

## 📞 Support

For support, questions, or feature requests:
1. Open an issue on GitHub
2. Check existing issues for solutions
3. Star the repository if you find it useful!

## 🔮 Future Enhancements

Planned features for future versions:
- [ ] Multiple theme support
- [ ] Export data as PDF/PNG
- [ ] Comparison with other users
- [ ] Contribution heatmap calendar
- [ ] Repository tagging system
- [ ] Weekly/Monthly statistics
- [ ] Offline mode with cached data

---

**Made with ❤️ by [Musfiqur Jahin](https://github.com/musfiqurjahin)**

If you find this project helpful, please consider giving it a ⭐ on GitHub!
