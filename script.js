window.setTimeout(function() {
// nothing was showing up until I made the script wait for a fraction of a second

   // color arrays
   var arrColors = [
      "rgb(153, 153, 255)", // very light blue
      "rgb(255, 204, 255)", // very pale magenta
      "rgb(204, 51, 153)", // strong pink
      "rgb(153, 0, 204)", // strong magenta
      "rgb(102, 102, 255)", // light blue
      "rgb(102, 0, 153)" // dark violet
   ];

   var arrTransColors = [
      "rgba(153, 153, 255, 0.5)", // very light blue
      "rgba(255, 204, 255, 0.5)", // very pale magenta
      "rgba(204, 51, 153, 0.5)", // strong pink
      "rgba(153, 0, 204, 0.5)", // strong magenta
      "rgba(102, 102, 255, 0.5)", // light blue
      "rgba(102, 0, 153, 0.5)" // dark violet
   ];

   // svg size
   var width = 960,
      height = 500;

   // svg element is created in the HTML and selected
   var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height);

   // Building the force layout
   var force = d3.layout.force()
      .size([width, height]) // same as the svg's
      .charge(-400) // + value = chaos, the lesser the stronger nodes repel
      .linkDistance(40) // length of the links
      .on("tick", tick); // function called when user drags/hoovers/clicks/etc.

   // Not sure of why he saved this. Perhaps he needed it to add the .on?
   var drag = force.drag()
      .on("dragstart", dragstart); // when event happens, dragstart() is called

   // Selectors for .link and .node (none atm) are created
   var link = svg.selectAll(".link"),
      node = svg.selectAll(".node");

   // 2 parameters: path and callback function
   // the func. receives error and data (the object)
   d3.json("https://api.myjson.com/bins/11baue", function(error, graph) {
    if (error) throw error; // throw throws an user-defined exception, stopping execution

    // force and link data are fed, then forze is initialized
    force
         .nodes(graph.nodes)
         .links(graph.links)
         .start();

   // Data is added to our empty selectos and enter() function appends and HTML element
   // for every data element that doesn't have a corresponding HTML element
   link = link.data(graph.links)
         .enter().append("line")
         .attr("class", "link");

   node = node.data(graph.nodes)
         .enter().append("circle")
         .attr("class", "node")
         .attr("r", 12)
         .on("dblclick", dblclick) // listener is added, jQuery syntax
         .call(drag); // force.drag could've been used too; makes dragging work
         // someone used .call in the tick() func instead, but this seems to be more common
   });

   // Updates the position of the HTML nodes and links to match what force calculated
   function tick() {
    link.attr("x1", function(d) { return d.source.x; })
         .attr("y1", function(d) { return d.source.y; })
         .attr("x2", function(d) { return d.target.x; })
         .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .attr("fill", function(d) {return arrTransColors[d.type-1]}) // -1 so i = 0
         .attr("stroke", function(d) {return arrColors[d.type-1]});
   }

   // These 2 I haven't found info on, but they seem to be responsible of the "stickiness"
   function dblclick(d) {
    d3.select(this).classed("fixed", d.fixed = false);
   }

   function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
   }
}, 100);
