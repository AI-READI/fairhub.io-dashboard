/*
Imports
*/

import * as d3 from "d3";
import * as d3_sankey from "d3-sankey";

/*
Prototype
*/

// Overview Visualization Entry Point
var Sankey = function (config) {
    return this.__init__(config);
};

// Overview Visualization Methods
Sankey.prototype = {

  __init__ : function (config) {
    let self = this;

    self.id         = config.id;
    self.width      = config.width;
    self.height     = config.height;

    // Generate sankey – sample data
    self.data = {
      edges: [
        { id: "A1" },
        { id: "A2" },
        { id: "A3" },
        { id: "A4" },
        { id: "B1" },
        { id: "B2" },
        { id: "B3" },
        { id: "C1" }
      ],
      links: [
        { source: "A1", target: "B1", value: 27 },
        { source: "A2", target: "B1", value: 19 },
        { source: "A3", target: "B2", value: 18 },
        { source: "A4", target: "B3", value: 3 },
        { source: "B1", target: "C1", value: 46 },
        { source: "B2", target: "C1", value: 17 },
        { source: "B2", target: "B3", value: 1 }
      ]
    };

    self.graph = d3_sankey.sankey(self.data)
      .size([self.width, self.height])
      .nodeId(d => d.id)
      .nodeWidth(20)
      .nodePadding(10)
      .nodeAlign(d3_sankey.sankeyCenter);

    return self;

  },

  update: function () {
    let self = this;
    console.log("Updated!")
    self.svg = d3.select(self.id);

    self.nodes = self.svg
      .append("g")
      .classed("nodes", true)
      .selectAll("rect")
      .data(self.graph.nodes)
      .enter()
      .append("rect")
      .classed("node", true)
      .attr("x", d => d.x0)
      .attr("y", d => d.y0)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", "blue")
      .attr("opacity", 0.8);

    self.edges = self.svg
      .append("g")
      .classed("edges", true)
      .selectAll("path")
      .data(self.graph.edges)
      .enter()
      .append("path")
      .classed("edge", true)
      .attr("d", d3_sankey.sankeyLinkHorizontal())
      .attr("fill", "none")
      .attr("stroke", "#606060")
      .attr("stroke-width", d => d.width)
      .attr("stoke-opacity", 0.5);

      return self;
  },

  debug : function () {
    let self = this;
    console.log(self);
    return self;
  }

};

/*
Exports
*/

export default Sankey;