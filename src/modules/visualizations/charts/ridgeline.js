/*
Imports
*/

import * as D3 from "d3";
import Chart from "../chart.js";
import Kernel from "../utilities/kernel.js";
import Legend from "../utilities/legend.js";

/*
Ridgeline Chart Class
*/

class RidgelineChart extends Chart {

  // References
  mapped      = undefined;
  groups      = undefined;
  density     = undefined;
  k           = undefined;
  color       = undefined;
  x           = undefined;
  y           = undefined;
  xAxis       = undefined;
  yAxis       = undefined;
  kde         = undefined;
  annotation  = undefined;

  constructor (config) {

    // Configure Parent
    super(config);

    let self = this;

    // Configure Rideline Chart
    self.opacity    = config.opacity;
    self.kernel     = config.kernel;
    self.legend     = config.legend;
    self.accessors  = config.accessors;

    // Computed References
    self.padding      = {
      top: 0, left: 20, bottom: 0, right: 20
    };

    return self;

  }

  update () {

    let self = this;

    /*
    Setup
    */

    // Grab SVG Generated From Vue Template
    self.svg = D3.select(self.id)
      .classed("ridgeline-chart", true);

    // Map Data
    [self.mapped, self.groups, self.domain] = self.#mapData(self.data);

    /*
    Generate Axes
    */

    console.log(self.inner);

    self.x = D3.scaleLinear()
      .domain(self.domain)
      .range([0, self.inner.width]);

    self.xAxis = self.svg.append("g")
      .classed("x-axis", true)
      .attr("id", `x-axis_${self.uid}`)
      .attr("transform", `translate(${self.margin.left}, ${self.inner.height + self.margin.top})`)
      .call(D3.axisBottom(self.x));

    self.y = D3.scaleLinear()
      .domain([0, 0.4])
      .range([self.inner.height, 0]);

    self.subplot = D3.scaleBand()
      .domain(self.groups)
      .range([0, self.inner.height])
      .paddingInner(1)

    self.yAxis = self.svg.append("g")
      .classed("y-axis", true)
      .attr("id", `y-axis_${self.uid}`)
      .attr("transform", `translate(${self.margin.left}, ${self.margin.top})`)
      .call(D3.axisLeft(self.subplot));

    self.color = D3.scaleOrdinal()
      .domain(self.groups)
      .range(self.palette);

    /*
    Generate Data Elements
    */

    self.curve = D3.line()
      .curve(D3.curveBasis)
      .x(d => self.x(d[0]))
      .y(d => self.y(d[1]));

    self.curves = self.svg.append("g")
      .classed("curves", true)
      .attr("id", `curves_${self.uid}`)
      .attr("transform", `translate(${self.margin.left}, ${self.margin.top})`)
      .selectAll(".curve")
      .data(self.density)
      .join("path")
        .classed("curve", true)
        .attr("id", d => `curve_${self.tokenize(d[self.accessors.color.key])}_${self.uid}`)
        .attr("transform", d => `translate(0, ${self.subplot(d[self.accessors.color.key])})`)
        .attr("fill", d => self.color(d[self.accessors.color.key]))
        .attr("stroke", "#000000")
        .attr("opacity", self.opacity)
        .datum(d => d[self.accessors.y.key])
          .attr("d", self.curve);

    /*
    Annotation
    */

    self.annotation = new Legend({
      uid: self.uid,
      parent: self.svg,
      container: self.inner,
      data: self.density,
      color: self.color,
      width: self.legend.width,
      height: self.legend.height,
      margin: self.margin,
      padding: self.padding,
      itemsize: self.legend.itemsize,
      fontsize: self.legend.fontsize,
      vposition: self.legend.vposition,
      hposition: self.legend.hposition,
      accessor: self.accessors.color.key
    });

    return self;

  }

  #mapData (data) {

    let self = this;
    let groups = super.getUniqueKeys(data, self.accessors.color.key);
    let values = new Set();
    let domain = [];
    let mapped = [];

    groups.forEach(group => {
      let subplot = {
        [self.accessors.color.key]: group,
        [self.accessors.x.key]: [],
        [self.accessors.y.key]: []
      };
      data.forEach(row => {
        if (row[self.accessors.color.key] === group) {
          subplot[self.accessors.x.key].push(super.asType(self.accessors.x.type, row[self.accessors.x.key]));
          subplot[self.accessors.y.key].push(super.asType(self.accessors.y.type, row[self.accessors.y.key]));
          values.add(super.asType(self.accessors.x.type, row[self.accessors.x.key]))
        }
      });
      mapped.push(subplot);
    });

    domain = [Math.min(...values), Math.max(...values)]

    return [mapped, groups, domain];

  }

}

/*
Exports
*/

export default RidgelineChart;
