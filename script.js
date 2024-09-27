// Download last saved PDF from localStorage
document.getElementById('downloadLastRecibo').addEventListener('click', function() {
    const storedData = localStorage.getItem('reciboData');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (Date.now() - parsedData.timestamp <= 24 * 60 * 60 * 1000) {
            const { valor, nomeCliente, endereco, importancia, referente, assinatura, data, extraInfo } = parsedData;
            const reciboNumber = Math.floor(Math.random() * 1000000); // Random Recibo Number
            generatePDF(reciboNumber, valor, nomeCliente, endereco, importancia, referente, assinatura, data, extraInfo);
        } else {
            alert('O último recibo expirou e foi removido.');
        }
    } else {
        alert('Nenhum recibo disponível.');
    }
});

// Remove last saved receipt from localStorage
document.getElementById('removeLastRecibo').addEventListener('click', function() {
    localStorage.removeItem('reciboData');
    alert('Último recibo salvo foi removido.');
});

// Ensure content is hidden and loader is shown while the page is loading
window.addEventListener('load', function() {
    // Hide the loader and display the content after the page has fully loaded
    document.getElementById('loader').style.display = 'none';
    document.getElementById('content').style.display = 'block';
});


function refreshPage() {
    location.reload();
  }

// Get today's date
const today = new Date();
const options = { year: 'numeric', month: 'long', day: 'numeric' };
const formattedDate = today.toLocaleDateString('pt-BR', options);

// Set the placeholder with the formatted date
document.getElementById('data').placeholder = `Catalão, ${formattedDate}`;


// Function to show loading message
function showLoading() {
    document.getElementById('loading').style.display = 'block';
}

// Function to hide loading message
function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

// Generate a new PDF and save to localStorage
document.getElementById('generatePDF').addEventListener('click', function() {
    const valor = document.getElementById('valor').value;
    const nomeCliente = document.getElementById('nomeCliente').value;
    const endereco = document.getElementById('endereco').value;
    const importancia = document.getElementById('importancia').value;
    const referente = document.getElementById('referente').value;
    const assinatura = ''; // Empty signature field for manual signing
    const data = document.getElementById('data').value;
    const extraInfo = document.getElementById('extraInfo').value;
    const reciboNumber = Math.floor(Math.random() * 1000000); // Random Recibo Number

    // Show loading message
    showLoading();

    // Generate PDF and save it to localStorage
    generatePDF(reciboNumber, valor, nomeCliente, endereco, importancia, referente, assinatura, data, extraInfo);

    // Save form data to localStorage
    const formData = { valor, nomeCliente, endereco, importancia, referente, assinatura, data, extraInfo, timestamp: Date.now() };
    localStorage.setItem('reciboData', JSON.stringify(formData));

    // Clear old data (older than 24 hours)
    const storedData = localStorage.getItem('reciboData');
    if (storedData) {
        const parsedData = JSON.parse(storedData);
        const currentTime = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (currentTime - parsedData.timestamp > twentyFourHours) {
            localStorage.removeItem('reciboData');
        }
    }
});

// Function to generate a professional-style PDF with signature image
function generatePDF(reciboNumber, valor, nomeCliente, endereco, importancia, referente, assinatura, data, extraInfo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth(); // Get the page width

    // Load and add logo image from path
    const logoImg = new Image();
    logoImg.src = 'jm-logo.png'; // Your logo file path

    const signatureImg = new Image();
    signatureImg.src = 'signature-jm.png'; // Signature image file path

    logoImg.onload = function() {
        doc.addImage(logoImg, 'PNG', 10, 10, 40, 40); // Add logo after it has loaded

        // Add title and content
        doc.setFontSize(22);
        doc.text('RECIBO', 105, 20, { align: 'center' });

        // Left-aligned text (R$ value)
        doc.setFontSize(14);
        doc.text(`Valor ${valor}`, 10, 60); // Positioned 10mm from the left

        // Right-aligned text (Recibo Number)
        doc.setFontSize(14);
        doc.text(`Recibo Nº: ${reciboNumber}`, pageWidth - 10 - doc.getTextWidth(`Recibo Nº: ${reciboNumber}`), 60); // Positioned from the right

        // Table with custom font size and special characters (emoji)
        doc.autoTable({
            startY: 70,
            head: [['Descrição', 'Detalhes']],
            body: [
                ['Recebi(emos) de', nomeCliente],
                ['Endereço', endereco],
                ['A importância de', importancia],
                ['Referente', referente],
                ['Data', data],
                ['Informação extra', extraInfo || ''], // Added the emoji here
            ],
            styles: { fontSize: 10 }, // Control the font size for the whole table
            headStyles: { fontSize: 13 }, // Font size for table headers
            bodyStyles: { fontSize: 11 }, // Font size for table body
        });

        // Load the signature image and append below the table
        signatureImg.onload = function() {
            doc.addImage(signatureImg, 'PNG', 10, doc.lastAutoTable.finalY + 20, 50, 20); // Add signature image

            // Emitente info with phone numbers below the signature
            doc.setFontSize(12);
            doc.text('JM Braseiro CPF/RG 68996934100', 10, doc.lastAutoTable.finalY + 50);
            doc.text('WhatsApp: (64) 98169-1099 / (64) 98169-5315', 10, doc.lastAutoTable.finalY + 60);

            // Add the thank-you message in Portuguese
            doc.setFontSize(11);
            doc.text('Obrigado por nos escolher!! Siga-nos no Instagram para saber mais @jmbraseiro', 10, doc.lastAutoTable.finalY + 80);

            // Save the PDF
            doc.save(`Recibo_JM_Braseiro_${reciboNumber}.pdf`);

            // Hide loading message once PDF is saved
            hideLoading();
        };
    };

    logoImg.onerror = function() {
        console.error('Failed to load image. Make sure the path is correct.');
        hideLoading(); // Hide loading message in case of error
    };

    signatureImg.onerror = function() {
        console.error('Failed to load signature image. Make sure the path is correct.');
        hideLoading(); // Hide loading message in case of error
    };
}
