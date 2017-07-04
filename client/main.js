/**
 * author:yunzhe
 * The main entrance of this application
 */
$(document).ready(function () {
    startApp();
});

/**
 * start app
 */
let startApp = function () {
    let imageNumber = 0;
    let imageRender = null;
    $.get("/getImageCount", function (data) {
        imageNumber = parseInt(data);
    });

    let socket = io();
    let toolController = null;
    //receive message to indicate image is loaded
    socket.on("image", function (msg) {
        imageRender = new ImageRender("viewer", imageNumber, msg);
        imageRender.setSlice(1);
        toolController = new ToolController("viewer", imageRender);
        registerButton(toolController);
    });

};

/**
 * register button event
 * @param toolController tool controller object
 */
let registerButton = function (toolController) {
    $("#scroll-btn").click(function (e) {
        toolController.setTools("scroll");
    });
    $("#window-btn").click(function (e) {
        toolController.setTools("window");
    });
    $("#zoom-btn").click(function (e) {
        toolController.setTools("zoom");
    });
    $("#draw-btn").click(function (e) {
        toolController.setTools("draw");
    });
};