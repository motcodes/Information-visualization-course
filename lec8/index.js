import { select, json, geoPath, geoNaturalEarth1 } from 'd3';
import { feature } from 'topojson';

const svg = select('svg');

const projection = geoNaturalEarth1();
const pathGenerator = geoPath().projection(projection);

svg.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({type: 'Sphere'}));

json('https://d3js.org/world-110m.v1.json')
  .then(data => {
    const countries = feature(data, data.objects.countries);
    svg.selectAll('path').data(countries.features)
      .enter().append('path')
      .attr('class', 'country')
      .attr('d', pathGenerator);
  });