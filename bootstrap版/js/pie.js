(function () {
    var pie = {
        init() { //初始化
            this.getData();
            this.option = {   //两个图表里共同的配置
                title: {
                    text: '',
                    subtext: '纯属虚构',
                    left: 'center',
                },
                legend: {
                    data: [],
                    orient: 'vertical',
                    left:'left',
                },
                series: {
                    name: '',
                    type: 'pie',
                    data: [],
                    radius:'55%',
                    center:['50%','60%'],
                    itemStyle:{
                        emphasis:{
                            shadowBlur:10,
                            shadowColor:'rgba(0,0,0.5)',
                        }
                    }
                }
            }
        },
        getData() {  //请求数据
            var This = this;
            $.ajax({
                url: 'http://api.duyiedu.com/api/student/findAll?appkey=Jasmine_1603453921876',
                success: function (data) {
                    var list = JSON.parse(data).data;

                    This.areaChart(list);
                    This.sexChart(list);
                }
            })
        },
        areaChart(data) {    //第一个图表
            var myChart = echarts.init($('.areaChart')[0]);
            var lengendData = [];
            var seriesData = [];

            //[{"address":"黑龙江省哈尔滨市XXX","appkey":"kaivon_1574822824764","birth":2008,"ctime":1604231078,"email":"54676fd@duyiedu.com","id":67791,"name":"学辉","phone":"19999999998","sNo":"1000188845","sex":0,"utime":1604231078},....]

            /*
                lengendData=[北京 ，上海，广州，深圳]
                seriesData=[
                    {value: 10, name: '北京'},
                    {value: 20, name: '上海'},
                    ...
                ]
             */

            var newData = {
                //  '黑龙江省哈尔滨市XXX':2,
            };
            data.forEach(function (item) {
                if (!newData[item.address]) {
                    newData[item.address] = 1;
                    lengendData.push(item.address);
                } else {
                    newData[item.address]++;
                }
            });

            for (var prop in newData) {
                seriesData.push({
                    value: newData[prop],
                    name: prop
                });
            }


            this.option.title.text = '渡一教育学生地区分布统计';
            this.option.legend.data = lengendData;
            this.option.series.name = '地区分布';
            this.option.series.data = seriesData;

            myChart.setOption(this.option);
        },
        sexChart(data) {     //第二个图表
            var myChart = echarts.init($('.sexChart')[0]);
            var lengendData = ['男', '女'];


            var newData = {
            };
            data.forEach(function (item) {
                if (!newData[item.sex]) {
                    newData[item.sex] = 1;
                } else {
                    newData[item.sex]++;
                }
            });

            var seriesData = [
                { name: '男', value: newData[0] },
                { name: '女', value: newData[1] },
            ];


            this.option.title.text = '渡一教育性别统计';
            this.option.legend.data = lengendData;
            this.option.series.name = '性别分布';
            this.option.series.data = seriesData;

            myChart.setOption(this.option);
        }
    }

    pie.init();
})();