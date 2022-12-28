$('.head').click(function () {
    console.log("OLÁ")
    $(this).toggleClass('active');
    $(this).parent().find('.arrow').toggleClass('arrow-animate');
    $(this).parent().find('.content').slideToggle(280);
});
$(document).ready(function () {
    
    console.log(email)
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        $('#formsfaqs').submit(function (event) {
            var retval = true

            if ($("#pessoa").val().trim().length < 5 || $("#pessoa").val().trim().length > 50) {
                $("#pessoaError").removeClass('d-none');
                retval = false;
            }
            else {
                $("#pessoaError").addClass('d-none');
            }
            if ($("#pessoa2").val().trim().length < 5 || $("#pessoa2").val().trim().length > 50) {
                $("#pessoa2Error").removeClass('d-none');
                retval = false;
            }
            else {
                $("#pessoa2Error").addClass('d-none');
            }
            if ($("#email").val().trim().length < 10 || $("#email").val().trim().length > 100) {
                if ($("#emailError").hasClass('d-none')) {
                    $("#emailError").removeClass('d-none');
                }
                retval = false;
            }
            else if (!($("#email").val().trim().match(validRegex))) {
                if ($("#emailError").hasClass('d-none')) {
                    $("#emailError").removeClass('d-none');
                }
                retval = false;
            }
            else {
                $("#emailError").addClass('d-none');
            }
            if ($('input[name="duvtipo"]:checked').length < 1) {
                $("#duvtipoError").removeClass('d-none');
                retval = false;
            }

            else {
                $("#duvtipoError").addClass('d-none');
            }
            if ($("#duvida").val().trim().length < 20 || $("#duvida").val().trim().length > 200) {
                $("#duvidaError").removeClass('d-none');
                retval = false;
            }
            else {
                $("#duvidaError").addClass('d-none');
            }
            return retval
        })
    $('#clean').click(function () {
            $("#pessoa2Error").addClass('d-none');
            $("#pessoaError").addClass('d-none');
            $("#emailError").addClass('d-none');
            $("#duvtipoError").addClass('d-none');
            $("#duvidaError").addClass('d-none');
        });
    });