var SkillEffect = function() {

	var txt;
	var m_callback = null;

	function init() {
		hideView(0);
	}

	function hideView(time) {
		TweenMax.to($("#skillEffect"), time, {
			opacity : 0,
			display : "none"
		});
		TweenMax.to($("#skillEffectRoleImg"), 0, {
			left : 650,
		});

		TweenMax.to($("#skillEffectTxt"), 0, {
			top : 475,
			opacity : 0,
			display : "none"
		});
	}

	function showView(id) {
		SoundHandler.skill();
		var role = RoleData.getData(id);
		$("#skillEffectRoleImg").attr("src", "image/" + role.fightPic);
		var skill = SkillData.getData(role.skill);
		$("#skillEffectTxt").text(skill.skillName);

		TweenMax.to($("#skillEffect"), 0.2, {
			opacity : 1,
			display : "inline",
		});

		TweenMax.to($("#skillEffectRoleImg"), 0.6, {
			delay : 0.1,
			left : 250,
			ease : Expo.easeOut,
			onComplete : roleMoveLeft
		});

		TweenMax.to($("#skillEffectTxt"), 0.3, {
			top : 455,
			opacity : 1,
			display : "inline"
		});
	}

	function roleMoveLeft() {
		TweenMax.to($("#skillEffectRoleImg"), 0.6, {
			left : -100,
			ease : Expo.easeIn,
			onComplete : roleMoveLeftEnd
		});
	}

	function roleMoveLeftEnd() {
		hideView(0.2);
	}

	return {
		"init" : init,
		"show" : showView
	}

}();

