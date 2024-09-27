# JM Braseiro Receipt Generator

This project is a simple web application that generates professional-looking receipts (recibos) in PDF format using **jsPDF** and **autoTable**. Users can fill out a form with details such as the value, client name, and other information, and generate a PDF receipt. The app provides the option to download or delete the last saved receipt. The PDF includes an empty signature field for manual signing and a section for additional information.

## Features

- **Generate Receipts**: Users can input receipt details and generate a PDF receipt in real-time.
- **Download Last Receipt**: Users can download the most recent receipt generated, as long as it was created within the last 24 hours.
- **Delete Last Receipt**: Users can delete the last receipt saved in the browser's local storage.
- **Manual Signature**: The generated PDF includes an empty signature field for manual signing.
- **Additional Information Field**: An extra field labeled "Informação extra" can be left empty or filled in by the user.
- **Thank You Message**: The PDF includes a personalized thank-you message in Portuguese at the bottom of the receipt.

## Technologies Used

- **HTML5**
- **JavaScript**
- **jsPDF** for PDF generation
- **jsPDF-autoTable** for table formatting

## How to Use

1. **Fill in the Form**:
   - The form includes fields for value, client name, address, and other relevant receipt details.
   - Optionally, fill in the "Informação extra" field for additional information.

2. **Generate PDF**:
   - Click on the "Gerar PDF" button to generate a PDF file with the provided details. The PDF will include an empty signature field for manual signing.

3. **Download Last Receipt**:
   - If a receipt was generated within the last 24 hours, click "Baixe o último recibo" to download it.

4. **Delete Last Receipt**:
   - To remove the last saved receipt from the browser’s local storage, click "Remover último recibo salvo."
