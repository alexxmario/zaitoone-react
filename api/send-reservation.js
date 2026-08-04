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

  const { name, email, phone, date, time, guests, message } = req.body;

  if (!name || !email || !phone || !date || !time || !guests) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const specialRequests = message || 'Fără cereri speciale';

  try {
    // Email to restaurant
    await resend.emails.send({
      from: 'Zaitoone Rezervări <rezervari@zaitoone.ro>',
      to: 'office@zaitoone.ro',
      subject: `[Rezervare Nouă] ${name} – ${date} ${time} – ${guests} ${guests === '1' ? 'persoană' : 'persoane'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: #1a1a1a; padding: 24px 32px; border-radius: 8px 8px 0 0;">
            <h1 style="color: #c9a84c; margin: 0; font-size: 22px; letter-spacing: 1px;">Rezervare Nouă</h1>
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
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Data</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Ora</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${time}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; font-size: 14px;">Persoane</td>
                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${guests}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #666; font-size: 14px; vertical-align: top;">Cereri speciale</td>
                <td style="padding: 10px 0; white-space: pre-line;">${specialRequests}</td>
              </tr>
            </table>
          </div>
        </div>
      `,
    });

    // Confirmation email to customer
    await resend.emails.send({
      from: 'Zaitoone <rezervari@zaitoone.ro>',
      to: email,
      subject: `Confirmare rezervare Zaitoone – ${date} la ${time}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background: #1a1a1a; padding: 24px 32px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: #c9a84c; margin: 0; font-size: 26px; letter-spacing: 2px;">ZAITOONE</h1>
            <p style="color: #888; margin: 6px 0 0; font-size: 13px;">Restaurant Libanez · București</p>
          </div>
          <div style="background: #f9f9f9; padding: 32px; border-radius: 0 0 8px 8px; border: 1px solid #eee; border-top: none;">
            <p style="font-size: 16px; margin-top: 0;">Bună ziua, <strong>${name}</strong>,</p>
            <p style="color: #555; line-height: 1.6;">Cererea ta de rezervare a fost primită cu succes. Te vom confirma prin telefon sau email în maxim <strong>24 de ore</strong>.</p>

            <div style="background: #fff; border: 1px solid #e8e8e8; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="margin: 0 0 16px; color: #1a1a1a; font-size: 15px;">Detalii rezervare</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 14px; width: 45%;">Data</td>
                  <td style="padding: 8px 0; font-weight: bold;">${date}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 14px;">Ora</td>
                  <td style="padding: 8px 0; font-weight: bold;">${time}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #888; font-size: 14px;">Persoane</td>
                  <td style="padding: 8px 0; font-weight: bold;">${guests}</td>
                </tr>
              </table>
            </div>

            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              Ne găsești la <strong>Str. Nicolae G. Caramfil 2, Zona Lacul Herăstrău, București</strong>.<br/>
              Dacă ai întrebări, ne poți contacta la <a href="tel:+40737299900" style="color: #c9a84c;">+40 737 299 900</a>.
            </p>

            <p style="color: #555; font-size: 14px; margin-bottom: 0;">Cu drag,<br/><strong>Echipa Zaitoone</strong></p>
          </div>
          <p style="text-align: center; color: #bbb; font-size: 12px; margin-top: 16px;">
            Str. Nicolae G. Caramfil 2 · București · <a href="https://zaitoone.ro" style="color: #c9a84c;">zaitoone.ro</a>
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Resend error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};
