import supportedFrameworks from "../../utils/supported-frameworks";
import renderer from "react-test-renderer";
import { Snippet } from "./Snippet";
import React from "react";

// Utility method used by test suites to verify snippets match saved snapshots for all frameworks
const runSnippetFrameworkTests = snippetToTest => {
    it.each(supportedFrameworks)(`it should create '%s' snippets`, framework => {
        const generatedSnippet =
            renderer
                .create(<Snippet framework={framework}>{snippetToTest}</Snippet>)
                .toJSON();

        expect(generatedSnippet).toMatchSnapshot();
    });
}

// These tests are run for each framework!
describe('Snippet', () => {
    describe('given simple column definitions', () => {
        runSnippetFrameworkTests(
            `const gridOptions = {
                // define 3 columns
                columnDefs: [
                    { headerName: 'A', field: 'a' },
                    { headerName: 'B', field: 'b' },
                    { headerName: 'C', field: 'c' },
                ]
            }`
        );
    });

    describe('given column definitions with group columns', () => {
        runSnippetFrameworkTests(
            `const gridOptions = {
                // 2 levels of grouping
                columnDefs: [
                    {
                        headerName: 'G1',
                        children: [
                            { headerName: 'C1', field: 'c1' },
                            { 
                                headerName: 'G2', 
                                children: [
                                    { headerName: 'C2', field: 'c2' },
                                    { headerName: 'C3', field: 'c3' },
                                ],
                            },
                            { headerName: 'C4', field: 'c4' },
                        ]
                    },
                ]
            }`
        );
    });

    describe('given a mix of different properties', () => {
        runSnippetFrameworkTests(
            `const gridOptions = {
                // columnDefs property (special)
                columnDefs: [
                    { headerName: 'A', field: 'a' },
                    { headerName: 'B', field: 'b' },
                    { headerName: 'C', field: 'c' },
                ],
                // numeric property
                rowHeight: 50,
                // boolean property
                rowDragManaged: true,
                // string property
                rowSelection: 'single',
            }`
        );
    });
});