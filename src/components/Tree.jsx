import { phylotree } from 'phylotree';
import { Accordion, Button, Col, Form, FormCheck, FormGroup, Row } from 'react-bootstrap';
import React from 'react';
import styles from './hit-tree.module.css';
import { FaSyncAlt, FaImage } from 'react-icons/fa'

export class Tree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tree: props.tree.replaceAll('\n', ''),
            treeContainer: React.createRef(),
            treeContainerId: '#tree_container',
            highlightQueryTips: false,
            height: undefined,
            width: undefined,
            viewportMatchTreeSize: false,
        };
        this.updateTree = this.updateTree.bind(this);
        this.get_styles = this.getStyles.bind(this);
        this.setHeight = this.setHeight.bind(this);
        this.setWidth = this.setWidth.bind(this);
        this.addQueryTipHighlight = this.addQueryTipHighlight.bind(this);
        this.removeQueryTipHighlight = this.removeQueryTipHighlight.bind(this);
        this.onChangeHighlightQueryTips = this.onChangeHighlightQueryTips.bind(this);
        this.onChangeViewportMatchTreeSize = this.onChangeViewportMatchTreeSize.bind(this);

        this.highlightedTipColor = 'red';
    }

    componentDidUpdate(prevProps) {
        if (this.props.tree !== prevProps.tree || this.props.enabled !== prevProps.enabled) {
            const elem = document.querySelector(this.state.treeContainerId);
            if (this.props.enabled) {
                const boundingRect = elem.getBoundingClientRect();
                this.setState({
                    width: boundingRect.width,
                    height: boundingRect.height
                }, () => this.updateTree())
            }
        }
    }

    // Retrieve stylesheets so they can be saved in the .svg image
    // This function was taken from https://github.com/veg/phylotree.js/blob/master/index.html with slight modification. 
    // Credit goes to original authors.
    getStyles() {
        var styles = '';
        const process_stylesheet = (ss) => {
            const treeStyles = [
                ".tree-selection-brush .extent",
                ".tree-scale-bar text",
                ".tree-scale-bar line, .tree-scale-bar path",
                ".node circle, .node ellipse, .node rect",
                ".internal-node circle, .internal-node ellipse, .internal-node rect",
                ".node",
                ".node-selected",
                ".node-collapsed circle, .node-collapsed ellipse, .node-collapsed rect",
                ".node-tagged",
                ".branch",
                ".clade",
                ".branch-selected",
                ".branch-tagged",
                ".branch-tracer",
                ".branch-multiple",
                ".branch:hover",
                ".internal-node circle:hover, .internal-node ellipse:hover, .internal-node rect:hover",
                ".tree-widget"
            ];

            try {
                if (ss.cssRules) {
                    for (var i = 0; i < ss.cssRules.length; i++) {
                        var rule = ss.cssRules[i];
                        if (rule.type === 3) {
                            // Import Rule
                            process_stylesheet(rule.styleSheet);
                        } else {
                            // workaround for illustrator crashing on descendent selectors
                            // exclude hover selectors
                            if (treeStyles.includes(rule.selectorText) && !rule.selectorText.endsWith(":hover")) {
                                if (rule.selectorText.indexOf(">") === -1) {
                                    styles += "\n" + rule.cssText;
                                }
                            }
                        }
                    }
                }
            }
            catch (e) {
            }
        };

        for (var i = 0; i < window.document.styleSheets.length; i++) {
            process_stylesheet(window.document.styleSheets[i]);
        }

        return styles;
    }

    // Download the entire svg
    // This function was taken from https://github.com/veg/phylotree.js/blob/master/index.html with slight modification. 
    // Credit given to original authors.
    downloadTreeSvg() {
        if (typeof window !== 'undefined') {
            var svgStyles = this.getStyles(window.document);
            const svg = document.querySelector(this.state.treeContainerId).querySelector("svg").cloneNode(true);

            var defsEl = document.createElement("defs");
            svg.insertBefore(defsEl, svg.firstChild);

            var styleEl = document.createElement("style");
            defsEl.appendChild(styleEl);
            styleEl.setAttribute("type", "text/css");

            // removing attributes so they aren't doubled up
            svg.removeAttribute("xmlns");
            svg.removeAttribute("xlink");

            // remove circles on internal nodes
            const circles = svg.querySelectorAll("circle");
            for (let i = 0; i < circles.length; i++) {
                circles[i].remove()
            }

            const svgData = new XMLSerializer().serializeToString(svg).replace("</style>", "<![CDATA[" + svgStyles + "]]></style>");
            const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
            const svgUrl = URL.createObjectURL(svgBlob);
            const downloadButton = document.createElement("a");
            downloadButton.href = svgUrl;
            downloadButton.download = "my-svg-file.svg";
            downloadButton.style.display = "none";
            document.body.appendChild(downloadButton);
            downloadButton.click();
            document.body.removeChild(downloadButton);
        }
    }

    // rerender the tree
    updateTree() {
        if (!this.state.height || !this.state.width || !this.state.tree) {
            return;
        }

        console.log("Refreshing tree.")

        const elem = document.querySelector(this.state.treeContainerId);
        const svgNodes = elem.querySelectorAll("svg");

        for (let i = 0; i < svgNodes.length; i++) {
            const svgNode = svgNodes[i];
            elem.removeChild(svgNode);
        }

        let treeObj = new phylotree(this.props.tree);
        const boundingRect = elem.getBoundingClientRect();
        let treeRender = treeObj.render({
            container: this.state.treeContainerId,
            width: this.state.width,
            height: this.state.height,
            'left-right-spacing': 'fit-to-size',
            'top-bottom-spacing': 'fit-to-size',
            zoom: true,
            selectable: false,
            compression: 0,
            brush: false // disable selection box brush
        });
        const svg = treeRender.show();
        svg.style.height = boundingRect.height;
        svg.style.width = boundingRect.width;

        // make all internal nodes transparent
        const internalNodes = svg.querySelectorAll('circle');
        for (let i = 0; i < internalNodes.length; i++) {
            const element = internalNodes[i];
            // set fill and outline to transparent
            element.style.fill = '#FFF0';
            element.style.stroke = '#FFF0';
        }

        // set branch width to 1px
        const branches = svg.querySelectorAll('path.branch');
        for (let i = 0; i < branches.length; i++) {
            const element = branches[i];
            element.style['stroke-width'] = '1px'; // make branches as narrow as possible
            element.style['stroke'] = '#000'; // make branches black
            element.addEventListener("mouseenter", function () {
                element.style['stroke-width'] = '2px';
                element.style['stroke'] = 'blue';
            })
            element.addEventListener("mouseleave", function () {
                element.style['stroke-width'] = '1px';
                element.style['stroke'] = '#000';
            })
        }
        elem.append(svg);
        if (this.state.highlightQueryTips) {
            this.addQueryTipHighlight(svg);
        } else {
            this.removeQueryTipHighlight(svg);
        }
    }

    onChangeHighlightQueryTips(event) {
        if (event.target.checked) {
            this.addQueryTipHighlight();
        } else {
            this.removeQueryTipHighlight();
        }
        this.setState({ highlightQueryTips: event.target.checked })
    }

    onChangeViewportMatchTreeSize(event) {
        this.setState({ viewportMatchTreeSize: event.target.checked })
    }

    addQueryTipHighlight() {
        const nodes = document.querySelector(this.state.treeContainerId).querySelectorAll('text.phylotree-node-text');
        for (let i = 0; i < nodes.length; i++) {
            let element = nodes[i];
            const label = element.innerHTML.split('|')[2]
            if (label === 'query') {
                // bold all query sequences
                element.style['font-weight'] = 'bold';
                element.style['fill'] = this.highlightedTipColor;
            }
        }
    }

    removeQueryTipHighlight() {
        const nodes = document.querySelector(this.state.treeContainerId).querySelectorAll('text.phylotree-node-text');
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].style['font-weight'] = 'normal';
            nodes[i].style['fill'] = '';
        }
    }

    setWidth(event) {
        this.setState({ width: event.target.value });
    }

    setHeight(event) {
        this.setState({ height: event.target.value });
    }

    render() {
        return (
            <Row>
                <div
                    className={styles.treeContainer}
                    id='tree_container'
                    style={this.state.viewportMatchTreeSize ? {
                        width: `${this.state.width}px`,
                        height: `${this.state.height}px`
                    } : {}}
                    ref={el => (this.state.treeContainer = el)}
                >
                </div>
                <div className={'text-muted ' + styles.treeCaption}>
                    <em>Interactive tree render made by{' '}
                        <a href='https://www.npmjs.com/package/phylotree' target='_blank' rel='noopener noreferrer'>phylotree.js</a>. Credit given to original authors.
                    </em>
                </div>
                <Accordion className='my-4'>
                    <Accordion.Item eventKey='0'>
                        <Accordion.Header>Tree display options</Accordion.Header>
                        <Accordion.Body>
                            <Form>
                                <Row className='my-3'>
                                    <FormGroup>
                                        <FormCheck id='highlightQueryTips' name='highlightQueryTips' type='checkbox' onChange={this.onChangeHighlightQueryTips} value={this.state.highlightQueryTips} label='Highlight tips of query sequences'></FormCheck>
                                    </FormGroup>
                                </Row>
                                <Row className='my-3'>
                                    <Col className='col-6 col-md-6 col-lg-3'>
                                        <FormGroup>
                                            <Form.Label htmlFor="windowWidth">Width (pixels)</Form.Label>
                                            <Form.Control
                                                type="numeric"
                                                id="windowWidth"
                                                value={this.state.width ?? 0}
                                                onChange={this.setWidth}
                                            />
                                        </FormGroup>
                                    </Col>
                                    <Col className='col-6 col-md-6 col-lg-3'>
                                        <FormGroup>
                                            <Form.Label htmlFor="windowHeight">Height (pixels)</Form.Label>
                                            <Form.Control
                                                type="numeric"
                                                id="windowHeight"
                                                value={this.state.height ?? 0}
                                                onChange={this.setHeight}
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <Button onClick={() => this.updateTree()}>
                                    <FaSyncAlt className={styles.buttonIcon} size={20} />
                                    Rerender with new dimensions
                                </Button>
                                <Row className='my-3'>
                                    <FormGroup>
                                        <FormCheck id='viewportMatchTreeSize' name='viewportMatchTreeSize' type='checkbox' onChange={this.onChangeViewportMatchTreeSize} value={this.state.viewportMatchTreeSize} label='Make this size also the viewport size'></FormCheck>
                                    </FormGroup>
                                </Row>
                            </Form>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
                <Row className='d-flex align-items-center'>
                    <Col className='col-auto'>
                        <Button onClick={() => { this.updateTree(); }}>
                            <FaSyncAlt className={styles.buttonIcon} size={20} />
                            Refresh tree
                        </Button>
                    </Col>
                    <Col className='col-auto'>
                        <Button onClick={() => { this.downloadTreeSvg(); }}>
                            <FaImage className={styles.buttonIcon} />
                            Download current view as SVG
                        </Button>
                    </Col>
                </Row>
            </Row>
        );
    }
}
