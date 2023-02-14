import { phylotree } from 'phylotree'
import 'phylotree/dist/phylotree.css'
import React from 'react'
import { useQuery } from 'react-query'
import { urlRoot } from '../url'
import { ErrorMessage, handleResponse } from './error-message'
import styles from './hit-tree.module.css'

const RunTree = ({ runId, enabled, querySequences }) => {
    const { isLoading, data, error, isError } = useQuery([`tree_${runId}`], () =>
        fetch(`${urlRoot}/trees/${runId}`)
            .then(handleResponse()),
        {
            refetchInterval: false,
            retry: false,
        }
    )

    // TODO: Differentiate between true network errors and post calls 
    if (isError) {
        // send POST request to generate tree
        let url = `${urlRoot}/trees/${runId}/`

        let postHeaders = {
            'Accept': 'application/json',
        }

        // TODO: Handle bad requests
        fetch(url, { method: 'POST', headers: postHeaders, mode: 'cors', body: { 'dummy_field': '' } })
            .then(response => {
                if (response.status === 400) {
                    console.log("POST returned Err 400")
                } else if (response.status === 201) {
                    // successful post
                    console.log("POST request successful")
                } else if (!response.ok) {
                    // unexpected error
                    throw new Error()
                }
            })
            .catch(error => {
                console.log(`The website encountered an unexpected error.`)
            })

        return (
            <div>
                <p>Tree does not exist. Sending a request to tree ... </p>
                <ErrorMessage error={error} />
            </div>)
    }

    if (!enabled) return (<div></div>)

    if (isLoading) return (
        <div>
            <p>Retrieving tree ... </p>
        </div>
    )

    return (
        <div>
            <strong>Job Status</strong>
            <p><code>{data.internal_status}</code></p>
            <strong>MSA Job ID</strong>
            <p>{data.alignment_job_id}</p>
            <strong>Phy Job ID</strong>
            <p>{data.tree_job_id}</p>
            <strong>Tree</strong>
            <Tree tree={data.tree} querySequences={querySequences} />
            <strong>Raw Newick</strong>
            <p><code>{data.tree}</code></p>
        </div>
    )
}

class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.tree = this.props.tree.replaceAll('\n', '');
        this.treeContainer = React.createRef();
        this.treeContainerId = '#tree_container'
    }

    componentDidMount() {
        this.treeObj = new phylotree(this.tree)
        const elem = document.querySelector(this.treeContainerId)
        const boundingRect = elem.getBoundingClientRect()
        
        this.treeRender = this.treeObj.render({
            container: this.treeContainerId, // supply ID of tree container div
            width: boundingRect.width, // set height to that of div
            height: boundingRect.height, // set height to that of div
            'left-right-spacing': 'fit-to-size', // fit tree size to box
            'top-bottom-spacing': 'fit-to-size', // fit tree size to box
            zoom: true, // allow zoom in/out of tree
            selectable: false,
            brush: false // disable selection box brush
        });
        const svg = this.treeRender.show()

        // highlight all query sequences with bold
        let nodes = svg.querySelectorAll('g')
        let filteredNodes = Array.from(nodes).filter(node => this.props.querySequences.includes(node.getAttribute('data-node-name')));
        filteredNodes.forEach(node => node.style['font-weight'] = 'bold')

        elem.append(svg)
    }

    render() {
        return (
            <div
                className={styles.treeContainer}
                id='tree_container'
                ref={el => (this.treeContainer = el)}
                >
            </div>
        );
    }
}

export default RunTree
