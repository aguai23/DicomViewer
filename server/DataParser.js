/**
 * Created by tx-eva-11 on 17-6-22.
 */
const fs = require('fs');
const path = require('path');
const dicomParser = require('dicom-parser');
module.exports = class DataParser {

    constructor(dir, numberOfImage, callback) {
        let self = this;
        this.dicomArray = new Array(numberOfImage);
        let count = 0;
        fs.readdir(dir, function (err, list) {
            list.forEach(function (file) {
                let filepath = path.resolve(dir,file);
                fs.readFile(filepath, (err,data) => {
                    let dataset = dicomParser.parseDicom(data);
                    let index = parseInt(dataset.string('x00200013'));
                    self.dicomArray[index - 1] = dataset;
                    count++;
                    if(count == numberOfImage) {
                        callback();
                    }
                });

            });
        });
    }

    getPixel(index) {
        let dataset = this.dicomArray[index - 1];
        let pixelDataElement = dataset.elements.x7fe00010;
        return new Uint16Array(dataset.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length/2);

    }



};