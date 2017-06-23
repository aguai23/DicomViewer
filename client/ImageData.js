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
        this.config = new config();
    }

    /**
     * get single image with partial loading
     * @param index the slice index of single image
     * @returns image object
     */
    getSingleImage(index, element, callback) {
        let self = this;
        if (this.loaded[index]) {
            return this.imageBuffer.subarray(index * this.imageSize, (index + 1) * this.imageSize);
        } else {
            // download image
            let url = "http://" + this.config.host + ":" + this.config.port + "/getPixel?index=" + index;
            this.xhttp.onreadystatechange= function () {
                if (this.readyState == 4 && this.status == 200) {
                    let result = JSON.parse(this.response);
                    //console.log(Object.prototype.toString.call(result.pixel));
                    let image = self.constructArray(result.pixel) ;
                    console.log(image.length);
                    self.setBuffer(self.imageBuffer, image, index * self.imageSize);
                    self.loaded[index] = true;
                    callback(element, image);
                }
            };
            this.xhttp.open("GET", url, true);
            this.xhttp.send();

        }
    }

    constructArray(pixel) {
        let length = Object.keys(pixel).length;
        let array = new Uint16Array(length);
        for (let i = 0; i < length; i++) {
            array[i] = pixel[i + 1];
        }
        return array;
    }

    setBuffer(source, dest, offset){
        for(let i = 0; i < dest.length; i++) {
            source[i + offset] = dest[i]
        }
    }


}