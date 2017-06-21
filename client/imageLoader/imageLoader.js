/**
 * Created by tx-eva-11 on 17-6-16.
 */
var imageLoader = function(cornerstone) {

    /**
     * loadImage given url
     * @param imageId the url of image
     * @returns defered object containing loaded image
     */
    function loadImage(imageId) {
        var defered = $.Deferred();
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200){
                var buffer = new Uint8Array(xhttp.response);
                var dataset = dicomParser.parseDicom(buffer);
                var pixelDataElement = dataset.elements.x7fe00010;
                var pixelData = new Uint16Array(dataset.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length/2);
                var image = {
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
        var urls = imageId.split(":")[1].substring(2);
        urls = "http://127.0.0.1:4600/" + urls;
        console.log(urls);

        xhttp.open("GET", urls, true);
        xhttp.responseType = "arraybuffer";
        xhttp.send(null);

        return defered;
    }


    cornerstone.registerImageLoader("test", loadImage);
};