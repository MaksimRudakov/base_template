$(document).ready(function() {
    $('#modal-link').click(function(){
        $('.elipce').show();
        $('.modal').show();
		$('body').addClass('lock');
    });
    $('.elipce').click(function(){
		$('.elipce').hide();
        $('body').removeClass('lock');
        $('.modal').hide();
    });
    $('.modal-close').click(function(e){
        e.stopPropagation()
		$('.elipce').hide();
        $('body').removeClass('lock');
        $('.modal').hide();
    });
    $('.modal').click(function(e) {
        e.stopPropagation()
        $('.elipce').show();
        $('.modal').show();
		$('body').addClass('lock');
    })
});