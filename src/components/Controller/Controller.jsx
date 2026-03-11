import React from "react";

import { Stack, TextField, Typography } from "@mui/material";
import { useAtom } from "jotai";

import { BINGOAtom, ReferencePointAtom } from "../../Atom.js";
import cityList from "../../data/cityList.json";
import RegionAccordion from "./RegionAccordion.jsx";

function Controller() {
    const [expandedIndex, setExpandedIndex] = React.useState(-1);
    const [referencePoint, setReferencePoint] = useAtom(ReferencePointAtom);
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
        <Stack direction="column" spacing={1}>
            <Stack direction="row" spacing={1}>
                <Typography variant="body1">得点基準地点</Typography>
                <TextField
                    label="経度"
                    variant="outlined"
                    value={referencePoint[0]}
                    onChange={e => setReferencePoint([referencePoint[0], parseFloat(e.target.value)])}
                    error={isNaN(referencePoint[0])}
                    helperText={isNaN(referencePoint[0]) ? "正の実数を入力してください" : ""}
                />
                <TextField
                    label="緯度"
                    variant="outlined"
                    value={referencePoint[1]}
                    onChange={e => setReferencePoint([parseFloat(e.target.value), referencePoint[1]])}
                    error={isNaN(referencePoint[1])}
                    helperText={isNaN(referencePoint[1]) ? "正の実数を入力してください" : ""}
                />
            </Stack>
            <Stack direction="row" spacing={1}>
                <Typography variant="body1">ナガシマスパーランド駐車場：136.729068, 35.033053</Typography>
            </Stack>
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
        </Stack>
    );
}

export default Controller;