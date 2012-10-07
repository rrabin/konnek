function handleMyFriends(response) {
	var friends = response.data;
	if (friends == undefined) {
		return;
	}
	var node_map = getMap();
	for (var j = 0; j < ALLMyfriendsId.length; j++) {
		var myfriendid = ALLMyfriendsId[j];
		for (var i = 0; i < friends.length; i++) {
			if (friends[i] == undefined) continue;
			if (myfriendid == friends[i].id) {
				postMessage("Found connection for my friend:"+myId+" and this guy:"+friends[i].id+"<br/>");
				var sn1 = node_map[myId];
				var sn2 = createUserNodes(friends[i].id, '', friends[i].picture);
				konnekThem(sn1, sn2);
			}
		}
	}
 }