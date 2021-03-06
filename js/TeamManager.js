var TeamManager = function() {
	var selectedRolesArray = new Array();
	var selectedRolesDiv = new Array(6);
	var imgidroleidmap = new Array();

	var monster;

	function init() {
		var plyaerLevelDiv = createDiv($("#teamView")[0], "playerlevel", ["playerlevel", "transparent_green"]);
		//plyaerLevelDiv.innerHTML = "LV 99";

		var playerNameDiv = createDiv($("#teamView")[0], "playername", ["playername", "transparent_green"]);
		//playerNameDiv.innerHTML = "小智";

		var playerCashDiv = createDiv($("#teamView")[0], "playercash", ["playercash", "playeresource", "transparent_green"]);

		createImg(playerCashDiv, "iocn_resource", "image/icon_cash.png", ["icon_resource"]);
		var cashResourceDiv = createDiv(playerCashDiv, "value", ["resource_value", "transparent_green"]);
		//cashResourceDiv.innerHTML = 1234567;

		var playerMoneyDiv = createDiv($("#teamView")[0], "playermoney", ["playermoney", "playeresource", "transparent_green"]);

		createImg(playerMoneyDiv, "iocn_resource", "image/icon_money.png", ["icon_resource"]);
		var moneyResourceDiv = createDiv(playerMoneyDiv, "value", ["resource_value", "transparent_green"]);
		//moneyResourceDiv.innerHTML = 1234567;

		var stageDataDiv = createDiv($("#teamView")[0], "stageDataDiv", ["stagedata", "transparent_green"]);

		createDiv(stageDataDiv, "stagename", ["stagename", "transparent_green"]);
		var bossimgDiv = createDiv(stageDataDiv, "bossimgDiv", ["bossimgDiv"]);
		bossimgDiv.onclick = showMonster;
		createImg(bossimgDiv, "bossimg", undefined, ["bossimg", "transparent_green"]);

		selectedRolesDiv[0] = createDiv($("#teamView")[0], "selected_role_0", ["selected_role", "selected_role_0", "transparent_green"]);
		var roleImg = createImg(selectedRolesDiv[0], "selected_role_0_img", undefined, ["selected_icon_role"]);
		//roleImg.setAttribute("ondragstart", "TeamManager.drag(event)");
		//selectedRolesDiv[0].setAttribute("ondrop", "TeamManager.drop(event)");
		//selectedRolesDiv[0].setAttribute("ondragover", "TeamManager.allowDrop(event)");
		$("#selected_role_0").droppable({
			drop : function(event, ui) {
				whenJqueryDropped($(this), ui.draggable[0]);
			}
		});

		selectedRolesDiv[1] = createDiv($("#teamView")[0], "selected_role_1", ["selected_role", "selected_role_1", "transparent_green"]);
		var roleImg = createImg(selectedRolesDiv[1], "selected_role_1_img", undefined, ["selected_icon_role"]);
		//roleImg.setAttribute("ondragstart", "TeamManager.drag(event)");
		//selectedRolesDiv[1].setAttribute("ondrop", "TeamManager.drop(event)");
		//selectedRolesDiv[1].setAttribute("ondragover", "TeamManager.allowDrop(event)");
		$("#selected_role_1").droppable({
			drop : function(event, ui) {
				whenJqueryDropped($(this), ui.draggable[0]);
			}
		});

		selectedRolesDiv[2] = createDiv($("#teamView")[0], "selected_role_2", ["selected_role", "selected_role_2", "transparent_green"]);
		var roleImg = createImg(selectedRolesDiv[2], "selected_role_2_img", undefined, ["selected_icon_role"]);
		//roleImg.setAttribute("ondragstart", "TeamManager.drag(event)");
		//selectedRolesDiv[2].setAttribute("ondrop", "TeamManager.drop(event)");
		//selectedRolesDiv[2].setAttribute("ondragover", "TeamManager.allowDrop(event)");
		$("#selected_role_2").droppable({
			drop : function(event, ui) {
				whenJqueryDropped($(this), ui.draggable[0]);
			}
		});

		selectedRolesDiv[3] = createDiv($("#teamView")[0], "selected_role_3", ["selected_role", "selected_role_3", "transparent_green"]);
		var roleImg = createImg(selectedRolesDiv[3], "selected_role_3_img", undefined, ["selected_icon_role"]);
		//roleImg.setAttribute("ondragstart", "TeamManager.drag(event)");
		//selectedRolesDiv[3].setAttribute("ondrop", "TeamManager.drop(event)");
		//selectedRolesDiv[3].setAttribute("ondragover", "TeamManager.allowDrop(event)");
		$("#selected_role_3").droppable({
			drop : function(event, ui) {
				whenJqueryDropped($(this), ui.draggable[0]);
			}
		});

		selectedRolesDiv[4] = createDiv($("#teamView")[0], "selected_role_4", ["selected_role", "selected_role_4", "transparent_green"]);
		var roleImg = createImg(selectedRolesDiv[4], "selected_role_4_img", undefined, ["selected_icon_role"]);
		//roleImg.setAttribute("ondragstart", "TeamManager.drag(event)");
		//selectedRolesDiv[4].setAttribute("ondrop", "TeamManager.drop(event)");
		//selectedRolesDiv[4].setAttribute("ondragover", "TeamManager.allowDrop(event)");
		$("#selected_role_4").droppable({
			drop : function(event, ui) {
				whenJqueryDropped($(this), ui.draggable[0]);
			}
		});

		selectedRolesDiv[5] = createDiv($("#teamView")[0], "selected_role_5", ["selected_role", "selected_role_5", "transparent_green"]);
		var roleImg = createImg(selectedRolesDiv[5], "selected_role_5_img", undefined, ["selected_icon_role"]);
		//roleImg.setAttribute("ondragstart", "TeamManager.drag(event)");
		//selectedRolesDiv[5].setAttribute("ondrop", "TeamManager.drop(event)");
		//selectedRolesDiv[5].setAttribute("ondragover", "TeamManager.allowDrop(event)");
		$("#selected_role_5").droppable({
			drop : function(event, ui) {
				whenJqueryDropped($(this), ui.draggable[0]);
			}
		});

		var teamRolesViewDiv = createDiv($("#teamView")[0], "role_area", ["role_area", "transparent_green"]);

		var temp = createDiv(teamRolesViewDiv, undefined, ["scrollbar"]);
		temp = createDiv(temp, undefined, ["track"]);
		temp = createDiv(temp, undefined, ["thumb"]);
		temp = createDiv(temp, undefined, ["end"]);
		temp = createDiv(teamRolesViewDiv, undefined, ["viewport"]);
		temp = createDiv(temp, undefined, ["overview"]);

		var menuDiv = createDiv($("#teamView")[0], "menu", ["menu", "transparent_green"]);
		temp = createImg(menuDiv, "btn_start", "image/icon_go.png", ["btn_start", "transparent_green"]);
		temp.onclick = TeamManager.start;
		temp = createImg(menuDiv, "btn_return", "image/icon_return.png", ["btn_return", "transparent_green"]);
		temp.onclick = TeamManager.back;

	}

	function start() {

		var role_0_id = imgidroleidmap[selectedRolesArray["selected_role_0_img"]];
		var role_1_id = imgidroleidmap[selectedRolesArray["selected_role_1_img"]];
		var role_2_id = imgidroleidmap[selectedRolesArray["selected_role_2_img"]];
		var role_3_id = imgidroleidmap[selectedRolesArray["selected_role_3_img"]];
		var role_4_id = imgidroleidmap[selectedRolesArray["selected_role_4_img"]];
		var role_5_id = imgidroleidmap[selectedRolesArray["selected_role_5_img"]];

		if (role_0_id == undefined || role_1_id == undefined || role_2_id == undefined || role_3_id == undefined || role_4_id == undefined || role_5_id == undefined) {
			alert("not all role selected");
		} else {
			console.log("start " + role_0_id + " " + role_1_id + " " + role_2_id + " " + role_3_id + " " + role_4_id + " " + role_5_id);
			Monster.nextLayer();
			Game.setRole([role_0_id, role_1_id, role_2_id, role_3_id, role_4_id, role_5_id]);
			Game.roundInit();
			Main.toGameView();
		}
	}

	function back() {
		//alert("return");
		Main.toMissionView();
	}

	function allowDrop(ev) {
		ev.preventDefault();
	}

	function drag(ev) {
		ev.dataTransfer.setData("text", ev.target.id);
		console.log(ev.target.id);
	}

	function whenJqueryDropped(targetDivs, srcImg) {
		var targetImgId = targetDivs.find("img")[0].id;
		targetDivs.find("img")[0].src = srcImg.src;
		targetDivs.find("img")[0].setAttribute("draggable", false);

		var oldImgId = selectedRolesArray[targetImgId];
		if (oldImgId != undefined) {
			console.log("old:" + oldImgId);
            enableRoleViewJQueryDrag(oldImgId)
		}
        disableRoleViewJQueryDrag(srcImg.id);
		selectedRolesArray[targetImgId] = srcImg.id;
		console.log(targetImgId + ":" + srcImg.id);
	}

	function drop(ev) {
		//jscript version
		ev.preventDefault();
		var data = ev.dataTransfer.getData("text");
		var srcImg = document.getElementById(data);
		var targetImgId = undefined;

		if ($("#"+ev.target.id)[0].tagName == "DIV") {
			targetImgId = $("#"+ ev.target.id + "> img")[0].id;
			$("#"+ ev.target.id + "> img")[0].src = srcImg.src;
			$("#"+ ev.target.id + "> img")[0].setAttribute("draggable", false);
		} else {
			targetImgId = $("#"+ ev.target.id)[0].id;
			$("#"+ ev.target.id)[0].src = srcImg.src;
			$("#"+ ev.target.id)[0].setAttribute("draggable", false);
		}

		var oldImgId = selectedRolesArray[targetImgId];
		if (oldImgId != undefined) {
			console.log("old:" + oldImgId);
			var oldImg = document.getElementById(oldImgId);
			oldImg.setAttribute("draggable", true);
			oldImg.style.opacity = "1";
		}
		srcImg.setAttribute("draggable", false);
		srcImg.style.opacity = "0.5";
		selectedRolesArray[targetImgId] = data;
		console.log(targetImgId + ":" + data);
	}

	function createRoleView(parentdiv, data) {

		var imgId = undefined;
		var imgSrc = undefined;
		if (data != undefined) {
			imgId = "role_" + data.id + "_img";
			imgSrc = "image/" + data.fightPic;
		}

		var roleViewDiv = createDiv(parentdiv, undefined, ["role", "transparent_green"]);

		var roleImg = createImg(roleViewDiv, imgId, imgSrc, ["icon_role"]);
		roleImg.setAttribute("draggable", false);
		$(roleImg).draggable({
			helper : function() {
				return $(this).clone().appendTo('body').show();
			}
		});
        
		//roleImg.setAttribute("ondragstart", "TeamManager.drag(event)");
		roleImg.onclick = showTips;
		return roleViewDiv;
	}

	function showTips(e) {
		CardTips.setRole(imgidroleidmap[e.target.id]);
	}

	function createImg(parentdiv, imgId, imgSrc, divClass) {
		var newImg = document.createElement("img");
		if (imgId != undefined) {
			var imgIdName = imgId;
			newImg.setAttribute('id', imgIdName);
		}
		if (imgSrc != undefined) {
			newImg.src = imgSrc;
		}
		newImg.className = divClass[0];
		for (var i = 1; i < divClass.length; i++) {
			newImg.className += " " + divClass[i];
		}

		parentdiv.appendChild(newImg);

		return newImg;
	}

	function createDiv(parentdiv, divId, divClass) {
		var newdiv = document.createElement("div");
		if (divId != undefined) {
			var divIdName = divId;
			newdiv.setAttribute('id', divIdName);
		}
		newdiv.className = divClass[0];
		for (var i = 1; i < divClass.length; i++) {
			newdiv.className += " " + divClass[i];
		}

		parentdiv.appendChild(newdiv);

		return newdiv;
	}

	function updatePlayerData() {
		//        $("#playerlevel")[0].innerHTML = "LV " + playerLevel;
		//        $("#playername")[0].innerHTML = playername;
		//        $("#playercash > #value")[0].innerHTML = playerCash;
		//        $("#playerMoney > #value")[0].innerHTML = playerMoney;
	}

	function createTeamRoles(roleArray) {
		var temp = $("#teamView > #role_area > .viewport > .overview");

		temp.empty();
		imgidroleidmap.length = 0;

        roleArray.sort(function(a,b)
        {
            var dataA = RoleData.getData(a);
            var dataB = RoleData.getData(b);
            return dataA.index - dataB.index;
        }
        );
        
		for (var i = 0; i < roleArray.length; i++) {
			var data = RoleData.getData(roleArray[i]);

			createRoleView(temp[0], data);

			var imgId = "role_" + data.id + "_img";
			imgidroleidmap[imgId] = data.id;
		}
        
		var role_0_id = selectedRolesArray["selected_role_0_img"];
		var role_1_id = selectedRolesArray["selected_role_1_img"];
		var role_2_id = selectedRolesArray["selected_role_2_img"];
		var role_3_id = selectedRolesArray["selected_role_3_img"];
		var role_4_id = selectedRolesArray["selected_role_4_img"];
		var role_5_id = selectedRolesArray["selected_role_5_img"];
        disableRoleViewJQueryDrag(role_0_id);
        disableRoleViewJQueryDrag(role_1_id);
        disableRoleViewJQueryDrag(role_2_id);
        disableRoleViewJQueryDrag(role_3_id);
        disableRoleViewJQueryDrag(role_4_id);
        disableRoleViewJQueryDrag(role_5_id);
        
        
        

		$('#role_area').tinyscrollbar();
	}
    
    function enableRoleViewJQueryDrag(id)
    {
        if(id)
        {
            $("#" + id).draggable('enable');
            $("#" + id).css("opacity", "1");
        }         
    }    
    
    function disableRoleViewJQueryDrag(id)
    {
        if(id)
        {
            $("#" + id).draggable('disable');
            $("#" + id).css("opacity", "0.5");
        }         
    }
    

	function createTeamRolesFromRoleData() {

        var roleArray = [];
        
		var roleDataAray = RoleData.playerList;
		for (var entry in roleDataAray) {
            roleArray.push(entry);
		}

        createTeamRoles(roleArray);
	}
    
	function createTeamRolesFromCookies() {

        var roleArray = CookiesAdapter.getRoles();
        
        createTeamRoles(roleArray);
	}    
    

    function createTeamRolesFromData() {
        createTeamRolesFromCookies();     
    }
    
	function setMission(missionID) {

		var stageNameDiv = $("#teamView > #stageDataDiv > #stagename")[0];
		var stageBossImg = $("#teamView > #stageDataDiv > #bossimgDiv > #bossimg")[0];

		var missionData = MissionData.getData(missionID);

		stageNameDiv.innerHTML = missionData.name;
		monster = RoleData.getData(missionData.mosterLayer[missionData.mosterLayer.length - 1]);
		stageBossImg.src = "image/" + monster.cardPic;
		/*missionData.
		 stageBossImg.src =*/
	}

	function showMonster() {
		CardTips.setRole(monster.id);
	}

	return {
		"init" : init,
		"allowDrop" : allowDrop,
		"drag" : drag,
		"drop" : drop,
		"start" : start,
		"back" : back,
		"createTeamRoles" : createTeamRoles,
		"setMission" : setMission,
        "createTeamRolesFromData" : createTeamRolesFromData
	}

}();
