"use client";
import React, { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import Modal from 'react-modal';

const pdfDoc = await PDFDocument.create();
const page = pdfDoc.addPage([600, 800]); // Page size: 600x800

const font = await pdfDoc.embedStandardFont(StandardFonts.HelveticaBold);
const titleFont = await pdfDoc.embedStandardFont(StandardFonts.HelveticaBold);

interface ReservationProps {
  reservation_id: number;
  hotel_name: string;
  room_number: string;
  room_type: string;
  status: string;
  start_date: string;
  end_date: string;
  total_price: number;
}

function createTitel(){
  const checkoutText = 'Checkout';
  const checkoutTextWidth = titleFont.widthOfTextAtSize(checkoutText, 24);
  const checkoutX = page.getWidth() / 2 - checkoutTextWidth / 2;
  page.drawText(checkoutText, {
    x: checkoutX,
    y: 750, // Vertical position
    size: 24,
    font: titleFont,
    color: rgb(0, 0, 1),
  });

}


function createReservations(y_offset: number, reservations: ReservationProps[]){
  for (let i = 0; i < reservations.length; i++) {
    const reservation = reservations[i];
    const yPosition = y_offset - (i * 20); // Adjust vertical position for each reservation
    page.drawText(`Reservation ID: `, { x: 50, y: yPosition, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`${reservation.reservation_id}`, { x: 250, y: yPosition, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Hotel Name: `, { x: 50, y: yPosition - 20, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`${reservation.hotel_name}`, { x: 250, y: yPosition - 20, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Room Number: `, { x: 50, y: yPosition - 40, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`${reservation.room_number}`, { x: 250, y: yPosition - 40, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Room Type: `, { x: 50, y: yPosition - 60, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`${reservation.room_type}`, { x: 250, y: yPosition - 60, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Status: `, { x: 50, y: yPosition - 80, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`${reservation.status}`, { x: 250, y: yPosition - 80, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`Start Date: `, { x: 50, y: yPosition - 100, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`${reservation.start_date}`, { x: 250, y: yPosition - 100, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`End Date: `, { x: 50, y: yPosition - 120, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`${reservation.end_date}`, { x: 250, y: yPosition - 120, size: 12, font, color: rgb(0, 0, 0) });  
    page.drawText(`Total Price: `, { x: 50, y: yPosition - 140, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText(`$${reservation.total_price.toFixed(2)}`, { x: 250, y: yPosition - 140, size: 12, font, color: rgb(0, 0, 0) });
    page.drawText('-------------------------------------------------------', {
      x: 50,
      y: yPosition - 160,
      size: 12,
      font,
      color: rgb(0, 0, 0),
    });
    y_offset -= 180; // Adjust y_offset for the next reservation
  }
  y_offset -= 40; // Add some space after the last reservation
  page.drawText('Total for All Reservations:', {
    x: 50, // Right-aligned at x=400
    y: y_offset,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });
  const total = reservations.reduce((sum, reservation) => sum + reservation.total_price, 0);
  page.drawText(`$${total.toFixed(2)}`, {
    x: 250, // Right-aligned at x=400
    y: y_offset,
    size: 14,
    font,
    color: rgb(0, 0, 0),
  });
  return y_offset; // Return the new y_offset after drawing all reservations

}

function TotalPayment(y_offset: number, total: number) {
  const paymentText = 'Total Payment';
  const paymentTextWidth = titleFont.widthOfTextAtSize(paymentText, 20);
  const paymentX = page.getWidth() / 2 - paymentTextWidth / 2;
  page.drawText(paymentText, {
    x: paymentX,
    y: y_offset, // Vertical position
    size: 20,
    font: titleFont,
    color: rgb(0, 0, 1),
  });
  const paymentDetails = [
    { label: 'Subtotal (Flights):', value: '$0.00' },
    { label: 'Subtotal (Hotel):', value: '$164.19' },
    { label: 'Total Amount:', value: '$164.19' },
  ];
  y_offset -= 50; // Starting vertical position
}


const PDFComponent: React.FC = () => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to create PDF
  const createPDF = async () => {

    // Draw header: Checkout (centered)
    createTitel()
    // Draw section: Hotel Reservations (centered)
    const reservationsText = 'Hotel Reservations';
    const reservationsTextWidth = titleFont.widthOfTextAtSize(reservationsText, 20);
    const reservationsX = page.getWidth() / 2 - reservationsTextWidth / 2;
    page.drawText(reservationsText, {
      x: reservationsX,
      y: 700, // Vertical position
      size: 20,
      font: titleFont,
      color: rgb(0, 0, 1),
    });

    var yOffset = createReservations(650, [
      {
        reservation_id: 1,
        hotel_name: 'Hotel California',
        room_number: '101',
        room_type: 'Deluxe Suite',
        status: 'Confirmed',
        start_date: '2023-10-01',
        end_date: '2023-10-05',
        total_price: 164.19,
      },
      {
        reservation_id: 2,
        hotel_name: 'Grand Hotel',
        room_number: '202',
        room_type: 'Standard Room',
        status: 'Pending',
        start_date: '2023-10-10',
        end_date: '2023-10-15',
        total_price: 200.00,
      },
      {
        reservation_id: 1,
        hotel_name: 'Hotel California',
        room_number: '101',
        room_type: 'Deluxe Suite',
        status: 'Confirmed',
        start_date: '2023-10-01',
        end_date: '2023-10-05',
        total_price: 164.19,
      },
    ]);

    // Draw total for all reservations (right-aligned)
    

    // Draw section: Total Payment (centered)
    // const paymentText = 'Total Payment';
    // const paymentTextWidth = titleFont.widthOfTextAtSize(paymentText, 20);
    // const paymentX = page.getWidth() / 2 - paymentTextWidth / 2;
    // page.drawText(paymentText, {
    //   x: paymentX,
    //   y: 500, // Vertical position
    //   size: 20,
    //   font: titleFont,
    //   color: rgb(0, 0, 1),
    // });

    // // Draw payment details
    // const paymentDetails = [
    //   { label: 'Subtotal (Flights):', value: '$0.00' },
    //   { label: 'Subtotal (Hotel):', value: '$164.19' },
    //   { label: 'Total Amount:', value: '$164.19' },
    // ];

    // yOffset = 450; // Starting vertical position
    // paymentDetails.forEach(({ label, value }) => {
    //   page.drawText(label, {
    //     x: 50, // Fixed horizontal position for labels
    //     y: yOffset,
    //     size: 12,
    //     font,
    //     color: rgb(0, 0, 0),
    //   });
    //   page.drawText(value, {
    //     x: 500, // Fixed horizontal position for values
    //     y: yOffset,
    //     size: 12,
    //     font,
    //     color: rgb(0, 0, 0),
    //   });
    //   yOffset -= 20; // Move up for the next line
    // });

    // Save the PDF document
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    setPdfUrl(url); // Store the generated PDF URL for preview and download
  };

  // Function to handle preview (open modal)
  const handlePreview = () => {
    setIsModalOpen(true); // Open modal with PDF preview
  };

  // Function to handle download
  const handleDownload = () => {
    if (pdfUrl) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      a.download = 'generated.pdf';
      a.click();
    }
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={createPDF}>Generate PDF</button>
      {pdfUrl && (
        <div>
          <button onClick={handlePreview}>Preview PDF</button>
          <button onClick={handleDownload}>Download PDF</button>
        </div>
      )}

      {/* Modal for preview */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="PDF Preview"
        ariaHideApp={false}
        style={{
          content: {
            width: '80%',
            height: '80%',
            margin: 'auto',
            padding: '0',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
          },
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={closeModal} style={{ margin: '10px' }}>Close</button>
        </div>
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            width="100%"
            height="100%"
            style={{ border: 'none' }}
            title="PDF Preview"
          />
        )}
      </Modal>
    </div>
  );
};

export default PDFComponent;