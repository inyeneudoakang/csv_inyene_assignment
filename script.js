document.addEventListener('DOMContentLoaded', () => {
    const csvFileInput = document.getElementById('csvFileInput');
    const backBtn = document.getElementById('backBtn');
    const forwardBtn = document.getElementById('forwardBtn');
    const saveToJsonBtn = document.getElementById('saveToJsonBtn');
    const recordDisplay = document.getElementById('recordDisplay');

    let records = [];
    let currentRecordIndex = 0;

    csvFileInput.addEventListener('change', handleFileUpload);
    backBtn.addEventListener('click', showPreviousRecord);
    forwardBtn.addEventListener('click', showNextRecord);
    saveToJsonBtn.addEventListener('click', exportToJson);

    function handleFileUpload(event) {
        const file = event.target.files[0];

        if (file && file.type === 'text/csv') {
            const reader = new FileReader();

            reader.onload = function (e) {
                records = parseCSV(e.target.result);
                currentRecordIndex = 0;
                displayCurrentRecord();
                updateButtonStates();
            };

            reader.readAsText(file);
        } else {
            alert('Please upload a valid CSV file.');
        }
    }

    function parseCSV(csvContent) {
        return csvContent.split('\n').map(row => row.split(','));
    }

    function displayCurrentRecord() {
        const currentRecord = records[currentRecordIndex];
        recordDisplay.textContent = JSON.stringify(currentRecord, null, 2);
    }

    function showPreviousRecord() {
        if (currentRecordIndex > 0) {
            currentRecordIndex--;
            displayCurrentRecord();
            updateButtonStates();
        }
    }

    function showNextRecord() {
        if (currentRecordIndex < records.length - 1) {
            currentRecordIndex++;
            displayCurrentRecord();
            updateButtonStates();
        }
    }

    function exportToJson() {
        const currentRecord = records[currentRecordIndex];
        const jsonData = JSON.stringify(currentRecord, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });

        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'record.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function updateButtonStates() {
        backBtn.disabled = currentRecordIndex === 0;
        forwardBtn.disabled = currentRecordIndex === records.length - 1;
        saveToJsonBtn.disabled = records.length === 0;
    }
});
