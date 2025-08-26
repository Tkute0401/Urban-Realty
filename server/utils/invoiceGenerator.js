const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class InvoiceGenerator {
  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      margin: 50
    });
  }

  generateInvoice(invoiceData) {
    const {
      invoiceNumber,
      invoiceDate,
      dueDate,
      customerInfo,
      subscriptionInfo,
      billingDetails,
      totalAmount,
      currency = 'USD'
    } = invoiceData;

    // Header
    this.generateHeader();
    
    // Invoice details
    this.generateInvoiceDetails(invoiceNumber, invoiceDate, dueDate);
    
    // Customer and company info
    this.generateCustomerInfo(customerInfo);
    
    // Subscription details
    this.generateSubscriptionDetails(subscriptionInfo);
    
    // Billing breakdown
    this.generateBillingBreakdown(billingDetails);
    
    // Total
    this.generateTotal(totalAmount, currency);
    
    // Footer
    this.generateFooter();
    
    return this.doc;
  }

  generateHeader() {
    this.doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .fillColor('#78CADC')
      .text('REAL ESTATE PLATFORM', { align: 'center' });
    
    this.doc
      .fontSize(14)
      .font('Helvetica')
      .fillColor('#666')
      .text('Professional Property Management Solutions', { align: 'center' });
    
    this.doc.moveDown(2);
  }

  generateInvoiceDetails(invoiceNumber, invoiceDate, dueDate) {
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#333');
    
    this.doc.text(`Invoice #: ${invoiceNumber}`);
    this.doc.text(`Date: ${new Date(invoiceDate).toLocaleDateString()}`);
    this.doc.text(`Due Date: ${new Date(dueDate).toLocaleDateString()}`);
    
    this.doc.moveDown(2);
  }

  generateCustomerInfo(customerInfo) {
    const { name, email, address } = customerInfo;
    
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text('Bill To:');
    
    this.doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#666');
    
    this.doc.text(name);
    this.doc.text(email);
    if (address) {
      this.doc.text(address);
    }
    
    this.doc.moveDown(2);
  }

  generateSubscriptionDetails(subscriptionInfo) {
    const { name, description, billingCycle, startDate, endDate } = subscriptionInfo;
    
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text('Subscription Details:');
    
    this.doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor('#666');
    
    this.doc.text(`Plan: ${name}`);
    this.doc.text(`Description: ${description}`);
    this.doc.text(`Billing Cycle: ${billingCycle}`);
    this.doc.text(`Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`);
    
    this.doc.moveDown(2);
  }

  generateBillingBreakdown(billingDetails) {
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor('#333')
      .text('Billing Breakdown:');
    
    // Create table headers
    const tableTop = this.doc.y;
    const itemX = 50;
    const descriptionX = 150;
    const amountX = 400;
    const widthX = 100;
    
    this.doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .fillColor('#333');
    
    this.doc.text('Item', itemX, tableTop);
    this.doc.text('Description', descriptionX, tableTop);
    this.doc.text('Amount', amountX, tableTop);
    
    // Draw table lines
    this.doc
      .strokeColor('#ccc')
      .lineWidth(1)
      .moveTo(itemX, tableTop + 20)
      .lineTo(itemX + 450, tableTop + 20)
      .stroke();
    
    let currentY = tableTop + 30;
    
    billingDetails.forEach((item, index) => {
      this.doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor('#666');
      
      this.doc.text(item.name, itemX, currentY);
      this.doc.text(item.description, descriptionX, currentY);
      this.doc.text(`$${item.amount.toFixed(2)}`, amountX, currentY);
      
      currentY += 20;
      
      // Draw separator line
      if (index < billingDetails.length - 1) {
        this.doc
          .strokeColor('#eee')
          .lineWidth(0.5)
          .moveTo(itemX, currentY + 5)
          .lineTo(itemX + 450, currentY + 5)
          .stroke();
        currentY += 10;
      }
    });
    
    this.doc.y = currentY + 10;
  }

  generateTotal(totalAmount, currency) {
    this.doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('#333');
    
    this.doc.text(`Total Amount: $${totalAmount.toFixed(2)} ${currency}`, { align: 'right' });
    
    this.doc.moveDown(2);
  }

  generateFooter() {
    this.doc
      .fontSize(10)
      .font('Helvetica')
      .fillColor('#999')
      .text('Thank you for your business!', { align: 'center' });
    
    this.doc
      .fontSize(8)
      .text('For any questions regarding this invoice, please contact our support team.', { align: 'center' });
    
    this.doc
      .text('Real Estate Platform - Professional Property Management Solutions', { align: 'center' });
  }

  // Generate invoice and save to file
  async saveInvoiceToFile(invoiceData, filename) {
    return new Promise((resolve, reject) => {
      const filePath = path.join(__dirname, '../public/invoices', filename);
      
      // Ensure directory exists
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const writeStream = fs.createWriteStream(filePath);
      this.doc.pipe(writeStream);
      
      writeStream.on('finish', () => {
        resolve(filePath);
      });
      
      writeStream.on('error', (error) => {
        reject(error);
      });
      
      this.doc.end();
    });
  }

  // Generate invoice and return as buffer
  generateInvoiceBuffer(invoiceData) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      
      this.doc.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      this.doc.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });
      
      this.doc.on('error', (error) => {
        reject(error);
      });
      
      this.generateInvoice(invoiceData);
      this.doc.end();
    });
  }
}

module.exports = InvoiceGenerator;