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
     * @param dicomProperty
     */
    constructor(elementId, numberOfImage, dicomProperty) {
        this.element = document.getElementById(elementId);
        cornerstone.enable(this.element);
        this.numberOfImage = numberOfImage;
        this.index = 1;
        this.imageLoader = new ImageLoader(cornerstone);
        this.imageData = new ImageData(numberOfImage);
        this.image = {
            imageId: 0,
            minPixelValue:dicomProperty.minPixelValue,
            maxPixelValue:dicomProperty.maxPixelValue,
            slope:dicomProperty.slope,
            intercept:dicomProperty.intercept,
            windowCenter: dicomProperty.windowCenter,
            windowWidth: dicomProperty.windowWidth,
            getPixelData: function(){},
            columns: dicomProperty.columns,
            rows: dicomProperty.rows,
            width:dicomProperty.width,
            height:dicomProperty.height,
            sizeInBytes: dicomProperty.sizeInBytes
        };
    }

    /**
     * increase slice number
     */
    increaseSlice() {
        if (this.index < this.numberOfImage) {
            this.index ++;
            this.setSlice(this.index);
        }
    }

    /**
     * decrease slice number
     */
    decreaseSlice() {
        if (this.index > 1) {
            this.index --;
            this.setSlice(this.index);
        }
    }

    /**
     * set slice number to index
     * @param index the index jump to
     */
    setSlice(index) {
        this.imageData.getSingleImage(index, this.element, this.renderImage, this);
    }

    /**
     * render image, used as callback
     * @param element the div element to render
     * @param pixel image pixel
     * @param index to specify different imageId
     * @param self this object
     */
    renderImage(element, pixel, index, self){
        self.image.imageId = index;
        self.image.getPixelData = function () {
            return pixel;
        };
        cornerstone.displayImage(element,self.image);
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
