# Contributing to EduAssist

## 🤝 Welcome Contributors!

We welcome contributions from everyone to the EduAssist project! Whether you're a developer, teacher, administrator, or someone interested in educational technology, you can help improve this project.

## 🎯 Ways to Contribute

### 1. Developers
- **Develop new features**
- **Fix bugs and issues**
- **Improve performance and code quality**
- **Write tests**
- **Improve technical documentation**

### 2. Teachers and Administrators
- **Test the extension and report issues**
- **Suggest new features**
- **Improve user interface**
- **Write user guides**
- **Translate content**

### 3. Designers
- **Improve design and icons**
- **Enhance user experience**
- **Create marketing materials**
- **Design logos and branding**

## 📋 Contribution Steps

### 1. Fork the Project
```bash
# Go to GitHub and fork the project
# or use GitHub CLI
gh repo fork MAHDI-AQ/eduassist
```

### 2. Clone Locally
```bash
git clone https://github.com/your-username/eduassist.git
cd eduassist
```

### 3. Create a New Branch
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 4. Make Your Changes
- Follow the coding standards below
- Test your changes thoroughly
- Add documentation if needed

### 5. Commit Your Changes
```bash
git add .
git commit -m "Add: descriptive commit message"
```

### 6. Push to Your Fork
```bash
git push origin feature/your-feature-name
```

### 7. Create Pull Request
- Go to GitHub and create a pull request
- Describe your changes clearly
- Link related issues if any

## � Coding Standards

### JavaScript
- Use ES6+ features
- Follow camelCase naming convention
- Add JSDoc comments for functions
- Keep functions small and focused
- Use async/await for asynchronous operations

### HTML
- Use semantic HTML5 elements
- Include proper accessibility attributes
- Follow responsive design principles
- Validate HTML markup

### CSS
- Use BEM methodology for class naming
- Mobile-first responsive design
- Use CSS custom properties for theming
- Minimize use of !important

### File Structure
```
src/
├── background/        # Background scripts
├── content/          # Content scripts
├── popup/            # Popup interface
├── features/         # Feature-specific modules
└── utils/            # Utility functions
```

## 🧪 Testing

### Manual Testing
1. Load extension in Chrome developer mode
2. Test all features in both Madrasati and Noor systems
3. Verify popup functionality
4. Check console for errors

### Code Review Checklist
- [ ] Code follows project standards
- [ ] No console errors
- [ ] Responsive design works
- [ ] Arabic and English UI support
- [ ] Performance impact is minimal

## 📚 Documentation

### Required Documentation
- Update README.md if adding new features
- Add JSDoc comments to new functions
- Update user guides for new functionality
- Include examples in code comments

### Documentation Style
- Clear and concise language
- Include code examples
- Use proper markdown formatting
- Add screenshots for UI changes

## 🐛 Issue Reporting

### Bug Reports
Include the following information:
- **Browser version and OS**
- **Extension version**
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots or console errors**

### Feature Requests
Include the following information:
- **Problem description**
- **Proposed solution**
- **Alternative solutions considered**
- **Additional context**

## 🏷️ Commit Message Guidelines

### Format
```
Type: Brief description

Optional detailed description
```

### Types
- **Add:** New feature or functionality
- **Fix:** Bug fix
- **Update:** Existing feature improvement
- **Remove:** Deletion of code/feature
- **Style:** Code formatting changes
- **Docs:** Documentation changes
- **Test:** Adding or updating tests
- **Refactor:** Code restructuring

### Examples
```bash
Add: bulk student grade export feature
Fix: popup not opening in Chrome 120+
Update: improve Noor system detection
Docs: add installation guide for Edge browser
```

## � Release Process

### Version Numbering
We follow semantic versioning (SemVer):
- **Major (1.0.0):** Breaking changes
- **Minor (0.1.0):** New features
- **Patch (0.0.1):** Bug fixes

### Release Steps
1. Update version in manifest.json
2. Update CHANGELOG.md
3. Create release tag
4. Publish to Chrome Web Store (when ready)

## 🤝 Community Guidelines

### Be Respectful
- Use inclusive language
- Respect different perspectives
- Provide constructive feedback
- Help newcomers

### Communication
- Be clear and concise
- Ask questions if unclear
- Share knowledge and resources
- Collaborate openly

## � Getting Help

### Resources
- **GitHub Issues:** [Report bugs or request features](https://github.com/MAHDI-AQ/eduassist/issues)
- **Discussions:** [Community discussions](https://github.com/MAHDI-AQ/eduassist/discussions)
- **Wiki:** [Technical documentation](https://github.com/MAHDI-AQ/eduassist/wiki)

### Contact
- **Project Maintainer:** [@MAHDI-AQ](https://github.com/MAHDI-AQ)
- **Email:** For sensitive issues only

## 🏆 Recognition

Contributors will be recognized:
- Listed in README.md contributors section
- Mentioned in release notes
- GitHub contributor badge
- Community appreciation

## 📄 License

By contributing to EduAssist, you agree that your contributions will be licensed under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0).

---

**Thank you for contributing to EduAssist! Together, we're making education technology better for everyone.** 🎓✨