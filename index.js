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
  "esri/smartMapping/renderers/heatmap",
  "esri/widgets/Legend",
], (
  Map,
  SceneView,
  FeatureLayer,
  WebStyleSymbol,
  Editor,
  reactiveUtils,
  Edits,
  UpdateWorkflow,
  Point,
  SketchViewModel,
  esriLang,
  esriConfig,
  WebScene,
  SceneLayer,
  Sketch,
  GraphicsLayer,
  heatmapRendererCreator,
  Legend
) => {

  let addedHeatPoints = []

  const graphicsLayer = new GraphicsLayer({
    elevationInfo: {
      mode: "on-the-ground",
    },
  });

  const map = new Map({
    // basemap options: "satellite", "hybrid", "terrain", "oceans", "osm", "dark-gray-vector", "gray-vector", "streets-vector", "topo-vector", "streets-night-vector", "streets-relief-vector", "streets-navigation-vector"
    basemap: "osm",
    ground: "world-elevation",
    layers: [graphicsLayer],
  });

  const view = new SceneView({
    container: "viewDiv",
    map: map,

    viewingMode: "global",
    camera: {
      position: {
        x: 175.277258, // Hamilton
        y: -37.807704,
        z: 200,
      },
    },
  });

  let renderer = {
    type: "heatmap",
    field: "heatValue",
    minDensity: 0,
    maxDensity: 0.04625,
    radius: 18,
    colorStops: [
      { ratio: 0, color: "rgba(255, 185, 80, 0)" },
      { ratio: 0.11, color: "rgba(255, 173, 51, 1)" },
      { ratio: 0.22, color: "rgba(255, 147, 31, 1)" },
      { ratio: 0.33, color: "rgba(255, 126, 51, 1)" },
      { ratio: 0.44, color: "rgba(250, 94, 31, 1)" },
      { ratio: 0.55, color: "rgba(236, 63, 19, 1)" },
      { ratio: 0.66, color: "rgba(184, 23, 2, 1)" },
      { ratio: 0.77, color: "rgba(165, 1, 4, 1)" },
      { ratio: 0.88, color: "rgba(142, 1, 3, 1)" },
      { ratio: 1, color: "rgba(122, 1, 3, 1)" },
    ],
    radius: 11,
    referenceScale: 5000,
    maxDensity: 100000,
    minDensity: 0,
  };

  // let treeType = "Populus"

  const treeRenderer = {
    type: "simple", // autocasts as new SimpleRenderer()
    symbol: {
      type: "web-style", // autocasts as new WebStyleSymbol()
      styleName: "EsriLowPolyVegetationStyle",
      name: "Populus",
    },
    label: "generic tree",
    visualVariables: [
      {
        type: "size",
        axis: "height",
        field: "Tree_H",
        valueUnit: "meters",
      },
    ],
  };

  // Create the renderer and configure visual variables
  const buildingRenderer = {
    type: "simple", // autocasts as new SimpleRenderer()
    // Add a default MeshSymbol3D. The color will be determined
    // by the visual variables
    symbol: {
      type: "mesh-3d",
      symbolLayers: [
        {
          type: "fill",
          material: {
            color: "#ffffff",
            colorMixMode: "replace",
          },
          edges: {
            type: "solid",
            color: [0, 0, 0, 0.6],
            size: 1.5,
          },
        },
      ],
    },
  };

  const buildingsLayer = new SceneLayer({
    portalItem: {
      // id: "ca0470dbbddb4db28bad74ed39949e25"
      id: "8846020245b340d5b8f8e13f98d65c70",
    },
    popupEnabled: false,
    renderer: buildingRenderer,
  });
  map.add(buildingsLayer);

  const extraBuildingLayer = new SceneLayer({
    portalItem: {
      id: "8b9e48633ef1417e8e5200f2fb3ce872",
    },
    popupEnabled: false,
    renderer: buildingRenderer,
  });
  map.add(extraBuildingLayer);

  // add trees
  var treeLayer = new FeatureLayer({
    portalItem: {
      // id: "04be9f93876e48fab0b341b213a2c452"
      // id: "fd184dff273c497ea15df63f3e56c40f"
      id: "72c9f18c98f047a2815972b9b1628a84",
    },
    // url: "https://services.arcgis.com/hLRlshaEMEYQG5A8/arcgis/rest/services/HamiltonTreesWithRemovedFeatures/FeatureServer",
    renderer: treeRenderer,
    elevationInfo: {
      mode: "on-the-ground",
    },
  });

  var serverlayer = new FeatureLayer({
    portalItem: {
      id: "b33dc90b0852403faaf3df62becea06f",
    },
    renderer: renderer,
    elevationInfo: {
      mode: "absolute-height",
      offset: 50,
      unit: "meters",
    },
  });
  // view.map.add(serverlayer)

  // create a feature map with polygons for initialising building layer
  let buildingfeatures = [
    // needs one dummy point
    {
      geometry: {
        type: "polygon",
        rings: [
          [0, 0], //Longitude, latitude
          [1, 1], //Longitude, latitude
          [1, 0], //Longitude, latitude
        ],
      },
      attributes: { height: 5 },
    },
  ];

  // create a client layer to store updated building data
  var buildingclientlayer = new FeatureLayer({
    title: "Add Buildings",
    source: buildingfeatures,
    objectIdField: "OBJECTID",
    fields: [
      {
        name: "OBJECTID",
        type: "oid",
      },
      {
        name: "height",
        type: "single",
      },
    ],
    // renderer: buildingRenderer,
    renderer: {
      type: "simple", // autocasts as new UniqueValueRenderer()
      symbol: {
        type: "polygon-3d", // autocasts as new PolygonSymbol3D()
        symbolLayers: [
          {
            type: "extrude", // autocasts as new ExtrudeSymbol3DLayer()
            material: {
              color: "FFFFFF",
            },
            edges: {
              type: "solid",
              color: [0, 0, 0, 0.6],
              size: 1.5,
            },
          },
        ],
      },
      visualVariables: [
        {
          type: "size",
          field: "height",
        },
      ],
    },
    elevationInfo: {
      mode: "on-the-ground",
      offset: 0,
    },
  });

  view.map.add(buildingclientlayer);

  let heatIslandfeatures = [
    {
      geometry: {
        type: "point",
        x: 172.639847,
        y: -43.52565,
        z: 30,
      },
      attributes: {
        ObjectID: 1,
        grid_code: 1,
        pointid: 1,
        MERGE_SRC: "1",
        mergeSrc: 1,
        heatValue: 1,
        heatValueSimplified: 1,
      },
    },
  ];

  let treeFeatures = [
    {
      geometry: {
        type: "point",
        x: 172.639847,
        y: -43.52565,
        z: 30,
      },
      attributes: {
        OBJECTID: 0,
        Tree_Height: 0,
        Tree_H: 0,
      },
    },
  ];

  let treeClientLayer = new FeatureLayer({
    title: "Add Trees",
    source: treeFeatures,
    fields: [
      {
        name: "OBJECTID",
        type: "oid",
      },
      {
        name: "Tree_Height",
        type: "string",
      },
      {
        name: "Tree_H",
        type: "double",
      },
    ],
    objectIdField: "OBJECTID",
    elevationInfo: {
      mode: "on-the-ground",
      offset: 0,
    },
    renderer: treeRenderer,
  });
  view.map.add(treeClientLayer);

  var clientlayer = new FeatureLayer({
    source: heatIslandfeatures,
    objectIdField: "OBJECTID",
    fields: [
      {
        name: "OBJECTID",
        type: "oid",
      },
      {
        name: "grid_code",
        type: "integer",
      },
      {
        name: "pointid",
        type: "integer",
      },
      {
        name: "heatValue",
        type: "integer",
      },
      {
        name: "heatValueSimplified",
        type: "single",
      },
    ],
    objectIfField: "OBJECTID",
    elevationInfo: {
      mode: "absolute-height",
      offset: 50,
      unit: "meters",
    },
    renderer: renderer,
  });
  view.map.add(clientlayer);

  let numTempBuffers = 3; //7    // number of radius (or diameter) buffers around tree for temp change
  let tempChange = 4; // temperature change from middle of tree, used to calculate surrounding temperature change

  document.querySelector("#showBuffer").innerHTML = numTempBuffers * 3;
  // document.querySelector("#showTemp").innerHTML = tempChange

  const updateTreeSurroundExecuteQuery = (
    query,
    direction,
    i,
    changeTempSoFar
  ) => {
    let editFeature;
    clientlayer.queryFeatures(query).then(function (response) {
      // add value to all points in that area (make hotter)
      let oldSpotFeatures = JSON.parse(JSON.stringify(response.features));
      // let editFeature
      for (let j = 0; j < oldSpotFeatures.length; j++) {
        editFeature = response.features[j];
        if (direction == "warmer") {
          editFeature.attributes.heatValue =
            editFeature.attributes.heatValue + (tempChange / i) * 300000; // - changeTempSoFar)
        } else if (direction == "cooler") {
          editFeature.attributes.heatValue =
            editFeature.attributes.heatValue - (tempChange / i) * 300000; // - changeTempSoFar)
        } else {
          console.log("error, invalid direction");
        }

        let edits = {
          updateFeatures: [editFeature],
        };

        clientlayer
          .applyEdits(edits)
          .then(function (result) {
            if (j == oldSpotFeatures.length - 1) {
              // console.log("applyEdits success")
            }
          })
          .catch(function (error) {
            // console.error("oldpos clientlayer applyEdits error:", error, i);
          });
      }
    });
  };

  const updateTreeSurround = (location, direction) => {
    let changeTempSoFar = 0;

    // let editFeature

    for (let i = numTempBuffers; i > 0; i--) {
      let query = clientlayer.createQuery();
      let point = new Point();
      point.longitude = location.geometry.longitude;
      point.latitude = location.geometry.latitude;
      query.geometry = point;
      query.distance = i * 3;
      query.units = "meters";
      query.spatialRelationship = "intersects";
      query.returnGeometry = true;

      updateTreeSurroundExecuteQuery(query, direction, i, changeTempSoFar);

      changeTempSoFar = tempChange / i;
    }
  };

  let treeSelect = document.getElementById("selectTree");
  treeSelect.addEventListener("change", (event) => {
    let treeType;
    if (treeSelect.value == "Populus") {
      console.log("Populus");
      // numTempBuffers = 7
      numTempBuffers = 3;
      tempChange = 4;
      treeType = "Populus";
    } else if (treeSelect.value == "Tilia") {
      console.log("Tilia");
      numTempBuffers = 5;
      // tempChange = 2
      treeType = "Tilia";
    } else if (treeSelect.value == "Eucalyptus") {
      console.log("Eucalyptus");
      // numTempBuffers = 10
      numTempBuffers = 7;
      tempChange = 5;
      treeType = "Eucalyptus";
    }
    // update renderer
    let newRenderer = treeClientLayer.renderer.clone();
    newRenderer.symbol = {
      type: "web-style", // autocasts as new WebStyleSymbol()
      styleName: "EsriLowPolyVegetationStyle",
      name: treeType,
    };
    treeClientLayer.renderer = newRenderer;
    document.querySelector("#showBuffer").innerHTML = numTempBuffers * 3;
    // document.querySelector("#showTemp").innerHTML = tempChange
  });

  //  --------------   SUBMIT BUTTON CODE HERE -------------------------
  // let submitBtn = document.querySelector("#submitChanges")
  // submitBtn.addEventListener("click", (event) => {
  //   let query = serverlayer.createQuery();
  //   query.geometry = graphicsLayer.graphics.items[graphicsLayer.graphics.items.length - 1].geometry
  //   query.distance = 100;
  //   query.units = "meters";
  //   query.spatialRelationship = "intersects";  // this is the default
  //   query.returnGeometry = true;
  //   query.maxRecordCountFactor = 5
  //   serverlayer.queryFeatures(query)
  //   .then(function(response) {
  //     const edits = {
  //         updateFeatures: response.features
  //     }
  //     clientlayer.applyEdits(edits)

  //   })
  // })

  let treeBtn = document.querySelector("#addTrees");
  treeBtn.addEventListener("click", (event) => {
    console.log("adding trees");
    // tree query
    let treeQuery = treeLayer.createQuery();
    // treeQuery.geometry = view.toMap(event);  // the point location of the pointer
    treeQuery.geometry =
      graphicsLayer.graphics.items[
        graphicsLayer.graphics.items.length - 1
      ].geometry;
    treeQuery.distance = 50;
    treeQuery.units = "meters";
    treeQuery.spatialRelationship = "intersects"; // this is the default
    treeQuery.returnGeometry = true;
    treeLayer.queryFeatures(treeQuery).then(function (response) {
      console.log(response);
      const edits = {
        addFeatures: response.features,
      };
      treeClientLayer.applyEdits(edits).then(() => {
        console.log("then");
        for (let i = 0; i < response.features.length; i++) {
          // updateTreeSurround(response.features[i], "cooler")
        }
        console.log("done");
      });
      console.log(treeClientLayer);
    });
  });

  let dataBtn = document.querySelector("#getData");

  dataBtn.addEventListener("click", (event) => {
    console.log("clicked");

    // heat island query
    let query = serverlayer.createQuery();
    query.geometry =
      graphicsLayer.graphics.items[
        graphicsLayer.graphics.items.length - 1
      ].geometry;
    // query.geometry = view.toMap(event);  // the point location of the pointer
    query.distance = 50;
    query.units = "meters";
    query.spatialRelationship = "intersects"; // this is the default
    query.returnGeometry = true;
    query.maxRecordCountFactor = 5;
    // query.where =
    // console.log(query)
    serverlayer.queryFeatures(query).then(function (response) {
      const edits = {
        addFeatures: response.features,
      };
      console.log(edits)
      clientlayer.applyEdits(edits);
      console.log(clientlayer);
      clientlayer.elevationInfo = {
        mode: "absolute-height",
        offset: 50,
        // featureExpressionInfo: {
        //     expression: "Geometry($feature).z * 10"
        //   },
        unit: "meters",
      };
    });
  });

  view.when(() => {
    console.log("view when");
    view.popupEnabled = false; //disable popups
    // Create the Editor
    const editor = new Editor({
      view: view,
    });
    // Add widget to top-right of the view
    view.ui.add(editor, "top-right");
    // console.log(editor.viewModel.featureTemplatesViewModel.layers)

    const sketch = new Sketch({
      view: view,
      layer: graphicsLayer,
      creationMode: "update",
      availableCreateTools: ["point"],
      creationMode: "single",
      defaultCreatOptions: ["freehand"],
    });
    view.ui.add(sketch, "bottom-right");

    console.log("editor");
    console.log(editor);
    console.log(editor.viewModel.editableItems.items);

    // editor.container.watch("load", (event) => {
    //   console.log("editor loaded")
    //   console.log(editor)
    // })

    console.log("sketch");
    console.log(sketch);

    sketch.on("create", (event) => {
      console.log("created");
      console.log(event);
      console.log(graphicsLayer);
    });

    // let legend = new Legend({
    //   view: view,
    // })
    // view.ui.add(legend, "bottom-left")
    // console.log("legend")
    // console.log(legend)
    // legend.container.innerHTML = "<div><div class=\"esri-legend__service\" tabindex=\"0\"><div class=\"esri-legend__layer\"><div class=\"esri-legend__layer-table esri-legend__layer-table--size-ramp\"><div class=\"esri-legend__layer-caption\">heatValue</div><div class=\"esri-legend__layer-row\"><div class=\"esri-legend__layer-cell esri-legend__layer-cell--symbols\" style=\"width: 24px;\"><div class=\"esri-legend__ramps\"><div class=\"esri-legend__color-ramp \" style=\"width: 24px; height: 75px; opacity: 1;\"><canvas width=\"24\" height=\"75\" style=\"width: 24px; height: 75px;\"></canvas></div></div></div><div class=\"esri-legend__layer-cell esri-legend__layer-cell--info\"><div class=\"esri-legend__ramp-labels\" style=\"height: 75px;\"><div class=\"esri-legend__ramp-label\">High</div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div class=\"esri-legend__ramp-label\">Low</div></div></div></div></div></div></div></div>"

    // preset variables for selecting update feature
    // let prevState = null
    // let currState = "ready"
    let selectedFeature = null;
    let selectedFeatureCopy = null;

    // watch for state change of editor
    editor.viewModel.watch("state", (state) => {
      console.log("state");
      console.log(editor);
      console.log(state);

      if (state == "awaiting-update-feature-candidate") {
        console.log("awaiting candidate");
        console.log(editor);
      }

      if (state == "editing-existing-feature") {
        // currently editing tree position

        // if (state != "awaiting-feature-to-update")
        console.log("editing existing");
        console.log(editor);
        // prevState = currState
        // currState = state
        selectedFeature = editor.viewModel.featureFormViewModel.feature;
        if (selectedFeature.layer.title == "Add Trees") {
          selectedFeatureCopy = esriLang.clone(
            editor.viewModel.featureFormViewModel.feature
          );

          editor.activeWorkflow.on("commit", () => {
            console.log("update heat island");
            updateTreeSurround(selectedFeatureCopy, "warmer");
            updateTreeSurround(selectedFeature, "cooler");
          });
        }
      } else if (state == "creating-features") {
        console.log("new tree");
        console.log(editor);
        // editor.viewModel.SketchViewModel.createGraphic.symbolLayers[0].height = 7
        // prevState = currState
        // currState = state
        if (editor.viewModel.selectedTemplateItem.layer.title == "Add Trees") {
          selectedFeature = null;
          selectedFeatureCopy = null;
          console.log(editor.activeWorkflow.createFeatureState);
          editor.viewModel.featureFormViewModel.watch("feature", (feature) => {
            console.log("feature set");
            console.log(feature);
            feature.attributes.Tree_H = 6.0;
            // feature.attributes.Tree_Height = String(feature.attributes.Tree_H)

            selectedFeature = feature;
            selectedFeatureCopy = esriLang.clone(feature);
          });
          editor.activeWorkflow.on("commit", (f) => {
            console.log("commit");
            // console.log(f)
            updateTreeSurround(selectedFeature, "cooler");
          });
        }
      }
    });

    // view.watch("scale", (scale) => {
    //   console.log("scale")
    //   console.log(scale)
    //   // console.log(view.)
    // })
  });
});
