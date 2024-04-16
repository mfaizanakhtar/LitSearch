import queriesState from '@/app/states/queriesState';
// Assuming Graph is imported or required as shown previously
const Graph = require('react-d3-graph').Graph as any;


// Graph component
const graph = () => {

  const {nodesAndLinks} = queriesState()

  const data = {
    nodes: [
      { id: 'Node 1' }, { id: 'Node 2' }, { id: 'Node 3' },
      { id: 'Node 4' }, { id: 'Node 5' }, { id: 'Node 6' },
      { id: 'Node 7' }, { id: 'Node 8' }, { id: 'Node 9' },
      { id: 'Node 10' }, { id: 'Node 11' }, { id: 'Node 12' },
      { id: 'Node 13' }, { id: 'Node 14' }, { id: 'Node 15' },
    ],
    links: [
      { source: 'Node 1', target: 'Node 2' }, { source: 'Node 1', target: 'Node 5' },
      { source: 'Node 2', target: 'Node 3' }, { source: 'Node 2', target: 'Node 4' },
      { source: 'Node 3', target: 'Node 6' }, { source: 'Node 4', target: 'Node 7' },
      { source: 'Node 5', target: 'Node 8' }, { source: 'Node 6', target: 'Node 9' },
      { source: 'Node 7', target: 'Node 10' }, { source: 'Node 8', target: 'Node 11' },
      { source: 'Node 9', target: 'Node 12' }, { source: 'Node 10', target: 'Node 13' },
      { source: 'Node 11', target: 'Node 14' }, { source: 'Node 12', target: 'Node 15' },
      // Add more links as needed to create your desired network structure
    ],
  };

  // The graph configuration
  const config = {
    d3: {
        gravity: -100,
        linkLength: 100,
        // linkStrength: (link:any) => {return link.strength || 1},
        linkStrength:0,
        disableLinkForce: false,
      },
    nodeHighlightBehavior: true,
    node: {
      color: '#4f46e5',
      size: 120,
      highlightStrokeColor: 'blue',
      renderLabel: true, // Make sure labels are rendered
      labelProperty: 'title', // Use the 'name' property as the label
    },
    link: {
      type: "CURVE_SMOOTH",
      opacity:1,
    //   opacity: (link:any) => link.strength ? 1 : 0,
      highlightColor: '#4f46e5',
    },
    directed: true, // Set to true for directed graph
    height: 1000,
    width: 1000,
  };

  // Render
  return (
    Object.keys(nodesAndLinks).length>0 ? <Graph id="graph-id" data={nodesAndLinks} config={config} /> : <></>
  )
};

export default graph;
