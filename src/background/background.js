// EduAssist Background Service Worker
// Handles extension lifecycle, storage, and communication

// Wrap the entire service worker in error handling
(() => {
    try {
        console.log('🎓 EduAssist Background Service Worker Started');

        // Extension installation and updates
        chrome.runtime.onInstalled.addListener(async (details) => {
            try {
                console.log('📦 EduAssist installed/updated:', details.reason);
                
                if (details.reason === 'install') {
                    // First installation
                    await handleFirstInstall();
                } else if (details.reason === 'update') {
                    // Extension updated
                    await handleUpdate(details.previousVersion);
                }
            } catch (error) {
                console.error('❌ Error in onInstalled listener:', error);
            }
        });

async function handleFirstInstall() {
    console.log('🎉 First installation of EduAssist');
    
    try {
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
        
        // Show popup instead of non-existent welcome page
        try {
            await chrome.action.openPopup();
        } catch (error) {
            console.log('Could not open popup on first install:', error.message);
        }
        
        console.log('✅ First installation completed successfully');
    } catch (error) {
        console.error('❌ Error during first installation:', error);
    }
}

async function handleUpdate(previousVersion) {
    try {
        console.log(`🔄 Updated from version ${previousVersion}`);
        
        // Handle any migration logic here
        // For now, just log the update
        await chrome.storage.local.set({
            'last-update': new Date().toISOString(),
            'previous-version': previousVersion
        });
        
        console.log('✅ Update completed successfully');
    } catch (error) {
        console.error('❌ Error during update:', error);
    }
}

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
    console.log('🚀 EduAssist extension started');
    performStartupTasks().catch(error => {
        console.error('❌ Error during startup tasks:', error);
    });
});

async function performStartupTasks() {
    try {
        // Check for auto-backup
        const settings = await chrome.storage.sync.get(['auto-backup']);
        if (settings['auto-backup']) {
            scheduleAutoBackup();
        }
        
        // Clean old data if needed
        await cleanOldData();
        
        console.log('✅ Startup tasks completed successfully');
    } catch (error) {
        console.error('❌ Error in startup tasks:', error);
    }
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
    try {
        if (chrome.alarms && typeof chrome.alarms.create === 'function') {
            chrome.alarms.create('auto-backup', {
                delayInMinutes: 1440, // 24 hours
                periodInMinutes: 1440
            });
            console.log('⏰ Auto backup scheduled');
        } else {
            console.warn('⚠️ Chrome alarms API not available - auto backup disabled');
        }
    } catch (error) {
        console.warn('⚠️ Error scheduling auto backup:', error.message);
    }
}

// Check if alarms API is available before using it
function setupAlarmsListener() {
    try {
        if (chrome.alarms && typeof chrome.alarms.onAlarm?.addListener === 'function') {
            chrome.alarms.onAlarm.addListener((alarm) => {
                if (alarm.name === 'auto-backup') {
                    console.log('⏰ Performing scheduled backup...');
                    performAutoBackup();
                }
            });
        } else {
            console.warn('⚠️ Chrome alarms API not available');
        }
    } catch (error) {
        console.warn('⚠️ Error setting up alarms listener:', error.message);
    }
}

// Set up alarms listener safely
setupAlarmsListener();

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
function setupContextMenus() {
    try {
        if (chrome.contextMenus && typeof chrome.contextMenus.create === 'function') {
            chrome.contextMenus.create({
                id: 'eduassist-open',
                title: 'فتح EduAssist',
                contexts: ['page'],
                documentUrlPatterns: [
                    'https://*.madrasati.sa/*',
                    'https://*.moe.gov.sa/*'
                ]
            });
            console.log('✅ Context menu created');
        } else {
            console.warn('⚠️ Chrome contextMenus API not available');
        }
    } catch (error) {
        console.warn('⚠️ Error creating context menu:', error.message);
    }
}

function setupContextMenuListener() {
    try {
        if (chrome.contextMenus && typeof chrome.contextMenus.onClicked?.addListener === 'function') {
            chrome.contextMenus.onClicked.addListener((info, tab) => {
                if (info.menuItemId === 'eduassist-open') {
                    // Inject and show interface
                    if (chrome.scripting && typeof chrome.scripting.executeScript === 'function') {
                        chrome.scripting.executeScript({
                            target: { tabId: tab.id },
                            func: () => {
                                if (window.EduAssist) {
                                    window.EduAssist.showInterface();
                                }
                            }
                        }).catch(error => {
                            console.warn('Error executing script:', error.message);
                        });
                    }
                }
            });
        } else {
            console.warn('⚠️ Chrome contextMenus onClicked API not available');
        }
    } catch (error) {
        console.warn('⚠️ Error setting up context menu listener:', error.message);
    }
}

chrome.runtime.onInstalled.addListener(() => {
    setupContextMenus();
});

        // Set up context menu listener safely
        setupContextMenuListener();

        console.log('✅ EduAssist Background Service Worker Ready');
        
    } catch (error) {
        console.error('❌ Critical error in background service worker:', error);
        // Try to log to storage for debugging
        try {
            chrome.storage.local.set({
                'last-error': {
                    message: error.message,
                    stack: error.stack,
                    timestamp: new Date().toISOString()
                }
            });
        } catch (storageError) {
            console.error('Could not save error to storage:', storageError);
        }
    }
})();