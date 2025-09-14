// EduAssist Popup Script
// Handles the extension popup interface

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎓 EduAssist Popup Loaded');
    
    // Initialize popup
    initializePopup();
    bindEventListeners();
    loadCurrentState();
});

function initializePopup() {
    // Set version number
    const versionBadge = document.querySelector('.version-badge');
    if (versionBadge) {
        const manifest = chrome.runtime.getManifest();
        versionBadge.textContent = `v${manifest.version}`;
    }
    
    // Initialize settings
    loadSettings();
}

function bindEventListeners() {
    // Tab navigation
    document.querySelectorAll('.tab-btn').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Quick action buttons
    document.getElementById('export-data')?.addEventListener('click', exportData);
    document.getElementById('backup-settings')?.addEventListener('click', exportSettings);
    document.getElementById('help-guide')?.addEventListener('click', showHelp);

    // Settings checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveSetting(this.id, this.checked);
        });
    });

    // Settings buttons
    document.getElementById('clear-cache')?.addEventListener('click', clearCache);
    document.getElementById('export-settings')?.addEventListener('click', exportSettings);
    document.getElementById('reset-settings')?.addEventListener('click', resetSettings);

    // Social links
    document.querySelectorAll('.social-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.classList.contains('github')) {
                chrome.tabs.create({ url: 'https://github.com/MAHDI-AQ/eduassist' });
            } else if (this.classList.contains('docs')) {
                chrome.tabs.create({ url: 'https://github.com/MAHDI-AQ/eduassist/wiki' });
            } else if (this.classList.contains('support')) {
                chrome.tabs.create({ url: 'https://github.com/MAHDI-AQ/eduassist/issues' });
            }
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    // Add active class to selected tab and content
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.getElementById(`${tabName}-tab`).classList.add('active');
}

async function loadCurrentState() {
    try {
        // Get current tab to detect platform
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        const platform = detectPlatformFromUrl(tab.url);
        
        // Update platform display
        const platformElement = document.getElementById('current-platform');
        if (platformElement) {
            platformElement.textContent = getPlatformDisplayName(platform);
        }
        
        // Update status based on current platform
        updateConnectionStatus(platform);
        
        // Show/hide platform-specific content
        updatePlatformContent(platform);
        
        // Update platform cards status
        updatePlatformCards(platform);
        
        // Update recent activity based on platform
        updateRecentActivity(platform);
        
    } catch (error) {
        console.error('Error loading current state:', error);
    }
}

function detectPlatformFromUrl(url) {
    if (!url) return 'unknown';
    
    if (url.includes('madrasati.sa')) return 'madrasati';
    if (url.includes('moe.gov.sa') || url.includes('noor')) return 'noor';
    return 'unknown';
}

function getPlatformDisplayName(platform) {
    const names = {
        'madrasati': 'منصة مدرستي',
        'noor': 'نظام نور',
        'unknown': 'غير محدد'
    };
    return names[platform] || 'غير معروف';
}

async function openInterface() {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        // Execute script to show interface
        await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                if (window.EduAssist) {
                    window.EduAssist.showInterface();
                } else {
                    alert('يرجى تحديث الصفحة لتفعيل EduAssist');
                }
            }
        });
        
        // Close popup
        window.close();
        
    } catch (error) {
        console.error('Error opening interface:', error);
        showNotification('خطأ في فتح الواجهة', 'error');
    }
}

async function exportData() {
    try {
        // Get stored data
        const data = await chrome.storage.local.get(null);
        
        // Create export object
        const exportData = {
            timestamp: new Date().toISOString(),
            version: chrome.runtime.getManifest().version,
            data: data
        };
        
        // Create download
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        // Download file
        const a = document.createElement('a');
        a.href = url;
        a.download = `eduassist-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('تم تصدير البيانات بنجاح', 'success');
        
    } catch (error) {
        console.error('Error exporting data:', error);
        showNotification('خطأ في تصدير البيانات', 'error');
    }
}

async function syncData() {
    try {
        showNotification('جاري مزامنة البيانات...', 'info');
        
        // Simulate sync process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        showNotification('تم مزامنة البيانات بنجاح', 'success');
        
    } catch (error) {
        console.error('Error syncing data:', error);
        showNotification('خطأ في مزامنة البيانات', 'error');
    }
}

function showHelp() {
    chrome.tabs.create({ url: 'https://github.com/MAHDI-AQ/eduassist/wiki' });
}

async function loadSettings() {
    try {
        const settings = await chrome.storage.sync.get({
            'auto-detect': true,
            'notifications': true,
            'dark-mode': false,
            'auto-backup': true,
            'data-sync': false
        });
        
        // Apply settings to checkboxes
        Object.keys(settings).forEach(key => {
            const checkbox = document.getElementById(key);
            if (checkbox) {
                checkbox.checked = settings[key];
            }
        });
        
        // Apply dark mode if enabled
        if (settings['dark-mode']) {
            document.body.classList.add('dark-mode');
        }
        
    } catch (error) {
        console.error('Error loading settings:', error);
    }
}

async function saveSetting(key, value) {
    try {
        await chrome.storage.sync.set({ [key]: value });
        
        // Apply special settings immediately
        if (key === 'dark-mode') {
            document.body.classList.toggle('dark-mode', value);
        }
        
        console.log(`Setting saved: ${key} = ${value}`);
        
    } catch (error) {
        console.error('Error saving setting:', error);
    }
}

async function clearCache() {
    if (confirm('هل أنت متأكد من مسح جميع البيانات المحفوظة؟')) {
        try {
            await chrome.storage.local.clear();
            showNotification('تم مسح الذاكرة المؤقتة بنجاح', 'success');
        } catch (error) {
            console.error('Error clearing cache:', error);
            showNotification('خطأ في مسح الذاكرة المؤقتة', 'error');
        }
    }
}

async function exportSettings() {
    try {
        const settings = await chrome.storage.sync.get(null);
        
        const exportData = {
            timestamp: new Date().toISOString(),
            version: chrome.runtime.getManifest().version,
            settings: settings
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `eduassist-settings-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('تم تصدير الإعدادات بنجاح', 'success');
        
    } catch (error) {
        console.error('Error exporting settings:', error);
        showNotification('خطأ في تصدير الإعدادات', 'error');
    }
}

function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (data.settings) {
                await chrome.storage.sync.set(data.settings);
                showNotification('تم استيراد الإعدادات بنجاح', 'success');
                
                // Reload settings
                setTimeout(() => {
                    loadSettings();
                }, 1000);
            } else {
                showNotification('ملف الإعدادات غير صحيح', 'error');
            }
            
        } catch (error) {
            console.error('Error importing settings:', error);
            showNotification('خطأ في استيراد الإعدادات', 'error');
        }
    };
    
    input.click();
}

async function resetSettings() {
    if (confirm('هل أنت متأكد من إعادة تعيين جميع الإعدادات؟')) {
        try {
            await chrome.storage.sync.clear();
            showNotification('تم إعادة تعيين الإعدادات بنجاح', 'success');
            
            // Reload settings with defaults
            setTimeout(() => {
                loadSettings();
            }, 1000);
        } catch (error) {
            console.error('Error resetting settings:', error);
            showNotification('خطأ في إعادة تعيين الإعدادات', 'error');
        }
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function updateConnectionStatus(platform) {
    const statusElement = document.getElementById('connection-status');
    if (statusElement) {
        if (platform !== 'unknown') {
            statusElement.textContent = 'متصل';
            statusElement.style.color = '#28a745';
        } else {
            statusElement.textContent = 'في انتظار المنصة';
            statusElement.style.color = '#ffc107';
        }
    }
}

function updatePlatformContent(platform) {
    const platformSection = document.querySelector('.platform-section');
    const quickActions = document.querySelector('.quick-actions');
    const recentActivity = document.querySelector('.recent-activity');
    
    if (platform === 'unknown') {
        // Hide platform-specific content when not on supported platforms
        if (platformSection) {
            platformSection.style.display = 'none';
        }
        if (quickActions) {
            quickActions.querySelector('h3').textContent = 'إجراءات عامة';
            // Hide export and backup buttons, keep help only
            const exportBtn = document.getElementById('export-data');
            const backupBtn = document.getElementById('backup-settings');
            if (exportBtn) exportBtn.style.display = 'none';
            if (backupBtn) backupBtn.style.display = 'none';
        }
        if (recentActivity) {
            recentActivity.style.display = 'none';
        }
        
        // Show platform detection message
        showPlatformDetectionMessage();
    } else {
        // Show platform-specific content
        if (platformSection) {
            platformSection.style.display = 'block';
        }
        if (quickActions) {
            quickActions.querySelector('h3').textContent = 'إجراءات سريعة';
            // Show all action buttons
            const exportBtn = document.getElementById('export-data');
            const backupBtn = document.getElementById('backup-settings');
            if (exportBtn) exportBtn.style.display = 'flex';
            if (backupBtn) backupBtn.style.display = 'flex';
        }
        if (recentActivity) {
            recentActivity.style.display = 'block';
        }
        
        // Hide platform detection message
        hidePlatformDetectionMessage();
    }
}

function updatePlatformCards(platform) {
    const madrasatiCard = document.querySelector('.platform-card.madrasati');
    const noorCard = document.querySelector('.platform-card.noor');
    
    if (madrasatiCard) {
        const statusIndicator = madrasatiCard.querySelector('.status-indicator');
        if (platform === 'madrasati') {
            madrasatiCard.classList.add('active');
            statusIndicator.textContent = 'نشط';
            statusIndicator.className = 'status-indicator active';
        } else {
            madrasatiCard.classList.remove('active');
            statusIndicator.textContent = 'جاهز';
            statusIndicator.className = 'status-indicator ready';
        }
    }
    
    if (noorCard) {
        const statusIndicator = noorCard.querySelector('.status-indicator');
        if (platform === 'noor') {
            noorCard.classList.add('active');
            statusIndicator.textContent = 'نشط';
            statusIndicator.className = 'status-indicator active';
        } else {
            noorCard.classList.remove('active');
            statusIndicator.textContent = 'جاهز';
            statusIndicator.className = 'status-indicator ready';
        }
    }
}

function updateRecentActivity(platform) {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    if (platform === 'unknown') {
        activityList.innerHTML = `
            <div class="activity-item">
                <i class="fas fa-info-circle"></i>
                <div class="activity-info">
                    <span class="activity-title">قم بزيارة منصة تعليمية لبدء الاستخدام</span>
                    <span class="activity-time">منصة مدرستي أو نظام نور</span>
                </div>
            </div>
        `;
    } else {
        // Load actual recent activity from storage
        loadRecentActivityFromStorage(platform);
    }
}

async function loadRecentActivityFromStorage(platform) {
    try {
        const data = await chrome.storage.local.get(['recentActivity']);
        const activities = data.recentActivity || [];
        
        // Filter activities by platform
        const platformActivities = activities
            .filter(activity => activity.platform === platform)
            .slice(0, 3); // Show only last 3 activities
        
        const activityList = document.querySelector('.activity-list');
        if (platformActivities.length === 0) {
            activityList.innerHTML = `
                <div class="activity-item">
                    <i class="fas fa-clock"></i>
                    <div class="activity-info">
                        <span class="activity-title">لا توجد أنشطة حديثة</span>
                        <span class="activity-time">ابدأ باستخدام الأدوات المتاحة</span>
                    </div>
                </div>
            `;
        } else {
            activityList.innerHTML = platformActivities
                .map(activity => `
                    <div class="activity-item">
                        <i class="fas ${activity.icon}"></i>
                        <div class="activity-info">
                            <span class="activity-title">${activity.title}</span>
                            <span class="activity-time">${activity.time}</span>
                        </div>
                    </div>
                `).join('');
        }
    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

function showPlatformDetectionMessage() {
    const welcomeSection = document.querySelector('.welcome-section');
    if (!welcomeSection) return;
    
    const existingMessage = document.querySelector('.platform-detection-message');
    if (existingMessage) return;
    
    const message = document.createElement('div');
    message.className = 'platform-detection-message';
    message.innerHTML = `
        <div class="detection-card">
            <i class="fas fa-search"></i>
            <h3>انتظار المنصة التعليمية</h3>
            <p>يرجى زيارة إحدى المنصات المدعومة لتفعيل المساعد:</p>
            <div class="supported-platforms">
                <div class="platform-link" data-platform="madrasati">
                    <i class="fas fa-school"></i>
                    <span>منصة مدرستي</span>
                </div>
                <div class="platform-link" data-platform="noor">
                    <i class="fas fa-user-graduate"></i>
                    <span>نظام نور</span>
                </div>
            </div>
        </div>
    `;
    
    welcomeSection.appendChild(message);
    
    // Add click handlers for platform links
    message.querySelectorAll('.platform-link').forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.dataset.platform;
            const urls = {
                'madrasati': 'https://madrasati.sa',
                'noor': 'https://noor.moe.gov.sa'
            };
            
            if (urls[platform]) {
                chrome.tabs.create({ url: urls[platform] });
            }
        });
    });
}

function hidePlatformDetectionMessage() {
    const message = document.querySelector('.platform-detection-message');
    if (message) {
        message.remove();
    }
}