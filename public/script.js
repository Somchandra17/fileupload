const requestTypeSelect = document.getElementById('requestType');
const fileInput = document.getElementById('fileInput');
const filenameInput = document.getElementById('filenameInput');
const submitButton = document.getElementById('submitButton');
const uploadSection = document.getElementById('uploadSection');
const downloadSection = document.getElementById('downloadSection');
const progressBar = document.getElementById('progressBar');
const progressIndicator = document.getElementById('progressIndicator');
const filesList = document.getElementById('filesList');

// Fetch and display the list of files on page load 
fetchAvailableFiles();

// Event Listeners
requestTypeSelect.addEventListener('change', toggleInputSections);
submitButton.addEventListener('click', handleSubmit);
fileInput.addEventListener('change', () => {
    submitButton.disabled = false; // Enable submit button when file is selected
});


// UI Handling 
function toggleInputSections() {
  const selectedType = requestTypeSelect.value;
  if (selectedType === 'POST') {
    uploadSection.style.display = 'block';
    downloadSection.style.display = 'none';
  } else if (selectedType === 'GET') {
    uploadSection.style.display = 'none';
    downloadSection.style.display = 'block';
  }
}

function handleSubmit() {
  const requestType = requestTypeSelect.value;

  if (requestType === 'POST') {
     handleFileUpload();
  } else if (requestType === 'GET') {
     handleFileDownload();
  }
}

// Upload Logic
function handleFileUpload() {
  const files = fileInput.files;
  if (files.length === 0) return;

  const formData = new FormData();
  formData.append('files', files[0]); 

  const xhr = new XMLHttpRequest();
  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      updateProgressBar(percentComplete);
    } 
  });

  xhr.open('POST', '/upload');
  xhr.send(formData);

  showProgressBar(); 
  resetForm();

  xhr.onload = () => { 
    if (xhr.status === 200) {
        fetchAvailableFiles(); 
    } else {
        console.error("Upload failed");
    }
  }
}

// Download Logic 
function handleFileDownload() {
  const filename = filenameInput.value;
  if (!filename) return; 

  window.location.href = `/download/${filename}`;
  resetForm(); 
}


// Progress Bar Functions 
function showProgressBar() {
  progressBar.style.display = 'block';
}

function updateProgressBar(percentage) {
  progressIndicator.style.width = `${percentage}%`;
}

function resetForm() {
  fileInput.value = '';
  filenameInput.value = '';
  submitButton.disabled = true;
  progressBar.style.display = 'none';
  progressIndicator.style.width = '0%';
}


// Files List Functions
function fetchAvailableFiles() {
  fetch('/list-files')
    .then(response => response.json())
    .then(data => {
      if (data.error) {
        console.error('Error fetching files:', data.error);
      } else {
        displayFileList(data.files);
      }
    });
}

function displayFileList(files) {
    filesList.innerHTML = '<h2>Available Files:</h2>'; 
    if (files.length === 0) {
        filesList.append("No files uploaded yet.");
        return;
    }

    const list = document.createElement('ul');
    files.forEach(file => {
        const listItem = document.createElement('li');
        listItem.textContent = file;
        list.appendChild(listItem); 
    });
    filesList.appendChild(list); 
}
