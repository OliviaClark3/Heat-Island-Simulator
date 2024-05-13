// constants.js
define([], function() {
    // Enum-like object for tree types
    const TreeTypes = {
      POPULUS: "Populus",
      TILIA: "Tilia",
      EUCALYPTUS: "Eucalyptus"
    };
  
    // Constants for buffer and temperature changes
    const TreeSettings = {
      Populus: { numBuffers: 3, tempChange: 4 },
      Tilia: { numBuffers: 5, tempChange: 2 },
      Eucalyptus: { numBuffers: 7, tempChange: 5 }
    };
  
    // number of radius (or diameter) buffers around tree for temp change
    const StartingRadius = 3; // 7
    // temperature change from middle of tree, used to calculate surrounding temperature change
    const StartingCoolingTemperature = 4
    // Better visual effect
    const Amplifier = 3
  
    // Export all constants
    return {
      TreeTypes: TreeTypes,
      TreeSettings: TreeSettings,
      StartingRadius: StartingRadius,
      StartingCoolingTemperature: StartingCoolingTemperature,
      Amplifier: Amplifier
    };
  });
  