import React from "react";
import ReactMarkdown from "react-markdown";
import { useQuery } from "react-query";
import CustomHelmet from "../components/custom-helmet";
import { ErrorMessage } from "../components/error-message";
import Wrapper from "../components/wrapper";
import '../index.css'
import manualMd from '../manual.md'
import Headings from "../renderHeadings";

const Manual = () => {

    const { isLoading, error, data: markdown, isError } = useQuery(['manual_markdown'], () =>
        fetch(manualMd)
            .then((response) => response.text()),
        {
            refetchInterval: false,
            retry: false,
        }
    )

    const renderContent = () => {
        if (isLoading) {
            return <div>Loading text ...</div>
        } else if (!isError) {
            return (
                <ReactMarkdown
                    children={markdown}
                    components={{
                        'h1': Headings,
                        'h2': Headings,
                        'h3': Headings,
                        'h4': Headings,
                        'h5': Headings,
                        'h6': Headings
                    }}
                />
            )
        } else {
            return (
                <div>
                    <ErrorMessage error={error}/>
                </div>
            )
        }
    }

    return (
        <Wrapper>
            <CustomHelmet
                title='Manual and Documentation'
                description='Citations and references to the parties involved in making this website possible.'
                canonical='credits'
            />
            {renderContent()}
        </Wrapper>
    )
}

export default Manual;