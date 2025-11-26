// WhatsApp notification service for Nairobi Waste Tracking

interface WhatsAppMessage {
  phone: string;
  message: string;
}

interface OrderDetails {
  id: string;
  wasteType: string;
  quantity: number;
  location: string;
  urgency: string;
  estimatedPrice: number;
  description?: string;
  customerName?: string;
  customerPhone?: string;
}

class WhatsAppService {
  private businessPhoneNumber: string = "+254723065707"; // Your business WhatsApp number
  
  /**
   * Send WhatsApp message using WhatsApp Web API
   * This opens WhatsApp Web with pre-filled message
   */
  private sendWhatsAppMessage(phone: string, message: string): void {
    // Remove any non-digit characters from phone number
    const cleanPhone = phone.replace(/[^\d]/g, '');
    
    // Ensure phone has country code (Kenya: +254)
    const formattedPhone = cleanPhone.startsWith('254') ? cleanPhone : `254${cleanPhone}`;
    
    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Create WhatsApp Web URL
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    // Open WhatsApp Web in new tab
    window.open(whatsappUrl, '_blank');
  }

  /**
   * Send order confirmation to customer
   */
  sendOrderConfirmation(orderDetails: OrderDetails): void {
    const message = `🚚 *Nairobi Waste Tracking - Order Confirmed!*

📋 *Order Details:*
• Order ID: ${orderDetails.id}
• Waste Type: ${orderDetails.wasteType}
• Quantity: ${orderDetails.quantity} kg
• Location: ${orderDetails.location}
• Urgency: ${orderDetails.urgency}
• Estimated Price: KES ${orderDetails.estimatedPrice}

📍 *Next Steps:*
1. We're matching you with the best collector
2. You'll receive collector details shortly
3. Collector will contact you for confirmation

⏰ *Estimated Collection:*
${orderDetails.urgency === 'emergency' ? '30 minutes' : 
  orderDetails.urgency === 'urgent' ? '1 hour' : '2-4 hours'}

📞 *Need Help?*
Call/WhatsApp: ${this.businessPhoneNumber}

Thank you for choosing Nairobi Waste Tracking! 🌍♻️`;

    if (orderDetails.customerPhone) {
      this.sendWhatsAppMessage(orderDetails.customerPhone, message);
    }
  }

  /**
   * Send order notification to collector
   */
  sendOrderToCollector(collectorPhone: string, orderDetails: OrderDetails): void {
    const message = `🚛 *New Waste Collection Request!*

💰 *Earning Opportunity:*
• Order ID: ${orderDetails.id}
• Waste Type: ${orderDetails.wasteType}
• Quantity: ${orderDetails.quantity} kg
• Location: ${orderDetails.location}
• Urgency: ${orderDetails.urgency}
• Estimated Price: KES ${orderDetails.estimatedPrice}

📍 *Pickup Location:*
${orderDetails.location}

⏰ *Urgency Level:*
${orderDetails.urgency.toUpperCase()}

📝 *Special Instructions:*
${orderDetails.description || 'None'}

🤝 *Accept this Request:*
Reply "ACCEPT ${orderDetails.id}" to confirm
Reply "REJECT ${orderDetails.id}" to decline

📞 *Contact Support:*
${this.businessPhoneNumber}

*Powered by Nairobi Waste Tracking*`;

    this.sendWhatsAppMessage(collectorPhone, message);
  }

  /**
   * Send collection status update to customer
   */
  sendStatusUpdate(customerPhone: string, orderId: string, status: string, collectorName?: string, eta?: string): void {
    const statusEmojis = {
      'matched': '🤝',
      'accepted': '✅',
      'en_route': '🚛',
      'collecting': '♻️',
      'completed': '🎉',
      'cancelled': '❌'
    };

    const emoji = statusEmojis[status as keyof typeof statusEmojis] || '📋';

    let message = `${emoji} *Nairobi Waste Tracking - Status Update*

📋 *Order ID:* ${orderId}
🔄 *Status:* ${status.toUpperCase()}`;

    if (collectorName) {
      message += `\n👤 *Collector:* ${collectorName}`;
    }

    if (eta) {
      message += `\n⏰ *ETA:* ${eta}`;
    }

    message += `\n\n📞 *Track this order:*
Reply "STATUS ${orderId}" for latest update

Thank you for using Nairobi Waste Tracking! 🌍`;

    this.sendWhatsAppMessage(customerPhone, message);
  }

  /**
   * Send payment confirmation
   */
  sendPaymentConfirmation(customerPhone: string, orderId: string, amount: number, paymentMethod: string): void {
    const message = `💰 *Nairobi Waste Tracking - Payment Confirmed*

📋 *Order ID:* ${orderId}
💳 *Amount Paid:* KES ${amount}
💳 *Payment Method:* ${paymentMethod}

✅ *Payment Status:* CONFIRMED

📧 *Receipt will be sent to your email*

Thank you for your payment! 🌍♻️

📞 *Need Support?*
${this.businessPhoneNumber}`;

    this.sendWhatsAppMessage(customerPhone, message);
  }

  /**
   * Generate WhatsApp share link for order tracking
   */
  generateTrackingLink(orderId: string): string {
    const trackingMessage = `🚛 *Track my waste collection*

📋 *Order ID:* ${orderId}

📱 *Nairobi Waste Tracking*
Real-time waste collection tracking in Nairobi

📍 *Track here:* http://localhost:8080/track-requests

🌍 *Making Nairobi cleaner, one collection at a time!*`;

    return `https://wa.me/?text=${encodeURIComponent(trackingMessage)}`;
  }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;
