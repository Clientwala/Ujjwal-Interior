const axios = require('axios');

/**
 * Escapes HTML characters to prevent Telegram API formatting errors.
 */
function escapeHTML(str) {
  if (str === null || str === undefined || str === '') return 'N/A';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Sends a detailed inquiry notification to Telegram.
 * @param {Object} lead - The lead details from MongoDB.
 */
async function sendInquiryNotification(lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram config is missing. Skipping Telegram notification.');
    return;
  }

  const name = escapeHTML(lead.name);
  const phone = escapeHTML(lead.phone);
  const email = escapeHTML(lead.email);
  const locality = escapeHTML(lead.locality);
  const service = escapeHTML(lead.service);
  const propertyType = escapeHTML(lead.propertyType);
  const budget = escapeHTML(lead.budget);
  const message = escapeHTML(lead.message);

  const telegramMessage = `🔔 <b>New Ujjwal Interior Enquiry!</b>

👤 <b>Name:</b> ${name}
📞 <b>Phone:</b> ${phone}
📧 <b>Email:</b> ${email}
📍 <b>Locality:</b> ${locality}
🛠️ <b>Service Needed:</b> ${service}
🏠 <b>Property Type:</b> ${propertyType}
💰 <b>Budget:</b> ${budget}
💬 <b>Message:</b> ${message}`;

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await axios.post(url, {
      chat_id: chatId,
      text: telegramMessage,
      parse_mode: 'HTML'
    });
    console.log('Telegram notification sent successfully. Message ID:', response.data?.result?.message_id);
  } catch (error) {
    console.error('Failed to send Telegram notification:');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error('Response Data:', JSON.stringify(error.response.data));
    } else {
      console.error(error.message);
    }
  }
}

module.exports = {
  sendInquiryNotification
};
