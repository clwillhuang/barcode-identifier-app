import React from 'react';
import { PieChart } from 'chartist'
import styles from './db-summary.module.css'
import { Tab, Tabs } from 'react-bootstrap';

class DbSummary extends React.Component {

    constructor(props) {
        super(props);
        const { sequences } = this.props;
        let countryData = {};
        let genusData = {};
        let familyData = {};
        let orderData = {};
        let classData = {};
        let phylumData = {};
        let kingdomData = {};

        const incre = (dict, obj) => {
            if (obj !== null) 
            dict[obj.scientific_name] = (dict[obj.scientific_name] || 0) + 1;
            else dict['Unknown'] = (dict['Unknown'] || 0) + 1;
        }

        for (const seq of sequences) {
            let { country, 
                taxon_kingdom,
                taxon_phylum,
                taxon_class,
                taxon_order,
                taxon_family,
                taxon_genus } = seq;
            let colon = country.indexOf(':');
            if (colon !== -1) {
                country = country.substring(0, colon);
            }
            countryData[country] = (countryData[country] || 0) + 1;
            incre(kingdomData, taxon_kingdom)
            incre(phylumData, taxon_phylum)
            incre(classData, taxon_class)
            incre(orderData, taxon_order)
            incre(familyData, taxon_family)
            incre(genusData, taxon_genus)
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

        this.charts = ['country', 'genus', 'family', 'order', 'class', 'phylum', 'kingdom']
        this.data = [countryData, genusData, familyData, orderData, classData, phylumData, kingdomData].map(d => generateDataObject(d))
        
        this.state = {
            activeData: 0,
            activeChart: undefined,
        }
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

        const addTooltip = (pie) => {
            let tt = document.querySelector('.customtt');
            tt.style.visibility = 'hidden';  
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
        if (this.state.activeChart) {
            this.state.activeChart.update(this.data[this.state.activeData])
        } else {
            let dataPie = new PieChart(`.ct-chart`, this.data[this.state.activeData], options);
            addTooltip(dataPie)
            this.setState({activeChart: dataPie})
        }
    }

    render() {
        if (this.state.activeChart) {
            this.state.activeChart.update(this.data[this.state.activeData])
        } 

        return (
            <>
            <div className={styles.graphContainer}>
                <span className={'customtt bg-primary text-white ' + styles.tooltip}/>
                <Tabs onSelect={(key) => {this.setState({activeData: parseInt(key)})}}>
                    {
                        this.charts.map((id, index) => {
                            return(
                                <Tab eventKey={index} title={id}>
                                </Tab>
                            )
                        })
                    }
                </Tabs>
                <p className='text-center'>by {this.charts[this.state.activeData]}</p>
                <div className={`ct-chart`} />
            </div>
            </>
        )
    }
}

export default DbSummary;