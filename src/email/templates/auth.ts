
export const welcomeEmailTemplate = (name: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to SF Rwanda</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .header {
                color: white;
                background-color: #5051F9;
                padding: 20px;
                font-size: 24px;
                font-weight: bold;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Welcome to SF Rwanda</div>
            <div class="content">
                <p>Dear ${name} Team,</p>
                <p>We are delighted to welcome you to SF Rwanda! Your company is now part of an innovative ecosystem dedicated to excellence and partnership.</p>
                <p>At SF Rwanda, we believe in strong collaborations and providing our partners with the tools and support needed for success. We are excited to embark on this journey with you.</p>
                <p>If you have any questions, feel free to reach out to our support team. We look forward to a prosperous partnership.</p>
                <p>Best Regards,<br><strong>SF Rwanda Team</strong></p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} SF Rwanda. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};


export const setupAccountEmailTemplate = (name: string, setupLink: string) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Set Up Your Account</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                text-align: center;
            }
            .header {
                color: white;
                background-color: #5051F9;
                padding: 20px;
                font-size: 24px;
                font-weight: bold;
                border-radius: 10px 10px 0 0;
            }
            .content {
                padding: 20px;
                font-size: 16px;
                color: #333;
            }
            .button {
                display: inline-block;
                background-color: #5051F9;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                font-size: 18px;
                border-radius: 5px;
                margin-top: 20px;
            }
            .footer {
                margin-top: 20px;
                font-size: 14px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">Set Up Your Account</div>
            <div class="content">
                <p>Dear ${name} Team,</p>
                <p>Your partnership with SF Rwanda has been successfully registered! To start using our platform, please set up your account by clicking the button below.</p>
                <a href="${setupLink}" class="button" target="_blank">Set Up Your Account</a>
                <p>If you experience any issues, feel free to contact our support team.</p>
                <p>Best Regards,<br><strong>SF Rwanda Team</strong></p>
            </div>
            <div class="footer">
                &copy; ${new Date().getFullYear()} SF Rwanda. All rights reserved.
            </div>
        </div>
    </body>
    </html>
    `;
};

