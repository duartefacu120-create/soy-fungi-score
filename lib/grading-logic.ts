export type AssessmentInputs = {
    rainfall: number;      // 0: <50, 1: 50-65, 2: 65-80, 3: >80
    rainIntensity: number; // 0: <75%, 1: >=75%
    cropRotation: number;  // 0: No soy >2yrs, 1: Non-host, 2: Mono 1yr, 3: Mono >2yrs
    tillage: number;       // 0: Conventional, 1: No-till
    inoculum: number;      // 0: No, 1: Yes
    seedHealth: number;    // 0: Treated, 1: Untreated
    cycleLength: number;   // 0: Short, 1: Mid, 2: Long
    destination: number;   // 0: Grain, 1: Seed
    yieldPotential: number;// 0: 2000-2499, 1: 2500-2999, 2: >3000
    symptoms: number;      // 0: No, 1: Yes
};

export type AssessmentResult = {
    score: number;
    recommendation: string;
    color: "red" | "yellow" | "green";
};

export const calculateScore = (inputs: AssessmentInputs): AssessmentResult => {
    let score = 0;

    // 1. Rainfall (R3-R5)
    // Options: >80mm (10pts), 65-80mm (6pts), 50-65mm (2pts), <50mm (0.5pts)
    // Input: 0 (<50), 1 (50-65), 2 (65-80), 3 (>80)
    const rainfallPts = [0.5, 2, 6, 10];
    score += rainfallPts[inputs.rainfall] || 0;

    // 2. Rain Intensity
    // Options: >=75% (5pts), <75% (0pts)
    // Input: 0 (<75%), 1 (>=75%)
    const intensityPts = [0, 5];
    score += intensityPts[inputs.rainIntensity] || 0;

    // 3. Crop Rotation
    // Options: Mono >2yrs (5pts), Mono 1yr (3pts), Non-host (2pts), No soy >2yrs (0pts)
    // Input: 0 (No soy), 1 (Non-host), 2 (Classic/Mono 1yr), 3 (Mono >2yrs)
    // Mapping check: The user request lists "No soy >2yrs" as 0pts. 
    // Let's assume input order: 0: No soy >2yrs, 1: Non-host, 2: Mono 1yr, 3: Mono >2yrs
    const rotationPts = [0, 2, 3, 5];
    score += rotationPts[inputs.cropRotation] || 0;

    // 4. Tillage
    // No-till (4pts), Conventional (0pts)
    // Input: 0 (Conv), 1 (No-till)
    const tillagePts = [0, 4];
    score += tillagePts[inputs.tillage] || 0;

    // 5. Inoculum
    // Yes (6pts), No (0pts)
    // Input: 0 (No), 1 (Yes)
    const inoculumPts = [0, 6];
    score += inoculumPts[inputs.inoculum] || 0;

    // 6. Seed Health
    // Untreated (3pts), Treated (0pts)
    // Input: 0 (Treated), 1 (Untreated)
    const seedPts = [0, 3];
    score += seedPts[inputs.seedHealth] || 0;

    // 7. Cycle Length
    // Long >145d (4pts), Mid 134-145d (3pts), Short <134d (2pts)
    // Input: 0 (Short), 1 (Mid), 2 (Long)
    const cyclePts = [2, 3, 4];
    score += cyclePts[inputs.cycleLength] || 0;

    // 8. Destination
    // Seed (5pts), Grain (0pts)
    // Input: 0 (Grain), 1 (Seed)
    const destPts = [0, 5];
    score += destPts[inputs.destination] || 0;

    // 9. Yield Potential
    // >3000 (4pts), 2500-2999 (3pts), 2000-2499 (1pts)
    // Input: 0 (2000-2499), 1 (2500-2999), 2 (>3000)
    const yieldPts = [1, 3, 4];
    score += yieldPts[inputs.yieldPotential] || 0;

    // 10. Symptoms
    // Yes (6pts), No (0pts)
    // Input: 0 (No), 1 (Yes)
    const symptomsPts = [0, 6];
    score += symptomsPts[inputs.symptoms] || 0;

    let recommendation = "";
    let color: AssessmentResult["color"] = "green";

    if (score >= 30) {
        recommendation = "Aplicar";
        color = "red";
    } else if (score >= 25) {
        recommendation = "Monitorear / Revisar Pronóstico";
        color = "yellow";
    } else {
        recommendation = "No Aplicar";
        color = "green";
    }

    return { score, recommendation, color };
};
