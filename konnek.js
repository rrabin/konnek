function handleMe(response) {
	myId = response.id;
	tmpId = response.id;
	var sn = createMainUserNode(response.id, response.name, response.picture);
	addToMap("Name"+tmpId, response.name);
	sn.dblclick(function (event) { alert("Hello "+response.name); });
	myfriends.push(sn);
	myfriendsid.push(myId);
}
	
function handleFriends(response) {
	var friends = response.data;
	if (friends == undefined) return;
	var node_map = getMap();
	var fList = new Array();
	for (var i = 0; i < friends.length; i++) {
		if (friends[i] == undefined) continue;
		if (tmpId == myId) {
			var sn1 = node_map[tmpId];
			var sn2 = createUserNodes(friends[i].id, '', friends[i].picture);
			fList.push(friends[i].name);
			addToMap("Name"+friends[i].id, friends[i].name);
			addToMap(friends[i].name, friends[i].id);
			ALLMyfriendsId.push(friends[i].id);
		}
	}
	$("#basic_autocomplete_field").smartAutoComplete({source: fList});
}
	
	
function handleMyFriends(response) {
	var friends = response.data;
	if (friends == undefined) {
		FB.init({appId:'163289627145227', cookie:true, status:true, xfbml:true }); FB.ui({ method:'send', to:myId, 'name':'Click here to join Konnek', 'display':'popup', 'description':'Kool to Konnek', 'link':'http://www.raffyrabin.com/connekt'});
		return;
	}
	document.getElementById("friendInfoId").innerHTML = "";
	var node_map = getMap();
	var color = getRandomColor();
	var mutualFriendsCount = 0;
	var sn1;
	var sn2List = new Array();
	for (var j = 0; j < ALLMyfriendsId.length; j++) {
		var myfriendid = ALLMyfriendsId[j];
		for (var i = 0; i < friends.length; i++) {
			if (friends[i] == undefined) continue;
			if (myfriendid == friends[i].id) {
				var sn1 = node_map[myId];
				var sn2 = createUserNodes(friends[i].id, '', friends[i].picture, color);
				konnekThem(sn1, sn2, friends[i].name, color);
				sn2List.push(sn2);
				mutualFriendsCount++;
			} 
		}
	}
	updateMap(sn1, sn2List);
	var mainfbmode = node_map[myId];
	var fbkey = "Name"+myId;
	var friendName = node_map[fbkey];
	//textname = r.text(mainfbmode.attr('x')+25, mainfbmode.attr('y')+60, friendName);
	document.getElementById("friendInfoId").innerHTML = "<br/>You and <a style='text-decoration:none' href='#'><span onClick=javascript:window.open('https://www.facebook.com/profile.php?id="+myId+"','_newtab');>"+friendName+"</span></a> have <font color='red'>"+mutualFriendsCount+"</font> mutual friends.";
}
	
function handleRemoveMyFriends(response) {
		var friends = response.data;
		if (friends == undefined) {
			FB.init({appId:'163289627145227', cookie:true, status:true, xfbml:true }); FB.ui({ method:'send', to:myId, 'name':'Click here to join Konnek', 'display':'popup', 'description':'Kool to Konnek', 'link':'http://www.raffyrabin.com/connekt'});
			return;
		}
		var node_map = getMap();
		var color = getRandomColor();
		for (var j = 0; j < ALLMyfriendsId.length; j++) {
			var myfriendid = ALLMyfriendsId[j];
			for (var i = 0; i < friends.length; i++) {
				if (friends[i] == undefined) continue;
				if (myfriendid == friends[i].id) {
					var sn1 = node_map[myId];
					var sn2 = createUserNodes(friends[i].id, '', friends[i].picture);
					clearKonnek(sn1, sn2, color);
				}
			}
		}
}