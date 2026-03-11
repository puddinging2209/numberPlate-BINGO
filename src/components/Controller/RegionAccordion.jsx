import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    FormGroup,
    Typography
} from "@mui/material";
import React from "react";
import AddCheckBox from './AddCheckBox';

const RegionAccordion = React.memo(function RegionAccordion({
    regionName,
    prefectures,
    expanded,
    onChange,
    BINGO,
}) {

    // prefectures は変わらないので、レンダーツリーをメモ化
    const prefectureNodes = React.useMemo(
        () =>
            Object.entries(prefectures).map(([key, cities]) => (
                <Accordion key={key}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography component="span">{key}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <FormGroup>
                            {cities.map((city) => (
                                <AddCheckBox
                                    key={city}
                                    prefecture={key}
                                    city={city}
                                />
                            ))}
                        </FormGroup>
                    </AccordionDetails>
                </Accordion>
            )),
        [prefectures, BINGO]
    );

    return (
        <Accordion
            expanded={expanded}
            onChange={onChange}
            TransitionProps={{ timeout: 0, unmountOnExit: false }} // アニメーションオフ & 内容を常にDOMに残す
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography component="span">{regionName}</Typography>
            </AccordionSummary>
            <AccordionDetails>
                {/* DOMに常駐させ、開閉はTransitionPropsのunmountOnExitで制御 */}
                {prefectureNodes}
            </AccordionDetails>
        </Accordion>
    );
});

export default RegionAccordion;
