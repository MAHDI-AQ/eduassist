// EduAssist Madrasati Platform Integration
// Specific functionality for madrasati.sa platform

console.log('🏫 Loading Madrasati integration features...');

// Madrasati specific functionality
class MadrasatiIntegration {
    constructor() {
        this.platform = 'madrasati';
        this.isActive = window.location.hostname.includes('madrasati.sa');
        this.features = {};
        
        if (this.isActive) {
            this.init();
        }
    }

    init() {
        console.log('🚀 Initializing Madrasati features...');
        this.detectCurrentPage();
        this.injectMadrasatiFeatures();
        this.bindMadrasatiEvents();
    }

    detectCurrentPage() {
        const url = window.location.href;
        const hostname = window.location.hostname;
        
        this.currentPage = 'unknown';
        
        if (url.includes('/Student/')) {
            this.currentPage = 'student-section';
        } else if (url.includes('/Teacher/')) {
            this.currentPage = 'teacher-section';
        } else if (url.includes('/SchoolManagment/')) {
            this.currentPage = 'admin-section';
        } else if (url.includes('/Student/Lessons/')) {
            this.currentPage = 'student-lessons';
        } else if (url.includes('/Teacher/Lessons/')) {
            this.currentPage = 'teacher-lessons';
        } else if (url.includes('/Student/VirtualClassroom/')) {
            this.currentPage = 'virtual-classroom';
        }
        
        console.log(`📍 Current Madrasati page: ${this.currentPage}`);
    }

    injectMadrasatiFeatures() {
        // Add platform-specific buttons and features based on current page
        switch (this.currentPage) {
            case 'student-section':
                this.addStudentFeatures();
                break;
            case 'teacher-section':
                this.addTeacherFeatures();
                break;
            case 'admin-section':
                this.addAdminFeatures();
                break;
            case 'student-lessons':
                this.addLessonFeatures();
                break;
            default:
                this.addGeneralFeatures();
        }
    }

    addStudentFeatures() {
        console.log('👥 Adding student management features...');
        
        // Student attendance tracker
        this.addFeatureButton('track-attendance', '📋 تتبع الحضور', () => {
            this.trackStudentAttendance();
        });
        
        // Student data export
        this.addFeatureButton('export-students', '📊 تصدير بيانات الطلاب', () => {
            this.exportStudentData();
        });
        
        // Bulk operations
        this.addFeatureButton('bulk-operations', '⚡ عمليات مجمعة', () => {
            this.showBulkOperations();
        });
    }

    addTeacherFeatures() {
        console.log('👨‍🏫 Adding teacher management features...');
        
        // Lesson tracking
        this.addFeatureButton('track-lessons', '📚 متابعة الدروس', () => {
            this.trackTeacherLessons();
        });
        
        // Performance reports
        this.addFeatureButton('teacher-reports', '📈 تقارير الأداء', () => {
            this.generateTeacherReports();
        });
    }

    addAdminFeatures() {
        console.log('🏛️ Adding administrative features...');
        
        // School statistics
        this.addFeatureButton('school-stats', '📊 إحصائيات المدرسة', () => {
            this.showSchoolStatistics();
        });
        
        // Data sync
        this.addFeatureButton('sync-data', '🔄 مزامنة البيانات', () => {
            this.syncMadrasatiData();
        });
    }

    addLessonFeatures() {
        console.log('📖 Adding lesson-specific features...');
        
        // Auto-attendance for lessons
        this.addFeatureButton('auto-attendance', '✅ حضور تلقائي', () => {
            this.autoMarkAttendance();
        });
        
        // Lesson notes
        this.addFeatureButton('lesson-notes', '📝 ملاحظات الدرس', () => {
            this.addLessonNotes();
        });
    }

    addGeneralFeatures() {
        console.log('🔧 Adding general Madrasati features...');
        
        // Quick navigation
        this.addFeatureButton('quick-nav', '🧭 التنقل السريع', () => {
            this.showQuickNavigation();
        });
    }

    addFeatureButton(id, text, onClick) {
        // Find appropriate container (similar to original injection method)
        let container = document.querySelector('.page-header');
        if (!container) {
            container = document.querySelector('.main-content');
        }
        if (!container) {
            container = document.body;
        }
        
        // Create button
        const button = document.createElement('button');
        button.id = `eduassist-${id}`;
        button.className = 'eduassist-madrasati-btn';
        button.innerHTML = text;
        button.onclick = onClick;
        
        // Style the button
        button.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 10px 15px;
            margin: 5px;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 14px;
            transition: all 0.2s;
            box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        `;
        
        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 2px 10px rgba(102, 126, 234, 0.3)';
        });
        
        container.appendChild(button);
    }

    bindMadrasatiEvents() {
        // Bind to Madrasati-specific page events
        this.observePageChanges();
        this.bindToMadrasatiButtons();
    }

    observePageChanges() {
        // Watch for dynamic content changes in Madrasati
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Re-inject features when content changes
                    setTimeout(() => {
                        this.detectCurrentPage();
                        this.enhanceExistingElements();
                    }, 1000);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    bindToMadrasatiButtons() {
        // Enhance existing Madrasati buttons with our functionality
        document.addEventListener('click', (e) => {
            // Intercept specific Madrasati buttons and add our enhancements
            if (e.target.textContent && e.target.textContent.includes('كشف الطلاب')) {
                setTimeout(() => {
                    this.enhanceStudentList();
                }, 500);
            }
        });
    }

    enhanceExistingElements() {
        // Enhance existing Madrasati elements (like their method but better)
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (this.isStudentTable(table)) {
                this.enhanceStudentTable(table);
            }
        });
    }

    isStudentTable(table) {
        // Detect if table contains student data
        const headers = table.querySelectorAll('th');
        const headerText = Array.from(headers).map(th => th.textContent).join(' ');
        return headerText.includes('الطالب') || headerText.includes('الاسم') || headerText.includes('الصف');
    }

    enhanceStudentTable(table) {
        // Add enhancement buttons to student tables
        if (table.querySelector('.eduassist-table-enhancement')) return; // Already enhanced
        
        const enhancement = document.createElement('div');
        enhancement.className = 'eduassist-table-enhancement';
        enhancement.style.cssText = `
            background: #f8f9fa;
            padding: 10px;
            border-radius: 8px;
            margin: 10px 0;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
        `;
        
        // Add export button
        const exportBtn = this.createSmallButton('📊 تصدير', () => {
            this.exportTableData(table);
        });
        
        // Add select all button
        const selectAllBtn = this.createSmallButton('☑️ تحديد الكل', () => {
            this.selectAllInTable(table);
        });
        
        // Add bulk actions button
        const bulkBtn = this.createSmallButton('⚡ إجراءات مجمعة', () => {
            this.showTableBulkActions(table);
        });
        
        enhancement.appendChild(exportBtn);
        enhancement.appendChild(selectAllBtn);
        enhancement.appendChild(bulkBtn);
        
        table.parentNode.insertBefore(enhancement, table);
    }

    createSmallButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.onclick = onClick;
        button.style.cssText = `
            background: #667eea;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            transition: background 0.2s;
        `;
        button.addEventListener('mouseenter', () => {
            button.style.background = '#5a6fd8';
        });
        button.addEventListener('mouseleave', () => {
            button.style.background = '#667eea';
        });
        return button;
    }

    // Feature implementations
    async trackStudentAttendance() {
        console.log('📋 Tracking student attendance...');
        
        // Get all students from current page
        const students = this.extractStudentsFromPage();
        
        if (students.length > 0) {
            // Save to storage
            await this.saveStudentData(students);
            this.showNotification(`تم حفظ بيانات ${students.length} طالب`, 'success');
        } else {
            this.showNotification('لم يتم العثور على بيانات طلاب في هذه الصفحة', 'warning');
        }
    }

    extractStudentsFromPage() {
        const students = [];
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            if (this.isStudentTable(table)) {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 3) {
                        const student = {
                            name: this.extractTextFromCell(cells[0]),
                            id: this.extractTextFromCell(cells[1]),
                            class: this.extractTextFromCell(cells[2]),
                            phone: this.extractPhoneFromRow(row),
                            timestamp: new Date().toISOString(),
                            page: this.currentPage,
                            url: window.location.href
                        };
                        
                        if (student.name && student.name.trim() !== '') {
                            students.push(student);
                        }
                    }
                });
            }
        });
        
        return students;
    }

    extractTextFromCell(cell) {
        return cell ? cell.textContent.trim() : '';
    }

    extractPhoneFromRow(row) {
        // Look for phone numbers in the row
        const text = row.textContent;
        const phoneRegex = /\d{10,}/;
        const match = text.match(phoneRegex);
        return match ? match[0] : '';
    }

    async saveStudentData(students) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({
                action: 'save-student-data',
                data: {
                    platform: this.platform,
                    students: students,
                    metadata: {
                        source: 'madrasati',
                        page: this.currentPage,
                        url: window.location.href,
                        extractedAt: new Date().toISOString()
                    }
                }
            }, (response) => {
                resolve(response);
            });
        });
    }

    async exportStudentData() {
        console.log('📊 Exporting student data...');
        
        const students = this.extractStudentsFromPage();
        if (students.length === 0) {
            this.showNotification('لا توجد بيانات طلاب للتصدير', 'warning');
            return;
        }
        
        // Convert to CSV
        const csv = this.convertToCSV(students);
        this.downloadCSV(csv, `madrasati-students-${new Date().toISOString().split('T')[0]}.csv`);
        
        this.showNotification(`تم تصدير ${students.length} طالب إلى ملف CSV`, 'success');
    }

    convertToCSV(data) {
        if (data.length === 0) return '';
        
        const headers = Object.keys(data[0]);
        const csvHeaders = headers.join(',');
        
        const csvRows = data.map(row => {
            return headers.map(header => {
                const value = row[header] || '';
                return `"${value.toString().replace(/"/g, '""')}"`;
            }).join(',');
        });
        
        return [csvHeaders, ...csvRows].join('\n');
    }

    downloadCSV(csvContent, filename) {
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    exportTableData(table) {
        console.log('📊 Exporting table data...');
        
        const data = [];
        const headers = [];
        
        // Extract headers
        const headerCells = table.querySelectorAll('thead th, tbody tr:first-child th');
        headerCells.forEach(cell => {
            headers.push(cell.textContent.trim());
        });
        
        // Extract data rows
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = {};
            cells.forEach((cell, index) => {
                rowData[headers[index] || `Column${index}`] = cell.textContent.trim();
            });
            data.push(rowData);
        });
        
        if (data.length > 0) {
            const csv = this.convertToCSV(data);
            this.downloadCSV(csv, `madrasati-table-${Date.now()}.csv`);
            this.showNotification(`تم تصدير ${data.length} صف من البيانات`, 'success');
        }
    }

    selectAllInTable(table) {
        const checkboxes = table.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = true;
            // Trigger change event
            checkbox.dispatchEvent(new Event('change', { bubbles: true }));
        });
        
        this.showNotification(`تم تحديد ${checkboxes.length} عنصر`, 'info');
    }

    showTableBulkActions(table) {
        // Create bulk actions modal
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 500px;
            text-align: center;
        `;
        
        content.innerHTML = `
            <h3>الإجراءات المجمعة</h3>
            <p>اختر الإجراء المطلوب تنفيذه على العناصر المحددة:</p>
            <div style="margin: 20px 0; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                <button onclick="this.closest('.modal').remove()" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">إلغاء</button>
                <button onclick="alert('ميزة قريباً'); this.closest('.modal').remove()" style="padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer;">تصدير المحدد</button>
                <button onclick="alert('ميزة قريباً'); this.closest('.modal').remove()" style="padding: 10px 20px; background: #17a2b8; color: white; border: none; border-radius: 6px; cursor: pointer;">إرسال رسائل</button>
            </div>
        `;
        
        modal.appendChild(content);
        modal.className = 'modal';
        document.body.appendChild(modal);
        
        // Close on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }

    showNotification(message, type = 'info') {
        // Create notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 999999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 300px;
            animation: slideIn 0.3s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${this.getNotificationIcon(type)}</span>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    getNotificationColor(type) {
        const colors = {
            'success': '#28a745',
            'error': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8'
        };
        return colors[type] || colors.info;
    }

    getNotificationIcon(type) {
        const icons = {
            'success': '✅',
            'error': '❌',
            'warning': '⚠️',
            'info': 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // Other feature stubs (to be implemented)
    trackTeacherLessons() {
        console.log('📚 Teacher lessons tracking - Coming soon!');
        this.showNotification('ميزة متابعة الدروس قريباً', 'info');
    }

    generateTeacherReports() {
        console.log('📈 Teacher reports - Coming soon!');
        this.showNotification('تقارير المعلمين قريباً', 'info');
    }

    showSchoolStatistics() {
        console.log('📊 School statistics - Coming soon!');
        this.showNotification('إحصائيات المدرسة قريباً', 'info');
    }

    syncMadrasatiData() {
        console.log('🔄 Data sync - Coming soon!');
        this.showNotification('مزامنة البيانات قريباً', 'info');
    }

    autoMarkAttendance() {
        console.log('✅ Auto attendance - Coming soon!');
        this.showNotification('الحضور التلقائي قريباً', 'info');
    }

    addLessonNotes() {
        console.log('📝 Lesson notes - Coming soon!');
        this.showNotification('ملاحظات الدرس قريباً', 'info');
    }

    showQuickNavigation() {
        console.log('🧭 Quick navigation - Coming soon!');
        this.showNotification('التنقل السريع قريباً', 'info');
    }

    showBulkOperations() {
        console.log('⚡ Bulk operations - Coming soon!');
        this.showNotification('العمليات المجمعة قريباً', 'info');
    }
}

// Initialize Madrasati integration
window.madrasatiIntegration = new MadrasatiIntegration();

console.log('✅ Madrasati integration loaded successfully');