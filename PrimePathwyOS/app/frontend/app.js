document.addEventListener('DOMContentLoaded', () => {
    // Navigation Logic
    const navLinks = document.querySelectorAll('nav a');
    const views = document.querySelectorAll('.view');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active nav
            document.querySelectorAll('nav li').forEach(li => li.classList.remove('active'));
            e.target.parentElement.classList.add('active');

            // Show target view
            const targetId = e.target.getAttribute('data-target');
            views.forEach(view => {
                if(view.id === targetId) {
                    view.classList.remove('hidden-view');
                    view.classList.add('active-view');
                } else {
                    view.classList.add('hidden-view');
                    view.classList.remove('active-view');
                }
            });
        });
    });

    // Health Check Logic
    const checkHealth = async () => {
        const indicator = document.getElementById('health-indicator');
        const text = document.getElementById('health-text');
        
        try {
            const res = await fetch('/api/health');
            const data = await res.json();
            
            if(data.status === 'PASS') {
                indicator.className = 'status-indicator pass';
                text.textContent = 'System Integrity: PASS';
                text.style.color = 'var(--success)';
            } else {
                throw new Error('Health check failed');
            }
        } catch (error) {
            indicator.className = 'status-indicator fail';
            text.textContent = 'System Integrity: FAIL';
            text.style.color = 'var(--danger)';
        }
    };

    // Run health check on load and every 30s
    checkHealth();
    setInterval(checkHealth, 30000);

    // File Upload Logic (Drag & Drop)
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadStatus = document.getElementById('upload-status');

    if(dropZone) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
        });

        dropZone.addEventListener('drop', (e) => {
            let dt = e.dataTransfer;
            let files = dt.files;
            handleFiles(files);
        });

        fileInput.addEventListener('change', function() {
            handleFiles(this.files);
        });

        function handleFiles(files) {
            ([...files]).forEach(uploadFile);
        }

        async function uploadFile(file) {
            let formData = new FormData();
            formData.append('file', file);
            
            uploadStatus.innerHTML = `<p style="color: var(--gold-main)">Processing ${file.name} (OCR Running)...</p>`;

            try {
                const response = await fetch('/api/upload/receipt', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if(response.ok) {
                    uploadStatus.innerHTML = `
                        <div style="padding: 15px; border: 1px solid var(--success); border-radius: 4px; background: rgba(3, 218, 198, 0.1);">
                            <p style="color: var(--success); margin-bottom: 10px;">✅ Upload & OCR Successful</p>
                            <p><strong>Vendor:</strong> ${result.ocr_data.vendor || 'N/A'}</p>
                            <p><strong>Date:</strong> ${result.ocr_data.date || 'N/A'}</p>
                            <p><strong>Amount:</strong> $${result.ocr_data.amount || '0.00'}</p>
                        </div>
                    `;
                } else {
                    throw new Error(result.detail || 'Upload failed');
                }
            } catch (error) {
                uploadStatus.innerHTML = `<p style="color: var(--danger)">❌ Error: ${error.message}</p>`;
            }
        }
    }
});
