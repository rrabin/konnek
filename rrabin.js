var myfriends = new Array();
var myfriendsid = new Array();
var ALLfriends = new Array();
var ALLfriendsId = new Array();
var ALLMyfriendsId = new Array();
var myId11 = new Array();
var myId = 0;
var myId2 = 0;
var tmpId = 0;
var dict = [];
var hash = function(obj) {
  	return obj;
};

function getScreenHeight() {
		var sHeight = 0;
		if( typeof( window.innerWidth ) == 'number' ) { 
			//Non-IE 
			sHeight = window.innerHeight; 
		} else if(document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) { 
			//IE 6+ in 'standards compliant mode' 
			sHeight = document.documentElement.clientHeight; 
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) { 
			//IE 4 compatible 
			sHeight = document.body.clientHeight; 
		}	
		return sHeight;
}
			
function getScreenWidth() {
		var sWidth = 0;
		if( typeof( window.innerWidth ) == 'number' ) { 
			//Non-IE 
			sWidth = window.innerWidth;
		} else if(document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight ) ) { 
			//IE 6+ in 'standards compliant mode' 
			sWidth = document.documentElement.clientWidth; 
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) { 
			//IE 4 compatible 
			sWidth = document.body.clientWidth; 
		}	
		return sWidth;
}
			
function createMultipleNodes(_nodeCount) {
	    var savedNodeCounter = 0;
		var snodes = new Array();
		var n_map = getMap();
		for (var i = 0, ii = _nodeCount; i < ii; i++) {
			var n_val = n_map[i];
			if (n_val != undefined) {
				snodes[i] = n_val;
				savedNodeCounter++;
			}
		}
		for (var j = savedNodeCounter, jj = _nodeCount; j < jj; j++) {
				var x_axis = Math.floor(Math.random()*(myWidth-100));
				var y_axis = Math.floor(Math.random()*(myHeight-100));
				snodes.push(r.rect(x_axis, y_axis, 50, 50, 5));
				var color = Raphael.getColor();
				snodes[j].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
				snodes[j].drag(move, dragger, up);
				addToMap(j, snodes[j]);
		}
		return snodes;
}

function createUserNodes(uid, fbname, imgSrc, color) {
		var imgSrc = "https://graph.facebook.com/"+uid+"/picture";
		var n_map = getMap();
		var n_val = n_map[uid];
		if (n_val != undefined) {
			n_val.dblclick(function() { myId = uid; if (n_map["isConnected-"+uid] == "false" || n_map["isConnected-"+uid] == undefined) { FB.api("/"+uid+"/friends?fields=id,name,picture", handleMyFriends); updateMap("isConnected-"+uid, "true"); } else { FB.api("/"+uid+"/friends?fields=id,name,picture", handleRemoveMyFriends); updateMap("isConnected-"+uid, "false"); }  });
			return n_val;
		} else {
			
			var x_axis = Math.floor(Math.random()*(myWidth-100));
			var y_axis = Math.floor(Math.random()*(myHeight-100));
			var x_and_y = x_axis+y_axis;
			while (x_and_y == n_map[x_and_y]) {
					x_axis = Math.floor(Math.random()*(myWidth-100));
					y_axis = Math.floor(Math.random()*(myHeight-100));
					x_and_y = x_axis+y_axis;
			}
			addToMap(x_and_y, x_and_y);
			
			if (node_x_axis < (myWidth-150)) {
				node_x_axis = node_x_axis + 75;
			} else if (node_x_axis >= (myWidth-150)) {
				node_x_axis = 35;
				node_y_axis = node_y_axis + 65;
			}
			
			if (node_y_axis >= (myHeight-50)) {
				node_x_axis = 35;
				node_y_axis = 112;
			} 
			
			//var snodevar = r.image(imgSrc, node_x_axis, node_y_axis, 50, 50); //absolute position
			var snodevar = r.image(imgSrc, node_x_axis, node_y_axis, 50, 50);
			snodevar.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
			snodevar.drag(move, dragger, up);
			addToMap(uid, snodevar);
			snodevar.dblclick(function() { myId = uid; if (n_map["isConnected-"+uid] == "false" || n_map["isConnected-"+uid] == undefined) { FB.api("/"+uid+"/friends?fields=id,name,picture", handleMyFriends); updateMap("isConnected-"+uid, "true"); } else { FB.api("/"+uid+"/friends?fields=id,name,picture", handleRemoveMyFriends); updateMap("isConnected-"+uid, "false"); }  });
		}
		return snodevar;
}

function createMainUserNode(uid, fbname, imgSrc) {
	    var n_map = getMap();
		var n_val = n_map[uid];
		var imageSrc = "https://graph.facebook.com/"+uid+"/picture";
		if (n_val != undefined) {
			return n_val;
		} else {
			var x_axis = Math.floor(Math.random()*(myWidth-100));
			var y_axis = Math.floor(Math.random()*(myHeight-100));
			//var snodevar = r.image(imageSrc, main_x_axis, main_y_axis, 75, 75); --random place
			var snodevar = r.image(imageSrc, main_x_axis, main_y_axis, 75, 75); 
			var color = Raphael.getColor();
			snodevar.attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
			snodevar.drag(move, dragger, up);
			addToMap(uid, snodevar);
		}
		return snodevar;
}
			
function buildRelationship(_parent, _parentInx, _childrenNodes) {
		var color = '#bf0000';
		var n_map = getMap() ;
		for (var j = 0, jj = _childrenNodes.length; j < jj; j++) {
			connections.push(r.connection(n_map[_parentInx], _childrenNodes[j], "#fff"));
		}
}

function buildConnection(_parentInx, _childrenNodes) {
		var n_map = getMap() ;
		for (var j = 0, jj = _childrenNodes.length; j < jj; j++) {
			connections.push(r.connection(n_map[_parentInx], _childrenNodes[j], "#fff"));
		}
}

function konnekThem(nodeObj1, nodeObj2, color) {
	    //nodeObj2.dblclick(function() { myId = uid; FB.api("/"+uid+"/friends?fields=id,name,picture", handleMyFriends); });
		connections.push(r.connection(nodeObj1, nodeObj2, color));
}

function clearKonnek(nodeObj1, nodeObj2, color) {
		connections.push(r.connection(nodeObj1, nodeObj2, color));
}

function ifExist(_key) {
		return dict[hash(_key)];
}

function addToMap(_key, _value) {
	    if (dict[hash(_key)] == undefined) {
			dict[hash(_key)] = _value;
		} 
}

function updateMap(_key, _value) {
	    dict[hash(_key)] = _value;
}

function getMapValueByKey(_key) {
		return dict[hash(_key)];
}

function getMap() {
		return dict;
}

function getMapSize() {
		return dict.length;
}

function clearMap() {
		dict = [];
}

function thread_start(callback) {
	setTimeout(callback, 1);
	return true;
}

function getRandomColor() {
	 return '#'+Math.floor(Math.random()*16777215).toString(16);
}  

function handleLogin(response) {
				myWidth = getScreenWidth();
				myHeight = getScreenHeight();
				dragger = function () {
					this.ox = this.attr("x");
					this.oy =this.attr("y");
					if (this.attr('fill-opacity') != 1) {
						this.animate({"fill-opacity": .2}, 500);
					} else {
						this.animate({'fill-opacity': .2}, 500);	
					}
				},
				move = function (dx, dy) {
					var att = this.type != "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
					this.attr(att);
					for (var i = connections.length; i--;) {
						r.connection(connections[i]);
					}
					r.safari();
				},
				up = function () {
					if (this.attr('fill-opacity') != 1) {
						this.animate({"fill-opacity": 0}, 500);
					} else {
						this.animate({'fill-opacity': 0}, 500);	
					}
				},
				r = Raphael("holder", myWidth, myHeight),
				connections = [],
				mainnode = [];
				
                FB.api("/me?fields=name,picture", handleMe);
                FB.api("/me/friends?fields=id,name,picture", handleFriends);
}

function creatediv(id, html, width, height, left, top) {
   var newdiv = document.createElement('div');
   newdiv.setAttribute('id', id);
 
   if (width) {
       newdiv.style.width = 300;
   }
   
   if (height) {
       newdiv.style.height = 300;
   }
   
   if ((left || top) || (left && top)) {
       newdiv.style.position = "absolute";
       
       if (left) {
           newdiv.style.left = left;
       }
       
       if (top) {
           newdiv.style.top = top;
       }
   }
   
   newdiv.style.background = "#00C";
   newdiv.style.border = "4px solid #000";
   
   if (html) {
       newdiv.innerHTML = html;
   } else {
       newdiv.innerHTML = "nothing";
   }
   
   document.body.appendChild(newdiv);

} 
