import {StepDef} from "./data/dtos/dtos";

type Props = {
    level: number
    steps: StepDef[]
    selectedStep?: StepDef,
    handleStepClick: (step: StepDef) => void
}

export default function StepsList(props: Props) {
    if (props.level > 10 || !props.steps || props.steps.length === 0) {
        return null
    }

    return (
        <ul className={`steps-list steps-list-level-${props.level}`}>
            {
                props.steps.map((step) => (
                    <li
                        key={step.id}
                        className={`step-nav-item ${props.selectedStep === step ? "selected" : ""}`}
                        onClick={() => props.handleStepClick(step)}
                    >
                        <span className={'step-nav-item-text'}>{step.name}</span>

                        <StepsList level={props.level + 1}
                                   steps={step.subSteps}
                                   selectedStep={props.selectedStep}
                                   handleStepClick={props.handleStepClick}/>
                    </li>
                ))
            }
        </ul>
    )
}