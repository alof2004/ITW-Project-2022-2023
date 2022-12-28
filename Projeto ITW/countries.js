﻿// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---VariÃ¡veis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/countries');
    self.displayName = 'Countries List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
    self.favourites = ko.observableArray([]);
    self.totalRecords = ko.observable(50);
    self.hasPrevious = ko.observable(false);
    self.hasNext = ko.observable(false);
    self.previousPage = ko.computed(function () {
        return self.currentPage() * 1 - 1;
    }, self);
    self.nextPage = ko.computed(function () {
        return self.currentPage() * 1 + 1;
    }, self);
    self.fromRecord = ko.computed(function () {
        return self.previousPage() * self.pagesize() + 1;
    }, self);
    self.toRecord = ko.computed(function () {
        return Math.min(self.currentPage() * self.pagesize(), self.totalRecords());
    }, self);
    self.totalPages = ko.observable(0);
    self.pageArray = function () {
        var list = [];
        var size = Math.min(self.totalPages(), 9);
        var step;
        if (size < 9 || self.currentPage() === 1)
            step = 0;
        else if (self.currentPage() >= self.totalPages() - 4)
            step = self.totalPages() - 9;
        else
            step = Math.max(self.currentPage() - 5, 0);

        for (var i = 1; i <= size; i++)
            list.push(i + step);
        return list;
    };

    $().ready(function () {
        $("#tagsCountries").autocomplete({
            minlenght: 3,
            source: function (request, response) {
                $.ajax({
                    url: "http://192.168.160.58/Olympics/api/Countries/SearchByName?q=" + request.term,
                    dataType: "json"
                }).done(function ( APIdata) {
                    data = APIdata;
                    let countries = data.map(function (country) {
                        return {
                            label: country.Name,
                            value: country.Name,
                            name: country.Id
                        }
                             });
                    response(countries.slice(0, 10));
                });
            },
            select: function (event, ui) {
                window.location.href = "countriesDetails.html?id=" + ui.item.name;
            },
        }).find("li").css({ width: "150px" });

        $('#searchform').submit(function(event) {
            // prevent the default behavior (submitting the form)
            event.preventDefault();
            // get the value of the search bar
            let countryID = $('#tagsCountries').val();
            // redirect to the athlete's page using the athlete ID
            if (isValidID(countryID)) {
            window.location.href = "countriesDetails.html?id=" + countryID;
            } else {
            // if the ID is not valid, show an error message
            $('#error-message').html('<span class="text-danger"><i class="fa fa-warning" aria-hidden="true"></i> Invalid </span>'); 
            }
          });
          // a function to check the validity of the athlete ID
          function isValidID(id) {
            // a variable to store the result of the API page existence check
            var pageExists = false;
            // make an HTTP GET request to the API URL
            $.ajax({
                url: "http://192.168.160.58/Olympics/api/Countries/" + id,
                type: "GET",
                async: false, // use the async option to make the request synchronous
                success: function() {
                // if the request is successful, the page exists
                pageExists = true;
          }
            });
            // return the result of the API page existence check
            return pageExists;
            }
    });

    self.toggleFavourite = function (id) {
        if (self.favourites.indexOf(id) == -1) {
            self.favourites.push(id);
        }
        else {
            self.favourites.remove(id);
        }
        localStorage.setItem("fav2", JSON.stringify(self.favourites()));
    };
    self.SetFavourites = function () {
        let storage;
        try {
            storage = JSON.parse(localStorage.getItem("fav2"));
        }
        catch (e) {
            ;
        }
        if (Array.isArray(storage)) {
            self.favourites(storage);
        }
    }
    
    $().ready(function () {
        $("#tags").autocomplete({
            minlenght: 3,
            source: function (request, response) {
                $.ajax({
                    url: "http://192.168.160.58/Olympics/api/Countries//SearchByName?q=" + request.term,
                    dataType: "json"
                }).done(function ( APIdata) {
                    data = APIdata;
                    let countries = data.map(function (Country) {
                        return {
                            label: Country.Name,
                            value: Country.Id
                        }
                             });
                    response(countries.slice(0, 10));
                });
            },
            select: function (event, ui) {
                window.location.href = "countriesDetails.html?id=" + ui.item.value;
            },
        }).find("li").css({ width: "150px" });
    });

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getCountries...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize();
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.records(data.Records);
            self.currentPage(data.CurrentPage);
            self.hasNext(data.HasNext);
            self.hasPrevious(data.HasPrevious);
            self.pagesize(data.PageSize)
            self.totalPages(data.TotalPages);
            self.totalRecords(data.TotalRecords);
            self.SetFavourites();
        });
    };


    //--- Internal functions
    function ajaxHelper(uri, method, data) {
        self.error(''); // Clear error message
        return $.ajax({
            type: method,
            url: uri,
            dataType: 'json',
            contentType: 'application/json',
            data: data ? JSON.stringify(data) : null,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log("AJAX Call[" + uri + "] Fail...");
                hideLoading();
                self.error(errorThrown);
            }
        });
    }

    function sleep(milliseconds) {
        const start = Date.now();
        while (Date.now() - start < milliseconds);
    }

    function showLoading() {
        $("#myModal").modal('show', {
            backdrop: 'static',
            keyboard: false
        });
    }
    function hideLoading() {
        $('#myModal').on('shown.bs.modal', function (e) {
            $("#myModal").modal('hide');
        })
    }

    function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;
        console.log("sPageURL=", sPageURL);
        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('page');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});

var flag = true;
var arrayFavsIDS = new Array();

var arrayLocalStorage = new Array(localStorage.getItem("IDS"));

arrayLocalStorage = arrayLocalStorage[0].split(",");

function addfav(event) {
    console.log("iM IN")
    var clicked = event.currentTarget;
    var outElemtn = clicked.parentElement.parentElement.parentElement;

    console.log("heyheyhey" + $("#tab1").children("td:first"));


    var infoTr = new Array(outElemtn.innerText.split("    "));
    var stelem = infoTr[0][0];
    console.log("abacate " + stelem);


    actualArray = arrayLocalStorage;

    clicked.classList.remove("fa-heart-o");
    clicked.classList.add("fa-heart-danger");

    if (flag) {
        clicked.classList.remove("fa-heart-o");
        clicked.classList.add("fa-heart-danger");
        if (arrayFavsIDS.includes(stelem)) {
            console.log("já existente no array!")
        } else {
            arrayFavsIDS.push(stelem)
            localStorage.setItem("IDS", arrayFavsIDS);
        }

    } else {
        clicked.classList.add("fa-heart-o");
        clicked.classList.remove("fa-heart");
        if (arrayFavsIDS.includes(stelem)) {
            arrayFavsIDS.splice(arrayFavsIDS.indexOf(stelem), 1)
            localStorage.setItem("IDS", arrayFavsIDS);
        } else {
            console.log("já existente no array!")
        }
    }

    flag = !flag;
    console.log(arrayFavsIDS);
}