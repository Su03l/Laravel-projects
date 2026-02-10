<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .code { font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4F46E5; text-align: center; margin: 20px 0; background: #EEF2FF; padding: 15px; border-radius: 8px; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>{{ $reason }}</h2>
        </div>
        <p>Hello,</p>
        <p>Use the following code to complete your request. This code is valid for 10 minutes.</p>

        <div class="code">{{ $otpCode }}</div>

        <p>If you did not request this code, please ignore this email.</p>

        <div class="footer">
            &copy; {{ date('Y') }} GeniusLab. All rights reserved.
        </div>
    </div>
</body>
</html>
