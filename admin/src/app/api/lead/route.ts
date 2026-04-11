import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Set API key securely from environment variable
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (process.env.WEBHOOK_SECRET && authHeader !== `Bearer ${process.env.WEBHOOK_SECRET}`) {
      console.warn("Unauthorized webhook attempt blocked.");
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // This endpoint acts as a Supabase Database Webhook receiver.
    // Whenever a new entry hits `real_estate_leads`, Supabase POSTs the payload here.
    const body = await request.json();
    
    // We expect Supabase webhook format: { type: 'INSERT', record: { ... } }
    const leadRecord = body.record || body;

    // SendGrid integration ONLY on the server-side as requested
    const msg = {
      to: 'admin@choutuppal.local', // Target admin email
      from: 'noreply@choutuppal.local', // Verified sender in SendGrid
      subject: `🚨 New Real Estate Lead Received!`,
      text: `A new user lead (ID: ${leadRecord.lead_user_id}) has been submitted for Property Listing ID: ${leadRecord.listing_id}. Please check the Admin CRM dashboard to act on it.`,
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h2 style="color: #06B6D4;">New Real Estate Lead</h2>
          <p>A new lead has been captured via the Choutuppal Super App.</p>
          <ul>
            <li><strong>Listing ID:</strong> ${leadRecord.listing_id}</li>
            <li><strong>Lead User ID:</strong> ${leadRecord.lead_user_id}</li>
            <li><strong>Status:</strong> ${leadRecord.status}</li>
          </ul>
          <p><a href="https://choutuppal-super-app.vercel.app/leads" style="background: #06B6D4; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">View in CRM</a></p>
        </div>
      `,
    };

    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send(msg);
      console.log('✅ SendGrid alert email dispatched to Admin.');
    } else {
      console.log('⚠️ SendGrid API Key missing. Skipping email dispatch. Payload:', leadRecord);
    }

    return NextResponse.json({ success: true, message: "Webhook processed and email dispatched." });
  } catch (error: any) {
    console.error("❌ Webhook processing error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
