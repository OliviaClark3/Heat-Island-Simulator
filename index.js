// display with only trees added

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
    "esri/layers/SceneLayer",
    "esri/widgets/Sketch",
    "esri/layers/GraphicsLayer",
    "esri/smartMapping/renderers/heatmap"
  ], (Map, SceneView, FeatureLayer, WebStyleSymbol, Editor, reactiveUtils, Edits, UpdateWorkflow, Point, SketchViewModel, esriLang, esriConfig, WebScene, SceneLayer, Sketch, GraphicsLayer, heatmapRendererCreator) => {

    const graphicsLayer = new GraphicsLayer({
      elevationInfo: {
        mode: "on-the-ground",
        // offset: 1000,
        // // featureExpressionInfo: {
        // //     expression: "Geometry($feature).z * 10"
        // //   },
        // unit: "meters"
      },
    })

    const map = new Map({
        // basemap options: "satellite", "hybrid", "terrain", "oceans", "osm", "dark-gray-vector", "gray-vector", "streets-vector", "topo-vector", "streets-night-vector", "streets-relief-vector", "streets-navigation-vector"
        basemap: "osm",
        ground: "world-elevation",
        layers: [graphicsLayer],
    })

    // const scene = new WebScene({
    //     portalItem: {
    //         id: "1391de91c243480f8ab34a3007e55a69"
    //     }
    // })
    
  const view = new SceneView({
    container: "viewDiv",
    map: map,
  
    viewingMode: "global",
    camera: {
      position: {
        x: 175.277258,  // Hamilton
        y: -37.807704,
        z: 200,
        // x: 174.775103, //Wellington
        // y: -41.288426,
        // z: 200,
      },
    },
  });

  // const colors = ["rgba(115, 0, 115, 0)", "#820082", "#910091", "#a000a0", "#af00af", "#c300c3", "#d700d7", "#eb00eb", "#ff00ff", "#ff58a0", "#ff896b", "#ffb935", "#ffea00"];
  // const colors = ["#EAF0F7", "#D7E1EE", "#CBD6E4", "#BFCBDB", "#B3BFD1", "#A7B4C7", "#A4A2A8", "#DF8879", "#C86558", "#B04238", "#991F17", "#8A150D", "#6B0B04"];
  // const colors = ["rgba(255, 185, 80, 0)", "#820082", "#910091", "#a000a0", "#af00af", "#c300c3", "#d700d7", "#eb00eb", "#ff00ff", "#ff58a0", "#ff896b", "#ffb935", "#ffea00"]
  // const colors = ["rgba(122, 1, 3, 0)", "rgba(142, 1, 3, 1)", "rgba(165, 1, 4, 1)", "rgba(184, 23, 2, 1)", "rgba(236, 63, 19, 1)", "rgba(250, 94, 31, 1)", "rgba(255, 126, 51, 1)", "rgba(255, 147, 31, 1)", "rgba(255, 173, 51, 1)", "rgba(255, 185, 80, 1)"]

  let renderer = {
    type: "heatmap",
    field: "heat",
    // colorStops: [
    //   { ratio: 0, color: "rgba(255, 255, 255, 0)" },
    //   { ratio: 0.2, color: "rgba(255, 255, 255, 1)" },
    //   { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
    //   { ratio: 0.8, color: "rgba(255, 140, 0, 1)" },
    //   { ratio: 1, color: "rgba(255, 0, 0, 1)" }
    // ],
    // colorStops: [
    //   { ratio: 0, color: "rgba(255, 0, 0, 0)" },
    //   { ratio: 0.2, color: "rgba(255, 140, 0, 1)" },
    //   { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
    //   { ratio: 0.8, color: "rgba(255, 255, 255, 1)" },
    //   { ratio: 1, color: "rgba(255, 255, 255, 0)" }
    // ],
    minDensity: 0,
    maxDensity: 0.04625,
    radius: 18,
    // referenceScale: 1200
    // colorStops: [
    //   { color: colors[0], ratio: 0 },
    //   { color: colors[1], ratio: 0.083 },
    //   { color: colors[2], ratio: 0.166 },
    //   { color: colors[3], ratio: 0.249 },
    //   { color: colors[4], ratio: 0.332 },
    //   { color: colors[5], ratio: 0.415 },
    //   { color: colors[6], ratio: 0.498 },
    //   { color: colors[7], ratio: 0.581 },
    //   { color: colors[8], ratio: 0.664 },
    //   { color: colors[9], ratio: 0.747 },
    //   { color: colors[10], ratio: 0.83 },
    //   { color: colors[11], ratio: 0.913 },
    //   { color: colors[12], ratio: 1 }
    // ],
    // colorStops: [
    //   { color: colors[0], ratio: 0 },
    //   { color: colors[1], ratio: 0.11 },
    //   { color: colors[2], ratio: 0.22 },
    //   { color: colors[3], ratio: 0.33 },
    //   { color: colors[4], ratio: 0.44 },
    //   { color: colors[5], ratio: 0.55 },
    //   { color: colors[6], ratio: 0.66 },
    //   { color: colors[7], ratio: 0.77 },
    //   { color: colors[8], ratio: 0.88 },
    //   { color: colors[9], ratio: 0.99 },
    //   { color: colors[10], ratio: 1 }
    // ],
    // colorStops: [
      // { ratio: 0, color: "rgba(255, 0, 0, 1)" },
      // { ratio: 0.2, color: "rgba(255, 140, 0, 1)" },
      // { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
      // { ratio: 0.8, color: "rgba(255, 255, 255, 1)" },
      // { ratio: 1, color: "rgba(255, 255, 255, 0)" }
      // { ratio: 0, color: "rgba(255, 255, 255, 0)" },
      // { ratio: 0.1, color: "rgba(255, 255, 255, 1)" },
      // { ratio: 0.2, color: "rgba(255, 255, 0, 1)" },
      // { ratio: 0.3, color: "rgba(255, 195, 0, 1)" },
      // { ratio: 0.5, color: "rgba(255, 140, 0, 1)" },
      // { ratio: 0.7, color: "rgba(255, 95, 0, 1)" },
      // { ratio: 0.8, color: "rgba(255, 50, 0, 1)" },
      // { ratio: 1, color: "rgba(255, 0, 0, 1)" }
    // ],
    colorStops: [
      {ratio: 0, color: "rgba(255, 185, 80, 0)"},
      {ratio: 0.11, color: "rgba(255, 173, 51, 1)"},
      {ratio: 0.22, color: "rgba(255, 147, 31, 1)"},
      {ratio: 0.33, color: "rgba(255, 126, 51, 1)"},
      {ratio: 0.44, color: "rgba(250, 94, 31, 1)"},
      {ratio: 0.55, color: "rgba(236, 63, 19, 1)"},
      {ratio: 0.66, color: "rgba(184, 23, 2, 1)"},
      {ratio: 0.77, color: "rgba(165, 1, 4, 1)"},
      {ratio: 0.88, color: "rgba(142, 1, 3, 1)"},
      {ratio: 1, color: "rgba(122, 1, 3, 1)"},
    ],
    referenceScale: 250,
    // // radius: 2.5,
    // maxDensity: 6,
    // minDensity: 0,
    // elevationInfo: {
    //     mode: "absolute-height",
    //     offset: 50,
    //     // featureExpressionInfo: {
    //     //     expression: "Geometry($feature).z * 10"
    //     //   },
    //     unit: "meters"
    //   },
  };

  // let treeType = "Populus"

  const treeRenderer = {
    type: "simple",  // autocasts as new SimpleRenderer()
    symbol: {
      type: "web-style",  // autocasts as new WebStyleSymbol()
      styleName: "EsriRealisticTreesStyle",
      name: "Populus"
    },
    label: "generic tree",
    visualVariables: [{
      type: "size",
      axis: "height",
      field: "Tree_H",
      valueUnit: "meters"
    }]
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
        // id: "04be9f93876e48fab0b341b213a2c452"
        // id: "fd184dff273c497ea15df63f3e56c40f"
        id: "72c9f18c98f047a2815972b9b1628a84"
    },
    // url: "https://services.arcgis.com/hLRlshaEMEYQG5A8/arcgis/rest/services/HamiltonTreesWithRemovedFeatures/FeatureServer",
    renderer: treeRenderer,
    elevationInfo: {
      mode: "on-the-ground",
    },
  })
  // view.map.add(treeLayer)

  // const heatmapRenderer =  {
  //   type: "unique-value",
  //   field: "MERGE_SRC",
  //   defaultSymbol: { type: "simple-marker" },
  //   visualVariables: [{
  //     type: "color",
  //     field: "grid-code",
  //     // stops: [
  //     //   { value: 7, color: "rgba(255, 255, 255, 0)" },
  //     //   { value: 8, color: "rgba(255, 255, 255, 1)" },
  //     //   { value: 9, color: "rgba(255, 140, 0, 1)" },
  //     //   { value: 10, color: "rgba(255, 140, 0, 1)" },
  //     //   { value: 12, color: "rgba(255, 0, 0, 1)" }
  //     // ],
  //     stops: [
  //       {value: 5, color: "rgba(255, 185, 80, 0)"},
  //       {value: 6, color: "rgba(255, 173, 51, 1)"},
  //       {value: 7, color: "rgba(255, 147, 31, 1)"},
  //       {value: 8, color: "rgba(255, 126, 51, 1)"},
  //       {value: 9, color: "rgba(250, 94, 31, 1)"},
  //       {value: 10, color: "rgba(236, 63, 19, 1)"},
  //       {value: 11, color: "rgba(184, 23, 2, 1)"},
  //       {value: 12, color: "rgba(165, 1, 4, 1)"},
  //       {value: 13, color: "rgba(142, 1, 3, 1)"},
  //       {value: 14, color: "rgba(122, 1, 3, 1)"},
  //     ],

  //   }],
    
  // }
  
  var serverlayer = new FeatureLayer({
        // portalItem: {id: "0c208681a2cc45008fda14d07ac0ae5f"},
        // portalItem: {id: "ff96fad91ace46879bcdf9837cb9f94c"},
        // portalItem: {id: "e9d165e2f02f440d8b1f67fc3e8d51be"},
        // portalItem: {id: "dc2f915b424541a9bf26d097ad5141a8"},
        // portalItem: {id: "729dc331b1424094b73e377536dda7ae"},
        // portalItem: {id: "b87a0d2e0f974f81b0bb8f87b9b23cd0"},
        // portalItem: {id: "b87a0d2e0f974f81b0bb8f87b9b23cd0"},

        portalItem: {
          id: "b405f0690fbb48a2bd9c779b14e4e445"
        },
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
        grid_code: 1,
        pointid: 1,
        MERGE_SRC: "1",
        mergeSrc: 1,
        heat: 1,
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
      type: "integer"},
    {
      name: "pointid",
      type: "integer"
    },
    {
      name: "MERGE_SRC",
      type: "string"
    },
    {
      name: "mergeSrc",
      type: "integer"
    },
    {
      name: "heat",
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

  // let heatmapParams = {
  //   layer: clientlayer,
  //   view: view,
  //   field: "grid_code"
  // };
  // heatmapRendererCreator.createRenderer(heatmapParams)
  // .then(function(response){
  //   clientlayer.renderer = response.renderer;
  // });
  

  let numTempBuffers = 3 //7    // number of radius (or diameter) buffers around tree for temp change
  let tempChange = 4;   // temperature change from middle of tree, used to calculate surrounding temperature change

  // document.querySelector("#treeImpactBuffer").value = numTempBuffers
  // document.querySelector("#treeCoolingTemperature").value = tempChange

  document.querySelector("#showBuffer").innerHTML = numTempBuffers * 3
  document.querySelector("#showTemp").innerHTML = tempChange


  const updateTreeSurroundExecuteQuery = (query, direction, i, changeTempSoFar) => {
    let editFeature
    clientlayer.queryFeatures(query).then(function (response) {
      // add value to all points in that area (make hotter)
      // console.log("query spot")
      // console.log(response)
      let oldSpotFeatures = JSON.parse(JSON.stringify(response.features));
      // console.log(oldSpotFeatures)
      // let editFeature
      for (let j = 0; j < oldSpotFeatures.length; j++) {
        editFeature = response.features[j];
        // console.log(editFeature)
        if (direction == "warmer") {
          // console.log("amount added", (((tempChange / i) - changeTempSoFar)))
          editFeature.attributes.heat = editFeature.attributes.heat + ((tempChange / i))// - changeTempSoFar)
        } else if (direction == "cooler") {
          // console.log("amount subbed", (((tempChange / i) - changeTempSoFar)))
          // if (editFeature.attributes.heat - 0.5 > 0) {
          //   editFeature.attributes.heat = editFeature.attributes.heat - 0.5
          // } else {
          //   editFeature.attributes.heat = editFeature.attributes.heat - ((tempChange / i) - changeTempSoFar)
          // }
          editFeature.attributes.heat = editFeature.attributes.heat - ((tempChange / i))// - changeTempSoFar)
          
        } else {
          console.log("error, invalid direction")
        }

        let edits = {
            updateFeatures: [editFeature]
        };

        clientlayer.applyEdits(edits)
            .then(function(result) {
                if (j == oldSpotFeatures.length - 1) {
                  // console.log("applyEdits success")
                }
                // console.log("applyEdits success")
                // console.log("oldpos clientlayer applyEdits success:", result, i);
                // console.log("added initial pos")
                // console.log(initialPos)
                // initialPos = null
            })
            .catch(function(error) {
                // console.error("oldpos clientlayer applyEdits error:", error, i);
            });
        }
    })
  }

  const updateTreeSurround = (location, direction) => {
    // console.log("update tree surround")
    // console.log(location)
    // console.log(direction)
    // console.log(numTempBuffers)
    // console.log(tempChange)

    let changeTempSoFar = 0

    // let editFeature

    for (let i = numTempBuffers; i > 0; i--) {
      // console.log("loop ", i)
      // console.log(direction)
      // console.log(location.geometry.latitude)
      // console.log(location.geometry.longitude)
      let query = clientlayer.createQuery()
      let point = new Point()
      point.longitude = location.geometry.longitude
      point.latitude = location.geometry.latitude
      query.geometry = point
      query.distance = i * 3
      query.units = "meters"
      query.spatialRelationship = "intersects"
      query.returnGeometry = true

      updateTreeSurroundExecuteQuery(query, direction, i, changeTempSoFar)

      changeTempSoFar = tempChange / i
    }
    
    

  }

  let treeSelect = document.getElementById("selectTree")
  treeSelect.addEventListener("change", (event) => {
    let treeType
    if (treeSelect.value == "Populus") {
      console.log("Populus")
      // numTempBuffers = 7
      numTempBuffers = 3
      tempChange = 4
      treeType = "Populus"
    } else if (treeSelect.value == "Tilia") {
      console.log("Tilia")
      // numTempBuffers = 5
      // tempChange = 2
      treeType = "Tilia"
    } else if (treeSelect.value == "Eucalyptus") {
      console.log("Eucalyptus")
      // numTempBuffers = 10
      numTempBuffers = 4
      // tempChange = 4.5
      treeType = "Eucalyptus"
    }
    // update renderer
    let newRenderer = treeClientLayer.renderer.clone()
    newRenderer.symbol = {
      type: "web-style",  // autocasts as new WebStyleSymbol()
      styleName: "EsriRealisticTreesStyle",
      name: treeType
    }
    treeClientLayer.renderer = newRenderer
    document.querySelector("#showBuffer").innerHTML = numTempBuffers * 3
    document.querySelector("#showTemp").innerHTML = tempChange
  })


  // let updateValuesBtn = document.querySelector("#updateValues")
  // updateValuesBtn.addEventListener("click", (event) => {
  //   console.log("update buffer")
  //   numTempBuffers = parseInt(document.querySelector("#treeImpactBuffer").value)
  //   tempChange = parseInt(document.querySelector("#treeCoolingTemperature").value)
  //   document.querySelector("#showBuffer").innerHTML = numTempBuffers
  //   document.querySelector("#showTemp").innerHTML = tempChange
  // })

  // let tempUpdateBtn = document.querySelector("#updateTemperatureButton")
  // tempUpdateBtn.addEventListener("click", (event) => {
  //   console.log("update temp")
  //   tempChange = parseInt(document.querySelector("#treeCoolingTemperature").value)
  //   document.querySelector("#showTemp").innerHTML = tempChange
  // })

    
  let treeBtn = document.querySelector("#addTrees")
  treeBtn.addEventListener("click", (event) => {
    console.log("adding trees")
    // tree query
    let treeQuery = treeLayer.createQuery();
    // treeQuery.geometry = view.toMap(event);  // the point location of the pointer
    treeQuery.geometry = graphicsLayer.graphics.items[graphicsLayer.graphics.items.length - 1].geometry
    treeQuery.distance = 100;
    treeQuery.units = "meters";
    treeQuery.spatialRelationship = "intersects";  // this is the default
    treeQuery.returnGeometry = true;
    // console.log(treeQuery)
    treeLayer.queryFeatures(treeQuery)
    .then(function(response) {
      console.log(response)
      // for (let i = 0; i < response.features.length; i++) {
      //   response.features[i].symbol =  {
      //     type: "web-style",  // autocasts as new WebStyleSymbol()
      //     styleName: "EsriRealisticTreesStyle",
      //     name: "Unknown"
      //   }
      // }
        const edits = {
            addFeatures: response.features
        }
        treeClientLayer.applyEdits(edits).then(() => {
          console.log("then")
          for (let i = 0; i < response.features.length; i++) {
            updateTreeSurround(response.features[i], "cooler")
          }
          console.log("done")
        })
        console.log(treeClientLayer)
    })
  })
  


    // let dataBtn = document.getElementById("getData")
    let dataBtn = document.querySelector("#getData")
    
    dataBtn.addEventListener("click", (event) => {
      console.log("clicked")
      // heat island query
      let query = serverlayer.createQuery();
      query.geometry = graphicsLayer.graphics.items[graphicsLayer.graphics.items.length - 1].geometry
      // query.geometry = view.toMap(event);  // the point location of the pointer
      query.distance = 100;
      query.units = "meters";
      query.spatialRelationship = "intersects";  // this is the default
      query.returnGeometry = true;
      query.maxRecordCountFactor = 5
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

    })

    view.when(() => {


      // view.on("click", (event) => {
      //   console.log("view click")
      //   let query = serverlayer.createQuery();
      // // query.geometry = graphicsLayer.graphics.items[0].geometry
      // query.geometry = view.toMap(event);  // the point location of the pointer
      // query.distance = 1000;
      // query.units = "meters";
      // query.spatialRelationship = "intersects";  // this is the default
      // query.returnGeometry = true;
      // // console.log(query)
      // serverlayer.queryFeatures(query)
      // .then(function(response) {
      //     const edits = {
      //         addFeatures: response.features
      //     }
      //     clientlayer.applyEdits(edits)
      //     console.log(clientlayer)
      //     clientlayer.elevationInfo = {
      //       mode: "absolute-height",
      //       offset: 50,
      //       // featureExpressionInfo: {
      //       //     expression: "Geometry($feature).z * 10"
      //       //   },
      //       unit: "meters"
      //     }
      // })
      // })



      console.log("view when")
      view.popupEnabled = false; //disable popups
      // Create the Editor
      const editor = new Editor({
        view: view
      });
      // Add widget to top-right of the view
      view.ui.add(editor, "top-right");
      console.log(editor.viewModel.featureTemplatesViewModel.layers)

      const sketch = new Sketch({
        view: view,
        layer: graphicsLayer,
        creationMode: "update",
        availableCreateTools: ["point"],
        creationMode: "single",
        defaultCreatOptions: ["freehand"],

      })
      view.ui.add(sketch, "bottom-right");

      console.log("editor")
      console.log(editor)
      console.log(editor.viewModel.featureTemplatesViewModel.items)
      console.log("sketch")
      console.log(sketch)

      sketch.on("create", (event) => {
        console.log("created")
        console.log(event)
        console.log(graphicsLayer)
      })


      // preset variables for selecting update feature
      // let prevState = null
      // let currState = "ready"
      let selectedFeature = null
      let selectedFeatureCopy = null

      // watch for state change of editor
      editor.viewModel.watch("state", (state) => {
        console.log("state")
        console.log(editor)
        console.log(state)

        if (state == "awaiting-update-feature-candidate") {
          console.log("awaiting candidate")
          console.log(editor)
        }

        if (state == "editing-existing-feature") {
          // currently editing tree position

        // if (state != "awaiting-feature-to-update")
          console.log("editing existing")
          console.log(editor)
          // prevState = currState
          // currState = state
          selectedFeature = editor.viewModel.featureFormViewModel.feature
          selectedFeatureCopy = esriLang.clone(editor.viewModel.featureFormViewModel.feature)

          editor.activeWorkflow.on("commit",() => {
            console.log("update heat island")
            updateTreeSurround(selectedFeatureCopy, "warmer")
            updateTreeSurround(selectedFeature, "cooler")
          })

        } else if (state == "creating-features") {
          console.log("new tree")
          console.log(editor)
          // editor.viewModel.SketchViewModel.createGraphic.symbolLayers[0].height = 7
          // prevState = currState
          // currState = state
          selectedFeature = null
          selectedFeatureCopy = null
          console.log(editor.activeWorkflow.createFeatureState)
          editor.viewModel.featureFormViewModel.watch("feature", (feature) => {
            console.log("feature set")
            console.log(feature)
            feature.attributes.Tree_H = 6.0
            // feature.attributes.Tree_Height = String(feature.attributes.Tree_H)

            selectedFeature = feature
            selectedFeatureCopy = esriLang.clone(feature)

          })
          editor.activeWorkflow.on("commit", (f) => {
            console.log("commit")
            // console.log(f)
            updateTreeSurround(selectedFeature, "cooler")


          })

          
        }
    })


      // view.watch("scale", (scale) => {
      //   console.log("scale")
      //   console.log(scale)
      //   // console.log(view.)
      // })

    });  

  })
