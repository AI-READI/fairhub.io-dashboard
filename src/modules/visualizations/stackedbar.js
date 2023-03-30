/*
Imports
*/

import * as D3 from "d3";
import Legend from "./legend.js";

/*
Prototype
*/

// Overview Visualization Entry Point
var StackedBar = function (config) {
    return this.__init__(config);
};

// Overview Visualization Methods
StackedBar.prototype = {

  __init__ : function (config) {
    var self = this;

    self.id           = config.id;
    self.margin       = config.margin;
    self.padding      = config.padding;
    self.width        = config.width;
    self.height       = config.height;
    self.palette      = config.palette;
    self.opacity      = config.opacity;
    self.ncols        = config.ncols;
    self.data         = config.data;
    self.legend       = config.legend;

    // References
    self.uid          = `O-${Math.random().toString(16).slice(2)}`;
    self.inner        = {
      height: self.height - self.margin.top - self.margin.bottom,
      width: self.width - self.margin.left - self.margin.right,
    };
    // Need to compute this dynamically once data schema is specified
    self.columns      = ['group', 'healthy', 'prediabetic', 'diabetic'];
    self.svg          = null;
    self.groups       = null;
    self.subgroups    = null;
    self.x            = null;
    self.y            = null;
    self.stacked      = null;

    return self;

  },

  update: function () {
    var self = this;

    /*
    Setup
    */

    self.svg = D3.select(self.id)
      .classed("stacked-bar-chart", true);

    self.groups = D3.map(self.data, function (d) { return (d.group) })
    self.subgroups = self.columns.slice(1);

    self.stacked = D3.stack()
      .keys(self.subgroups)(self.data);

    self.color = D3.scaleOrdinal()
      .domain(self.groups)
      .range(self.palette);

    /*
    Generate Axes
    */

    self.x = D3.scaleBand()
      .domain(self.groups)
      .range([0, self.inner.width])
      .paddingInner(0.05)
      .paddingOuter(0)
      .align(0);

    self.y = D3.scaleLinear()
      .domain([0, 750])
      .range([self.inner.height, 0]);

    self.xAxis = self.svg.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(${self.margin.left}, ${self.inner.height + self.margin.top})`)
      .call(D3.axisBottom(self.x).tickSizeOuter(5).tickPadding(10))
      .selectAll(".tick")
        .data(self.data)
        .attr("transform", d => `translate(${self.x(d.group)}, 0)`)
        .selectAll("text")
          .attr("id", d => `label_${self.uid}_${self._rename(d.group)}`)
          .classed("label", true)
          .style("text-anchor", "start")
          .style("text-transform", "capitalize");

    self.yAxis = self.svg.append("g")
      .classed("y-axis", true)
      .attr("transform", `translate(${self.margin.left}, ${self.margin.top})`)
      .call(D3.axisLeft(self.y))
      .selectAll("text")
        .classed("label", true)
        .style("text-anchor", "end")
        .style("text-transform", "capitalize");

    /*
    Generate Data Elements
    */

    self.bars = self.svg.append("g")
      .classed(`bars`, true)
      .selectAll("g")
      .data(self.stacked)
      .enter()
        .append("g")
        .attr("id", d => `bar-group_${self.uid}_${self._rename(d.group)}`)
        .classed("bar-group", true)
        .attr("fill", d => self.color(d.key))
        .selectAll("rect")
        .data(d => d)
        .enter()
          .append("rect")
          .attr("id", d => `bar_${self.uid}_${self._rename(d.data.group)}_${self._rename(d.subgroup)}`)
          .classed("bar", true)
          .attr("transform", `translate(${self.margin.left}, ${self.margin.bottom})`)
          .attr("x", d => self.x(d.data.group))
          .attr("y", d =>  self.y(d[1]))
          .attr("height", d =>  self.y(d[0]) - self.y(d[1]))
          .attr("width", self.x.bandwidth())
          .attr("opacity", self.opacity)
          .text(d =>  d.data.group);

    /*
    Annotation
    */

    self.annotation = new Legend({
      uid: self.uid,
      parent: self.svg,
      container: self.inner,
      data: self.stacked,
      color: self.color,
      width: self.legend.width,
      height: self.legend.height,
      itemsize: self.legend.itemsize,
      fontsize: self.legend.fontsize,
      vposition: self.legend.vposition,
      hposition: self.legend.hposition,
      accessor: "key"
    });

    return self;
  },

  debug : function () {
    var self = this;
    console.log(self);
    return self;
  },

  _uid: function () {
    return `O-${Math.random().toString(16).slice(2, 8)}`
  },

  _rename: function (name) {
    return (typeof(name) === "string") ? name.replace(/\s/g, "-").toLowerCase() : "";
  }

};

/*
Exports
*/

export default StackedBar;
