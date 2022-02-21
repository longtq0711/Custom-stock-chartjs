// const { date } = require("gulp-util");

var barCount = 100;
var initialDateStr = '28 Jan 2022 00:00 Z';

var ctx = document.getElementById('chart').getContext('2d');
ctx.canvas.width = 2000;
ctx.canvas.height = 500;

var barData = 	readData($('#stock :selected').val());

function lineData() { return barData.map(d => { return { x: d.x, y: d.c} }) };
var globalData = [];

var chart = new Chart(ctx, {
	type: 'candlestick',
	data: {
		datasets: [{
			label: 'CHRT - Chart.js Corporation',
			data: barData
		}]
	},
	plugins: [{
        beforeDraw: function() {
		ctx.fillStyle = "white";
		// ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
		}
    }]
});

var getRandomInt = function(max) {
	return Math.floor(Math.random() * Math.floor(max));
};

function randomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

function randomBar(date, lastClose) {
	var open = 29;
	var close = 29;
	var high = 43;
	var low = 17;
	return {
		x: date.valueOf(),
		o: open,
		h: high,
		l: low,
		c: close
	};

}
function getData(data) {
	result = [];
	data.forEach(content => {
		element = [];
		content.forEach((value, index) => {
			element[index] = value.split(':')[1]
			
		})
		var date = luxon.DateTime.fromRFC2822(convertDate(element[0]));
		object = {
			x: date.valueOf(),
			o: element[2],
			h: element[3],
			l: element[4],
			c: element[1]
		};
		result.push(object);
	});
	console.log(result);
	barData = result;
}
function readData(filename) {
    $.ajax({
        type: "GET",
        url: "data/" + filename + ".csv",
        dataType: "text",
        success: function(data) {getData(processData(data));}
    });		
}

function processData(allText) {
    var allTextLines = allText.split(/\r\n|\n/);
    var headers = allTextLines[0].split(',');
    var lines = [];

    for (var i=1; i<allTextLines.length; i++) {
        var data = allTextLines[i].split(',');
        if (data.length == headers.length) {

            var tarr = [];
            for (var j=0; j<headers.length; j++) {
                tarr.push(headers[j]+":"+data[j]);
            }
            lines.push(tarr);
        }
    }
	console.log(lines);
	return lines;
}

function convertDate(date) {
	var  months = {
		"01": "Jan", 
		"02": "Feb", 
		"03": "Mar", 
		"04": "Apr", 
		"05": "May", 
		"06": "Jun", 
		"07": "Jul", 
		"08": "Aug", 
		"09": "Sep", 
		"10": "Oct", 
		"11": "Nov", 
		"12": "Dec"
	};
	var split_date = date.split("-");
	var monthName = months[split_date[1]];
	var convertDate = split_date[2] + ' ' + monthName + ' ' + split_date[0] + ' 00:00 Z'
	return convertDate
}
function handleData(data) {
	
	// var data = [randomBar(date, 30)];
	// while (data.length < count) {
	// 	date = date.plus({days: 1});
	// 	if (date.weekday <= 5) {
	// 		data.push(randomBar(date, data[data.length - 1].c));
	// 	}
	// }
	// console.log(data);
	return data;
}

function getRandomData(dateStr, count) {
	var date = luxon.DateTime.fromRFC2822(convertDate("2022-10-28"));
	console.log(date);
	var data = [randomBar(date, 30)];
	while (data.length < count) {
		date = date.plus({days: 1});
		if (date.weekday <= 5) {
			data.push(randomBar(date, data[data.length - 1].c));
		}
	}
	console.log(data);
	return data;
}

var update = function() {
	var dataset = chart.config.data.datasets[0];

	// candlestick vs ohlc
	var type = document.getElementById('type').value;
	dataset.type = type;

	// linear vs log
	// var scaleType = document.getElementById('scale-type').value;
	// chart.config.options.scales.y.type = scaleType;

	// color
	var colorScheme = document.getElementById('color-scheme').value;
	if (colorScheme === 'neon') {
		dataset.color = {
			up: '#01ff01',
			down: '#fe0000',
			unchanged: '#999',
		};
	} else {
		delete dataset.color;
	}

	// border
	var border = document.getElementById('border').value;
	var defaultOpts = Chart.defaults.elements[type];
	if (border === 'true') {
		dataset.borderColor = defaultOpts.borderColor;
	} else {
		dataset.borderColor = {
			up: defaultOpts.color.up,
			down: defaultOpts.color.down,
			unchanged: defaultOpts.color.up
		};
	}

	// mixed charts
	var mixed = document.getElementById('mixed').value;
	if(mixed === 'true') {
		chart.config.data.datasets = [
			{
				label: 'CHRT - Chart.js Corporation',
				data: barData
			},
			{
				label: 'Close price',
				type: 'line',
				data: lineData()
			}	
		]
	}
	else {
		// chart.config.data.datasets = [
		// 	{
		// 		label: 'CHRT - Chart.js Corporation',
		// 		data: barData
		// 	}	
		// ]
		dataset.data = barData;
	}

	// candlestick vs ohlc
	var candle = document.getElementById('candle').value;
	dataset.candle = candle;
	// console.log(dataset);

	chart.update();
};

$('#stock').change(function(){ 
    var value = $(this).val();
	readData(value);
});
document.getElementById('update').addEventListener('click', function() {
	update();
});
document.getElementById('download').addEventListener('click', function() {
	var canvas = document.getElementById("chart");
	var img    = canvas.toDataURL("image/png");
	var a = document.createElement('a');
	a.href = img;
	a.download = $('#stock').val() + '-' + $('#candle').val();
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
});


// document.getElementById('randomizeData').addEventListener('click', function() {
// 	// barData = getRandomData(initialDateStr, barCount);
// 	update();
// });
