/**
 * Created by tx-eva-11 on 17-6-27.
 */
class ToolController {

    constructor(element, imageRender) {
        this.element = element;
        this.imageRender = imageRender;
        this.selectedTool = "scroll";
        this.refreshTools();
    }

    setTools(selectTool) {
        this.selectedTool = selectTool;
        refreshTools();
    }

    refreshTools() {
        $("#" + this.element).off();
        if (this.selectedTool == "scroll") {
            this.setScrollTool();
        }
    }

    setScrollTool() {
        let self = this;
        let element = $("#" + this.element);
        let step = element.height()/this.imageRender.numberOfImage;
        console.log(step);
        element.bind("mousewheel", function (e) {
            let event = window.event || e;
            let up = event.wheelDelta > 0;
            if (up) {
                self.imageRender.increaseSlice();

            } else {
                self.imageRender.decreaseSlice();
            }
        });
        
        let startMove = false;
        let startPoint = 0;

        element.mousedown(function(e){
            startMove = true;
            startPoint = e.pageY;
        });
        element.mouseup(function (e) {
            startMove = false;
        });
        element.mouseleave(function (e) {
            startMove = false;
        });
        element.mousemove(function (e) {
            if(startMove) {
                if (e.pageY - startPoint > step) {
                    self.imageRender.increaseSlice();
                    startPoint = e.pageY;
                } else if (e.pageY - startPoint < -step) {
                    self.imageRender.decreaseSlice();
                    startPoint = e.pageY;
                }
            }
        })
    }
}