'use strict';

import './popup.css';
import * as d3 from 'd3'
let data=[
]
function update_data(darkPattern) {
    for(let i in data){
      if(data[i].name === darkPattern){
        data[i].value++;
        return true;
      }
    }
    return false;
}

function GeneratePieChart(){
  d3.selectAll("svg > *").remove()
  const width=600
  const height = Math.min(width, 500);
  const radius = Math.min(width, height) / 2;

    const arc = d3.arc()
        .innerRadius(radius * 0.67)
        .outerRadius(radius - 1);

    const pie = d3.pie()
        .padAngle(1 / radius)
        .sort(null)
        .value(d => d.value);

    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.name))
        .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse());

    const svg = d3.select("#svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [-width / 2, -height / 2, width, height])
        .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
      .selectAll()
      .data(pie(data))
      .join("path")
        .attr("fill", (d)=>color(d.data.name))
        .attr("d", arc)
      .append("title")
        .text(d => `${d.data.name}: ${d.data.value.toLocaleString()}`);

    svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 12)
        .attr("text-anchor", "middle")
      .selectAll()
      .data(pie(data))
      .join("text")
        .attr("transform", d => `translate(${arc.centroid(d)})`)
        .call(text => text.append("tspan")
            .attr("y", "-0.4em")
            .attr("font-weight", "bold")
            .text(d => d.data.name))
        .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
            .attr("x", 0)
            .attr("y", "0.7em")
            .attr("fill-opacity", 0.7)
            .text(d => d.data.value.toLocaleString("en-US")));
}
chrome.runtime.onMessage.addListener((request,sender,sendResponse)=>{
  if(request.type==="result"){
    console.log(data);
    if(!update_data(request.darkPattern)){
      data.push({name:request.darkPattern,value:1})
    }
    GeneratePieChart();
  }
})
let submit = document.querySelector('button.report')

submit.addEventListener('click', () => {
  console.log('clicked')



  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id, 
      {type: 'SELECT_MODE'},
      (response) => {
        console.log(response);
      }
    );
  });
})
console.log("this is a popup");
async function Make_boxes(){
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log(tab,"Tab");
  console.log("clicked");
  chrome.tabs.sendMessage(
    tab.id,
    {
      type: 'Boxes',
    }
  );
};
document.getElementById('Boxes').addEventListener('click',Make_boxes);
console.log("erew");


(function () {
  // broadcast to content scripts and active background scripts
  chrome.runtime.sendMessage(
    {
      type: 'GREETINGS',
      payload: {
        message: 'Hello, my name is Pop. I am from Popup.',
      },
    },
    (response) => {
      // console.log(response.message);
      console.log('Popup received response');
    }
  );
})();



















