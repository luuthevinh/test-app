require = function() {
  function e(t, n, r) {
    function s(o, u) {
      if (!n[o]) {
        if (!t[o]) {
          var a = "function" == typeof require && require;
          if (!u && a) return a(o, !0);
          if (i) return i(o, !0);
          var f = new Error("Cannot find module '" + o + "'");
          throw f.code = "MODULE_NOT_FOUND", f;
        }
        var l = n[o] = {
          exports: {}
        };
        t[o][0].call(l.exports, function(e) {
          var n = t[o][1][e];
          return s(n || e);
        }, l, l.exports, e, t, n, r);
      }
      return n[o].exports;
    }
    var i = "function" == typeof require && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
  }
  return e;
}()({
  AutoRotate: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "46148GExFpL/ZtTywvEfp9s", "AutoRotate");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {
        this.node.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(.1, 10), cc.rotateBy(.1, -10), cc.delayTime(.1))));
      }
    });
    cc._RF.pop();
  }, {} ],
  CountDown: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "c5351+A06JIX7HxJV9dZXmS", "CountDown");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        cdTime: cc.Label
      },
      init: function init(gameController) {
        this.gameController = gameController;
      },
      onLoad: function onLoad() {
        this.isGameRunning = false;
        this.maxTime = 8;
        this.currTime = 0;
      },
      update: function update(dt) {
        if (true == this.isGameRunning) {
          this.currTime += dt;
          if (this.currTime >= this.maxTime) {
            this.currTime = this.maxTime;
            this.gameOver();
          }
        }
        this.cdTime.string = "" + Number.parseInt(this.maxTime - this.currTime);
      },
      gameWin: function gameWin() {
        this.isGameRunning = false;
      },
      gameOver: function gameOver() {
        this.isGameRunning = false;
        this.gameController.gameOver();
      },
      resetCd: function resetCd() {},
      startCd: function startCd() {
        this.isGameRunning = true;
        this.currTime = 0;
        this.maxTime = 8;
      }
    });
    cc._RF.pop();
  }, {} ],
  FBHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "68532eZDshLo411Pl2bqUkQ", "FBHelper");
    "use strict";
    module.exports = {
      checkLogin: function checkLogin() {
        var self = this;
        return new Promise(function(resolve, reject) {
          FB.getLoginStatus(function(response) {
            if (response && "connected" === response.status) {
              self.accessToken = response.authResponse.accessToken;
              self.userID = response.authResponse.userID;
              self.isLogIn = true;
              resolve(response);
            } else reject(response);
          });
        });
      },
      login: function login() {
        var self = this;
        return new Promise(function(resolve, reject) {
          FB.login(function(response) {
            if (response && "connected" === response.status) {
              self.accessToken = response.authResponse.accessToken;
              self.userID = response.authResponse.userID;
              self.isLogIn = true;
              resolve(response);
            } else reject(response);
          }, {
            scope: "public_profile,user_posts"
          });
        });
      },
      logout: function logout() {
        var self = this;
        return new Promise(function(resolve) {
          FB.logout(function(response) {
            self.accessToken = "";
            self.userID = "";
            self.isLogIn = false;
            resolve(response);
          });
        });
      },
      getBasicInfo: function getBasicInfo() {
        return new Promise(function(resolve) {
          FB.api("/me", function(response) {
            resolve(response);
          });
        });
      },
      share: function share(url) {
        return new Promise(function(resolve, reject) {
          FB.ui({
            method: "share",
            mobile_iframe: false,
            href: url
          }, function(response) {
            if (response && !response.error_message) {
              FB.api("/posts");
              resolve(response);
            } else reject(response);
          });
        });
      },
      feed: function feed(numPost) {
        var self = this;
        return new Promise(function(resolve, reject) {
          FB.api("/me/feed", "get", {
            limit: numPost,
            access_token: self.accessToken
          }, function(response) {
            !response || response.error ? reject(response) : resolve(response);
          });
        });
      },
      post: function post(id, args) {
        var self = this;
        return new Promise(function(resolve, reject) {
          FB.api(id, "get", {
            fields: args,
            access_token: self.accessToken
          }, function(response) {
            !response || response.error ? reject(response) : resolve(response);
          });
        });
      },
      shareWithData: function shareWithData(data) {
        return new Promise(function(resolve, reject) {
          FB.ui({
            method: "share_open_graph",
            action_type: "og.shares",
            action_properties: JSON.stringify({
              object: {
                "og:url": data.url,
                "og:title": data.title,
                "og:description": data.description
              }
            })
          }, function(response) {
            response && !response.error_message ? resolve(response) : reject(response);
          });
        });
      }
    };
    cc._RF.pop();
  }, {} ],
  GameController: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8e3adit6jxOMIcSOGZK3yZt", "GameController");
    "use strict";
    var FBHelper = require("FBHelper");
    var HTTPHelper = require("HTTPHelper");
    var Utils = require("Utils");
    var MenuLayer = require("MenuLayer");
    var GameLayer = require("GameLayer");
    var ResultLayer = require("ResultLayer");
    var TARGET_URL = "https://delivery-dev.gibi.vn/game/hazeline_submit.php";
    cc.Class({
      extends: cc.Component,
      properties: {
        menuLayer: MenuLayer,
        gameLayer: GameLayer,
        resultLayer: ResultLayer,
        loading: cc.Node
      },
      start: function start() {
        this.init();
        this.resetGame();
        FBHelper.checkLogin();
        this._checkQuery();
      },
      init: function init() {
        this.menuLayer.init(this);
        this.gameLayer.init(this);
        this.resultLayer.init(this);
        this.menuLayer.node.active = true;
        this.gameLayer.node.active = false;
        this.resultLayer.node.active = false;
        this.loading.active = false;
      },
      resetGame: function resetGame() {
        this.isGameOver = false;
      },
      onStartGame: function onStartGame() {
        var _this = this;
        var self = this;
        this.loading.active = true;
        if (FBHelper.isLogIn) {
          this.loading.active = false;
          this._startGame();
        } else FBHelper.login().then(function() {
          _this.loading.active = false;
          self._startGame();
        });
      },
      _startGame: function _startGame() {
        this.menuLayer.node.active = false;
        this.gameLayer.node.active = true;
        this.resultLayer.node.active = false;
        this.gameLayer.resetData();
      },
      showWinGame: function showWinGame() {
        this.resultLayer.node.active = true;
        this.resultLayer.node.opacity = 0;
        this.resultLayer.node.runAction(cc.fadeIn(.2));
        this._submitResult();
      },
      onClaimReward: function onClaimReward() {},
      onShareFB: function onShareFB() {
        this._share();
      },
      _share: function _share() {
        var _this2 = this;
        var self = this;
        FBHelper.share("https://developers.facebook.com/docs/").then(function(data) {
          console.log("share success! " + JSON.stringify(data));
          FBHelper.feed(1).then(function(post) {
            console.log("post: " + JSON.stringify(post));
            self._checkPost(post.data[0]);
          }).catch(function(err) {
            console.log("post err: " + JSON.stringify(err));
          });
          _this2._checkAndAddParam();
        });
      },
      _checkAndAddParam: function _checkAndAddParam() {
        var winGame = Utils.getUrlParameter("winGame");
        if (cc.sys.MOBILE_BROWSER && !winGame) {
          var url = window.location.href;
          url.indexOf("?") > -1 ? url += "&winGame=1" : url += "?winGame=1";
          window.location.href = url;
        }
      },
      _checkAndAddStartGameParam: function _checkAndAddStartGameParam() {
        var winGame = Utils.getUrlParameter("startGame");
        if (cc.sys.MOBILE_BROWSER && !winGame) {
          var url = window.location.href;
          url.indexOf("?") > -1 ? url += "&startGame=1" : url += "?startGame=1";
          window.location.href = url;
        }
      },
      _checkPost: function _checkPost(post) {
        FBHelper.post(post.id, "link").then(function(data) {
          console.log("post id: " + data.id + " link: " + data.link);
        }).catch(function(err) {
          console.log("post err: " + JSON.stringify(err));
        });
      },
      _checkQuery: function _checkQuery() {
        this.token = Utils.getUrlParameter("token");
        console.log("token: " + this.token);
        var winGame = Utils.getUrlParameter("winGame");
        if (winGame) {
          this.menuLayer.node.active = false;
          this.gameLayer.node.active = false;
          this.resultLayer.node.active = true;
        } else {
          var start = Utils.getUrlParameter("startGame");
          start && this._startGame();
        }
      },
      _submitResult: function _submitResult() {
        if (!this.token || "" === this.token) return;
        var data = new FormData();
        data.append("token", this.token);
        HTTPHelper.post(TARGET_URL, data).then(function(res) {
          var result = JSON.parse(res);
          console.log("result: " + result.message);
        });
      }
    });
    cc._RF.pop();
  }, {
    FBHelper: "FBHelper",
    GameLayer: "GameLayer",
    HTTPHelper: "HTTPHelper",
    MenuLayer: "MenuLayer",
    ResultLayer: "ResultLayer",
    Utils: "Utils"
  } ],
  GameLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "29195N7si1LpY+5Eygl8jxI", "GameLayer");
    "use strict";
    var InstructionLayer = require("InstructionLayer");
    var CountDown = require("CountDown");
    var ScoreBoard = require("ScoreBoard");
    var RedDotMove = require("RedDotMove");
    cc.Class({
      extends: cc.Component,
      properties: {
        talentBefore: cc.Sprite,
        talentAfter: cc.Sprite,
        instructionLayer: InstructionLayer,
        uiNode: cc.Node,
        countDown: CountDown,
        scoreBoard: ScoreBoard,
        listRedDot: {
          default: [],
          type: RedDotMove
        },
        UIReplay: cc.Node
      },
      init: function init(game) {
        this.game = game;
        this.score = 0;
        this.instructionLayer.init(this);
        this.countDown.init(this);
        this.scoreBoard.init(this);
        for (var i = 0; i < this.listRedDot.length; i++) this.listRedDot[i].init(this);
      },
      addScore: function addScore(score) {
        var _this = this;
        this.score += score;
        this.scoreBoard.setScore(this.score);
        if (this.score == this.listRedDot.length) {
          this.countDown.gameWin();
          this.node.runAction(cc.sequence(cc.callFunc(function(target) {
            _this.talentBefore.node.runAction(cc.fadeOut(.15));
            _this.talentAfter.node.runAction(cc.fadeIn(.15));
          }), cc.delayTime(.69), cc.fadeOut(.35), cc.callFunc(function(target) {
            _this.game.showWinGame();
          })));
          console.log("Win Game CMNR");
        }
      },
      resetData: function resetData() {
        this.instructionLayer.startTutorialAnim();
      },
      onStartGamePlay: function onStartGamePlay() {
        var _this2 = this;
        for (var i = 0; i < this.listRedDot.length; i++) this.listRedDot[i].node.active = false;
        this.score = 0;
        this.instructionLayer.node.active = false;
        this.uiNode.active = true;
        this.UIReplay.active = false;
        this.countDown.startCd();
        this.scoreBoard.setScore(this.score);
        this.node.runAction(cc.sequence(cc.callFunc(function(target) {
          return _this2.enableRedDot(1);
        }), cc.delayTime(2.5), cc.callFunc(function(target) {
          return _this2.enableRedDot(2);
        }), cc.delayTime(2.5), cc.callFunc(function(target) {
          return _this2.enableRedDot(3);
        })));
      },
      enableRedDot: function enableRedDot(phase) {
        if (1 == phase) for (var i = 0; i < 2; i++) {
          this.listRedDot[i].node.active = true;
          this.listRedDot[i].startAnim();
          this.listRedDot[i].setEnableTouch(true);
        } else if (2 == phase) for (var i = 2; i < 5; i++) {
          this.listRedDot[i].node.active = true;
          this.listRedDot[i].startAnim();
          this.listRedDot[i].setEnableTouch(true);
        } else for (var i = 5; i < 8; i++) {
          this.listRedDot[i].node.active = true;
          this.listRedDot[i].startAnim();
          this.listRedDot[i].setEnableTouch(true);
        }
      },
      gameOver: function gameOver() {
        this.UIReplay.active = true;
        for (var i = 0; i < this.listRedDot.length; i++) this.listRedDot[i].setEnableTouch(false);
      }
    });
    cc._RF.pop();
  }, {
    CountDown: "CountDown",
    InstructionLayer: "InstructionLayer",
    RedDotMove: "RedDotMove",
    ScoreBoard: "ScoreBoard"
  } ],
  HTTPHelper: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "80322iViDdAaJcOswrm6NrF", "HTTPHelper");
    "use strict";
    module.exports = {
      get: function get(url, body) {
        return new Promise(function(resolve, reject) {
          var xhr = cc.loader.getXMLHttpRequest();
          xhr.open("GET", url, true);
          xhr.setRequestHeader("Content-Type", "text/plain");
          xhr.send(body);
          xhr.onreadystatechange = function() {
            if (4 == xhr.readyState && xhr.status >= 200 && xhr.status < 400) {
              var response = xhr.responseText;
              resolve(response);
            }
          };
        });
      },
      post: function post(url, arguements) {
        var _this = this;
        return new Promise(function(resolve, reject) {
          var xhr = _this.createCORSRequest("POST", url);
          xhr.send(arguements);
          xhr.onreadystatechange = function() {
            if (4 == xhr.readyState && xhr.status >= 200 && xhr.status < 400) {
              var response = xhr.responseText;
              resolve(response);
            }
          };
        });
      },
      createCORSRequest: function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) xhr.open(method, url, true); else if ("undefined" != typeof XDomainRequest) {
          xhr = new XDomainRequest();
          xhr.open(method, url);
        } else xhr = null;
        return xhr;
      }
    };
    cc._RF.pop();
  }, {} ],
  HandPoint: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "89da10ahMxAr4drbLC+KhZw", "HandPoint");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  InstructionLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "0f1b6sslglAiqFQcZgwjrfx", "InstructionLayer");
    "use strict";
    var RedDotMode = require("RedDotMove");
    var HandPoint = require("HandPoint");
    cc.Class({
      extends: cc.Component,
      properties: {
        cdText: cc.Label,
        touchSprite: cc.Sprite,
        listRedDot: {
          default: [],
          type: RedDotMode
        },
        listRedDotStartPos: {
          default: [],
          type: cc.Node
        },
        handPoint: HandPoint,
        bg: cc.Node
      },
      init: function init(gameLayer) {
        this.gameLayer = gameLayer;
        this.isCountDown = false;
        this.currTime = 0;
        this.maxTime = 3;
        this.cdText.string = "" + Number.parseInt(this.maxTime - this.currTime);
      },
      startTutorialAnim: function startTutorialAnim() {
        var _this = this;
        for (var i = 0; i < 3; i++) this.listRedDot[i].node.runAction(cc.sequence(cc.moveTo(.75, this.listRedDotStartPos[i].position), cc.callFunc(function(target) {
          target.getComponent("RedDotMove").startAnim();
        })));
        this.handPoint.node.runAction(cc.sequence(cc.delayTime(2), cc.moveTo(.15, this.listRedDotStartPos[0]), cc.callFunc(function(target) {
          return _this.destroyRedDot(0);
        }), cc.delayTime(.3), cc.moveTo(.15, this.listRedDotStartPos[1]), cc.callFunc(function(target) {
          return _this.destroyRedDot(1);
        }), cc.delayTime(.3), cc.moveTo(.15, this.listRedDotStartPos[2]), cc.callFunc(function(target) {
          return _this.destroyRedDot(2);
        }), cc.fadeOut(.2), cc.callFunc(function(target) {
          return _this.startCountDown();
        })));
      },
      destroyRedDot: function destroyRedDot(index) {
        this.listRedDot[index].destroyObj();
      },
      startCountDown: function startCountDown() {
        this.bg.runAction(cc.fadeTo(.15, 150));
        this.touchSprite.node.active = false;
        this.cdText.node.active = true;
        this.isCountDown = true;
      },
      countDownComplete: function countDownComplete() {
        var _this2 = this;
        this.bg.runAction(cc.sequence(cc.fadeOut(.25), cc.callFunc(function(target) {
          _this2.gameLayer.onStartGamePlay();
        })));
      },
      update: function update(dt) {
        if (true == this.isCountDown) {
          this.currTime += dt;
          if (this.currTime >= this.maxTime) {
            this.currTime = this.maxTime;
            this.isCountDown = false;
            this.countDownComplete();
          }
          this.cdText.string = "" + Number.parseInt(this.maxTime - this.currTime + 1);
        }
      }
    });
    cc._RF.pop();
  }, {
    HandPoint: "HandPoint",
    RedDotMove: "RedDotMove"
  } ],
  MenuLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "6f272zCarZLE4sHINI5spj1", "MenuLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      init: function init(game) {
        this.game = game;
        this.resetData();
      },
      resetData: function resetData() {}
    });
    cc._RF.pop();
  }, {} ],
  NewScript: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "ac95a/VPbdPRrZUbZixiHMU", "NewScript");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {}
    });
    cc._RF.pop();
  }, {} ],
  RedDotMove: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "122808GoVVMoZ20bh1X1KSl", "RedDotMove");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        magicTile: cc.Prefab,
        moveRange: 30
      },
      init: function init(gameLayer) {
        this.gameLayer = gameLayer;
        this.node.on(cc.Node.EventType.TOUCH_START, function(event) {
          if (true == this.enableTouch) {
            this.enableTouch = false;
            this.destroyObj();
            this.addScore(1);
          }
        }, this);
      },
      onLoad: function onLoad() {
        this.isActiveAnim = false;
        this.enableTouch = false;
      },
      startAnim: function startAnim() {
        this.isActiveAnim = true;
        this.rootPosX = this.node.x;
        this.rootPosY = this.node.y;
        this.node.opacity = 255;
        this.node.scaleX = 1;
        this.node.scaleY = 1;
        this.randMove();
      },
      setEnableTouch: function setEnableTouch(enable) {
        this.enableTouch = enable;
      },
      randMove: function randMove() {
        this.timeChange = cc.random0To1();
        this.currTime = 0;
        var rdX = cc.randomMinus1To1() * this.moveRange;
        var rdY = cc.randomMinus1To1() * this.moveRange;
        this.newPosX = rdX + this.rootPosX;
        this.newPosY = rdY + this.rootPosY;
        this.velX = this.newPosX - this.node.x;
        this.velY = this.newPosY - this.node.y;
      },
      update: function update(dt) {
        if (false == this.isActiveAnim) return;
        this.currTime += dt;
        (this.isCanChangeMove() || this.currTime >= this.timeChange) && this.randMove();
        this.node.x += this.velX * dt;
        this.node.y += this.velY * dt;
      },
      isCanChangeMove: function isCanChangeMove() {
        return Math.abs(this.newPosX - this.node.x) < 2 && Math.abs(this.newPosY - this.node.y) < 2;
      },
      destroyObj: function destroyObj() {
        this.isActiveAnim = false;
        this.node.stopAllActions();
        this.node.runAction(cc.fadeOut(.5));
        this.node.runAction(cc.scaleTo(.5, 2.5));
        if (null != this.magicTile) {
          var tile = cc.instantiate(this.magicTile);
          tile.parent = this.node.parent;
          tile.x = this.node.x;
          tile.y = this.node.y;
          tile.active = true;
          tile.scaleX = .5;
          tile.scaleY = .5;
          tile.opacity = 0;
          tile.runAction(cc.scaleTo(.5, 1.5));
          tile.runAction(cc.sequence(cc.delayTime(.1), cc.fadeIn(.25), cc.fadeOut(.2), cc.callFunc(function(target) {
            target.destroy();
          })));
        }
      },
      addScore: function addScore(score) {
        this.gameLayer.addScore(score);
      }
    });
    cc._RF.pop();
  }, {} ],
  ResultLayer: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "58320wmTTJAEIiovFsR4v4K", "ResultLayer");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      init: function init(game) {
        this.game = game;
      },
      update: function update(dt) {}
    });
    cc._RF.pop();
  }, {} ],
  Rotator: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "00722jmZpdB9b7W4XJx+8X9", "Rotator");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {},
      start: function start() {
        this.node.runAction(cc.repeatForever(cc.rotateBy(1, 360)));
      }
    });
    cc._RF.pop();
  }, {} ],
  ScoreBoard: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "306f47OjY9EwLZb6f+NtCDj", "ScoreBoard");
    "use strict";
    cc.Class({
      extends: cc.Component,
      properties: {
        scoreText: cc.Label
      },
      init: function init(gameController) {
        this.gameController = gameController;
      },
      start: function start() {
        this.resetScore();
      },
      addScore: function addScore(scoreAdd) {
        this.score += scoreAdd;
        this.scoreText.string = "" + this.score;
      },
      setScore: function setScore(score) {
        this.score = score;
        this.scoreText.string = "" + this.score;
      },
      resetScore: function resetScore() {
        this.score = 0;
        this.scoreText.string = "" + this.score;
      }
    });
    cc._RF.pop();
  }, {} ],
  Utils: [ function(require, module, exports) {
    "use strict";
    cc._RF.push(module, "8d3ccdvqgxG2J8NpPzoVD03", "Utils");
    "use strict";
    module.exports = {
      getUrlParameter: function getUrlParameter(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return null === results ? "" : decodeURIComponent(results[1]);
      }
    };
    cc._RF.pop();
  }, {} ]
}, {}, [ "AutoRotate", "CountDown", "FBHelper", "GameController", "GameLayer", "HTTPHelper", "HandPoint", "InstructionLayer", "MenuLayer", "NewScript", "RedDotMove", "ResultLayer", "Rotator", "ScoreBoard", "Utils" ]);