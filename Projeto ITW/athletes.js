﻿// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/athletes');
    //self.baseUri = ko.observable('http://localhost:62595/api/athletes');
    self.displayName = 'Olympic Athletes List';
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

    self.toggleFavourite = function (id) {
        if (self.favourites.indexOf(id) == -1) {
            self.favourites.push(id);
        }
        else {
            self.favourites.remove(id);
        }
        localStorage.setItem("fav", JSON.stringify(self.favourites()));
    };
    self.SetFavourites = function () {
        let storage;
        try {
            storage = JSON.parse(localStorage.getItem("fav"));
        }
        catch (e) {
            ;
        }
        if (Array.isArray(storage)) {
            self.favourites(storage);
        }
    }

    self.formatNameSex = function(sex) {
        const iconName = sex == "M" ? "mars" : "venus";
        const icon = `<i class="fa fa-${iconName}" aria-hidden="true"></i>`
    
        return icon + " " + name;
    }

    self.formatPosition = function(med) {
        if(med == "1")
          return 'First Place (Gold)<br /><img style="width:40px;" src="medalGold.png" />';
        if(med == "2")
          return 'Second Place (Silver)<br /><img style="width:40px" src="medalSilver.png" />';
        if(med == "3")
          return 'Third Place (Bronze)<br /><img style="width:40px" src="medalBronze.png" />';
        if(med == "4")
          return "(No Medal)";
    };
    $().ready(function () {
        $("#SearchBar").autocomplete({
            minLength: 3,
            source: function (request, response) {
                $.ajax({
                    url: "http://192.168.160.58/Olympics/api/Athletes/SearchByName?q=" + request.term,
                    dataType: "json"
                }).done(function (APIdata) {
                    data = APIdata;
                    let competitions = data.map(function (competition) {
                        return {
                            label: competition.Name,
                            value: competition.Name,
                            name: competition.Id
                        }
                    });
                    response(competitions.slice(0, 10));
                });
            },
            select: function (event, ui) {
                window.location.href = "athletesDetails.html?id=" + ui.item.name;
            },
        }).find("li").css({ width: "150px" });
    });
      
    //--- Page Events
    self.activate = function (id, sortby = 'NameUp') {
        console.log('CALL: getAthletes...');
        var composedUri = self.baseUri() + "?page=" + id + "&pageSize=" + self.pagesize() + "&sortby=" + sortby;
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
        var composedUri = "http://192.168.160.58/Olympics/api/Athletes/SearchByName?q=" + search;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log("search Athletes", data);
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

    $("#pagSearch").hide()
    if (window.location.href.indexOf("search") > -1) {
        $("#pag").hide();
        $("#pagSearch").show();
    }
    self.pesquisado = ko.observable(getUrlParameter('search'));
    self.sortby = ko.observable(getUrlParameter('sortby'));
    if (self.pesquisado() == undefined) {
        if (pg == undefined) {
            if (self.sortby() != undefined) self.activate(1, self.sortby());
            else self.activate(1)
        }
        else {
            if (self.sortby() != undefined) self.activate(pg, self.sortby());
            else self.activate(pg)
        }
    } else {
        if (pg == undefined) self.activateSearch(self.pesquisado(), 1);
        else self.activateSearch(self.pesquisado(), pg)
        self.displayName = 'Founded results for <b>' + self.pesquisado() + '</b>';
    }
    showLoading();
    $("#searchbarall").val(undefined);
    self.pesquisado = ko.observable(getUrlParameter('search'));
    var pg = getUrlParameter('page');
    console.log(pg);
    self.pesquisado = ko.observable(getUrlParameter('search'));
    self.sortby = ko.observable(getUrlParameter('sortby'));
    if (self.pesquisado() == undefined) {
        if (pg == undefined) {
            if (self.sortby() != undefined) self.activate(1, self.sortby());
            else self.activate(1)
        }
        else {
            if (self.sortby() != undefined) self.activate(pg, self.sortby());
            else self.activate(pg)
        }
    } else {
        if (pg == undefined) self.activate2(self.pesquisado(), 1);
        else self.activateSearch(self.pesquisado(), pg)
        self.displayName = 'Founded results for <b>' + self.pesquisado() + '</b>';
    }

    self.pesquisa = function () {
        self.pesquisado($("#SearchBar").val().toLowerCase());
        if (self.pesquisado().length > 0) {
            localStorage.setItem('pesquisa', self.pesquisado());
            window.location.href = "athletes.html?search=" + self.pesquisado() + '&page=' + '1';
            
            
        }
    }
    
    //--- start ....
    showLoading();
    $("#searchbarall").val(undefined);
    self.pesquisado = ko.observable(getUrlParameter('search'));
    var pg = getUrlParameter('page');
    console.log(pg);
    self.pesquisado = ko.observable(getUrlParameter('search'));
    self.sortby = ko.observable(getUrlParameter('sortby'));
    if (self.pesquisado() == undefined) {
        if (pg == undefined) {
            if (self.sortby() != undefined) self.activate(1, self.sortby());
            else self.activate(1)
        }
        else {
            if (self.sortby() != undefined) self.activate(pg, self.sortby());
            else self.activate(pg)
        }
    } else {
        if (pg == undefined) self.activate2(self.pesquisado(), 1);
        else self.activateSearch(self.pesquisado(), pg)
        self.displayName = 'Founded results for <b>' + self.pesquisado() + '</b>';
    }

    ko.bindingHandlers.safeSrc = {
        update: function (element, valueAccessor) {
            var options = valueAccessor();
            var src = ko.unwrap(options.src);
            if (src == null) {
                $(element).attr('src', ko.unwrap(options.fallback));
            }
            $('<img />').attr('src', src).on('load', function () {
                $(element).attr('src', src);
            }).on('error', function () {
                $(element).attr('src', ko.unwrap(options.fallback));
            });

        }
    };
}

$(document).ready(function () {
    console.log("ready!");
    ko.applyBindings(new vm());
});

    $(document).ajaxComplete(function (event, xhr, options) {
        $("#myModal").modal('hide');
    });