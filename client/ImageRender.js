/**
 * author: yunzhe
 * This class is used to deal with image rendering actions,
 * including changing slices, window width/center, size, position.
 */
class ImageRender {

    /**
     * constructor
     * @param elementId the div id which to render image
     * @param numberOfImage number of images of a seris
     */
    constructor(elementId, numberOfImage) {
        this.element = document.getElementById(elementId);
        cornerstone.enable(this.element);
        this.imageData = new ImageData(numberOfImage);
        this.numberOfImage = numberOfImage;
        this.index = 1
    }

    increaseSlice() {
        if (this.index < this.numberOfImage) {
            this.index ++;
            this.setSlice(this.index);
        }
    }

    decreaseSlice() {
        if (this.index > 1) {
            this.setSlice(--this.index);
        }
    }

    setSlice(index) {
        let pixelData = this.imageData.getSingleImage(index, this.element, this.renderImage);
    }

    renderImage(element, pixelData) {
        console.log("render new image");
        let image = {
            imageId: "whatever",
            minPixelValue:0,
            maxPixelValue:4096,
            slope:1,
            intercept:-1024,
            windowCenter: -600,
            windowWidth: 1500,
            getPixelData: function(){return pixelData},
            columns: 512,
            rows: 512,
            width:512,
            height:512,
            sizeInBytes: 512*512*2
        };
        cornerstone.displayImage(element, image);
    }

    /**
     * set window center
     * @param windowCenter
     */
    setWindowCenter(windowCenter) {
        let viewport = cornerstone.getViewport(this.element);
        viewport.voi.windowCenter = windowCenter;
        cornerstone.setViewport(element, viewport);
    }

    /**
     * set window width
     * @param windowWidth
     */
    setWindowWidth(windowWidth) {
        let viewport = cornerstone.getViewport(this.element);
        viewport.voi.windowWidth = windowWidth;
        cornerstone.setViewport(element, viewport);
    }

    /**
     * set image size
     * @param scale
     */
    setImageScale(scale) {
        let viewport = cornerstone.getViewport(this.element);
        viewport.scale = scale;
        cornerstone.set(element, viewport);
    }

    /**
     * set image position
     * @param x
     * @param y
     */
    setImagePosition(x, y) {
        let viewport = cornerstone.get(this.element);
        viewport.translation.x = x;
        viewport.translation.y = y;
        cornerstone.setViewport(this.element, viewport);
    }

    /**
     * reset to default viewport settings
     */
    reset() {
        cornerstone.reset(this.element);
    }
}
