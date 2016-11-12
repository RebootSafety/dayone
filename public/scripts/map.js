var width = 960,
    height = 600;
var projection = d3.geo.albersUsa()
    .scale(1285)
    .translate([width / 2, height / 2]);
var path = d3.geo.path()
    .projection(projection);
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);
var defs = svg.append("defs");
defs.append("filter")
    .attr("id", "blur")
  .append("feGaussianBlur")
    .attr("stdDeviation", 5);
d3.json("us.json", function(error, us) {
  if (error) throw error;
  defs.append("path")
      .datum(topojson.feature(us, us.objects.land))
      .attr("id", "land")
      .attr("d", path);
  svg.append("use")
      .attr("class", "land-glow")
      .attr("xlink:href", "#land");
  svg.append("use")
      .attr("class", "land-fill")
      .attr("xlink:href", "#land");
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.counties, function(a, b) {
        return a !== b // a border between two counties
            && (a.id === 53000 || b.id === 5300 // where a and b are in puget sound
              || a.id % 1000 && b.id % 1000) // or a and b are not in a lake
            && !(a.id / 1000 ^ b.id / 1000); // and a and b are in the same state
      }))
      .attr("class", "county-boundary")
      .attr("d", path);
  svg.append("path")
      .datum(topojson.mesh(us, us.objects.states, function(a, b) {
        return a !== b; // a border between two states
      }))
      .attr("class", "state-boundary")
      .attr("d", path);
});
d3.select(self.frameElement).style("height", height + "px");