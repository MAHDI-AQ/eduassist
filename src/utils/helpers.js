/**
 * EduAssist Utility Helper Functions
 * Supporting functions for data manipulation, CSV export, and DOM utilities
 */

const EduAssistHelpers = {
    
    /**
     * CSV Export Utilities
     */
    csv: {
        /**
         * Convert array of objects to CSV string
         * @param {Array} data - Array of objects to convert
         * @param {Array} headers - Optional custom headers
         * @returns {string} CSV formatted string
         */
        arrayToCSV(data, headers = null) {
            if (!data || data.length === 0) return '';
            
            const csvHeaders = headers || Object.keys(data[0]);
            const csvRows = data.map(row => 
                csvHeaders.map(header => {
                    const value = row[header] || '';
                    // Escape quotes and wrap in quotes if contains comma/quote/newline
                    const escaped = String(value).replace(/"/g, '""');
                    return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
                }).join(',')
            );
            
            return [csvHeaders.join(','), ...csvRows].join('\n');
        },

        /**
         * Download data as CSV file
         * @param {Array} data - Data to export
         * @param {string} filename - Name of the file
         * @param {Array} headers - Optional custom headers
         */
        downloadCSV(data, filename, headers = null) {
            const csv = this.arrayToCSV(data, headers);
            const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            
            link.href = URL.createObjectURL(blob);
            link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            URL.revokeObjectURL(link.href);
        },

        /**
         * Convert HTML table to CSV
         * @param {HTMLElement} table - Table element
         * @param {boolean} includeHeaders - Whether to include table headers
         * @returns {string} CSV string
         */
        tableToCSV(table, includeHeaders = true) {
            const rows = [];
            
            if (includeHeaders) {
                const headerRow = table.querySelector('thead tr') || table.querySelector('tr');
                if (headerRow) {
                    const headers = Array.from(headerRow.querySelectorAll('th, td'))
                        .map(cell => cell.textContent.trim());
                    rows.push(headers);
                }
            }
            
            const dataRows = table.querySelectorAll('tbody tr, tr:not(:first-child)');
            dataRows.forEach(row => {
                const cells = Array.from(row.querySelectorAll('td, th'))
                    .map(cell => cell.textContent.trim());
                rows.push(cells);
            });
            
            return rows.map(row => 
                row.map(cell => {
                    const escaped = String(cell).replace(/"/g, '""');
                    return /[",\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
                }).join(',')
            ).join('\n');
        }
    },

    /**
     * DOM Utilities
     */
    dom: {
        /**
         * Create element with attributes and content
         * @param {string} tag - HTML tag name
         * @param {Object} attributes - Element attributes
         * @param {string|HTMLElement} content - Element content
         * @returns {HTMLElement} Created element
         */
        createElement(tag, attributes = {}, content = '') {
            const element = document.createElement(tag);
            
            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(element.style, value);
                } else if (key === 'class') {
                    element.className = value;
                } else if (key.startsWith('data-')) {
                    element.setAttribute(key, value);
                } else {
                    element[key] = value;
                }
            });
            
            if (typeof content === 'string') {
                element.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                element.appendChild(content);
            }
            
            return element;
        },

        /**
         * Wait for element to appear in DOM
         * @param {string} selector - CSS selector
         * @param {number} timeout - Timeout in milliseconds
         * @returns {Promise<HTMLElement>} Promise resolving to element
         */
        waitForElement(selector, timeout = 5000) {
            return new Promise((resolve, reject) => {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                    return;
                }

                const observer = new MutationObserver(() => {
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
        },

        /**
         * Add CSS styles to page
         * @param {string} css - CSS string
         */
        addCSS(css) {
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
        },

        /**
         * Show notification to user
         * @param {string} message - Notification message
         * @param {string} type - Notification type (success, error, info, warning)
         * @param {number} duration - Display duration in milliseconds
         */
        showNotification(message, type = 'info', duration = 3000) {
            const notification = this.createElement('div', {
                class: `eduassist-notification eduassist-notification-${type}`,
                style: {
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: type === 'success' ? '#4CAF50' : 
                               type === 'error' ? '#f44336' : 
                               type === 'warning' ? '#ff9800' : '#2196F3',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '4px',
                    zIndex: '999999',
                    fontSize: '14px',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                    maxWidth: '300px',
                    wordWrap: 'break-word'
                }
            }, message);

            document.body.appendChild(notification);

            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, duration);
        }
    },

    /**
     * Data Utilities
     */
    data: {
        /**
         * Deep clone object
         * @param {Object} obj - Object to clone
         * @returns {Object} Cloned object
         */
        deepClone(obj) {
            if (obj === null || typeof obj !== 'object') return obj;
            if (obj instanceof Date) return new Date(obj.getTime());
            if (obj instanceof Array) return obj.map(item => this.deepClone(item));
            
            const cloned = {};
            Object.keys(obj).forEach(key => {
                cloned[key] = this.deepClone(obj[key]);
            });
            return cloned;
        },

        /**
         * Filter array by multiple criteria
         * @param {Array} array - Array to filter
         * @param {Object} criteria - Filter criteria
         * @returns {Array} Filtered array
         */
        filterByCriteria(array, criteria) {
            return array.filter(item => {
                return Object.entries(criteria).every(([key, value]) => {
                    if (typeof value === 'string') {
                        return String(item[key]).toLowerCase().includes(value.toLowerCase());
                    }
                    return item[key] === value;
                });
            });
        },

        /**
         * Group array by property
         * @param {Array} array - Array to group
         * @param {string} property - Property to group by
         * @returns {Object} Grouped object
         */
        groupBy(array, property) {
            return array.reduce((groups, item) => {
                const key = item[property];
                groups[key] = groups[key] || [];
                groups[key].push(item);
                return groups;
            }, {});
        },

        /**
         * Calculate statistics for numeric array
         * @param {Array} numbers - Array of numbers
         * @returns {Object} Statistics object
         */
        calculateStats(numbers) {
            const validNumbers = numbers.filter(n => typeof n === 'number' && !isNaN(n));
            if (validNumbers.length === 0) return { count: 0, sum: 0, average: 0, min: 0, max: 0 };

            const sum = validNumbers.reduce((a, b) => a + b, 0);
            return {
                count: validNumbers.length,
                sum: sum,
                average: sum / validNumbers.length,
                min: Math.min(...validNumbers),
                max: Math.max(...validNumbers)
            };
        }
    },

    /**
     * String Utilities
     */
    string: {
        /**
         * Format Arabic date string
         * @param {string} dateStr - Date string
         * @returns {string} Formatted date
         */
        formatArabicDate(dateStr) {
            try {
                const date = new Date(dateStr);
                return date.toLocaleDateString('ar-SA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                });
            } catch (e) {
                return dateStr;
            }
        },

        /**
         * Clean and normalize Arabic text
         * @param {string} text - Text to clean
         * @returns {string} Cleaned text
         */
        cleanArabicText(text) {
            return String(text)
                .trim()
                .replace(/\s+/g, ' ')
                .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\s\d\(\)\-\/]/g, '');
        },

        /**
         * Generate safe filename from string
         * @param {string} str - String to convert
         * @returns {string} Safe filename
         */
        toSafeFilename(str) {
            return String(str)
                .replace(/[^a-zA-Z0-9\u0600-\u06FF\s\-\_]/g, '')
                .replace(/\s+/g, '_')
                .substring(0, 50);
        }
    },

    /**
     * Storage Utilities
     */
    storage: {
        /**
         * Get data from Chrome storage
         * @param {string} key - Storage key
         * @returns {Promise} Promise resolving to stored data
         */
        async get(key) {
            return new Promise((resolve) => {
                chrome.storage.local.get([key], (result) => {
                    resolve(result[key]);
                });
            });
        },

        /**
         * Set data in Chrome storage
         * @param {string} key - Storage key
         * @param {*} value - Value to store
         * @returns {Promise} Promise resolving when stored
         */
        async set(key, value) {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [key]: value }, resolve);
            });
        },

        /**
         * Clear specific key or all storage
         * @param {string} key - Key to clear (optional)
         * @returns {Promise} Promise resolving when cleared
         */
        async clear(key = null) {
            return new Promise((resolve) => {
                if (key) {
                    chrome.storage.local.remove([key], resolve);
                } else {
                    chrome.storage.local.clear(resolve);
                }
            });
        }
    },

    /**
     * Platform Detection
     */
    platform: {
        /**
         * Check if current page is Madrasati
         * @returns {boolean} True if on Madrasati
         */
        isMadrasati() {
            return window.location.hostname.includes('madrasati.sa');
        },

        /**
         * Check if current page is Noor
         * @returns {boolean} True if on Noor
         */
        isNoor() {
            return window.location.hostname.includes('noor.moe.gov.sa') || 
                   window.location.hostname.includes('moe.gov.sa');
        },

        /**
         * Get platform name
         * @returns {string} Platform name
         */
        getPlatformName() {
            if (this.isMadrasati()) return 'madrasati';
            if (this.isNoor()) return 'noor';
            return 'unknown';
        }
    }
};

// Make helpers available globally
if (typeof window !== 'undefined') {
    window.EduAssistHelpers = EduAssistHelpers;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EduAssistHelpers;
}