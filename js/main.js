/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 2, maxerr: 50 */
/*global $, window, location, CSInterface, CSEvent, themeManager*/

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

	/*
	function onDocSaved(event) {
		console.log(Date() + ' doc saved');
		console.log(event.data);
	}
	*/

	/*
	function onDocDeactivated(event) {
	}
	*/

	function setEnabled(name) {
		// disables ui if passed ''
		if (name === '') {
			$('button').prop('disabled', true);
			////$("#controls").addClass("disabled");
			$("hr").addClass("disabled");
			return;
		}
		$('button').prop('disabled', false);
		////$("#controls").removeClass("disabled");
		$("hr").removeClass("disabled");
	}

	function setFindSubButtonArt() {
		// console.log("check for sublayers");
		csInterface.evalScript('eval_subLayersExist()', function (res) {
			// set art accordingly
			if (res === 'true') {
				// console.log("found subs, set art");
				$('#findSubImg').attr('src', 'img/btnIcon_findSubTrue.png');
			} else if (res === 'false') {
				// console.log("no subs, set art");
				$('#findSubImg').attr('src', 'img/btnIcon_findSub.png');
			}
		});
	}

	function onDocActivated(event) {
		var name;
		if (event === '') {
			// called by $(window).load
			csInterface.evalScript('eval_docIsOpen()', function (res) {
				// console.log("the result: " + res);
				if (res === 'true') {
					setEnabled('enable');
					setFindSubButtonArt();
				} else {
					setEnabled('');
				}
			});
			return;
		} else {
			// check, disable if no doc open
			name = $(event.data).find("name").text();
			setEnabled(name);

			// if doc open, check for sublayers to update findSublayers button
			if (name !== '') {
				setFindSubButtonArt();
			}
		}
	}

	/*
	function setOn(sel) {
		$('.' + sel + '"').css("background-color", "#626465");
	}

	function setOff(sel) {
		$('.' + sel + '"').css("background-color", "transparent");
	}
	*/

	//////////////////////////////////

	$('#remSublayers').click(function () {
		csInterface.evalScript('eval_removeSublayers()');
		setFindSubButtonArt();
	});

	$('#findSublayers').click(function () {
		csInterface.evalScript('eval_findSublayers()');
		setFindSubButtonArt();
	});

	$('.topcoat-button', '#layersets').hover(
		function () {
			var theId = '.' + this.id;
			$(theId).css("box-shadow", "0 21px 0 0 #626465 inset");
		},
		function () {
			var theId = '.' + this.id;
			$(theId).css("box-shadow", "none");
		}
	);

	$('.topcoat-button', '#layersets').click(
		function () {
			csInterface.evalScript('eval_addLayers("' + this.id + '", true)');
		}
	);

	$('.add', '#rectBtns').click(
		function () {
			csInterface.evalScript('eval_addLayers("' + this.id + '", false)');
		}
	);

	$('#substrateArt').click(
		function () {
			// make sure layer exists:
			csInterface.evalScript('eval_addLayers("substrate", false)');
			// create event telling .marks extension to please build art
			var event = new CSEvent("com.rps.dlayers", "APPLICATION");
			event.data = "substrateArt";
			csInterface.dispatchEvent(event);
		}
	);

	// passes index of id in list to jsx
	$('.topcoat-button', '#layerViews').click(
		function () {
			var viewNames = [
				'pdfView',
				'whiteView',
				'matteView',
				'jobView',
				'pdView',
				'cldView'
			];
			csInterface.evalScript('eval_applyView("' + viewNames.indexOf(this.id) + '")');
		}
	);

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

	//listen for dmarks event, call relevant methods
	csInterface.addEventListener("com.rps.dmarks", function (e) {
		if (e.data === 'substrateArt') {
			csInterface.evalScript('eval_substrateArt()');
		}
	});
	
	$(window).load(function () {
		// console.log(Date() + ' window loaded');
		onDocActivated('');
	});
});