import React from "react";

import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import html2canvas from "html2canvas";
import { useAtom } from "jotai";
import jsPDF from "jspdf";

import { BINGOAtom } from "../Atom.js";

function ExportCell({ value, point }) {
    return (
        <Box
            sx={{
                width: 100,
                height: 100,
                border: "1px solid #000",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#fff",
                position: "relative",
            }}
        >
            <Typography variant="h6">{value ?? ""}</Typography>
            <Typography variant="caption" sx={{ position: "absolute", bottom: 0 }}>
                {point ? `${point} points` : ''}
            </Typography>
        </Box>
    );
}

export default function Output() {
    const [BINGO, setBINGO] = useAtom(BINGOAtom);
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [exportType, setExportType] = React.useState(null); // "png" or "pdf"
    const exportRef = React.useRef(null);

    const handleSave = () => {
        localStorage.setItem("bingo-data", JSON.stringify(BINGO));
        alert("データをlocalStorageに保存しました");
    };

    const handleLoad = () => {
        const saved = localStorage.getItem("bingo-data");
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setBINGO(parsed);
            } catch (e) {
                console.error("Failed to load data", e);
                alert("データの読み込みに失敗しました");
            }
        } else {
            alert("保存されたデータがありません");
        }
    };

    const captureGrid = async () => {
        if (!exportRef?.current) return null;
        // increase scale for higher resolution output; use devicePixelRatio as a baseline
        const scale = Math.max(2, window.devicePixelRatio || 1);
        const canvas = await html2canvas(exportRef.current, {
            backgroundColor: "#ffffff",
            scale,
            useCORS: true,
        });
        return canvas;
    };

    const handleOpenPreview = (type) => {
        setExportType(type);
        setDialogOpen(true);
    };

    const handleExport = async () => {
        const canvas = await captureGrid();
        if (!canvas) return;

        if (exportType === "png") {
            canvas.toBlob((blob) => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = "bingo.png";
                link.click();
                URL.revokeObjectURL(url);
            });
        } else if (exportType === "pdf") {
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({ orientation: "portrait" });
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const margin = 10;
            const pdfWidth = pageWidth - margin * 2;
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            const finalHeight = Math.min(pdfHeight, pageHeight - margin * 2);
            pdf.addImage(imgData, "PNG", margin, margin, pdfWidth, finalHeight);
            pdf.save("bingo.pdf");
        }

        setDialogOpen(false);
        setExportType(null);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setExportType(null);
    };

    return (
        <>
            <Stack spacing={1} alignItems="center">
                <Stack direction="row" spacing={1}>
                    <Button variant="outlined" size="small" onClick={handleSave}>
                        Save
                    </Button>
                    <Button variant="outlined" size="small" onClick={handleLoad}>
                        Load
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenPreview("png")}
                    >
                        Export PNG
                    </Button>
                    <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenPreview("pdf")}
                    >
                        Export PDF
                    </Button>
                </Stack>
            </Stack>

            {/* Preview Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {exportType === "png" ? "PNG出力プレビュー" : "PDF出力プレビュー"}
                </DialogTitle>
                <DialogContent
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 2,
                    }}
                >
                    {/* Visible preview grid */}
                    <Box
                        ref={exportRef}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: 2,
                            backgroundColor: "#fff",
                        }}
                    >
                        <Stack spacing={2}>
                            {BINGO.map((row, r) => (
                                <Stack
                                    direction="row"
                                    spacing={2}
                                    key={r}
                                    sx={{ justifyContent: "center" }}
                                >
                                    {row.map((cell, c) => (
                                        <ExportCell
                                            key={cell.id ?? `${r}-${c}`}
                                            value={cell.name}
                                            point={cell.point}
                                        />
                                    ))}
                                </Stack>
                            ))}
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                        キャンセル
                    </Button>
                    <Button onClick={handleExport} variant="contained" color="primary">
                        出力
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
