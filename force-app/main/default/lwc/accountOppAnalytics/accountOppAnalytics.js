import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CHARTJS from '@salesforce/resourceUrl/chartjs_v430';

export default class AccountOppAnalytics extends LightningElement {
    @api recordId;
    
    isChartJsLoaded = false;
    chart;
    chartConfig = CHART_CONFIG;
    
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
        if(this.isChartJsLoaded) {
            const chartCtx = this.template.querySelector('canvas.chart').getContext('2d');
            this.chart = new window.Chart(chartCtx, this.chartConfig);
            this.chart.canvas.parentNode.style.height = '100%';
            this.chart.canvas.parentNode.style.width = '100%';
        }
    }
}

const CHART_CONFIG = {
    type: 'bar',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
};