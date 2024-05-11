<template>
    <div class="box">
        <div class="top">
            <p class="title">实时游客统计</p>
            <p class="bg"></p>
            <p class="right">
                可预约的总量
                <span class="">99999</span>
            </p>
            人
        </div>
        <div class="number">
            <span v-for="( item, index ) in people" :key="index">{{ item }}</span>
        </div>
        <div class="charts" ref="charts">
            <!--将来echarts展示图表的节点-->
            123
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
//引入echarts
import * as echarts from 'echarts'
//水球图拓展插件
import 'echarts-liquidfill'
let people = ref('216908人')
let charts = ref()
onMounted(() => {
    //获取echarts类的实例
    let mycharts = echarts.init(charts.value)
    //设置实例的配置项
    mycharts.setOption({
        //标题组件
        title: {
            text: '水球图'
        },
        //X|Y轴组件
        xAxis: {},
        yAxis: {},
        //系列设置:决定你展示什么样的图形图表
        series: {
            type: 'liquidFill',//系列
            waveAnimation: true,//动画
            animationDuration: 3,//时间
            animationDurationUpdate: 0,//
            data: [0.6, 0.5, 0.4],//数据
            radius: '80%',//半径
            outline: {
                show: true,
                borderDistance: 0,
                itemStyle: {
                    color:'red',
                    borderWidth: 5,
                    borderColor: '#294D99',
                    shadowBlur: 20,
                    shadowColor: 'rgba(255, 0, 0, 1)'
                }
            },
        },
        //布局组件
        grid: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
        }

    })
})

</script>

<style scoped lang="scss">
.box {
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 15px;

    .top {
        margin-left: 20px;

        .title {
            color: #29fcff;
            ;
            font-size: 20px;
        }

        .bg {
            width: 68px;
            height: 7px;
            background: url(../../images/dataScreen-title.png) no-repeat;
            background-size: 100% 100%;
            margin-top: 10px;
        }

        .right {
            float: right;
            color: #29fcff;
            ;
            font-size: 20px;

            span {
                color: rgb(227, 175, 31);
            }
        }

    }

    .number {
        margin-top: 30px;
        display: flex;
        padding: 10px;

        span {
            flex: 1;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background: url(../../images/total.png) no-repeat;
            background-size: 100% 100%;
            color: #29fcff;
        }
    }

    .charts {
        width: 100%;
        height: 290px;
    }
}
</style>