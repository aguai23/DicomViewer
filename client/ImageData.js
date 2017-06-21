/**
 * author: yunzhe
 * This class is used to handle image data in buffer, implementing partial loading
 */
class ImageData {

    /**
     * This constructor initialize a buffer to store all image data, with partial loading mechanism,
     * a boolean array to indicate weather the image of one index is loaded or not
     * @param numberOfImage number of images of this seris
     */
    constructor(numberOfImage) {
        this.imageSize = 512 * 512;
        this.imageBuffer = new Uint16Array(this.imageSize * numberOfImage);
        this.loaded = new Array(numberOfImage).fill(false);
        this.xhttp = new XMLHttpRequest();
    }

    /**
     * get single image with partial loading
     * @param index the slice index of single image
     * @returns image object
     */
    getSingleImage(index) {
        if (this.loaded[index]) {
            return this.imageBuffer.subarray(index * this.imageSize, (index + 1) * this.imageSize);
        } else {
            let image = this.downloadImage(index);
            this.imageBuffer.set(image, index * this.imageSize);
            this.loaded[index] = true;
            return image;
        }
    }

    /**
     * get image from server via http
     * @param index the image index
     */
    downloadImage(index) {
        let url = index;
        this.xhttp.onreadystatechange= function () {
            if (this.readyState == 4 && this.status == 200) {
                let image = new Uint16Array(this.response);
                return image;
            }
        };
        xhttp.open("GET", url, true);
        xhttp.responseType = "arraybuffer";
        xhttp.send();
    }
}