import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CHARTJS from '@salesforce/resourceUrl/chartjs_v430';
import retrieveMonthlyTotals from '@salesforce/apex/AccountOppAnalyticsController.retrieveMonthlyTotals';

export default class AccountOppAnalytics extends LightningElement {
    @api recordId;
    
    isChartJsLoaded = false;
    result;
    chart;
    chartConfig;
    apexCalledOut = false;
    chartRenderAttempted = false;
    
    connectedCallback() {
        loadScript(this, CHARTJS)
        .then(() => {
            console.log('ChartJS static resource successfully loaded');
            this.isChartJsLoaded = true;
        }).catch((err) => {
            console.error('Error loading ChartJS static resource');
            console.error(JSON.stringify(err, null, 2));
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error loading ChartJS',
                    message: JSON.stringify(err, null, 2),
                    variant: 'error',
                }),
            );
        });
    }
    
    renderedCallback() {
        if(this.isChartJsLoaded && !this.apexCalledOut) {
            retrieveMonthlyTotals( { accountId: this.recordId, numOfMonths: 3 } )
            .then( result => {
                // console.log('result:', JSON.stringify(result, null, 2));
                this.result = result;
            })
            .catch( err => {
                console.error('Error occurred calling retrieveMonthlyTotals:\n', JSON.stringify(err, null, 2));
            })
            .finally( () => {
                this.apexCalledOut = true;
            });
        }
        if(this.result && !this.chartRenderAttempted) {
            try {
                this.chartConfig = {};
                this.chartConfig.type = 'bar';
                this.chartConfig.options = {
                    "scales": {
                        "y": {
                            "beginAtZero": false
                        }
                    }
                };
                this.chartConfig.options.scales.y.beginAtZero = false;
                this.chartConfig.data = {};
                this.chartConfig.data.datasets = [
                    {
                        "label": 'Sales',
                        "data": []
                    }
                ];
                this.result.forEach(aggResult => {
                    this.chartConfig.data.datasets[0].data.push({
                        x: `${aggResult.calMonth}/${aggResult.calYear}`,
                        y: aggResult.sumPrice
                    });
                });
                const chartCtx = this.template.querySelector('canvas.chart').getContext('2d');
                this.chart = new window.Chart(chartCtx, this.chartConfig);
                this.chart.canvas.parentNode.style.height = '100%';
                this.chart.canvas.parentNode.style.width = '100%';
            } catch(err) {
                console.error('Error occurred rendering chart');
                console.error(JSON.stringify(err, null, 2));
            } finally {
                this.chartRenderAttempted = true;
            }
        }
    }
}