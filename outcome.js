require([
    "esri/Map",
    "esri/views/SceneView",
    "esri/layers/FeatureLayer",
    "esri/symbols/WebStyleSymbol",
    "esri/widgets/Editor",
    "esri/core/reactiveUtils",
    "esri/widgets/Editor/Edits",
    "esri/widgets/Editor/UpdateWorkflow",
    "esri/geometry/Point",
    "esri/widgets/Sketch/SketchViewModel",
    "esri/core/lang",
    "esri/config",
    "esri/WebScene",
    "esri/layers/SceneLayer"
  ], (Map, SceneView, FeatureLayer, WebStyleSymbol, Editor, reactiveUtils, Edits, UpdateWorkflow, Point, SketchViewModel, esriLang, esriConfig, WebScene, SceneLayer) => {

    // esriConfig.apiKey = "AAPKa07a324e95e9498bb1de9d702ae6a65fkX6C2FmCKj71uGcHeQne7esbI9_JXyE3836Tyf3JWmiBkvKK518ht8Xg8BwG8Vmq"

    const map = new Map({
        basemap: "arcgis-topographic",
        ground: "world-elevation",
    })

    const scene = new WebScene({
        portalItem: {
            id: "1391de91c243480f8ab34a3007e55a69"
        }
    })
    
  const view = new SceneView({
    container: "viewDiv",
    map: map,
  
    viewingMode: "global",
    camera: {
      position: {
        x: 174.775103, //Wellington
        y: -41.288426,
        z: 200,
      },
    },
  });

  const colors = ["rgba(115, 0, 115, 0)", "#820082", "#910091", "#a000a0", "#af00af", "#c300c3", "#d700d7", "#eb00eb", "#ff00ff", "#ff58a0", "#ff896b", "#ffb935", "#ffea00"];
//   const colors = ["#EAF0F7", "#D7E1EE", "#CBD6E4", "#BFCBDB", "#B3BFD1", "#A7B4C7", "#A4A2A8", "#DF8879", "#C86558", "#B04238", "#991F17", "#8A150D", "#6B0B04"];

  let renderer = {
    type: "heatmap",
    field: "grid_code",
    colorStops: [
      { color: colors[0], ratio: 0 },
      { color: colors[1], ratio: 0.083 },
      { color: colors[2], ratio: 0.166 },
      { color: colors[3], ratio: 0.249 },
      { color: colors[4], ratio: 0.332 },
      { color: colors[5], ratio: 0.415 },
      { color: colors[6], ratio: 0.498 },
      { color: colors[7], ratio: 0.581 },
      { color: colors[8], ratio: 0.664 },
      { color: colors[9], ratio: 0.747 },
      { color: colors[10], ratio: 0.83 },
      { color: colors[11], ratio: 0.913 },
      { color: colors[12], ratio: 1 }
    ],
    radius: 18,
    maxDensity: 0.04625,
    minDensity: 0,
    elevationInfo: {
        mode: "absolute-height",
        offset: 50,
        // featureExpressionInfo: {
        //     expression: "Geometry($feature).z * 10"
        //   },
        unit: "meters"
      },
  };

  const treeRenderer = {
    type: "simple",  // autocasts as new SimpleRenderer()
    symbol: {
      type: "web-style",  // autocasts as new WebStyleSymbol()
      styleName: "EsriRealisticTreesStyle",
      name: "Other"
    },
    label: "generic tree",
    visualVariables: [{
      type: "size",
      axis: "height",
      field: "Tree_H",
      valueUnit: "meters"
    }, {
        type: "color",
        field: "TYPE",
        stops: [
            {
                value: "Tree",
                color: "#31a354"
            }
        ]
    }
    // {
    //   type: "size",
    //   axis: "width-and-depth",
    //   field: "canopy_diameter",
    //   valueUnit: "feet"
    // }
    ]
  };


const buildingsLayer = new SceneLayer({
    portalItem: {
      id: "ca0470dbbddb4db28bad74ed39949e25"
    },
    popupEnabled: false
  });
  map.add(buildingsLayer);

  // add trees
  var treeLayer = new FeatureLayer({
    portalItem: {
        id: "04be9f93876e48fab0b341b213a2c452"
    },
    renderer: treeRenderer
  })
  // view.map.add(treeLayer)
  
  var serverlayer = new FeatureLayer({
        portalItem: {id: "0c208681a2cc45008fda14d07ac0ae5f"},
        // portalItem: {id: "e9d165e2f02f440d8b1f67fc3e8d51be"},
        renderer: renderer,
        // geometry: {
        //   type: "point"
        // }
        elevationInfo: {
            mode: "absolute-height",
            offset: 50,
            // featureExpressionInfo: {
            //     expression: "Geometry($feature).z * 10"
            //   },
            unit: "meters"
          },

    })
  // view.map.add(serverlayer)

  let heatIslandfeatures = [
    {
      geometry: {
        type: "point",
        x: 172.639847,
        y: -43.525650,
        z: 30,
      },
      attributes: {
        ObjectID: 1,
        grid_code: 2,
        pointid: 3,
      }
    },
   ];

   let treeFeatures = [
    {
      geometry: {
        type: "point",
        x: 172.639847,
        y: -43.525650,
        z: 30,
      },
      attributes: {
        OBJECTID: 0,
        Tree_Height: 0,
        Tree_H: 0
      }
    }
   ]

    // let clientData
    // let query = serverlayer.createQuery();
    // // query.geometry = view.toMap(event);  // the point location of the pointer
    // query.distance = 20;
    // query.units = "kilometers";
    // query.spatialRelationship = "intersects";  // this is the default
    // query.returnGeometry = true;
    // console.log(query)
    // serverlayer.queryFeatures(query)
    // .then(function(response) {
    //     clientData = {
    //         addFeatures: response.features
    //     }
    // })

  let treeClientLayer = new FeatureLayer({
    source: treeFeatures,
    fields: [{
      name: "OBJECTID",
      type: "oid"
    },
    {
      name: "Tree_Height",
      type: "string"
    },
    {
      name: "Tree_H",
      type: "double"
    }
  ],
  objectIdField: "OBJECTID",
  elevationInfo: {
    mode: "on-the-ground",
    offset: 0,
  },
  renderer: treeRenderer
  }) 
  view.map.add(treeClientLayer)

  var clientlayer =  new FeatureLayer({
    source: heatIslandfeatures,
    // portalItem: {id: "3ca3220e1e894b8cb80c4dbab9ecbe7c"},
    objectIdField: "OBJECTID",
    fields: [{
      name: "OBJECTID",
      type: "oid"
    },
    {
      name: "grid_code",
      type:"single"},
    {
      name: "pointid",
      type: "integer"
    }
  ],
  objectIfField: "OBJECTID",
  elevationInfo: {
    mode: "absolute-height",
    offset: 50,
    // featureExpressionInfo: {
    //     expression: "Geometry($feature).z * 10"
    //   },
    unit: "meters"
  },
  renderer: renderer
  });
  view.map.add(clientlayer)
  
//   .then(() => {


//     console.log("loaded")
//     let query = serverlayer.createQuery();
//     query.geometry = view.toMap(event);  // the point location of the pointer
//     query.distance = 20;
//     query.units = "kilometers";
//     query.spatialRelationship = "intersects";  // this is the default
//     query.returnGeometry = true;
//     console.log(query)
//     serverlayer.queryFeatures(query)
//     .then(function(response) {
//         const edits = {
//             addFeatures: response.features
//         }
//         clientlayer.applyEdits(edits)
//     })
// })
  
// view.on("click", function(event){
//     let query = serverlayer.createQuery();
//     query.geometry = view.toMap(event);  // the point location of the pointer
//     query.distance = 2;
//     query.units = "miles";
//     query.spatialRelationship = "intersects";  // this is the default
//     query.returnGeometry = true;
  
//     serverlayer.queryFeatures(query)
//       .then(function(response){
//         console.log("query complete")
//         console.log(response.features[0].attributes)
//         clientlayer.applyEdits({addFeatures:response.features});
//       });
//   });

    // map.when(() => {


    //     console.log("loaded")
    //     let query = serverlayer.createQuery();
    //     query.geometry = view.toMap(event);  // the point location of the pointer
    //     query.distance = 20;
    //     query.units = "kilometers";
    //     query.spatialRelationship = "intersects";  // this is the default
    //     query.returnGeometry = true;
    //     console.log(query)
    //     serverlayer.queryFeatures(query)
    //     .then(function(response) {
    //         const edits = {
    //             addFeatures: response.features
    //         }
    //         clientlayer.applyEdits(edits)
    //     })
    // })

    
    // let dataBtn = document.getElementById("getData")
    let dataBtn = document.querySelector("#getData")
    
    dataBtn.addEventListener("click", (event) => {
      console.log("clicked")
      // heat island query
      let query = serverlayer.createQuery();
      query.geometry = view.toMap(event);  // the point location of the pointer
      query.distance = 100;
      query.units = "kilometers";
      query.spatialRelationship = "intersects";  // this is the default
      query.returnGeometry = true;
      // console.log(query)
      serverlayer.queryFeatures(query)
      .then(function(response) {
          const edits = {
              addFeatures: response.features
          }
          clientlayer.applyEdits(edits)
          console.log(clientlayer)
          clientlayer.elevationInfo = {
            mode: "absolute-height",
            offset: 50,
            // featureExpressionInfo: {
            //     expression: "Geometry($feature).z * 10"
            //   },
            unit: "meters"
          }
      })

      // tree query
      let treeQuery = treeLayer.createQuery();
      treeQuery.geometry = view.toMap(event);  // the point location of the pointer
      treeQuery.distance = 100;
      treeQuery.units = "kilometers";
      treeQuery.spatialRelationship = "intersects";  // this is the default
      treeQuery.returnGeometry = true;
      // console.log(treeQuery)
      treeLayer.queryFeatures(treeQuery)
      .then(function(response) {
          const edits = {
              addFeatures: response.features
          }
          treeClientLayer.applyEdits(edits)
          console.log(treeClientLayer)
      })
    })

    view.when(() => {
      console.log("view when")
      view.popupEnabled = false; //disable popups
      // Create the Editor
      const editor = new Editor({
        view: view
      });
      // Add widget to top-right of the view
      view.ui.add(editor, "top-right");



      // editor.viewModel.featureTemplatesViewModel.watch("select", (e) => {
      //   console.log("---")
      //   console.log(e)
      // })

      // preset variables for selecting update feature
      let prevState = null
      let currState = "ready"
      let selectedFeature = null
      let selectedFeatureCopy = null

      // watch for state change of editor
      editor.viewModel.watch("state", (state) => {
        console.log("state")
        console.log(editor)
        console.log(state)


        if (state == "awaiting-feature-to-update") {
          // waiting for feature to be selected 

          // console.log("awaiting state")
          prevState = currState
          currState = state
          // console.log(prevState)
          // console.log(currState)
          
          if (prevState == "editing-existing-feature") {
            // finished editing selected feature
            console.log("update heat island")
            // update heat islands

            // query heat island points at original tree position
            let oldPosQuery = clientlayer.createQuery()
            let oldPoint = new Point()
            oldPoint.longitude = selectedFeatureCopy.geometry.longitude
            oldPoint.latitude = selectedFeatureCopy.geometry.latitude
            oldPosQuery.geometry = oldPoint
            oldPosQuery.distance = 10
            oldPosQuery.units = "meters"
            oldPosQuery.spatialRelationship = "intersects"
            oldPosQuery.returnGeometry = true

            // run query
            clientlayer.queryFeatures(oldPosQuery).then(function (response) {
              // add value to all points in that area (make hotter)
              console.log("old spot query")
              console.log(response)
              let oldSpotFeatures = JSON.parse(JSON.stringify(response.features));
              console.log(oldSpotFeatures)
              for (let i = 0; i < oldSpotFeatures.length; i++) {
                let editFeature = response.features[i];
                // console.log(editFeature)
                editFeature.attributes.grid_code = editFeature.attributes.grid_code + 5

                let edits = {
                    updateFeatures: [editFeature]
                };

                clientlayer.applyEdits(edits)
                    .then(function(result) {
                        // console.log("oldpos clientlayer applyEdits success:", result);
                        // console.log("added initial pos")
                        // console.log(initialPos)
                        // initialPos = null
                    })
                    .catch(function(error) {
                        console.error("oldpos clientlayer applyEdits error:", error);
                    });
              }
          })

          // query heat island points at new tree position
          let newPosQuery = clientlayer.createQuery()
          let newPoint = new Point()
          newPoint.longitude = selectedFeature.geometry.longitude
          newPoint.latitude = selectedFeature.geometry.latitude
          newPosQuery.geometry = newPoint
          newPosQuery.distance = 10
          newPosQuery.units = "meters"
          newPosQuery.spatialRelationship = "intersects"
          newPosQuery.returnGeometry = true
          // console.log(newPosQuery)

          // run query
          clientlayer.queryFeatures(newPosQuery).then(function (response) {
            // subtract value to all points in that area (make cooler)
            console.log("new spot query")
            console.log(response)
            let newSpotFeatures = JSON.parse(JSON.stringify(response.features));
            console.log(newSpotFeatures)
            for (let i = 0; i < newSpotFeatures.length; i++) {
              let editFeature = response.features[i];
              console.log(editFeature)
              editFeature.attributes.grid_code = editFeature.attributes.grid_code - 5

              let edits = {
                  updateFeatures: [editFeature]
              };

              clientlayer.applyEdits(edits)
                  .then(function(result) {
                      // console.log("newpos clientlayer applyEdits success:", result);
                      // console.log("added new pos")
                      // console.log(newPos)
                      // newPos = null
                  })
                  .catch(function(error) {
                      console.error("newpos clientlayer applyEdits error:", error);
                  });
            }
          })

        
        }
      } else if (state == "editing-existing-feature") {
        // currently editing tree position

      // if (state != "awaiting-feature-to-update")
        console.log("editing existing")
        // console.log(editor)
        prevState = currState
        currState = state
        selectedFeature = editor.viewModel.featureFormViewModel.feature
        selectedFeatureCopy = esriLang.clone(editor.viewModel.featureFormViewModel.feature)

    } else if (state == "creating-features") {
      console.log("new tree")
      console.log(editor)
      prevState = currState
      currState = state
      console.log(editor.activeWorkflow.createFeatureState)
      editor.viewModel.featureFormViewModel.watch("feature", (feature) => {
        console.log("feature set")
        console.log(feature)
        feature.attributes.Tree_Height = String(feature.attributes.Tree_H)

        selectedFeature = feature
        selectedFeatureCopy = esriLang.clone(feature)

      })
      editor.activeWorkflow.on("commit", (f) => {
        console.log("commit")
        // console.log(f)

        let newTreeQuery = clientlayer.createQuery()
        let newTreePoint = new Point()
        newTreePoint.longitude = selectedFeature.geometry.longitude
        newTreePoint.latitude = selectedFeature.geometry.latitude
        newTreeQuery.geometry = newTreePoint
        newTreeQuery.distance = 10
        newTreeQuery.units = "meters"
        newTreeQuery.spatialRelationship = "intersects"
        newTreeQuery.returnGeometry = true
        // console.log(newTreeQuery)

        // run query
        clientlayer.queryFeatures(newTreeQuery).then(function (response) {
        // subtract value to all points in that area (make cooler)
        console.log("new spot query")
        console.log(response)
        let newSpotFeatures = JSON.parse(JSON.stringify(response.features));
        console.log(newSpotFeatures)
        for (let i = 0; i < newSpotFeatures.length; i++) {
            let NewFeature = response.features[i];
            console.log(NewFeature)
            NewFeature.attributes.grid_code = NewFeature.attributes.grid_code - 5

            let edits = {
                updateFeatures: [NewFeature]
            };

            clientlayer.applyEdits(edits)
                .then(function(result) {
                    // console.log("newpos clientlayer applyEdits success:", result);
                    // console.log("added new pos")
                    // console.log(newPos)
                    // newPos = null
                })
                .catch(function(error) {
                    console.error("newpos clientlayer applyEdits error:", error);
                });
        }
        })

      })

      
    }
  })


    

      view.on("click", function (event) {
      //     let screenPoint = {
      //         x: event.x,
      //         y: event.y
      //     }



      //     // search for graphics at clicked location
      //     view.hitTest(screenPoint).then(function (response) {
      //         if (response.results.length) {
      //             let graphic = response.results.filter(function (result) {
      //                 // check if the graphic belongs to the layer of interest
      //                 return result.graphic.layer === treeLayer
      //             })[0].graphic

      //             console.log("tree clicked")
      //             console.log(graphic)

                  // let query = clientlayer.createQuery();
                  // query.geometry = view.extent
                  // // query.geometry = view.toMap(event);  // the point location of the pointer
                  // // query.distance = 20;
                  // // query.units = "meters";
                  // query.spatialRelationship = "intersects";  // this is the default
                  // query.returnGeometry = true;
              
                  // clientlayer.queryFeatures(query)
                  // .then(function(response){
                  //     console.log("query complete");
                  //     let newFeatureValues = JSON.parse(JSON.stringify(response.features));
                  //     console.log(response.features);

                  //     for (let i = 0; i < newFeatureValues.length; i++) {
                  //         newFeatureValues[i].attributes.grid_code = newFeatureValues[i].attributes.grid_code - 4;
                  //     }
                  //     console.log(newFeatureValues);

                  //     for (let i = 0; i < newFeatureValues.length; i++) {
                  //       let editFeature = response.features[i];
                  //       editFeature.attributes.grid_code = newFeatureValues[i].attributes.grid_code;

                  //       let edits = {
                  //           updateFeatures: [editFeature]
                  //       };

                  //       clientlayer.applyEdits(edits)
                  //           .then(function(result) {
                  //               console.log("clientlayer applyEdits success:", result);
                  //           })
                  //           .catch(function(error) {
                  //               console.error("clientlayer applyEdits error:", error);
                  //           });

                  //       serverlayer.applyEdits(edits)
                  //           .then(function(result) {
                  //               console.log("serverlayer applyEdits success:", result);
                  //           })
                  //           .catch(function(error) {
                  //               console.error("serverlayer applyEdits error:", error);
                  //           });
                  //     }

                      
                      
                  // })
                  // .catch(function(error) {
                  //     console.error("queryFeatures error:", error);
                  // });

              // }
          // })
      })
    });  

  })
