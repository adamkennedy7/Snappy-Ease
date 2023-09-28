/**
 * Project: Snappy Ease for Adobe After Effects
 * Author: Adam Eugene Kennedy
 *
 * Commercial Use:
 * The Software can be used for commercial purposes with or without attribution to the original author(s).
 * 
 * See the full license in `LICENSE.txt` via https://github.com/adamkennedy7/after-effects-snappy-ease
 * 
 * Created in collaboration with Adam's `aEIOU™` system.
 */

// Version 1.0

app.beginUndoGroup("Snappy Ease");

// cOUNT tHE tOTAL nUMBER oF sUCCESSFUL kEYFRAME mODIFICATIONS
var successCount = 0;

// cURRENT cOMPOSITION
var comp = app.project.activeItem;

// sELECTED lAYERS
var selectedLayers = comp.selectedLayers;
var selectedProps;

for (var i = 0; i < selectedLayers.length; i++) {
    selectedProps = selectedLayers[i].selectedProperties;
    for (var k = 0; k < selectedProps.length; k++) {
        var prop = selectedProps[k];
        $.writeln("Layer: " + selectedLayers[i].name);
        $.writeln("Property: " + prop.name + ", MatchName: " + prop.matchName);

        // sKIP iF nO kEYFRAMES
        if (prop.numKeys < 1) {
            continue;
        }

        // iTERATE tHROUGH kEYFRAMES
        for (var kf = 1; kf <= prop.numKeys; kf++) {
            try {
                var inEase = prop.keyInTemporalEase(kf);
                var outEase = prop.keyOutTemporalEase(kf);
                
                // mODIFY eASE tO bE "sNAPPY"
                for (var j = 0; j < inEase.length; j++) {
                    inEase[j].speed = 0;
                    inEase[j].influence = 75;
                }
                
                for (var j = 0; j < outEase.length; j++) {
                    outEase[j].speed = 0;
                    outEase[j].influence = 50;
                }
                
                // sET mODIFIED eASE
                prop.setTemporalEaseAtKey(kf, inEase, outEase);
                $.writeln("Successfully set the Snappy Ease at keyframe " + kf);
                successCount++;
            } catch (e) {
                $.writeln("Failed to process snappy snap: " + e.toString());
            }
        }
    }
}

app.endUndoGroup();

// sHOW cUSTOM dIALOG bOX
var dialog = new Window("dialog", "Snappy Ease 1.0");
dialog.orientation = "column";
dialog.alignChildren = ["fill", "top"];
dialog.spacing = 10;
dialog.margins = [100, 40, 100, 40];

// gROUP fOR tEXT iNFO
var textGroup = dialog.add("group", undefined);
textGroup.orientation = "column";
textGroup.alignChildren = ["fill", "top"];
textGroup.spacing = 5;
textGroup.margins = [0, 10, 0, 10];

var text1 = textGroup.add("statictext", undefined, "Snappy Ease applied to " + successCount + " keyframes:");
text1.graphics.font = ScriptUI.newFont("Arial", "Bold", 14);

var text2 = textGroup.add("statictext", undefined, "• Incoming Velocity Influence set to 75%");
text2.graphics.font = ScriptUI.newFont("Arial", "Regular", 12);

var text3 = textGroup.add("statictext", undefined, "• Outgoing Velocity Influence set to 50%");
text3.graphics.font = ScriptUI.newFont("Arial", "Regular", 12);

// gROUP fOR bUTTON
var buttonGroup = dialog.add("group", undefined);
buttonGroup.orientation = "row";
buttonGroup.alignChildren = ["center", "center"];
buttonGroup.spacing = 10;
buttonGroup.margins = [0, 20, 0, 0];

var closeButton = buttonGroup.add("button", undefined, "OK");
closeButton.graphics.font = ScriptUI.newFont("Arial", "Bold", 16);
closeButton.onClick = function () {
    dialog.close();
};

dialog.defaultElement = closeButton; // sET cLOSE bUTTON aS dEFAULT eLEMENT

dialog.show();


// "sNAPPY eASE: wHERE aRT mEETS cODE, mOTION gETS sNAPPY, aND eVERY kEYFRAME iS a sTAR! 🌟"