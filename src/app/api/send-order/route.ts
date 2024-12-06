import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  additionalNotes?: string;
}

interface Product {
  name: string;
  price: number;
}

interface Item {
  selectedSize: any;
  selectedColorImage: {
    asset: {
      url: string;
    };
  };
  product: Product;
  quantity: number;
}

interface OrderDetails {
  items: Item[];
  total: number;
}


const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: parseInt('587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Create HTML for order items
const createItemsHTML = (items: Item[]): string => {
  return items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <img src="${item.selectedColorImage.asset}" alt="${item.product.name}" style="width: 80px; height: auto; border-radius: 4px;">
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">
        <h3 style="margin: 0; font-size: 16px;">${item.product.name}</h3>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">x${item?.quantity ?? 1}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">₹${(item.product.price * (item?.quantity ?? 1)).toFixed(2)}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee;">₹${(item.selectedSize)}</td>
    </tr>
  `).join('');
};

const createAdminEmailHTML = (customerDetails: CustomerDetails, orderDetails: OrderDetails): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Order Received</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background-color: #4CAF50; padding: 40px 20px; text-align: center;">
        <h1 style="color: #333; margin: 0;">New Order Received!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <h2 style="color: #444; border-bottom: 2px solid #eee; padding-bottom: 10px;">Customer Details</h2>
        <table width="100%" style="margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0;"><strong>Name:</strong></td>
            <td>${customerDetails.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Email:</strong></td>
            <td>${customerDetails.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Phone:</strong></td>
            <td>${customerDetails.phone}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Address:</strong></td>
            <td>${customerDetails.address}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>City:</strong></td>
            <td>${customerDetails.city}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>ZIP Code:</strong></td>
            <td>${customerDetails.zipCode}</td>
          </tr>
        </table>
        <h2 style="color: #444; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Details</h2>
        <table width="100%" style="margin-bottom: 20px;">
          ${createItemsHTML(orderDetails.items)}
          <tr>
            <td colspan="3" style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 12px;"><strong>₹${orderDetails.total.toFixed(2)}</strong></td>
          </tr>
        </table>
        <h2 style="color: #444; border-bottom: 2px solid #eee; padding-bottom: 10px;">Additional Notes</h2>
        <p style="margin-bottom: 20px;">${customerDetails.additionalNotes || 'None'}</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px; text-align: center; color: #666;">
        <p style="margin: 0;">This is an automated email from your e-commerce system</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const createCustomerEmailHTML = (customerDetails: CustomerDetails, orderDetails: OrderDetails): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td style="background-color: #4CAF50; padding: 40px 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">Thank You for Your Order!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px;">
        <p style="font-size: 16px; color: #444;">Dear ${customerDetails.fullName},</p>
        <p style="font-size: 16px; color: #444;">We've received your order and we're working on it. Here's a summary of your purchase:</p>
        <h2 style="color: #444; border-bottom: 2px solid #eee; padding-bottom: 10px;">Order Summary</h2>
        <table width="100%" style="margin-bottom: 20px;">
          ${createItemsHTML(orderDetails.items)}
          <tr>
            <td colspan="3" style="padding: 12px; text-align: right;"><strong>Total:</strong></td>
            <td style="padding: 12px;"><strong>₹${orderDetails.total.toFixed(2)}</strong></td>
          </tr>
        </table>
        <h2 style="color: #444; border-bottom: 2px solid #eee; padding-bottom: 10px;">Shipping Details</h2>
        <table width="100%" style="margin-bottom: 20px;">
          <tr>
            <td style="padding: 8px 0;"><strong>Address:</strong></td>
            <td>${customerDetails.address}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>City:</strong></td>
            <td>${customerDetails.city}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>ZIP Code:</strong></td>
            <td>${customerDetails.zipCode}</td>
          </tr>
        </table>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 4px; margin-top: 20px;">
          <p style="margin: 0; color: #666;">We'll process your order soon and send you updates about the status. If you have any questions, please don't hesitate to contact us.</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="background-color: #f8f9fa; padding: 20px; text-align: center;">
        <p style="margin: 0; color: #666;">Best regards,<br>Your Store Name</p>
        <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">This is an automated email, please do not reply directly to this message.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;



export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customerDetails, orderDetails }: { customerDetails: CustomerDetails, orderDetails: OrderDetails } = body;

    // Log customerDetails and orderDetails for debugging
    console.log('customerDetails', customerDetails);
    console.log('orderDetails', orderDetails);
    console.log('orderDetails Product', orderDetails?.items[0].product);
    console.log("selectedColorImage: ", orderDetails.items[0].selectedColorImage);

    // Send email to store owner
    const res = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: "nambathunikadai@gmail.com",
      subject: `New Order from ${customerDetails.fullName}`,
      html: createAdminEmailHTML(customerDetails, orderDetails),
    });
    console.log('Admin email sent successfully', res);
    console.log("Customer Email: ", customerDetails.email);

    // Send confirmation email to customer
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: customerDetails.email,
      subject: 'Order Confirmation',
      html: createCustomerEmailHTML(customerDetails, orderDetails),
    });
    console.log('Customer email sent successfully');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending order:', error);
    return NextResponse.json(
      { error: 'Failed to process order' },
      { status: 500 }
    );
  }
}

