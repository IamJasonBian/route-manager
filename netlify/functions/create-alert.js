import { Resend } from 'resend';
import { Pool } from 'pg';

// Initialize Resend with API key from environment
const getResend = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY environment variable is not set');
  }
  return new Resend(apiKey);
};

// Initialize database pool
const getPool = () => {
  return new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || '5432', 10),
  });
};

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let pool;

  try {
    const body = JSON.parse(event.body);
    const { email, origin, destination, targetPrice } = body;

    // Validate required fields
    if (!email || !origin || !destination) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          error: 'Missing required fields: email, origin, destination'
        }),
      };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Save alert to database
    pool = getPool();

    // Create the alerts table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS price_alerts (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        origin VARCHAR(10) NOT NULL,
        destination VARCHAR(10) NOT NULL,
        target_price DECIMAL(10, 2),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if this alert already exists
    const existingAlert = await pool.query(
      `SELECT id FROM price_alerts
       WHERE email = $1 AND origin = $2 AND destination = $3 AND is_active = true`,
      [email, origin, destination]
    );

    if (existingAlert.rows.length > 0) {
      // Update existing alert
      await pool.query(
        `UPDATE price_alerts
         SET target_price = $1, updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [targetPrice || null, existingAlert.rows[0].id]
      );
    } else {
      // Insert new alert
      await pool.query(
        `INSERT INTO price_alerts (email, origin, destination, target_price)
         VALUES ($1, $2, $3, $4)`,
        [email, origin, destination, targetPrice || null]
      );
    }

    // Send confirmation email via Resend
    const resend = getResend();

    const routeDisplay = `${origin} → ${destination}`;
    const priceInfo = targetPrice
      ? `We'll notify you when prices drop below $${targetPrice}.`
      : `We'll notify you when there are significant price changes.`;

    await resend.emails.send({
      from: 'Apollo Flight Tracker <alerts@resend.dev>',
      to: email,
      subject: `Price Alert Set: ${routeDisplay}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1e40af; margin-bottom: 24px;">Price Alert Confirmed</h1>

          <p style="font-size: 16px; color: #374151; margin-bottom: 16px;">
            Your price alert for <strong>${routeDisplay}</strong> has been set up successfully.
          </p>

          <p style="font-size: 16px; color: #374151; margin-bottom: 24px;">
            ${priceInfo}
          </p>

          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <h3 style="margin: 0 0 8px 0; color: #1f2937;">Alert Details</h3>
            <p style="margin: 0; color: #4b5563;">
              <strong>Route:</strong> ${routeDisplay}<br>
              ${targetPrice ? `<strong>Target Price:</strong> $${targetPrice}` : ''}
            </p>
          </div>

          <p style="font-size: 14px; color: #6b7280;">
            You're receiving this email because you signed up for price alerts on Apollo Flight Tracker.
          </p>
        </div>
      `,
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        message: `Price alert set for ${routeDisplay}. Confirmation email sent to ${email}.`,
      }),
    };
  } catch (error) {
    console.error('Error creating alert:', error);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Failed to create price alert',
        details: error.message,
      }),
    };
  } finally {
    if (pool) {
      await pool.end();
    }
  }
};
