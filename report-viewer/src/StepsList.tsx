import {StepDef} from "./data/dtos/dtos";
import {Nav, Navbar, NavDropdown, NavItem} from "react-bootstrap";

type StepsListProps = {
    level: number
    steps: StepDef[]
    selectedStep?: StepDef,
    handleStepClick: (step: StepDef) => void
}

type StepProps = {
    level: number
    step: StepDef
    selectedStep?: StepDef,
    handleStepClick: (step: StepDef) => void
}

function Step(props: StepProps) {
    if (props.step.subSteps === null || props.step.subSteps.length === 0) {
        return (
            <>
                <NavItem>
                    <span className={`steps-list steps-list-level-${props.level}`}>
                        <span className={'step-nav-item-text'}>{props.step.name}</span>
                    </span>
                </NavItem>
            </>
        )
    } else {
        return (
            <>
                <Navbar title={props.step.name} id={`nav-dropdown-${props.step.id}`} className="flex-column">
                    <StepsList level={props.level + 1}
                               steps={props.step.subSteps}
                               selectedStep={props.selectedStep}
                               handleStepClick={props.handleStepClick}/>
                </Navbar>
            </>
        )
    }
}

export default function StepsList(props: StepsListProps) {
    if (props === null || props.steps == null) {
        return (<></>)
    }

    let content = props.steps.map((step: StepDef, index: number) => {
        return (<>
            <Step level={props.level + 1} step={step} handleStepClick={props.handleStepClick} />
        </>)
    })

    return (
    <>
        {content}
    </>)
}