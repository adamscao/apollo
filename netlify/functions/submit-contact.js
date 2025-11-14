import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const adminEmail = process.env.ADMIN_EMAIL || 'info@apolloins.ca';
const fromEmail = process.env.FROM_EMAIL || 'noreply@notifications.apolloins.ca';

// Subject translations
const subjectTranslations = {
  'home-insurance': {
    zh: '房屋保险咨询',
    en: 'Home Insurance Inquiry',
    fr: "Demande d'Assurance Habitation"
  },
  'auto-insurance': {
    zh: '汽车保险咨询',
    en: 'Auto Insurance Inquiry',
    fr: "Demande d'Assurance Auto"
  },
  'business-insurance': {
    zh: '商业保险咨询',
    en: 'Business Insurance Inquiry',
    fr: "Demande d'Assurance Commerciale"
  },
  'claims': {
    zh: '理赔咨询',
    en: 'Claims Inquiry',
    fr: 'Demande de Réclamation'
  },
  'other': {
    zh: '其他问题',
    en: 'Other Inquiry',
    fr: 'Autre Demande'
  }
};

// Email templates for user confirmation
const getConfirmationEmailTemplate = (data, lang) => {
  const templates = {
    zh: {
      subject: '感谢您联系阿波罗保险公司',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb; border-radius: 4px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>阿波罗保险公司</h1>
              <p>Apollo Insurance</p>
            </div>
            <div class="content">
              <h2>您好，${data.name}！</h2>
              <p>感谢您联系阿波罗保险公司。我们已收到您的咨询信息，我们的专业团队将在1-2个工作日内与您联系。</p>

              <div class="info-box">
                <h3>您的咨询信息：</h3>
                <p><strong>姓名：</strong> ${data.name}</p>
                <p><strong>电话：</strong> ${data.phone}</p>
                <p><strong>邮箱：</strong> ${data.email}</p>
                <p><strong>咨询主题：</strong> ${subjectTranslations[data.subject]?.zh || data.subject}</p>
                <p><strong>留言内容：</strong></p>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
              </div>

              <p>如有紧急事项，请直接致电：<strong>+1 (514) 123-4567</strong></p>

              <div class="footer">
                <p>阿波罗保险公司 | Apollo Insurance | Assurance Apollo</p>
                <p>Brossard, Quebec, Canada</p>
                <p>电话: +1 (514) 123-4567 | 邮箱: info@apolloins.ca</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    },
    en: {
      subject: 'Thank You for Contacting Apollo Insurance',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb; border-radius: 4px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Apollo Insurance</h1>
              <p>阿波罗保险公司 | Assurance Apollo</p>
            </div>
            <div class="content">
              <h2>Hello ${data.name}!</h2>
              <p>Thank you for contacting Apollo Insurance. We have received your inquiry and our professional team will get back to you within 1-2 business days.</p>

              <div class="info-box">
                <h3>Your Inquiry Details:</h3>
                <p><strong>Name:</strong> ${data.name}</p>
                <p><strong>Phone:</strong> ${data.phone}</p>
                <p><strong>Email:</strong> ${data.email}</p>
                <p><strong>Subject:</strong> ${subjectTranslations[data.subject]?.en || data.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
              </div>

              <p>For urgent matters, please call us directly at: <strong>+1 (514) 123-4567</strong></p>

              <div class="footer">
                <p>Apollo Insurance | 阿波罗保险公司 | Assurance Apollo</p>
                <p>Brossard, Quebec, Canada</p>
                <p>Phone: +1 (514) 123-4567 | Email: info@apolloins.ca</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    },
    fr: {
      subject: 'Merci de nous avoir contactés - Assurance Apollo',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #2563eb; border-radius: 4px; }
            .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Assurance Apollo</h1>
              <p>阿波罗保险公司 | Apollo Insurance</p>
            </div>
            <div class="content">
              <h2>Bonjour ${data.name}!</h2>
              <p>Merci d'avoir contacté Assurance Apollo. Nous avons bien reçu votre demande et notre équipe professionnelle vous contactera dans un délai de 1 à 2 jours ouvrables.</p>

              <div class="info-box">
                <h3>Détails de votre demande:</h3>
                <p><strong>Nom:</strong> ${data.name}</p>
                <p><strong>Téléphone:</strong> ${data.phone}</p>
                <p><strong>Courriel:</strong> ${data.email}</p>
                <p><strong>Sujet:</strong> ${subjectTranslations[data.subject]?.fr || data.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${data.message.replace(/\n/g, '<br>')}</p>
              </div>

              <p>Pour toute urgence, veuillez nous appeler directement au: <strong>+1 (514) 123-4567</strong></p>

              <div class="footer">
                <p>Assurance Apollo | 阿波罗保险公司 | Apollo Insurance</p>
                <p>Brossard, Québec, Canada</p>
                <p>Téléphone: +1 (514) 123-4567 | Courriel: info@apolloins.ca</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    }
  };

  return templates[lang] || templates.en;
};

// Email template for admin notification
const getAdminEmailTemplate = (data, lang) => {
  return {
    subject: `New Contact Form Submission - ${data.name}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #2563eb, #7c3aed); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 20px; margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 4px; }
          .label { font-weight: bold; color: #2563eb; }
          .urgent { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>Apollo Insurance Website</p>
          </div>
          <div class="content">
            <div class="urgent">
              <strong>⚠️ New inquiry received - Please respond within 1-2 business days</strong>
            </div>

            <div class="info-box">
              <h3>Contact Information:</h3>
              <p><span class="label">Name:</span> ${data.name}</p>
              <p><span class="label">Phone:</span> <a href="tel:${data.phone}">${data.phone}</a></p>
              <p><span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a></p>
              <p><span class="label">Language:</span> ${lang.toUpperCase()}</p>
              <p><span class="label">Subject:</span> ${subjectTranslations[data.subject]?.en || data.subject}</p>
            </div>

            <div class="info-box">
              <h3>Message:</h3>
              <p>${data.message.replace(/\n/g, '<br>')}</p>
            </div>

            <div class="info-box">
              <p><span class="label">Submission Time:</span> ${new Date().toLocaleString('en-CA', { timeZone: 'America/Toronto' })} (EST)</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

export const handler = async (event) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  try {
    // Parse the request body
    const data = JSON.parse(event.body);
    const { name, phone, email, subject, message, lang = 'en' } = data;

    // Validate required fields
    if (!name || !phone || !email || !subject || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' })
      };
    }

    // Get email templates
    const confirmationTemplate = getConfirmationEmailTemplate(data, lang);
    const adminTemplate = getAdminEmailTemplate(data, lang);

    // Send confirmation email to user
    const userEmailResult = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: confirmationTemplate.subject,
      html: confirmationTemplate.html,
    });

    // Send notification email to admin
    const adminEmailResult = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject: adminTemplate.subject,
      html: adminTemplate.html,
      replyTo: email,
    });

    console.log('User email sent:', userEmailResult);
    console.log('Admin email sent:', adminEmailResult);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Contact form submitted successfully',
        userEmailId: userEmailResult.id,
        adminEmailId: adminEmailResult.id
      })
    };
  } catch (error) {
    console.error('Error processing contact form:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process contact form',
        details: error.message
      })
    };
  }
};
