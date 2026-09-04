const imageInput = document.getElementById('imageInput');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const encodeBtn = document.getElementById('encodeBtn');
const decodeBtn = document.getElementById('decodeBtn');
const secretMessage = document.getElementById('secretMessage');
const decodedMessage = document.getElementById('decodedMessage');

let originalImage = null;

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            originalImage = img;
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            canvas.style.display = 'block';
        };
        img.src = event.target.value ?? event.target.result;
    };
    reader.readAsDataURL(file);
});

encodeBtn.addEventListener('click', () => {
    if (!originalImage) {
        alert('Please upload an image first.');
        return;
    }

    const text = secretMessage.value;
    if (!text) {
        alert('Please enter a message to hide.');
        return;
    }

    // Convert message to binary representation, adding a null terminator (0x00) at the end
    let binaryMessage = '';
    for (let i = 0; i < text.length; i++) {
        let bin = text.charCodeAt(i).toString(2);
        binaryMessage += bin.padStart(8, '0');
    }
    binaryMessage += '00000000'; // End of message marker

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    if (binaryMessage.length > data.length) {
        alert('Image is too small to hold this entire message.');
        return;
    }

    // Inject binary data into the LSB of image data channels
    for (let i = 0; i < binaryMessage.length; i++) {
        // Clear the lowest bit and set it to the message bit
        data[i] = (data[i] & 0xFE) | parseInt(binaryMessage[i]);
    }

    ctx.putImageData(imgData, 0, 0);

    // Force download as a lossless PNG
    const link = document.createElement('a');
    link.download = 'encoded_image.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
});

decodeBtn.addEventListener('click', () => {
    if (!originalImage) {
        alert('Please upload an encoded image.');
        return;
    }

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;

    let binaryMessage = '';
    let extractedText = '';

    for (let i = 0; i < data.length; i++) {
        // Extract the lowest bit
        binaryMessage += (data[i] & 1).toString();

        // Every 8 bits, evaluate the character
        if (binaryMessage.length === 8) {
            const charCode = parseInt(binaryMessage, 2);
            
            // Break if we hit the null terminator we injected
            if (charCode === 0) {
                break;
            }
            
            extractedText += String.fromCharCode(charCode);
            binaryMessage = ''; // Reset buffer for next char
        }
    }

    if (extractedText.length === 0) {
        decodedMessage.value = "No hidden message found, or data is corrupt.";
    } else {
        decodedMessage.value = extractedText;
    }
});