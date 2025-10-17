interface MagicLinkEmailProps {
    url: string
    email: string
    host?: string
    expiresIn?: number
}

export function magicLinkEmailHTML({ url, email, host = "IO", expiresIn = 24 }: MagicLinkEmailProps) {
    // Light mode colors from the theme
    const colors = {
        background: "#f3f1ff",
        surface: "#ffffff",
        primary: "#00F0FF", // Cyan
        primaryDark: "#0088cc",
        text: "#222222",
        textMuted: "#666666",
        border: "#e5e3ff",
    }

    const escapedHost = host.replace(/\./g, "&#8203;.")
    const displayEmail = email.split("@")[0]

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sign in to ${escapedHost}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: ${colors.background};
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-top: 20px;
    }
    .logo {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 40px;
    }
    .logo-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark});
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      color: white;
      font-size: 18px;
      font-family: "Courier New", monospace;
    }
    .logo-text {
      font-size: 24px;
      font-weight: 700;
      color: ${colors.text};
      font-family: "Courier New", monospace;
      letter-spacing: -0.5px;
    }
    .main-card {
      background-color: ${colors.surface};
      border-radius: 12px;
      padding: 60px 40px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.07);
      border: 1px solid ${colors.border};
    }
    .icon-wrapper {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, ${colors.primary}15, ${colors.primaryDark}15);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 30px;
    }
    .icon-wrapper svg {
      width: 40px;
      height: 40px;
      color: ${colors.primary};
    }
    .heading {
      font-size: 32px;
      font-weight: 700;
      color: ${colors.text};
      text-align: center;
      margin: 0 0 30px 0;
      font-family: "Courier New", monospace;
      letter-spacing: -1px;
    }
    .greeting {
      font-size: 16px;
      line-height: 1.6;
      color: ${colors.textMuted};
      text-align: center;
      margin-bottom: 40px;
    }
    .greeting strong {
      color: ${colors.text};
      font-weight: 600;
    }
    .cta-wrapper {
      text-align: center;
      margin: 40px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, ${colors.primary}, ${colors.primaryDark});
      color: white;
      padding: 16px 40px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      font-family: "Courier New", monospace;
      transition: transform 0.2s, box-shadow 0.2s;
      box-shadow: 0 4px 12px ${colors.primary}30;
      letter-spacing: 0.5px;
    }
    .cta-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px ${colors.primary}40;
    }
    .security-notice {
      background-color: #f5f1ff;
      border-left: 4px solid ${colors.primary};
      padding: 16px;
      border-radius: 6px;
      margin: 30px 0;
      font-size: 14px;
      line-height: 1.6;
      color: ${colors.textMuted};
      text-align: center;
    }
    .security-notice strong {
      color: ${colors.text};
      font-weight: 600;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid ${colors.border};
      font-size: 14px;
      line-height: 1.6;
      color: ${colors.textMuted};
    }
    .footer strong {
      color: ${colors.text};
      font-weight: 600;
    }
    .divider {
      height: 1px;
      background-color: ${colors.border};
      margin: 30px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">
        <div class="logo-icon">IO</div>
        <div class="logo-text">Isaiah Ozadhe</div>
      </div>
    </div>

    <div class="main-card">
      <div class="icon-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
        </svg>
      </div>

      <h1 class="heading">Magic Link Request</h1>

      <p class="greeting">
        Hey <strong>${displayEmail}</strong>, you asked us to send you a magic link for quickly signing into your account.
      </p>

      <div class="cta-wrapper">
        <a href="${url}" class="cta-button">
          Sign in to ${escapedHost}
        </a>
      </div>

      <div class="security-notice">
        <strong>🔒 Security Notice:</strong> The above link is a magic link, only meant for you. Please don't share it with anyone. The link will expire in ${expiresIn} hours.
      </div>

      <div class="divider"></div>

      <div class="footer">
        <p>
          If you did not request this or if you didn't mean to sign in, then you can just ignore this email — your account will remain secure and unchanged.
        </p>
        <p style="margin-top: 16px; font-size: 12px; color: #999;">
          Questions? Check our <a href="https://isaiahozadhe.tech" style="color: ${colors.primary}; text-decoration: none;">website</a>.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `
}

export function magicLinkEmailText({ url, email, host = "IO", expiresIn = 24 }: MagicLinkEmailProps): string {
    const displayEmail = email.split("@")[0]

    return `
Sign in to ${host}

Hey ${displayEmail}, you asked us to send you a magic link for quickly signing into your ${host} account.

Sign in here: ${url}

🔒 Security Notice: The above link is a magic link, only meant for you. Please don't share it with anyone. The link will expire in ${expiresIn} hours.

---

If you did not request this or if you didn't mean to sign in, then you can just ignore this email — your account will remain secure and unchanged.

Questions? Check our help center or reply to this email.
  `.trim()
}

/**
 * Custom sendVerificationRequest function for Auth.js
 * This replaces the default email template with our custom one
 */
export async function sendVerificationRequest({
    identifier: email,
    url,
    provider,
}: {
    identifier: string
    url: string
    provider: any
}) {
    const { host } = new URL(url)
    const hostDisplayName = "IO"

    const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: provider.from,
            to: email,
            subject: `Your ${hostDisplayName} magic link is ready ✨`,
            html: magicLinkEmailHTML({ url, email, host: hostDisplayName }),
            text: magicLinkEmailText({ url, email, host: hostDisplayName }),
        }),
    })

    if (!response.ok) {
        const error = await response.text()
        throw new Error(`Failed to send email: ${response.status} ${error}`)
    }

    return response.json()
}