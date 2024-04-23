import * as d3 from 'd3';

interface data{
    id:string,
    x?:number,
    y?:number,
    actualYear?:string
}

interface connections{
    source:string,
    target:string
}

export class D3LitGraph{

    private d3Container:React.MutableRefObject<null>
    private containerWidth:number=800;
    private containerHeight:number=800;
    private nodeRadius:number = 5;
    private g: d3.Selection<SVGGElement, unknown, null, undefined> | undefined;

    private xAndYRange:{xMin:number,yMin:number,xMax:number,yMax:number};

    private xScale: d3.ScaleLinear<number, number, never> | undefined
    private yScale: d3.ScaleLinear<number, number, never> | undefined
    private xLabel:string;
    private yLabel:string

    private data:data[];
    private connections:connections[];

    private pathSelection:d3.Selection<SVGPathElement, {
        source: {
            id: string;
            x?: number;
            y?: number;
        } | undefined;
        target: {
            id: string;
            x?: number;
            y?: number;
        } | undefined;
        id: string;
    }, SVGGElement, unknown> | undefined
    private allNodes:d3.Selection<SVGCircleElement, data, SVGGElement, unknown> | undefined
    private toolTip:d3.Selection<null, unknown, null, undefined> | undefined

    pathColourInitial:string = "#d3d3d3"
    nodeInitialColour:string = "#776eff"
    nodeHoverColour:string = "#4f46e5"
    nodeHoverBorder:string = "#3b32d1"
    pathColourHover:string ="black"

    hoverFunction!: (id:string) => void | undefined; 
    hoverRevertFunction!: (id:string) => void | undefined;



    constructor(d3ContainerRef:React.MutableRefObject<null>,data:data[],conenctions:connections[],
        xLabel:string,yLabel:string,
        toolTipRef?:React.MutableRefObject<null>,
        hoverFunction?:(id:string)=>void,hoverRevertFunction?:(id:string)=>void,
        width?:number,height?:number){

        this.d3Container = d3ContainerRef
        this.data = data
        this.connections = conenctions
        this.xLabel = xLabel
        this.yLabel = yLabel
        if(width) this.containerWidth = width
        if(height) this.containerHeight = height
        if(hoverFunction) this.hoverFunction=hoverFunction
        if(hoverRevertFunction) this.hoverRevertFunction=hoverRevertFunction
        this.xAndYRange =this.setMinAndMax(data)

        this.createD3Graph()
        this.createPaths()
        if(toolTipRef) this.createToolTip(toolTipRef)
        this.createNodes()
        // this.createNodesText()
        this.addEventListenerToCards()
    }

    private addEventListenerToCards = () =>{
        let mouseOverByIdFunction = this.mouseOverByIdFunction
        let mouseOutByIdFunction = this.mouseOutByIdFunction

        this.data.forEach((element)=>{
            let htmlElement = document.getElementById(element.id)
            htmlElement?.addEventListener('mouseover', function() {
                mouseOverByIdFunction(element.id,true);  // Replace 'desiredNodeId' with the actual ID
            });

            htmlElement?.addEventListener('mouseout', function() {
                mouseOutByIdFunction(element.id,true);  // Replace 'desiredNodeId' with the actual ID
            });
        })
    }

    private mouseOutByIdFunction = (id:string,isCardEvent?:boolean) => {

        this.allNodes?.each(function(p){
            if(p?.id==id){
                d3.select(this)
                .style("stroke-width", 1)
                .style("stroke", "gray"); // Revert node border color
            }
        })        
      
      // Revert connected paths
      if(this.pathSelection){
        this.pathSelection.each(function(p) {
            if (p?.source?.id === id || p?.target?.id === id) {
              d3.select(this)
                .attr('stroke', '#d3d3d3')
                .attr('marker-end', 'url(#arrowhead-normal)');
            }
          });
      }

      //revert highlight
      if(!isCardEvent)this.hoverRevertFunction(id)
    }

    private mouseOverByIdFunction = (id:string,isCardEvent?:boolean) => {
        let pathColourHover = this.pathColourHover
        let nodeHoverColour = this.nodeHoverColour
        let nodeHoverBorder = this.nodeHoverBorder

        this.allNodes?.each(function(p){
            if(p?.id==id){
                d3.select(this)
                .style("fill",nodeHoverColour)
                .style("stroke-width", 3)
                .style("stroke", nodeHoverBorder); // Change node border color on hover
            }
        })
        // Highlight connected paths
        if(this.pathSelection){
          this.pathSelection.each(function(p) {
              if (p?.source?.id === id || p?.target?.id === id) {
                d3.select(this)
                  .attr('stroke', pathColourHover)
                  .attr('marker-end', 'url(#arrowhead-hover)');
              }
            });
        }
          if(!isCardEvent) this.hoverFunction(id)
    }
    public getGraphRef = () =>{
        return this.g;
    }

    private setMinAndMax = (data:data[]) =>{
       return data.reduce((values, node) => {
            if (node.x !== undefined) {
                if (node.x < values.xMin) {
                    values.xMin = node.x;
                }
                if (node.x > values.xMax) {
                    values.xMax = node.x;
                }
            }
            if (node.y !== undefined) {
                if (node.y < values.yMin && node.y!=0) {
                    values.yMin = node.y;
                }
                if (node.y > values.yMax) {
                    values.yMax = node.y;
                }
            }
            return values;
        }, {xMin:Infinity,xMax:0,yMin:Infinity,yMax:0});
    }

    private createD3Graph = () =>{
        const svg = d3.select(this.d3Container.current)
        .attr("width", this.containerWidth)
        .attr("height", this.containerHeight);
        
        const margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;
        console.log(this.xAndYRange)
        this.xScale = d3.scaleLinear().domain([this.xAndYRange.xMin, this.xAndYRange.xMax]).range([0, width]);
        this.yScale = d3.scaleLinear().domain([this.xAndYRange.yMin, this.xAndYRange.yMax]).range([height, 0]);
        
        this.g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
        
        this.g.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(this.xScale).tickFormat(d3.format("d")))
        .append("text")
        .attr("fill", "#000")
        .attr("y", -6)
        .attr("x", width)
        .attr("text-anchor", "end")
        .text(this.xLabel);

        this.g.append("g")
            .call(d3.axisLeft(this.yScale).tickFormat(d3.format("d")))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text(this.yLabel);

    }

    private defineMarkers = (color:any, idSuffix:any) => {
        if(this.g){
            this.g.append('defs').append('marker')
            .attr('id', `arrowhead-${idSuffix}`)
            .attr('viewBox', '-0 -5 10 10')
            .attr('refX', 5)
            .attr('refY', 0)
            .attr('orient', 'auto')
            .attr('markerWidth', 6)
            .attr('markerHeight', 6)
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', color);
        }
      };


    private createPaths = () =>{
        if(this.g){

            this.defineMarkers(this.pathColourInitial, 'normal');
            this.defineMarkers(this.pathColourHover, 'hover'); // Red or any color for hover state

            this.pathSelection = this.g.selectAll('.link')
            .data(this.connections.map(connection => ({
            source: this.data.find(node => node.id === connection.source),
            target: this.data.find(node => node.id === connection.target),
            id: connection.source + "-" + connection.target // Unique ID for the path
            })))
            .enter().append('path')
            .attr('class', 'link')
            .attr('id', (d:any) => `path-${d.id}`) // Assign ID based on unique connection ID
            .attr('d', d => {
                //@ts-ignore
                    const startX = this.xScale(d.source.x),
                    //@ts-ignore
                        startY = this.yScale(d.source.y),
                        //@ts-ignore
                        endX = this.xScale(d.target.x),
                        //@ts-ignore
                        endY = this.yScale(d.target.y);
                    const dx = endX - startX,
                        dy = endY - startY,
                        dr = Math.sqrt(dx * dx + dy * dy),
                        // Adjustments to shorten the line so arrow doesn't overlap the circle
                        offsetX = (dx * this.nodeRadius * 2) / dr,
                        offsetY = (dy * this.nodeRadius * 1.3) / dr,
                        endXAdjusted = endX - offsetX,
                        endYAdjusted = endY - offsetY;
                    // Generate a quadratic curve for a more natural connection path
                    // const randomizer =  [true, false][Math.floor(Math.random() * 2)]
                    const controlX = (startX + endX) / 2 // This remains the same
                    const controlY = (startY + endY) / 2 - Math.abs(dy) / 3
                    // const controlY = (startY + endY) / 2 + ( ? - (Math.abs(dy) / 3) : + (Math.abs(dy) / 3)); // Subtract instead of add to flip the curve
                return `M${startX},${startY}Q${controlX},${controlY} ${endXAdjusted},${endYAdjusted}`;
        
                    // return `M${startX},${startY}Q${(startX + endX) / 2},${startY} ${endXAdjusted},${endYAdjusted}`;
            })
            .attr('stroke', this.pathColourInitial)
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('marker-end', 'url(#arrowhead-normal)'); // Use normal marker initially
    
        }
    }

    private createToolTip = (toolTipRef:React.MutableRefObject<null>) =>{
        this.toolTip = d3.select(toolTipRef.current)
            .attr('id',"tooltip")
            .attr("class", "tooltip z-50")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("background-color", "white")
            .style("border", "solid")
            .style("border-width", "2px")
            .style("border-radius", "5px")
            .style("padding", "5px")
            // .style("z-index", "1000") // Ensure tooltip is layered above other content
            .style("pointer-events", "none"); // Ensure the tooltip doesn't interfere with mouse events
    } 

    private createNodes = ()=>{
        if(this.g && this.toolTip){
            const pathSelection = this.pathSelection
            const nodeHoverColour = this.nodeHoverColour
            const nodeHoverBorder = this.nodeHoverBorder
            const pathColourHover = this.pathColourHover
            const tooltip = this.toolTip
            const hoverFunction = this.hoverFunction
            const hoverRevertFunction = this.hoverRevertFunction
            const mouseOverByIdFunction = this.mouseOverByIdFunction
            const mouseOutByIdFunction = this.mouseOutByIdFunction

        this.allNodes = this.g.selectAll(".node")
            .data(this.data)
            .enter().append("circle")
            .attr("class", "node")
            .attr("r", 5)
            //@ts-ignore
            .attr("cx", d => this.xScale(d.x))
            //@ts-ignore
            .attr("cy", d => this.yScale(d.y))
            .style("fill", this.nodeInitialColour)
            .style("stroke", "gray")
            .style("stroke-width", 1)
            .style("cursor", "pointer")
            .on("mouseover", function(event,d) {
                //--tooltip Code begin--//
              tooltip.transition()
              .duration(200)
              .style("opacity", 0.9)
              tooltip.html("Citations: " + d.x + "<br/>Year: " + (d.actualYear ? d.actualYear : d.y))
              .style("left", (event.clientX - 450) + "px")
              .style("top", (event.clientY - 100) + "px");
                //--tooltip code end--//
                mouseOverByIdFunction(d.id)

            })
            .on("mouseout", function(event,d) {
              tooltip.style("opacity", 0); // Hide tooltip
              mouseOutByIdFunction(d.id)
            //   d3.select(this)
            //     .style("stroke-width", 1)
            //     .style("stroke", "gray"); // Revert node border color
              
            //   // Revert connected paths
            //   if(pathSelection){
            //     pathSelection.each(function(p) {
            //         if (p?.source?.id === d.id || p?.target?.id === d.id) {
            //           d3.select(this)
            //             .attr('stroke', '#d3d3d3')
            //             .attr('marker-end', 'url(#arrowhead-normal)');
            //         }
            //       });
            //   }

            //   //revert highlight
            //   hoverRevertFunction(d.id)
            });
        }
    }

    private createNodesText = () =>{
        if(this.g){
            this.g.selectAll(".node-text")
            .data(this.data) // Assuming 'data' is your dataset
            .enter().append("text")
            .attr("class", "node-text")
            //@ts-ignore
            .attr("x", (d:any) => this.xScale(d.x) - this.nodeRadius + 15) // Adjust according to your scale
            //@ts-ignore
            .attr("y", (d:any) => this.yScale(d.y) - this.nodeRadius + 17) // Adjust according to your scale
            .attr("dy", ".35em") // Vertically center text
            .style("tex-color","gray")
            .attr("text-anchor", "middle") // Center text horizontally on its coordinate
            .text(d => d.id); // Assuming each node has an 'id' you want to display
        }

    }
}

// import d3 from "d3";
// import React from "react";

// export const createD3Graph = (d3ContainerRef:any) =>{
//     const svg = d3.select(d3ContainerRef)
//     .attr("width", 900)
//     .attr("height", 800);
    
//     const margin = { top: 20, right: 20, bottom: 30, left: 40 },
//     width = +svg.attr("width") - margin.left - margin.right,
//     height = +svg.attr("height") - margin.top - margin.bottom;
    
//     const xScale = d3.scaleLinear().domain([0, 100]).range([0, width]);
//     const yScale = d3.scaleLinear().domain([2015, 2021]).range([height, 0]);
    
//     const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    
//     g.append("g")
//     .attr("transform", `translate(0,${height})`)
//     .call(d3.axisBottom(xScale))
//     .append("text")
//     .attr("fill", "#000")
//     .attr("y", -6)
//     .attr("x", width)
//     .attr("text-anchor", "end")
//     .text("Citation Count");

//   g.append("g")
//     .call(d3.axisLeft(yScale).tickFormat(d3.format("d")))
//     .append("text")
//     .attr("fill", "#000")
//     .attr("transform", "rotate(-90)")
//     .attr("y", 6)
//     .attr("dy", "0.71em")
//     .attr("text-anchor", "end")
//     .text("Year");

//     return g
// }

// export const createPaths = (g:d3.Selection<SVGGElement, unknown, null, undefined>,data:{id:string,x:number,y:number}[],
//     connections:{source:string,target:string}[],xScale,yScale)=>{
//     const pathSelection = g.selectAll('.link')
//     .data(connections.map(connection => ({
//       source: data.find(node => node.id === connection.source),
//       target: data.find(node => node.id === connection.target),
//       id: connection.source + "-" + connection.target // Unique ID for the path
//     })))
//     .enter().append('path')
//     .attr('class', 'link')
//     .attr('id', d => `path-${d.id}`) // Assign ID based on unique connection ID
//     .attr('d', (d:any) => {
//         const startX = xScale(d.source.x),
//               startY = yScale(d.source.y),
//               endX = xScale(d.target.x),
//               endY = yScale(d.target.y);
//         const dx = endX - startX,
//               dy = endY - startY,
//               dr = Math.sqrt(dx * dx + dy * dy),
//               // Adjustments to shorten the line so arrow doesn't overlap the circle
//               offsetX = (dx * nodeRadius * 2) / dr,
//               offsetY = (dy * nodeRadius * 1.3) / dr,
//               endXAdjusted = endX - offsetX,
//               endYAdjusted = endY - offsetY;
//         // Generate a quadratic curve for a more natural connection path
//         // const randomizer =  [true, false][Math.floor(Math.random() * 2)]
//         const controlX = (startX + endX) / 2 // This remains the same
//         const controlY = (startY + endY) / 2 - Math.abs(dy) / 3
//         // const controlY = (startY + endY) / 2 + ( ? - (Math.abs(dy) / 3) : + (Math.abs(dy) / 3)); // Subtract instead of add to flip the curve
//       return `M${startX},${startY}Q${controlX},${controlY} ${endXAdjusted},${endYAdjusted}`;

//         // return `M${startX},${startY}Q${(startX + endX) / 2},${startY} ${endXAdjusted},${endYAdjusted}`;
//     })
//     .attr('stroke', pathColourInitial)
//     .attr('stroke-width', 2)
//     .attr('fill', 'none')
//     .attr('marker-end', 'url(#arrowhead-normal)'); // Use normal marker initially
  
// }