// EduAssist Background Service Worker
// Handles extension lifecycle, storage, and communication

console.log('🎓 EduAssist Background Service Worker Started');

// Extension installation and updates
chrome.runtime.onInstalled.addListener((details) => {
    console.log('📦 EduAssist installed/updated:', details.reason);
    
    if (details.reason === 'install') {
        // First installation
        handleFirstInstall();
    } else if (details.reason === 'update') {
        // Extension updated
        handleUpdate(details.previousVersion);
    }
});

async function handleFirstInstall() {
    console.log('🎉 First installation of EduAssist');
    
    // Set default settings
    const defaultSettings = {
        'auto-detect': true,
        'notifications': true,
        'dark-mode': false,
        'auto-backup': true,
        'data-sync': false,
        'first-run': true,
        'install-date': new Date().toISOString()
    };
    
    await chrome.storage.sync.set(defaultSettings);
    
    // Initialize local storage
    await chrome.storage.local.set({
        'students-data': [],
        'teachers-data': [],
        'reports-cache': {},
        'last-backup': null
    });
    
    // Show welcome page (like the original did)
    chrome.tabs.create({
        url: chrome.runtime.getURL('src/welcome/welcome.html')
    });
}

async function handleUpdate(previousVersion) {
    console.log(`🔄 Updated from version ${previousVersion}`);
    
    // Handle any migration logic here
    // For now, just log the update
    await chrome.storage.local.set({
        'last-update': new Date().toISOString(),
        'previous-version': previousVersion
    });
}

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
    console.log('🚀 EduAssist extension started');
    performStartupTasks();
});

async function performStartupTasks() {
    // Check for auto-backup
    const settings = await chrome.storage.sync.get(['auto-backup']);
    if (settings['auto-backup']) {
        scheduleAutoBackup();
    }
    
    // Clean old data if needed
    cleanOldData();
}

// Message handling for communication with content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('📨 Message received:', request);
    
    switch (request.action) {
        case 'get-platform-data':
            handleGetPlatformData(request, sendResponse);
            return true; // Keep message channel open for async response
            
        case 'save-student-data':
            handleSaveStudentData(request, sendResponse);
            return true;
            
        case 'export-data':
            handleExportData(request, sendResponse);
            return true;
            
        case 'backup-data':
            handleBackupData(request, sendResponse);
            return true;
            
        case 'get-settings':
            handleGetSettings(request, sendResponse);
            return true;
            
        default:
            console.warn('Unknown action:', request.action);
            sendResponse({ success: false, error: 'Unknown action' });
    }
});

// Platform data handling (similar to their remote loading but local)
async function handleGetPlatformData(request, sendResponse) {
    try {
        const platform = request.platform;
        const dataType = request.dataType;
        
        console.log(`📊 Getting ${dataType} data for ${platform}`);
        
        // Get data from local storage
        const storageKey = `${platform}-${dataType}`;
        const result = await chrome.storage.local.get([storageKey]);
        
        sendResponse({
            success: true,
            data: result[storageKey] || []
        });
        
    } catch (error) {
        console.error('Error getting platform data:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// Student data management
async function handleSaveStudentData(request, sendResponse) {
    try {
        const { platform, students, metadata } = request.data;
        
        console.log(`💾 Saving ${students.length} students for ${platform}`);
        
        // Save to local storage
        const storageKey = `${platform}-students`;
        const dataToSave = {
            students: students,
            metadata: {
                ...metadata,
                lastUpdated: new Date().toISOString(),
                count: students.length
            }
        };
        
        await chrome.storage.local.set({ [storageKey]: dataToSave });
        
        // Update statistics
        updateStatistics(platform, 'students', students.length);
        
        sendResponse({ success: true, count: students.length });
        
    } catch (error) {
        console.error('Error saving student data:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// Data export functionality
async function handleExportData(request, sendResponse) {
    try {
        const { format, platform, dataType } = request;
        
        console.log(`📤 Exporting ${dataType} data from ${platform} as ${format}`);
        
        // Get all relevant data
        const allData = await chrome.storage.local.get(null);
        
        // Filter data based on request
        let dataToExport = {};
        
        if (platform && dataType) {
            const key = `${platform}-${dataType}`;
            dataToExport[key] = allData[key];
        } else if (platform) {
            // Export all data for specific platform
            Object.keys(allData).forEach(key => {
                if (key.startsWith(platform)) {
                    dataToExport[key] = allData[key];
                }
            });
        } else {
            // Export everything
            dataToExport = allData;
        }
        
        // Create export object
        const exportObject = {
            timestamp: new Date().toISOString(),
            version: chrome.runtime.getManifest().version,
            platform: platform || 'all',
            dataType: dataType || 'all',
            data: dataToExport
        };
        
        sendResponse({ 
            success: true, 
            exportData: exportObject,
            filename: generateExportFilename(platform, dataType, format)
        });
        
    } catch (error) {
        console.error('Error exporting data:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// Auto backup functionality
async function handleBackupData(request, sendResponse) {
    try {
        console.log('💾 Creating backup...');
        
        const allData = await chrome.storage.local.get(null);
        const settings = await chrome.storage.sync.get(null);
        
        const backup = {
            timestamp: new Date().toISOString(),
            version: chrome.runtime.getManifest().version,
            localData: allData,
            settings: settings
        };
        
        // Store backup info
        await chrome.storage.local.set({
            'last-backup': new Date().toISOString(),
            'backup-count': (allData['backup-count'] || 0) + 1
        });
        
        sendResponse({ 
            success: true, 
            backup: backup,
            size: JSON.stringify(backup).length
        });
        
    } catch (error) {
        console.error('Error creating backup:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// Settings management
async function handleGetSettings(request, sendResponse) {
    try {
        const settings = await chrome.storage.sync.get(null);
        sendResponse({ success: true, settings: settings });
    } catch (error) {
        console.error('Error getting settings:', error);
        sendResponse({ success: false, error: error.message });
    }
}

// Utility functions
function generateExportFilename(platform, dataType, format) {
    const date = new Date().toISOString().split('T')[0];
    const platformStr = platform || 'all';
    const typeStr = dataType || 'data';
    return `eduassist-${platformStr}-${typeStr}-${date}.${format.toLowerCase()}`;
}

async function updateStatistics(platform, dataType, count) {
    try {
        const statsKey = 'statistics';
        const currentStats = await chrome.storage.local.get([statsKey]);
        const stats = currentStats[statsKey] || {};
        
        if (!stats[platform]) stats[platform] = {};
        if (!stats[platform][dataType]) stats[platform][dataType] = {};
        
        stats[platform][dataType] = {
            count: count,
            lastUpdated: new Date().toISOString()
        };
        
        await chrome.storage.local.set({ [statsKey]: stats });
        
    } catch (error) {
        console.error('Error updating statistics:', error);
    }
}

function scheduleAutoBackup() {
    // Schedule auto backup every 24 hours
    chrome.alarms.create('auto-backup', {
        delayInMinutes: 1440, // 24 hours
        periodInMinutes: 1440
    });
}

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'auto-backup') {
        console.log('⏰ Performing scheduled backup...');
        performAutoBackup();
    }
});

async function performAutoBackup() {
    try {
        const settings = await chrome.storage.sync.get(['auto-backup']);
        if (!settings['auto-backup']) return;
        
        const allData = await chrome.storage.local.get(null);
        const backupData = {
            timestamp: new Date().toISOString(),
            version: chrome.runtime.getManifest().version,
            data: allData,
            type: 'auto-backup'
        };
        
        // Store in local storage with rotation (keep last 5 backups)
        const backupKey = `auto-backup-${Date.now()}`;
        await chrome.storage.local.set({ [backupKey]: backupData });
        
        // Clean old auto backups
        await cleanOldBackups();
        
        console.log('✅ Auto backup completed');
        
    } catch (error) {
        console.error('Auto backup failed:', error);
    }
}

async function cleanOldBackups() {
    try {
        const allData = await chrome.storage.local.get(null);
        const backupKeys = Object.keys(allData).filter(key => key.startsWith('auto-backup-'));
        
        // Sort by timestamp (newest first)
        backupKeys.sort((a, b) => {
            const timeA = parseInt(a.split('-')[2]);
            const timeB = parseInt(b.split('-')[2]);
            return timeB - timeA;
        });
        
        // Keep only the last 5 backups
        const keysToDelete = backupKeys.slice(5);
        if (keysToDelete.length > 0) {
            await chrome.storage.local.remove(keysToDelete);
            console.log(`🗑️ Cleaned ${keysToDelete.length} old backups`);
        }
        
    } catch (error) {
        console.error('Error cleaning old backups:', error);
    }
}

async function cleanOldData() {
    try {
        // Clean data older than 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const allData = await chrome.storage.local.get(null);
        const keysToDelete = [];
        
        Object.keys(allData).forEach(key => {
            const data = allData[key];
            if (data && data.metadata && data.metadata.lastUpdated) {
                const lastUpdated = new Date(data.metadata.lastUpdated);
                if (lastUpdated < thirtyDaysAgo) {
                    keysToDelete.push(key);
                }
            }
        });
        
        if (keysToDelete.length > 0) {
            await chrome.storage.local.remove(keysToDelete);
            console.log(`🗑️ Cleaned ${keysToDelete.length} old data entries`);
        }
        
    } catch (error) {
        console.error('Error cleaning old data:', error);
    }
}

// Context menu setup (optional)
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'eduassist-open',
        title: 'فتح EduAssist',
        contexts: ['page'],
        documentUrlPatterns: [
            'https://*.madrasati.sa/*',
            'https://*.moe.gov.sa/*'
        ]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'eduassist-open') {
        // Inject and show interface
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
                if (window.EduAssist) {
                    window.EduAssist.showInterface();
                }
            }
        });
    }
});

console.log('✅ EduAssist Background Service Worker Ready');