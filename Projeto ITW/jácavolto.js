    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
    <script type="text/javascript">
        var Counter1 = [];
        var Name1 = [];

        $.ajax({
            type: 'GET',
            url: 'http://192.168.160.58/Olympics/api/Games/FullDetails?id=',
            headers: {
                'Content-Type': 'application/json'
            },
            success: function (data, status, xhr) {

                var athData = data;

                athData.forEach(element => {
                    Counter1.push(element.Medals.reduce((accum, ele) => ele.Counter + accum, 0));
                    Name1.push(element.Medals);
                });


            }
        });



        function drawChart() {

            var data = google.visualization.arrayToDataTable([
                ['Task', 'Hours per Day'],
                ['Work', 11],
                ['Eat', 2],
                ['Commute', 2],
                ['Watch TV', 2],
                ['Sleep', 7]
            ]);

            var options = {
                title: 'My Daily Activities'
            };

            var chart = new google.visualization.PieChart(document.getElementById('piechart'));

            chart.draw(data, options);
        }
    </script>