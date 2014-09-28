var UseSkill = function() {

	var txt;
	var m_callback = null;

	function init() {
		$("#useSkillOK").click(sayYes);
		$("#useSkillNO").click(sayNo);
		hideView(0);
	}

	function hideView(time) {
		TweenMax.to($("#useSkillConfirm"), time, {
			opacity : 0,
			display : "none"
		});
	}

	function showView(txt, callback) {
		m_callback = callback;
		$("#useSkillTxt").text(txt);
		TweenMax.to($("#useSkillConfirm"), 0.2, {
			opacity : 1,
			display : "inline"
		});
	}

	function sayYes() {
		hideView(0.2);
		if (m_callback) {
			m_callback();
		}
		m_callback = null;
	}

	function sayNo() {
		hideView(0.2);
	}

	return {
		"init" : init,
		"show" : showView
	}

}();

