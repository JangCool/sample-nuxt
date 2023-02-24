<script setup lang="ts">
import { CartesianScaleOptions, Chart, ChartConfiguration, LayoutPosition, PointOptions, registerables, ScatterController } from 'chart.js';
import 'chartjs-adapter-moment';

Chart.register(...registerables);

const SLOT_LENGTH = 12;

const DATASETS_LENGTH = 20;

const MINUTE = 5

const getId = (i:number) => { return `chart-${i}`};
const getSeriesId = (i:number) => { return `series-${i}`};

const POINT_COUNT = MINUTE == 5 ? 150 : 300;

const initMax = new Date().getTime();
const initMin = initMax - (1000 * 60 * MINUTE);

const datasets:any[] = (()=>{

    const datasets = [];

    for (let i = 0; i < DATASETS_LENGTH; i++) {
        datasets.push({
            label: getSeriesId(i),
            data:( () => {

                let min = initMin;
                const points:any = [];

                for (let index = 0; index < POINT_COUNT; index++) {
                    points.push({
                        x : min += 2000,
                        y : Math.round( Math.random() * 1000 )
                    });
                    
                }

                return points;
            })()
        });
    }

    return datasets;
})();



const createChart = function(element:HTMLCanvasElement | null) {

    if(element == null){
        return null;
    }
    

    return new Chart(element, {
        type: 'line',
        data: {
            labels: [],
            datasets: JSON.parse(JSON.stringify(datasets))
        },
        options: {
            animation: false,  // disable animations
            plugins:{
                tooltip: {
                    enabled: false
                }
            },
            scales: {
                x: {
                    //@ts-ignore
                    type: 'timeseries',
                    time : {
                        parser: 'MM/DD/YYYY HH:mm:ss',
                        tooltipFormat: 'HH:mm:ss',
                        displayFormats: {
                            millisecond: 'HH:mm:ss.SSS',
                            second: 'HH:ss',
                            minute: 'HH:mm',
                            hour: 'HH'
                        },
                        unit: 'minute', // year, hour, minute, second
                    },
                    ticks: {
                        stepSize: MINUTE == 5 ? 1: 2
                    },
                    min: initMin,
                    max: initMax
                },
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

const charts = new Map<string, Chart | null>();

onMounted(() => {

    for (let i = 0; i < SLOT_LENGTH; i++) {
        const id = getId(i);
        const element = document.querySelector<HTMLCanvasElement>(`#${id}`);
        charts.set(id, createChart(element));
    }
});


const addData = (chart:Chart) => {

    const data = chart.data;
    const datasetLength = data.datasets.length;

    if (data.datasets.length == 0) {
        return;
    }

    for (let i = 0; i < datasetLength; ++i) {

        const dataLength = data.datasets[i].data.length;

        if(dataLength > POINT_COUNT){
            data.datasets[i].data.shift();
        }

        data.datasets[i].data.push({
            x : new Date().getTime(),
            y : Math.round( Math.random() * 1000 )
        });
    }

};

function updateScales(chart:Chart) {

    const max = new Date().getTime();
    const min = max- (1000 * 60 * MINUTE);

    chart.options.scales = {
        x: {
            min: min,
            max: max
        }
    };
    
    chart.update();
}

var fps = 60;
var now;
var then = Date.now();
var interval = 2000;
var elapsed;

const animate = function() {
    
    now = Date.now();
    elapsed = now - then;
    
    
    if (elapsed < interval) {
        requestAnimationFrame(animate.bind(window));
        return;
    }

    then = Date.now();

    const chartIds = charts.keys();
    for ( let chartId of chartIds ) {
        
        const chart = charts.get(chartId);

        if(!chart){
            continue;
        }

        const max = new Date().getTime();
        const min = max - (1000 * 60 * MINUTE);

        const scales = chart.options.scales;

        if(scales){
            const x:any = scales['x'];
            x.min = min;
            x.max = max;
        }

        addData(chart);
        chart.update('none')

    }

    requestAnimationFrame(animate.bind(window));

}

animate();

// setInterval(()=>{

//     const chartIds = charts.keys();
//     for ( let chartId of chartIds ) {
        
//         const chart = charts.get(chartId);

//         if(!chart){
//             continue;
//         }

//         const max = new Date().getTime();
//         const min = max - (1000 * 60 * MINUTE);

//         const scales = chart.options.scales;

//         if(scales){
//             const x:any = scales['x'];
//             x.min = min;
//             x.max = max;
//         }

//         addData(chart);
//         chart.update('none')

//     }


// }, 2000);

</script>
<template>

    <div class="row">

        <div class="card col-3 m-3"
            v-for="i in SLOT_LENGTH"
        >
            <div class="card-header">
                <span class="text-muted">{{ i }}</span>
            </div>
            <div class="card-body">
                <canvas :id="getId(i)"></canvas>
            </div>
        </div>
    </div>
</template>
