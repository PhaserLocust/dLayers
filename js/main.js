/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

$(document).ready(function () {
	'use strict';
    
    var csInterface = new CSInterface();
    
    function init() {
        themeManager.init();
    }
    
    function closeNotifier(divID) {
        $('#' + divID).hide();
        $('#' + divID + 'Text').text('');
    }
    
    function onDocSaved(event) {
        console.log(Date() + ' doc saved');
        console.log(event.data);
    }
    
    function onDocDeactivated(event) {
    }
    
    function setEnabled(name) {
        // disables ui if passed ''
        if (name === '') {
            $('button').prop('disabled', true);
            $("#controls").addClass("disabled");
            $("hr").addClass("disabled");
            return;
        }
        $('button').prop('disabled', false);
        $("#controls").removeClass("disabled");
        $("hr").removeClass("disabled");
    }

    function onDocActivated(event) {
        var name;
        if (event === '') {
            csInterface.evalScript('docIsOpen()', function (res) {
                console.log("the result: " + res);
                if (res === 'true') {
                    setEnabled('enable');
                } else {
                    setEnabled('');
                }
            });
            return;
        } else {
            name = $(event.data).find("name").text();
            setEnabled(name);
        }
    }
    
    //////////////////////////////////
    
    $('#remSublayers').click(function () {
        console.log(Date() + ' remSublayers');
        csInterface.evalScript('removeSublayers()');
    });
    
    $('#deny').click(function () {
        closeNotifier('confirmation');
    });
        
    $('#confirm').click(function () {
        console.log('confirmed');
    });
     
    $('#notifierClose').click(function () {
        closeNotifier('notifier');
    });
    
    $('#retryButton').click(function () {
        console.log(Date() + ' Retry');

        closeNotifier('retry');
    });
    
    //////////////////////////////////
    
    //themeManager:
    init();
    
    //listen for ai document deactivations
    //csInterface.addEventListener("documentAfterDeactivate", onDocDeactivated);
    
    //listen for ai document activations
    csInterface.addEventListener("documentAfterActivate", onDocActivated);
    
    //listen for ai document save
    //csInterface.addEventListener("documentAfterSave", onDocSaved);
    
    $(window).load(function () {
        console.log(Date() + ' window loaded');
        onDocActivated('');
    });
});