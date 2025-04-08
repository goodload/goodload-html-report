// This dashboard shows web report of a performance testing tool https://github.com/goodload/goodload. The tool supports defining scenarios/simulations. Each simulation has a nested list of steps. Each step is executed for n number of times and the report for them is stored in a MySQL table having columns ['action_id', 'start_timestamp','end_timestamp','error_occurred'].
// Dashboard should have two panes. In left pane I will have list of 'scenarios' as written in the tool.. Each scenario will have nested list of 'Steps'. When clicking on any scenario or step, I should see the aggregate report of that step in the right pane.

// Two pane dashboard
import * as React from "react";
import {useEffect, useRef, useState} from "react";
import {ProviderFactory} from "./data/providers/provider-factory";
import {StepDef, SimulationMetadata} from "./data/dtos/dtos";
import ReportNavPane from "./ReportNavPane";
import ReportDetailsPane from "./ReportDetailsPane";

type SelectedStepPath = number[];


function Dashboard() {
    const dataProvider = ProviderFactory.buildProvider();

    const [simulation, setSimulation] = useState<SimulationMetadata>({
        id: "loading",
        name: "loading"
    });

    const [stepDefs, setStepDefs] = useState<StepDef[]>([])

    // TODO: prevent index out of bounds error as stepDefs initially will not have anything
    const [selectedStep, setSelectedStep] = useState<StepDef>(stepDefs[0]);

    // Get simulation structure from report datasource
    useEffect(() => {
        async function fetchScenarios() {
            const simulationPromise = dataProvider.loadSimulationStructure();
            const stepsGraphPromise = dataProvider.getStepsGraph();
            setSimulation(await simulationPromise);
            setStepDefs(await stepsGraphPromise);
            if (stepDefs.length > 0) {
                setSelectedStep(stepDefs[0]);
            }
        }

        fetchScenarios()
            .then(() => console.debug("Simulation structure fetched"))
            .catch((error) => console.error("Failed to load simulation structure with error: " + error))
    }, [])

    const handleStepClick = (step: StepDef) => {
        setSelectedStep(step);
    };

    return (
        <div id="dashboard">
            <ReportNavPane simulationMetadata={simulation}
                           steps={stepDefs}
                           selectedStep={selectedStep}
                           handleStepClick={handleStepClick}/>
            <ReportDetailsPane simulation={simulation} selectedStep={selectedStep}/>
        </div>
    );
}

export default Dashboard;