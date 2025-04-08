import {Provider} from "./provider";
import {SimulationMetadata, StepDef, StepMetrics} from "../dtos/dtos";

export class MockProvider extends Provider {
    public async getMetricsForStepId(stepId: string, startTimestamp: number, endTimestamp: number): Promise<StepMetrics> {
        return Promise.resolve({
            stepId: stepId,
            avgIterationTime: 10,
            percentile95ExecutionTime: 10,
            percentile99ExecutionTime: 100
        });
    }

    public async getStepsGraph(): Promise<StepDef[]> {
        return Promise.resolve([
            {
                id: '1',
                name: 'Step 1',
                subSteps: [
                    {
                        id: '1.1',
                        name: 'Step 1.1',
                        subSteps: [
                            {
                                id: '1.1.1',
                                name: 'Step 1.1.1',
                                subSteps: []
                            },
                            {
                                id: '1.1.2',
                                name: 'Step 1.1.2',
                                subSteps: []
                            }
                        ]
                    },
                    {
                        id: '1.2',
                        name: 'Step 1.2',
                        subSteps: [
                            {
                                id: '1.2.1',
                                name: 'Step 1.2.1',
                                subSteps: []
                            },
                            {
                                id: '1.2.2',
                                name: 'Step 1.2.2',
                                subSteps: []
                            }
                        ]
                    }
                ]
            },
            {
                id: '2',
                name: 'Step 2',
                subSteps: []
            }
        ]);
    }

    protected async getSubStepsGraph(parentStepId: number): Promise<StepDef[]> {
        return Promise.resolve([]);
    }

    public async loadSimulationStructure(): Promise<SimulationMetadata> {
        return Promise.resolve({
            id: '1',
            name: 'Simulation 1'
        });
    }

}