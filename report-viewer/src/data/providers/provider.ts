import {StepDef, SimulationMetadata, StepMetrics} from "../dtos/dtos";

export abstract class Provider {

    public abstract loadSimulationStructure(): Promise<SimulationMetadata>

    public abstract getStepsGraph(): Promise<StepDef[]>

    protected abstract getSubStepsGraph(parentStepId: number): Promise<StepDef[]>

    public abstract getMetricsForStepId(stepId: string, startTimestamp: number, endTimestamp: number): Promise<StepMetrics>
}