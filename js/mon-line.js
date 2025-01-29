class LineChart {
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 500,
      containerHeight: _config.containerHeight || 140,
      margin: { top: 10, bottom: 30, right: 10, left: 30 },
    };

    this.data = _data;

    // Call a class function
    this.initVis();
  }

  initVis() {
    console.log("Let's draw a line chart!!");
    let vis = this;

    // Width and height as the inner dimensions of the chart area- as before
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    // Define 'svg' as a child-element (g) from the drawing area and include spaces
    // Add <svg> element (drawing space)
    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left}, ${vis.config.margin.top})`
      );

    // Initialize linear and ordinal scales (input domain and output range)
    vis.yScale = d3
      .scaleLinear()
      .domain(d3.extent(vis.data, (d) => d.cost).reverse())
      .range([0, vis.height]);

    vis.xScale = d3
      .scaleLinear()
      .domain(d3.extent(vis.data, (d) => d.year))
      .range([0, vis.width]);

    // Construct a new ordinal scale with a range of ten categorical colours
    vis.colorPalette = d3.scaleOrdinal(d3.schemeTableau10);
    vis.colorPalette.domain(
      "tropical-cyclone",
      "drought-wildfire",
      "severe-storm",
      "flooding"
    );

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale).tickFormat(d3.format("d"));
    vis.yAxis = d3.axisLeft(vis.yScale).tickFormat(d3.format(","));

    // Draw the axis
    vis.xAxisGroup = vis.chart
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${vis.height})`)
      .call(vis.xAxis);

    vis.yAxisGroup = vis.chart
      .append("g")
      .attr("class", "axis y-axis")
      .call(vis.yAxis);

    vis.dataLine = vis.chart
      .append("path")
      .attr("stroke", "gray")
      .attr("fill", "none")
      .attr("stroke-width", 2)
      .attr("d", vis.drawLinePath(d3.path(), vis.data));

    // get each group in order of date
    //const groupedData = Object.values(vis.groupByCategory(vis.data));
    // populate with lines
    /*vis.chart
      .data(groupedData) // one line per grouped data
      .enter()
      .call((svg) =>
        svg
          .append("path")
          .data(groupedData)
          .enter()
          .style("stroke", (d) => vis.colorPalette(d.category))
          .attr("d", (d) => vis.drawLinePath(d3.path(), d))
      )
      .attr("fill", (d) => vis.colorPalette(d.category))
      .attr("opacity", 0.8)
      .attr("stroke", "gray")
      .attr("stroke-width", 2)
      .attr("cy", (d) => vis.yScale(d.year))
      .attr("cx", (d) => vis.xScale(d.daysFromYrStart));*/

    //this.updateVis(); //leave this empty for now...
  }

  /* https://observablehq.com/@d3/d3-path */
  /* and deepSeek for the scaling */
  drawLinePath(context, disasters) {
    // Move to the first point, scaled to the chart dimensions
    context.moveTo(
      this.xScale(disasters[0].cost), // Scale the cost (x-coordinate)
      this.yScale(disasters[0].year) // Scale the year (y-coordinate)
    );

    // Draw lines to the remaining points, scaled to the chart dimensions
    disasters.forEach((disaster) => {
      context.lineTo(
        this.xScale(disaster.year), // Scale the cost (x-coordinate)
        this.yScale(disaster.cost) // Scale the year (y-coordinate)
      );
    });
    return context; // not mandatory, but will make it easier to chain operations
  }

  /* phind.com */
  groupByCategory(data) {
    return data
      .reduce((acc, item) => {
        const category = item.category;

        // If the category doesn't exist yet, create a new array for it
        if (!acc[category]) {
          acc[category] = [];
        }

        // Push the item into its corresponding category array
        acc[category].push(item);

        // items grouped by category
        return acc;
      }, {})
      .then((categories) => {
        Object.values(categories).forEach((category) => {
          category.sort((a, b) => a.year - b.year);
        });
        // items grouped by category and ordered by year
        return categories;
      });
  }

  //  //leave this empty for now
  // updateVis() {

  //   this.renderVis();

  // }

  // //leave this empty for now...
  // renderVis() {

  //  }
}
