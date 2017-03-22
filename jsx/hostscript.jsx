/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

function remLayers(layer) {
    layer.locked = false;
    var layerCount = layer.layers.length;
    if (layerCount === 0) {
        return;
    }
    var i, j;
    for (i = layerCount - 1; i >= 0; i--) {
        var subLayer = layer.layers[i];
        remLayers(subLayer);
        //new group at level of layer
        var group = layer.groupItems.add();
        //rename group to layername
        group.name = subLayer.name;
        //move group above layer
        group.move(subLayer, ElementPlacement.PLACEBEFORE);
        //move contents of layer to new group
        for (j = subLayer.pageItems.length - 1; j >= 0; j--) {
            subLayer.pageItems[j].move(group, ElementPlacement.PLACEATBEGINNING);
        }
        //delete sublayer
        subLayer.remove();
    }
}

function removeSublayers() {
    // recursive script to remove all sublayers from active layer
    var layer = app.activeDocument.activeLayer;
    remLayers(layer);
}


function addSlit(orientation, cutTrue, whiteTrue) {
    //get selected path
    
    //if path not valid, return
    
    //get dims, calc slit line location by dims and orientation
    
    //check slit layer exists, make if needed
    //if layer exitst, delete existing slit marks
    
    //make slit lines and press marks, if whiteTrue then 5indigo dashes
    
    //make slit width text
    
    //check finishing marks layer exists, make if needed
    //if layer existed, delete existing cut marks
    
    //if cutTrue, create cut marks
}

function addTear(orientation) {
    // ask for distance from edge
    
    //check finishing marks layer exists, make if needed
    //if layer existed, delete existing tear marks
    
    //check info layer exists, make if needed
    //if layer existed, delete existing tear marks
    
    // create marks on finsishing layer
    
    // create marks on info layer
}

function add1Fold(orientation) {
    // ask for distance from top edge
    
    //check finishing marks layer exists, make if needed
    //if layer existed, delete existing fold marks
    
    // create marks on finsishing layer
}

function add2Fold(orientation) {
    // ask for distance from top edge
    
    //check finishing marks layer exists, make if needed
    //if layer existed, delete existing fold marks
    
    // create marks on finsishing layer, one set from 1st edge, 2nd set from opposite edge
}

function add3Fold(orientation) {
    // for quad seal bag
}

function add4Fold(orientation) {
    // for side gusset bag
}

