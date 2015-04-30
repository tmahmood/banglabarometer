function Visualizer(datafile, container, sepchar) {
}

Visualizer.prototype.loadData = function(datafile, graph) {
	if (datafile == undefined) {
		datafile = this.datafile;
	}

	var me = this;
	me.questions_cleaned = [];

	$.getJSON(datafile, function(jdata) {

		me.data_points = jdata;
		me.groups = [];

		for (var ky in jdata) {
			if (ky == 0) {
				me.participants = jdata[ky].participants;
				me.scope = jdata[ky].scope;
				me.moe = jdata[ky].moe;
			}
			var grp = jdata[ky].group;
			if (grp != undefined) {
				if (me.groups.indexOf(grp) < 0) {
					me.groups.push(grp);
				}
			} else {
				jdata[ky]['group'] = 'No Group';
				if (me.groups.indexOf("No Group") < 0) {
					me.groups.push('No Group');
				}
			}
			me.questions_cleaned.push([jdata[ky].key, jdata[ky].type, jdata[ky].group]);
		}

		me.makeSideMenu();
		me.setGroupMenu();
		me.loading = false;

		if (graph != '' && graph != undefined) {
			var gtxt = '#' + graph;
			if (me.groups.length > 1) {
				var cls = $(gtxt)
								.parent()
								.attr('class')
								.split(' ')
								.shift();
				var gcls = '#gm_' + cls;
				$(gcls + ' a').trigger('click');
			}
			$(gtxt).trigger('click');

		} else {
			if (me.groups.length == 1) {
				$('#questionlist li a').first().trigger('click');
			} else {
				$('#groupmenu select').trigger('change');
			}
		}

		var html = []
		if (me.moe != undefined) {
			html.push('<span><b>Margin of Error:</b> ' + me.moe);
		}

		if (me.participants != undefined) {
			html.push('<b>Participants:</b> ' + me.participants + '</span>');
		}


		$('#surveyinfo').html('<div><strong>' + me.scope + '</strong></div>' + html.join(', '));
	});

	return this;
};

Visualizer.prototype.onPageLoad = function() {
	this.width = $('main').width();
	this.height = $(document).height();
	return this;
};

Visualizer.prototype.makeSideMenu = function() {
	this.drawQuestionList();
	$('svg').text("");
	return this;
}

Visualizer.prototype.drawQuestionList = function() {

	var me = this;
	$('#questionlist').empty();

	for (var i = 0, len = me.questions_cleaned.length; i < len; i++) {
		var d = me.questions_cleaned[i];
		var cn = d[2].replace(/ /g, '_') + ' list-group-item';
		var tid =  i + "_" + d[1];
		var li = createElement({ element: 'li', class: cn });
		var lk = createElement({ element: 'a', id: tid,
									class: 'selgraphtodisplay',
									attr: { href: "#" + tid },
									text: d[0] });
		$(li).append(lk)
		$('#questionlist').append(li);
	}
};

Visualizer.prototype.setGroupMenu = function() {
	var me = this;

	$('#groupmenu').empty();
	if (me.groups.length <= 1) {
		return;
	}

	if ($('#groupmenu select').length == 0) {
		$('#groupmenu').append('<select></select>');
	} else {
		$('#groupmenu select').empty();
	}

	for (var i = 0, len = me.groups.length; i < len; i++) {
		var d = me.groups[i];
		var cn = d.replace(/ /g, '_');
		var li = createElement({ element: 'option', prop: { value: cn },
								class: 'gmenu_items', text: d });
		$('#groupmenu select').append(li);
	}

}


Visualizer.prototype.onGraphToDisplayClick = function() {

	var me = this;
	$(document).on('click', '.selgraphtodisplay', function(ev){
		ev.preventDefault();

		$('#questionlist li').removeClass('active');
		$(this).parent().addClass('active');


		var dictkey = this.href.split('#').pop().split('_');
		var currentdata = me.data_points[dictkey[0]]

		var h = dictkey.join('_');

		var th = document.location.hash.split(',').shift();
		document.location.hash = th + ',' + h;

		graphcore.drawChart(dictkey[1], currentdata , me);

		$(me.container + ' h3').text($(this).text());

		var cnt = me.container + ' p#gp_details';
		$(cnt).empty();
		if (currentdata['description']!= undefined) {
			$(cnt).append(currentdata.description);
		}

		var date = currentdata['date'];
		var cnt = me.container + ' p#gp_date';
		$(cnt).empty();
		if (date != undefined) {
			$(cnt).append(date);
		}
	});
};

Visualizer.prototype.onGroupMenuClick = function() {
	$(document).on('change', '#groupmenu select', function(ev){
			var toshow = $(this).find(':selected').val();
			$('#questionlist li').hide();
			$('#questionlist .' + toshow).show();
			$('#questionlist li:visible a').first().trigger('click');
		}
	);
};

