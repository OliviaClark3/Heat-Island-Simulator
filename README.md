# Heat-Island-Simulator

This is the code for the Heat Island Simulator presented in the NZEUC 2023 Plenary

## How to use this program
- Go to the sketch tool in the bottom right, select 'Draw a point', and place the point on the map
    - The location used at NZEUC 2023 was the centre of the round-a-bout that can be seen on initial load
- Click the Add Trees button to add trees in a 50m radius around the point
- Click the Query Area button to add heat island data in a 50m radius around the point
- To add new trees or buildings, click the relevant New Feature buttons in the Editor on the right and place them on the screen. Add a height is desired and click Create
    - It is not recommended to use the blank New Feature button the first appears under Create features. This is for creating a new heat island point
- To move new trees and buildings, or move existing trees, click the Select button in the Editor, then select a tree or building. Here you can relocate or resize trees and buildings, then click Update
- To change the type of tree, click the select under Tree Type, and choose the tree you want, this will change the type of all trees
    - When moving trees, the heat islands will update based on the tree type currently selected here, not the tree type that the tree was placed with
- The Submit Changes button currently doesn't do anything, however, the idea is that clicking this button will update you changes to the relevant feature layers. There is code that is commented out for this here.



This Heat Island Simulator project was developed in collaboration by Eagle Technology (Olivia Clark) and The University of Canterbury (Max Bastida, in partnership with Edward Wong, and supervised by Ben Adams)