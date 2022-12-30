
        var Counter1 = [];
        var Medalhas = [];
        var res = document.location.href.split('?')[1];
        var yes = res.replace("id=", "");

google.charts.load('current', { 'packages': ['corechart'] }).then(function () {


    $.ajax({
        type: 'GET',
        url: 'http://192.168.160.58/Olympics/api/Games/FullDetails?id=' + yes,
        headers: {
            'Content-Type': 'application/json'
        },
        success: function (data, status, xhr) {

            Medalhas.push((data.Medals).map(({ MedalName }) => MedalName));
            Counter1.push((data.Medals).map(({ Counter }) => Counter));
            const ola1 = parseInt(Counter1[0][0]);
            const ola2 = parseInt(Counter1[0][1]);
            const ola3 = parseInt(Counter1[0][2]);
            console.log(Medalhas);
            console.log(Counter1);

            function drawChart(Counter1, Medalhas) {
                var data = new google.visualization.DataTable();
                console.log(Counter1);
                data.addColumn('string', 'Medalha');
                data.addColumn('number', 'Quantidade');
                data.addRows([
                    ['Gold', ola1],
                    ['Silver', ola2],
                    ['Bronze', ola3]
                ]);
                var options = {

                    legend: { color: 'white' },
                    title: 'Medals assigned in this Olympics Game Edition',
                    backgroundColor: '#1F2022',
                    titleTextStyle: {
                        color:'white'
                    },
                    colors: ['#FAC213', '#AAAAAA', '#A64B2A'],
                    legend: {
                        textStyle: {
                            color: 'white',
                            fontSize: 14,
                            italic: false
                        }
                    },
                    width: 700,
                    height: 700,
                };
                var chart = new google.visualization.PieChart(document.getElementById('pie'));
                chart.draw(data, options);
            }
            google.charts.setOnLoadCallback(drawChart);


        }
    });
});