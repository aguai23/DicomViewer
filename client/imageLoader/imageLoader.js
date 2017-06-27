/**
 * author: yunzhe zhang
 * image loader for rendering
 */
class ImageLoader {

    /**
     * constructor initialize the class with cornerstone
     * @param cornerstore
     */
    constructor(cornerstore) {
        this.cornerstone = cornerstore;
        this.cornerstone.registerImageLoader("dicom", this.loadImage);
    }

    /**
     * loadImage given url
     * @param imageId the url of image
     * @returns defered object containing loaded image
     */
    loadImage(imageId) {
        let defered = $.Deferred();
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200){
                let buffer = new Uint8Array(xhttp.response);
                let dataset = dicomParser.parseDicom(buffer);
                let pixelDataElement = dataset.elements.x7fe00010;
                let pixelData = new Uint16Array(dataset.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length/2);
                let image = {
                    imageId: imageId,
                    minPixelValue:0,
                    maxPixelValue:4096,
                    slope:parseInt(dataset.string('x00281053')),
                    intercept:parseInt(dataset.string('x00281052')),
                    windowCenter: -600,
                    windowWidth: 1500,
                    getPixelData: function(){return pixelData},
                    columns: 512,
                    rows: 512,
                    width:512,
                    height:512,
                    sizeInBytes: 512*512*2
                };
                defered.resolve(image);
            }
        };
        let urls = "http://127.0.0.1:3600/getPixel?index=" + imageId.split("//")[1];
        xhttp.open("GET", urls, true);
        xhttp.responseType = "arraybuffer";
        xhttp.send(null);

        return defered;
    }
};