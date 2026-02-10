<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Courier New', Courier, monospace; background-color: #050505; padding: 40px 0; margin: 0; color: #e5e7eb; }
        .container { max-width: 600px; margin: 0 auto; background: #0a0a0a; padding: 40px; border-radius: 12px; border: 1px solid #22c55e; box-shadow: 0 0 30px rgba(34, 197, 94, 0.3); }
        .header { text-align: center; margin-bottom: 30px; }
        .btn { display: inline-block; background-color: #22c55e; color: #000; padding: 14px 28px; text-decoration: none; border-radius: 4px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 15px rgba(34, 197, 94, 0.5); transition: all 0.3s; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #4b5563; }
        .highlight { color: #22c55e; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #ffffff; text-transform: uppercase;">> System Online</h1>
        </div>
        <p style="font-family: sans-serif;">Greetings, {{ $user->name }}.</p>
        <p style="font-family: sans-serif;">You have successfully connected to the <span class="highlight">GeniusLab Network</span>. Access to advanced AI models is now granted.</p>

        <p style="font-family: sans-serif; background: rgba(34, 197, 94, 0.1); padding: 15px; border-left: 4px solid #22c55e;">
            Bonus Credits: <strong style="color: #22c55e;">1,000 CR</strong> added to wallet.
        </p>

        <div style="text-align: center; margin: 40px 0;">
            <a href="{{ config('app.frontend_url', 'http://localhost:3000') }}" class="btn">Launch Console</a>
        </div>

        <div class="footer">
            &copy; {{ date('Y') }} GeniusLab. All systems operational.
        </div>
    </div>
</body>
</html>
