<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
    <title>Konnek</title>
    <script type="text/javascript" src="http://code.jquery.com/jquery-latest.js" ></script>
    <script type="text/javascript" src="jquery-graphapi.js" ></script>
    <script src="raphael.js" type="text/javascript" charset="utf-8"></script>
    <script src="graffle.js" type="text/javascript" charset="utf-8"></script>
    <script src="http://connect.facebook.net/en_US/all.js"></script>
    <script>
	   function openThisProfile(faceId) {
		window.open('https://www.facebook.com/profile.php?id='+faceId, '_newtab');  
       	   }
    </script>	
    <link rel="stylesheet" href="konnek.css" type="text/css" media="screen">
    <link rel="stylesheet" href="konnek-print.css" type="text/css" media="print">
    <style type="text/css">
      #holder {
                -moz-border-radius: 10px;
                -webkit-border-radius: 10px;
                border: solid 1px #333;
      }
      #userprofile {
                
      }	
      #fbmessage {

      }
      #lateststatusupdates {
		
      }
      p {
          text-align: center;
      }
    </style>
</head>
<body>
Konnek:&nbsp;<strong>G(n,p)</strong><br/>
by: raffyrabin
<br/><br/>
<div style="position: absolute; top: 75px; left: 25px; width: 240px; background-color: clear;">
   <table>
	<tr>
		<td>
			<span id="userprofile">
				<span style='cursor:pointer; cursor:hand;' onclick=openThisProfile('CHANGE THIS TO YOUR FB PROFILE ID');><img onclick=openThisProfile('CHANGE THIS TO YOUR FB PROFILE ID') src='DEFAULT IMAGE URL' /></span><br/><br/><span style='cursor:pointer; cursor:hand;' onclick=openThisProfile('CHANGE THIS TO YOUR FB PROFILE ID')>View [PUT A DEFAULT NAME HERE] Profile...</span>
			</span>
	<div id="profile_pics"></div>
		</td>
	</tr>
   </table>
</div>

<div style="position: absolute; top: 20px; left: 220px; width: 100%; background-color: clear;">
	<div id="holder"></div>
</div>
<br/><br/>

<div id="fb-root"></div>
<script>(function(d){
	var js, id = 'facebook-jssdk'; if (d.getElementById(id)) {return;}
	js = d.createElement('script'); js.id = id; js.async = true;
	js.src = "//connect.facebook.net/en_US/all.js#xfbml=1";
	d.getElementsByTagName('head')[0].appendChild(js);
	}(document));
</script>

<input type="hidden" id="atoken" value="" name="atoken" />

<?php

   require 'facebook.php';
  
   $app_id = "PUT IN YOUR FACEBOOK APP ID HERE";
   $app_secret = "PUT IN YOUR FACEBOOK APP SECRET KEY HERE";
   $my_url = "PUT IN YOUR FACEBOOK APP CALLBACK URL";
   $facebook = new Facebook($app_id, $app_secret);

   session_start(); 

   $user;
   $access_token;

   if(empty($_REQUEST['code'])) {
     $_SESSION['code'] = md5(uniqid(rand(), TRUE)); //CSRF protection
     $dialog_url = "http://www.facebook.com/dialog/oauth?client_id=" 
       . $app_id . "&redirect_uri=" . urlencode($my_url);
     echo("<script> top.location.href='" . $dialog_url . "'</script>");
   }

   $code = $_REQUEST['code'];

   if(!empty($code) && empty($access_token)) {
     	$token_url = "https://graph.facebook.com/oauth/access_token?". "client_id=" . $app_id . "&redirect_uri=" . urlencode($my_url). "&client_secret=" . $app_secret . "&code=" . $code;
	$response = file_get_contents($token_url);
	$params = null;
     	parse_str($response, $params);
	$access_token = $params['access_token'];
     	$graph_url = "https://graph.facebook.com/me?access_token=". $access_token;
     	$user = json_decode(file_get_contents($graph_url));
   } else if (!empty($access_token)) {
     	$graph_url = "https://graph.facebook.com/me?access_token=". $access_token;
     	$user = json_decode(file_get_contents($graph_url));
   }
  
  $facebook->setAccessToken($access_token);
  $access_token = $facebook->getAccessToken();
  $fbappurl = "https://graph.facebook.com/me/friends?access_token=".$access_token."";
  $file = file_get_contents($fbappurl);
  $file = str_replace('{"data":[','', $file);
  if(preg_match_all('~{(.*?)}~', $file ,$title, PREG_SET_ORDER)) {
	echo "<script>";
		 echo "document.getElementById('atoken').value='".$access_token."';";
		 echo "var el;";
		 echo "window.onload = function () {"; 
				echo "var start = function () {";
					 echo "this.ox = this.attr('x');";
					 echo "this.oy = this.attr('y');";
					 echo "this.animate({'fill-opacity': .2}, 700);";
				 echo "},";

				 echo "move = function (dx, dy) {";
				 echo "var att = this.type != 'rect' ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};";
				 echo "this.attr(att);";
				 echo "for (var i = connections.length; i--;) {";
					 echo "r.connection(connections[i]);";
				 echo "}";
				 echo "r.safari();";
			 	echo "},";

			 echo "up = function () {";
				 echo "this.animate({'fill-opacity': 0}, 700);";
			 echo "},";

			 echo "r = Raphael('holder', 1024, 1024),";
			 echo "connections = [],";
			 echo "konneknodes = [];";  
			 echo "konneknodes2 = [];";  
			 
			 echo "konneknodes.push(r.image('https://graph.facebook.com/".$user->id."/picture', 0, 1, 50, 50));";
			 echo "konneknodes[0].dblclick(function() { FB.init({appId:'".$app_id."', cookie:true, status:true, xfbml:true }); FB.ui({ method:'send', to: '".$user->id."', 'name':'Hi ".$user->name." click me to see your Connections', 'display':'popup', 'description':'Cool to Connect', 'link':'YOUR FACEBOOK APP CALLBACK URL'}); });";
			 echo "konneknodes[0].mouseover(function (event) { FB.api( {method: 'fql.query',query: 'SELECT pic_big FROM user WHERE uid=".$user->id."'},function(response) { document.getElementById('userprofile').innerHTML = '<span style=\'cursor:pointer; cursor:hand;\' onclick=openThisProfile(\'".$user->id."\');><img src='+response[0].pic_big+' /></span><br/><br/><span style=\'cursor:pointer; cursor:hand;\' onclick=openThisProfile(\'".$user->id."\')>View ".$user->name." Profile...</span>'; } ) });";
			 echo "var nodecounter = 1;";
			 echo "var color = Raphael.getColor();";
			 $xAxis = 35;
			 $yAxis = 145;
			 foreach ($title as $val) {
				$row=explode('{"name":"',$val[0]);
				$row=$row[1];
				$row=explode('","id":"',$row);
				$name=$row[0];
				$id=$row[1];
				$id=substr($id,0,-2);
				$name = str_replace('\'', '', $name);
				$xAxis = rand(200, 900);
				$yAxis = rand(10, 900);
				echo "konneknodes.push(r.image('https://graph.facebook.com/".$id."/picture', ".$xAxis.", ".$yAxis.", 25, 25));";
				echo "konneknodes[nodecounter].dblclick(function() { FB.init({appId:'".$app_id."', cookie:true, status:true, xfbml:true }); FB.ui({ method:'send', to: '".$id."', 'name':'Hi ".$name." click me to see your Connections with ".$user->name." ', 'display':'popup', 'description':'Kool to Konnek', 'link':'YOUR FACEBOOK APP CALLBACK URL'}); });";
				echo "konneknodes[nodecounter].mouseover(function (event) { FB.api( {method: 'fql.query',query: 'SELECT pic_big FROM user WHERE uid=".$id."'},function(response) { document.getElementById('userprofile').innerHTML = '<span style=\'cursor:pointer; cursor:hand;\' onclick=openThisProfile(\'".$id."\')><img  src='+response[0].pic_big+' /></span><br/><br/><span style=\'cursor:pointer; cursor:hand;\' onclick=openThisProfile(\'".$id."\')>View ".$name." Profile...</span>'; } ) });";
				echo "nodecounter++;";
			 }
			 echo "for (var i = 0, ii = konneknodes.length; i < ii; i++) {";
				 echo "konneknodes[i].attr({fill: color, stroke: color, 'fill-opacity': 0, 'stroke-width': 2, cursor: 'move'});";
				 echo "konneknodes[i].drag(move, start, up);";
				 echo "if (i === 0) continue;";
				 echo "connections.push(r.connection(konneknodes[0], konneknodes[i], '#fff'));";
			 echo "}";
		 echo "};";
       echo "</script>";
   }
?>
</body>
</html>