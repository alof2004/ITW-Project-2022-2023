



////////////////////////////
// ViewModel KnockOut
$(document).ready(function () {

    var vm = function () {
        console.log('ViewModel initiated...');
        //---Variáveis locais
        var self = this;
        self.displayName = 'Olympic Games editions List';
        self.error = ko.observable('');
        self.passingMessage = ko.observable('');
        self.records = ko.observableArray([]);
        self.availableTags = ko.observableArray([]);//!!
        self.currentPage = ko.observable(1);
        // self.pagesize = ko.observable(100);
        self.totalRecords = ko.observable();
        self.hasPrevious = ko.observable(false);
        self.hasNext = ko.observable(false);
        self.photo = ko.observable();
        self.tablename = ko.observable();
        self.SearchData = ko.observableArray([]);


        self.previousPage = ko.computed(function () {
            return self.currentPage() * 1 - 1;
        }, self);

        self.totalPages = ko.observable(0);
        self.argsURL = ko.observable();
        self.tablenames = ko.observableArray()

        //--- Page Events
        self.activate = function (searched) {
            console.log('CALL: getGames...');

            var composedUri = `http://192.168.160.58/Olympics/api/Utils/Search?q=${searched}`;
            // var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=5422&pagesize=25`;
            ajaxHelper(composedUri, 'GET').done(function (data) {
                console.log(data);
                hideLoading();
                self.SearchData(data);

                for (var i = 0; i < data.length; i++) {
                    if (self.tablenames().includes((data[i].TableName).toLowerCase())) {
                        continue;
                    } else {
                        (self.tablenames).push((data[i].TableName).toLowerCase());
                    }
                    self.checkButtons(data[i].Id)
                }

                console.log(self.tablenames(), 'tablenames?');


                //self.SetFavourites();
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
        $("#searchAll").autocomplete({
            minLength: 3,
            source: function (request, response) {
                $.ajax({
                    url: "http://192.168.160.58/Olympics/api/Utils/Search?q=" + request.term,
                    dataType: "json"
                }).done(function (APIdata) {
                    data = APIdata;
                    let todos = data.map(function (todo) {
                        return {
                            value1: todo.TableName,
                            label: todo.Name,
                            value: todo.Id
                        }
                    });
                    response(todos.slice(0, 10));
                });
            },
            select: function (event, ui) {
                if (ui.item.value1 === 'Athletes') {
                    window.location.href = "athletesDetails.html?id=" + ui.item.value;
                }
                else if (ui.item.value1 === 'Countries') {
                    window.location.href = "countriesDetails.html?id=" + ui.item.value;
                }
                else if (ui.item.value1 === 'Competitions') {
                    window.location.href = "competitionsDetails.html?id=" + ui.item.value;
                }
                else if (ui.item.value1 === 'Modalities') {
                    window.location.href = "modalitiesDetails.html?id=" + ui.item.value;
                }
                else if (ui.item.value1 === 'Games') {
                    window.location.href = "gameDetails.html?id=" + ui.item.value;
                }
            },
        }).find("li").css({ width: "150px" });

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
        function once(fn) {
            var executed = false;
            return function () {
                if (!executed) {
                    executed = true;
                    // do something
                    fn(x);
                }
            };
        }


        //-----SearchingTime------//

        self.search = function (q) {
            if (q.length < 4) return;
            else {
                var composedUri = `http://192.168.160.58/Olympics/api/Athletes/SearchByName?q=${q}`;
                // var composedUri = `http://192.168.160.58/Olympics/api/Athletes?page=5422&pagesize=25`;
                ajaxHelper(composedUri, 'GET').done(function (data) {
                    console.log(data, 'data?');
                    hideLoading();
                    self.availableTags(data);
                    //self.SetFavourites();
                });
            }
        };
        //
        $('#searchAll').autocomplete({
            // source: self.availableTags(),
            max: 50,
            minLength: 3,
            source:
                function (request, response) {
                    $.ajax({
                        type: "GET",
                        url: `http://192.168.160.58/Olympics/api/Utils/Search?`,
                        data: {
                            q: $('#searchAll').val()
                        },
                        success: function (data) {

                            if (!data.length) {
                                var result = [{
                                    label: 'No matches found',
                                    value: response.term
                                }];
                                response(result);
                            } else {

                                var nData = $.map(data, function (value, key) {
                                    return {
                                        label: value.Name,
                                        value: value.Name
                                    }
                                });
                                results = $.ui.autocomplete.filter(nData, request.term);
                                response(results.slice(0, 20));
                            }
                        },
                        error: function () {
                            alert("error!");
                        }
                    })
                },

        });
        //-----END-SEARCH------//

        //---START-SHOW-FIRST-PAGE---//
        showLoading();
        let arg = window.location.search.replace('?SearchAll=', '');
        self.activate(arg);


        console.log("VM initialized!");


        //----------FAVORITOS-------------// 
        console.log("ready!");
    };


    ko.applyBindings(new vm());
});


$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
})

//

