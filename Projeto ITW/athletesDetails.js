// ViewModel KnockOut
var vm = function () {
    console.log('ViewModel initiated...');
    //---Variáveis locais
    var self = this;
    self.baseUri = ko.observable('http://192.168.160.58/Olympics/api/Athletes/FullDetails?id=');
    self.displayName = 'Olympic Games edition Details';
    self.error = ko.observable('');
    self.passingMessage = ko.observable('');
    //--- Data Record
    self.Id = ko.observable('');
    self.Name = ko.observable('');
    self.Sex = ko.observable('');
    self.Height = ko.observable('');
    self.Weight = ko.observable('');
    self.BornDate = ko.observable('');
    self.BornPlace = ko.observableArray('');
    self.DiedDate = ko.observable('');
    self.DiedPlace = ko.observable('');
    self.Photo = ko.observable('');
    self.OlympediaLink = ko.observableArray('');
    self.Medals = ko.observableArray('');
    self.Games = ko.observableArray('');
    self.Modalities = ko.observableArray('');
    self.Competitions = ko.observableArray('');

    //--- Page Events
    self.activate = function (id) {
        console.log('CALL: getAthlete...');
        var composedUri = self.baseUri() + id;
        ajaxHelper(composedUri, 'GET').done(function (data) {
            console.log(data);
            hideLoading();
            self.Id(data.Id);
            self.Name(data.Name);
            self.Sex(data.Sex);
            self.Height(data.Height);
            self.Weight(data.Weight);
            self.BornDate(data.BornDate);
            self.BornPlace(data.BornPlace);
            self.DiedDate(data.DiedDate);
            self.DiedPlace(data.DiedPlace);
            self.Photo(data.Photo);
            self.OlympediaLink(data.OlympediaLink);
            self.Medals(data.Medals);
            self.Games(data.Games);
            self.Modalities(data.Modalities);
            self.Competitions(data.Competitions);
            // if does not have a value it will not show
            
            if (data.Sex === "F") {
                $("#sex").html('<i class="fa fa-venus" aria-hidden="true"></i> Female');
                }
                if (data.Sex === "M") {
                    $("#sex").html('<i class="fa fa-mars" aria-hidden="true"></i> Male');
                }
            
            $("#BD").text( new Date(data.BornDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))
            $("#DD").text( new Date(data.DiedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))
            

            //--- Calcular a idade
            if (data.DiedDate != null) {
                $("#age").text(new Date(data.DiedDate).getFullYear() - new Date(data.BornDate).getFullYear() + ' years old when ')
                if (data.Sex === "F") {
                    $("#age2").text("she died");
                    }
                    if (data.Sex === "M") {
                        $("#age2").text("he died");
                    }
            }

            if (data.DiedDate == null) {
                let age = new Date().getFullYear() - new Date(data.BornDate).getFullYear() + " years old (currently)"
                if (age > 130) {
                    $("#age").text("Unknown")}
                $("#age").text(new Date().getFullYear() - new Date(data.BornDate).getFullYear() + " years old (currently)")
            }

            if (data.BornDate == null) {
                $("#age").text("Unknown");
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

    function showLoading() {
        $('#myModal').modal('show', {
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

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    //--- start ....
    showLoading();
    var pg = getUrlParameter('id');
    console.log(pg);
    if (pg == undefined)
        self.activate(1);
    else {
        self.activate(pg);
    }
    console.log("VM initialized!");
};

$(document).ready(function () {
    console.log("document.ready!");
    ko.applyBindings(new vm());
});

$(document).ajaxComplete(function (event, xhr, options) {
    $("#myModal").modal('hide');
});
