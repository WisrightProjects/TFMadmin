import { useContext } from "react";
import { AccordionContext, useAccordionButton } from "react-bootstrap";

const AccordionHeader = (props) => {
    const {eventKey, headerTitle} = props;
    function AccordionHeaderCustom({ children, eventKey, callback }) {
        const { activeEventKey } = useContext(AccordionContext);
        const decoratedOnClick = useAccordionButton(eventKey, () => callback && callback(eventKey));
        const isCurrentEventKey = activeEventKey === eventKey;

        return (
            <a onClick={decoratedOnClick}
                aria-expanded={isCurrentEventKey}>
                {children}
            </a>
        );
    };

    return(
        <AccordionHeaderCustom eventKey={eventKey}>{headerTitle}</AccordionHeaderCustom>
    )
};

export default AccordionHeader;