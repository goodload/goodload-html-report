import {ReportDetailsPaneProps} from "./types";
import StepMetricsTable from "./StepMetricsTable";

function ReportDetailsPane(props: ReportDetailsPaneProps) {

    return (<div className="scenario-details-pane">
        <div className="scenario-details-pane-header">
            <span
                className={`scenario-details-pane-header-text ${!props.selectedStep ? "selected" : ""}`}>
                {props.simulation.name}
            </span>
        </div>
        <div className="scenario-details-pane-contents">
            <StepMetricsTable stepDef={props.selectedStep} />
        </div>
    </div>)


}

export default ReportDetailsPane;