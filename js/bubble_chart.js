/**
 * Purpose:
 * Generate a reusable bubble chart
 * 
 * Instantiate the settings before rendering the bubble chart
 * Generate a reusable bubble chart using d3.v4.js on a dataset loaded through D3.
 * 
 * Original Author: Deborah Mesquita
 * Source: 
 * 
 * {@link https://bl.ocks.org/dmesquita/37d8efdb3d854db8469af4679b8f984a Deborah Mesquita's block}
 *	
 * {@link https://medium.freecodecamp.org/a-gentle-introduction-to-d3-how-to-build-a-reusable-bubble-chart-9106dc4f6c46 Tutorial and explanation}
 * 
 * {@link https://taylorchasewhite.github.io/babyNames/ Live demo}
 * @author Deborah Mesquita
 * @author Taylor White <whitetc2@gmail.com>
 * @since  07.04.17
 * @summary  Generate a reusable bubble chart
 * @requires d3.v4.js
 * @class
 * 
 * @example
 * var chart = bubbleChart(); // instantiate the chart
 * 
 * // update settings
 * chart.width(850).height(850).minRadius(7).maxRadius(55).forceApart(-170); 
 * 
 * // example of chaining
 * chart.columnForColors("Sex").columnForRadius("BirthCount");
 * chart.customColors(["M","F"],["#70b7f0","#e76486"]).showTitleOnCircle(true);
 * chart.title('Most popular baby names in 2016').columnForTitle("Name");
 * chart.unitName("babies");
 * 
 * // load the data and render the chart 
 * d3.select("#divBubbleChart")
 * 	.data(newData)
 * 	.call(chart);
 * 
 * @returns Chart function so that you can render the chart when ready
 */
function bubbleChart() {
	var width = 1000,
	height = 1000,
	marginTop = 96,
	minRadius = 3,
	maxRadius = 8,
	columnForColors = "category",
	columnForTitle = "name",
	columnForRadius = "value",
	forceApart = -5,
	unitName="radius",
	customColors=false,
	customRange,
	customDomain,
	chartSelection,
	chartSVG,
	showTitleOnCircle=false;

	
	function chart(selection) {
		var data = selection.datum();
		chartSelection=selection;
		var div = selection,
		svg = div.selectAll('svg');
		svg.attr('width', width).attr('height', height);
		chartSVG=svg;
	

		var simulation = d3.forceSimulation(data)
			.force("charge", d3.forceManyBody().strength([forceApart]))
			.force("x", d3.forceX())
			.force("y", d3.forceY())
			.on("tick", ticked);

		function ticked(e) {
			node.attr("transform",function(d) {
				return "translate(" + [d.x+(width / 2), d.y+((height+marginTop) / 2)] +")";
			});
		}

		var colorCircles;
		if (!customColors) {
			colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
		} 
		else {
			
			colorCircles = d3.scaleOrdinal()
			.domain(customDomain)
			.range(customRange);

		}
	
		var minRadiusDomain = d3.min(data, function(d) {
			return +d[columnForRadius];
		});
		var maxRadiusDomain = d3.max(data, function(d) {
			return +d[columnForRadius];
		});
		var scaleRadius = d3.scaleLinear()
		.domain([minRadiusDomain, maxRadiusDomain])
		.range([minRadius, maxRadius])

		var node = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("g")
		.attr('transform', 'translate(' + [width / 2, height / 2] + ')')
		.style('opacity',1);
			
		node.append("circle")
		.attr("id",function(d,i) {
			return i;
		})
		.attr('r', function(d) {
			return scaleRadius(d[columnForRadius]);
		})
		.style("fill", function(d) {
			if(d[columnForColors] = "t"){
				return "#f86302";
			}else if(d[columnForColors] = "g"){
				return "ff2a672";
			}else if(d[columnForColors] = "d"){
				return "#ff4200";
			}
			//return colorCircles(d[columnForColors]);
		})

	}


	chart.width = chartWidth;
	chart.height = chartHeight;
	chart.columnForColors = chartColForColors;
	chart.columnForRadius = chartColForRadius;
	chart.columnForTitle = chartColForTitle;
	chart.minRadius = chartMinRadius;
	chart.maxRadius = chartMaxRadius;
	chart.forceApart = chartForceApart;
	chart.unitName = chartUnitName;
	chart.customColors = chartCustomColors;
	chart.showTitleOnCircle = chartShowTitleOnCircle;
	chart.title=chartTitle;
	chart.remove = chartRemove;

	/**
	 * Get/set the height of the chart
	 * Use 'chart.width' to get or set. 
	 * @example
	 * chart.columnForColors(960);	// Sets the width of the SVG to 960
	 * chart.columnForColors();	// returns 960
	 * 
	 * @public
	 * @param {number} [value] - The width of the chart 
	 * @returns function - Chart, allowing chaining of commands
	 */
	function chartWidth(value) {
		if (!arguments.length) {
			return width;
		}
		width = value;
		return chart;
	};

	function chartHeight(value) {
		if (!arguments.length) {
			return height;
		}
		height = value;
		marginTop=0.05*height;
		return chart;
	};

	function chartColForColors(value) {
		if (!arguments.length) {
			return columnForColors;
		}
		columnForColors = value;
		return chart;
	};
	
	function chartColForTitle(value) {
		if (!arguments.length) {
			return columnForTitle;
		}
		columnForTitle = value;
		return chart;
	};


	function chartColForRadius (value) {
		if (!arguments.length) {
			return columnForRadius;
		}
		columnForRadius = value;
		return chart;
	};
	

	function chartMinRadius(value) {
		if (!arguments.length) {
			return minRadius;
		}
		minRadius = value;
		return chart;
	};
	
	function chartMaxRadius(value) {
		if (!arguments.length) {
			return maxRadius;
		}
		maxRadius = value;
		return chart;
	};
	

	function chartUnitName(value) {
		if (!arguments.length) {
			return unitName;
		}
		unitName = value;
		return chart;
	};
	

	function chartForceApart(value) {
		if (!arguments.length) {
			return forceApart;
		}
		forceApart = value;
		return chart;
	};
	
	
	function chartShowTitleOnCircle(value) {
		if (!arguments.length) {
			return showTitleOnCircle;
		}
		showTitleOnCircle = value;
		return chart;
	};
	
	
	function chartCustomColors(domain,range) {
		customColors=true;
		customDomain=domain;
		customRange=range;
		return chart;
	};

	function chartTitle(value) {
		if (!arguments.length) {
			return title;
		}
		title = value;
		return chart;
	}
	
	function chartRemove(callback) {
		chartSVG.selectAll("text")
		.style("opacity",1)
		.transition()
		.duration(500)
		.style("opacity", "0")
		.remove();	
		if (!arguments.length) {	
			chartSVG.selectAll("g")
			.style("opacity",1)
			.transition()
			.duration(500)
			.style("opacity", "0")
			.remove();		
		}
		else {			
			chartSVG.selectAll("g")
			.style("opacity",1)
			.duration(500)
			.style("opacity", "0")
			.remove()
			.on("end", callback);
		}
		return chart;
	}
	
	return chart;
}
