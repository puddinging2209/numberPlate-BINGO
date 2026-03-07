import React from "react";

import { Stack } from "@mui/material";
import { useAtom } from "jotai";

import { BINGOAtom } from "../Atom.js";
import cityList from "../data/cityList.json";
import RegionAccordion from "./RegionAccordion";

function AddPanel() {
    const [expandedIndex, setExpandedIndex] = React.useState(-1);
    const [BINGO, setBINGO] = useAtom(BINGOAtom);

    const handleChange = React.useCallback((i) => {
        setExpandedIndex(prev => (prev === i ? -1 : i));
    }, []);

    return (
        <Stack spacing={0}>
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

export default AddPanel;