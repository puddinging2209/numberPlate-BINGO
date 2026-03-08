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
    setBINGO
}) {
    // ヘルパー関数
    const isCityInBINGO = (city) => {
        return BINGO.flat().some(cell => cell.name === city);
    };

    const findFirstNullCell = () => {
        for (let r = 0; r < 5; r++) {
            for (let c = 0; c < 5; c++) {
                if (BINGO[r][c].name === null) {
                    return { r, c };
                }
            }
        }
        return null; // 全て埋まっている場合
    };

    const handleCheckboxChange = (prefecture, city, checked) => {
        if (checked) {
            // チェックされたら、最初のnullのセルに追加
            const nullCell = findFirstNullCell();
            if (nullCell) {
                setBINGO(prev => {
                    const newBINGO = prev.map(row => row.map(cell => ({ ...cell })));
                    newBINGO[nullCell.r][nullCell.c] = { id: `${prefecture}-${city}`, name: city };
                    return newBINGO;
                });
            }
        } else {
            // チェック解除されたら、そのcityを削除
            setBINGO(prev => {
                return prev.map(row =>
                    row.map(cell =>
                        cell.name === city ? { id: null, name: null } : cell
                    )
                );
            });
        }
    };

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
