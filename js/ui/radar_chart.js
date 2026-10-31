/**
 * NutriGen-CDS: Zero-Dependency SVG Radar & Risk Visualizer
 * Renders high-performance, accessible SVG radar charts for metabolic domain risk scores.
 */

const SVGRadarChart = {
  /**
   * Render SVG radar chart into target container
   * @param {string|HTMLElement} container - DOM element or selector
   * @param {object} domainAssessments - Normalized domain assessment results from rule engine
   */
  render: function(container, domainAssessments) {
    const el = typeof container === 'string' ? document.querySelector(container) : container;
    if (!el) return;

    const domains = [
      { key: "Methylation", label: "Methylation (1-Carbon)", score: (domainAssessments.Methylation && domainAssessments.Methylation.percentageScore) || 0 },
      { key: "Cardiometabolic", label: "Cardiometabolic & Lipids", score: (domainAssessments.Cardiometabolic && domainAssessments.Cardiometabolic.percentageScore) || 0 },
      { key: "Micronutrients", label: "Micronutrient Transport", score: (domainAssessments.Micronutrients && domainAssessments.Micronutrients.percentageScore) || 0 },
      { key: "Intolerances", label: "Sensitivities & Intolerances", score: (domainAssessments.Intolerances && domainAssessments.Intolerances.percentageScore) || 0 },
      { key: "Detoxification", label: "Detox & Antioxidants", score: (domainAssessments.Detoxification && domainAssessments.Detoxification.percentageScore) || 0 }
    ];

    const size = 360;
    const center = size / 2;
    const radius = 130;
    const totalAxes = domains.length;
    const angleSlice = (Math.PI * 2) / totalAxes;

    // Helper to get coordinates
    const getCoordinates = (value, index) => {
      const angle = index * angleSlice - Math.PI / 2;
      const r = (value / 100) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle)
      };
    };

    let svgHtml = `
      <svg class="radar-svg" viewBox="0 0 ${size} ${size}" width="100%" height="100%" aria-label="Metabolic Domain Risk Radar">
        <defs>
          <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0284c7" stop-opacity="0.55" />
            <stop offset="100%" stop-color="#059669" stop-opacity="0.35" />
          </linearGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#0284c7" flood-opacity="0.3" />
          </filter>
        </defs>
    `;

    // 1. Draw concentric background polygons (25, 50, 75, 100%)
    const levels = [25, 50, 75, 100];
    levels.forEach(level => {
      const points = [];
      for (let i = 0; i < totalAxes; i++) {
        const coords = getCoordinates(level, i);
        points.push(`${coords.x.toFixed(1)},${coords.y.toFixed(1)}`);
      }
      svgHtml += `
        <polygon points="${points.join(' ')}" 
                 fill="none" 
                 stroke="var(--border-subtle, #e2e8f0)" 
                 stroke-width="1" 
                 stroke-dasharray="${level === 100 ? 'none' : '3,3'}" />
      `;
      // Level labels
      const labelCoord = getCoordinates(level, 0);
      svgHtml += `
        <text x="${labelCoord.x + 4}" y="${labelCoord.y + 10}" 
              font-size="9" fill="var(--text-muted, #94a3b8)" font-family="sans-serif">
          ${level}%
        </text>
      `;
    });

    // 2. Draw axis spokes
    for (let i = 0; i < totalAxes; i++) {
      const outerCoord = getCoordinates(100, i);
      svgHtml += `
        <line x1="${center}" y1="${center}" x2="${outerCoord.x}" y2="${outerCoord.y}" 
              stroke="var(--border-subtle, #cbd5e1)" stroke-width="1.2" />
      `;

      // Label at outer edge
      const labelR = radius + 22;
      const angle = i * angleSlice - Math.PI / 2;
      const lx = center + labelR * Math.cos(angle);
      const ly = center + labelR * Math.sin(angle);
      const textAnchor = Math.abs(Math.cos(angle)) < 0.2 ? 'middle' : (Math.cos(angle) > 0 ? 'start' : 'end');

      svgHtml += `
        <text x="${lx}" y="${ly}" 
              text-anchor="${textAnchor}" 
              font-size="11" 
              font-weight="600" 
              fill="var(--text-primary, #1e293b)" 
              font-family="sans-serif"
              dominant-baseline="central">
          ${domains[i].label} (${domains[i].score}%)
        </text>
      `;
    }

    // 3. Draw data polygon
    const dataPoints = [];
    const pointCoords = [];
    for (let i = 0; i < totalAxes; i++) {
      const c = getCoordinates(domains[i].score, i);
      dataPoints.push(`${c.x.toFixed(1)},${c.y.toFixed(1)}`);
      pointCoords.push({ ...c, domain: domains[i] });
    }

    svgHtml += `
      <polygon points="${dataPoints.join(' ')}" 
               fill="url(#radarGradient)" 
               stroke="#0284c7" 
               stroke-width="2.5" 
               filter="url(#radarGlow)" />
    `;

    // 4. Draw interactive data dots
    pointCoords.forEach(pt => {
      const dotColor = pt.domain.score >= 65 ? '#ef4444' : (pt.domain.score >= 35 ? '#f59e0b' : '#10b981');
      svgHtml += `
        <circle cx="${pt.x}" cy="${pt.y}" r="5" 
                fill="${dotColor}" 
                stroke="#ffffff" 
                stroke-width="2">
          <title>${pt.domain.label}: ${pt.domain.score}%</title>
        </circle>
      `;
    });

    svgHtml += `</svg>`;
    el.innerHTML = svgHtml;
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SVGRadarChart };
} else if (typeof window !== 'undefined') {
  window.SVGRadarChart = SVGRadarChart;
}
