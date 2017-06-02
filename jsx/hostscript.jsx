/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder, app, ElementPlacement*/
'use strict';

// ll(layerList) object contains objects describing layers to be created
// key name corresponds to button id in html, index is array with desired layer order
var ll = {
    index: ['notes', 'mask', 'pdTarget', 'info', 'die', 'dieInfo', 'slit', 'whitePlate', 'mattePlate', 'cameraMarks', 'cutterGuide', 'finishing', 'jobFinishing', 'fill', 'hiddenArt', 'barcode', 'fpoBarcode', 'salesSample', 'whiteBacking', 'substrate', 'custom'],
    notes: {index: 0, name: 'Notes', print: false, pos: ElementPlacement.PLACEATBEGINNING},
    mask: {index: 1, name: 'Mask for Page:', post: [0], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    pdTarget: {index: 2, name: 'PD Target', post: [], pre: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    info: {index: 3, name: 'Info', print: true, post: [], pre: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13], pos: ElementPlacement.PLACEATBEGINNING},
    die: {index: 4, name: 'Die', print: true, post: [], pre: [5, 6, 7, 8, 9, 10, 11, 12, 13], pos: ElementPlacement.PLACEATBEGINNING},
    dieInfo: {index: 5, name: 'Die Info', print: true, post: [], pre: [6, 7, 8, 9, 10, 11, 12, 13], pos: ElementPlacement.PLACEATBEGINNING},
    slit: {index: 6, name: 'Slit', print: true, post: [], pre: [7, 8, 9, 10, 11, 12, 13], pos: ElementPlacement.PLACEATBEGINNING},
    whitePlate: {index: 7, name: 'White Plate', post: [], pre: [8, 9, 10, 11, 12, 13], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    mattePlate: {index: 8, name: 'Matte Plate', post: [], pre: [9, 10, 11, 12, 13], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    cameraMarks: {index: 9, name: 'Camera Marks', post: [], pre: [10, 11, 12, 13], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    cutterGuide: {index: 10, name: 'Cutter Guide', post: [], pre: [11, 12, 13], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    finishing: {index: 11, name: 'Finishing Marks', post: [], pre: [12, 13], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    jobFinishing: {index: 12, name: 'Job Finishing Marks', post: [], pre: [13], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    fill: {index: 13, name: 'Fill', print: true,  post: [], pos: ElementPlacement.PLACEATBEGINNING},
    hiddenArt: {index: 14, name: 'Hidden Art', post: [], pre: [15, 16, 17], print: false},
    barcode: {index: 15, name: 'Barcode',  post: [15, 14], pre: [17], print: true},
    fpoBarcode: {index: 16, name: 'FPO Barcode',  post: [14], pre: [16, 17], print: false},
    salesSample: {index: 17, name: 'Sales Sample',  post: [16, 15, 14], print: true},
    whiteBacking: {index: 18, name: 'White Backing', pre: [19], print: true, pos: ElementPlacement.PLACEATEND},
    substrate: {index: 19, name: 'Substrate', print: true,  post: [18], pos: ElementPlacement.PLACEATEND},
    custom: {index: 20, name: '', print: true},
    shortName: function (ind) {return this[this.index[ind]].name; },
    fullName: function (ind, add) {
        if (add !== '') {
            return this[this.index[ind]].name + add + ' - CL&D Digital';
        } else {
            return this[this.index[ind]].name + ' - CL&D Digital';
        }
    }
};

var sets = {
    basic: ['notes', 'pdTarget', 'info', 'die', 'whitePlate'],
    diecut: ['notes', 'pdTarget', 'info', 'die', 'whitePlate', 'cameraMarks', 'cutterGuide'],
    slitting: ['notes', 'pdTarget', 'info', 'die', 'whitePlate', 'slit', 'finishing'],
    handtrim: ['notes', 'pdTarget', 'info', 'die', 'whitePlate', 'jobFinishing'],
    breadbag: ['notes', 'pdTarget', 'info', 'die', 'whitePlate', 'jobFinishing', 'finishing'],
    barcodes: ['fpoBarcode', 'barcode']
};

var custDefault = '';

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

function numArr(num1, num2) {
    //return array of numbers between num1 to num2, 
    var arr = [];
    var i;
    for (i = num1 + 1; i < (num2); i++) {
        arr.push(i);
    }
    return arr;
}

function arrOfnames(array) {
    var arr = [];
    var i;
    for (i = 0; i < array.length; i++) {
        arr.push(array[i].name);
    }
    return arr;
}

function zipper(arr1, arr2) {
    var i, longArr, shortArr, newArr, j;
    if (arr1.length < arr2.length) {
        shortArr = arr1;
        newArr = arr2;
        j = 0;
    } else {
        shortArr = arr2;
        newArr = arr1;
        j = 1;
    }
    for (i = 0; i < shortArr.length; i++) {
        newArr.splice(j, 0, shortArr[i]);
        j += 2;
    }
    return newArr;
}

function saveLyrState(layerRef) {
    return [layerRef.visible, layerRef.locked];
}

function setLyrState(layerRef, settings) {
    layerRef.visible = settings[0];
    layerRef.locked = settings[1];
}

function addLayer(layerID) {
    var doc = app.activeDocument;
    var curLayer = doc.activeLayer;
    var thisLayer = ll[layerID];
    var curLyrs = ',' + arrOfnames(doc.layers).join(',');
    if (curLyrs.indexOf(',' + ll.fullName(thisLayer.index, '')) !== -1) {return; }
    
    var add = '';
    if (layerID === 'mask') {
        add = prompt("|) Layers - Add Mask Layer\n\nMask for Page: ", "");
        if (add === null) {return; } // cancel
        if (add === '') {return; }
    } else if (layerID === 'custom') {
        add = prompt("|) Layers - Add Custom Layer\n\nEnter Custom Layer Name: ", custDefault);
        if (add === null) {return; } // cancel
        if (add === '') {return; }
    }
    
    var newLayer = doc.layers.add();
    newLayer.name = ll.fullName(thisLayer.index, add);
    newLayer.printable = thisLayer.print;
    
    var i, post = [], pre = [], thisName;
    if (thisLayer.hasOwnProperty('post')) {
        post = thisLayer.post.length === 0 ? numArr(-1, thisLayer.index).reverse() : thisLayer.post;
    }
    if (thisLayer.hasOwnProperty('pre')) {
        pre = thisLayer.pre.length === 0 ? numArr(thisLayer.index, ll.index.length) : thisLayer.pre;
    }
    var refLayers = zipper(pre, post);
    var placement, refLayer, refState;
    for (i = 0; i < refLayers.length; i++) {
        thisName = ll.fullName(refLayers[i], '');
        if (curLyrs.indexOf(thisName) !== -1) {
            placement = refLayers[i] < thisLayer.index ? ElementPlacement.PLACEAFTER : ElementPlacement.PLACEBEFORE;
            refLayer = doc.layers.getByName(thisName);
            refState = saveLyrState(refLayer);
            setLyrState(refLayer, [true, false]);
            newLayer.move(refLayer, placement);
            setLyrState(refLayer, refState);
            return;
        }
    }
    if (thisLayer.hasOwnProperty('pos')) {
        newLayer.move(doc, thisLayer.pos);
    } else {
        refState = saveLyrState(curLayer);
        setLyrState(curLayer, [true, false]);
        newLayer.move(curLayer, ElementPlacement.PLACEBEFORE);
        setLyrState(curLayer, refState);
    }
}

// add a single layer or a set of layers
function addLayers(layerID, isSet) {
    if (isSet) {
        var thisSet = sets[layerID];
        var i;
        for (i = 0; i < thisSet.length; i++) {
            addLayer(thisSet[i]);
        }
    } else {
        addLayer(layerID);
    }
}

function addCustom(name, printing) {
    //for use of extra extension window for ui
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
            //if (i === 0) {return;}
        } else {
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
}

function findSublayers() {
    var doc = app.activeDocument;
    var guilty = []; //array of layers with sublayers
    var i;
    //find layers with sublayers
    for (i = 0; i < doc.layers.length; i++) {
        if (doc.layers[i].layers.length > 0) {
            guilty.push(doc.layers[i])
        }
    }
    //display results
    if (guilty.length === 0) {
        alert("|) Layers - Find Sublayers\n\nNo sublayers were found.");
        return;
    }
    var mes = "Remove sublayers from these layers?";
    for (i = 0; i < guilty.length; i++) {
        mes += '\n     ' + guilty[i].name;
    }
    
    var verdict = confirm("|) Layers - Find Sublayers\n\n" + mes);
    if (verdict === false) {
        return; 
    } else {
        for (i = 0; i < guilty.length; i++) {
            remLayers(guilty[i]);
        }
    }
}


function removeSublayers() {
    // recursive script to remove all sublayers from active layer
    var layer = app.activeDocument.activeLayer;
    remLayers(layer);
}
