import { Checkbox, FormControlLabel } from "@mui/material";
import { useAtom, useAtomValue } from "jotai";

import { BINGOAtom, ReferencePointAtom } from "../../Atom.js";
import haversine from "../../utils/haversine.js";

import pointList from "../../data/pointList.json";

function AddCheckBox({ prefecture, city }) {
    const [BINGO, setBINGO] = useAtom(BINGOAtom);
    const referencePoint = useAtomValue(ReferencePointAtom);

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
                const p = haversine(referencePoint, pointList[city]);
                setBINGO(prev => {
                    const newBINGO = prev.map(row => row.map(cell => ({ ...cell })));
                    newBINGO[nullCell.r][nullCell.c] = { id: `${prefecture}-${city}`, name: city, point: (p / 100).toFixed(0) / 100 };
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
    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={isCityInBINGO(city)}
                    onChange={(e) => handleCheckboxChange(prefecture, city, e.target.checked)}
                />
            }
            label={city}
        />
    );
}

export default AddCheckBox;