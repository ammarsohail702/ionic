import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

interface SampleRequestData {
  fullName: string
  organizationName: string
  role: string
  workEmail: string
  phone: string
  shippingAddress: string
  city: string
  country: string
  postalCode: string
  orderVolume: string
  customizationTypes: string[]
  timeline: string
  productInterests: string[]
  fabricInterest: string
  additionalNotes: string
}

// Role labels for display
const roleLabels: Record<string, string> = {
  coach: 'Coach',
  athletic_director: 'Athletic Director',
  founder: 'Founder / Owner',
  purchasing_manager: 'Purchasing Manager',
  team_manager: 'Team Manager',
  other: 'Other',
}

// Timeline labels for display
const timelineLabels: Record<string, string> = {
  asap: 'ASAP - Urgent Order',
  '3_months': 'Within 3 months',
  next_season: 'Next Season (3-6 months)',
  researching: 'Just Researching',
}

// Product labels for display
const productLabels: Record<string, string> = {
  performance_tee: 'Performance Tee',
  hoodie: 'Hoodie',
  compression: 'Compression/Rashguard',
  polo: 'Polo Shirt',
  jersey: 'Sports Jersey',
  shorts: 'Shorts/Pants',
}

// Fabric labels for display
const fabricLabels: Record<string, string> = {
  moisture_wicking: 'Moisture-Wicking Performance',
  recycled_eco: 'Recycled/Eco-Fabric',
  heavyweight_cotton: 'Heavyweight Cotton-Blend',
  compression: 'Compression/Spandex Blend',
  mesh: 'Breathable Mesh',
}

// Save submission to local file as backup
async function saveSubmissionLocally(data: SampleRequestData) {
  try {
    const submissionsDir = path.join(process.cwd(), 'data', 'submissions')
    await mkdir(submissionsDir, { recursive: true })

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `sample-request-${timestamp}.json`
    const filepath = path.join(submissionsDir, filename)

    const submission = {
      ...data,
      submittedAt: new Date().toISOString(),
      emailSent: false,
    }

    await writeFile(filepath, JSON.stringify(submission, null, 2))
    console.log('Submission saved locally:', filepath)
    return true
  } catch (error) {
    console.error('Error saving submission locally:', error)
    return false
  }
}

// Create reusable transporter using SMTP (Office 365)
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.office365.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
    requireTLS: true,
  })
}

async function sendEmail(to: string, subject: string, htmlContent: string, textContent: string) {
  const transporter = createTransporter()

  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'AICONZ Uniforms'}" <${process.env.EMAIL_FROM || 'admin@spectreco.com'}>`,
    to,
    subject,
    text: textContent,
    html: htmlContent,
  }

  try {
    const info = await transporter.sendMail(mailOptions)
    console.log('Email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('SMTP error:', error)
    throw error
  }
}

// Customer confirmation email
function getCustomerEmailContent(data: SampleRequestData) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your AICONZ Sample Pack is being prepared!</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #F5C842 0%, #FFD966 100%); padding: 40px 40px 30px; text-align: center;">
              <h1 style="color: #1a1a1a; margin: 0; font-size: 28px; font-weight: 700;">AICONZ</h1>
              <p style="color: rgba(26,26,26,0.8); margin: 10px 0 0; font-size: 14px;">Premium Custom Uniforms</p>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td style="padding: 40px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <span style="font-size: 48px;">📦</span>
              </div>

              <h2 style="color: #18181b; margin: 0 0 20px; font-size: 24px; text-align: center;">
                Your Sample Pack is Being Prepared!
              </h2>

              <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Hi ${data.fullName},
              </p>

              <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Thanks for reaching out! We're excited to show you why AICONZ is becoming the go-to manufacturing partner for <strong>${data.organizationName}</strong>.
              </p>

              <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                Our team is currently reviewing your request. You should receive a tracking number for your sample pack within <strong>48 hours</strong>.
              </p>

              <!-- Order Summary -->
              <div style="background-color: #f4f4f5; border-radius: 8px; padding: 24px; margin-bottom: 30px;">
                <h3 style="color: #18181b; margin: 0 0 16px; font-size: 16px; font-weight: 600;">Request Summary</h3>
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="color: #71717a; font-size: 14px; padding: 8px 0;">Estimated Volume:</td>
                    <td style="color: #18181b; font-size: 14px; padding: 8px 0; text-align: right; font-weight: 500;">${data.orderVolume} units</td>
                  </tr>
                  <tr>
                    <td style="color: #71717a; font-size: 14px; padding: 8px 0;">Timeline:</td>
                    <td style="color: #18181b; font-size: 14px; padding: 8px 0; text-align: right; font-weight: 500;">${timelineLabels[data.timeline] || data.timeline}</td>
                  </tr>
                  <tr>
                    <td style="color: #71717a; font-size: 14px; padding: 8px 0;">Products:</td>
                    <td style="color: #18181b; font-size: 14px; padding: 8px 0; text-align: right; font-weight: 500;">
                      ${data.productInterests.map(p => productLabels[p] || p).join(', ')}
                    </td>
                  </tr>
                </table>
              </div>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://aiconz.com'}/customize"
                   style="display: inline-block; background: linear-gradient(135deg, #F5C842 0%, #FFD966 100%); color: #1a1a1a; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                  Start Designing Your Kit
                </a>
              </div>

              <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                In the meantime, feel free to explore our 3D designer or reply to this email if you have any urgent questions about your upcoming season.
              </p>

              <p style="color: #52525b; font-size: 16px; line-height: 1.6; margin: 30px 0 0;">
                To your success,<br>
                <strong style="color: #18181b;">The AICONZ Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #18181b; padding: 30px 40px; text-align: center;">
              <p style="color: #a1a1aa; font-size: 14px; margin: 0 0 10px;">
                AICONZ Premium Custom Uniforms
              </p>
              <p style="color: #71717a; font-size: 12px; margin: 0;">
                This email was sent because you requested a sample kit from AICONZ.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const text = `
Your AICONZ Sample Pack is Being Prepared!

Hi ${data.fullName},

Thanks for reaching out! We're excited to show you why AICONZ is becoming the go-to manufacturing partner for ${data.organizationName}.

Our team is currently reviewing your request. You should receive a tracking number for your sample pack within 48 hours.

Request Summary:
- Estimated Volume: ${data.orderVolume} units
- Timeline: ${timelineLabels[data.timeline] || data.timeline}
- Products: ${data.productInterests.map(p => productLabels[p] || p).join(', ')}

In the meantime, feel free to explore our 3D designer at ${process.env.NEXT_PUBLIC_SITE_URL || 'https://aiconz.com'}/customize or reply to this email if you have any urgent questions.

To your success,
The AICONZ Team
`

  return { html, text }
}

// Admin notification email
function getAdminEmailContent(data: SampleRequestData) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Sample Request</title>
</head>
<body style="margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; background-color: #f4f4f5;">
  <div style="max-width: 600px; margin: 0 auto; background: #fff; border-radius: 8px; padding: 30px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
    <h1 style="color: #D4A72C; margin: 0 0 20px; font-size: 24px;">New Sample Request 📦</h1>

    <h2 style="color: #18181b; font-size: 18px; margin: 20px 0 10px; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px;">Contact Information</h2>
    <table style="width: 100%; font-size: 14px;">
      <tr><td style="color: #71717a; padding: 6px 0; width: 140px;">Name:</td><td style="color: #18181b; padding: 6px 0;"><strong>${data.fullName}</strong></td></tr>
      <tr><td style="color: #71717a; padding: 6px 0;">Organization:</td><td style="color: #18181b; padding: 6px 0;"><strong>${data.organizationName}</strong></td></tr>
      <tr><td style="color: #71717a; padding: 6px 0;">Role:</td><td style="color: #18181b; padding: 6px 0;">${roleLabels[data.role] || data.role}</td></tr>
      <tr><td style="color: #71717a; padding: 6px 0;">Email:</td><td style="color: #18181b; padding: 6px 0;"><a href="mailto:${data.workEmail}">${data.workEmail}</a></td></tr>
      <tr><td style="color: #71717a; padding: 6px 0;">Phone:</td><td style="color: #18181b; padding: 6px 0;">${data.phone || 'Not provided'}</td></tr>
    </table>

    <h2 style="color: #18181b; font-size: 18px; margin: 20px 0 10px; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px;">Shipping Address</h2>
    <p style="color: #18181b; margin: 0; line-height: 1.6;">
      ${data.shippingAddress}<br>
      ${data.city}, ${data.postalCode}<br>
      ${data.country}
    </p>

    <h2 style="color: #18181b; font-size: 18px; margin: 20px 0 10px; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px;">Project Scope</h2>
    <table style="width: 100%; font-size: 14px;">
      <tr><td style="color: #71717a; padding: 6px 0; width: 140px;">Order Volume:</td><td style="color: #18181b; padding: 6px 0;"><strong style="color: #16a34a;">${data.orderVolume} units</strong></td></tr>
      <tr><td style="color: #71717a; padding: 6px 0;">Timeline:</td><td style="color: #18181b; padding: 6px 0;"><strong>${timelineLabels[data.timeline] || data.timeline}</strong></td></tr>
      <tr><td style="color: #71717a; padding: 6px 0;">Customization:</td><td style="color: #18181b; padding: 6px 0;">${data.customizationTypes.join(', ')}</td></tr>
    </table>

    <h2 style="color: #18181b; font-size: 18px; margin: 20px 0 10px; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px;">Sample Selection</h2>
    <table style="width: 100%; font-size: 14px;">
      <tr><td style="color: #71717a; padding: 6px 0; width: 140px;">Products:</td><td style="color: #18181b; padding: 6px 0;">${data.productInterests.map(p => productLabels[p] || p).join(', ')}</td></tr>
      <tr><td style="color: #71717a; padding: 6px 0;">Fabric:</td><td style="color: #18181b; padding: 6px 0;">${data.fabricInterest ? (fabricLabels[data.fabricInterest] || data.fabricInterest) : 'Not specified'}</td></tr>
    </table>

    ${data.additionalNotes ? `
    <h2 style="color: #18181b; font-size: 18px; margin: 20px 0 10px; border-bottom: 1px solid #e4e4e7; padding-bottom: 8px;">Additional Notes</h2>
    <p style="color: #18181b; margin: 0; line-height: 1.6; background: #f4f4f5; padding: 12px; border-radius: 6px;">${data.additionalNotes}</p>
    ` : ''}

    <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #F5C842; text-align: center;">
      <a href="mailto:${data.workEmail}" style="display: inline-block; background: #F5C842; color: #1a1a1a; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 600;">Reply to Customer</a>
    </div>
  </div>
</body>
</html>
`

  const text = `
NEW SAMPLE REQUEST

Contact Information:
- Name: ${data.fullName}
- Organization: ${data.organizationName}
- Role: ${roleLabels[data.role] || data.role}
- Email: ${data.workEmail}
- Phone: ${data.phone || 'Not provided'}

Shipping Address:
${data.shippingAddress}
${data.city}, ${data.postalCode}
${data.country}

Project Scope:
- Order Volume: ${data.orderVolume} units
- Timeline: ${timelineLabels[data.timeline] || data.timeline}
- Customization: ${data.customizationTypes.join(', ')}

Sample Selection:
- Products: ${data.productInterests.map(p => productLabels[p] || p).join(', ')}
- Fabric: ${data.fabricInterest ? (fabricLabels[data.fabricInterest] || data.fabricInterest) : 'Not specified'}

${data.additionalNotes ? `Additional Notes:\n${data.additionalNotes}` : ''}
`

  return { html, text }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Parse form data
    const data: SampleRequestData = {
      fullName: formData.get('fullName') as string || '',
      organizationName: formData.get('organizationName') as string || '',
      role: formData.get('role') as string || '',
      workEmail: formData.get('workEmail') as string || '',
      phone: formData.get('phone') as string || '',
      shippingAddress: formData.get('shippingAddress') as string || '',
      city: formData.get('city') as string || '',
      country: formData.get('country') as string || '',
      postalCode: formData.get('postalCode') as string || '',
      orderVolume: formData.get('orderVolume') as string || '',
      customizationTypes: JSON.parse(formData.get('customizationTypes') as string || '[]'),
      timeline: formData.get('timeline') as string || '',
      productInterests: JSON.parse(formData.get('productInterests') as string || '[]'),
      fabricInterest: formData.get('fabricInterest') as string || '',
      additionalNotes: formData.get('additionalNotes') as string || '',
    }

    // Validate required fields
    const requiredFields = ['fullName', 'organizationName', 'role', 'workEmail', 'shippingAddress', 'city', 'country', 'postalCode', 'orderVolume', 'timeline']
    for (const field of requiredFields) {
      if (!data[field as keyof SampleRequestData]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.workEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Validate at least one product selected
    if (data.productInterests.length === 0) {
      return NextResponse.json(
        { error: 'Please select at least one product' },
        { status: 400 }
      )
    }

    // Handle logo file if uploaded (for future use - store in cloud storage)
    const logoFile = formData.get('logo') as File | null
    if (logoFile && logoFile.size > 0) {
      console.log('Logo uploaded:', logoFile.name, logoFile.size, 'bytes')
      // TODO: Upload to cloud storage (S3, Cloudinary, etc.)
    }

    // ALWAYS save submission locally first (backup in case email fails)
    await saveSubmissionLocally(data)

    // Try to send emails, but don't fail if they don't work
    let emailSent = false
    try {
      // Send confirmation email to customer
      const customerEmail = getCustomerEmailContent(data)
      await sendEmail(
        data.workEmail,
        'Your AICONZ Sample Pack is being prepared!',
        customerEmail.html,
        customerEmail.text
      )

      // Send notification email to admin
      const adminEmail = getAdminEmailContent(data)
      await sendEmail(
        process.env.EMAIL_FROM || 'admin@spectreco.com',
        `New Sample Request: ${data.organizationName} (${data.orderVolume} units)`,
        adminEmail.html,
        adminEmail.text
      )

      emailSent = true
    } catch (emailError) {
      console.error('Email sending failed (submission still saved):', emailError)
      // Don't throw - we still want to return success since data is saved
    }

    return NextResponse.json({
      success: true,
      message: 'Sample request submitted successfully',
      emailSent,
    })

  } catch (error) {
    console.error('Error processing sample request:', error)
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    )
  }
}
