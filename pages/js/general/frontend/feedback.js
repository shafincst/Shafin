         var _formValidation = function() {
        if ($('#content_form').length > 0) {
            $('#content_form').parsley().on('field:validated', function() {
                var ok = $('.parsley-error').length === 0;
                $('.bs-callout-info').toggleClass('hidden', !ok);
                $('.bs-callout-warning').toggleClass('hidden', ok);
            });
        }
    
    $('#content_form').on('submit', function (e) {
        e.preventDefault();
        $('#submit').hide();
        $('#submiting').show();
        $(".ajax_error").remove();
        var submit_url = $('#content_form').attr('action');
        //Start Ajax
        var formData = new FormData($("#content_form")[0]);
        $.ajax({
            url: submit_url,
            type: 'POST',
            data: formData,
            contentType: false, // The content type used when sending data to the server.
            cache: false, // To unable request pages to be cached
            processData: false,
            dataType: 'JSON',
            success: function (data) {
                if (data.status == 'danger') {
                    toastr.error(data.message);

                } else {
                    toastr.success(data.message);
                    if (data.goto) {
                        setTimeout(function () {

                            window.location.href = data.goto;
                        }, 2500);
                    }
                    if (data.load) {
                        window.location.href = '';
                    }
                }
                $('#submit').show();
                $('#submiting').hide();
            },
            error: function (data) {
                var jsonValue = $.parseJSON(data.responseText);
                const errors = jsonValue.errors;
                if (errors) {
                    var i = 0;
                    $.each(errors, function (key, value) {
                        const first_item = Object.keys(errors)[i]
                        const message = errors[first_item][0];
                        $('#' + first_item).parsley().removeError('required', {
                            updateClass: true
                        });
                        $('#' + first_item).parsley().addError('required', {
                            message: value,
                            updateClass: true
                        });
                        // $('#' + first_item).after('<div class="ajax_error" style="color:red">' + value + '</div');
                        toastr.error(value);
                        i++;
                    });
                } else {
                    toastr.error(jsonValue.message);

                }
                $('#submit').show();
                $('#submiting').hide();
            }
        });
    });

       
    };

    _formValidation();