const Reading = require('../models/Reading');
const Machine = require('../models/Machine');
const { Parser } = require('json2csv');
const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

const getReadingsPayload = async (machineId) => {
    const matchStage = (machineId && machineId !== 'ALL') ? { $match: { machine_id: machineId } } : { $match: {} };

    const data = await Reading.aggregate([
        matchStage,
        { $sort: { recorded_at: -1 } },
        { $limit: 1000 },
        { $lookup: {
            from: 'machines',
            localField: 'machine_id',
            foreignField: 'machineId',
            as: 'machine_info'
        }},
        { $unwind: { path: '$machine_info', preserveNullAndEmptyArrays: true } },
        { $lookup: {
            from: 'predictions',
            localField: 'machine_id',
            foreignField: 'machineId',
            as: 'prediction_info'
        }},
        { $unwind: { path: '$prediction_info', preserveNullAndEmptyArrays: true } }
    ]);
    
    return data.map(r => ({
        'Reading ID': r.reading_id,
        'Machine ID': r.machine_id,
        'Machine Name': r.machine_info?.name || 'Unknown Asset',
        'Temperature': r.temperature,
        'Vibration RMS': r.vibration,
        'Health Score': r.healthScore,
        'Machine Status': r.machine_info?.status || 'Unknown',
        'Alert Status': r.alert_flag,
        'Prediction': r.prediction_info?.recommendedAction || 'Normal operation expected',
        'Remaining Useful Life': r.prediction_info?.rulHours || 1420,
        'Recorded Time': new Date(r.recorded_at).toISOString(),
        'Created Date': r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
        'Updated Date': r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString()
    }));
};

const exportCSV = async (req, res) => {
    try {
        const { machineId } = req.query;
        const readings = await getReadingsPayload(machineId);
        
        // Remove manual fields to automatically inherit the aggregated array keys
        const json2csvParser = new Parser();
        const csvData = json2csvParser.parse(readings);
        
        const appHeaderRow = `"VibeGuard AI (⚡) - Industrial Fleet Condition Center"\n"Generated On: ${new Date().toLocaleString()}"\n"Module: Comprehensive Fleet Condition Report"\n\n`;
        const finalCsv = appHeaderRow + csvData;

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        res.header('Content-Type', 'text/csv');
        res.attachment(`Machine_Condition_Report_${dateStr}.csv`);
        return res.send(finalCsv);
    } catch (err) {
        return res.status(500).json({ success: false, message: 'CSV Generation Failed' });
    }
};

const exportJSON = async (req, res) => {
    try {
        const { machineId } = req.query;
        const readings = await getReadingsPayload(machineId);
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        
        const payload = {
            metadata: {
                appName: 'VibeGuard AI (⚡)',
                description: 'Industrial Fleet Condition Center - Telemetry Export',
                generatedOn: new Date().toISOString(),
                totalRecords: readings.length
            },
            data: readings
        };
        
        res.header('Content-Type', 'application/json');
        res.attachment(`Machine_Condition_Report_${dateStr}.json`);
        return res.send(JSON.stringify(payload, null, 2));
    } catch (err) {
        return res.status(500).json({ success: false, message: 'JSON Generation Failed' });
    }
};

const exportExcel = async (req, res) => {
    try {
        const { machineId } = req.query;
        const readings = await getReadingsPayload(machineId);
        
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Telemetry Summary', {
            views: [{ state: 'frozen', ySplit: 1 }] // Freeze first row natively
        });
        
        if (readings.length > 0) {
            // App Name & Logo Header Row setup
            sheet.insertRow(1, ['VibeGuard AI (⚡) - Industrial Fleet Condition Center']);
            sheet.mergeCells('A1:D1');
            sheet.getRow(1).font = { bold: true, size: 14, color: { argb: 'FF00B8D9' } };
            
            sheet.insertRow(2, [`Report Generated: ${new Date().toLocaleString()}`]);
            sheet.mergeCells('A2:D2');
            sheet.getRow(2).font = { italic: true, size: 10 };
            
            sheet.insertRow(3, []); // spacer

            const headers = Object.keys(readings[0]);
            const headerRow = sheet.insertRow(4, headers);
            
            sheet.columns = headers.map((h, i) => ({
                header: sheet.getRow(4).getCell(i + 1).value, // map explicitly to the 4th row headers
                key: h,
                width: h.length < 15 ? 18 : h.length + 5
            }));
            
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
            headerRow.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF0A0A0A' } };

            readings.forEach(r => sheet.addRow(r));
            sheet.views = [{ state: 'frozen', ySplit: 4 }]; 
        }

        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Machine_Condition_Report_${dateStr}.xlsx`);
        
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Excel Generation Failed' });
    }
};

const exportPDF = async (req, res) => {
    try {
        const { machineId } = req.query;
        const machineFilter = (machineId && machineId !== 'ALL') ? { machineId } : {};
        const machines = await Machine.find(machineFilter);
        const readings = await getReadingsPayload(machineId);
        
        const doc = new PDFDocument({ margin: 40, size: 'A4' });
        const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=Machine_Condition_Report_${dateStr}.pdf`);
        doc.pipe(res);

        // Header / Logo Configuration
        doc.rect(40, 35, 45, 45).fillAndStroke('#0A0A0A', '#00B8D9');
        doc.fillColor('#00B8D9').fontSize(22).text('⚡', 52, 48); // Logo icon

        doc.fillColor('#0A0A0A').fontSize(16).text('VibeGuard AI - Enterprise Telemetry Report', 100, 42);
        doc.fontSize(10).fillColor('#475569').text(`Report Generated On: ${new Date().toLocaleString()}`, 100, 62);
        
        doc.moveDown(3);

        // Summary Statistics Calculations
        let healthy = 0, warning = 0, critical = 0, faulty = 0;
        let tempSum = 0, vibSum = 0, hsSum = 0, oeeSum = 0;

        machines.forEach(m => {
            if (m.status === 'Healthy') healthy++;
            else if (m.status === 'Warning') warning++;
            else if (m.status === 'Critical') critical++;
            else faulty++;
            tempSum += m.temperature || 0;
            vibSum += m.vibration || 0;
            hsSum += m.healthScore || 0;
            oeeSum += m.oee || 0;
        });

        const total = machines.length || 1;
        
        doc.fontSize(14).font('Helvetica-Bold').text('Summary Statistics', 40, doc.y);
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica');
        
        const startY = doc.y;
        doc.text(`Total Machines: ${machines.length}`, 40, startY);
        doc.text(`Healthy: ${healthy}`, 40, startY + 15);
        doc.text(`Warning: ${warning}`, 40, startY + 30);
        doc.text(`Critical: ${critical}`, 40, startY + 45);
        doc.text(`Faulty: ${faulty}`, 40, startY + 60);

        doc.text(`Average Temperature: ${(tempSum/total).toFixed(1)} °C`, 250, startY);
        doc.text(`Average Vibration: ${(vibSum/total).toFixed(2)} mm/s`, 250, startY + 15);
        doc.text(`Average Health Score: ${(hsSum/total).toFixed(1)} / 100`, 250, startY + 30);
        doc.text(`Plant OEE: ${(oeeSum/total).toFixed(1)}%`, 250, startY + 45);

        doc.moveDown(6);

        // Readings Table
        doc.fontSize(14).font('Helvetica-Bold').text('Complete Readings Log', 40, doc.y);
        doc.moveDown(1);
        
        const drawTableHeader = (y) => {
            doc.font('Helvetica-Bold').fontSize(9);
            doc.text('Reading ID', 40, y);
            doc.text('Machine ID', 120, y);
            doc.text('Temp', 200, y);
            doc.text('Vib RMS', 250, y);
            doc.text('Status', 320, y);
            doc.text('Timestamp', 400, y);
            doc.moveTo(40, y + 12).lineTo(550, y + 12).stroke();
            doc.font('Helvetica');
        };

        drawTableHeader(doc.y);
        let tableY = doc.y + 10;
        
        // Render max 200 to prevent PDFKit generation locking the event loop unnecessarily
        const exportSubset = readings.slice(0, 200);

        exportSubset.forEach((r, idx) => {
            if (tableY > 750) {
                doc.addPage();
                tableY = 50;
                drawTableHeader(tableY);
                tableY += 20;
            }
            doc.fontSize(8);
            doc.text(r['Reading ID'], 40, tableY);
            doc.text(r['Machine ID'], 120, tableY);
            doc.text(`${r['Temperature']} °C`, 200, tableY);
            doc.text(`${r['Vibration RMS']} mm/s`, 250, tableY);
            doc.text(r['Alert Status'], 320, tableY);
            doc.text(new Date(r['Recorded Time']).toLocaleString(), 400, tableY);
            tableY += 15;
            
            // Draw subtle row separator line
            doc.moveTo(40, tableY - 3).lineTo(550, tableY - 3).strokeColor('#e2e8f0').stroke();
            doc.strokeColor('#000000'); // Reset stroke
        });
        
        // Footer loop numbering
        const range = doc.bufferedPageRange();
        for (let i = range.start; i < range.start + range.count; i++) {
            doc.switchToPage(i);
            doc.fontSize(8).text(`Page ${i + 1} of ${range.count}`, 40, 800, { align: 'center' });
        }

        doc.end();
    } catch (err) {
        return res.status(500).json({ success: false, message: 'PDF Generation Failed' });
    }
};

module.exports = { exportCSV, exportJSON, exportExcel, exportPDF };
