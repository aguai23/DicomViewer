/**
 * author: yunzhe
 * This class is used to deal with image rendering actions,
 * including changing slices, window width/center, size, position.
 */
class ImageRender {

    /**
     * constructor
     * @param elementId the div id which to render image
     */
    constructor(elementId) {
        this.element = document.getElementById(elementId);
        cornerstone.enable(this.element);
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
