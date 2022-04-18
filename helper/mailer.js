var Q = require('q'); 
var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var sendMailTransport = require('nodemailer-smtp-transport');

module.exports = {
  _template: null, 
  _transport: null,

  init: function (config) {
    var d = Q.defer();

    emailTemplates(config.emailTplsDir, function (err, template) {
      if (err) {
        return d.reject(err);
      }

      this._template = template;
      this._transport = nodemailer.createTransport({ service: 'Sendgrid', auth: { user: 'physicsknowledge3546@gmail.com', pass: 'hanan3546' } });
      return d.resolve();
    }.bind(this));

    return d.promise;
  },

  send: function (from, to, subject, text, html) {
    var d = Q.defer();
    var params = {
      from: from, 
      to: to,
      subject: subject,
      text: text
    };

    if (html) {
      params.html = html;
    }

    this._transport.sendMail(params, function (err, res) {
      if (err) {
        // console.error(err);
        return d.reject(err);
      } else {
        return d.resolve(res);
      }
    });

    return d.promise;
  },

  sendMail: function (from, to, subject, tplName, locals) {
      // console.log("funhit")
    var d = Q.defer();
    var self = this;
    this.init({ emailTplsDir: "email-templates" }).then(function () {
      this._template(tplName, locals, function (err, html, text) {
        if (err) {
          // console.error(err);
          return d.reject(err);
        }

        self.send(from, to, subject, text, html)
          .then(function (res) {
            return d.resolve(res);
          });
      });
    }.bind(this));

    return d.promise;
  }
};