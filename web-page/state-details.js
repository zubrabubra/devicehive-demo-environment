var stateFromQuery = "";

function runChartForFirstTime() {
        window.temperatureArray = new Array();
        window.dewPointArray = new Array();
        window.humidityArray = new Array();
                var tempVal = 0;
                var dewVal = 0;
                var humidityVal = 0;
        var limit = 60 * 1,
            duration = 750,
            now = new Date(Date.now() - duration)

        var width = 485,
            height = 200

        var groups = {
            temperature: {
                value: 0,
                color: '#C80000',
                data: d3.range(limit).map(function() {
                    return 0
                })
            },
                        dewPoint: {
                value: 0,
                color: '#0093C8',
                data: d3.range(limit).map(function() {
                    return 0
                })
            }
        }
        var groups2 = {
                        humadity: {
                value: 0,
                color: '#00AA61',
                data: d3.range(limit).map(function() {
                    return 0
                })
            }
        }

      var x = d3.time.scale()
            .domain([now - (limit - 2), now - duration])
            .range([0, width])

        var y = d3.scale.linear()
            .domain([55, 88])
            .range([height, 0])

                var y2 = d3.scale.linear()
            .domain([54, 64])
            .range([height, 0])

                function make_y_axis() {
                        return d3.svg.axis()
                                .scale(y)
                                .orient("left")
                                .ticks(5)
                }

                function make_y2_axis() {
                        return d3.svg.axis()
                                .scale(y2)
                                .orient("left")
                                .ticks(5)
                }

        var line = d3.svg.line()
            .interpolate('basis')
            .x(function(d, i) {
                return x(now - (limit - 1 - i) * duration)
            })
            .y(function(d) {
                return y(d)
            })
                var line2 = d3.svg.line()
            .interpolate('basis')
            .x(function(d, i) {
                return x(now - (limit - 1 - i) * duration)
            })
            .y(function(d) {
                return y2(d)
            })


        var svg = d3.select('.graph').append('svg')
            .attr('class', 'chart')
            .attr('width', width)
            .attr('height', height)
                svg.append("rect")
                        .attr("width", "100%")
                        .attr("height", "100%")
                        .attr("fill", "white");

                svg.append("g")
                        .attr("class", "grid")
                        .call(make_y_axis()
                                .tickSize(-width, 0, 0)
                                .tickFormat("")
        )
                svg.append('g')
                        .attr('class', 'y axis')
            .attr('transform', 'translate(0,0)')
            .call(y.axis = d3.svg.axis().scale(y).orient('right').ticks(4))
                svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (height) + ')')
            .call(x.axis = d3.svg.axis().scale(x).orient('bottom').ticks(0))


       var svg2 = d3.select('.graph2').append('svg')
            .attr('class', 'chart')
            .attr('width', width)
            .attr('height', height)
                svg2.append("rect")
                        .attr("width", "100%")
                        .attr("height", "100%")
                        .attr("fill", "white");

                svg2.append("g")
                        .attr("class", "grid")
                        .call(make_y2_axis()
                                .tickSize(-width, 0, 0)
                                .tickFormat("")
        )
                svg2.append('g')
                        .attr('class', 'y axis')
            .attr('transform', 'translate(0,0)')
            .call(y2.axis = d3.svg.axis().scale(y2).orient('right').tickValues([56,58,60,62]))
                svg2.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + (height) + ')')
            .call(x.axis = d3.svg.axis().scale(x).orient('bottom').ticks(0))

        var paths = svg.append('g');
                var paths2 = svg2.append('g');

        for (var name in groups) {
            var group = groups[name]
            group.path = paths.append('path')
                .data([group.data])
                .attr('class', name + ' group')
                .style('stroke', group.color)
        }
                for (var name in groups2) {
            var group = groups2[name]
            group.path = paths2.append('path')
                .data([group.data])
                .attr('class', name + ' group')
                .style('stroke', group.color)
        }

                function formatDecimal(decimal){
                        return parseFloat(Math.round(decimal * 100) / 100).toFixed(0);
                }


       function tick() {
                        if(temperatureArray.length != 0){tempVal = temperatureArray.shift(); temperatureArray =[];};
                        if(dewPointArray.length != 0){dewVal = dewPointArray.shift(); dewPointArray=[];};
                        if(humidityArray.length != 0){humidityVal = humidityArray.shift(); humidityArray=[];};
                        now = new Date()

                                // Add new values
                                for (var name in groups) {
                                        var group = groups[name];
                                        if(name == 'dewPoint'){
                                                group.data.push(dewVal);
                                                $('#dewVal').html(formatDecimal(dewVal));
                                        }else if(name == 'temperature'){
                                                group.data.push(tempVal);
                                                $('#tempVal').html(formatDecimal(tempVal)+' F');
                                        }
                                        group.path.attr('d', line);
                                }
                                for (var name in groups2) {
                                        var group = groups2[name];
                                                group.data.push(humidityVal);
                                                $('#humidityVal').html(formatDecimal(humidityVal)+' %');
                                        group.path.attr('d', line2);
                                }

                                // Shift domain
                                x.domain([now - (limit - 2) * duration, now - duration])
                                // Slide paths left
                                paths.attr('transform', null)
                                        .transition()
                                        .duration(duration)
                                        .ease('linear')
                                        .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
                                        .each('end', null)
                                paths2.attr('transform', null)
                                        .transition()
                                        .duration(duration)
                                        .ease('linear')
                                        .attr('transform', 'translate(' + x(now - (limit - 1) * duration) + ')')
                                        .each('end', tick)

                                // Remove oldest data point from each group
                                for (var name in groups) {
                                        var group = groups[name]
                                        group.data.shift()
                                }
                                for (var name in groups2) {
                                        var group = groups2[name]
                                        group.data.shift()
                                }
        }

	StateWebSocketClient.init();
	tick();
}
