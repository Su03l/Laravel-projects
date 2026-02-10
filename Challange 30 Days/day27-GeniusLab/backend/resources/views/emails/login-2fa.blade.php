<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Courier New', Courier, monospace; background-color: #050505; padding: 40px 0; margin: 0; color: #e5e7eb; }
        .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; padding: 40px; border-radius: 12px; border: 1px solid #22c55e; box-shadow: 0 0 20px rgba(34, 197, 94, 0.2); }
        .header { text-align: center; margin-bottom: 30px; }
        .icon { font-size: 48px; margin-bottom: 10px; text-shadow: 0 0 15px #22c55e; }
        .content { color: #d1d5db; line-height: 1.6; font-size: 16px; text-align: center; font-family: sans-serif; }
        .code { font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #000; background: #22c55e; margin: 20px 0; display: inline-block; padding: 10px 20px; border-radius: 4px; box-shadow: 0 0 15px rgba(34, 197, 94, 0.6); font-family: 'Courier New', Courier, monospace; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #4b5563; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="icon">🛡️</div>
            <h2 style="margin: 0; color: #22c55e; text-transform: uppercase; letter-spacing: 1px;">Security Alert</h2>
        </div>

        <div class="content">
            <p>> Login attempt detected.</p>
            <p>Authenticate your session with the following security token:</p>

            <div class="code">{{ $otpCode }}</div>

            <p style="font-size: 14px; color: #9ca3af;">If this wasn't you, terminate all sessions immediately.</p>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} GeniusLab Security Protocol.
        </div>
    </div>
</body>
</html>
