
function copyLinkURL(url)
{    
    
    var link = url;
    navigator.clipboard.writeText(link);
    $('#copylink').hide();
    $('#copiedlink').show();   
    setTimeout(() => {
        $('#copylink').show();
        $('#copiedlink').hide();
    }, 1500);
}