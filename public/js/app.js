
jQuery(document).ready(function(){

    $(document).foundation();


    var data = {
        activity: ''
    };

//                var showMap = function() {
//                    var map = new L.Map('map', { center: new L.LatLng(51.51, -0.11), zoom: 9});
//                    var googleLayer = new L.Google('ROADMAP');
//                    map.addLayer(googleLayer);
//                };

    $('.input-subactivity').on("click", function() {

        var v = $(this).data('reveal-id');

//                    $('#'+v)
        $('#modal-subactivity')
                .foundation('reveal')
                .foundation('reveal', 'open', {});

        $('.box-1,.box-2,.box-3').addClass("hide");
        $('.box-1').removeClass("hide");

        data = {};
        data.activity = $(this).data('val');

    });

    $(document).on('click', '.close-reveal-modal', function() {
        $('[data-reveal].open').foundation('reveal', 'close')
    });

    $("button.go-place").on("click", function() {

        $('.box-1').addClass('hide');
        $('.box-2').removeClass('hide');

//                    showMap();

        return false;
    });


    $(".go-date").on("click", function() {

        data.topic =  $('.box-1 input').val();

        $('.box-2').addClass('hide');
        $('.box-3').removeClass('hide');

        return false;
    });

    $(".go-review").on("click", function() {

        var date = $('#date-val').val();
        var time = $('#time-val').val();

        data.date = date + " " + time;


        $('.page-propose').addClass('hide');
        $('.page-review').removeClass('hide');

        $('#modal-subactivity')
                .foundation('reveal')
                .foundation('reveal', 'close', {});

        data.place =  $('#place-val').text();

        console.log(data);

        $('.data-activity').text(data.activity);
        $('.data-topic').text(data.topic);
        $('.data-place').text(data.place);

        $('.data-date').text(date);
        $('.data-time').text(time);


        return false;
    });


    $('#lightup').on("click", function() {

        $.post('/propose/send', data, function() {
            alert("Sent!");
        });

    });

});
