function GraphCore() {
	this.colordict = {};
}

var graphcore = new GraphCore();

GraphCore.prototype.drawChart = function(cfg) {
	  $(cfg.container).append('<div id="highchart_graph"></div>');
	  var gp = new window[cfg.type]();
	  gp.set('container', '#highchart_graph');
	  gp.title = cfg.key;
	  gp.info = cfg.info;
	  gp.explanation = cfg.explanation;
	  gp.addData(cfg.values);
	  gp.draw();
	  $('#page-header strong').empty().append(gp.title);
	  $('#site-menu h4').empty().append(gp.explanation.heading);
	  $('#site-menu p').empty().append(gp.explanation.text);
};

function DiscretBar() {
	this.container = null;
	this.title = null;
	this.subtitle = null;
	this.series = [];
}

DiscretBar.prototype.set = function(field, val) {
	this[field] = val;
	return this;
};

DiscretBar.prototype.addData = function(values) {
	for (var i in values) {
		var val = values[i]
		this.series.push({ name: val.label, y: val.value * 1 });
	}
};

DiscretBar.prototype.draw = function() {
	var me = this;

    $(me.container).highcharts({
        chart: {
            backgroundColor: '#f9f7f6',
			type: 'column' },
        title: { text: me.info },
        xAxis: { type: 'category' },
        yAxis: { min: 0, title: { text: 'Percent' } },
		legend: { enabled: false },
	    tooltip: {
			headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
			pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b><br/>'
		},
		plotOptions: {
			series: {
				borderWidth: 0,
				dataLabels: {
					enabled: true,
					format: '{point.y:.1f}%'
				}
			}
		},
        series: [{
			name: me.title,
            colorByPoint: true,
			data: me.series
		}]
    });
};


function Pie() {
	this.container = null;
	this.title = null;
	this.subtitle = null;
	this.series = [];
}

Pie.prototype.set = function(field, val) {
	this[field] = val;
	return this;
};

Pie.prototype.addData = function(values) {
	for (var i in values) {
		var val = values[i]
		this.series.push([ val.label, val.value * 1 ]);
	}
};

Pie.prototype.draw = function() {
	var me = this;
    $(me.container).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
		credits: {
			enabled: false,
		},
        tooltip: { pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>' },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: me.title,
            data: me.series
		}]
    });
};

function SimpleLine(){
	this.container = null;
	this.title = null;
	this.subtitle = null;
	this.series = [];
	this.xtext = 'Date';
	this.ytext = 'Percentage';
}

SimpleLine.prototype.set = function(field, val) {
	this[field] = val;
	return this;
};

SimpleLine.prototype.addData = function(values) {
	for (var i in values) {
		var val = values[i]
		this.series.push({ name: val.key, data:  val.values });
	}
};


SimpleLine.prototype.draw = function() {
	var me = this;
	$(me.container).highcharts({
		chart: {
            backgroundColor: '#f9f7f6',
		},
		title: { text: me.info },
		subtitle: { text: me.subtitle },
		xAxis: {
			type: 'datetime',
			title: { text: me.xtext },
			gridLineWidth: 1,
			dateTimeLabelFormats: { // don't display the dummy year
                month: '%b, %Y',
                year: '%Y'
            }
		},
		yAxis: {
			title: { text: me.ytext },
			min: 0,
            gridLineWidth: 1,
		},
		plotOptions: {
			spline: {
				marker: {
					enabled: true
				}
			}
		},
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b, %Y}: {point.y:.2f}%'
        },
		series: me.series
	});
};


function GroupedMultiBar() {
	this.container = null;
	this.title = null;
	this.subtitle = null;
	this.series = [];
}

GroupedMultiBar.prototype.set = function(field, val) {
	this[field] = val;
	return this;
};

GroupedMultiBar.prototype.addData = function(d) {

	this.categories = d.categories;
	this.series = d.data;
	console.log(this.series);
};



GroupedMultiBar.prototype.draw = function() {

	var me = this;
    $(me.container).highcharts({
        chart: {
            backgroundColor: '#f9f7f6',
            type: 'column'
        },
        title: { text: me.info },
        xAxis: {
            categories: me.categories
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Percentage'
            }
        },
        tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f}%</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0.2,
                borderWidth: 0
            }
        },
        series: me.series
	});
};

