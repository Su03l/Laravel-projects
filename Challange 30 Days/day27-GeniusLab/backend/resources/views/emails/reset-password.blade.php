<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Courier New', Courier, monospace; background-color: #050505; padding: 40px 0; margin: 0; color: #e5e7eb; }
        .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; padding: 40px; border-radius: 12px; border: 1px solid #ef4444; box-shadow: 0 0 20px rgba(239, 68, 68, 0.2); }
        .header { text-align: center; margin-bottom: 30px; }
        .content { color: #d1d5db; line-height: 1.6; font-size: 16px; font-family: sans-serif; }
        .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #ef4444; text-align: center; margin: 25px 0; text-shadow: 0 0 10px rgba(239, 68, 68, 0.5); font-family: 'Courier New', Courier, monospace; }
        .warning { background-color: rgba(239, 68, 68, 0.1); color: #fca5a5; padding: 15px; border-radius: 6px; font-size: 14px; margin-top: 20px; border-left: 4px solid #ef4444; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #4b5563; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0; color: #ef4444; text-transform: uppercase;">> Password Reset</h2>
        </div>

        <div class="content">
            <p>System Alert: Password reset sequence initiated.</p>
            <p>Use the override code below to reset your credentials:</p>

            <div class="code">{{ $otpCode }}</div>

            <div class="warning">
                <strong>WARNING:</strong> Do not share this code. Unauthorized access will be logged.
            </div>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} GeniusLab. Access Control.
        </div>
    </div>
</body>
</html>
