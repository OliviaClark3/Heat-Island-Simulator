require([
  "esri/Map",
  "esri/views/SceneView",
  "esri/layers/FeatureLayer",
  "esri/widgets/Editor",
  "esri/geometry/Point",
  "esri/core/lang",
  "esri/layers/SceneLayer",
  "esri/widgets/Sketch",
  "esri/layers/GraphicsLayer",
], (
  Map,
  SceneView,
  FeatureLayer,
  Editor,
  Point,
  esriLang,
  SceneLayer,
  Sketch,
  GraphicsLayer
) => {

  // layer for sketch points
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

  // heat island points renderer, for heatmap
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

  // osn buildings renderer
  const buildingRenderer = {
    type: "simple", // autocasts as new SimpleRenderer()
    // Add a default MeshSymbol3D. The color will be determined by the visual variables
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

  // initiallly displayed buildings, from OSM data, not editable
  const buildingsLayer = new SceneLayer({
    portalItem: {
      id: "8846020245b340d5b8f8e13f98d65c70",
    },
    popupEnabled: false,
    renderer: buildingRenderer,
  });
  map.add(buildingsLayer);

  // additional building that was not displaying correctly, for conference presentation purposes
  const extraBuildingLayer = new SceneLayer({
    portalItem: {
      id: "8b9e48633ef1417e8e5200f2fb3ce872",
    },
    popupEnabled: false,
    renderer: buildingRenderer,
  });
  map.add(extraBuildingLayer);

  // initially displayed trees, editable
  var treeLayer = new FeatureLayer({
    portalItem: {
      id: "72c9f18c98f047a2815972b9b1628a84",
    },
    // url: "https://services.arcgis.com/hLRlshaEMEYQG5A8/arcgis/rest/services/HamiltonTreesWithRemovedFeatures/FeatureServer",
    renderer: treeRenderer,
    elevationInfo: {
      mode: "on-the-ground",
    },
  });

  // heat island point data
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

  // initial building feature to initialaise building client layer
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

  // building layer for buildings created with the editor
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

  // initial building feature to initialaise heat island points client layer
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

  // initial building feature to initialaise tree client layer
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

  // client layer for heat island point data
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
  // query heat island points around trees to change based on tree movement/addition
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
            // console.error("applyEdits error:", error, i);
          });
      }
    });
  };

  // update the area around the tree when it is added or moved, based on tree type
  const updateTreeSurround = (location, direction) => {
    let changeTempSoFar = 0;
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

  // handle changing tree type
  // find more tree types here: https://developers.arcgis.com/javascript/latest/visualization/symbols-color-ramps/esri-web-style-symbols-3d/#low-poly-vegetation
  let treeSelect = document.getElementById("selectTree");
  treeSelect.addEventListener("change", (event) => {
    let treeType;
    if (treeSelect.value == "Populus") {
      // numTempBuffers = 7
      numTempBuffers = 3;
      tempChange = 4;
      treeType = "Populus";
    } else if (treeSelect.value == "Tilia") {
      numTempBuffers = 5;
      // tempChange = 2
      treeType = "Tilia";
    } else if (treeSelect.value == "Eucalyptus") {
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

  //  --------------   SUBMIT BUTTON CODE STARTS HERE -------------------------
  // // this is code to implement the functionality for the Submit Changes button
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
  //  --------------   SUBMIT BUTTON CODE ENDS HERE -------------------------

  // query area around sketch point when Add Trees button clicked
  let treeBtn = document.querySelector("#addTrees");
  treeBtn.addEventListener("click", (event) => {
    // tree query
    let treeQuery = treeLayer.createQuery();
    treeQuery.geometry =
      graphicsLayer.graphics.items[
        graphicsLayer.graphics.items.length - 1
      ].geometry;
    treeQuery.distance = 50;
    treeQuery.units = "meters";
    treeQuery.spatialRelationship = "intersects"; // this is the default
    treeQuery.returnGeometry = true;
    treeLayer.queryFeatures(treeQuery).then(function (response) {
      const edits = {
        addFeatures: response.features,
      };
      treeClientLayer.applyEdits(edits).then(() => {
        for (let i = 0; i < response.features.length; i++) {
          // updateTreeSurround(response.features[i], "cooler")
        }
      });
    });
  });

  // query area around sketch point when Query Area button clicked
  let dataBtn = document.querySelector("#getData");
  dataBtn.addEventListener("click", (event) => {
    // heat island query
    let query = serverlayer.createQuery();
    query.geometry =
      graphicsLayer.graphics.items[
        graphicsLayer.graphics.items.length - 1
      ].geometry;
    query.distance = 50;
    query.units = "meters";
    query.spatialRelationship = "intersects"; // this is the default
    query.returnGeometry = true;
    query.maxRecordCountFactor = 5;
    serverlayer.queryFeatures(query).then(function (response) {
      const edits = {
        addFeatures: response.features,
      };
      clientlayer.applyEdits(edits);
      clientlayer.elevationInfo = {
        mode: "absolute-height",
        offset: 50,
        unit: "meters",
      };
    });
  });

  view.when(() => {
    view.popupEnabled = false; //disable popups
    // create the Editor
    const editor = new Editor({
      view: view,
    });
    // add widget to top-right of the view
    view.ui.add(editor, "top-right");

    const sketch = new Sketch({
      view: view,
      layer: graphicsLayer,
      creationMode: "update",
      availableCreateTools: ["point"],
      creationMode: "single",
      defaultCreatOptions: ["freehand"],
    });
    view.ui.add(sketch, "bottom-right");

    sketch.on("create", (event) => {
      // if you wanted to query the trees and heat island data immediately upon placing the sketch point,
      // code could be added here
    });

    let selectedFeature = null;
    let selectedFeatureCopy = null;
    // watch for state change of editor
    editor.viewModel.watch("state", (state) => {
      if (state == "editing-existing-feature") {
        selectedFeature = editor.viewModel.featureFormViewModel.feature;
        // only if tree layer selected
        if (selectedFeature.layer.title == "Add Trees") {
          selectedFeatureCopy = esriLang.clone(
            editor.viewModel.featureFormViewModel.feature
          );
          editor.activeWorkflow.on("commit", () => {
            updateTreeSurround(selectedFeatureCopy, "warmer");
            updateTreeSurround(selectedFeature, "cooler");
          });
        }
      } else if (state == "creating-features") {
        // only if tree layer selected
        if (editor.viewModel.selectedTemplateItem.layer.title == "Add Trees") {
          selectedFeature = null;
          selectedFeatureCopy = null;
          editor.viewModel.featureFormViewModel.watch("feature", (feature) => {
            feature.attributes.Tree_H = 6.0;
            selectedFeature = feature;
            selectedFeatureCopy = esriLang.clone(feature);
          });
          editor.activeWorkflow.on("commit", (f) => {
            updateTreeSurround(selectedFeature, "cooler");
          });
        }
      }
    });
  });
});
