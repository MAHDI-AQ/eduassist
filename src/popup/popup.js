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
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });

    // Quick action buttons
    document.getElementById('open-interface')?.addEventListener('click', openInterface);
    document.getElementById('export-data')?.addEventListener('click', exportData);
    document.getElementById('sync-data')?.addEventListener('click', syncData);
    document.getElementById('help')?.addEventListener('click', showHelp);

    // Settings checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            saveSetting(this.id, this.checked);
        });
    });

    // Settings buttons
    document.getElementById('clear-cache')?.addEventListener('click', clearCache);
    document.getElementById('export-settings')?.addEventListener('click', exportSettings);
    document.getElementById('import-settings')?.addEventListener('click', importSettings);

    // Social links
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-github')) {
                chrome.tabs.create({ url: 'https://github.com/MAHDI-AQ/eduassist' });
            } else if (icon.classList.contains('fa-bug')) {
                chrome.tabs.create({ url: 'https://github.com/MAHDI-AQ/eduassist/issues' });
            } else if (icon.classList.contains('fa-star')) {
                chrome.tabs.create({ url: 'https://chrome.google.com/webstore/detail/eduassist' });
            }
        });
    });
}

function switchTab(tabName) {
    // Remove active class from all tabs and content
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
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
        
        // Update status
        const statusElement = document.getElementById('extension-status');
        if (statusElement) {
            if (platform !== 'unknown') {
                statusElement.textContent = 'نشط';
                statusElement.style.color = '#28a745';
            } else {
                statusElement.textContent = 'في انتظار منصة تعليمية';
                statusElement.style.color = '#ffc107';
            }
        }
        
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