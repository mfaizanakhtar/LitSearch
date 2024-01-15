// const data = [
//     {
//       "name": "publications",
//       "values": [
//         {"id": 1, "year": 2000, "citations": 10},
//         {"id": 2, "year": 2001, "citations": 15},
//         {"id": 3, "year": 2002, "citations": 8},
//         {"id": 4, "year": 2003, "citations": 20},
//         {"id": 5, "year": 2006, "citations": 30}
//       ]
//     },
    // {
    //   "name": "connections",
    //   "values": [
    //     {"source": 1, "target": 2},
    //     {"source": 2, "target": 3},
    //     {"source": 3, "target": 4}
    //   ]
    // }
//   ]

export const createSpec=(data:any)=>{
    return {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 800,
        "height": 700,
        "padding": 20,
        
        "data": data,
        "scales": [
          {
            "name": "x",
            "type": "point",
            "range": "width",
            "domain": {"data": "publications", "field": "year"}
          },
          {
            "name": "y",
            "type": "linear",
            "range": "height",
            "nice": true,
            "zero": true,
            "domain": {"data": "publications", "field": "citations"}
          }
        ],
        "axes": [
          {"orient": "bottom", "scale": "x","title":"Publication Year"},
          {"orient": "left", "scale": "y","title":"Citation Count"}
        ],
        "marks": [
          {
            "type": "symbol",
            "from": {"data": "publications"},
            "encode": {
              "enter": {
                "x": {"scale": "x", "field": "year", "sort": "ascending"},
                "y": {"scale": "y", "field": "citations"},
                "size": {"value": 100},
                "fill": {"value": "#4F46E5"},
                "stroke": {"value": "transparent"},
                "strokeWidth": {"value": 0}
              },
              "update": {
                "fillOpacity": {"value": 1},
                "stroke": {"value": "transparent"},
                "strokeWidth": {"value": 0}
              },
              "hover":{
                "fillOpacity":{"value":0.5},
                "stroke": {"value": "#818CF8"},
                "strokeWidth": {"value": 2},
                "tooltip":{
                    "signal":"{'Title': datum.title}"
                }
              }
            }
          },
        //   {
        //     "type": "line",
        //     "from": {"data": "connections"},
        //     "transform": [
        //         {
        //           "type": "lookup",
        //           "from": "publications",
        //           "key": "id",
        //           "fields": ["source"],
        //           "as": ["sourceData"]
        //         },
        //         {
        //           "type": "lookup",
        //           "from": "publications",
        //           "key": "id",
        //           "fields": ["target"],
        //           "as": ["targetData"]
        //         }
        //       ],
        //     "encode": {
        //       "enter": {
        //         "x": {"scale": "x", "field": "sourceData.year"},
        //         "y": {"scale": "y", "field": "sourceData.citations"},
        //         "x2": {"scale": "x", "field": "targetData.year"},
        //         "y2": {"scale": "y", "field": "targetData.citations"},
        //         "stroke": {"value": "firebrick"},
        //         "strokeWidth": {"value": 2}
        //       }
        //     }
        //   }
          
        ]
      }
}

// export const spec = {
//     "$schema": "https://vega.github.io/schema/vega/v5.json",
//     "width": 900,
//     "height": 750,
//     "padding": 20,
//     "data": [],
//     "scales": [
//       {
//         "name": "x",
//         "type": "point",
//         "range": "width",
//         "domain": {"data": "publications", "field": "year"}
//       },
//       {
//         "name": "y",
//         "type": "linear",
//         "range": "height",
//         "nice": true,
//         "zero": true,
//         "domain": {"data": "publications", "field": "citations"}
//       }
//     ],
//     "axes": [
//       {"orient": "bottom", "scale": "x"},
//       {"orient": "left", "scale": "y"}
//     ],
//     "marks": [
//       {
//         "type": "symbol",
//         "from": {"data": "publications"},
//         "encode": {
//           "enter": {
//             "x": {"scale": "x", "field": "year"},
//             "y": {"scale": "y", "field": "citations"},
//             "size": {"value": 100},
//             "fill": {"value": "steelblue"}
//           }
//         }
//       },
//     //   {
//     //     "type": "line",
//     //     "from": {"data": "connections"},
//     //     "transform": [
//     //         {
//     //           "type": "lookup",
//     //           "from": "publications",
//     //           "key": "id",
//     //           "fields": ["source"],
//     //           "as": ["sourceData"]
//     //         },
//     //         {
//     //           "type": "lookup",
//     //           "from": "publications",
//     //           "key": "id",
//     //           "fields": ["target"],
//     //           "as": ["targetData"]
//     //         }
//     //       ],
//     //     "encode": {
//     //       "enter": {
//     //         "x": {"scale": "x", "field": "sourceData.year"},
//     //         "y": {"scale": "y", "field": "sourceData.citations"},
//     //         "x2": {"scale": "x", "field": "targetData.year"},
//     //         "y2": {"scale": "y", "field": "targetData.citations"},
//     //         "stroke": {"value": "firebrick"},
//     //         "strokeWidth": {"value": 2}
//     //       }
//     //     }
//     //   }
      
//     ]
//   }
  