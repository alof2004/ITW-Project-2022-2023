        // tabs
        var tabLinks = document.querySelectorAll(".tablinks");
        var tabContent = document.querySelectorAll(".tabcontent");

        tabLinks.forEach(function(el) {
        el.addEventListener("click", openTabs);
        });

        function openTabs(el) {
        var btnTarget = el.currentTarget;
        var country = btnTarget.dataset.country;

        tabContent.forEach(function(el) {
            el.classList.remove("active");
        });

        tabLinks.forEach(function(el) {
            el.classList.remove("active");
        });

        document.querySelector("#" + country).classList.add("active");
        
        btnTarget.classList.add("active");
        }



        var Counter2 = [];
        var Name2 = [];

        $.ajax({
        type: 'GET',
        url: 'http://192.168.160.58/Olympics/api/statistics/Games_Athletes',
        headers: {
        'Content-Type': 'application/json'
        },
        success: function (data, status, xhr) {

            var athData = data;

            athData.forEach(element => {
            Counter2.push(element.Counter);
            Name2.push(element.Name);
            });

            createBarGraph2(Counter2, Name2);

            }
        });

        function createBarGraph2(Counter, Name) {
        let barChart2 = new Chart("Chart2", {
            type: "bar",
            data: {
                labels: Name2,
                datasets: [{
                data: Counter2,
                label: 'Number of Athletes per Olympic Games edition',
                backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(54, 162, 235, 0.2)',],
                borderColor: ['rgb(75, 192, 192)','rgb(54, 162, 235)',],
                borderWidth: 1
            }]
            },
            options:{
                animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: true
                }
                },
        }
        });
        }    
        
        


        var Counter3 = [];
        var Name3 = [];

        $.ajax({
        type: 'GET',
        url: 'http://192.168.160.58/Olympics/api/statistics/Games_Competitions',
        headers: {
        'Content-Type': 'application/json'
        },
        success: function (data, status, xhr) {

            var athData = data;

            athData.forEach(element => {
            Counter3.push(element.Counter);
            Name3.push(element.Name);
            });

            createBarGraph3(Counter3, Name3);

            }
        });

        function createBarGraph3(Counter, Name) {
        let barChart3 = new Chart("Chart3", {
            type: "bar",
            data: {
                labels: Name3,
                datasets: [{
                data: Counter3,
                label: 'Number of Competitions per Olympic Games edition',
                backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(54, 162, 235, 0.2)',],
                borderColor: ['rgb(75, 192, 192)','rgb(54, 162, 235)',],
                borderWidth: 1
            }]
            },
            options:{
                animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: true
                }
                },
        }
        });
        }       
        
        



        var Counter4 = [];
        var Name4 = [];

        $.ajax({
        type: 'GET',
        url: 'http://192.168.160.58/Olympics/api/statistics/Games_Countries',
        headers: {
        'Content-Type': 'application/json'
        },
        success: function (data, status, xhr) {

            var athData = data;

            athData.forEach(element => {
            Counter4.push(element.Counter);
            Name4.push(element.Name);
            });

            createBarGraph4(Counter4, Name4);

            }
        });

        function createBarGraph4(Counter, Name) {
        let barChart4 = new Chart("Chart4", {
            type: "bar",
            data: {
                labels: Name4,
                datasets: [{
                data: Counter4,
                label: 'Number of Countries per Olympic Games edition',
                backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(54, 162, 235, 0.2)',],
                borderColor: ['rgb(75, 192, 192)','rgb(54, 162, 235)',],
                borderWidth: 1
            }]
            },
            options:{
                animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: true
                }
                },
        }
        });
        }     
        
        




        var Counter5 = [];
        var Name5 = [];

        $.ajax({
        type: 'GET',
        url: 'http://192.168.160.58/Olympics/api/statistics/Games_Modalities',
        headers: {
        'Content-Type': 'application/json'
        },
        success: function (data, status, xhr) {

            var athData = data;

            athData.forEach(element => {
            Counter5.push(element.Counter);
            Name5.push(element.Name);
            });

            createBarGraph5(Counter5, Name5);

            }
        });

        function createBarGraph5(Counter, Name) {
        let barChart5 = new Chart("Chart5", {
            type: "bar",
            data: {
                labels: Name5,
                datasets: [{
                data: Counter5,
                label: 'Number of Modalities per Olympic Games edition',
                backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(54, 162, 235, 0.2)',],
                borderColor: ['rgb(75, 192, 192)','rgb(54, 162, 235)',],
                borderWidth: 1
            }]
            },
            options:{
                animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: true
                }
                },
        }
        });
        }       
        
        




        var Counter6 = [];
        var Name6 = [];

        $.ajax({
        type: 'GET',
        url: 'http://192.168.160.58/Olympics/api/statistics/Medals_Country',
        headers: {
        'Content-Type': 'application/json'
        },
        success: function (data, status, xhr) {

            var athData = data;

            athData.forEach(element => {
            Counter6.push(element.Medals.reduce((accum, ele) => ele.Counter + accum, 0));
            Name6.push(element.CountryName);
            });

            createBarGraph6(Counter6, Name6);

            }
        });

        

        function createBarGraph6(Counter, Name) {
        let barChart6 = new Chart("Chart6", {
            type: "line",
            data: {
                labels: Name6,
                datasets: [{
                data: Counter6,
                label: 'Number of Medals by Country over all Olympic Games editions',
                backgroundColor: ['rgba(75, 192, 192, 0.2)','rgba(54, 162, 235, 0.2)',],
                borderColor: ['rgb(75, 192, 192)','rgb(54, 162, 235)',],
                borderWidth: 1
            }]
            },
            options:{
                animations: {
                tension: {
                    duration: 1000,
                    easing: 'linear',
                    from: 1,
                    to: 0,
                    loop: true
                }
                },
        }
        });
        }
