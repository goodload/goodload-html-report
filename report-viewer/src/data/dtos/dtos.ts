interface StepDef {
    id: string,
    name: string
    subSteps: StepDef[]
}

interface SimulationMetadata {
    id: string,
    name: string
}

interface StepMetrics {
    stepId: string,
    avgIterationTime: number,
    percentile95ExecutionTime: number,
    percentile99ExecutionTime: number
}

export type {StepDef, SimulationMetadata, StepMetrics}