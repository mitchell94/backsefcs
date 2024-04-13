///////////////////////CONFIGURE URL/////////////////////////
const appRoot = require("app-root-path");
const config = require("../../../config");

let env = process.env.NODE_ENV;
let URL_PLUBLIC = "";
let SERVER = "";
let URL_LOG = "";
let URL_FINAL_LOG = "";
let publicFolder = "";
let urlIntranet = config.urlIntranet;

if (env === "dev") {
    URL_PLUBLIC = "C:/Users/51952/Desktop/SISTEMAS USE/seunsm/public/";
    SERVER = config.tempServer;
    URL_LOG = `${appRoot}/server/logs/accessDev.log`;
    URL_FINAL_LOG = `${appRoot}/server/logs/final-dev-log.json`;
}

if (env === "test") {
    if (config.SYSTEM === "SEFCSUNSM") {
        // publicFolder = path.join(__dirname, '..', 'testseunsm/public');
        // publicFolder = "/usr/share/nginx/html/testseunsm/public/";
        publicFolder = "/var/www/html/testseunsm/public/";
    }

    URL_PLUBLIC = publicFolder;
    SERVER = config.tempServer;
    URL_LOG = `${appRoot}/server/logs/accessTest.log`;
    URL_FINAL_LOG = `${appRoot}/server/logs/final-test-log.json`;
}

if (env === "pro") {
    if (config.SYSTEM === "SEFCSUNSM") {
        //publicFolder = path.join(__dirname, '..', '/seunsm/public');
        // publicFolder = "/usr/share/nginx/html/seunsm/public/";
        publicFolder = "/var/www/html/seunsm/public/";
    }

    URL_PLUBLIC = publicFolder;
    SERVER = config.tempServer;
    URL_LOG = `${appRoot}/server/logs/accessPro.log`;
    URL_FINAL_LOG = `${appRoot}/server/logs/final-pro-log.json`;
}

///////////////////////GENERATE CODEL/////////////////////////
// this function generate code like codePayment: ["SEGAOV"]
const generator = require("voucher-code-generator");
let generateCode = async (length) => {
    return generator.generate({
        length: length,
        count: 1,
        charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    });
};
///////////////////////GENERATE JSON FILE/////////////////////////
// this function generate code like codePayment: ["SEGAOV"]
const fs = require("fs");
const readline = require("readline");
let generateJsonLog = async () => {
    const lineReader = readline.createInterface({
        input: fs.createReadStream(URL_LOG),
    });
    const realJSON = [];
    lineReader.on("line", function (line) {
        realJSON.push(JSON.parse(line));
    });
    lineReader.on("close", function () {
        // final-log.json is the post-processed, valid JSON file
        fs.writeFile(URL_FINAL_LOG, JSON.stringify(realJSON), "utf8", () => {
            console.log("Done!");
        });
    });
};

///////////////////////NODEMAILER SEND MAIL FOR INSCRIPTION POSGRADE/////////////////////////
const nodemailer = require("nodemailer");

let templateInscription = async (
    name,
    conceptMask,
    conceptAmount,
    programMask,
    programID,
    organicUnitMask,
    codePayment
) => {
    let template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office" class="translated-ltr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 400;
                src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 400;
                src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 500;
                src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 500;
                src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 700;
                src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 700;
                src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 800;
                src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eRhf6Xl7Glw.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 800;
                src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eQhf6Xl7Gl3LX.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
        }

        #outlook a {
            padding: 0;
        }

        .ExternalClass,
        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass td,
        .ExternalClass div,
        .ExternalClass span,
        .ExternalClass font {
            line-height: 100%;
        }

        div[style*="margin: 14px 0;"],
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }

        @media only screen and (min-width: 621px) {
            .pc-container {
                width: 620px !important;
            }
        }

        @media only screen and (max-width: 620px) {
            .pc-menu-logo-s2,
            .pc-menu-nav-s1 {
                padding-left: 30px !important;
                padding-right: 30px !important
            }

            .pc-cta-box-s4 .pc-cta-box-in {
                padding: 35px 30px 30px !important
            }

            .pc-footer-box-s1,
            .pc-products-box-s3 {
                padding-left: 10px !important;
                padding-right: 10px !important
            }

            .pc-footer-row-s1 .pc-footer-row-col,
            .pc-product-s3 .pc-product-col {
                max-width: 100% !important
            }

            .pc-product-s3.pc-m-invert {
                direction: ltr !important
            }

            .pc-cta-box-s2 {
                padding: 35px 30px !important
            }

            .pc-spacing.pc-m-footer-h-46 td,
            .pc-spacing.pc-m-footer-h-57 td {
                font-size: 20px !important;
                height: 20px !important;
                line-height: 20px !important
            }
        }

        @media only screen and (max-width: 525px) {
            .pc-menu-logo-s2 {
                padding-bottom: 25px !important;
                padding-left: 20px !important;
                padding-right: 20px !important;
                padding-top: 25px !important
            }

            .pc-menu-nav-s1 {
                padding-left: 20px !important;
                padding-right: 20px !important
            }

            .pc-menu-nav-s1 .pc-menu-nav-divider {
                padding: 0 !important
            }

            .pc-cta-box-s4 .pc-cta-box-in {
                padding: 25px 20px 20px !important
            }

            .pc-cta-s1 .pc-cta-title {
                font-size: 24px !important;
                line-height: 1.42 !important
            }

            .pc-cta-text br,
            .pc-cta-title br,
            .pc-footer-text-s1 br {
                display: none !important
            }

            .pc-products-box-s3 {
                padding: 15px 0 !important
            }

            .pc-cta-box-s2 {
                padding: 25px 20px !important
            }

            .pc-footer-box-s1 {
                padding: 5px 0 !important
            }
        }
    </style>

    <link type="text/css" rel="stylesheet" charset="UTF-8"
          href="https://translate.googleapis.com/translate_static/css/translateelement.css">
</head>
<body class="pc-fb-font" bgcolor="#e5e5e5"
      style="background-color: #e5e5e5; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; width: 100% !important; Margin: 0 !important; padding: 0; line-height: 1.5; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%">
<table style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%" border="0" cellpadding="0"
       cellspacing="0">
    <tbody>
    <tr>
        <td style="padding: 0; vertical-align: top;" align="center" valign="top">
            <table class="pc-container" align="center"
                   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; Margin: 0 auto; max-width: 620px;"
                   width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                    <td align="left" style="vertical-align: top; padding: 0 10px;" valign="top"><span class="preheader"
                                                                                                      style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;"><font
                            style="vertical-align: inherit;"><font style="vertical-align: inherit;">SE UNSM</font></font></span>
                        <!-- ESPACIO INICIO-->
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 20px; font-size: 20px; line-height: 20px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- BANNER INICIAL-->
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top;background-color: #009688;border-radius: 8px;box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);"
                                    valign="top" bgcolor="#1B1B1B">
                                    <table border="0" cellpadding="0" cellspacing="0"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                           width="100%">
                                        <tbody>
                                        <tr>
                                            <td class="pc-menu-logo-s2" align="center"
                                                style="vertical-align: top; padding: 30px 40px 31px;" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0"
                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 130px;"
                                                       width="130">
                                                    <tbody>
                                                    <tr>
                                                        <td style="vertical-align: top;" valign="top"><a
                                                                href="http://seunsm.unsm"
                                                                style="text-decoration: none;">
                                                            <img src="https://unsm.edu.pe/wp-content/uploads/2016/10/Logo-small-UNSM-footer.png"
                                                                 width="130" height="22" alt=""
                                                                 style="border: 11px;line-height: 100%;outline: 0;-ms-interpolation-mode: bicubic;display: block;font-family: 'Fira Sans', Helvetica, Arial, sans-serif;font-size: 38px;font-weight: 500;color: #ffffff;height: auto;width: auto;">
                                                        </a></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>


                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 8px; -webkit-text-size-adjust: 100%; font-size: 8px; line-height: 8px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- MENSAJE-->
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td class="pc-cta-box-s4"
                                    style="vertical-align: top; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
                                    valign="top" bgcolor="#ffffff">
                                    <table border="0" cellpadding="0" cellspacing="0"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                           width="100%">
                                        <tbody>
                                        <tr>
                                            <td class="pc-cta-box-in"
                                                style="vertical-align: top; padding: 42px 40px 35px;" valign="top">
                                                <table class="pc-cta-s1" border="0" cellpadding="0" cellspacing="0"
                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                       width="100%">
                                                    <tbody>

                                                    <tr>
                                                        <td style="vertical-align: top; height: 12px; font-size: 12px; line-height: 12px;"
                                                            valign="top">&nbsp;
                                                        </td>
                                                    </tr>


                                                    <tr>
                                                        <td class="pc-cta-text pc-fb-font"
                                                            style="vertical-align: top;font-family: 'Fira Sans', Helvetica, Arial, sans-serif;font-size: 17px;font-weight: 300;line-height: 1.56;color: #9B9B9B;text-align: justify;"
                                                            valign="top" align="center">Hola <span style="
                     color: black;
                     font-weight: bold;
                     ">${name}</span>, gracias por
                                                            Inscribirte a
                                                            Nuestra escuela de <span style="
                     color: #009688;
                     font-weight: bold;
                     "> SE-UNSM.</span>
                                                            Para continuar, realice el pago de Inscripcion y
                                                            adjunte el comprobante de pago haciendo clic en el botón a
                                                            continuación:<br>
                                                        </td>
                                                    </tr>


                                                    <tr>
                                                        <td style="vertical-align: top; padding: 5px 0;" valign="top"
                                                            align="left">
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                                <tbody>
                                                                <tr>
                                                                    <td style="vertical-align: top; border-radius: 8px; text-align: center; background-color: #1595E7;"
                                                                        valign="top" bgcolor="#1595E7" align="center"><a
                                                                            href="${SERVER}payment/${codePayment}"
                                                                            style="line-height: 1.5; text-decoration: none; margin: 0; padding: 13px 17px; white-space: nowrap; border-radius: 8px; font-weight: 500; display: inline-block; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; cursor: pointer; background-color: #1595E7; color: #ffffff; border: 1px solid #1595E7;">Registrar
                                                                        comprobante</a></td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>

                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 8px; -webkit-text-size-adjust: 100%; font-size: 8px; line-height: 8px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- COSTOS-->
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td class="pc-footer-box-s1"
                                    style="vertical-align: top; padding: 21px 20px 14px; background-color: white; border-radius: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
                                    valign="top" bgcolor="#1B1B1B">
                                    <table border="0" cellpadding="0" cellspacing="0"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                           width="100%">
                                        <tbody>
                                        <tr>
                                            <td class="pc-footer-row-s1"
                                                style="vertical-align: top; font-size: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;"
                                                valign="top">
                                                <div class="pc-footer-row-col"
                                                     style="display: inline-block; width: 100%; max-width: 280px; vertical-align: top;">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                           width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td style="vertical-align: top; padding: 20px;"
                                                                valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       class="pc-footer-text-s1"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 1.33; letter-spacing: -0.2px; color: black;"
                                                                            valign="top"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">TOTAL A
                                                                            PAGAR</font></font>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; color: #40BE65;"
                                                                            valign="top">${conceptMask}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top;padding: 0px 0 0 0;font-family: 'Fira Sans', Helvetica, Arial, sans-serif;font-size: 41px;font-weight: 700;line-height: 1.42;letter-spacing: -0.4px;color: #151515;"
                                                                            valign="top">S/. ${conceptAmount}</td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>

                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="pc-footer-row-col"
                                                     style="display: inline-block; width: 100%; max-width: 280px; vertical-align: top;">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                           width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td style="vertical-align: top; padding: 20px;"
                                                                valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       class="pc-footer-text-s1"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 1.33; letter-spacing: -0.2px; color: black;"
                                                                            valign="top"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">Cuentas
                                                                            Bancarias.</font></font>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top;padding: 11px 0 0;font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.43; letter-spacing: -0.2px; color: #D8D8D8;"
                                                                            valign="top"><a
                                                                                style="text-decoration: none; cursor: text; color: black;"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">Banco
                                                                            de la nación </font></font></a></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top;font-family: 'Fira Sans', Helvetica, Arial, sans-serif;font-size: 14px;line-height: 1.43;letter-spacing: -0.2px;color: #607D8B;"
                                                                            valign="top"><a
                                                                                style="text-decoration: none; cursor: text; color: #607D8B;"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">CCI:294723984798
                                                                            / Codigo:7747979</font></font></a>
                                                                        </td>
                                                                    </tr>

                                                                    </tbody>
                                                                </table>

                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 8px; -webkit-text-size-adjust: 100%; font-size: 8px; line-height: 8px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- DESCRIPCION Y REDIRECCION AL PROGRAMA DE ESTUDIO-->
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td class=""
                                    style="vertical-align: top;padding: 30px 20px;background-color: #ffffff;border-radius: 8px;box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);"
                                    valign="top" bgcolor="#ffffff">
                                    <table class="pc-product-s3 pc-m-invert" dir="rtl" border="0" cellpadding="0"
                                           cellspacing="0"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; font-size: 0; direction: rtl;"
                                           width="100%">
                                        <tbody>
                                        <tr>
                                            <td style="vertical-align: top;" valign="top">

                                                <div class="pc-product-col" dir="ltr"
                                                     style="display: inline-block;width: 100%;/* max-width: 280px; */vertical-align: top;">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                           width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td style="vertical-align: top; padding: 10px 20px 0;"
                                                                valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; color: #40BE65;"
                                                                            valign="top">${organicUnitMask}
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; padding: 9px 0 0 0; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.42; letter-spacing: -0.4px; color: #151515;"
                                                                            valign="top">${programMask}
                                                                        </td>
                                                                    </tr>

                                                                    <tr>
                                                                        <td style="vertical-align: top; padding: 11px 0 0 0; font-size: 0;"
                                                                            valign="top">
                                                                            <!--[if (gte mso 9)|(IE)]>
                                                                            <table border="0" cellspacing="0"
                                                                                   cellpadding="0">
                                                                                <tr>
                                                                                    <td valign="middle">
                                                                            <![endif]-->
                                                                            <div style="display: inline-block; vertical-align: middle;">
                                                                                <table border="0" cellpadding="0"
                                                                                       cellspacing="0"
                                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                                       width="100%">
                                                                                    <tbody>
                                                                                    <tr>
                                                                                        <td style="vertical-align: top; padding: 10px 20px 10px 0;"
                                                                                            valign="top">
                                                                                            <table border="0"
                                                                                                   cellpadding="0"
                                                                                                   cellspacing="0"
                                                                                                   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                                                   width="100%">
                                                                                                <tbody>
                                                                                                <tr>
                                                                                                    <td align="left"
                                                                                                        style="vertical-align: top;"
                                                                                                        valign="top">
                                                                                                        <table border="0"
                                                                                                               cellpadding="0"
                                                                                                               cellspacing="0"
                                                                                                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;">
                                                                                                            <tbody>
                                                                                                            <tr>
                                                                                                                <td style="vertical-align: top; border-radius: 8px; text-align: center; background-color: #1595E7;"
                                                                                                                    valign="top"
                                                                                                                    bgcolor="#1595E7"
                                                                                                                    align="center">
                                                                                                                    <a class="pc-fb-font"
                                                                                                                       href="${SERVER}program-detail/${programID}"
                                                                                                                       style="line-height: 1.5; text-decoration: none; margin: 0; padding: 13px 17px; white-space: nowrap; border-radius: 8px; font-weight: 500; display: inline-block; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; cursor: pointer; background-color: #1595E7; color: #ffffff; border: 1px solid #1595E7;">Ver
                                                                                                                        mas</a>
                                                                                                                </td>
                                                                                                            </tr>
                                                                                                            </tbody>
                                                                                                        </table>
                                                                                                    </td>
                                                                                                </tr>
                                                                                                </tbody>
                                                                                            </table>
                                                                                        </td>
                                                                                    </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>

                                                                            <div style="display: inline-block; vertical-align: middle;">

                                                                            </div>

                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>

                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 8px; -webkit-text-size-adjust: 100%; font-size: 8px; line-height: 8px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- FOOTER CON INFORMACION DE CONTACTO-->
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td class="pc-footer-box-s1"
                                    style="vertical-align: top; padding: 21px 20px 14px; background-color: #1B1B1B; border-radius: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
                                    valign="top" bgcolor="#1B1B1B">
                                    <table border="0" cellpadding="0" cellspacing="0"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                           width="100%">
                                        <tbody>
                                        <tr>
                                            <td class="pc-footer-row-s1"
                                                style="vertical-align: top; font-size: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;"
                                                valign="top">
                                                <div class="pc-footer-row-col"
                                                     style="display: inline-block; width: 100%; max-width: 280px; vertical-align: top;">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                           width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td style="vertical-align: top; padding: 20px;"
                                                                valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       class="pc-footer-text-s1"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>

                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 1.33; letter-spacing: -0.2px; color: #ffffff;"
                                                                            valign="top"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">SEUNSM</font></font>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; padding: 11px 0 0; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.43; letter-spacing: -0.2px; color: #D8D8D8;"
                                                                            valign="top"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">La
                                                                            Escuela de SE tiene por finalidad: El
                                                                            estudio. </font><font
                                                                                style="vertical-align: inherit;">Siéntete
                                                                            libre de contactarnos.</font></font></td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table class="pc-spacing pc-m-footer-h-57" border="0"
                                                                       cellpadding="0" cellspacing="0"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td style="vertical-align: top; height: 57px; line-height: 57px; font-size: 57px;"
                                                                            valign="top">&nbsp;
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td style="vertical-align: top; line-height: 1.3; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 19px;"
                                                                            valign="top"><a
                                                                                href="https://www.facebook.com/unsmperu/"
                                                                                style="text-decoration: none;">
                                                                            <img src="https://icon-icons.com/icons2/555/PNG/512/facebook_icon-icons.com_53612.png"
                                                                                 width="20" height="20" alt=""
                                                                                 style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; font-size: 14px; color: #ffffff;">
                                                                        </a> <span>&nbsp;&nbsp;</span> <a
                                                                                href="https://twitter.com/unsmperu"
                                                                                style="text-decoration: none;">
                                                                            <img src="https://icon-icons.com/icons2/555/PNG/512/twitter_icon-icons.com_53611.png"
                                                                                 width="21" height="18" alt=""
                                                                                 style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; font-size: 14px; color: #ffffff;">
                                                                        </a> <span>&nbsp;&nbsp;</span> <a
                                                                                href="https://unsm.edu.pe"
                                                                                style="text-decoration: none;">
                                                                            <img src="https://unsm.edu.pe/wp-content/uploads/2017/09/Logo-UNSM-footer.png"
                                                                                 width="21" height="20" alt=""
                                                                                 style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; font-size: 14px; color: #ffffff;">
                                                                        </a> <span>&nbsp;&nbsp;</span></td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="pc-footer-row-col"
                                                     style="display: inline-block; width: 100%; max-width: 280px; vertical-align: top;">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                           width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td style="vertical-align: top; padding: 20px;"
                                                                valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       class="pc-footer-text-s1"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 1.33; letter-spacing: -0.2px; color: #ffffff;"
                                                                            valign="top"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">Contáctenos.</font></font>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; padding: 11px 0 0; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.43; letter-spacing: -0.2px; color: #D8D8D8;"
                                                                            valign="top"><a
                                                                                style="text-decoration: none; cursor: text; color: #D8D8D8;"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">Jr.
                                                                            Maynas N° 177, Tarapoto -
                                                                            Perú </font></font></a></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top;padding: 0px 0 0;font-family: 'Fira Sans', Helvetica, Arial, sans-serif;font-size: 14px;line-height: 1.43;letter-spacing: -0.2px;color: #D8D8D8;"
                                                                            valign="top"><a
                                                                                style="text-decoration: none; cursor: text; color: #D8D8D8;"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">Lunes a
                                                                            Viernes 7:00am a 2:30pm</font></font></a>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table class="pc-spacing pc-m-footer-h-46" border="0"
                                                                       cellpadding="0" cellspacing="0"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td style="vertical-align: top; height: 46px; line-height: 46px; font-size: 46px;"
                                                                            valign="top">&nbsp;
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 1.33; letter-spacing: -0.2px;"
                                                                            valign="top"><a href="tel: (51-42) 53-1641"
                                                                                            style="text-decoration: none; color: #ffffff;">
                                                                            (51-42) 53-1641</a></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; padding: 9px 0 0; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; line-height: 1.7;"
                                                                            valign="top"><a
                                                                                href="mailto:se@unsm.edu.pe"
                                                                                style="text-decoration: none; color: #1595E7;">se@unsm.edu.pe</a>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 20px; font-size: 20px; line-height: 20px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>


                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>


</body>
</html>
    `;
    return template;
};
let templateValidPayment = async (name, user, pass) => {
    let template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office" class="translated-ltr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 400;
                src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 400;
                src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 500;
                src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 500;
                src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 700;
                src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 700;
                src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 800;
                src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eRhf6Xl7Glw.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 800;
                src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eQhf6Xl7Gl3LX.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
        }

        #outlook a {
            padding: 0;
        }

        .ExternalClass,
        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass td,
        .ExternalClass div,
        .ExternalClass span,
        .ExternalClass font {
            line-height: 100%;
        }

        div[style*="margin: 14px 0;"],
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }

        @media only screen and (min-width: 621px) {
            .pc-container {
                width: 620px !important;
            }
        }

        @media only screen and (max-width: 620px) {
            .pc-menu-logo-s2,
            .pc-menu-nav-s1 {
                padding-left: 30px !important;
                padding-right: 30px !important
            }

            .pc-cta-box-s4 .pc-cta-box-in {
                padding: 35px 30px 30px !important
            }

            .pc-footer-box-s1,
            .pc-products-box-s3 {
                padding-left: 10px !important;
                padding-right: 10px !important
            }

            .pc-footer-row-s1 .pc-footer-row-col,
            .pc-product-s3 .pc-product-col {
                max-width: 100% !important
            }

            .pc-product-s3.pc-m-invert {
                direction: ltr !important
            }

            .pc-cta-box-s2 {
                padding: 35px 30px !important
            }

            .pc-spacing.pc-m-footer-h-46 td,
            .pc-spacing.pc-m-footer-h-57 td {
                font-size: 20px !important;
                height: 20px !important;
                line-height: 20px !important
            }
        }

        @media only screen and (max-width: 525px) {
            .pc-menu-logo-s2 {
                padding-bottom: 25px !important;
                padding-left: 20px !important;
                padding-right: 20px !important;
                padding-top: 25px !important
            }

            .pc-menu-nav-s1 {
                padding-left: 20px !important;
                padding-right: 20px !important
            }

            .pc-menu-nav-s1 .pc-menu-nav-divider {
                padding: 0 !important
            }

            .pc-cta-box-s4 .pc-cta-box-in {
                padding: 25px 20px 20px !important
            }

            .pc-cta-s1 .pc-cta-title {
                font-size: 24px !important;
                line-height: 1.42 !important
            }

            .pc-cta-text br,
            .pc-cta-title br,
            .pc-footer-text-s1 br {
                display: none !important
            }

            .pc-products-box-s3 {
                padding: 15px 0 !important
            }

            .pc-cta-box-s2 {
                padding: 25px 20px !important
            }

            .pc-footer-box-s1 {
                padding: 5px 0 !important
            }
        }
    </style>

    <link type="text/css" rel="stylesheet" charset="UTF-8"
          href="https://translate.googleapis.com/translate_static/css/translateelement.css">
</head>
<body class="pc-fb-font" bgcolor="#e5e5e5"
      style="background-color: #e5e5e5; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; width: 100% !important; Margin: 0 !important; padding: 0; line-height: 1.5; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%">
<table style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%" border="0" cellpadding="0"
       cellspacing="0">
    <tbody>
    <tr>
        <td style="padding: 0; vertical-align: top;" align="center" valign="top">
            <table class="pc-container" align="center"
                   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; Margin: 0 auto; max-width: 620px;"
                   width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                    <td align="left" style="vertical-align: top; padding: 0 10px;" valign="top"><span class="preheader"
                                                                                                      style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;"><font
                            style="vertical-align: inherit;"><font style="vertical-align: inherit;">SE UNSM</font></font></span>
                        <!-- ESPACIO INICIO-->
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 20px; font-size: 20px; line-height: 20px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- BANNER INICIAL-->
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;height: 10%; width: 100%;"
                               height="10%"
                               width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top;background-color: #009688;border-radius: 8px;box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);"
                                    height="10%"
                                    valign="top" bgcolor="#1B1B1B">
                                    <table border="0" cellpadding="0" cellspacing="0"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                           height="10%"
                                           width="100%">
                                        <tbody>
                                        <tr>
                                            <td class="pc-menu-logo-s2" align="center"
                                                style="vertical-align: top; padding: 10px 30px 10px;" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0"
                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 130px;"
                                                       width="130">
                                                    <tbody>
                                                    <tr>
                                                        <td style="vertical-align: top;" valign="top"><a
                                                                href="http://se.unsm"
                                                                style="text-decoration: none;">
                                                            <img src="https://unsm.edu.pe/wp-content/uploads/2016/10/Logo-small-UNSM-footer.png"
                                                                 width="130" height="22" alt=""
                                                                 style="border: 11px;line-height: 100%;outline: 0;-ms-interpolation-mode: bicubic;display: block;font-family: 'Fira Sans', Helvetica, Arial, sans-serif;font-size: 38px;font-weight: 500;color: #ffffff;height: auto;width: auto;">
                                                        </a></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>


                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 8px; -webkit-text-size-adjust: 100%; font-size: 8px; line-height: 8px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- MENSAJE-->
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td class="pc-cta-box-s4"
                                    style="vertical-align: top; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
                                    valign="top" bgcolor="#ffffff">
                                    <table border="0" cellpadding="0" cellspacing="0"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                           width="100%">
                                        <tbody>
                                        <tr>
                                            <td class="pc-cta-box-in"
                                                style="vertical-align: top; padding: 42px 40px 35px;" valign="top">
                                                <table class="pc-cta-s1" border="0" cellpadding="0" cellspacing="0"
                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                       width="100%">
                                                    <tbody>

                                                    <tr>
                                                        <td style="vertical-align: top; height: 12px; font-size: 12px; line-height: 12px;"
                                                            valign="top">&nbsp;
                                                        </td>
                                                    </tr>


                                                    <tr>
                                                        <td class="pc-cta-text pc-fb-font"
                                                            style="vertical-align: top;font-family: 'Fira Sans', Helvetica, Arial, sans-serif;font-size: 17px;font-weight: 300;line-height: 1.56;color: #9B9B9B;text-align: justify;"
                                                            valign="top" align="center">Hola <span style="
                                                                 color: black;
                                                                 font-weight: bold;
                                                                 ">${name}</span>
                                                            Bienvenido a nuestra Escuela de <span style="
                                                                 color: #009688;
                                                                 font-weight: bold;
                                                                 "> SE-UNSM.</span>
                                                            estas son sus credenciales
                                                            <hr>

                                                        </td>

                                                    </tr>


                                                    <tr>
                                                        <td class="pc-fb-font"
                                                            style="vertical-align: top; padding: 9px 0 9px  0; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.42; letter-spacing: -0.4px; color: #151515;"
                                                            valign="top"> Usuario : ${user} <br>
                                                            Contraseña : ${pass}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="pc-fb-font"
                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 500; color: #40BE65;"
                                                            valign="top">
                                                            <hr>Para continuar clic en el boton.
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="vertical-align: top; padding: 5px 0;" valign="top"
                                                            align="left">
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                                <tbody>
                                                                <tr>
                                                                    <td style="vertical-align: top; border-radius: 8px; text-align: center; background-color: #1595E7;"
                                                                        valign="top" bgcolor="#1595E7" align="center"><a
                                                                            href="http://example.com"
                                                                            style="line-height: 1.5; text-decoration: none; margin: 0; padding: 13px 17px; white-space: nowrap; border-radius: 8px; font-weight: 500; display: inline-block; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; cursor: pointer; background-color: #1595E7; color: #ffffff; border: 1px solid #1595E7;">Continuar</a>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>

                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 8px; -webkit-text-size-adjust: 100%; font-size: 8px; line-height: 8px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>

                        <!-- DESCRIPCION Y REDIRECCION AL PROGRAMA DE ESTUDIO-->

                        <!-- FOOTER CON INFORMACION DE CONTACTO-->
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td class="pc-footer-box-s1"
                                    style="vertical-align: top; padding: 21px 20px 14px; background-color: #1B1B1B; border-radius: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
                                    valign="top" bgcolor="#1B1B1B">
                                    <table border="0" cellpadding="0" cellspacing="0"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                           width="100%">
                                        <tbody>
                                        <tr>
                                            <td class="pc-footer-row-s1"
                                                style="vertical-align: top; font-size: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%;"
                                                valign="top">
                                                <div class="pc-footer-row-col"
                                                     style="display: inline-block; width: 100%; max-width: 280px; vertical-align: top;">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                           width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td style="vertical-align: top; padding: 20px;"
                                                                valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       class="pc-footer-text-s1"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>

                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 1.33; letter-spacing: -0.2px; color: #ffffff;"
                                                                            valign="top"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">SEUNSM</font></font>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; padding: 11px 0 0; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.43; letter-spacing: -0.2px; color: #D8D8D8;"
                                                                            valign="top"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">La
                                                                            Escuela de Se tiene por finalidad: El
                                                                            estudio. </font><font
                                                                                style="vertical-align: inherit;">Siéntete
                                                                            libre de contactarnos.</font></font></td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table class="pc-spacing pc-m-footer-h-57" border="0"
                                                                       cellpadding="0" cellspacing="0"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td style="vertical-align: top; height: 57px; line-height: 57px; font-size: 57px;"
                                                                            valign="top">&nbsp;
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td style="vertical-align: top; line-height: 1.3; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 19px;"
                                                                            valign="top"><a
                                                                                href="https://www.facebook.com/unsmperu/"
                                                                                style="text-decoration: none;">
                                                                            <img src="https://icon-icons.com/icons2/555/PNG/512/facebook_icon-icons.com_53612.png"
                                                                                 width="20" height="20" alt=""
                                                                                 style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; font-size: 14px; color: #ffffff;">
                                                                        </a> <span>&nbsp;&nbsp;</span> <a
                                                                                href="https://twitter.com/unsmperu"
                                                                                style="text-decoration: none;">
                                                                            <img src="https://icon-icons.com/icons2/555/PNG/512/twitter_icon-icons.com_53611.png"
                                                                                 width="21" height="18" alt=""
                                                                                 style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; font-size: 14px; color: #ffffff;">
                                                                        </a> <span>&nbsp;&nbsp;</span> <a
                                                                                href="https://unsm.edu.pe"
                                                                                style="text-decoration: none;">
                                                                            <img src="https://unsm.edu.pe/wp-content/uploads/2017/09/Logo-UNSM-footer.png"
                                                                                 width="21" height="20" alt=""
                                                                                 style="border: 0; line-height: 100%; outline: 0; -ms-interpolation-mode: bicubic; font-size: 14px; color: #ffffff;">
                                                                        </a> <span>&nbsp;&nbsp;</span></td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div class="pc-footer-row-col"
                                                     style="display: inline-block; width: 100%; max-width: 280px; vertical-align: top;">
                                                    <table border="0" cellpadding="0" cellspacing="0"
                                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                           width="100%">
                                                        <tbody>
                                                        <tr>
                                                            <td style="vertical-align: top; padding: 20px;"
                                                                valign="top">
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       class="pc-footer-text-s1"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 1.33; letter-spacing: -0.2px; color: #ffffff;"
                                                                            valign="top"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">Contáctenos.</font></font>
                                                                        </td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; padding: 11px 0 0; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.43; letter-spacing: -0.2px; color: #D8D8D8;"
                                                                            valign="top"><a
                                                                                style="text-decoration: none; cursor: text; color: #D8D8D8;"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">Jr.
                                                                            Maynas N° 177, Tarapoto -
                                                                            Perú </font></font></a></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top;padding: 0px 0 0;font-family: 'Fira Sans', Helvetica, Arial, sans-serif;font-size: 14px;line-height: 1.43;letter-spacing: -0.2px;color: #D8D8D8;"
                                                                            valign="top"><a
                                                                                style="text-decoration: none; cursor: text; color: #D8D8D8;"><font
                                                                                style="vertical-align: inherit;"><font
                                                                                style="vertical-align: inherit;">Lunes a
                                                                            Viernes 7:00am a 2:30pm</font></font></a>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table class="pc-spacing pc-m-footer-h-46" border="0"
                                                                       cellpadding="0" cellspacing="0"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td style="vertical-align: top; height: 46px; line-height: 46px; font-size: 46px;"
                                                                            valign="top">&nbsp;
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                                <table border="0" cellpadding="0" cellspacing="0"
                                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                                       width="100%">
                                                                    <tbody>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 500; line-height: 1.33; letter-spacing: -0.2px;"
                                                                            valign="top"><a href="tel: (51-42) 53-1641"
                                                                                            style="text-decoration: none; color: #ffffff;">
                                                                            (51-42) 53-1641</a></td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td class="pc-fb-font"
                                                                            style="vertical-align: top; padding: 9px 0 0; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 14px; font-weight: 500; line-height: 1.7;"
                                                                            valign="top"><a
                                                                                href="mailto:se@unsm.edu.pe"
                                                                                style="text-decoration: none; color: #1595E7;">se@unsm.edu.pe</a>
                                                                        </td>
                                                                    </tr>
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 20px; font-size: 20px; line-height: 20px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>


                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>


</body>
</html>`;
    return template;
};
let templateSendUserCredential = async (name, user, pass) => {
    let template = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office" class="translated-ltr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
    <style type="text/css">
        @media screen {
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 400;
                src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvl4jLazX3dA.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 400;
                src: local('Fira Sans Regular'), local('FiraSans-Regular'), url(https://fonts.gstatic.com/s/firasans/v8/va9E4kDNxMZdWfMOD5Vvk4jLazX3dGTP.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 500;
                src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveRhf6Xl7Glw.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 500;
                src: local('Fira Sans Medium'), local('FiraSans-Medium'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnZKveQhf6Xl7Gl3LX.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 700;
                src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eRhf6Xl7Glw.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 700;
                src: local('Fira Sans Bold'), local('FiraSans-Bold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnLK3eQhf6Xl7Gl3LX.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 800;
                src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eRhf6Xl7Glw.woff2) format('woff2');
                unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }
            @font-face {
                font-family: 'Fira Sans';
                font-style: normal;
                font-weight: 800;
                src: local('Fira Sans ExtraBold'), local('FiraSans-ExtraBold'), url(https://fonts.gstatic.com/s/firasans/v8/va9B4kDNxMZdWfMOD5VnMK7eQhf6Xl7Gl3LX.woff2) format('woff2');
                unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
            }
        }

        #outlook a {
            padding: 0;
        }

        .ExternalClass,
        .ReadMsgBody {
            width: 100%;
        }

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass td,
        .ExternalClass div,
        .ExternalClass span,
        .ExternalClass font {
            line-height: 100%;
        }

        div[style*="margin: 14px 0;"],
        div[style*="margin: 16px 0;"] {
            margin: 0 !important;
        }

        @media only screen and (min-width: 621px) {
            .pc-container {
                width: 620px !important;
            }
        }

        @media only screen and (max-width: 620px) {
            .pc-menu-logo-s2,
            .pc-menu-nav-s1 {
                padding-left: 30px !important;
                padding-right: 30px !important
            }

            .pc-cta-box-s4 .pc-cta-box-in {
                padding: 35px 30px 30px !important
            }

            .pc-footer-box-s1,
            .pc-products-box-s3 {
                padding-left: 10px !important;
                padding-right: 10px !important
            }

            .pc-footer-row-s1 .pc-footer-row-col,
            .pc-product-s3 .pc-product-col {
                max-width: 100% !important
            }

            .pc-product-s3.pc-m-invert {
                direction: ltr !important
            }

            .pc-cta-box-s2 {
                padding: 35px 30px !important
            }

            .pc-spacing.pc-m-footer-h-46 td,
            .pc-spacing.pc-m-footer-h-57 td {
                font-size: 20px !important;
                height: 20px !important;
                line-height: 20px !important
            }
        }

        @media only screen and (max-width: 525px) {
            .pc-menu-logo-s2 {
                padding-bottom: 25px !important;
                padding-left: 20px !important;
                padding-right: 20px !important;
                padding-top: 25px !important
            }

            .pc-menu-nav-s1 {
                padding-left: 20px !important;
                padding-right: 20px !important
            }

            .pc-menu-nav-s1 .pc-menu-nav-divider {
                padding: 0 !important
            }

            .pc-cta-box-s4 .pc-cta-box-in {
                padding: 25px 20px 20px !important
            }

            .pc-cta-s1 .pc-cta-title {
                font-size: 24px !important;
                line-height: 1.42 !important
            }

            .pc-cta-text br,
            .pc-cta-title br,
            .pc-footer-text-s1 br {
                display: none !important
            }

            .pc-products-box-s3 {
                padding: 15px 0 !important
            }

            .pc-cta-box-s2 {
                padding: 25px 20px !important
            }

            .pc-footer-box-s1 {
                padding: 5px 0 !important
            }
        }
    </style>

    <link type="text/css" rel="stylesheet" charset="UTF-8"
          href="https://translate.googleapis.com/translate_static/css/translateelement.css">
</head>
<body class="pc-fb-font" bgcolor="#e5e5e5"
      style="background-color: #e5e5e5; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; width: 100% !important; Margin: 0 !important; padding: 0; line-height: 1.5; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%">
<table style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%" border="0" cellpadding="0"
       cellspacing="0">
    <tbody>
    <tr>
        <td style="padding: 0; vertical-align: top;" align="center" valign="top">
            <table class="pc-container" align="center"
                   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; Margin: 0 auto; max-width: 620px;"
                   width="100%" border="0" cellpadding="0" cellspacing="0">
                <tbody>
                <tr>
                    <td align="left" style="vertical-align: top; padding: 0 10px;" valign="top"><span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;"><font
                            style="vertical-align: inherit;"><font style="vertical-align: inherit;">SE UNSM</font></font></span>
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;height: 10%; width: 100%;"
                               height="10%"
                               width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top;background-color: #009688;border-radius: 8px;box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);"
                                    height="10%"
                                    valign="top" bgcolor="#1B1B1B">
                                    <table border="0" cellpadding="0" cellspacing="0"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                           height="10%"
                                           width="100%">
                                        <tbody>
                                        <tr>
                                            <td class="pc-menu-logo-s2" align="center"
                                                style="vertical-align: top; padding: 10px 30px 10px;" valign="top">
                                                <table border="0" cellpadding="0" cellspacing="0"
                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 130px;"
                                                       width="130">
                                                    <tbody>
                                                    <tr>
                                                        <td style="vertical-align: top;" valign="top"><a
                                                                href="http://se.unsm"
                                                                style="text-decoration: none;">
                                                            <img src="https://unsm.edu.pe/wp-content/uploads/2016/10/Logo-small-UNSM-footer.png"
                                                                 width="130" height="22" alt=""
                                                                 style="border: 11px;line-height: 100%;outline: 0;-ms-interpolation-mode: bicubic;display: block;font-family: 'Fira Sans', Helvetica, Arial, sans-serif;font-size: 38px;font-weight: 500;color: #ffffff;height: auto;width: auto;">
                                                        </a></td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 8px; -webkit-text-size-adjust: 100%; font-size: 8px; line-height: 8px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- MENSAJE-->
                        <table border="0" cellpadding="0" cellspacing="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td class="pc-cta-box-s4"
                                    style="vertical-align: top; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1)"
                                    valign="top" bgcolor="#ffffff">
                                    <table border="0" cellpadding="0" cellspacing="0"
                                           style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                           width="100%">
                                        <tbody>
                                        <tr>
                                            <td class="pc-cta-box-in"
                                                style="vertical-align: top; padding: 42px 40px 35px;" valign="top">
                                                <table class="pc-cta-s1" border="0" cellpadding="0" cellspacing="0"
                                                       style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;"
                                                       width="100%">
                                                    <tbody>
                                                    <tr>
                                                        <td style="vertical-align: top; height: 12px; font-size: 12px; line-height: 12px;"
                                                            valign="top">&nbsp;
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="pc-cta-text pc-fb-font"
                                                            style="vertical-align: top;font-family: 'Fira Sans', Helvetica, Arial, sans-serif;font-size: 17px;font-weight: 300;line-height: 1.56;color: #9B9B9B;text-align: justify;"
                                                            valign="top" align="center">Obsta. <span style="
                                                                 color: black;
                                                                 font-weight: bold;
                                                                 ">${name}</span>,
                                                            le damos la bienvenida al <span style="
                                                                 color: #009688;
                                                                 font-weight: bold;
                                                                 ">PROGRAMA DE SEGUNDA ESPECIALIDAD / USE - FCS, UNSM.</span>
                                                            A continuación, le proporcionamos sus credenciales de acceso.
                                                            <hr>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="pc-fb-font"
                                                            style="vertical-align: top; padding: 9px 0 9px  0; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 24px; font-weight: 700; line-height: 1.42; letter-spacing: -0.4px; color: #151515;"
                                                            valign="top"> Usuario : ${user} <br>
                                                            Contraseña : ${pass}
                                                            <span style="color: red; display: block; margin-top: 20px;">*Recomendamos cambiar su contraseña</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td class="pc-fb-font"
                                                            style="vertical-align: top; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 17px; font-weight: 500; color: #40BE65;"
                                                            valign="top">
                                                            <hr>Clic para continuar.
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="vertical-align: top; padding: 5px 0;" valign="top"
                                                            align="left">
                                                            <table border="0" cellpadding="0" cellspacing="0"
                                                                   style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                                <tbody>
                                                                <tr>
                                                                    <td style="vertical-align: top; border-radius: 8px; text-align: center; background-color: #1595E7;"
                                                                        valign="top" bgcolor="#1595E7" align="center"><a
                                                                            href='${urlIntranet}'
                                                                            style="line-height: 1.5; text-decoration: none; margin: 0; padding: 13px 17px; white-space: nowrap; border-radius: 8px; font-weight: 500; display: inline-block; font-family: 'Fira Sans', Helvetica, Arial, sans-serif; font-size: 16px; cursor: pointer; background-color: #1595E7; color: #ffffff; border: 1px solid #1595E7;">Continuar</a>
                                                                    </td>
                                                                </tr>
                                                                </tbody>
                                                            </table>
                                                        </td>
                                                    </tr>

                                                    </tbody>
                                                </table>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table border="0" cellspacing="0" cellpadding="0"
                               style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;" width="100%">
                            <tbody>
                            <tr>
                                <td style="vertical-align: top; padding: 0; height: 8px; -webkit-text-size-adjust: 100%; font-size: 8px; line-height: 8px;"
                                    valign="top">&nbsp;
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <!-- DESCRIPCION Y REDIRECCION AL PROGRAMA DE ESTUDIO-->
                    </td>
                </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </tbody>
</table>


</body>
</html>`;
    return template;
};
let wrapedSendMail = async (mailOptions) => {
    return new Promise((resolve, reject) => {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                // user: "mitper94@gmail.com",
                // pass: "cmmnlgswocieciiu",
                user: "usefcs@unsm.edu.pe",
                pass: "scekvxprzshiljud",
            },
        });
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("error is " + error);
                resolve(false);
            } else {
                console.log("Email sent: " + info.response);
                resolve(true);
            }
        });
    });
};
///////////////////////VALIDATE PASS BY BYCRYPT/////////////////////////
const bcrypt = require("bcryptjs");
const path = require("path");
let validatePass = async (param1, param2) => {
    return new Promise(function (resolve, reject) {
        bcrypt.compare(param2, param1, function (err, res) {
            if (err) {
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

let encrytedPass = async (pass) => {
    let salt = await bcrypt.genSalt(11);
    let hashCode = await bcrypt.hash(pass, salt);
    return hashCode;
};
///////////////////////////////////*//////////////////////////////////////
// /////////////////////VALIDATE PASS BY BYCRYPT/////////////////////////
let zeroPad = async (num, places) => {
    const zero = places - num.toString().length + 1;
    return Array(+(zero > 0 && zero)).join("0") + num;
};
///////////////////////////////////*//////////////////////////////////////
// /////////////////////////////////*//////////////////////////////////////

let migrateWriteFile = async (tempPath, data) => {
    return new Promise(function (resolve, reject) {
        fs.writeFile(tempPath, data, function (err, res) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};
let migrateRenameFile = async (tempPath, finalPath) => {
    return new Promise(function (resolve, reject) {
        fs.rename(tempPath, finalPath, function (err, res) {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};
// /////////////////////////////////*//////////////////////////////////////
let numberToLetter = async (num) => {
    let number;
    switch (num) {
        case 0:
            number = "CERO";
            break;
        case 1:
            number = "UNO";
            break;
        case 2:
            number = "DOS";
            break;
        case 3:
            number = "TRES";
            break;
        case 4:
            number = "CUATRO";
            break;
        case 5:
            number = "CINCO";
            break;
        case 6:
            number = "SEIS";
            break;
        case 7:
            number = "SIETE";
            break;
        case 8:
            number = "OCHO";
            break;
        case 9:
            number = "NUEVE";
            break;
        case 10:
            number = "DIEZ";
            break;
        case 11:
            number = "ONCE";
            break;
        case 12:
            number = "DOCE";
            break;
        case 13:
            number = "TRECE";
            break;
        case 14:
            number = "CATORCE";
            break;
        case 15:
            number = "QUINCE";
            break;
        case 16:
            number = "DIECISÉIS";
            break;
        case 17:
            number = "DIECISIETE";
            break;
        case 18:
            number = "DIECIOCHO";
            break;
        case 19:
            number = "DIECINUEVE";
            break;
        case 20:
            number = "VEINTE";
            break;
    }
    return number;
};
///////////////////////////////////*//////////////////////////////////////
module.exports = {
    wrapedSendMail,
    generateCode,
    generateJsonLog,
    templateInscription,
    templateValidPayment,
    templateSendUserCredential,
    validatePass,
    migrateRenameFile,
    migrateWriteFile,
    encrytedPass,
    zeroPad,
    numberToLetter,
    URL_PLUBLIC,
    URL_LOG,
    URL_FINAL_LOG,
};
