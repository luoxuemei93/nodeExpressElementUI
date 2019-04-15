<template>
	<div>
		<!--面包屑-->
		<div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-edit"></i> 个人中心</el-breadcrumb-item>
                <el-breadcrumb-item>首页图文展示</el-breadcrumb-item>
            </el-breadcrumb>
		</div>
		<!--banner-->
		<div>
			<el-carousel :interval="0" arrow="never" height="420px" width="800px" type="card">
				<el-carousel-item v-for="item in dataimg" :key="item.value">
					<div class="grid-content">
						<el-col :md="12" :offset="6">
							<div>
								<img :src="item.src" style="width:800px;height:300px" >
								<!-- <p class="italictext">{{item.txt}}</p>-->
								<p class="service">{{item.txt2}}</p>
								<!-- <p class="last">{{item.txt3}}</p> -->
							</div>
						</el-col>
					</div>
				</el-carousel-item>
		   </el-carousel>
		</div>
		<!--饼图 折线图-->
		<div id="charts" style="width:'100%',height:'800px'">
            <div id="main" :style="{width:'50%',height:'600px',float:'left'}"></div>
			      <div id="line" :style="{width:'50%',height:'600px',float:'right'}"></div>
       </div>
	   <!--中国地图-->
	   <div :style="{height:'400px',width:'100%'}" ref="myEchart"></div>
	</div>
</template>

<script>
  import echarts from "echarts";
  import "echarts/map/js/china.js";// 引入中国地图数据
  import Util from '../../utils/utils';
  import { Message } from 'element-ui';
	/* var echarts = require('echarts'); */
	export default {
			name: 'Bank',
        created(){},
		data () {
			return {
				dataimg: [{
						src: require('../../assets/a.jpg'),
						txt: '"春节是我们国家重要的传统节日，他是一年来我们辛劳工作后一家人团圆的日子！"',
						txt2: '一站式服务',
						txt3: 'Miami, FL'
					},
					{
						src: require('../../assets/b.jpg'),
						txt: '"春节是我们国家重要的传统节日，他是一年来我们辛劳工作后一家人团圆的日子！"',
						txt2: '国际服务',
						txt3: 'Greensboro, NC'
					},
					{
						src: require('../../assets/c.jpg'),
						txt: '"春节是我们国家重要的传统节日，他是一年来我们辛劳工作后一家人团圆的日子！"',
						txt3: 'Charlotte, NC'
					},{
						src: require('../../assets/d.jpg'),
						txt: '"春节是我们国家重要的传统节日，他是一年来我们辛劳工作后一家人团圆的日子！"',
						txt2: '全网渠道',
						txt3: 'Charlotte, NC'
					}]
			   }
			},
			components: {
			},
			computed: {
			},
			methods: {
		tubiao(){
			let myChart = echarts.init(document.getElementById('page'));
			myChart.setOption({
			title: { text: '产品 基本布局示例' },
			series : [
			{
				name: '访问来源',
				type: 'pie',
				radius: '55%',
				itemStyle: {
				normal: {
				// 阴影的大小
				shadowBlur: 200,
				// 阴影水平方向上的偏移
				shadowOffsetX: 0,
				// 阴影垂直方向上的偏移
				shadowOffsetY: 0,
				// 阴影颜色
				shadowColor: 'rgba(0, 0, 0, 0.5)'
				}
				},
				data:[
						{value:400, name:'搜索引擎'},
						{value:335, name:'直接访问'},
						{value:310, name:'邮件营销'},
						{value:274, name:'联盟广告'},
						{value:235, name:'视频广告'}
				]
			}
			]
			})},
		drawLine() {
					// 基于准备好的dom，初始化echarts实例
					let myChart = echarts.init(document.getElementById('line'))
					// 绘制图表
					myChart.setOption({
						title: { text: '产品 分类示例' },
						tooltip: {},
						xAxis: {
						data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"]
						},
						yAxis: {},
						series: [{
						name: '销量',
						type: 'bar',
						data: [5, 20, 36, 10, 10, 20]
						}]
					});
					},
	chinaConfigure() {
        console.log(this.userJson)
        let myChart = echarts.init(this.$refs.myEchart); //这里是为了获得容器所在位置
        window.onresize = myChart.resize;
        myChart.setOption({ // 进行相关配置
          backgroundColor: "#02AFDB",
          tooltip: {}, // 鼠标移到图里面的浮动提示框
          dataRange: {
            show: false,
            min: 0,
            max: 1000,
            text: ['High', 'Low'],
            realtime: true,
            calculable: true,
            color: ['orangered', 'yellow', 'lightskyblue']
          },
          geo: { // 这个是重点配置区
            map: 'china', // 表示中国地图
            roam: true,
            label: {
              normal: {
                show: true, // 是否显示对应地名
                textStyle: {
                  color: 'rgba(0,0,0,0.4)'
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: 'rgba(0, 0, 0, 0.2)'
              },
              emphasis: {
                areaColor: null,
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                shadowBlur: 20,
                borderWidth: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          },
          series: [{
              type: 'scatter',
              coordinateSystem: 'geo' // 对应上方配置
            },
            {
              name: '启动次数', // 浮动框的标题
              type: 'map',
              geoIndex: 0,
          data: [{
                "name": "北京",
                "value": 599
              }, {
                "name": "上海",
                "value": 142
              }, {
                "name": "黑龙江",
                "value": 44
              }, {
                "name": "深圳",
                "value": 92
              }, {
                "name": "湖北",
                "value": 810
              }, {
                "name": "四川",
                "value": 453
              }]
            }
          ]
        })
      }
   },
mounted() {
			/*ECharts图表*/
			  this.tubiao();
			  this.drawLine();
			  this.chinaConfigure();
		}
	}
</script>

<style scoped>
.italictext,
.service,
.last{
	width:100%;
	text-align:center;
}

</style>
