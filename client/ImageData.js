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
        this.config = new config();
    }

    /**
     * get single image with partial loading
     * @param index the slice index of single image
     * @param element rendering element, used in callback
     * @param callback callback function to render image
     * @param parent this object in callback
     * @returns image object
     */
    getSingleImage(index, element, callback, parent) {
        let self = this;
        let xhttp = new XMLHttpRequest();
        if (this.loaded[index]) {
            callback(element, this.imageBuffer.subarray(index * this.imageSize, (index + 1) * this.imageSize),
            index,parent);
        } else {
            // download image
            let url = "http://" + this.config.host + ":" + this.config.port + "/getPixel?index=" + index;
            xhttp.onreadystatechange= function () {
                if (this.readyState == 4 && this.status == 200) {
                    let result = new Uint8Array(this.response);
                    let dataset = dicomParser.parseDicom(result);
                    let pixelDataElement = dataset.elements.x7fe00010;
                    result = new Uint16Array(dataset.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length/2);
                    //console.log(Object.prototype.toString.call(result.pixel));
                    self.imageBuffer.set(result, index * self.imageSize);
                    self.loaded[index] = true;
                    callback(element, self.imageBuffer.subarray(index * self.imageSize,
                        (index + 1) * self.imageSize), index, parent);
                }
            };
            xhttp.open("GET", url, true);
            xhttp.responseType = "arraybuffer";
            xhttp.send();

        }
    }

}