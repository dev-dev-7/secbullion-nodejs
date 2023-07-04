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
    return callback(e);
  });
};

MT5Request.prototype.Post = function (path, postData, callback) {
  var options = {
    hostname: this.server,
    port: this.port,
    path: path,
    method: "POST",
    agent: this.https,
    rejectUnauthorized: false,
    headers: {
      Connection: "keep-alive",
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": postData.length,
    },
  };
  var req = https.request(options, function (res) {
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
    return callback(e);
  });
  req.write(postData);
  req.end();
};

MT5Request.prototype.processAuth = function (answer, password) {
  //---
  var pass_md5 = crypto.createHash("md5");
  var buf = buffer.transcode(Buffer.from(password, "utf8"), "utf8", "utf16le");
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
  var buf = buffer.transcode(Buffer.from(password, "utf8"), "utf8", "utf16le");
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
  var self = this;
  if (!login || !password || !build || !agent) return;
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
          async function (error, res, body) {
            var answer = self.parseBodyJSON(error, res, body, callback);
            if (answer) {
              if (self.ProcessAuthFinal(answer, password, cli_random_buf)) {
                callback && callback(null);
              } else {
                callback && callback("invalid final auth answer");
              }
            }
          }
        );
      }
    }
  );
};

exports.getPriceFromSymbol = async (symbols = "", key = "", price = "") => {
  if (symbols.length && key) {
    let result = symbols.filter(function (symbol) {
      return symbol.Symbol == key;
    });
    return result[0];
  } else {
    return price;
  }
};

// GET SYMBOL DETAILS

exports.getSymbolPrice = async (products) => {
  let symbols = [];
  if (products.length) {
    for (var i = 0; i < products.length; i++) {
      if (products[i].symbol) {
        symbols.push(products[i].symbol);
      }
    }
  }
  if (symbols?.length) {
    var req = new MT5Request("20.157.112.215", 443);
    return new Promise((resolve, reject) => {
      req.Auth(1005, "varybpr2", "484", "WebManager", function (error) {
        if (error) {
          // console.log(error);
          return;
        }
        req.Get(
          "/api/tick/last?symbol=" + symbols,
          function (error, res, body) {
            if (error) {
              console.log(error);
              return;
            }
            var answer = req.parseBodyJSON(error, res, body, null);
            if (answer.answer) {
              // console.log("answer.answer", answer.answer);
              resolve(answer.answer);
            } else {
              reject(null);
            }
          }
        );
      });
    });
  } else {
    return [];
  }
};

exports.getSingleSymbolPrice = async (symbol) => {
  let symbols = [symbol];
  if (symbols?.length) {
    var req = new MT5Request("20.157.112.215", 443);
    return new Promise((resolve, reject) => {
      req.Auth(1005, "varybpr2", "484", "WebManager", function (error) {
        if (error) {
          console.log(error);
          return;
        }
        req.Get(
          "/api/tick/last?symbol=" + symbols,
          function (error, res, body) {
            if (error) {
              console.log(error);
              return;
            }
            var answer = req.parseBodyJSON(error, res, body, null);
            if (answer.answer) {
              // console.log("answer.answer", answer.answer);
              resolve(answer.answer);
            } else {
              reject(null);
            }
          }
        );
      });
    });
  } else {
    return [];
  }
};

// exports.getAllSymbols = async (symbol) => {
//   var req = new MT5Request("20.157.112.215", 443);
//   return new Promise((resolve, reject) => {
//     req.Auth(1005, "varybpr2", "484", "WebManager", symbol, function (error) {
//       if (error) {
//         console.log(error);
//         return;
//       }
//       req.Get("/api/symbol/list", function (error, res, body) {
//         if (error) {
//           console.log(error);
//           return;
//         }
//         var answer = req.parseBodyJSON(error, res, body, null);
//         if (answer.answer) {
//           resolve(answer.answer);
//         } else {
//          reject(null);
//         }
//       });
//     });
//    });
// };

exports.createMt5Account = async (body) => {
  var req = new MT5Request("20.157.112.215", 443);
  return new Promise((resolve, reject) => {
    req.Auth(1005, "varybpr2", "484", "WebManager", function (error) {
      if (error) {
        console.log(error);
        return;
      }
      let group = "demo" + "\\" + "Sec" + "\\" + "Sec" + "\\" + "USD";
      let firtName = body.full_name.split(" ")[0];
      let lastName = body.full_name.split(" ")[1]
        ? body.full_name.split(" ")[1]
        : "";
      let fullName = firtName + (lastName ? "%20" + lastName : "");
      req.Get(
        "/api/user/add?pass_main=" +
          body.password +
          "&pass_investor=" +
          body.password +
          "&group=" +
          group +
          "&name=" +
          fullName +
          "&country=" +
          body.nationality +
          "&company=Secbullion&phone=" +
          body.mobile +
          "&email=" +
          body.email +
          "&id=" +
          body.user_id +
          "&leverage=500",
        function (error, res, body) {
          if (error) {
            console.log(error);
            return;
          }
          var answer = req.parseBodyJSON(error, res, body, null);
          if (answer.answer) {
            resolve(answer.answer);
          } else {
            reject(null);
          }
        }
      );
    });
  });
};

exports.buyPosition = async (account, symbol, quantity) => {
  var req = new MT5Request("20.157.112.215", 443);
  return new Promise((resolve, reject) => {
    req.Auth(1005, "varybpr2", "484", "WebManager", function (error) {
      if (error) {
        console.log(error);
        return;
      }
      let rawBody = JSON.stringify({
        Action: 200,
        Login: account,
        Symbol: symbol,
        Volume: quantity + "0000",
        Type: 0,
      });
      req.Post(
        "/api/dealer/send_request",
        rawBody,
        function (error, res, body) {
          if (error) {
            console.log(error);
            return;
          }
          var answer = req.parseBodyJSON(error, res, body, null);
          if (answer.answer) {
            let request_id = answer.answer.id;
            req.Get(
              "/api/dealer/get_request_result?id=" + request_id,
              function (error, res, body) {
                if (error) {
                  console.log(error);
                  return;
                }
                var answer = req.parseBodyJSON(error, res, body, null);
                if (answer.answer) {
                  let result = answer.answer;
                  resolve(result[request_id][1].answer);
                } else {
                  reject(null);
                }
              }
            );
          } else {
            reject(null);
          }
        }
      );
    });
  });
};

exports.sellPosition = async (account, symbol, quantity, position) => {
  if (position) {
    var req = new MT5Request("20.157.112.215", 443);
    return new Promise((resolve, reject) => {
      req.Auth(1005, "varybpr2", "484", "WebManager", function (error) {
        if (error) {
          console.log(error);
          return;
        }
        let rawBody = JSON.stringify({
          SourceLogin: 1005,
          Action: 200,
          Login: account,
          Symbol: symbol,
          Volume: quantity + "0000",
          Type: 1,
          Position: position,
        });
        req.Post(
          "/api/dealer/send_request",
          rawBody,
          function (error, res, body) {
            if (error) {
              console.log(error);
              return;
            }
            var answer = req.parseBodyJSON(error, res, body, null);
            if (answer.answer) {
              //resolve(answer.answer);
              let request_id = answer.answer.id;
              req.Get(
                "/api/dealer/get_request_result?id=" + request_id,
                function (error, res, body) {
                  if (error) {
                    console.log(error);
                    return;
                  }
                  var answer = req.parseBodyJSON(error, res, body, null);
                  if (answer.answer) {
                    let result = answer.answer;
                    resolve(result[request_id][1].answer);
                  } else {
                    reject(null);
                  }
                }
              );
            } else {
              reject(null);
            }
          }
        );
      });
    });
  } else {
    return [];
  }
};

exports.updatePosition = async (account, symbol, quantity, position) => {
  if (account) {
    var req = new MT5Request("20.157.112.215", 443);
    return new Promise((resolve, reject) => {
      req.Auth(1005, "varybpr2", "484", "WebManager", function (error) {
        if (error) {
          console.log(error);
          return;
        }
        let rawBody = JSON.stringify({
          SourceLogin: 1005,
          Action: 200,
          Login: account,
          Symbol: symbol,
          Volume: quantity + "0000",
          Type: 1,
          Position: position,
        });
        req.Post(
          "/api/dealer/send_request",
          rawBody,
          function (error, res, body) {
            if (error) {
              console.log(error);
              return;
            }
            var answer = req.parseBodyJSON(error, res, body, null);
            if (answer.answer) {
              //resolve(answer.answer);
              let request_id = answer.answer.id;
              req.Get(
                "/api/dealer/get_request_result?id=" + request_id,
                function (error, res, body) {
                  if (error) {
                    console.log(error);
                    return;
                  }
                  var answer = req.parseBodyJSON(error, res, body, null);
                  if (answer.answer) {
                    let result = answer.answer;
                    resolve(result[request_id][1].answer);
                  } else {
                    reject(null);
                  }
                }
              );
            } else {
              reject(null);
            }
          }
        );
      });
    });
  } else {
    return [];
  }
};

exports.closePosition = async (account, symbol, quantity, position) => {
  if (account) {
    var req = new MT5Request("20.157.112.215", 443);
    return new Promise((resolve, reject) => {
      req.Auth(1005, "varybpr2", "484", "WebManager", function (error) {
        if (error) {
          console.log(error);
          return;
        }
        let rawBody = JSON.stringify({
          SourceLogin: 1005,
          Action: 200,
          Login: account,
          Symbol: symbol,
          Volume: quantity + "0000",
          Type: 1,
          Position: position,
        });
        req.Post(
          "/api/dealer/send_request",
          rawBody,
          function (error, res, body) {
            if (error) {
              console.log(error);
              return;
            }
            var answer = req.parseBodyJSON(error, res, body, null);
            if (answer.answer) {
              //resolve(answer.answer);
              let request_id = answer.answer.id;
              req.Get(
                "/api/dealer/get_request_result?id=" + request_id,
                function (error, res, body) {
                  if (error) {
                    console.log(error);
                    return;
                  }
                  var answer = req.parseBodyJSON(error, res, body, null);
                  if (answer.answer) {
                    let result = answer.answer;
                    resolve(result[request_id][1].answer);
                  } else {
                    reject(null);
                  }
                }
              );
            } else {
              reject(null);
            }
          }
        );
      });
    });
  } else {
    return [];
  }
};

exports.getRequestDetails = async (account, position) => {
  if (position) {
    var req = new MT5Request("20.157.112.215", 443);
    return new Promise((resolve, reject) => {
      req.Auth(1005, "varybpr2", "484", "WebManager", function (error) {
        if (error) {
          console.log("auth", error);
          return;
        }
        req.Get(
          "/api/position/get_page?login=" + account,
          function (error, res, body) {
            if (error) {
              console.log(error);
              return;
            }
            var answer = req.parseBodyJSON(error, res, body, null);
            if (answer.answer) {
              let data = answer.answer;
              console.log(position);
              var filteredArray = data.filter(
                (item) => item.Position === position.toString()
              );
              resolve(filteredArray);
            } else {
              reject(null);
            }
          }
        );
      });
    });
  } else {
    return [];
  }
};

exports.getSymbolDetails = async (symbol) => {
  if (symbol) {
    var req = new MT5Request("20.157.112.215", 443);
    // var req = new MT5Request("secmt5.afkkarr.com", 443);
    return new Promise((resolve, reject) => {
      req.Auth(1017, "b6yjwcfy", "484", "WebManager", function (error) {
        if (error) {
          return;
        }
        req.Get(
          "/api/symbol/get?symbol=" + symbol,
          function (error, res, body) {
            if (error) {
              console.log(error);
              return;
            }
            var answer = req.parseBodyJSON(error, res, body, null);
            if (answer.answer) {
              let data = answer.answer;
              resolve(data);
            } else {
              reject(null);
            }
          }
        );
      });
    });
  } else {
    return [];
  }
};

exports.getMT5Balance = async (account) => {
  if (account) {
    var req = new MT5Request("20.157.112.215", 443);
    return new Promise((resolve, reject) => {
      req.Auth(1005, "varybpr2", "484", "WebManager", function (error) {
        if (error) {
          console.log(error);
          return;
        }
        req.Get("/api/user/get?login=" + account, function (error, res, body) {
          if (error) {
            console.log(error);
            return;
          }
          var answer = req.parseBodyJSON(error, res, body, null);
          if (answer.answer) {
            resolve(answer.answer);
          } else {
            reject(null);
          }
        });
      });
    });
  } else {
    return [];
  }
};

exports.updateMT5Balance = async (account, balance, comment) => {
  var req = new MT5Request("20.157.112.215", 443);
  return new Promise((resolve, reject) => {
    req.Auth(1005, "varybpr2", "484", "WebManager", function (error) {
      if (error) {
        console.log(error);
        return;
      }
      req.Get(
        "/api/trade/balance?login=" +
          account +
          "&type=4" +
          "&balance=" +
          balance +
          "&comment=" +
          comment,
        function (error, res, body) {
          if (error) {
            console.log(error);
            return;
          }
          var answer = req.parseBodyJSON(error, res, body, null);
          if (answer.answer) {
            resolve(answer.answer);
          } else {
            reject(null);
          }
        }
      );
    });
  });
};
