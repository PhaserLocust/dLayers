/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, app, ElementPlacement*/

// ll(layerList) object contains objects describing layers to be created
// key name corresponds to button id in html, index is array with desired layer order
var ll = {
    index: ['notes', 'mask', 'pdTarget', 'info', 'die', 'dieInfo', 'whitePlate', 'mattePlate', 'cameraMarks', 'cutterGuide', 'slit', 'jobFinishing', 'finishing', 'hiddenArt', 'fpoBarcode', 'barcode', 'salesSample', 'whiteBacking', 'fill', 'substrate'],
    notes: {index: 0, name: 'Notes', print: false},
    mask: {index: 1, name: 'Mask for Page:', print: true},
    pdTarget: {index: 2, name: 'PD Target', print: true},
    info: {index: 3, name: 'Info', print: true},
    die: {index: 4, name: 'Die', print: true},
    dieInfo: {index: 5, name: 'Die Info', print: true},
    whitePlate: {index: 6, name: 'White Plate', print: true},
    mattePlate: {index: 7, name: 'Matte Plate', print: true},
    cameraMarks: {index: 8, name: 'Camera Marks', print: true},
    cutterGuide: {index: 9, name: 'Cutter Guide', print: true},
    slit: {index: 10, name: 'Slit', print: true},
    jobFinishing: {index: 11, name: 'Job Finishing Marks', print: true},
    finishing: {index: 12, name: 'Finishing Marks', print: true},
    hiddenArt: {index: 13, name: 'Hidden Art', print: false},
    fpoBarcode: {index: 14, name: 'FPO Barcode', print: false},
    barcode: {index: 15, name: 'Barcode', print: true, placement: 'below'},
    salesSample: {index: 16, name: 'Sales Sample', print: true, placement: 'below'},
    whiteBacking: {index: 17, name: 'White Backing', print: true, placement: 'above', pos: ElementPlacement.PLACEATEND},
    fill: {index: 18, name: 'Fill', print: true, placement: 'above', pos: ElementPlacement.PLACEATEND},
    substrate: {index: 19, name: 'Substrate', print: true, pos: ElementPlacement.PLACEATEND}
};
var suffix = ' - CL&D Digital';

// returns bool
function docIsOpen() {
    return app.documents.length > 0 ? 'true' : 'false';
}

function layerExists(layerName) {
    var layerList = app.activeDocument.layers;
    var i;
    for (i = 0; i < layerList.length; i++) {
        if (layerList[i].name === layerName) {
            return true;
        }
    }
    return false;
}

// add a single layer in correct position
function addLayer(layerID) {
    var doc = app.activeDocument;
    var thisLayer = ll[layerID];
    var newLayer = doc.layers.add();
    newLayer.name = thisLayer.name + suffix;
    newLayer.printable = thisLayer.print;
    
    if (thisLayer.hasOwnProperty('position')) {
        //move to position defined by position prop
        newLayer.move(doc, thisLayer.position);
    }
    //move to position in doc, by index defined in layerList
    var thisInd = thisLayer.index;
    var i;
    for (i = 0; i < ll.index.length; i++) {
        if (layerExists(ll.index[thisInd - i])) {
        }
    //newLayer.move(rel, )
    }
}

// add a set of layers
function addLayers(layerSet) {
    
}

function addCustom(name, printing) {
    
}











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
        //delete if layer is empty
        if (subLayer.pageItems.length === 0) {
            subLayer.remove();
            return;
        }
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
