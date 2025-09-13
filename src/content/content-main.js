/* EduAssist - Free Educational Assistant Extension
 * Copyright 2025 - Open Source Project
 * Made with ❤️ for Saudi Educational Community
 * Designed for Saudi Educational Platforms
 */

// Extension initialization
console.log('🎓 EduAssist Extension Loaded - Free Educational Assistant');

// Core functionality controller
class EduAssist {
    constructor() {
        this.isInitialized = false;
        this.currentPlatform = this.detectPlatform();
        this.features = {};
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log(`🎯 EduAssist: Initializing on ${this.currentPlatform}`);
        this.loadCSS();
        this.injectMainInterface();
        this.initializePlatformFeatures();
        this.isInitialized = true;
        
        // Show welcome message (like they did, but better)
        this.showWelcome();
    }

    detectPlatform() {
        const hostname = window.location.hostname;
        if (hostname.includes('madrasati.sa')) return 'madrasati';
        if (hostname.includes('moe.gov.sa') || hostname.includes('noor')) return 'noor';
        return 'unknown';
    }

    loadCSS() {
        const cssFile = chrome.runtime.getURL('assets/css/content-styles.css');
        if (!document.querySelector(`link[href="${cssFile}"]`)) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = cssFile;
            document.head.appendChild(link);
        }
    }

    injectMainInterface() {
        // Remove any existing interface
        const existing = document.getElementById('eduassist-interface');
        if (existing) existing.remove();

        // Create main interface container (similar to their approach but cleaner)
        const interfaceHTML = `
            <div id="eduassist-interface" style="display: none;">
                <div class="eduassist-modal">
                    <div class="eduassist-header">
                        <h2>🎓 EduAssist - المساعد التعليمي المجاني</h2>
                        <button class="eduassist-close" onclick="EduAssist.hideInterface()">✕</button>
                    </div>
                    <div class="eduassist-content">
                        <div id="eduassist-loading" class="text-center">
                            <div class="spinner"></div>
                            <p>جاري تحميل الأدوات التعليمية...</p>
                        </div>
                        <div id="eduassist-features" style="display: none;">
                            ${this.generateFeaturesHTML()}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', interfaceHTML);
    }

    generateFeaturesHTML() {
        const features = this.getPlatformFeatures();
        let html = '<div class="eduassist-tabs">';
        
        // Generate tabs for different feature categories
        const categories = ['students', 'teachers', 'reports', 'tools'];
        categories.forEach(category => {
            html += `
                <button class="eduassist-tab" data-category="${category}">
                    ${this.getCategoryTitle(category)}
                </button>
            `;
        });
        
        html += '</div><div class="eduassist-features-grid">';
        
        // Generate feature buttons
        features.forEach(feature => {
            html += `
                <button class="eduassist-feature-btn" data-feature="${feature.id}">
                    <i class="${feature.icon}"></i>
                    <span class="feature-title">${feature.title}</span>
                    <small class="feature-desc">${feature.description}</small>
                </button>
            `;
        });
        
        html += '</div>';
        return html;
    }

    getPlatformFeatures() {
        // Similar features to the original but organized better
        const commonFeatures = [
            {
                id: 'attendance-tracker',
                title: 'تتبع الحضور',
                description: 'رصد حضور وغياب الطلاب',
                icon: 'fas fa-check-square',
                category: 'students'
            },
            {
                id: 'grade-reports',
                title: 'تقارير الدرجات',
                description: 'إنشاء وتصدير تقارير الدرجات',
                icon: 'fas fa-chart-bar',
                category: 'reports'
            },
            {
                id: 'student-data-export',
                title: 'تصدير بيانات الطلاب',
                description: 'تصدير بيانات الطلاب إلى Excel',
                icon: 'fas fa-download',
                category: 'tools'
            },
            {
                id: 'lesson-tracker',
                title: 'متابعة الدروس',
                description: 'تتبع تحضير الدروس للمعلمين',
                icon: 'fas fa-book',
                category: 'teachers'
            },
            {
                id: 'bulk-operations',
                title: 'العمليات المجمعة',
                description: 'تنفيذ عمليات متعددة على الطلاب',
                icon: 'fas fa-users',
                category: 'tools'
            }
        ];

        // Add platform-specific features
        if (this.currentPlatform === 'madrasati') {
            commonFeatures.push({
                id: 'madrasati-import',
                title: 'استيراد من مدرستي',
                description: 'استيراد بيانات الطلاب من منصة مدرستي',
                icon: 'fas fa-upload',
                category: 'tools'
            });
        }

        if (this.currentPlatform === 'noor') {
            commonFeatures.push({
                id: 'noor-sync',
                title: 'مزامنة نور',
                description: 'مزامنة البيانات مع نظام نور',
                icon: 'fas fa-sync',
                category: 'tools'
            });
        }

        return commonFeatures;
    }

    getCategoryTitle(category) {
        const titles = {
            'students': '👥 الطلاب',
            'teachers': '👨‍🏫 المعلمين',
            'reports': '📊 التقارير',
            'tools': '🛠️ الأدوات'
        };
        return titles[category] || category;
    }

    initializePlatformFeatures() {
        // Initialize features based on current platform
        this.loadPlatformScript();
        this.bindEventListeners();
    }

    loadPlatformScript() {
        // Load platform-specific functionality (like they did with remote scripts)
        const scriptUrl = chrome.runtime.getURL(`src/features/${this.currentPlatform}.js`);
        const script = document.createElement('script');
        script.src = scriptUrl;
        script.onload = () => {
            console.log(`✅ ${this.currentPlatform} features loaded`);
            this.hideLoading();
        };
        document.head.appendChild(script);
    }

    bindEventListeners() {
        // Bind feature button clicks
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('eduassist-feature-btn') || 
                e.target.closest('.eduassist-feature-btn')) {
                const btn = e.target.closest('.eduassist-feature-btn');
                const featureId = btn.dataset.feature;
                this.executeFeature(featureId);
            }
        });

        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('eduassist-tab')) {
                this.switchTab(e.target.dataset.category);
            }
        });
    }

    executeFeature(featureId) {
        console.log(`🚀 Executing feature: ${featureId}`);
        
        // Show loading state
        this.showFeatureLoading(featureId);
        
        // Execute feature based on ID
        switch(featureId) {
            case 'attendance-tracker':
                this.startAttendanceTracker();
                break;
            case 'grade-reports':
                this.generateGradeReports();
                break;
            case 'student-data-export':
                this.exportStudentData();
                break;
            case 'lesson-tracker':
                this.trackLessons();
                break;
            case 'bulk-operations':
                this.showBulkOperations();
                break;
            default:
                console.log(`Feature ${featureId} not implemented yet`);
        }
    }

    // Feature implementations (stubs for now)
    startAttendanceTracker() {
        console.log('📝 Starting attendance tracker...');
        // Implementation will be added in platform-specific files
    }

    generateGradeReports() {
        console.log('📊 Generating grade reports...');
        // Implementation will be added
    }

    exportStudentData() {
        console.log('💾 Exporting student data...');
        // Implementation will be added
    }

    trackLessons() {
        console.log('📚 Tracking lessons...');
        // Implementation will be added
    }

    showBulkOperations() {
        console.log('⚡ Showing bulk operations...');
        // Implementation will be added
    }

    // UI Helper methods
    showWelcome() {
        // Show a subtle welcome notification
        const welcome = document.createElement('div');
        welcome.className = 'eduassist-welcome';
        welcome.innerHTML = `
            <div class="welcome-content">
                <strong>🎓 EduAssist</strong> - المساعد التعليمي المجاني
                <button onclick="EduAssist.showInterface()">فتح الأدوات</button>
                <button onclick="this.parentElement.parentElement.remove()">✕</button>
            </div>
        `;
        document.body.appendChild(welcome);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (welcome.parentElement) {
                welcome.remove();
            }
        }, 5000);
    }

    showInterface() {
        const interface = document.getElementById('eduassist-interface');
        if (interface) {
            interface.style.display = 'flex';
        }
    }

    hideInterface() {
        const interface = document.getElementById('eduassist-interface');
        if (interface) {
            interface.style.display = 'none';
        }
    }

    hideLoading() {
        const loading = document.getElementById('eduassist-loading');
        const features = document.getElementById('eduassist-features');
        if (loading) loading.style.display = 'none';
        if (features) features.style.display = 'block';
    }

    showFeatureLoading(featureId) {
        console.log(`⏳ Loading feature: ${featureId}`);
        // Show loading state for specific feature
    }

    switchTab(category) {
        // Remove active class from all tabs
        document.querySelectorAll('.eduassist-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Add active class to clicked tab
        document.querySelector(`[data-category="${category}"]`).classList.add('active');
        
        // Show/hide features based on category
        document.querySelectorAll('.eduassist-feature-btn').forEach(btn => {
            const feature = this.getPlatformFeatures().find(f => f.id === btn.dataset.feature);
            if (feature && feature.category === category) {
                btn.style.display = 'block';
            } else {
                btn.style.display = 'none';
            }
        });
    }
}

// Global instance (similar to how they did it)
window.EduAssist = new EduAssist();

// Storage helper functions (similar to their approach)
window.eduAssistStorage = {
    set: function(key, value) {
        return new Promise((resolve) => {
            chrome.storage.local.set({[key]: value}, () => {
                console.log(`💾 Stored: ${key}`);
                resolve();
            });
        });
    },
    
    get: function(key) {
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                resolve(result[key]);
            });
        });
    }
};

// Expose methods globally for HTML onclick handlers
window.EduAssist.showInterface = window.EduAssist.showInterface.bind(window.EduAssist);
window.EduAssist.hideInterface = window.EduAssist.hideInterface.bind(window.EduAssist);