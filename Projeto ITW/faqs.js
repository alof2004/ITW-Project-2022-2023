$('.head').click(function () {
    console.log("OLÁ")
    $('.active').not(this).parent().find('.content').slideToggle(280);
    $('.head').not(this).removeClass('active')
    $('.head').not(this).parent().find('.arrow').removeClass('arrow-animate');
    $(this).toggleClass('active');
    $(this).parent().find('.arrow').toggleClass('arrow-animate');
    $(this).parent().find('.content').slideToggle(280);
});
$(document).ready(function () {
    
    console.log(email)
    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        $('#formsfaqs').submit(function (event) {
            var retval = true

            if ($("#pessoa").val().trim().length < 3 || $("#pessoa").val().trim().length > 50) {
                $("#pessoaError").removeClass('d-none');
                retval = false;
            }
            else {
                $("#pessoaError").addClass('d-none');
            }
            if ($("#pessoa2").val().trim().length < 3 || $("#pessoa2").val().trim().length > 50) {
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
function setTextAnimation(delay, duration, strokeWidth, timingFunction, strokeColor, repeat) {
    let paths = document.querySelectorAll("path:not(#question,#side)");
    let mode = repeat ? 'infinite' : 'forwards'
    for (let i = 0; i < paths.length; i++) {
        const path = paths[i];
        const length = path.getTotalLength();
        path.style["stroke-dashoffset"] = `${length}px`;
        path.style["stroke-dasharray"] = `${length}px`;
        path.style["stroke-width"] = `${strokeWidth}px`;
        path.style["stroke"] = `${strokeColor}`;
        path.style["animation"] = `${duration}s svg-text-anim ${mode} ${timingFunction}`;
        path.style["animation-delay"] = `${i * delay}s`;
    }
}
setTextAnimation(0.1, 2.5, 2, 'linear', '#ffffff', true);