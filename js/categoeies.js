
$('.all-categories').click(function(){

    $('.categories-dropdown-list').toggleClass('open')

    $('.categories-dropdown-list.open').click(() => {
        $('.categories-dropdown-list').removeClass('open')
        
    })
});

