/**
 * author: yunzhe
 * DataParser, responsible for parsing dicom data on serve side
 */
const fs = require('fs');
const path = require('path');
const dicomParser = require('dicom-parser');
/**
 *
 * @type {DataParser}
 */
module.exports = class DataParser {

    /**
     * constructor
     * @param dir the dir containing the dicom images
     * @param numberOfImage number of images in the dir
     * @param callback called after image stored
     */
    constructor(dir, numberOfImage, callback) {
        this.dicomProperty = {};
        let self = this;
        this.dicomArray = new Array(numberOfImage);
        let count = 0;
        fs.readdir(dir, function (err, list) {
            list.forEach(function (file) {
                let filepath = path.resolve(dir,file);
                fs.readFile(filepath, (err,data) => {

                    let dataset = dicomParser.parseDicom(data);
                    //console.log(Object.prototype.toString.call(dataset));
                    let index = parseInt(dataset.string('x00200013'));
                    self.dicomArray[index - 1] = data;
                    count++;
                    if(count == numberOfImage) {
                        self.constructProperty(self.dicomProperty, dataset);
                        callback(self.dicomProperty);
                    }
                });
            });
        });
    }

    /**
     * get pixel data
     * @param index the image index
     * @returns {Uint16Array}
     */
    getPixel(index) {
        let dataset = this.dicomArray[index - 1];
        // let pixelDataElement = dataset.elements.x7fe00010;
        // return new Uint16Array(dataset.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length/2);
        return dataset

    }

    /**
     * get property of dicom in order to render
     * @param property dicom property object
     * @param dataset dicom dataset
     */
    constructProperty(property, dataset) {
        property.minPixelValue = 0;
        property.maxPixelValue = 4096;
        property.slope = dataset.string('x00281053').length !== 0 ? parseInt(dataset.string('x00281053')):0;
        property.intercept = dataset.string('x00281052').length !== 0 ? parseInt(dataset.string('x00281052')):-1024;
        property.windowCenter = -600;
        property.windowWidth = 1500;
        property.getPixelData = function () {

        };
        property.columns = dataset.string('x00280011').length !== 0 ? parseInt(dataset.string('x00280011')):512;
        property.rows = dataset.string('x00280010').length !== 0 ? parseInt(dataset.string('x00280010')):512;
        property.width = property.columns;
        property.height = property.rows;
        property.sizeInBytes = property.rows * property.columns * 2;
    }



};