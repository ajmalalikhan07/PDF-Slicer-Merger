// PDF Slicer & Merger Application
class PDFSlicerMerger {
    constructor() {
        this.uploadedFiles = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDragAndDrop();
        this.setupTabs();
    }

    setupEventListeners() {
        const fileInput = document.getElementById('fileInput');
        const browseBtn = document.getElementById('browseBtn');
        const dropZone = document.getElementById('dropZone');
        const sliceBtn = document.getElementById('sliceBtn');
        const mergeBtn = document.getElementById('mergeBtn');

        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        dropZone.addEventListener('click', () => fileInput.click());
        sliceBtn.addEventListener('click', () => this.slicePDF());
        mergeBtn.addEventListener('click', () => this.mergePDFs());
    }

    setupDragAndDrop() {
        const dropZone = document.getElementById('dropZone');

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, this.preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('border-blue-500', 'bg-blue-50'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('border-blue-500', 'bg-blue-50'), false);
        });

        dropZone.addEventListener('drop', (e) => this.handleDrop(e), false);
    }

    setupTabs() {
        const sliceTab = document.getElementById('sliceTab');
        const mergeTab = document.getElementById('mergeTab');
        const sliceContent = document.getElementById('sliceContent');
        const mergeContent = document.getElementById('mergeContent');

        sliceTab.addEventListener('click', () => {
            this.switchTab('slice', sliceTab, mergeTab, sliceContent, mergeContent);
        });

        mergeTab.addEventListener('click', () => {
            this.switchTab('merge', mergeTab, sliceTab, mergeContent, sliceContent);
        });
    }

    switchTab(activeTab, activeBtn, inactiveBtn, activeContent, inactiveContent) {
        // Update button styles
        activeBtn.classList.add('text-blue-600', 'border-blue-600');
        activeBtn.classList.remove('text-gray-500');
        inactiveBtn.classList.remove('text-blue-600', 'border-blue-600');
        inactiveBtn.classList.add('text-gray-500');

        // Update content visibility
        activeContent.classList.remove('hidden');
        inactiveContent.classList.add('hidden');

        // Update merge list if switching to merge tab
        if (activeTab === 'merge') {
            this.updateMergeList();
        }
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        this.processFiles([...files]);
    }

    handleFileSelect(e) {
        const files = e.target.files;
        this.processFiles([...files]);
    }

    async processFiles(files) {
        const pdfFiles = files.filter(file => file.type === 'application/pdf');
        
        if (pdfFiles.length === 0) {
            this.showToast('Please select PDF files only', 'error');
            return;
        }

        this.showLoading(true);

        try {
            for (const file of pdfFiles) {
                await this.addFile(file);
            }
            this.updateUI();
            this.showToast(`${pdfFiles.length} PDF file(s) uploaded successfully`, 'success');
        } catch (error) {
            console.error('Error processing files:', error);
            this.showToast('Error processing files', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async addFile(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pageCount = await this.getPDFPageCount(arrayBuffer);
            
            const fileData = {
                id: Date.now() + Math.random(),
                file: file,
                name: file.name,
                size: file.size,
                pageCount: pageCount,
                arrayBuffer: arrayBuffer
            };

            this.uploadedFiles.push(fileData);
        } catch (error) {
            console.error('Error adding file:', error);
            throw error;
        }
    }

    async getPDFPageCount(arrayBuffer) {
        try {
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            return pdfDoc.getPageCount();
        } catch (error) {
            console.error('Error getting page count:', error);
            return 0;
        }
    }

    updateUI() {
        this.renderFilesList();
        this.updatePDFSelect();
        this.showSections();
    }

    renderFilesList() {
        const filesList = document.getElementById('filesList');
        filesList.innerHTML = '';

        this.uploadedFiles.forEach((fileData, index) => {
            const fileCard = this.createFileCard(fileData, index);
            filesList.appendChild(fileCard);
        });
    }

    createFileCard(fileData, index) {
        const card = document.createElement('div');
        card.className = 'bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow duration-200';
        card.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1 min-w-0">
                    <div class="flex items-center mb-2">
                        <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                        <h3 class="text-sm font-medium text-gray-900 truncate">${fileData.name}</h3>
                    </div>
                    <div class="text-xs text-gray-500 space-y-1">
                        <div>Pages: ${fileData.pageCount}</div>
                        <div>Size: ${this.formatFileSize(fileData.size)}</div>
                    </div>
                </div>
                <button onclick="app.removeFile(${index})" class="text-red-500 hover:text-red-700 ml-2">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        return card;
    }

    removeFile(index) {
        this.uploadedFiles.splice(index, 1);
        this.updateUI();
        
        if (this.uploadedFiles.length === 0) {
            this.hideSections();
        }
        
        this.showToast('File removed', 'info');
    }

    updatePDFSelect() {
        const select = document.getElementById('pdfSelect');
        select.innerHTML = '<option value="">Choose a PDF file...</option>';

        this.uploadedFiles.forEach((fileData, index) => {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = `${fileData.name} (${fileData.pageCount} pages)`;
            select.appendChild(option);
        });
    }

    updateMergeList() {
        const mergeList = document.getElementById('mergeList');
        mergeList.innerHTML = '';

        this.uploadedFiles.forEach((fileData, index) => {
            const item = document.createElement('div');
            item.className = 'flex items-center justify-between bg-gray-50 rounded-lg p-3 cursor-move';
            item.draggable = true;
            item.dataset.index = index;
            item.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-grip-vertical text-gray-400 mr-3"></i>
                    <i class="fas fa-file-pdf text-red-500 mr-2"></i>
                    <span class="text-sm font-medium text-gray-900">${fileData.name}</span>
                    <span class="text-xs text-gray-500 ml-2">(${fileData.pageCount} pages)</span>
                </div>
            `;

            // Add drag and drop for reordering
            item.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
            });

            item.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            item.addEventListener('drop', (e) => {
                e.preventDefault();
                const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                const dropIndex = parseInt(e.target.closest('[data-index]').dataset.index);
                this.reorderFiles(dragIndex, dropIndex);
            });

            mergeList.appendChild(item);
        });
    }

    reorderFiles(fromIndex, toIndex) {
        const [movedFile] = this.uploadedFiles.splice(fromIndex, 1);
        this.uploadedFiles.splice(toIndex, 0, movedFile);
        this.updateMergeList();
        this.updatePDFSelect();
        this.renderFilesList();
    }

    async slicePDF() {
        const selectElement = document.getElementById('pdfSelect');
        const pageRangeInput = document.getElementById('pageRange');
        
        const selectedIndex = selectElement.value;
        const pageRange = pageRangeInput.value.trim();

        if (!selectedIndex) {
            this.showToast('Please select a PDF file', 'error');
            return;
        }

        if (!pageRange) {
            this.showToast('Please enter a page range', 'error');
            return;
        }

        try {
            this.showLoading(true);
            
            const fileData = this.uploadedFiles[selectedIndex];
            const pages = this.parsePageRange(pageRange, fileData.pageCount);
            
            if (pages.length === 0) {
                this.showToast('Invalid page range', 'error');
                return;
            }

            const slicedPDF = await this.extractPages(fileData.arrayBuffer, pages);
            const fileName = `${fileData.name.replace('.pdf', '')}_sliced.pdf`;
            
            this.downloadPDF(slicedPDF, fileName);
            this.showResult('slice', fileName, pages.length);
            this.showToast('PDF sliced successfully!', 'success');

        } catch (error) {
            console.error('Error slicing PDF:', error);
            this.showToast('Error slicing PDF', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    async mergePDFs() {
        if (this.uploadedFiles.length < 2) {
            this.showToast('Please upload at least 2 PDF files to merge', 'error');
            return;
        }

        try {
            this.showLoading(true);
            
            const mergedPDF = await PDFLib.PDFDocument.create();
            let totalPages = 0;

            for (const fileData of this.uploadedFiles) {
                const pdf = await PDFLib.PDFDocument.load(fileData.arrayBuffer);
                const pages = await mergedPDF.copyPages(pdf, pdf.getPageIndices());
                pages.forEach(page => mergedPDF.addPage(page));
                totalPages += pdf.getPageCount();
            }

            const pdfBytes = await mergedPDF.save();
            const fileName = 'merged_document.pdf';
            
            this.downloadPDF(pdfBytes, fileName);
            this.showResult('merge', fileName, totalPages);
            this.showToast('PDFs merged successfully!', 'success');

        } catch (error) {
            console.error('Error merging PDFs:', error);
            this.showToast('Error merging PDFs', 'error');
        } finally {
            this.showLoading(false);
        }
    }

    parsePageRange(range, maxPages) {
        const pages = [];
        const parts = range.split(',');

        for (const part of parts) {
            const trimmedPart = part.trim();
            
            if (trimmedPart.includes('-')) {
                const [start, end] = trimmedPart.split('-').map(num => parseInt(num.trim()));
                if (start && end && start <= end && start >= 1 && end <= maxPages) {
                    for (let i = start; i <= end; i++) {
                        pages.push(i - 1); // Convert to 0-based index
                    }
                }
            } else {
                const pageNum = parseInt(trimmedPart);
                if (pageNum >= 1 && pageNum <= maxPages) {
                    pages.push(pageNum - 1); // Convert to 0-based index
                }
            }
        }

        return [...new Set(pages)].sort((a, b) => a - b); // Remove duplicates and sort
    }

    async extractPages(arrayBuffer, pageIndices) {
        const sourcePDF = await PDFLib.PDFDocument.load(arrayBuffer);
        const newPDF = await PDFLib.PDFDocument.create();
        
        const pages = await newPDF.copyPages(sourcePDF, pageIndices);
        pages.forEach(page => newPDF.addPage(page));
        
        return await newPDF.save();
    }

    downloadPDF(pdfBytes, fileName) {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    showResult(operation, fileName, pageCount) {
        const resultsSection = document.getElementById('resultsSection');
        const resultsContent = document.getElementById('resultsContent');
        
        const operationText = operation === 'slice' ? 'Sliced' : 'Merged';
        const icon = operation === 'slice' ? 'fa-cut' : 'fa-layer-group';
        
        resultsContent.innerHTML = `
            <div class="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                <div class="flex items-center">
                    <i class="fas ${icon} text-green-600 mr-3"></i>
                    <div>
                        <h3 class="text-sm font-medium text-green-900">${operationText} PDF Ready</h3>
                        <p class="text-sm text-green-700">${fileName} (${pageCount} pages)</p>
                    </div>
                </div>
                <div class="flex items-center space-x-2">
                    <i class="fas fa-check-circle text-green-600"></i>
                    <span class="text-sm text-green-700">Downloaded</span>
                </div>
            </div>
        `;
        
        resultsSection.classList.remove('hidden');
    }

    showSections() {
        document.getElementById('filesSection').classList.remove('hidden');
        document.getElementById('actionsSection').classList.remove('hidden');
    }

    hideSections() {
        document.getElementById('filesSection').classList.add('hidden');
        document.getElementById('actionsSection').classList.add('hidden');
        document.getElementById('resultsSection').classList.add('hidden');
    }

    showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (show) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        
        const bgColor = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500',
            warning: 'bg-yellow-500'
        }[type] || 'bg-blue-500';

        const icon = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            info: 'fa-info-circle',
            warning: 'fa-exclamation-triangle'
        }[type] || 'fa-info-circle';
        
        toast.className = `toast ${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center min-w-80`;
        toast.innerHTML = `
            <i class="fas ${icon} mr-3"></i>
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        container.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }
        }, 5000);
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}

// Initialize the application
const app = new PDFSlicerMerger();
