const https = require("https");
const crypto = require("crypto");
const buffer = require("buffer");

function MT5Request(server, port) {
  this.server = server;
  this.port = port;
  this.https = new https.Agent();
  this.https.maxSockets = 1;
}

MT5Request.prototype.parseBodyJSON = function (error, res, body, callback) {
  if (error) {
    callback && callback(error);
    return null;
  }
  if (res.statusCode != 200) {
    callback && callback(res.statusCode);
    return null;
  }
  var answer = null;
  try {
    answer = JSON.parse(body);
  } catch {
    console.log("Parse JSON error");
  }
  if (!answer) {
    callback && callback("invalid body answer");
    return null;
  }
  var retcode = parseInt(answer.retcode);
  if (retcode != 0) {
    callback && callback(answer.retcode);
    return null;
  }
  return answer;
};

MT5Request.prototype.Get = function (path, callback) {
  var options = {
    hostname: this.server,
    port: this.port,
    path: path,
    agent: this.https,
    headers: { Connection: "keep-alive" },
    rejectUnauthorized: false,
  };
  var req = https.get(options, function (res) {
    res.setEncoding("utf8");
    var body = "";
    res.on("data", function (chunk) {
      body += chunk;
    });
    res.on("end", function () {
      callback(null, res, body);
    });
  });
  req.on("error", function (e) {
    console.log("errrrrrrrror:", e);
    return callback(e);
  });
};

MT5Request.prototype.processAuth = function (answer, password) {
  //---
  var pass_md5 = crypto.createHash("md5");
  var buf = buffer.transcode(Buffer.from(password, "utf8"), "ut8", "utf161e");
  pass_md5.update(buf, "binary");
  var pass_md5_digest = pass_md5.digest("binary");
  //---
  var md5 = crypto.createHash("md5");
  md5.update(pass_md5_digest, "binary");
  md5.update("WebAPI", "ascii");
  var md5_digest = md5.digest("binary");
  //---
  var answer_md5 = crypto.createHash("md5");
  answer_md5.update(md5_digest, "binary");
  var buf = Buffer.from(answer.srv_rand, "hex");
  answer_md5.update(buf, "binary");
  //---
  return answer_md5.digest("hex");
};

MT5Request.prototype.ProcessAuthFinal = function (
  answer,
  password,
  cli_random
) {
  //---
  var pass_md5 = crypto.createHash("md5");
  var buf = buffer.transcode(Buffer.from(password, "utf8"), "ut8", "utf161e");
  pass_md5.update(buf, "binary");
  var pass_md5_digest = pass_md5.digest("binary");
  //---
  var md5 = crypto.createHash("md5");
  md5.update(pass_md5_digest, "binary");
  md5.update("WebAPI", "ascii");
  var md5_digest = md5.digest("binary");
  //---
  var answer_md5 = crypto.createHash("md5");
  answer_md5.update(md5_digest, "binary");
  answer_md5.update(cli_random, "binary");
  return answer.cli_rand_answer == answer_md5.digest("hex");
};

MT5Request.prototype.Auth = function (login, password, build, agent, callback) {
  if (!login || !password || !build || !agent) return;
  var self = this;
  self.Get(
    "/api/auth/start?version=" +
      build +
      "&agent=" +
      agent +
      "&login=" +
      login +
      "&type=manager",
    function (error, res, body) {
      var answer = self.parseBodyJSON(error, res, body, callback);
      if (answer) {
        var srv_rand_answer = self.processAuth(answer, password);
        var cli_random_buf = crypto.randomBytes(16);
        var cli_random_buf_hex = cli_random_buf.toString("hex");
        self.Get(
          "/api/auth/answer?srv_rand_answer=" +
            srv_rand_answer +
            "&cli_rand=" +
            cli_random_buf_hex,
          function (error, res, body) {
            var answer = self.parseBodyJSON(error, res, body, callback);
            if (answer) {
              if (self.ProcessAuthFinal(answer, password, cli_random_buf))
                callback && callback(null);
              else callback && callback("invalid final auth answer");
            }
          }
        );
      }
    }
  );
  return true;
};

exports.mt5Login = async () => {
  var req = new MT5Request("52.187.46.216", 443);
  // Authenticate on the server using Auth command
  req.Auth(1005, "varybpr2", "484", "WebManager", function (error) {
    if (error) {
      // console.log(error);
      return;
    }
  });
};
