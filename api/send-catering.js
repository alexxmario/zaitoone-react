const { Resend } = require('resend');
const { guardRequest } = require('./_turnstile');

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify the Turnstile token before anything else, so rejected requests
  // never reach Resend and never consume send quota.
  if (!(await guardRequest(req, res))) {
    return;
  }

  const { name, email, phone, eventType, guestsApprox, date, preferences } = req.body;

  if (!name || !email || !phone || !eventType || !guestsApprox || !date || !preferences) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await resend.emails.send({
      from: 'Zaitoone Catering <rezervari@zaitoone.ro>',
      to: 'office@zaitoone.ro',
      subject: `[Cerere Catering] ${name} – ${eventType}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: #1a1a1a; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #c9a84c; margin: 0; font-size: 22px; letter-spacing: 1px;">Cerere Catering</h1>
            <p style="color: #888; margin: 6px 0 0; font-size: 14px;">Zaitoone Restaurant</p>
          </div>
          <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #eee; border-top: none;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px; width: 40%;">Nume</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Email</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}" style="color: #c9a84c;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Telefon</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="tel:${phone}" style="color: #c9a84c;">${phone}</a></td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Tip eveniment</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${eventType}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Nr. aproximativ invitați</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${guestsApprox}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Data dorită</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-size: 14px; vertical-align: top;">Preferințe și detalii</td>
                <td style="padding: 10px 0; white-space: pre-line; line-height: 1.6;">${preferences}</td>
              </tr>
            </table>
          </div>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
