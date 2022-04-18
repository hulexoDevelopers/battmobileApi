const fs = require('fs');
const path = require('path');
module.exports = {
    readTemplate: templateName => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, `../helper/email-templates/${templateName}.html`), 'utf8', (err, html) => {
        
                if (err)
                    resolve(``);

                resolve(html);
            });
        });
    }
}