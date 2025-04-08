import {StepDef} from "./data/dtos/dtos";

function StepMetricsTable(props: {stepDef: StepDef}) {
    console.log(JSON.stringify(props, null, 2));
    return (
        <>
            <p>
                <span className="step-metrics-table-header">Step Metrics Table</span>
            </p>
        </>
    );
}

export default StepMetricsTable;