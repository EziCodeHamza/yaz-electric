export default async function handler(req, res) {
  // Accept POST requests only, reject others with 405
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        // If string parsing fails, fallback to empty object
      }
    }
    body = body || {};

    const { name, email, phone, service, message, _gotcha } = body;

    // Honeypot check for spam bots
    if (_gotcha) {
      return res.status(200).json({ success: true });
    }

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const trimmedName = String(name).trim();
    const trimmedEmail = String(email).trim();
    const trimmedPhone = String(phone).trim();
    const trimmedService = service ? String(service).trim() : 'Not specified';
    const trimmedMessage = String(message).trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone || !trimmedMessage) {
      return res.status(400).json({ error: 'Required fields cannot be empty' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('RESEND_API_KEY environment variable is not configured');
      return res.status(500).json({ error: 'Email service configuration error' });
    }

    const textContent = `New Quote Request from yazelectrical.ie\n\n` +
      `Name: ${trimmedName}\n` +
      `Email: ${trimmedEmail}\n` +
      `Phone: ${trimmedPhone}\n` +
      `Service: ${trimmedService}\n\n` +
      `Message:\n${trimmedMessage}\n`;

    const htmlContent = `
      <h2>New Quote Request</h2>
      <p><strong>Name:</strong> ${escapeHtml(trimmedName)}</p>
      <p><strong>Email:</strong> <a href="mailto:${escapeHtml(trimmedEmail)}">${escapeHtml(trimmedEmail)}</a></p>
      <p><strong>Phone:</strong> <a href="tel:${escapeHtml(trimmedPhone)}">${escapeHtml(trimmedPhone)}</a></p>
      <p><strong>Service:</strong> ${escapeHtml(trimmedService)}</p>
      <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${escapeHtml(trimmedMessage)}</p>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Website <contact@yazelectrical.ie>',
        to: ['info@yazelectrical.ie'],
        reply_to: trimmedEmail,
        subject: `New Quote Request: ${trimmedName}`,
        text: textContent,
        html: htmlContent,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return res.status(200).json({ success: true, id: data.id });
    } else {
      console.error('Resend API error:', data);
      return res.status(response.status || 500).json({
        error: data.message || 'Failed to send email'
      });
    }
  } catch (err) {
    console.error('Error handling contact form submission:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
