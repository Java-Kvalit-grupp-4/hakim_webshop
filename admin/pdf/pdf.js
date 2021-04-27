const pdfButton = document.getElementById("#generate-pdf")

pdfButton.addEventListener('click', () => {
    let pdf = document.getElementById('pdf')
    html2pdf(pdf).save()
});