/**
 * author: yunzhe
 * DataParser, responsible for parsing dicom data on serve side
 */
var fs = require('fs');
var path = require('path');
var dicomParser = require('dicom-parser');

/**
 * The data parser on server side
 * @param dir
 * @param numberOfImage
 * @param callback
 * @returns {*}
 */
module.exports = function DataParser(dir, numberOfImage, callback) {

    /**
     * the image dir containing dicom
     */
    this.dir = dir;

    /**
     * number of images in the dir
     */
    this.numberOfImage = numberOfImage;

    /**
     * dicom property of this dicom seris
     * @type {{}}
     */
    this.dicomProperty = {};

    /**
     * dicom array
     * @type {Array}
     */
    this.dicomArray = new Array(this.numberOfImage);

    /**
     * set up function
     */
    this.setup = function () {
        var self = this;
        var count = 0;
        fs.readdir(this.dir, function (err, list) {
            list.forEach(function (file) {
                var filepath = path.resolve(dir, file);
                fs.readFile(filepath, function (err, data) {
                    var dataset = dicomParser.parseDicom(data);
                    //console.log(Object.prototype.toString.call(dataset));
                    var index = parseInt(dataset.string('x00200013'));
                    self.dicomArray[index - 1] = data;
                    count++;
                    if (count == numberOfImage) {
                        self.constructProperty(self.dicomProperty, dataset);
                        callback(self.dicomProperty);
                    }
                });
            });
        });
    };

    /**
     * get pixel data
     * @param index the image index
     * @returns {Uint16Array}
     */
    this.getPixel = function(index) {
        var dataset = this.dicomArray[index - 1];
        // var pixelDataElement = dataset.elements.x7fe00010;
        // return new Uint16Array(dataset.byteArray.buffer, pixelDataElement.dataOffset, pixelDataElement.length/2);
        return dataset

    };

    /**
     * get property of dicom in order to render
     * @param property dicom property object
     * @param dataset dicom dataset
     */
    this.constructProperty = function(property, dataset) {
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