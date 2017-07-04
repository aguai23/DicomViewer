/**
 * author: yunzhe
 * toolcontroller to control all the tool buttons, implementing button functions
 */
var ToolController = function (elementId, imageRender) {

    /**
     * The div id containing the canvas
     * @type String
     */
    this.elementId = elementId;

    /**
     * The view controller object
     * @type Object
     */
    this.imageRender = imageRender;

    /**
     * the selected tool name, default is scroll
     * @type {string}
     */
    this.selectedTool = "scroll";

    /**
     * whether draw tool has been activated
     * @type {boolean}
     */
    this.activateDraw = false;

    /**
     * set new tools to select
     * @param selectTool
     */
    this.setTools = function(selectTool) {
        this.selectedTool = selectTool;
        this.refreshTools();
    };

    /**
     * refresh tools after new tool is selected
     */
    this.refreshTools = function() {
        $("#" + this.elementId).off();
        if (this.selectedTool == "scroll") {
            this.setScrollTool();
        } else if (this.selectedTool == "draw") {
            this.setDrawTool();
        } else if (this.selectedTool == "window") {
            this.setWindowTool();
        } else if (this.selectedTool == "zoom") {
            this.setZoomTool();
        }
    };

    /**
     * set scroll tool
     */
    this.setScrollTool = function() {
        this.disableTools();
        var self = this;
        var element = $("#" + this.elementId);
        element.unbind("dblclick");
        var step = element.height() / this.imageRender.numberOfImage;
        element.bind("mousewheel", function (e) {
            var event = window.event || e;
            var up = event.wheelDelta > 0;
            if (up) {
                self.imageRender.increaseSlice();
            } else {
                self.imageRender.decreaseSlice();
            }
        });

        var startPoint = 0;

        element.mousemove(function (e) {
            if (e.which == 1) {
                if (e.pageY - startPoint > step) {
                    self.imageRender.increaseSlice();
                    startPoint = e.pageY;
                } else if (e.pageY - startPoint < -step) {
                    self.imageRender.decreaseSlice();
                    startPoint = e.pageY;
                }
            }
        });

        var div = document.getElementById(this.elementId);
        cornerstoneTools.mouseInput.enable(div);
        cornerstoneTools.mouseWheelInput.enable(div);

    };

    /**
     * set draw tool
     */
    this.setDrawTool = function() {
        this.disableTools();
        var div = document.getElementById(this.elementId);
        cornerstoneTools.mouseInput.enable(div);
        cornerstoneTools.mouseWheelInput.enable(div);
        cornerstoneTools.rectangleRoi.enable(div);
        cornerstoneTools.rectangleRoi.activate(div, 1);
        this.activateDraw = true;
    };

    /**
     * set window width/level tool
     */
    this.setWindowTool = function () {
        this.disableTools();
        var div = document.getElementById(this.elementId);
        cornerstoneTools.mouseInput.enable(div);
        cornerstoneTools.mouseWheelInput.enable(div);
        cornerstoneTools.wwwc.activate(div, 1);
    };

    /**
     * set zoom and pan tool
     */
    this.setZoomTool = function () {
        this.disableTools();
        var div = document.getElementById(this.elementId);
        cornerstoneTools.mouseInput.enable(div);
        cornerstoneTools.mouseWheelInput.enable(div);
        cornerstoneTools.pan.activate(div, 1);
        cornerstoneTools.zoom.activate(div, 4);
        cornerstoneTools.zoomWheel.activate(div);
    };

    /**
     * disable all tools
     */
    this.disableTools = function () {
        var div = document.getElementById(this.elementId);
        cornerstoneTools.wwwc.disable(div);
        cornerstoneTools.pan.deactivate(div);
        cornerstoneTools.zoom.deactivate(div);
        cornerstoneTools.zoomWheel.deactivate(div);
        if (this.activateDraw) {
            cornerstoneTools.rectangleRoi.deactivate(div);
        }
    };
};

