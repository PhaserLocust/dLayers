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
