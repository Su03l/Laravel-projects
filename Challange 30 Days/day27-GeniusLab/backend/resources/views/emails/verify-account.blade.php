<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Courier New', Courier, monospace; background-color: #050505; padding: 40px 0; margin: 0; color: #e5e7eb; }
        .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; padding: 40px; border-radius: 12px; border: 1px solid #22c55e; box-shadow: 0 0 20px rgba(34, 197, 94, 0.2); }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #22c55e; padding-bottom: 20px; }
        .logo { font-size: 24px; font-weight: bold; color: #22c55e; text-decoration: none; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 10px rgba(34, 197, 94, 0.5); }
        .content { color: #d1d5db; line-height: 1.6; font-size: 16px; font-family: sans-serif; }
        .code-box { background-color: #000000; border: 1px dashed #22c55e; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
        .code { font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #22c55e; font-family: 'Courier New', Courier, monospace; text-shadow: 0 0 5px #22c55e; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #4b5563; border-top: 1px solid #1f2937; padding-top: 20px; }
        .highlight { color: #22c55e; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <a href="#" class="logo">GeniusLab_System</a>
        </div>

        <div class="content">
            <h2 style="color: #ffffff; margin-top: 0;">> Initialize Verification...</h2>
            <p>Welcome, User. Access to <span class="highlight">GeniusLab Core</span> requires email verification.</p>
            <p>Input the following sequence to activate your neural link:</p>

            <div class="code-box">
                <div class="code">{{ $otpCode }}</div>
            </div>

            <p style="font-size: 14px; color: #9ca3af;">[SYSTEM NOTE]: Sequence expires in 10 minutes.</p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} GeniusLab AI. System Status: Online.
        </div>
    </div>
</body>
</html>
