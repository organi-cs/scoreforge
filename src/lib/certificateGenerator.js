import { jsPDF } from 'jspdf';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { format } from 'date-fns';

const A4_WIDTH = 297; // mm (Landscape)
const A4_HEIGHT = 210; // mm (Landscape)

// Default styling configuration
const CONFIG = {
    name: { x: A4_WIDTH / 2, y: 105, font: 'times', style: 'bold', size: 42, color: '#1e3a8a', align: 'center' },
    competition: { x: A4_WIDTH / 2, y: 135, font: 'helvetica', style: 'normal', size: 24, color: '#475569', align: 'center' },
    category: { x: A4_WIDTH / 2, y: 150, font: 'helvetica', style: 'italic', size: 18, color: '#64748b', align: 'center' },
    medal: { x: A4_WIDTH / 2, y: 75, font: 'helvetica', style: 'bold', size: 28, color: '#ca8a04', align: 'center' },
    date: { x: A4_WIDTH / 2, y: 175, font: 'helvetica', style: 'normal', size: 14, color: '#94a3b8', align: 'center' }
};

function loadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => resolve(img);
        img.onerror = (e) => reject(e);
        img.src = url;
    });
}

export async function generateCertificate(participant, competition) {
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    const templateUrl = competition.certificateBgUrl || null;

    // 1. Draw Background
    if (templateUrl) {
        try {
            const img = await loadImage(templateUrl);
            doc.addImage(img, 'PNG', 0, 0, A4_WIDTH, A4_HEIGHT);
        } catch (e) {
            console.warn("Could not load template image, falling back to border", e);
            drawFallbackBorder(doc);
        }
    } else {
        drawFallbackBorder(doc);
    }

    // 2. Add Text Overlay
    const { name, medal, categoryId } = participant;
    const compName = competition.name || 'Math Competition';

    // Try to find category name
    const category = competition.categories?.find(c => c.id === categoryId);
    const catName = category ? category.name : 'General Category';

    const dateStr = competition.date ? format(new Date(competition.date), 'MMMM do, yyyy') : '';
    const displayMedal = medal ? `${medal.toUpperCase()} MEDALIST` : 'PARTICIPANT';

    // Fix coloring for medals
    let medalColor = CONFIG.medal.color;
    if (medal === 'silver') medalColor = '#94a3b8';
    if (medal === 'bronze') medalColor = '#b45309';
    if (!medal) medalColor = '#475569';

    addText(doc, displayMedal, CONFIG.medal.x, CONFIG.medal.y, CONFIG.medal.font, CONFIG.medal.style, CONFIG.medal.size, medalColor);
    addText(doc, name, CONFIG.name.x, CONFIG.name.y, CONFIG.name.font, CONFIG.name.style, CONFIG.name.size, CONFIG.name.color);
    addText(doc, compName, CONFIG.competition.x, CONFIG.competition.y, CONFIG.competition.font, CONFIG.competition.style, CONFIG.competition.size, CONFIG.competition.color);
    addText(doc, catName, CONFIG.category.x, CONFIG.category.y, CONFIG.category.font, CONFIG.category.style, CONFIG.category.size, CONFIG.category.color);
    addText(doc, dateStr, CONFIG.date.x, CONFIG.date.y, CONFIG.date.font, CONFIG.date.style, CONFIG.date.size, CONFIG.date.color);

    return doc;
}

function addText(doc, text, x, y, font, style, size, colorHex) {
    if (!text) return;
    doc.setFont(font, style);
    doc.setFontSize(size);
    doc.setTextColor(colorHex);
    doc.text(text, x, y, { align: 'center' });
}

function drawFallbackBorder(doc) {
    doc.setLineWidth(4);
    doc.setDrawColor('#1e40af'); // blue-800
    doc.rect(10, 10, A4_WIDTH - 20, A4_HEIGHT - 20);

    doc.setLineWidth(1);
    doc.setDrawColor('#ca8a04'); // yellow-600
    doc.rect(14, 14, A4_WIDTH - 28, A4_HEIGHT - 28);
}

export async function generateBatchCertificates(participants, competition) {
    const zip = new JSZip();
    const folder = zip.folder(`Certificates_${competition.name.replace(/[^a-z0-9]/gi, '_')}`);

    for (const p of participants) {
        const doc = await generateCertificate(p, competition);
        const pdfBlob = doc.output('blob');

        // Naming convention: Medal_Rank_Name.pdf
        const medalPrefix = p.medal ? `${p.medal}_` : 'participant_';
        const rankPrefix = p.rank?.inCategory ? `rank${p.rank.inCategory}_` : '';
        const cleanName = p.name.replace(/[^a-z0-9]/gi, '_');

        const filename = `${medalPrefix}${rankPrefix}${cleanName}.pdf`;
        folder.file(filename, pdfBlob);
    }

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `Certificates_${competition.name.replace(/[^a-z0-9]/gi, '_')}.zip`);
}
