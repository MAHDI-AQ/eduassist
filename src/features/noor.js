// EduAssist Noor Platform Integration
// Specific functionality for noor.moe.gov.sa platform

console.log('🌙 Loading Noor integration features...');

// Noor specific functionality
class NoorIntegration {
    constructor() {
        this.platform = 'noor';
        this.isActive = window.location.hostname.includes('noor.moe.gov.sa') || 
                        window.location.hostname.includes('moe.gov.sa');
        this.features = {};
        
        if (this.isActive) {
            this.init();
        }
    }

    init() {
        console.log('🚀 Initializing Noor features...');
        this.detectCurrentPage();
        this.injectNoorFeatures();
        this.bindNoorEvents();
    }

    detectCurrentPage() {
        const url = window.location.href;
        
        this.currentPage = 'unknown';
        
        if (url.includes('StudentGuidanceReport')) {
            this.currentPage = 'student-guidance';
        } else if (url.includes('StudentsMarksReport')) {
            this.currentPage = 'student-marks';
        } else if (url.includes('StudentAttendanceReport')) {
            this.currentPage = 'student-attendance';
        } else if (url.includes('TeachersReport')) {
            this.currentPage = 'teachers-report';
        } else if (url.includes('SchoolManagment')) {
            this.currentPage = 'school-management';
        } else if (url.includes('DataToStudentsGuidance')) {
            this.currentPage = 'students-guidance-data';
        } else if (url.includes('ReportViewer')) {
            this.currentPage = 'report-viewer';
        }
        
        console.log(`📍 Current Noor page: ${this.currentPage}`);
    }

    injectNoorFeatures() {
        // Add platform-specific buttons and features based on current page
        switch (this.currentPage) {
            case 'student-guidance':
                this.addStudentGuidanceFeatures();
                break;
            case 'student-marks':
                this.addStudentMarksFeatures();
                break;
            case 'student-attendance':
                this.addAttendanceFeatures();
                break;
            case 'teachers-report':
                this.addTeacherReportFeatures();
                break;
            case 'school-management':
                this.addSchoolManagementFeatures();
                break;
            case 'students-guidance-data':
                this.addStudentsGuidanceDataFeatures();
                break;
            case 'report-viewer':
                this.addReportViewerFeatures();
                break;
            default:
                this.addGeneralNoorFeatures();
        }
    }

    addStudentGuidanceFeatures() {
        console.log('📋 Adding student guidance features...');
        
        // Quick export button for student guidance data
        this.addNoorFeatureButton('export-guidance', '📊 تصدير بيانات الإرشاد', () => {
            this.exportStudentGuidanceData();
        });
        
        // Auto-fill missing data
        this.addNoorFeatureButton('auto-fill', '🔄 تعبئة تلقائية', () => {
            this.autoFillMissingData();
        });
    }

    addStudentMarksFeatures() {
        console.log('📈 Adding student marks features...');
        
        // Grade calculation tools
        this.addNoorFeatureButton('calc-grades', '🧮 حساب الدرجات', () => {
            this.calculateGrades();
        });
        
        // Export grades to Excel
        this.addNoorFeatureButton('export-grades', '📊 تصدير الدرجات', () => {
            this.exportGradesToExcel();
        });
    }

    addAttendanceFeatures() {
        console.log('📅 Adding attendance features...');
        
        // Attendance statistics
        this.addNoorFeatureButton('attendance-stats', '📊 إحصائيات الحضور', () => {
            this.showAttendanceStatistics();
        });
        
        // Export attendance data
        this.addNoorFeatureButton('export-attendance', '📋 تصدير الحضور', () => {
            this.exportAttendanceData();
        });
    }

    addTeacherReportFeatures() {
        console.log('👨‍🏫 Adding teacher report features...');
        
        // Teacher performance analysis
        this.addNoorFeatureButton('teacher-analysis', '📈 تحليل أداء المعلمين', () => {
            this.analyzeTeacherPerformance();
        });
    }

    addSchoolManagementFeatures() {
        console.log('🏛️ Adding school management features...');
        
        // School dashboard
        this.addNoorFeatureButton('school-dashboard', '📊 لوحة تحكم المدرسة', () => {
            this.showSchoolDashboard();
        });
    }

    addStudentsGuidanceDataFeatures() {
        console.log('📚 Adding students guidance data features...');
        
        // This is where the original extension did most of its work
        // Enhanced data extraction and export
        this.addNoorFeatureButton('enhanced-export', '🚀 تصدير محسن', () => {
            this.enhancedStudentDataExport();
        });
        
        // Auto-navigate and collect
        this.addNoorFeatureButton('auto-collect', '🔄 جمع تلقائي', () => {
            this.autoCollectStudentData();
        });
        
        // Data validation
        this.addNoorFeatureButton('validate-data', '✅ التحقق من البيانات', () => {
            this.validateStudentData();
        });
    }

    addReportViewerFeatures() {
        console.log('📄 Adding report viewer features...');
        
        // Enhanced report export options
        this.addNoorFeatureButton('export-options', '📊 خيارات التصدير', () => {
            this.showExportOptions();
        });
        
        // Report customization
        this.addNoorFeatureButton('customize-report', '🎨 تخصيص التقرير', () => {
            this.customizeReport();
        });
    }

    addGeneralNoorFeatures() {
        console.log('🔧 Adding general Noor features...');
        
        // Quick navigation for Noor
        this.addNoorFeatureButton('noor-nav', '🧭 التنقل السريع', () => {
            this.showNoorNavigation();
        });
        
        // Data backup
        this.addNoorFeatureButton('backup-data', '💾 نسخ احتياطي', () => {
            this.backupNoorData();
        });
    }

    addNoorFeatureButton(id, text, onClick) {
        // Find appropriate container in Noor interface
        let container = document.querySelector('#ctl00_PlaceHolderMain_UpdatePanel1');
        if (!container) {
            container = document.querySelector('.aspNetHidden');
            if (container) container = container.parentElement;
        }
        if (!container) {
            container = document.querySelector('form');
        }
        if (!container) {
            container = document.body;
        }
        
        // Create EduAssist toolbar if it doesn't exist
        let toolbar = document.getElementById('eduassist-noor-toolbar');
        if (!toolbar) {
            toolbar = document.createElement('div');
            toolbar.id = 'eduassist-noor-toolbar';
            toolbar.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 15px;
                border-radius: 15px;
                box-shadow: 0 5px 25px rgba(102, 126, 234, 0.3);
                z-index: 999999;
                display: flex;
                flex-direction: column;
                gap: 8px;
                max-width: 250px;
                direction: rtl;
            `;
            
            // Add header
            const header = document.createElement('div');
            header.innerHTML = '🎓 EduAssist - نور';
            header.style.cssText = `
                color: white;
                font-weight: bold;
                text-align: center;
                margin-bottom: 5px;
                font-size: 14px;
            `;
            toolbar.appendChild(header);
            
            // Add minimize button
            const minimizeBtn = document.createElement('button');
            minimizeBtn.innerHTML = '📌';
            minimizeBtn.style.cssText = `
                position: absolute;
                top: 5px;
                left: 5px;
                background: rgba(255,255,255,0.2);
                border: none;
                color: white;
                width: 25px;
                height: 25px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 12px;
            `;
            minimizeBtn.onclick = () => {
                const buttons = toolbar.querySelectorAll('.eduassist-noor-btn');
                const header = toolbar.querySelector('div');
                const isMinimized = buttons[0].style.display === 'none';
                
                buttons.forEach(btn => {
                    btn.style.display = isMinimized ? 'block' : 'none';
                });
                
                if (isMinimized) {
                    toolbar.style.maxWidth = '250px';
                    minimizeBtn.innerHTML = '📌';
                } else {
                    toolbar.style.maxWidth = '60px';
                    minimizeBtn.innerHTML = '📋';
                }
            };
            toolbar.appendChild(minimizeBtn);
            
            document.body.appendChild(toolbar);
        }
        
        // Create button
        const button = document.createElement('button');
        button.id = `eduassist-noor-${id}`;
        button.className = 'eduassist-noor-btn';
        button.innerHTML = text;
        button.onclick = onClick;
        
        // Style the button
        button.style.cssText = `
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.3);
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 12px;
            transition: all 0.2s;
            text-align: center;
            white-space: nowrap;
        `;
        
        // Add hover effect
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(255, 255, 255, 0.3)';
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'rgba(255, 255, 255, 0.2)';
            button.style.transform = 'scale(1)';
        });
        
        toolbar.appendChild(button);
    }

    bindNoorEvents() {
        // Bind to Noor-specific events and page changes
        this.observeNoorChanges();
        this.bindToNoorForms();
        
        // Monitor for report generation completion
        this.monitorReportGeneration();
    }

    observeNoorChanges() {
        // Watch for Noor's dynamic content updates
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Check if new report data appeared
                    const reportTable = document.querySelector('#ctl00_PlaceHolderMain_rvStudentInfoReport_fixedTable');
                    if (reportTable && !reportTable.hasAttribute('data-eduassist-enhanced')) {
                        this.enhanceReportTable(reportTable);
                    }
                    
                    // Check for other important elements
                    setTimeout(() => {
                        this.enhanceVisibleElements();
                    }, 500);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    enhanceReportTable(table) {
        table.setAttribute('data-eduassist-enhanced', 'true');
        
        // Add export controls above the table
        const controls = document.createElement('div');
        controls.style.cssText = `
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin: 10px 0;
            display: flex;
            gap: 10px;
            align-items: center;
            flex-wrap: wrap;
            border: 2px solid #667eea;
        `;
        
        controls.innerHTML = `
            <span style="font-weight: bold; color: #667eea;">🎓 EduAssist:</span>
            <button id="eduassist-export-current" style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer;">📊 تصدير الصفحة الحالية</button>
            <button id="eduassist-export-all" style="background: #17a2b8; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer;">📋 تصدير جميع الصفحات</button>
            <button id="eduassist-auto-navigate" style="background: #6f42c1; color: white; border: none; padding: 8px 15px; border-radius: 6px; cursor: pointer;">🔄 تصفح تلقائي</button>
            <span id="eduassist-progress" style="margin-right: 15px; color: #666;"></span>
        `;
        
        table.parentNode.insertBefore(controls, table);
        
        // Bind events
        document.getElementById('eduassist-export-current').onclick = () => {
            this.exportCurrentReportPage();
        };
        
        document.getElementById('eduassist-export-all').onclick = () => {
            this.exportAllReportPages();
        };
        
        document.getElementById('eduassist-auto-navigate').onclick = () => {
            this.autoNavigateAndExport();
        };
    }

    bindToNoorForms() {
        // Enhance Noor forms with auto-completion and validation
        document.addEventListener('submit', (e) => {
            // Log form submissions for debugging
            console.log('📝 Noor form submitted:', e.target);
        });
    }

    monitorReportGeneration() {
        // Monitor for report generation completion
        const checkReportReady = () => {
            const reportFrame = document.querySelector('#ctl00_PlaceHolderMain_rvStudentInfoReport_fixedTable');
            if (reportFrame && !reportFrame.hasAttribute('data-enhanced')) {
                this.enhanceReportTable(reportFrame);
            }
        };
        
        // Check periodically
        setInterval(checkReportReady, 2000);
    }

    enhanceVisibleElements() {
        // Enhance any visible student data tables
        const tables = document.querySelectorAll('table');
        tables.forEach(table => {
            if (this.containsStudentData(table) && !table.hasAttribute('data-eduassist-enhanced')) {
                this.enhanceStudentTable(table);
            }
        });
    }

    containsStudentData(table) {
        const text = table.textContent;
        return text.includes('الطالب') || text.includes('الرقم الهوية') || 
               text.includes('الاسم') || text.includes('الصف');
    }

    enhanceStudentTable(table) {
        table.setAttribute('data-eduassist-enhanced', 'true');
        
        // Add selection checkboxes if not present
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach((row, index) => {
            if (!row.querySelector('input[type="checkbox"]')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'eduassist-select';
                checkbox.style.marginLeft = '10px';
                
                const firstCell = row.querySelector('td');
                if (firstCell) {
                    firstCell.insertBefore(checkbox, firstCell.firstChild);
                }
            }
        });
    }

    // Feature implementations
    async exportStudentGuidanceData() {
        console.log('📊 Exporting student guidance data...');
        
        const students = this.extractStudentDataFromNoor();
        if (students.length > 0) {
            const csv = this.convertToCSV(students);
            this.downloadFile(csv, `noor-student-guidance-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
            this.showNoorNotification(`تم تصدير ${students.length} طالب`, 'success');
        } else {
            this.showNoorNotification('لم يتم العثور على بيانات طلاب', 'warning');
        }
    }

    exportCurrentReportPage() {
        console.log('📄 Exporting current report page...');
        
        const reportTable = document.querySelector('#ctl00_PlaceHolderMain_rvStudentInfoReport_fixedTable');
        if (!reportTable) {
            this.showNoorNotification('لم يتم العثور على تقرير للتصدير', 'error');
            return;
        }
        
        const data = this.extractTableData(reportTable);
        if (data.length > 0) {
            const csv = this.convertToCSV(data);
            this.downloadFile(csv, `noor-report-page-${Date.now()}.csv`, 'text/csv');
            this.showNoorNotification(`تم تصدير ${data.length} صف من البيانات`, 'success');
        }
    }

    async exportAllReportPages() {
        console.log('📋 Exporting all report pages...');
        
        this.showNoorNotification('بدء التصدير الشامل...', 'info');
        
        let allData = [];
        let currentPage = 1;
        let hasMorePages = true;
        
        const progressEl = document.getElementById('eduassist-progress');
        
        while (hasMorePages) {
            progressEl.textContent = `جاري معالجة الصفحة ${currentPage}...`;
            
            // Extract current page data
            const pageData = this.extractCurrentPageData();
            if (pageData.length > 0) {
                allData = allData.concat(pageData);
                
                // Try to go to next page
                hasMorePages = await this.goToNextPage();
                currentPage++;
                
                // Wait a bit to avoid overwhelming the server
                await this.sleep(1000);
            } else {
                hasMorePages = false;
            }
            
            // Safety limit
            if (currentPage > 100) {
                this.showNoorNotification('تم الوصول للحد الأقصى للصفحات (100)', 'warning');
                break;
            }
        }
        
        if (allData.length > 0) {
            const csv = this.convertToCSV(allData);
            this.downloadFile(csv, `noor-complete-report-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
            this.showNoorNotification(`تم تصدير ${allData.length} طالب من ${currentPage - 1} صفحة`, 'success');
        }
        
        progressEl.textContent = '';
    }

    extractStudentDataFromNoor() {
        const students = [];
        
        // Look for various table formats in Noor
        const tables = document.querySelectorAll('table');
        
        tables.forEach(table => {
            if (this.containsStudentData(table)) {
                const rows = table.querySelectorAll('tbody tr');
                
                rows.forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells.length >= 3) {
                        const student = this.extractStudentFromRow(cells);
                        if (student && student.name) {
                            students.push(student);
                        }
                    }
                });
            }
        });
        
        return students;
    }

    extractStudentFromRow(cells) {
        // Extract student data from table row cells
        // This mimics the original extension's extraction logic
        
        const student = {
            name: '',
            id: '',
            nationalId: '',
            class: '',
            section: '',
            phone: '',
            guardianPhone: '',
            address: '',
            timestamp: new Date().toISOString(),
            source: 'noor',
            page: this.currentPage
        };
        
        // Try to map cells to student properties
        // This is a best-guess mapping that may need adjustment
        cells.forEach((cell, index) => {
            const text = cell.textContent.trim();
            
            if (index === 0 && text && !text.includes('العدد')) {
                student.name = text;
            } else if (index === 1 && text.length >= 8) {
                student.id = text;
            } else if (text.length === 10 && /^\d+$/.test(text)) {
                student.nationalId = text;
            } else if (text.includes('الصف') || (text.length <= 3 && /\d/.test(text))) {
                student.class = text;
            } else if (text.startsWith('05') && text.length === 10) {
                if (!student.phone) {
                    student.phone = text;
                } else {
                    student.guardianPhone = text;
                }
            }
        });
        
        return student.name ? student : null;
    }

    extractTableData(table) {
        const data = [];
        const headers = [];
        
        // Get headers
        const headerCells = table.querySelectorAll('thead th, tbody tr:first-child th');
        headerCells.forEach(cell => {
            headers.push(cell.textContent.trim());
        });
        
        // Get data rows
        const dataRows = table.querySelectorAll('tbody tr');
        dataRows.forEach(row => {
            const cells = row.querySelectorAll('td');
            const rowData = {};
            
            cells.forEach((cell, index) => {
                const header = headers[index] || `Column${index + 1}`;
                rowData[header] = cell.textContent.trim();
            });
            
            // Only add if row has meaningful data
            if (Object.values(rowData).some(val => val && val !== '')) {
                data.push(rowData);
            }
        });
        
        return data;
    }

    extractCurrentPageData() {
        // Extract data from current page
        const reportTable = document.querySelector('#ctl00_PlaceHolderMain_rvStudentInfoReport_fixedTable');
        if (reportTable) {
            return this.extractTableData(reportTable);
        }
        
        return this.extractStudentDataFromNoor();
    }

    async goToNextPage() {
        // Try to click next page button
        const nextButton = document.querySelector('input[title="Next Page"]') ||
                          document.querySelector('input[value="التالي"]') ||
                          document.querySelector('a[title="Next Page"]');
        
        if (nextButton && !nextButton.disabled) {
            nextButton.click();
            
            // Wait for page to load
            await this.sleep(2000);
            return true;
        }
        
        return false;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
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

    downloadFile(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    showNoorNotification(message, type = 'info') {
        // Create notification specific to Noor interface
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: ${this.getNotificationColor(type)};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 999999;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
            direction: rtl;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>${this.getNotificationIcon(type)}</span>
                <span>${message}</span>
            </div>
        `;
        
        // Add CSS animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
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

    // Stub implementations for future features
    autoFillMissingData() {
        this.showNoorNotification('التعبئة التلقائية قريباً', 'info');
    }

    calculateGrades() {
        this.showNoorNotification('حساب الدرجات قريباً', 'info');
    }

    exportGradesToExcel() {
        this.showNoorNotification('تصدير الدرجات قريباً', 'info');
    }

    showAttendanceStatistics() {
        this.showNoorNotification('إحصائيات الحضور قريباً', 'info');
    }

    exportAttendanceData() {
        this.showNoorNotification('تصدير الحضور قريباً', 'info');
    }

    analyzeTeacherPerformance() {
        this.showNoorNotification('تحليل أداء المعلمين قريباً', 'info');
    }

    showSchoolDashboard() {
        this.showNoorNotification('لوحة تحكم المدرسة قريباً', 'info');
    }

    enhancedStudentDataExport() {
        this.showNoorNotification('التصدير المحسن قريباً', 'info');
    }

    autoCollectStudentData() {
        this.showNoorNotification('الجمع التلقائي قريباً', 'info');
    }

    validateStudentData() {
        this.showNoorNotification('التحقق من البيانات قريباً', 'info');
    }

    showExportOptions() {
        this.showNoorNotification('خيارات التصدير قريباً', 'info');
    }

    customizeReport() {
        this.showNoorNotification('تخصيص التقرير قريباً', 'info');
    }

    showNoorNavigation() {
        this.showNoorNotification('التنقل السريع قريباً', 'info');
    }

    backupNoorData() {
        this.showNoorNotification('النسخ الاحتياطي قريباً', 'info');
    }

    autoNavigateAndExport() {
        this.showNoorNotification('التصفح التلقائي والتصدير قريباً', 'info');
    }
}

// Initialize Noor integration
window.noorIntegration = new NoorIntegration();

console.log('✅ Noor integration loaded successfully');