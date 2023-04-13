export const templateConfirmEmailCafecitoEs = (code: string) => {
  return `<!DOCTYPE html>
    <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="x-apple-disable-message-reformatting">
        <title></title>
        <!--[if mso]>
        <noscript>
            <xml>
                <o:OfficeDocumentSettings>
                    <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
            </xml>
        </noscript>
        <![endif]-->
        <style>
            table, td, div, h1, p {font-family: Arial, sans-serif;}
        </style>
    </head>
    <body style="margin:0;padding:0;"> 
        <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;background:#ffffff;">
            <tr>
                <td align="center" style="padding:0px;">
                    <table role="presentation" style="width:602px;text-align:left;">
                        <tr>
                            <td align="center" style="padding:40px 0 20px 0;background:#ffffff;">
                                <img src="https://cafecito.com/assets/logo/logo.png" alt="" width="180" style="height:auto;display:block;" />
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:36px 20px 42px 20px;">
                                <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                    <tr>
                                        <td style="padding:0 0 36px 0;color:#153643;">
                                            <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Verificar tu correo</h1>
                                            <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                                                Bienbenido a cafecito, plataforma de citas. Usted confirma que es mayor de edad para ingresar.
                                            </p>
                                            <p>
                                                Usa este código para completar el registro de este correo:
                                            </p>
                                            <h1 style="font-size:36px;margin:20px 0 20px 0;font-weight:lighter; text-align: center; font-family:Arial,sans-serif;">${code}</h1>
                                            <p style="margin:0 0 12px 0;">
                                                Este código vence en 24 horas.
                                            </p>
                                            <p>
                                                Si no reconoces support@cafecito.com, puedes ignorar este correo electrónico.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding:20px;background:#fff;">
                                <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                    <tr>
                                        <td style="padding:0;width:50%;" align="left">
                                            <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#666;">
                                                &reg; cafecito, United State 2022
                                            </p>
                                        </td>
                                        <td style="padding:0;width:50%;" align="right">
                                            <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                                                <tr>
                                                    <td style="padding:0 0 0 10px;width:38px;">
                                                        <a href="http://www.twitter.com/cafecitocom" style="color:#666;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                                                    </td>
                                                    <td style="padding:0 0 0 10px;width:38px;">
                                                        <a href="http://www.facebook.com/cafecitocom" style="color:#666;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>`;
};

export const templateConfirmEmailCafecitoEn = (code) => {
  return `<!DOCTYPE html>
      <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width,initial-scale=1">
          <meta name="x-apple-disable-message-reformatting">
          <title></title>
          <!--[if mso]>
          <noscript>
              <xml>
                  <o:OfficeDocumentSettings>
                      <o:PixelsPerInch>96</o:PixelsPerInch>
                  </o:OfficeDocumentSettings>
              </xml>
          </noscript>
          <![endif]-->
          <style>
              table, td, div, h1, p {font-family: Arial, sans-serif;}
          </style>
      </head>
      <body style="margin:0;padding:0;"> 
          <table role="presentation" style="width:100%;background:#ffffff;">
              <tr>
                  <td align="center" style="padding:0px;">
                      <table role="presentation" style="width:100%;text-align:left;">
                          <tr>
                              <td align="center" style="padding:40px 0 20px 0;background:#ffffff;">
                                  <img src="https://cafecito.com/assets/logo/logo.png" alt="" width="180" style="height:auto;display:block;" />
                              </td>
                          </tr>
                          <tr>
                              <td style="padding:36px 20px 42px 20px;">
                                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                      <tr>
                                          <td style="padding:0 0 36px 0;color:#153643;">
                                              <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Check your mail</h1>
                                              <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                                                Welcome to cafecito dating platform. You confirm that you are of legal age to enter.
                                              </p>
                                              <p>
                                                Use this code to complete the registration of this email:
                                              </p>
                                              <h1 style="font-size:36px;margin:20px 0 20px 0;font-weight:lighter; text-align: center; font-family:Arial,sans-serif;">${code}</h1>
                                              <p style="margin:0 0 12px 0;">
                                                This code expires in 24 hours.
                                              </p>
                                              <p>
                                                If you don't recognize support@cafecito.com, you can ignore this email.
                                              </p>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding:20px;background:#fff;">
                                  <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                      <tr>
                                          <td style="padding:0;width:50%;" align="left">
                                              <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#666;">
                                                  &reg; cafecito, United States 2022
                                              </p>
                                          </td>
                                          <td style="padding:0;width:50%;" align="right">
                                              <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                                                  <tr>
                                                      <td style="padding:0 0 0 10px;width:38px;">
                                                          <a href="http://www.twitter.com/cafecitocom" style="color:#666;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                                                      </td>
                                                      <td style="padding:0 0 0 10px;width:38px;">
                                                          <a href="http://www.facebook.com/cafecitocom" style="color:#666;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                                                      </td>
                                                  </tr>
                                              </table>
                                          </td>
                                      </tr>
                                  </table>
                              </td>
                          </tr>
                      </table>
                  </td>
              </tr>
          </table>
      </body>
      </html>`;
};

export const templateConfirmPaymentcafecitoEn = (
  name: string,
  codeCollection: string,
  date: string,
  product: string,
  quantity: number,
  price: string,
  total: string,
) => {
  return `<!DOCTYPE html>
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width,initial-scale=1">
            <meta name="x-apple-disable-message-reformatting">
            <title></title>
            <!--[if mso]>
            <noscript>
                <xml>
                    <o:OfficeDocumentSettings>
                        <o:PixelsPerInch>96</o:PixelsPerInch>
                    </o:OfficeDocumentSettings>
                </xml>
            </noscript>
            <![endif]-->
            <style>
                table, td, div, h1, p {font-family: Arial, sans-serif;}
            </style>
        </head>
        <body style="margin:0;padding:0;"> 
            <table role="presentation" style="width:100%;background:#ffffff;">
                <tr>
                    <td align="center" style="padding:0px;">
                        <table role="presentation" style="width:100%;text-align:left;">
                            <tr>
                                <td align="left" style="padding:40px 20px 20px 20px;background:#ffffff;">
                                    <img src="https://cafecito.com/assets/logo/logo.png" alt="" width="120" style="height:auto;display:block;" />
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:16px 20px 0px 20px;">
                                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
                                        <tr>
                                            <td style="padding:0 0 0px 0;color:#153643;">
                                                <h1 style="font-size:24px;margin:0 0 20px 0;font-family:Arial,sans-serif;">Hello ${name}</h1>
                                                <p style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                                                    Thank you for your purchase.
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding:20px;background:#fff;">
                                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                        <thead>
                                            <th style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                                                Order Details
                                            </th>
                                        </thead>
                                        <tr>
                                            <td style="padding-top:10px;width:50%; display: flex;" align="left">
                                                <p style="margin:0;font-size:16px;line-height:16px;font-family:Arial,sans-serif;color:#666; width: 150px;">
                                                    Order number
                                                </p>
                                                <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#666;">
                                                ${codeCollection}
                                                </p>
                                            </td>
                                            <td style="padding-top:10px;width:50%; display: flex;" align="left">
                                                <p style="margin:0;font-size:16px;line-height:16px;font-family:Arial,sans-serif;color:#666; width: 150px;">
                                                    Payment date
                                                </p>
                                                <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#666;">
                                                ${date}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:20px;background:#fff;">
                                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                        <thead>
                                            <th style="margin:0 0 12px 0;font-size:16px;line-height:24px;font-family:Arial,sans-serif;">
                                                Ordered products
                                            </th>
                                        </thead>
                                        <tr>
                                            <td style="padding-top:10px;width:50%; display: flex;" align="left">
                                                <p style="margin:0;font-size:16px;line-height:16px;font-family:Arial,sans-serif;color:#666; width: 350px;">
                                                    Product
                                                </p>
                                                <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#666; width: 100px;">
                                                    Quantity
                                                </p>
                                                <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#666; width: 100px; text-align: right;">
                                                    Price
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:10px;width:50%; display: flex;" align="left">
                                                <p style="margin:0;font-size:16px;line-height:16px;font-family:Arial,sans-serif;color:#666; width: 350px;">
                                                    ${product}
                                                </p>
                                                <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#666; width: 100px;">
                                                    ${quantity}
                                                </p>
                                                <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#666; width: 100px; text-align: right;">
                                                    ${price}
                                                </p>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding-top:10px;width:50%; display: flex;" align="left">
                                                <p style="margin:0;font-size:20px;line-height:24px;font-family:Arial,sans-serif;color:#666; width: 550px; text-align: right;">
                                                    TOTAL ${total}
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding:20px;background:#fff;">
                                    <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;font-size:9px;font-family:Arial,sans-serif;">
                                        <tr>
                                            <td style="padding:0;width:50%;" align="left">
                                                <p style="margin:0;font-size:14px;line-height:16px;font-family:Arial,sans-serif;color:#666;">
                                                    &reg; cafecito, United States 2022
                                                </p>
                                            </td>
                                            <td style="padding:0;width:50%;" align="right">
                                                <table role="presentation" style="border-collapse:collapse;border:0;border-spacing:0;">
                                                    <tr>
                                                        <td style="padding:0 0 0 10px;width:38px;">
                                                            <a href="http://www.twitter.com/cafecitocom" style="color:#666;"><img src="https://assets.codepen.io/210284/tw_1.png" alt="Twitter" width="38" style="height:auto;display:block;border:0;" /></a>
                                                        </td>
                                                        <td style="padding:0 0 0 10px;width:38px;">
                                                            <a href="http://www.facebook.com/cafecitocom" style="color:#666;"><img src="https://assets.codepen.io/210284/fb_1.png" alt="Facebook" width="38" style="height:auto;display:block;border:0;" /></a>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;
};
