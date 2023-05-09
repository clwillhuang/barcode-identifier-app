import React from 'react';
import { PieChart } from 'chartist'
import styles from './db-summary.module.css'

class DbSummary extends React.Component {

    constructor(props) {
        super(props);
        const { sequences } = this.props;
        let countryData = {};
        let genusData = {};
        for (const seq of sequences) {
            let { country, organism } = seq;
            let colon = country.indexOf(':');
            if (colon !== -1) {
                country = country.substring(0, colon);
            }
            countryData[country] = countryData[country] ? countryData[country] + 1 : 1;

            let space = organism.indexOf(' ');
            if (space !== -1) {
                organism = organism.substring(0, space);
            }
            genusData[organism] = genusData[organism] ? genusData[organism] + 1 : 1;
        }

        const generateDataObject = (data) => {
            let dataObject = {
                labels: [],
                series: []
            }

            let sorted = Object.entries(data).sort((a, b) => a[1] - b[1]);
            let other = 0; 
            let skipped = true;
            const tot = Object.values(data).reduce((agg, a) => agg + a, 0);

            for (const [key, value] of sorted) {
                const percValue = Number(value / tot);
                let perc = percValue.toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2})
                // stop skipping entries once other composes >= 20% or the current slice is more than 2%
                if (skipped && (other / tot >= 0.2 || percValue >= 0.02)) {
                    skipped = false;
                }
                if (!skipped) {
                    let label = key === '' ? 'Unknown' : key;
                    label = `${label}, ${value} (${perc})`
                    dataObject.labels.push(label);
                    dataObject.series.push({value: value, meta: label});
                } else {
                    other += value;
                }
            }
            if (other > 0) {
                let otherPerc = (other/tot).toLocaleString(undefined, {style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2})
                let label = `Other, ${other} (${otherPerc})`
                dataObject.labels.unshift(label);
                dataObject.series.unshift({value: other, meta: label});
            }
            return dataObject;
        }

        this.countryData = generateDataObject(countryData);
        this.genusData = generateDataObject(genusData);
    }

    componentDidMount() {
        const regularStrokeWidth = 30;
        const hoverStrokeWidth = 35;
        const options = {
            donut: true,
            donutWidth: regularStrokeWidth,
            donutSolid: true,
            startAngle: 270,
            labelOffset: 25,
            labelDirection: 'explode',
            labelInterpolationFnc: function(value) {
            return value;
            }
            // showLabel: false,
        };
        let countryPie = new PieChart('.ct-country',
            this.countryData,
            options)

        let genusPie = new PieChart('.ct-genus',
            this.genusData,
            options);

        let tt = document.querySelector('.customtt');
        tt.style.visibility = 'hidden';            

        const addTooltip = (pie) => {
            pie.on('created', function (pie) {
                var elems = document.querySelectorAll('.ct-slice-donut')
                elems.forEach(inp => {
                    inp.addEventListener('mouseover', (event) => {
                        event.originalTarget.setAttribute('style', `stroke-width: ${hoverStrokeWidth}px`)
                        const label = event.originalTarget.getAttribute('ct:meta');
                        let tt = document.querySelector('.customtt');
                        tt.innerHTML = label;  
                        tt.style.top = `${event.clientY}px`;
                        tt.style.left = `${event.clientX}px`;
                        tt.style.visibility = 'visible';
                    })
                    inp.addEventListener('mouseout', (event) => {
                        event.originalTarget.setAttribute('style', `stroke-width: ${regularStrokeWidth}px`)
                        let tt = document.querySelector('.customtt');
                        tt.innerHTML = '';
                        tt.style.visibility = 'hidden';
                    })
                }) 
            });
        }

        addTooltip(countryPie);
        addTooltip(genusPie);
    }

    render() {
        return (
            <div className={styles.graphContainer}>
                <span className={'customtt bg-primary text-white ' + styles.tooltip}/>
                <div>
                    <p className='text-center'>by country</p>
                    <div className='ct-country' />
                </div>
                <div>
                    <p className='text-center'>by genus</p>
                    <div className='ct-genus' />
                </div>
            </div>
        )
    }
}

export default DbSummary;