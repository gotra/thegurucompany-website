/**
 * Created by rajeevguru on 07/07/14.
 */

$(document).ready(function () {
    // On document load

    if (!("onhashchange" in window)) {
        //oops window haschange is not present on browserx§
        // display a nice screen to say browser is not supported!
    }

    // The main navigation function for the website
    function locationHashChanged(event) {
        // Regular expression for parsing the hash
        var re = /!page=(\w+)(&([a-zA-Z]+)=(\w+))?/;

        var matches = parseHash(location.hash, re), pageRequested,
            oldMatches, oldPage, subPageParam, subPageValue;

        // calculate where the user is navigating from
        if (event && event.oldURL) {

            oldMatches = parseHash(event.oldURL, re);
            if (oldMatches) {
                oldPage = oldMatches[1];
            }
        }
        if (matches) {
            // check the page requested
            pageRequested = matches[1];
            if (matches.length > 2) {
                subPageParam = matches[3];
                subPageValue = matches[4];
            }
        }
        else {
            pageRequested = 'home';
        }
        // if the user is just changing the sub page
        if (oldPage && oldPage == pageRequested) {
            // then skip loading the view just the sub page then!
            if (subPageParam) {
                loadSubPage(pageRequested,subPageParam, subPageValue);
            }
        }
        else if (subPageParam) {
            loadView(pageRequested, function () {
                loadSubPage(pageRequested,subPageParam, subPageValue);
            });
        }
        else {
            loadView(pageRequested,function(){
                var defaultSubPageParams = defaultSubPage(pageRequested);
                if (!$.isEmptyObject(defaultSubPageParams)) {
                    loadSubPage(pageRequested,defaultSubPageParams.param, defaultSubPageParams.value);
                }
            });
        }

        changeMenu(pageRequested);
    }

    // bind the function to the window hash change evvent
    window.onhashchange = locationHashChanged;
    // trigger manually the hash change event for the first time
    locationHashChanged();

});


// Function to parse the hash to see  which  page user wants to see
function parseHash(hash, regex) {

    var matches;

    if (hash && regex) {
        matches = hash.match(regex);
        if (matches && matches.length >= 1) {
            return matches;
        }
    }
    return null;

}

// function to load the pages requested
function loadView(page, callback) {
    var pageHtml = "views/" + page + ".html";
    $.get(pageHtml)
        .done(function (data) {
            $('div.view-content').empty().html(data);
            if (callback) {
                callback();
            }
        });

}


function loadSubPage(parentPage,param, value) {
    var subpage = "views/" + parentPage + "/" + param + value + ".html";
    $.get(subpage)
        .done(function (data) {
            $('div.blog-main').empty().html(data);
        });
}


// function which loads default subpages for pages
function defaultSubPage(page) {
    var defaultSub = {};

    if (page == 'blogs') {
        defaultSub.param = 'blog';
        defaultSub.value = '2';
    }

    return defaultSub;
}

//function to select the menu according to the navigation URL
function changeMenu(page) {

    //check if the menu is a valid choice
    var _n = $("nav.blog-nav").children("." + page);
    if (_n.length > 0) {

        $("nav.blog-nav").children(".active").removeClass("active");

        _n.addClass("active");

    }



}




