/* EduAssist - Main Entry Point
 * Copyright 2025 - Open Source Project
 * Bundled version for Chrome Extension content script compatibility
 */

console.log('🎓 EduAssist Extension Loading...');

// === DEFINE ALL CLASSES FIRST ===
// Instead of dynamic loading, let's embed all classes directly in this file
// This ensures they run in the same context and avoids all module loading issues

// === UTILITY CLASSES ===
window.CSSLoader = class CSSLoader {
    static loadContentStyles() {
        // Skip CSS loading for now to avoid issues
        console.log('🎨 CSS loading skipped');
    }
};

// === PLATFORM DETECTION ===
window.PlatformDetector = class PlatformDetector {
    static detect() {
        const hostname = window.location.hostname;
        
        if (hostname.includes('madrasati.sa')) {
            return 'madrasati';
        }
        
        if (hostname.includes('moe.gov.sa') || hostname.includes('noor')) {
            return 'noor';
        }
        
        return 'unknown';
    }
    
    static getSupportedPlatforms() {
        return ['madrasati', 'noor'];
    }
    
    static isPlatformSupported(platform = null) {
        const currentPlatform = platform || this.detect();
        return this.getSupportedPlatforms().includes(currentPlatform);
    }
    
    static getPlatformName(platform = null) {
        const currentPlatform = platform || this.detect();
        
        const names = {
            'madrasati': 'منصة مدرستي',
            'noor': 'نظام نور',
            'unknown': 'منصة غير مدعومة'
        };
        
        return names[currentPlatform] || names.unknown;
    }
    
    static getPlatformIcon(platform = null) {
        const currentPlatform = platform || this.detect();
        
        const icons = {
            'madrasati': 'fa-school',
            'noor': 'fa-user-graduate',
            'unknown': 'fa-question-circle'
        };
        
        return icons[currentPlatform] || icons.unknown;
    }
};

// === DATA EXTRACTION CLASSES ===
window.BaseDataExtractor = class BaseDataExtractor {
    constructor() {
        this.platform = window.PlatformDetector.detect();
    }
    
    async extract() {
        throw new Error('Extract method must be implemented by subclass');
    }
    
    waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }
            
            const observer = new MutationObserver((mutations) => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Element ${selector} not found within ${timeout}ms`));
            }, timeout);
        });
    }
};

window.StudentDataExtractor = class StudentDataExtractor extends window.BaseDataExtractor {
    async extract() {
        console.log('🔍 Extracting student data...');
        
        const data = {};
        
        // Try to extract basic student information from page
        try {
            // Look for common student info patterns
            const nameElements = document.querySelectorAll('[class*="name"], [id*="name"], [class*="student"], [id*="student"]');
            const idElements = document.querySelectorAll('[class*="id"], [id*="id"], [class*="number"], [id*="number"]');
            
            nameElements.forEach((el, index) => {
                if (el.textContent.trim()) {
                    data[`Name_${index}`] = el.textContent.trim();
                }
            });
            
            idElements.forEach((el, index) => {
                if (el.textContent.trim() && /\d/.test(el.textContent)) {
                    data[`ID_${index}`] = el.textContent.trim();
                }
            });
            
            data.Platform = this.platform;
            data.URL = window.location.href;
            data.Timestamp = new Date().toISOString();
            
        } catch (error) {
            console.error('Error extracting student data:', error);
        }
        
        return data;
    }
};

window.AttendanceDataExtractor = class AttendanceDataExtractor extends window.BaseDataExtractor {
    async extract() {
        console.log('📅 Extracting attendance data...');
        
        const data = [];
        
        try {
            // Look for attendance/date patterns
            const attendanceElements = document.querySelectorAll('[class*="attendance"], [class*="present"], [class*="absent"], [class*="date"]');
            
            attendanceElements.forEach((el, index) => {
                if (el.textContent.trim()) {
                    data.push({
                        element: index,
                        text: el.textContent.trim(),
                        platform: this.platform,
                        timestamp: new Date().toISOString()
                    });
                }
            });
            
        } catch (error) {
            console.error('Error extracting attendance data:', error);
        }
        
        return data;
    }
};

// === PLATFORM CLASSES ===
window.BasePlatform = class BasePlatform {
    constructor(controller) {
        this.controller = controller;
        this.name = 'Unknown Platform';
        this.studentExtractor = new window.StudentDataExtractor();
        this.attendanceExtractor = new window.AttendanceDataExtractor();
    }
    
    async initialize() {
        console.log(`� Initializing ${this.name}...`);
    }
    
    async extractStudentData() {
        return await this.studentExtractor.extract();
    }
    
    async extractAttendance() {
        return await this.attendanceExtractor.extract();
    }
    
    async extractGrades() {
        console.log('📝 Extracting grades...');
        return [];
    }
};

window.MadrasatiPlatform = class MadrasatiPlatform extends window.BasePlatform {
    constructor(controller) {
        super(controller);
        this.name = 'منصة مدرستي';
        this.studentExtractor = new window.StudentDataExtractor();
        this.attendanceExtractor = new window.AttendanceDataExtractor();
    }
    
    async initialize() {
        console.log('🏫 Initializing Madrasati Platform...');
        await super.initialize();
    }
};

window.NoorPlatform = class NoorPlatform extends window.BasePlatform {
    constructor(controller) {
        super(controller);
        this.name = 'نظام نور';
        this.studentExtractor = new window.StudentDataExtractor();
    }
    
    async initialize() {
        console.log('🌟 Initializing Noor Platform...');
        await super.initialize();
    }
};

// === UI CLASSES ===
window.NotificationManager = class NotificationManager {
    constructor() {
        this.notifications = [];
    }
    
    show(message, type = 'info', duration = 3000) {
        console.log(`📢 Notification [${type}]: ${message}`);
        
        const notification = {
            id: Date.now(),
            message,
            type,
            timestamp: new Date()
        };
        
        this.notifications.push(notification);
        
        // Auto-remove after duration
        setTimeout(() => {
            this.remove(notification.id);
        }, duration);
        
        return notification.id;
    }
    
    remove(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
    }
    
    clear() {
        this.notifications = [];
    }
};

window.FloatingWidget = class FloatingWidget {
    constructor(controller) {
        this.controller = controller;
        this.widget = null;
        this.isDragging = false;
    }
    
    create() {
        console.log('🎯 Creating floating widget...');
        
        // Remove any existing widget
        this.remove();
        
        // Create floating widget
        this.widget = document.createElement('div');
        this.widget.id = 'eduassist-widget';
        this.widget.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            cursor: pointer;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transition: transform 0.2s ease;
        `;
        
        this.widget.innerHTML = '🎓';
        this.widget.title = 'EduAssist - مساعد البيانات التعليمية';
        
        // Add click handler
        this.widget.addEventListener('click', () => {
            this.controller.showInterface();
        });
        
        // Add hover effects
        this.widget.addEventListener('mouseenter', () => {
            this.widget.style.transform = 'scale(1.1)';
        });
        
        this.widget.addEventListener('mouseleave', () => {
            this.widget.style.transform = 'scale(1.0)';
        });
        
        document.body.appendChild(this.widget);
    }
    
    remove() {
        const existingWidget = document.getElementById('eduassist-widget');
        if (existingWidget) {
            existingWidget.remove();
        }
    }
    
    show() {
        if (this.widget) {
            this.widget.style.display = 'flex';
        }
    }
    
    hide() {
        if (this.widget) {
            this.widget.style.display = 'none';
        }
    }
};

window.MainInterface = class MainInterface {
    constructor(controller) {
        this.controller = controller;
        this.interfaceElement = null;
    }
    
    inject() {
        console.log('🖥️ Creating main interface...');
        // For now, just log that interface would be created
        console.log('✅ Main interface ready');
    }
    
    show() {
        console.log('📱 Showing main interface...');
        
        // Create a simple modal for testing
        const modal = document.createElement('div');
        modal.id = 'eduassist-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 1000000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 20px;
            border-radius: 10px;
            max-width: 500px;
            width: 90%;
            direction: rtl;
            text-align: center;
        `;
        
        content.innerHTML = `
            <h2>🎓 EduAssist</h2>
            <p>مرحباً بك في مساعد استخراج البيانات التعليمية</p>
            <p><strong>المنصة المكتشفة:</strong> ${window.PlatformDetector.getPlatformName()}</p>
            <div style="margin: 20px 0;">
                <button id="extract-student-btn" style="margin: 5px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">استخراج بيانات الطالب</button>
                <button id="extract-attendance-btn" style="margin: 5px; padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer;">استخراج سجل الحضور</button>
            </div>
            <button id="close-modal-btn" style="margin: 5px; padding: 10px 20px; background: #6c757d; color: white; border: none; border-radius: 5px; cursor: pointer;">إغلاق</button>
            <div id="results" style="margin-top: 20px; padding: 10px; background: #f8f9fa; border-radius: 5px; display: none;"></div>
        `;
        
        modal.appendChild(content);
        document.body.appendChild(modal);
        
        // Add event listeners
        document.getElementById('close-modal-btn').addEventListener('click', () => {
            modal.remove();
        });
        
        document.getElementById('extract-student-btn').addEventListener('click', async () => {
            const results = document.getElementById('results');
            results.style.display = 'block';
            results.innerHTML = '🔄 جاري استخراج بيانات الطالب...';
            
            try {
                const data = await this.controller.extractStudentData();
                results.innerHTML = `<pre style="text-align: left; direction: ltr;">${JSON.stringify(data, null, 2)}</pre>`;
            } catch (error) {
                results.innerHTML = `❌ خطأ: ${error.message}`;
            }
        });
        
        document.getElementById('extract-attendance-btn').addEventListener('click', async () => {
            const results = document.getElementById('results');
            results.style.display = 'block';
            results.innerHTML = '🔄 جاري استخراج سجل الحضور...';
            
            try {
                const data = await this.controller.extractAttendance();
                results.innerHTML = `<pre style="text-align: left; direction: ltr;">${JSON.stringify(data, null, 2)}</pre>`;
            } catch (error) {
                results.innerHTML = `❌ خطأ: ${error.message}`;
            }
        });
        
        // Close on background click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
};

// === MAIN CONTROLLER ===
window.EduAssistController = class EduAssistController {
    constructor() {
        this.isInitialized = false;
        this.currentPlatform = window.PlatformDetector.detect();
        this.features = {};
        this.navigationStack = ['main'];
        this.currentView = 'main';
        this.lastExtractedData = null;
        
        // Initialize components
        this.platformHandler = this.createPlatformHandler();
        this.widget = new window.FloatingWidget(this);
        this.mainInterface = new window.MainInterface(this);
        this.notifications = new window.NotificationManager();
        
        this.init();
    }
    
    async init() {
        console.log(`🎯 EduAssist: Initializing on ${this.currentPlatform}`);
        
        // Initialize components
        this.widget.create();
        this.mainInterface.inject();
        
        if (this.platformHandler) {
            await this.platformHandler.initialize();
        }
        
        this.isInitialized = true;
        console.log('✅ EduAssist initialized successfully!');
    }
    
    createPlatformHandler() {
        switch (this.currentPlatform) {
            case 'madrasati':
                return new window.MadrasatiPlatform(this);
            case 'noor':
                return new window.NoorPlatform(this);
            default:
                console.warn('⚠️ Unsupported platform:', this.currentPlatform);
                return null;
        }
    }
    
    getCurrentPlatform() {
        return this.platformHandler;
    }
    
    checkAuthentication() {
        // Simple check - can be enhanced later
        return true;
    }
    
    async extractStudentData() {
        if (!this.platformHandler) {
            throw new Error('Platform not supported');
        }
        return await this.platformHandler.extractStudentData();
    }
    
    async extractAttendance() {
        if (!this.platformHandler) {
            throw new Error('Platform not supported');
        }
        return await this.platformHandler.extractAttendance();
    }
    
    async extractGrades() {
        if (!this.platformHandler) {
            throw new Error('Platform not supported');
        }
        return await this.platformHandler.extractGrades();
    }
    
    setLastExtractedData(data) {
        this.lastExtractedData = data;
    }
    
    exportData(format) {
        if (!this.lastExtractedData) {
            this.notifications.show('لا توجد بيانات لتصديرها', 'warning');
            return;
        }
        
        const dataStr = format === 'json' 
            ? JSON.stringify(this.lastExtractedData, null, 2)
            : this.convertToCSV(this.lastExtractedData);
        
        const blob = new Blob([dataStr], { type: format === 'json' ? 'application/json' : 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `eduassist-data-${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.notifications.show('تم تصدير البيانات بنجاح', 'success');
    }
    
    convertToCSV(data) {
        if (Array.isArray(data)) {
            const headers = Object.keys(data[0] || {});
            const csvContent = [
                headers.join(','),
                ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
            ].join('\n');
            return csvContent;
        } else {
            const headers = ['Key', 'Value'];
            const csvContent = [
                headers.join(','),
                ...Object.entries(data).map(([key, value]) => `"${key}","${value}"`)
            ].join('\n');
            return csvContent;
        }
    }
    
    showInterface() {
        this.mainInterface.show();
    }
    
    getViewTitle(viewName) {
        const titles = {
            'main': 'الصفحة الرئيسية',
            'student': 'بيانات الطالب',
            'attendance': 'سجل الحضور',
            'grades': 'الدرجات'
        };
        return titles[viewName] || viewName;
    }
};

console.log('✅ All classes loaded directly into window object');

// Storage helper
window.eduAssistStorage = {
    set: (key, value) => {
        return new Promise((resolve) => {
            chrome.storage.local.set({[key]: value}, () => {
                resolve();
            });
        });
    },
    get: (key) => {
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                resolve(result[key]);
            });
        });
    }
};

// === INITIALIZATION CODE ===
// Now that all classes are defined, we can safely initialize

function initializeEduAssist() {
    // Check if platform is supported first
    const platform = window.PlatformDetector.detect();
    if (!window.PlatformDetector.isPlatformSupported(platform)) {
        console.log(`ℹ️ Platform '${platform}' not supported. Extension will not initialize.`);
        return;
    }
    
    // Initialize directly since all classes are embedded above
    loadEduAssistModules();
}

function loadEduAssistModules() {
    try {
        console.log('🔧 Loading EduAssist modules...');
        
        // Initialize CSS
        window.CSSLoader.loadContentStyles();
        
        // Initialize the main controller
        window.eduAssistController = new window.EduAssistController();
        
        console.log('✅ EduAssist modules loaded successfully!');
    } catch (error) {
        console.error('❌ Error loading EduAssist modules:', error);
    }
}

// Initialize after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEduAssist);
} else {
    initializeEduAssist();
}
