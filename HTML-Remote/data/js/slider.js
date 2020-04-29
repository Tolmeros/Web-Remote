var __extends=this&&this.__extends||function(){var n=function(t,i){return n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(n,t){n.__proto__=t}||function(n,t){for(var i in t)t.hasOwnProperty(i)&&(n[i]=t[i])},n(t,i)};return function(t,i){function r(){this.constructor=t}n(t,i);t.prototype=i===null?Object.create(i):(r.prototype=i.prototype,new r)}}(),WorkSpace=function(){function n(n){var t=this;this.inputs=[];this.outputs=[];this.values=new Dictionary;this.sent=new Dictionary;this.tranCount=0;this.timer=0;this.reportInterval=100;this.form=n;window.addEventListener("resize",function(){return t.UpdateLayout()},!1)}return n.init=function(t){var i=new n(t[0]);i.registerInputs();i.registerOutputs();i.Connect()},n.prototype.Connect=function(){var n=this,t=$.get("/api/pipename").done(function(t){n.socket=new WebSocket(t);n.socket.onopen=function(){n.setFormat();n.sendData()};n.socket.onmessage=function(t){$("#message").text(t.data);n.receiveData(t)};n.socket.onclose=function(){$("#message").text("Disconnect...")}}).fail(function(){$("#message").text("error")})},n.prototype.setFormat=function(){var n=this,t;this.fields=[];t=[];$.each(this.values,function(t){n.fields.push(t)});this.socket.send(JSON.stringify({fields:this.fields}))},n.prototype.sendData=function(){var f=this,i,r,t,n,u;if(this.timer===0){if(this.socket&&this.socket.bufferedAmount==0){for(i=[],r=!1,t=0;t<this.fields.length;t++)n=this.fields[t],u=this.values[n],i.push(u),this.sent[n]!==this.values[n]&&(r=!0),this.sent[n]=u;r==!0&&this.socket.send(JSON.stringify({values:i}))}this.timer=setTimeout(function(){f.timer=0;f.sendData()},this.reportInterval)}},n.prototype.receiveData=function(n){var u,t,i,r;if(n.data){for(u=JSON.parse(n.data),t=0;t<this.fields.length;t++)i=this.fields[t],r=u.values[t],this.sent[i]!=r&&(this.sent[i]=r,this.values[i]=r,this.refreshInput(i,r));this.refreshOutput()}},n.toggleFullScreen=function(){var n=window.document,t=n.documentElement,i=t.requestFullscreen||t.mozRequestFullScreen||t.webkitRequestFullScreen||t.msRequestFullscreen,r=n.exitFullscreen||n.mozCancelFullScreen||n.webkitExitFullscreen||n.msExitFullscreen;n.fullscreenElement||n.mozFullScreenElement||n.webkitFullscreenElement||n.msFullscreenElement?r.call(n):i.call(t)},n.prototype.UpdateLayout=function(){for(var t,n=0;n<this.inputs.length;n++)this.inputs[n].initLayout();for(t=0;n<this.outputs.length;n++)this.outputs[t].initLayout()},n.prototype.registerInputs=function(){var n=this,t=$(".input",this.form);t.each(function(t,i){var r=i,u,f;$(r).hasClass("slider")?(f=new Slider(r),u=f):u=new Input(r);n.addInput(u)})},n.prototype.addInput=function(n){n.workSpace=this;this.inputs.push(n);n.saveValue()},n.prototype.registerOutputs=function(){var n=this,t=$(".output",this.form);t.each(function(t,i){var u=i,r;r=new Output(u);n.addOutput(r)})},n.prototype.addOutput=function(n){n.workSpace=this;this.outputs.push(n);n.loadValue()},n.prototype.beginTransaction=function(){this.tranCount+=1},n.prototype.endTransaction=function(){if(this.tranCount-=1,this.tranCount===0)for(var n=0;n<this.outputs.length;n++)this.outputs[n].loadValue()},n.prototype.refreshInput=function(n,t){for(var i=0;i<this.inputs.length;i++)this.inputs[i].loadValue(n,t)},n.prototype.refreshOutput=function(){for(var n=0;n<this.outputs.length;n++)this.outputs[n].loadValue()},n}(),Dictionary=function(){function n(n){if(n)for(var t=0;t<n.length;t++)this[n[t].key]=n[t].value}return n}(),Point=function(){function n(){this.x=0;this.y=0}return n}(),Input=function(){function n(n){this.element=n;this.jElement=$(n);this.name=this.jElement.attr("name")}return n.prototype.saveValue=function(){if(this.workSpace){this.workSpace.beginTransaction();var n=this.jElement.attr("value");n&&(this.workSpace.values[this.name]=n);this.workSpace.endTransaction()}},n.prototype.loadValue=function(n,t){n==name&&this.jElement.attr("value",t)},n.prototype.initLayout=function(){},n}(),Slider=function(n){function t(t){var i=n.call(this,t)||this,r;return i.pressed=!1,i.handlePos=new Point,i.value=new Point,i.center=new Point,i.autoCenterX=!1,i.autoCenterY=!1,i.handle=$(".handle",t)[0],r=$(".pot",t),r.length>0&&(i.pot=r[0]),"ontouchstart"in document.documentElement?(i.element.addEventListener("touchstart",function(n){return i.onTouchStart(n)},!1),i.element.addEventListener("touchmove",function(n){return i.onTouchMove(n)},!1),i.element.addEventListener("touchend",function(n){return i.onTouchEnd(n)},!1)):(i.element.addEventListener("mousedown",function(n){return i.onMouseDown(n)},!1),i.element.addEventListener("mousemove",function(n){return i.onMouseMove(n)},!1),i.element.addEventListener("mouseup",function(n){return i.onMouseUp(n)},!1)),i.initLayout(),$(t).data("center")?(i.autoCenterX=!0,i.autoCenterY=!0):$(t).data("center-x")?i.autoCenterX=!0:$(t).data("center-y")&&(i.autoCenterY=!0),i.refreshLayout(!0),i}return __extends(t,n),t.prototype.onTouchStart=function(){this.pressed=!0;this.element.style.zIndex="100"},t.prototype.onTouchMove=function(n){n.preventDefault();this.pressed===!0&&(this.handlePos=t.pointFromTouch(this.element,n.targetTouches[0]),this.refreshLayout(!1),this.saveValue())},t.prototype.onTouchEnd=function(){this.pressed=!1;this.autoCenterX&&(this.handlePos.x=this.center.x);this.autoCenterY&&(this.handlePos.y=this.center.y);this.refreshLayout(!0);this.saveValue();this.element.style.zIndex="0"},t.prototype.onMouseDown=function(){this.pressed=!0;this.element.style.zIndex="100"},t.prototype.onMouseMove=function(n){this.pressed===!0&&(this.handlePos=t.pointFromMouseEvent(this.element,n),this.refreshLayout(!1),this.saveValue())},t.prototype.onMouseUp=function(){this.pressed=!1;this.autoCenterX&&(this.handlePos.x=this.center.x);this.autoCenterY&&(this.handlePos.y=this.center.y);this.refreshLayout(!0);this.saveValue();this.element.style.zIndex="0"},t.prototype.refreshLayout=function(n){var t,i;n&&(this.handlePos.x<0&&(this.handlePos.x=0),this.handlePos.y<0&&(this.handlePos.y=0),this.handlePos.x>this.element.clientWidth&&(this.handlePos.x=this.element.clientWidth),this.handlePos.y>this.element.clientHeight&&(this.handlePos.y=this.element.clientHeight));this.handle.style.left=""+(this.handlePos.x-this.handle.clientWidth/2)+"px";this.handle.style.top=""+(this.handlePos.y-this.handle.clientHeight/2)+"px";t=new Point;t.x=this.handlePos.x;t.y=this.handlePos.y;t.x<0&&(t.x=0);t.y<0&&(t.y=0);t.x>this.element.clientWidth&&(t.x=this.element.clientWidth);t.y>this.element.clientHeight&&(t.y=this.element.clientHeight);i=new Point;i.x=(this.center.x-t.x)*100/(this.element.clientWidth/2);i.y=(this.center.y-t.y)*100/(this.element.clientHeight/2);this.value=i;this.pot&&(this.pot.style.left=""+(t.x-this.pot.clientWidth/2)+"px",this.pot.style.top=""+(t.y-this.pot.clientHeight/2)+"px")},t.prototype.saveValue=function(){var n,i;this.workSpace&&(this.workSpace.beginTransaction(),n=this.name+"_x",this.workSpace.values[n]=t.numToString(this.value.x),i=this.name+"_y",this.workSpace.values[i]=t.numToString(this.value.y),this.workSpace.endTransaction())},t.prototype.loadValue=function(n,t){if(this.pressed!=!0){var r=this.name+"_x",u=this.name+"_y",i=!1;n==r&&(this.value.x=t,i=!0);n==u&&(this.value.y=t,i=!0);i==!0&&this.initLayout()}},t.prototype.initLayout=function(){this.center.x=this.element.clientWidth/2;this.center.y=this.element.clientHeight/2;var n=this.element.clientWidth/2,t=this.element.clientHeight/2;this.handlePos.x=this.center.x-this.value.x*n/100;this.handlePos.y=this.center.y-this.value.y*t/100;this.handle.style.left=""+(this.handlePos.x-this.handle.clientWidth/2)+"px";this.handle.style.top=""+(this.handlePos.y-this.handle.clientHeight/2)+"px";this.pot&&(this.pot.style.left=""+(this.handlePos.x-this.pot.clientWidth/2)+"px",this.pot.style.top=""+(this.handlePos.y-this.pot.clientHeight/2)+"px")},t.numToString=function(n){return(Math.round(n*100)/100).toString(10)},t.pointFromMouseEvent=function(n,t){var r=0,u=0,f=0,e=0,i;if(t||(t=window.event),t.pageX||t.pageY?(r=t.pageX,u=t.pageY):(t.clientX||t.clientY)&&(r=t.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,u=t.clientY+document.body.scrollTop+document.documentElement.scrollTop),n.offsetParent)do f+=n.offsetLeft,e+=n.offsetTop;while(n=n.offsetParent);return i=new Point,i.x=r-f,i.y=u-e,i},t.pointFromTouch=function(n,t){var r=0,u=0,f=0,e=0,i;if(t.pageX||t.pageY?(r=t.pageX,u=t.pageY):(t.clientX||t.clientY)&&(r=t.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,u=t.clientY+document.body.scrollTop+document.documentElement.scrollTop),n.offsetParent)do f+=n.offsetLeft,e+=n.offsetTop;while(n=n.offsetParent);return i=new Point,i.x=r-f,i.y=u-e,i},t}(Input),Output=function(){function n(n){this.element=n;this.jElement=$(n);this.name=this.jElement.data("input")}return n.prototype.loadValue=function(){this.workSpace.values[this.name]=="undefined"||(this.element.tagName.toUpperCase()=="INPUT"?this.jElement.val(this.workSpace.values[this.name]):this.jElement.text(this.workSpace.values[this.name]))},n.prototype.initLayout=function(){},n}();