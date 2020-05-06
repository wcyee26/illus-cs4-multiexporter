#target Illustrator  
  
/** 
* export layers as cropped PNG 
* @author Wu Wei
*/  
// Adapted to export layers as PNG by Niels Bosma, export images as CSS Layers by CarlosCanto  
  
  
if (app.documents.length>0) {  
    main();  
}  
else alert('Cancelled by user');  
  
  
function main() {  
    var document = app.activeDocument;  
    var afile = document.fullName;  
    var filename = afile.name.split('.')[0];  
  
    var folder = afile.parent.selectDlg("Export as CSS Layers (images only)...");  
  
  
    if(folder != null)  
    {   
        var activeABidx = document.artboards.getActiveArtboardIndex();  
        var activeAB = document.artboards[activeABidx]; // get active AB          
        var abBounds = activeAB.artboardRect;// left, top, right, bottom  
  
        showAllLayers();  

        // var selectedObjects = document.selection;  
        var options = new ExportOptionsPNG24();  
        options.antiAliasing = true;  
        options.transparency = true;  
        options.artBoardClipping = true;  

        // Build a dialog to set prefix for all layers
        var isExport = false;
        var dlg = new Window('dialog', 'Set prefix for all layers (can be empty)',[100,100,480,150]); 
        dlg.prefixName = dlg.add('edittext', [0, 0, 480, 20], filename + '-');
        dlg.okButton = dlg.add('button', [0, 20, 50, 50], 'OK');
        dlg.okButton.onClick = function(){ isExport = true; dlg.close(); };
        dlg.center();
        dlg.show();

        // If isExport is not true, return void to ignore everything below
        if(!isExport) return;

        hideAllLayers();  

        for(var i=0; i<document.layers.length; i++){

            var layer = document.layers[i];
            layer.visible = true;

            // Find the largest area pageItem in a layer
            var largestItemArea = 0;
            var largestVisibleBounds;
            for(var j=0; j<layer.pageItems.length; j++){
                var item = layer.pageItems[j];
                var itemArea = item.width * item.height;
                if(itemArea > largestItemArea){
                    largestItemArea = itemArea;
                    largestVisibleBounds = item.visibleBounds;
                }
            }
            // Set the artboard with largest area pageItem
            // This will only allow pageItem within the artboard to be exported
            activeAB.artboardRect = largestVisibleBounds;

            var file = new File(folder.fsName + '/' + dlg.prefixName.text + layer.name + ".png");  
            document.exportFile(file,ExportType.PNG24,options); 

            layer.visible = false;
        }

        showAllLayers();  
        activeAB.artboardRect = abBounds;  
    }  
  
  
    function hideAllLayers()  
    {  
        forEach(document.layers, function(layer) {  
            layer.visible = false;  
        });  
    }  
  
  
    function showAllLayers()  
    {  
        forEach(document.layers, function(layer) {  
            layer.visible = true;  
        });   
    }  
  
  
    function forEach(collection, fn)  
    {  
        var n = collection.length;  
        for(var i=0; i<n; ++i)  
        {  
            fn(collection[i]);  
        }  
    }  
}  
