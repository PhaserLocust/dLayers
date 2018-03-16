/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, app, ElementPlacement*/

/* functions used in main.js with csInterface.evalScript() begin with 'eval' */
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "eval" }]*/

// ll(layerList) object contains objects describing layers to be created
// key name corresponds to button id in html, index is array with desired layer order
var ll = {
    index: ['notes', 'mask', 'pdTarget', 'info', 'die', 'dieInfo', 'slit', 'whitePlate', 'mattePlate', 'cameraMarks', 'cutterGuide', 'finishing', 'jobFinishing', 'fill', 'salesSample', 'barcode', 'fpoBarcode', 'hiddenArt', 'whiteBacking', 'substrate', 'custom'],
    notes: {index: 0, name: 'Notes', print: false, pos: ElementPlacement.PLACEATBEGINNING},
    mask: {index: 1, name: 'Mask Page ', post: [0], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    pdTarget: {index: 2, name: 'PD Target', post: [], pre: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    info: {index: 3, name: 'Info', print: true, post: [], pre: [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], pos: ElementPlacement.PLACEATBEGINNING},
    die: {index: 4, name: 'Die', print: true, post: [], pre: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], pos: ElementPlacement.PLACEATBEGINNING},
    dieInfo: {index: 5, name: 'Die Info', print: true, post: [], pre: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], pos: ElementPlacement.PLACEATBEGINNING},
    slit: {index: 6, name: 'Slit', print: true, post: [], pre: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16], pos: ElementPlacement.PLACEATBEGINNING},
    whitePlate: {index: 7, name: 'White Plate', post: [], pre: [8, 9, 10, 11, 12, 13, 14, 15, 16], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    mattePlate: {index: 8, name: 'Matte Plate', post: [], pre: [9, 10, 11, 12, 13, 14, 15, 16], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    cameraMarks: {index: 9, name: 'Camera Marks', post: [], pre: [10, 11, 12, 13, 14, 15, 16], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    cutterGuide: {index: 10, name: 'Cutter Guide', post: [], pre: [11, 12, 13, 14, 15, 16], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    finishing: {index: 11, name: 'Finishing Marks', post: [], pre: [12, 13, 14, 15, 16], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    jobFinishing: {index: 12, name: 'Job Finishing Marks', post: [], pre: [13, 14, 15, 16], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    fill: {index: 13, name: 'Fill',  post: [], pre: [14, 15, 16, 17], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    salesSample: {index: 14, name: 'Sales Sample',  post: [], pre: [15, 16], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    barcode: {index: 15, name: 'Barcode',  post: [], pre: [16], print: true, pos: ElementPlacement.PLACEATBEGINNING},
    fpoBarcode: {index: 16, name: 'FPO Barcode',  post: [], print: false, pos: ElementPlacement.PLACEATBEGINNING},
    hiddenArt: {index: 17, name: 'Hidden Art', post: [], print: false},
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
    },
    toggle: function (ind, vis, print, lock) {
        var doc = app.activeDocument;
        var name = this.fullName(ind, '');
        if (layerExists(name)) {
            var thisLayer = doc.layers.getByName(name);
            thisLayer.locked = lock;
            thisLayer.visible = vis;
            thisLayer.printable = print;
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
function eval_docIsOpen() {
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
    // returns array of the .name values of the items in given array
    var arr = [];
    var i;
    for (i = 0; i < array.length; i++) {
        arr.push(array[i].name);
    }
    return arr;
}

function zipper(arr1, arr2) {
    var i, shortArr, newArr, j;
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
function eval_addLayers(layerID, isSet) {
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
    // for future use of extra extension window for ui
    // allows more user input in confirmation window(ie layer name and visible checkbox)
}

///////////////////////

// ll index, visable, printable, locked value of each standard layer in the layerView
// in order: pdf, white, matte, job, pd, cld
var viewList = [
    [[0, 0, 0, 0], [2, 0, 1, 0], [3, 1, 1, 0], [4, 1, 1, 0], [6, 0, 1, 0], [7, 0, 1, 0], [8, 0, 1, 0], [9, 0, 1, 0], [10, 0, 1, 0], [11, 1, 1, 0], [12, 0, 1, 0], [13, 0, 1, 0], [19, 1, 1, 0]],
    
    [[3, 1, 1, 0], [4, 1, 1, 0], [7, 1, 1, 0], [11, 1, 1, 0]],
    
    [[3, 1, 1, 0], [4, 1, 1, 0], [8, 1, 1, 0], [11, 1, 1, 0]],
    
    [[0, 1, 0, 1], [2, 1, 1, 1], [3, 0, 0, 0], [4, 0, 0, 0], [6, 1, 1, 0], [7, 1, 1, 0], [8, 0, 0, 0], [9, 1, 1, 0], [10, 1, 1, 0], [11, 1, 1, 0], [12, 1, 1, 0], [13, 1, 1, 0], [19, 0, 0, 0]],
    
    [[2, 1, 1, 0], [6, 1, 1, 0], [12, 1, 1, 0]],
    
    [[0, 1, 0, 0], [2, 1, 1, 0], [3, 1, 1, 0], [4, 1, 1, 0], [6, 1, 1, 0], [7, 1, 1, 0], [8, 1, 1, 0], [9, 1, 1, 0], [10, 1, 1, 0], [11, 1, 1, 0], [12, 1, 1, 0], [13, 1, 1, 0], [14, 1, 1, 0], [15, 1, 1, 0], [18, 1, 1, 0], [19, 0, 0, 0]]
];

// hides all layers in doc
function hideAllLayers() {
    var doc = app.activeDocument;
    var i;
    for (i = 0; i < doc.layers.length; i++) {
        doc.layer[i].visible = false;
    }
}

// shows all layers set to print in doc, hides others
function showPrintLayers() {
    var doc = app.activeDocument;
    var i;
    for (i = 0; i < doc.layers.length; i++) {
        if (doc.layer[i].printable === true) {
            doc.layer[i].locked = false;
            doc.layer[i].visible = true;
        } else {
            doc.layer[i].visible = false;
        }
    }
}

// find all layers that match reg ex and set properties
function matchToggleLayers(reg, vis, print, lock) {
    var doc = app.activeDocument;
    var i, thisLayer;
    for (i = 0; i < doc.layers.length; i++) {
        thisLayer = doc.layer[i];
        if (reg.test(thisLayer.name)) {
            thisLayer.locked = lock;
            thisLayer.visible = vis;
            thisLayer.printable = print;
        }
    }
}

function activateMatchedArtboard(stringMatch1, stringMatch2, exactMatchBool) {
    // string search is not case sensitive
    var artBoards = app.activeDocument.artboards;
    var thisArtBoardName;
    var i;
    if (exactMatchBool) {
        for (i = 0; i < artBoards.length; i++) {
            thisArtBoardName = artBoards[i].name.toUpperCase();
            if (thisArtBoardName === stringMatch1) {
                artBoards.setActiveArtboardIndex(i);
                break;
            } else if (thisArtBoardName === stringMatch2) {
                artBoards.setActiveArtboardIndex(i);
                break;
            }
        }
    } else {
        for (i = 0; i < artBoards.length; i++) {
            thisArtBoardName = artBoards[i].name.toUpperCase();
            if (thisArtBoardName.indexOf(" & quoted form of stringToMatch & ".toUpperCase()) !== -1) {
                artBoards.setActiveArtboardIndex(i);
                break;
            } else if (thisArtBoardName.indexOf(" & quoted form of secondStringToMatch & ".toUpperCase()) !== -1) {
                artBoards.setActiveArtboardIndex(i);
                break;
            }
        }
    }
}

function eval_applyView(viewIndex) {
    if (viewIndex === 0 || viewIndex === 3) {
        showPrintLayers();
    } else {
        hideAllLayers();
    }

    // set standard layers:
    var list = viewList[viewIndex];
    var i;
    for (i = 0; i < list.length; i++) {
        ll.toggle(list[i][0], list[i][1], list[i][2]);
    }
    
    // items set case by case basis:
        // pd layer
        // mask layers
        // what to do with matte/white proof art
        // artboard to activate
    var str1 = 'PDF';
    var str2 = 'NO MATCH';
    var exact = false;
    switch (viewIndex) {
    case '0':
        matchToggleLayers(/Mask Page.*- CL&D Digital/, 0, 1, 0);
        break;
    case '1':
        matchToggleLayers(/^PD-.{4}-.*-.* - CL&D Digital/, 1, 1, 0);
        matchToggleLayers(/Mask Page.*- CL&D Digital/, 0, 1, 0);
        break;
    case '2':
        matchToggleLayers(/^PD-.{4}-.*-.* - CL&D Digital/, 1, 1, 0);
        matchToggleLayers(/Mask Page.*- CL&D Digital/, 0, 1, 0);
        break;
    case '3':
        matchToggleLayers(/Mask Page.*- CL&D Digital/, 0, 1, 0);

        str1 = 'JOB';
        str2 = 'NO MATCH';
        exact = false;
        break;
    case '4':
        matchToggleLayers(/^PD-.{4}-.*-.* - CL&D Digital/, 1, 1, 0);
        str1 = 'PD - DIE CUT';
        str2 = 'PD';
        exact = true;
        break;
    case '5':
        str1 = 'JOB';
        str2 = 'NO MATCH';
        exact = false;
        break;
    }
    
    //show all art on now-visible layers
    app.executeMenuCommand('showAll');
    
    // handle matte/white proof art
    
    // set artboard
    activateMatchedArtboard(str1, str2, exact);
    // deselect all
    app.activeDocument.selection = null;
}

///////////////////////

// recursive script to remove all sublayers from given layer
function remLayers(layer) {
    layer.locked = false;
    layer.visible = true;
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

function eval_subLayersExist() {
    //returns bool as string
    var doc = app.activeDocument;
    var i;
    //find layers with sublayers
    for (i = 0; i < doc.layers.length; i++) {
        if (doc.layers[i].layers.length > 0) {
            return 'true';
        }
    }
    return 'false';
}

function eval_findSublayers() {
    var doc = app.activeDocument;
    var guilty = []; //array of layers with sublayers
    var i;
    //find layers with sublayers
    for (i = 0; i < doc.layers.length; i++) {
        if (doc.layers[i].layers.length > 0) {
            guilty.push(doc.layers[i]);
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

function eval_removeSublayers() {
    var layer = app.activeDocument.activeLayer;
    remLayers(layer);
}