$(document).ready(function () {
    load_saved_files();
    $("#itemsList").hide();
});

$("#fileInput").on("change", function () {
    var reader = new FileReader();
    var file = $("#fileInput")[0].files[0];

    $(reader).on("load", function () {
        $("#upload_image_span").attr("src", reader.result);
        setEvents("#upload_image_span");
    });

    if (file)
        reader.readAsDataURL(file);
});