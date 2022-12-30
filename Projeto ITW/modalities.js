// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---VariÃ¡veis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/modalities');
    self.displayName = 'Modalities List';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    self.records = ko.observableArray([]);
    self.favourites = ko.observableArray([]);
    self.currentPage = ko.observable(1);
    self.pagesize = ko.observable(20);
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
        $("#tagsModalities").autocomplete({
            minLength: 2,
            source: function (request, response) {
                $.ajax({
                    url: "http://192.168.160.58/Olympics/api/Modalities/SearchByName?q=" + request.term,
                    dataType: "json"
                }).done(function (APIdata) {
                    data = APIdata;
                    let modalities = data.map(function (modality) {
                        return {
                            label: modality.Name,
                            value: modality.Name,
                            name: modality.Id
                        }
                    });
                    response(modalities.slice(0, 10));
                });
            },
            select: function (event, ui) {
                window.location.href = "modalitiesDetails.html?id=" + ui.item.name;
            },
        }).find("li").css({ width: "150px" });

        $('#searchform').submit(function (event) {
            // prevent the default behavior (submitting the form)
            event.preventDefault();
            // get the value of the search bar
            let modalityID = $('#tagsModalities').val();
            // redirect to the athlete's page using the athlete ID
            if (isValidID(modalityID)) {
                window.location.href = "modalitiesDetails.html?id=" + modalityID;
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
                url: "http://192.168.160.58/Olympics/api/Modalities/" + id,
                type: "GET",
                async: false, // use the async option to make the request synchronous
                success: function () {
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
        localStorage.setItem("fav5", JSON.stringify(self.favourites()));
    };
    self.SetFavourites = function () {
        let storage;
        try {
            storage = JSON.parse(localStorage.getItem("fav5"));
        }
        catch (e) {
            ;
        }
        if (Array.isArray(storage)) {
            self.favourites(storage);
        }
    }

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getModalities...');
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
    self.activateSearch = function (search, page) {
        console.log('CALL: searchAthletes...');
        var composedUri = "http://192.168.160.58/Olympics/api/Modalities/SearchByName?q=" + search;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log("search Modalities", data);
            hideLoading();
            self.records(data.slice(0 + 24 * (page - 1), 24 * page));
            console.log(self.records())
            self.totalRecords(data.length);
            self.currentPage(page);
            if (page == 1) {
                self.hasPrevious(false)
            } else {
                self.hasPrevious(true)
            }
            if (self.records() - 24 > 0) {
                self.hasNext(true)
            } else {
                self.hasNext(false)
            }
            if (Math.floor(self.totalRecords() / 24) == 0) {
                self.totalPages(1);
            } else {
                self.totalPages(Math.ceil(self.totalRecords() / 24));
            }
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
    self.pesquisa = function () {
        self.pesquisado($("#SearchBar").val().toLowerCase());
        if (self.pesquisado().length > 0) {
            window.location.href = "modalities.html?search=" + self.pesquisado();
        }
    }
    //--- start ....
    showLoading();
    $("#SearchBar").val(undefined);
    self.pesquisado = ko.observable(getUrlParameter('search'));

    var pg = getUrlParameter('page');
    if (undefined == undefined) {
        if (self.pesquisado() == undefined) {
            if (pg == undefined) {
                if ('j' != undefined) self.activate(1);
                else self.activate(1)
            }
            else {
                if ('j' != undefined) self.activate(pg);
                else self.activate(pg)
            }
        } else {
            if (pg == undefined) self.activateSearch(self.pesquisado(), 1);
            else self.activateSearch(self.pesquisado(), pg)
            self.displayName = 'Results for ' + self.pesquisado()
        }
    } else {

    }
}

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})