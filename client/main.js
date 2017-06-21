/**
 * Created by tx-eva-11 on 17-6-16.
 */
$(document).ready(function () {
    let im = new ImageLoader(cornerstone);
    let imageId = "test://100/1.2.840.113619.2.55.3.2831183620.193.1386551333.465.1";
    //let imageId = "example://1";
    let element = document.getElementById("viewer");
    cornerstone.enable(element);
    cornerstone.loadImage(imageId).then(function (image) {
        cornerstone.displayImage(element, image);
    });
});