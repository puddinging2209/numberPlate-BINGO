import React from "react";

import { Stack } from "@mui/material";
import { useAtom } from "jotai";

import { BINGOAtom } from "../../Atom.js";
import cityList from "../../data/cityList.json";
import RegionAccordion from "./RegionAccordion.jsx";

function Controller() {
    const [expandedIndex, setExpandedIndex] = React.useState(-1);
    const [BINGO, setBINGO] = useAtom(BINGOAtom);
    const panelRef = React.useRef(null);

    const handleChange = React.useCallback((i) => {
        setExpandedIndex(prev => (prev === i ? -1 : i));
    }, []);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setExpandedIndex(-1);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <Stack spacing={0} ref={panelRef}>
            {Object.entries(cityList).map(([region, prefectures], i) => (
                <RegionAccordion
                    key={region}
                    regionName={region}
                    prefectures={prefectures}
                    expanded={expandedIndex === i}
                    onChange={() => handleChange(i)}
                    BINGO={BINGO}
                    setBINGO={setBINGO}
                />
            ))}
        </Stack>
    );
}

export default Controller;