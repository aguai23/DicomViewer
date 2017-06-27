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
    });

    let socket = io();
    socket.on("image", function (msg) {
        imageRender = new ImageRender("viewer", imageNumber, msg);
        imageRender.setSlice(1);
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

};