import { closestCenter, DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useAtom, useSetAtom } from "jotai";
import React from "react";

import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Card, IconButton, Stack, Typography } from "@mui/material";

import { BINGOAtom } from "../Atom.js";

export function PreviewCard({ id, value }) {
    const setBINGO = useSetAtom(BINGOAtom);

    // delete the cell by matching its unique id; keep the id so
    // the empty slot stays draggable and we can swap with it later
    function handleDelete() {
        setBINGO(prev =>
            prev.map(row =>
                row.map(cell =>
                    cell.id === id ? { ...cell, name: null } : cell
                )
            )
        );
    }

    return (
        <Card sx={{ width: 100, height: 100, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #000" }}>
            {value != null && (
                <Box sx={{ position: "absolute", top: 0, right: 0 }}>
                    <IconButton
                        size="small"
                        sx={{ padding: "4px" }}
                        onClick={handleDelete}
                        onPointerDown={(e) => e.stopPropagation()}
                        draggable={false}
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Box>
            )}
            <Typography variant="h6">{value ?? ''}</Typography>
        </Card>
    );
}

function Cell({ id, value }) {
    const { attributes, listeners, setNodeRef: setDragRef, transform, transition, isDragging } = useDraggable({ id });
    const { setNodeRef: setDropRef } = useDroppable({ id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1000 : undefined,
        userSelect: 'none',
    };

    return (
        <div
            ref={(node) => {
                setDragRef(node);
                setDropRef(node);
            }}
            style={style}
            {...attributes}
            {...listeners}
        >
            <PreviewCard id={id} value={value} />
        </div>
    );
}


import Output from "./Output.jsx";

function Preview() {
    const [BINGO, setBINGO] = useAtom(BINGOAtom);



    // ensure every cell has a stable id (handles older states)
    // keeping an id on empty cells lets us drag a filled cell into them.
    React.useEffect(() => {
        let updated = false;
        const patched = BINGO.map((row, r) =>
            row.map((item, c) => {
                if (!item.id) {
                    updated = true;
                    return { ...item, id: `${r}-${c}` };
                }
                return item;
            })
        );
        if (updated) {
            setBINGO(patched);
        }
    }, [BINGO, setBINGO]);

    // handlers can compute from latest state to avoid stale closures
    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            setBINGO((prev) => {
                const flatPrev = prev.flat();
                const idx1 = flatPrev.findIndex((i) => i.id === active.id);
                const idx2 = flatPrev.findIndex((i) => i.id === over.id);
                if (idx1 === -1 || idx2 === -1) return prev;
                const newFlat = [...flatPrev];
                [newFlat[idx1], newFlat[idx2]] = [newFlat[idx2], newFlat[idx1]];

                const newGrid = [];
                for (let r = 0; r < 5; r++) {
                    newGrid.push(newFlat.slice(r * 5, r * 5 + 5));
                }
                return newGrid;
            });
        }
    };

    return (
        <>
            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Stack spacing={2}>
                        {BINGO.map((row, r) => (
                            <Stack direction="row" spacing={2} key={r} sx={{ justifyContent: 'center' }}>
                                {row.map((value, c) => {
                                    // fallback to coordinate if id somehow still null
                                    const cellId = value.id ?? `${r}-${c}`;
                                    return <Cell key={cellId} id={cellId} value={value.name} />;
                                })}
                            </Stack>
                        ))}
                    </Stack>
                </Box>
            </DndContext>
            <Output BINGO={BINGO} setBINGO={setBINGO} />
        </>
    );
}

export default Preview