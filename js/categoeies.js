
$('.all-categories').click(function(){

    $('.categories-dropdown-list').toggleClass('open')
$("#sidomeny").css("overflow: auto");
    $('.categories-dropdown-list.open').click(() => {
        $('.categories-dropdown-list').removeClass('open')
        $("#sidomeny").css("overflow: hidden");
        
    })
});

