require=function s(c,r,a){function u(n,t){if(!r[n]){if(!c[n]){var e="function"==typeof require&&require;if(!t&&e)return e(n,!0);if(h)return h(n,!0);var i=new Error("Cannot find module '"+n+"'");throw i.code="MODULE_NOT_FOUND",i}var o=r[n]={exports:{}};c[n][0].call(o.exports,function(t){var e=c[n][1][t];return u(e||t)},o,o.exports,s,c,r,a)}return r[n].exports}for(var h="function"==typeof require&&require,t=0;t<a.length;t++)u(a[t]);return u}({AutoRotate:[function(t,e,n){"use strict";cc._RF.push(e,"46148GExFpL/ZtTywvEfp9s","AutoRotate"),cc.Class({extends:cc.Component,properties:{},start:function(){this.node.runAction(cc.repeatForever(cc.sequence(cc.rotateBy(.1,10),cc.rotateBy(.1,-10),cc.delayTime(.1))))}}),cc._RF.pop()},{}],CountDown:[function(t,e,n){"use strict";cc._RF.push(e,"c5351+A06JIX7HxJV9dZXmS","CountDown"),cc.Class({extends:cc.Component,properties:{cdTime:cc.Label},init:function(t){this.gameController=t},onLoad:function(){this.isGameRunning=!1,this.maxTime=8,this.currTime=0},update:function(t){1==this.isGameRunning&&(this.currTime+=t,this.currTime>=this.maxTime&&(this.currTime=this.maxTime,this.gameOver())),this.cdTime.string=""+Number.parseInt(this.maxTime-this.currTime)},gameWin:function(){this.isGameRunning=!1},gameOver:function(){this.isGameRunning=!1,this.gameController.gameOver()},resetCd:function(){},startCd:function(){this.isGameRunning=!0,this.currTime=0,this.maxTime=8}}),cc._RF.pop()},{}],FBHelper:[function(t,e,n){"use strict";cc._RF.push(e,"68532eZDshLo411Pl2bqUkQ","FBHelper");var i="313157392577807";e.exports={checkLogin:function(){var i=this;return new Promise(function(e,n){FB.getLoginStatus(function(t){t&&"connected"===t.status&&t.authResponse?(i.accessToken=t.authResponse.accessToken,i.userID=t.authResponse.userID,i.isLogIn=!0,e(t)):(i.isLogIn=!1,n(t))})})},login:function(){var i=this;return new Promise(function(e,n){FB.login(function(t){t&&"connected"===t.status&&t.authResponse?(i.accessToken=t.authResponse.accessToken,i.userID=t.authResponse.userID,i.isLogIn=!0,e(t)):(i.isLogIn=!1,n(t))},{scope:"public_profile,user_posts"})})},manualLogin:function(t){window.location.href;var e="https://www.facebook.com/v3.1/dialog/oauth?client_id="+i+"&redirect_uri=https://www.facebook.com/connect/login_success.html&state="+t;window.location.href=e},manualShare:function(t,e){t="https://www.facebook.com/dialog/share?app_id="+i+"&display=popup&href="+t+"&redirect_uri="+e;window.location.href=t},logout:function(){var n=this;return new Promise(function(e){FB.logout(function(t){n.accessToken="",n.userID="",n.isLogIn=!1,e(t)})})},getBasicInfo:function(){return new Promise(function(e){FB.api("/me",function(t){e(t)})})},share:function(t){return new Promise(function(e,n){FB.ui({method:"share",mobile_iframe:!1,href:t},function(t){t&&!t.error_message?(FB.api("/posts"),e(t)):n(t)})})},feed:function(t){var i=this;return new Promise(function(e,n){FB.api("/me/feed","get",{limit:t,access_token:i.accessToken},function(t){!t||t.error?n(t):e(t)})})},post:function(t,i){var o=this;return new Promise(function(e,n){FB.api(t,"get",{fields:i,access_token:o.accessToken},function(t){!t||t.error?n(t):e(t)})})},shareWithData:function(t){return new Promise(function(e,n){FB.ui({method:"share_open_graph",action_type:"og.shares",action_properties:JSON.stringify({object:{"og:url":t.url,"og:title":t.title,"og:description":t.description}})},function(t){t&&!t.error_message?e(t):n(t)})})}},cc._RF.pop()},{}],GameController:[function(t,e,n){"use strict";cc._RF.push(e,"8e3adit6jxOMIcSOGZK3yZt","GameController");var i=t("FBHelper"),o=t("HTTPHelper"),s=t("Utils"),c=t("MenuLayer"),r=t("GameLayer"),a=t("ResultLayer"),u="https://goo.gl/ym8prH",h="https://goo.gl/ym8prH";cc.Class({extends:cc.Component,properties:{menuLayer:c,gameLayer:r,resultLayer:a,loading:cc.Node},start:function(){this.init(),this.resetGame();i.checkLogin().then(function(){console.log("logged in")}).catch(function(t){console.log("err login: "+JSON.stringify(t))}),this._checkQuery()},init:function(){this.menuLayer.init(this),this.gameLayer.init(this),this.resultLayer.init(this),this.menuLayer.node.active=!0,this.gameLayer.node.active=!1,this.resultLayer.node.active=!1,this.loading.active=!1},resetGame:function(){this.isGameOver=!1},onStartGame:function(){this._startGame()},_startGame:function(){this.menuLayer.node.active=!1,this.gameLayer.node.active=!0,this.resultLayer.node.active=!1,this.gameLayer.resetData()},showWinGame:function(){this.resultLayer.node.active=!0,this.resultLayer.node.opacity=0,this.resultLayer.node.runAction(cc.fadeIn(.2)),this._submitResult()},onClaimReward:function(){window.location.href=u},onShareFB:function(){this._share()},_share:function(){this._mobileShare()},_mobileShare:function(){var t=window.location.href;if(!s.getUrlParameter("winGame")){var e=t.indexOf("?");-1<e&&(t=t.substr(0,e)),t+="?winGame=yes&token="+this.token}i.manualShare(h,t)},_shareWeb:function(){i.share(h).then(function(t){console.log("share success! "+JSON.stringify(t)),i.feed(1).then(function(t){console.log("post: "+JSON.stringify(t)),self._checkPost(t.data[0])}).catch(function(t){console.log("post err: "+JSON.stringify(t))})})},_checkAndAddParam:function(){var t=s.getUrlParameter("winGame");if(cc.sys.MOBILE_BROWSER&&!t){var e=window.location.href;-1<e.indexOf("?")?e+="&winGame=1":e+="?winGame=1",window.location.href=e}},_checkAndAddStartGameParam:function(){var t=s.getUrlParameter("startGame");if(cc.sys.MOBILE_BROWSER&&!t){var e=window.location.href;-1<e.indexOf("?")?e+="&startGame=1":e+="?startGame=1",window.location.href=e}},_checkPost:function(t){i.post(t.id,"link").then(function(t){console.log("post id: "+t.id+" link: "+t.link)}).catch(function(t){console.log("post err: "+JSON.stringify(t))})},_checkQuery:function(){(this.token=s.getUrlParameter("token"),console.log("token: "+this.token),s.getUrlParameter("winGame"))?(this.menuLayer.node.active=!1,this.gameLayer.node.active=!1,this.resultLayer.node.active=!0):s.getUrlParameter("startGame")&&this._startGame()},_submitResult:function(){if(this.token&&""!==this.token){var t=new FormData;t.append("token",this.token),o.post("https://delivery-dev.gibi.vn/game/hazeline_submit.php",t).then(function(t){var e=JSON.parse(t);console.log("result: "+e.message)})}}}),cc._RF.pop()},{FBHelper:"FBHelper",GameLayer:"GameLayer",HTTPHelper:"HTTPHelper",MenuLayer:"MenuLayer",ResultLayer:"ResultLayer",Utils:"Utils"}],GameLayer:[function(t,e,n){"use strict";cc._RF.push(e,"29195N7si1LpY+5Eygl8jxI","GameLayer");var i=t("InstructionLayer"),o=t("CountDown"),s=t("ScoreBoard"),c=t("RedDotMove");cc.Class({extends:cc.Component,properties:{talentBefore:cc.Sprite,talentAfter:cc.Sprite,instructionLayer:i,uiNode:cc.Node,countDown:o,scoreBoard:s,listRedDot:{default:[],type:c},UIReplay:cc.Node},init:function(t){this.game=t,this.score=0,this.instructionLayer.init(this),this.countDown.init(this),this.scoreBoard.init(this);for(var e=0;e<this.listRedDot.length;e++)this.listRedDot[e].init(this)},addScore:function(t){var e=this;this.score+=t,this.scoreBoard.setScore(this.score),this.score==this.listRedDot.length&&(this.countDown.gameWin(),this.node.runAction(cc.sequence(cc.callFunc(function(t){e.talentBefore.node.runAction(cc.fadeOut(.15)),e.talentAfter.node.runAction(cc.fadeIn(.15))}),cc.delayTime(.69),cc.fadeOut(.35),cc.callFunc(function(t){e.game.showWinGame()}))),console.log("Win Game CMNR"))},resetData:function(){this.instructionLayer.startTutorialAnim()},onStartGamePlay:function(){for(var e=this,t=0;t<this.listRedDot.length;t++)this.listRedDot[t].node.active=!1;this.score=0,this.instructionLayer.node.active=!1,this.uiNode.active=!0,this.UIReplay.active=!1,this.countDown.startCd(),this.scoreBoard.setScore(this.score),this.node.runAction(cc.sequence(cc.callFunc(function(t){return e.enableRedDot(1)}),cc.delayTime(2.5),cc.callFunc(function(t){return e.enableRedDot(2)}),cc.delayTime(2.5),cc.callFunc(function(t){return e.enableRedDot(3)})))},enableRedDot:function(t){if(1==t)for(var e=0;e<2;e++)this.listRedDot[e].node.active=!0,this.listRedDot[e].startAnim(),this.listRedDot[e].setEnableTouch(!0);else if(2==t)for(e=2;e<5;e++)this.listRedDot[e].node.active=!0,this.listRedDot[e].startAnim(),this.listRedDot[e].setEnableTouch(!0);else for(e=5;e<8;e++)this.listRedDot[e].node.active=!0,this.listRedDot[e].startAnim(),this.listRedDot[e].setEnableTouch(!0)},gameOver:function(){this.UIReplay.active=!0;for(var t=0;t<this.listRedDot.length;t++)this.listRedDot[t].setEnableTouch(!1)}}),cc._RF.pop()},{CountDown:"CountDown",InstructionLayer:"InstructionLayer",RedDotMove:"RedDotMove",ScoreBoard:"ScoreBoard"}],HTTPHelper:[function(t,e,n){"use strict";cc._RF.push(e,"80322iViDdAaJcOswrm6NrF","HTTPHelper"),e.exports={get:function(i,o){return new Promise(function(e,t){var n=cc.loader.getXMLHttpRequest();n.open("GET",i,!0),n.setRequestHeader("Content-Type","text/plain"),n.send(o),n.onreadystatechange=function(){if(4==n.readyState&&200<=n.status&&n.status<400){var t=n.responseText;e(t)}}})},post:function(i,o){var s=this;return new Promise(function(e,t){var n=s.createCORSRequest("POST",i);n.send(o),n.onreadystatechange=function(){if(4==n.readyState&&200<=n.status&&n.status<400){var t=n.responseText;e(t)}}})},createCORSRequest:function(t,e){var n=new XMLHttpRequest;return"withCredentials"in n?n.open(t,e,!0):"undefined"!=typeof XDomainRequest?(n=new XDomainRequest).open(t,e):n=null,n}},cc._RF.pop()},{}],HandPoint:[function(t,e,n){"use strict";cc._RF.push(e,"89da10ahMxAr4drbLC+KhZw","HandPoint"),cc.Class({extends:cc.Component,properties:{},start:function(){}}),cc._RF.pop()},{}],InstructionLayer:[function(t,e,n){"use strict";cc._RF.push(e,"0f1b6sslglAiqFQcZgwjrfx","InstructionLayer");var i=t("RedDotMove"),o=t("HandPoint");cc.Class({extends:cc.Component,properties:{cdText:cc.Label,touchSprite:cc.Sprite,listRedDot:{default:[],type:i},listRedDotStartPos:{default:[],type:cc.Node},handPoint:o,bg:cc.Node},init:function(t){this.gameLayer=t,this.isCountDown=!1,this.currTime=0,this.maxTime=3,this.cdText.string=""+Number.parseInt(this.maxTime-this.currTime)},startTutorialAnim:function(){for(var e=this,t=0;t<3;t++)this.listRedDot[t].node.runAction(cc.sequence(cc.moveTo(.75,this.listRedDotStartPos[t].position),cc.callFunc(function(t){t.getComponent("RedDotMove").startAnim()})));this.handPoint.node.runAction(cc.sequence(cc.delayTime(2),cc.moveTo(.15,this.listRedDotStartPos[0]),cc.callFunc(function(t){return e.destroyRedDot(0)}),cc.delayTime(.3),cc.moveTo(.15,this.listRedDotStartPos[1]),cc.callFunc(function(t){return e.destroyRedDot(1)}),cc.delayTime(.3),cc.moveTo(.15,this.listRedDotStartPos[2]),cc.callFunc(function(t){return e.destroyRedDot(2)}),cc.fadeOut(.2),cc.callFunc(function(t){return e.startCountDown()})))},destroyRedDot:function(t){this.listRedDot[t].destroyObj()},startCountDown:function(){this.bg.runAction(cc.fadeTo(.15,150)),this.touchSprite.node.active=!1,this.cdText.node.active=!0,this.isCountDown=!0},countDownComplete:function(){var e=this;this.bg.runAction(cc.sequence(cc.fadeOut(.25),cc.callFunc(function(t){e.gameLayer.onStartGamePlay()})))},update:function(t){1==this.isCountDown&&(this.currTime+=t,this.currTime>=this.maxTime&&(this.currTime=this.maxTime,this.isCountDown=!1,this.countDownComplete()),this.cdText.string=""+Number.parseInt(this.maxTime-this.currTime+1))}}),cc._RF.pop()},{HandPoint:"HandPoint",RedDotMove:"RedDotMove"}],MenuLayer:[function(t,e,n){"use strict";cc._RF.push(e,"6f272zCarZLE4sHINI5spj1","MenuLayer"),cc.Class({extends:cc.Component,properties:{},init:function(t){this.game=t,this.resetData()},resetData:function(){}}),cc._RF.pop()},{}],NewScript:[function(t,e,n){"use strict";cc._RF.push(e,"ac95a/VPbdPRrZUbZixiHMU","NewScript"),cc.Class({extends:cc.Component,properties:{},start:function(){}}),cc._RF.pop()},{}],RedDotMove:[function(t,e,n){"use strict";cc._RF.push(e,"122808GoVVMoZ20bh1X1KSl","RedDotMove"),cc.Class({extends:cc.Component,properties:{magicTile:cc.Prefab,moveRange:30},init:function(t){this.gameLayer=t,this.node.on(cc.Node.EventType.TOUCH_START,function(t){1==this.enableTouch&&(this.enableTouch=!1,this.destroyObj(),this.addScore(1))},this)},onLoad:function(){this.isActiveAnim=!1,this.enableTouch=!1},startAnim:function(){this.isActiveAnim=!0,this.rootPosX=this.node.x,this.rootPosY=this.node.y,this.node.opacity=255,this.node.scaleX=1,this.node.scaleY=1,this.randMove()},setEnableTouch:function(t){this.enableTouch=t},randMove:function(){this.timeChange=cc.random0To1(),this.currTime=0;var t=cc.randomMinus1To1()*this.moveRange,e=cc.randomMinus1To1()*this.moveRange;this.newPosX=t+this.rootPosX,this.newPosY=e+this.rootPosY,this.velX=this.newPosX-this.node.x,this.velY=this.newPosY-this.node.y},update:function(t){0!=this.isActiveAnim&&(this.currTime+=t,(this.isCanChangeMove()||this.currTime>=this.timeChange)&&this.randMove(),this.node.x+=this.velX*t,this.node.y+=this.velY*t)},isCanChangeMove:function(){return Math.abs(this.newPosX-this.node.x)<2&&Math.abs(this.newPosY-this.node.y)<2},destroyObj:function(){if(this.isActiveAnim=!1,this.node.stopAllActions(),this.node.runAction(cc.fadeOut(.5)),this.node.runAction(cc.scaleTo(.5,2.5)),null!=this.magicTile){var t=cc.instantiate(this.magicTile);t.parent=this.node.parent,t.x=this.node.x,t.y=this.node.y,t.active=!0,t.scaleX=.5,t.scaleY=.5,t.opacity=0,t.runAction(cc.scaleTo(.5,1.5)),t.runAction(cc.sequence(cc.delayTime(.1),cc.fadeIn(.25),cc.fadeOut(.2),cc.callFunc(function(t){t.destroy()})))}},addScore:function(t){this.gameLayer.addScore(t)}}),cc._RF.pop()},{}],ResultLayer:[function(t,e,n){"use strict";cc._RF.push(e,"58320wmTTJAEIiovFsR4v4K","ResultLayer"),cc.Class({extends:cc.Component,properties:{},init:function(t){this.game=t},update:function(t){}}),cc._RF.pop()},{}],Rotator:[function(t,e,n){"use strict";cc._RF.push(e,"00722jmZpdB9b7W4XJx+8X9","Rotator"),cc.Class({extends:cc.Component,properties:{},start:function(){this.node.runAction(cc.repeatForever(cc.rotateBy(1,360)))}}),cc._RF.pop()},{}],ScoreBoard:[function(t,e,n){"use strict";cc._RF.push(e,"306f47OjY9EwLZb6f+NtCDj","ScoreBoard"),cc.Class({extends:cc.Component,properties:{scoreText:cc.Label},init:function(t){this.gameController=t},start:function(){this.resetScore()},addScore:function(t){this.score+=t,this.scoreText.string=""+this.score},setScore:function(t){this.score=t,this.scoreText.string=""+this.score},resetScore:function(){this.score=0,this.scoreText.string=""+this.score}}),cc._RF.pop()},{}],Utils:[function(t,e,n){"use strict";cc._RF.push(e,"8d3ccdvqgxG2J8NpPzoVD03","Utils"),e.exports={getUrlParameter:function(t){t=t.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]");var e=new RegExp("[\\?&]"+t+"=([^&#]*)").exec(location.search);return null===e?"":decodeURIComponent(e[1])}},cc._RF.pop()},{}]},{},["AutoRotate","CountDown","FBHelper","GameController","GameLayer","HTTPHelper","HandPoint","InstructionLayer","MenuLayer","NewScript","RedDotMove","ResultLayer","Rotator","ScoreBoard","Utils"]);