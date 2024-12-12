let filePath = ''


document.getElementById("segment-algorithm1").addEventListener("click", segment(1));
document.getElementById("segment-algorithm2").addEventListener("click", segment(2));
document.getElementById("segment-algorithm3").addEventListener("click", segment(3));
document.getElementById("segment-algorithm4").addEventListener("click", segment(4));

document.getElementById('chooseSong').addEventListener('click', () => {
    document.getElementById('fileInput').click();
});

document.getElementById('fileInput').addEventListener('change', (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        // Display the file path
        document.getElementById('filePath').textContent = `Selected file: ${file.name}`;
        console.log('File path:', file.path); // This is available in Electron or environments with full file access
        filePath = file.path;
    } else {
        document.getElementById('filePath').textContent = 'No file selected.';
    }
});

// runs the segmentation algorithm
async function segment(algorithm) {
    // const inputName = "C:\\Users\\sethb\\OneDrive - Worcester Polytechnic Institute (wpi.edu)\\gr-MQP-MLSongMap\\General\\Songs and Annotations\\Songs\\0043Carly Rae Jepsen  Call Me Maybe.wav"; // Example input data
    const inputName = filePath;
    try {
        // Send a POST request to the Python server
        const response = await fetch('http://127.0.0.1:5000/call-python', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ song: inputName, algorithm : algorithm }),
        });

        // Parse the JSON response
        const data = await response.json();
        updateSegmentElementsList(data)
    } catch (error) {
        console.error('Error:', error);
    }
}

// Updates the segment elements and display in table
function updateSegmentElementsList(elements) {
    const tbody = document.getElementById('segment-elements');
    tbody.innerHTML = ''
    elements.forEach(element => {
        let tr = document.createElement('tr');
        element.forEach(item => {
            let td = document.createElement('td');
            td.textContent = item
            tr.appendChild(td)
        });
        tbody.appendChild(tr);
    });
}