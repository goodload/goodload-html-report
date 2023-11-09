import React from "react";
import {StepDef, SimulationMetadata} from "./data/dtos/dtos";
import StepsList from "./StepsList";

type ReportNavPaneProps = {
    simulationMetadata: SimulationMetadata,
    steps: StepDef[],
    selectedStep?: StepDef,
    handleStepClick: (step: StepDef) => void
}

function ReportNavPane(props: ReportNavPaneProps) {

    return (<div className="scenario-nav-pane">
        <div className="scenario-nav-pane-header">
            <span
                className={`scenario-nav-pane-header-text ${!props.selectedStep ? "selected" : ""}`}>
                {props.simulationMetadata.name}
            </span>
        </div>
        <div className="nav-pane-contents">
            <StepsList level={0}
                       steps={props.steps}
                       selectedStep={props.selectedStep}
                       handleStepClick={props.handleStepClick} />
        </div>
    </div>)
}

export default ReportNavPane;