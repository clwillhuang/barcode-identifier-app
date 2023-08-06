import React, { useEffect, useState } from 'react';
import { PieChart } from 'chartist'
import styles from './db-summary.module.css'
import { Tab, Tabs } from 'react-bootstrap';
import { generateHeaders, urlRoot } from '../url';
import { ErrorMessage, handleResponse } from './error-message';
import { useQuery } from 'react-query';

const DbSummary = ({ id }) => {

    const [activeData, setActiveData] = useState(0);
    const [activeChart, setActiveChart] = useState(undefined);
    const [tt, setTt] = useState(undefined);

    const { isLoading, error, data, isError } = useQuery([`${id}_blastdb_summary`], () =>
        fetch(`${urlRoot}/blastdbs/${id}/summary`, {
            headers: generateHeaders({})
        })
            .then(handleResponse()),
        {
            refetchInterval: false,
            retry: false,
            initialData: {
                'taxon_kingdom__scientific_name': [],
                'taxon_superkingdom__scientific_name': [],
                'taxon_phylum__scientific_name': [],
                'taxon_class__scientific_name': [],
                'taxon_order__scientific_name': [],
                'taxon_family__scientific_name': [],
                'taxon_genus__scientific_name': [],
                'annotations__annotation_type': [],
                'country': [],
                'title': [],
            }
        }
    )

    const {
        country: countryData,
        taxon_kingdom__scientific_name: kingdomData,
        taxon_superkingdom__scientific_name: superkingdomData,
        taxon_phylum__scientific_name: phylumData,
        taxon_class__scientific_name: classData,
        taxon_order__scientific_name: orderData,
        taxon_family__scientific_name: familyData,
        taxon_genus__scientific_name: genusData,
        annotations__annotation_type: annotationData,
        title: titleData
    } = data;

    // Return a Chartist data object from an array of data and the 
    // attribute name corresponding to the values of each object
    const generateDataObject = (data, attributeName) => {
        let dataObject = {
            labels: [],
            series: []
        }
        if (attributeName === 'country') {
            let newData = {}
            data.forEach(item => {
                newData[item.country_name] = 1 + (newData[item.country_name] || 0);
            })
            data = []
            for (let key in newData) {
                let newObj = { count: newData[key] }
                newObj['country'] = key
                data.push(newObj)
            }
        }
        let sorted = data.sort((a, b) => a.count > b.count);
        let other = 0;
        let skipped = true;
        const tot = data.map(x => x.count).reduce((agg, a) => agg + a, 0);
        for (let item of sorted) {
            let key = item[attributeName]
            const value = item.count
            const percValue = Number(value / tot);
            let perc = percValue.toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })
            // stop skipping entries once other composes >= 20% or the current slice is more than 2%
            if (skipped && (other / tot >= 0.2 || percValue >= 0.02)) {
                skipped = false;
            }
            if (!skipped) {
                let label = key === '' ? 'Unknown' : key;
                let fullLabel = `${label}, ${value} (${perc})`
                const shortenedLabel = ((label.length > 20) ? `${label.slice(0, 19)} \u2026` : label)
                const toolTipLabel = `${shortenedLabel}, ${value} (${perc})`
                dataObject.labels.push(toolTipLabel);
                dataObject.series.push({ value: value, meta: fullLabel });
            } else {
                other += value;
            }
        }
        if (other > 0) {
            let otherPerc = (other / tot).toLocaleString(undefined, { style: 'percent', minimumFractionDigits: 2, maximumFractionDigits: 2 })
            let label = `Other, ${other} (${otherPerc})`
            dataObject.labels.unshift(label);
            dataObject.series.unshift({ value: other, meta: label });
        }
        return dataObject;
    }

    // Keys of the attributes of every summary returned within the data object 
    const dataKeys = [
        'country',
        'taxon_superkingdom__scientific_name',
        'taxon_kingdom__scientific_name',
        'taxon_phylum__scientific_name',
        'taxon_class__scientific_name',
        'taxon_order__scientific_name',
        'taxon_family__scientific_name',
        'taxon_genus__scientific_name',
        'annotations__annotation_type',
        'title'
    ]
    // Names to be displayed for the tabs
    const dataVerboseKeys = ['country', 'superkingdom', 'kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'annotation type', 'title']
    const chartData = [countryData, superkingdomData, kingdomData, phylumData, classData, orderData, familyData, genusData, annotationData, titleData].map((d, index) => generateDataObject(d, dataKeys[index]))

    useEffect(() => {
        setTt(document.querySelector('.customtt'));
    }, [])

    useEffect(() => {
        const pie = activeChart;
        if (!tt) return
        tt.style.visibility = 'hidden';
        pie.on('created', function (pie) {
            var elems = document.querySelectorAll('.ct-slice-donut')
            elems.forEach(inp => {
                inp.addEventListener('mouseover', (event) => {
                    event.originalTarget.setAttribute('style', `stroke-width: 35px`)
                    const label = event.originalTarget.getAttribute('ct:meta');
                    let tt = document.querySelector('.customtt');
                    tt.innerHTML = label;
                    tt.style.top = `${event.clientY}px`;
                    tt.style.left = `${event.clientX}px`;
                    tt.style.visibility = 'visible';
                })
                inp.addEventListener('mouseout', (event) => {
                    event.originalTarget.setAttribute('style', `stroke-width: 30px`)
                    let tt = document.querySelector('.customtt');
                    tt.innerHTML = '';
                    tt.style.visibility = 'hidden';
                })
            })
        });
    }, [activeChart, tt])

    // update chart object when new chart is selected
    useEffect(() => {
        if (activeChart) {
            activeChart.update(chartData[activeData])
        } else {
            const options = {
                donut: true,
                donutWidth: 30,
                donutSolid: true,
                startAngle: 270,
                labelOffset: 25,
                labelDirection: 'explode',
                labelInterpolationFnc: function (value) {
                    return value;
                }
            };
            let dataPie = new PieChart(`.ct-chart`, chartData[activeData], options);
            setActiveChart(dataPie)
        }
    }, [activeChart, activeData, chartData])

    if (isLoading) return (
        <div className={styles.graphContainer}>
            <p>Retrieving data ...</p>
        </div>
    )

    else if (isError) return (
        <div className={styles.graphContainer}>
            <ErrorMessage error={error} text="Could not find reference libraries. Please try again." />
        </div>
    )

    return (
        <div className={styles.graphContainer}>
            <span className={'customtt bg-primary text-white ' + styles.tooltip} />
            <Tabs onSelect={(key) => { setActiveData(parseInt(key)) }}>
                {
                    dataVerboseKeys.map((id, index) => {
                        return (
                            <Tab eventKey={index} title={id} key={id} />
                        )
                    })
                }
            </Tabs>
            <p className='text-center'>by {dataVerboseKeys[activeData]}</p>
            <div className={`ct-chart`} />
        </div>
    )
}

export default DbSummary;