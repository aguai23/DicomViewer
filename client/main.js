/**
 * Created by tx-eva-11 on 17-6-16.
 */
$(document).ready(function () {
    startApp();
});

let startApp = function () {
    let imageNumber = 0;
    let imageRender = null;
    $.get("/getImageCount", function (data) {
        imageNumber = parseInt(data);
        imageRender = new ImageRender("viewer", imageNumber);
    });

    let socket = io();
    socket.on("image", function (msg) {
        if (msg == "done") {
            imageRender.setSlice(1);
        }
    });
    $("#viewer").bind("mousewheel", function (e) {
        let event = window.event || e;
        let up = event.wheelDelta > 0;
        if (up) {
            imageRender.increaseSlice();
        } else {
            imageRender.decreaseSlice();
        }
    });

    // imageRender.setSlice(1);
    // let im = new ImageLoader(cornerstone);
    // let imageId = "test://100/1.2.840.113619.2.55.3.2831183620.193.1386551333.465.1";
    // //let imageId = "example://1";
    // let element = document.getElementById("viewer");
    // cornerstone.enable(element);
    // cornerstone.loadImage(imageId).then(function (image) {
    //     cornerstone.displayImage(element, image);
    // });
};