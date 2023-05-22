import { LightningElement, api } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import CHARTJS from '@salesforce/resourceUrl/chartjs_v430';

export default class AccountOppAnalytics extends LightningElement {
    @api recordId;
    
    isChartJsLoaded = false;
    
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
}