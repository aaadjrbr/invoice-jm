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

// Function to generate a professional-style PDF
function generatePDF(reciboNumber, valor, nomeCliente, endereco, importancia, referente, assinatura, data, extraInfo) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Load and add image from path
    const img = new Image();
    img.src = 'jm-logo.png'; // Your logo file path

    img.onload = function() {
        doc.addImage(img, 'PNG', 10, 10, 40, 40); // Add image after it has loaded

        // Add title and content
        doc.setFontSize(22);
        doc.text('RECIBO', 105, 20, { align: 'center' });

        // Professional Invoice Style Table using autoTable
        doc.setFontSize(14);
        doc.text(`Recibo Nº: ${reciboNumber}`, 10, 60);

        // Access autoTable via jsPDF instance
        doc.autoTable({
            startY: 70,
            head: [['Descrição', 'Detalhes']],
            body: [
                ['Valor', `R$ ${valor}`],
                ['Recebido de', nomeCliente],
                ['Endereço', endereco],
                ['A importância de', importancia],
                ['Referente', referente],
                ['Data', data],
                ['Assinatura', assinatura || ''], // Empty for manual signature
                ['Informação extra', extraInfo || ''],
            ],
        });

        // Emitente Info with Phone Numbers
        doc.setFontSize(12);
        doc.text('Emitente: JM Braseiro CPF/RG 68996934100', 10, doc.lastAutoTable.finalY + 10);
        doc.text('Telefone: (64) 98169-1099 / (64) 98169-5315', 10, doc.lastAutoTable.finalY + 20);

        // Add the thank-you message in Portuguese
        doc.setFontSize(12);
        doc.text('Obrigado por nos escolher!! Siga-nos no Instagram para saber mais @jmbraseiro', 10, doc.lastAutoTable.finalY + 40);

        // Save the PDF
        doc.save(`Recibo_${reciboNumber}.pdf`);
    };

    img.onerror = function() {
        console.error('Failed to load image. Make sure the path is correct.');
    };
}
